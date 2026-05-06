import { useState } from 'react';
import { signUpWithEmail, loginWithEmail, loginWithGoogle, mapAuthError } from '@/lib/auth';
import { BloomIcon } from './BloomIcons';

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
    } catch (err) {
      setError(mapAuthError((err as { code: string }).code));
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
    } catch (err) {
      const msg = mapAuthError((err as { code: string }).code);
      if (msg) setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(180deg, #FFF0F6 0%, #F4E4FF 100%)' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3" style={{ filter: 'drop-shadow(0 8px 16px rgba(255,105,180,0.25))' }}>
            🌸
          </div>
          <div className="text-xs font-bold tracking-widest mb-1" style={{ color: '#FF69B4', letterSpacing: '2px' }}>
            ✿ BLOOMFIT ✿
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#5A4A5C', letterSpacing: '-0.4px' }}>
            {mode === 'login' ? 'Let\'s bloom again' : 'Start blooming'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8E7B92' }}>
            {mode === 'login' ? 'Tu flor te extrañó 🌷' : 'Tu flor te está esperando 🌱'}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-6"
          style={{
            background: '#fff',
            boxShadow: '0 8px 32px rgba(255, 105, 180, 0.12)',
          }}
        >
          {/* Mode tabs */}
          <div
            className="flex rounded-2xl p-1 mb-6"
            style={{ background: '#FFF5F7' }}
          >
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className="flex-1 py-2 text-sm font-bold rounded-xl transition-all"
              style={{
                background: mode === 'login' ? '#fff' : 'transparent',
                color: mode === 'login' ? '#5A4A5C' : '#8E7B92',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(255,105,180,0.1)' : 'none',
              }}
            >
              Ingresar
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className="flex-1 py-2 text-sm font-bold rounded-xl transition-all"
              style={{
                background: mode === 'register' ? '#fff' : 'transparent',
                color: mode === 'register' ? '#5A4A5C' : '#8E7B92',
                boxShadow: mode === 'register' ? '0 2px 8px rgba(255,105,180,0.1)' : 'none',
              }}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-bold mb-2 ml-1 tracking-wider uppercase"
                style={{ color: '#FF69B4' }}
              >
                Email
              </label>
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                  background: '#fff',
                  boxShadow: '0 4px 14px rgba(255, 105, 180, 0.08)',
                  border: '2px solid #FFD4E0',
                }}
              >
                <BloomIcon name="mail" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  className="flex-1 text-sm font-semibold bg-transparent outline-none"
                  style={{ color: '#5A4A5C' }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-bold mb-2 ml-1 tracking-wider uppercase"
                style={{ color: '#FF69B4' }}
              >
                Contraseña
              </label>
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{
                  background: '#fff',
                  boxShadow: '0 4px 14px rgba(255, 105, 180, 0.08)',
                  border: '2px solid #FFD4E0',
                }}
              >
                <BloomIcon name="lock" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="flex-1 text-sm font-semibold bg-transparent outline-none"
                  style={{ color: '#5A4A5C' }}
                />
              </div>
            </div>

            {error && (
              <p
                className="text-xs rounded-2xl px-4 py-2 font-semibold"
                style={{ color: '#E05C6A', background: '#FFF0F2' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-bold text-sm rounded-2xl text-white active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: '#5A4A5C',
                boxShadow: '0 8px 18px rgba(90, 74, 92, 0.28)',
              }}
            >
              {loading ? '...' : mode === 'login' ? 'Ingresar ✿' : 'Crear cuenta ✿'}
            </button>
          </form>

          <div className="flex items-center my-5 gap-3">
            <div className="flex-1 h-px" style={{ background: '#FFD4E0' }} />
            <span className="text-xs font-bold" style={{ color: '#8E7B92' }}>o continúa con</span>
            <div className="flex-1 h-px" style={{ background: '#FFD4E0' }} />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: '#fff',
              boxShadow: '0 4px 14px rgba(255, 105, 180, 0.08)',
              border: '2px solid #FFD4E0',
              color: '#5A4A5C',
            }}
          >
            <GoogleIcon />
            Google
          </button>
        </div>

        {/* Footer link */}
        <div className="text-center mt-6 text-sm" style={{ color: '#8E7B92' }}>
          {mode === 'login' ? (
            <>
              ¿Primera vez?{' '}
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className="font-bold"
                style={{ color: '#FF69B4' }}
              >
                Plant tu primera flor →
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="font-bold"
                style={{ color: '#FF69B4' }}
              >
                Ingresar →
              </button>
            </>
          )}
        </div>
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
