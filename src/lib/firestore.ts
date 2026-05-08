import {
  doc, getDoc, collection, query,
  where, orderBy, limit, getDocs,
  addDoc, updateDoc, increment,
  Timestamp, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { ThemeName } from './themes';

export interface UserProfile {
  uid: string;
  displayName: string;
  theme: ThemeName;
  flowerConfig: {
    base: string;
    stem: string;
    leaves: string;
    petals: string;
    face: string;
    accessories: string[];
  };
}

export interface Goal {
  goalId: string;
  type: 'weekly' | 'monthly';
  metric: 'count' | 'minutes';
  target: number;
  current: number;
  isActive: boolean;
  createdAt?: Timestamp;
  lastReset?: Timestamp;
}

export interface Workout {
  workoutId: string;
  type: string;
  duration: number;
  date: Timestamp;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function getActiveGoals(uid: string): Promise<Goal[]> {
  const q = query(
    collection(db, 'users', uid, 'goals'),
    where('isActive', '==', true),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ goalId: d.id, ...d.data() } as Goal));
}

export async function getRecentWorkouts(uid: string, count = 5): Promise<Workout[]> {
  const q = query(
    collection(db, 'users', uid, 'workouts'),
    orderBy('date', 'desc'),
    limit(count),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ workoutId: d.id, ...d.data() } as Workout));
}

export async function saveWorkout(
  uid: string,
  data: { type: string; duration: number; date: Timestamp; mood?: string },
): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'workouts'), data);
  return ref.id;
}

export async function updateGoalProgress(uid: string, minutes: number): Promise<void> {
  const goals = await getActiveGoals(uid);
  await Promise.all(
    goals.map((goal) => {
      const delta = goal.metric === 'count' ? 1 : minutes;
      return updateDoc(doc(db, 'users', uid, 'goals', goal.goalId), {
        current: increment(delta),
      });
    }),
  );
}

export async function checkAndResetGoals(uid: string): Promise<void> {
  const goals = await getActiveGoals(uid);
  const now = new Date();

  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  const dow = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() - (dow === 0 ? 6 : dow - 1));

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  await Promise.all(
    goals.map((goal) => {
      const resetBoundary = goal.type === 'weekly' ? weekStart : monthStart;
      const lastReset = goal.lastReset?.toDate() ?? goal.createdAt?.toDate() ?? new Date(0);
      if (lastReset < resetBoundary && goal.current > 0) {
        return updateDoc(doc(db, 'users', uid, 'goals', goal.goalId), {
          current: 0,
          lastReset: Timestamp.fromDate(resetBoundary),
        });
      }
      return Promise.resolve();
    }),
  );
}

export async function createGoal(
  uid: string,
  data: { type: 'weekly' | 'monthly'; metric: 'count' | 'minutes'; target: number },
): Promise<void> {
  const existing = await getActiveGoals(uid);
  if (existing.some((g) => g.type === data.type)) {
    throw new Error(`Ya tenés una meta ${data.type === 'weekly' ? 'semanal' : 'mensual'} activa.`);
  }
  await addDoc(collection(db, 'users', uid, 'goals'), {
    ...data,
    current: 0,
    isActive: true,
    createdAt: serverTimestamp(),
    lastReset: serverTimestamp(),
  });
}

export async function deactivateGoal(uid: string, goalId: string): Promise<void> {
  await updateDoc(doc(db, 'users', uid, 'goals', goalId), { isActive: false });
}

export async function updateGoal(uid: string, goalId: string, target: number): Promise<void> {
  await updateDoc(doc(db, 'users', uid, 'goals', goalId), { target });
}
