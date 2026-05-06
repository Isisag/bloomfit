import { useEffect, useState } from 'react';
import { onAuthStateChanged, auth } from '@/lib/auth';

interface Props {
  redirectTo?: string;
  requireAuth?: boolean;
}

// Renders nothing — only handles client-side auth redirects.
// Use requireAuth=true (default) on protected pages.
// Use requireAuth=false on /login to redirect away if already authenticated.
export default function AuthGuard({ redirectTo, requireAuth = true }: Props) {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthState(user ? 'authenticated' : 'unauthenticated');
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (authState === 'loading') return;

    const destination = redirectTo ?? (requireAuth ? '/login' : '/');

    if (requireAuth && authState === 'unauthenticated') {
      window.location.href = destination;
    } else if (!requireAuth && authState === 'authenticated') {
      window.location.href = destination;
    }
  }, [authState, requireAuth, redirectTo]);

  return null;
}
