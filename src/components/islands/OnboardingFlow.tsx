import { useEffect, useState } from 'react';
import { type User, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, auth } from '@/lib/auth';
import { db } from '@/lib/firebase';

const THEMES = [
  { id: 'sakura',   label: 'Sakura',  emoji: '🌸', bg: 'bg-rose-100',   border: 'border-rose-300',   ring: 'ring-rose-300' },
  { id: 'lavender', label: 'Lavanda', emoji: '💜', bg: 'bg-violet-100', border: 'border-violet-300', ring: 'ring-violet-300' },
  { id: 'sky',      label: 'Cielo',   emoji: '💙', bg: 'bg-sky-100',    border: 'border-sky-300',    ring: 'ring-sky-300' },
  { id: 'cream',    label: 'Crema',   emoji: '🍦', bg: 'bg-amber-100',  border: 'border-amber-300',  ring: 'ring-amber-300' },
];

const POTS = [
  { id: 'basic',      label: 'Básica',   emoji: '🪴' },
  { id: 'round',      label: 'Redonda',  emoji: '🫙' },
  { id: 'terracotta', label: 'Terracota', emoji: '🏺' },
  { id: 'golden',     label: 'Dorada',   emoji: '✨' },
];

export default function OnboardingFlow() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState('sakura');
  const [potBase, setPotBase] = useState('basic');
  const [goalType, setGoalType] = useState<'weekly' | 'monthly'>('weekly');
  const [goalMetric, setGoalMetric] = useState<'count' | 'minutes'>('count');
  const [goalTarget, setGoalTarget] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists() && snap.data().onboardingCompleted) {
        window.location.href = '/';
        return;
      }
      setAuthUser(user);
      setDisplayName(user.displayName ?? '');
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleFinish() {
    if (!authUser) return;
    setSaving(true);
    setError('');
    try {
      await updateProfile(authUser, { displayName });
      await updateDoc(doc(db, 'users', authUser.uid), {
        displayName,
        theme,
        'flowerConfig.base': potBase,
        onboardingCompleted: true,
      });
      await addDoc(collection(db, 'users', authUser.uid, 'goals'), {
        type: goalType,
        metric: goalMetric,
        target: goalTarget,
        current: 0,
        isActive: true,
        createdAt: serverTimestamp(),
        lastReset: serverTimestamp(),
      });
      window.location.href = '/';
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="text-4xl animate-pulse">🌸</div>
      </div>
    );
  }

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      <div className="h-1.5 bg-rose-100">
        <div
          className="h-full bg-rose-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">

          {step === 0 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🌸</div>
              <h1 className="text-2xl font-bold text-rose-400 mb-2">¡Bienvenida a BloomFit!</h1>
              <p className="text-rose-300 text-sm mb-10">Tu flor crece cuando tú creces</p>
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 bg-rose-400 hover:bg-rose-500 text-white font-medium rounded-2xl transition-all active:scale-95"
              >
                Empezar
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-rose-400 mb-1">¿Cómo te llamas?</h2>
              <p className="text-rose-300 text-sm mb-6">Así te saludaré cada vez que entres</p>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-2xl border border-rose-100 bg-white text-rose-800 placeholder:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm mb-6"
                autoFocus
              />
              <button
                onClick={() => { if (displayName.trim()) setStep(2); }}
                disabled={!displayName.trim()}
                className="w-full py-3 bg-rose-400 hover:bg-rose-500 text-white font-medium rounded-2xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-rose-400 mb-1">Elegí tu tema</h2>
              <p className="text-rose-300 text-sm mb-6">Podés cambiarlo cuando quieras</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${t.bg} ${t.border} ${
                      theme === t.id ? `ring-2 ring-offset-2 ${t.ring}` : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-sm font-medium text-rose-600">{t.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 bg-rose-400 hover:bg-rose-500 text-white font-medium rounded-2xl transition-all active:scale-95"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-rose-400 mb-1">Elegí tu maceta</h2>
              <p className="text-rose-300 text-sm mb-6">Acá vivirá tu flor</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {POTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPotBase(p.id)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      potBase === p.id
                        ? 'bg-rose-100 border-rose-300 ring-2 ring-offset-2 ring-rose-300'
                        : 'bg-white border-rose-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl">{p.emoji}</span>
                    <span className="text-sm font-medium text-rose-600">{p.label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(4)}
                className="w-full py-3 bg-rose-400 hover:bg-rose-500 text-white font-medium rounded-2xl transition-all active:scale-95"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-rose-400 mb-1">Tu primera meta</h2>
              <p className="text-rose-300 text-sm mb-6">La podés ajustar cuando quieras</p>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs font-medium text-rose-400 mb-2">Período</p>
                  <div className="flex rounded-2xl bg-rose-100 p-1">
                    {(['weekly', 'monthly'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setGoalType(t)}
                        className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                          goalType === t
                            ? 'bg-white text-rose-500 shadow-sm'
                            : 'text-rose-300 hover:text-rose-400'
                        }`}
                      >
                        {t === 'weekly' ? 'Semanal' : 'Mensual'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-rose-400 mb-2">Mido por</p>
                  <div className="flex rounded-2xl bg-rose-100 p-1">
                    {(['count', 'minutes'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => { setGoalMetric(m); setGoalTarget(m === 'count' ? 3 : 60); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                          goalMetric === m
                            ? 'bg-white text-rose-500 shadow-sm'
                            : 'text-rose-300 hover:text-rose-400'
                        }`}
                      >
                        {m === 'count' ? 'Entrenamientos' : 'Minutos'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-rose-400 mb-2">Objetivo</p>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(Math.max(1, Number(e.target.value)))}
                    min={1}
                    max={goalMetric === 'count' ? 30 : 600}
                    className="w-full px-4 py-3 rounded-2xl border border-rose-100 bg-white text-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm"
                  />
                  <p className="text-xs text-rose-300 mt-1">
                    {goalTarget} {goalMetric === 'count' ? 'entrenamientos' : 'minutos'}{' '}
                    {goalType === 'weekly' ? 'esta semana' : 'este mes'}
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-50 rounded-xl px-3 py-2 mb-4">{error}</p>
              )}

              <button
                onClick={handleFinish}
                disabled={saving || goalTarget < 1}
                className="w-full py-3 bg-rose-400 hover:bg-rose-500 text-white font-medium rounded-2xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? '...' : '¡Comenzar!'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
