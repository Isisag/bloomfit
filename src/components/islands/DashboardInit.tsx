import { useEffect } from 'react';
import { onAuthStateChanged, auth } from '@/lib/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardInit() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && !snap.data().onboardingCompleted) {
        window.location.href = '/onboarding';
      }
    });
    return unsub;
  }, []);

  return null;
}
