import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export { onAuthStateChanged, auth };

export const googleProvider = new GoogleAuthProvider();

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(credential.user);
  return credential.user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function loginWithGoogle(): Promise<{ user: User; isNew: boolean }> {
  const credential = await signInWithPopup(auth, googleProvider);
  const isNew = await createUserDocument(credential.user);
  return { user: credential.user, isNew };
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

// Returns true if the document was just created (new user), false if already existed
async function createUserDocument(user: User): Promise<boolean> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      theme: 'sakura',
      flowerConfig: {
        base: 'basic',
        stem: 'basic',
        leaves: 'basic',
        petals: 'basic',
        face: 'basic',
        accessories: [],
      },
      unlockedParts: [],
      soundEnabled: true,
      onboardingCompleted: false,
    });
    return true;
  }
  return false;
}

export function mapAuthError(code: string): string {
  const errors: Record<string, string> = {
    'auth/user-not-found': 'No encontramos una cuenta con ese email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Email o contraseña incorrectos',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/invalid-email': 'El email no es válido',
    'auth/too-many-requests': 'Demasiados intentos. Intentá más tarde',
    'auth/popup-closed-by-user': '',
    'auth/cancelled-popup-request': '',
  };
  return errors[code] ?? 'Ocurrió un error. Intentá de nuevo';
}
