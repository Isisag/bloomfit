import { useState } from 'react';
import { signUpWithEmail, loginWithEmail, loginWithGoogle, mapAuthError } from '@/lib/auth';

type Mode = 'login' | 'register';

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await signUpWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      window.location.href = '/';
    } catch (err: any) {
      setError(mapAuthError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      window.location.href = '/';
    } catch (err: any) {
      const msg = mapAuthError(err.code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-rose-100 p-8">

        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🌸</div>
          <h1 className="text-2xl font-bold text-rose-400">BloomFit</h1>
          <p className="text-sm text-rose-300 mt-1">Tu flor crece cuando tú creces</p>
        </div>

        <div className="flex rounded-2xl bg-rose-50 p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-rose-500 shadow-sm'
                : 'text-rose-300 hover:text-rose-400'
            }`}
          >
            Ingresar
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-rose-500 shadow-sm'
                : 'text-rose-300 hover:text-rose-400'
            }`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-rose-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-2xl border border-rose-100 bg-rose-50 text-rose-800 placeholder:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-rose-400 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl border border-rose-100 bg-rose-50 text-rose-800 placeholder:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-400 hover:bg-rose-500 text-white font-medium rounded-2xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '...' : mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-rose-100" />
          <span className="px-3 text-xs text-rose-200">o</span>
          <div className="flex-1 border-t border-rose-100" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3 border border-rose-100 bg-white hover:bg-rose-50 text-rose-400 font-medium rounded-2xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          <GoogleIcon />
          Continuar con Google
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
