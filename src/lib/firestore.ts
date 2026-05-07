import {
  doc, getDoc, collection, query,
  where, orderBy, limit, getDocs,
  addDoc, updateDoc, increment,
} from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
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
