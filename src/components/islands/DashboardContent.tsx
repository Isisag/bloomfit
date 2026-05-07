import { useState, useEffect } from 'react';
import { onAuthStateChanged, auth } from '@/lib/auth';
import { getUserProfile, getActiveGoals, getRecentWorkouts } from '@/lib/firestore';
import type { UserProfile, Goal, Workout } from '@/lib/firestore';
import KawaiiFlower from './KawaiiFlower';
import { BloomIcon, IconBadge } from './BloomIcons';

// Theme-specific dashboard colors matching Claude Design THEMES object
const DASH_THEMES = {
  sakura:   { bgTop: '#FFF0F6', bg: '#FFF5F7', soft: '#FFD4E0', mid: '#FFB7C5', deep: '#FF69B4', flowerPetal: '#FFB7C5', flowerDeep: '#FF8FAB', flowerCenter: '#FFF4C3', motivA: '#E0C3FC', motivB: '#FFB7C5' },
  lavender: { bgTop: '#F0E5FF', bg: '#F6F0FF', soft: '#E0D4F5', mid: '#E0C3FC', deep: '#9B7BD9', flowerPetal: '#E0C3FC', flowerDeep: '#B89BE8', flowerCenter: '#FFF4C3', motivA: '#C3E0FC', motivB: '#E0C3FC' },
  sky:      { bgTop: '#E5F2FF', bg: '#F0F7FF', soft: '#D4E8F8', mid: '#C3E0FC', deep: '#5B95D9', flowerPetal: '#C3E0FC', flowerDeep: '#9BC4F0', flowerCenter: '#FFF4C3', motivA: '#C3FCD8', motivB: '#C3E0FC' },
  cream:    { bgTop: '#FFF8E8', bg: '#FFFAF0', soft: '#FFE9C4', mid: '#FFE5B5', deep: '#D9A24A', flowerPetal: '#FFE5B5', flowerDeep: '#E5C690', flowerCenter: '#FFB7C5', motivA: '#FFB7C5', motivB: '#FFE5B5' },
};

const WORKOUT_ICON_NAMES: Record<string, string> = {
  strength: 'strength', cardio: 'cardio', yoga: 'yoga',
  stretching: 'stretch', hiit: 'hiit', walking: 'walk', other: 'sparkle',
};

const MOTIVATION = [
  '¡Tu flor te está esperando! 🌱',
  'Cada entrenamiento la hace crecer ✨',
  'Pequeños pasos, grandes blooms 🌸',
  'Tú puedes, tu flor lo sabe 💪',
  'Hoy es un buen día para florecer 🌷',
];

function todayLabel(): string {
  return new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function ProgressRing({ pct, size = 60, deep }: { pct: number; size?: number; deep: string }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(pct, 100);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#FFD4E0" strokeWidth="5" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={deep} strokeWidth="5" fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - clamped / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="800" fill="#5A4A5C" fontFamily="Quicksand, Nunito, sans-serif">
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

function WorkoutRow({ workout, bg, deep }: { workout: Workout; bg: string; deep: string }) {
  const iconName = WORKOUT_ICON_NAMES[workout.type] ?? 'sparkle';
  const date = workout.date?.toDate?.() ?? new Date();
  const isToday = new Date().toDateString() === date.toDateString();
  const timeLabel = isToday
    ? `Hoy, ${date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`
    : date.toLocaleDateString('es', { weekday: 'short', day: 'numeric' });

  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{ background: '#fff', boxShadow: '0 4px 14px rgba(255,105,180,0.08)' }}
    >
      <IconBadge name={iconName} size={38} bg={`${bg}80`} radius={12} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate capitalize" style={{ color: '#5A4A5C' }}>
          {workout.type}
        </div>
        <div className="text-xs" style={{ color: '#8E7B92' }}>{timeLabel}</div>
      </div>
      <div
        className="text-xs font-bold px-3 py-1 rounded-xl"
        style={{ background: `${bg}40`, color: deep }}
      >
        {workout.duration} min
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: `linear-gradient(180deg, #FFF0F6 0%, #FFF5F7 100%)` }}
    >
      <div className="text-4xl" style={{ animation: 'flowerBob 1.2s ease-in-out infinite' }}>🌸</div>
    </div>
  );
}

export default function DashboardContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const [p, g, w] = await Promise.all([
          getUserProfile(user.uid),
          getActiveGoals(user.uid),
          getRecentWorkouts(user.uid, 3),
        ]);
        setProfile(p);
        setGoals(g);
        setWorkouts(w);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  if (loading) return <Skeleton />;

  const themeName = (profile?.theme ?? 'sakura') as keyof typeof DASH_THEMES;
  const T = DASH_THEMES[themeName] ?? DASH_THEMES.sakura;

  // Primary active goal (weekly preferred)
  const primaryGoal = goals.find((g) => g.type === 'weekly') ?? goals[0] ?? null;
  const pct = primaryGoal ? Math.round((primaryGoal.current / primaryGoal.target) * 100) : 0;
  const goalLabel = primaryGoal
    ? `${primaryGoal.current} de ${primaryGoal.target} ${primaryGoal.metric === 'count' ? 'sesiones' : 'minutos'}`
    : 'Sin meta activa';

  const motivation = MOTIVATION[new Date().getDay() % MOTIVATION.length];
  const displayName = profile?.displayName || 'amiga';

  return (
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(180deg, ${T.bgTop} 0%, ${T.bg} 30%, ${T.bg} 100%)` }}
    >
    <div className="min-h-screen flex flex-col max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-12 pb-2">
        <div>
          <div className="text-xs font-bold" style={{ color: '#8E7B92' }}>{todayLabel()}</div>
          <h1 className="text-2xl font-bold mt-1" style={{ color: '#5A4A5C', letterSpacing: '-0.4px' }}>
            ¡Hola, {displayName}!{' '}
            <span style={{ display: 'inline-block', animation: 'wavingHand 2s ease-in-out infinite' }}>👋</span>
          </h1>
        </div>
        <button
          className="relative flex items-center justify-center rounded-2xl"
          style={{ width: 40, height: 40, background: '#fff', boxShadow: '0 4px 14px rgba(255,105,180,0.1)' }}
          aria-label="Notificaciones"
        >
          <BloomIcon name="bell" size={22} />
        </button>
      </div>

      {/* Motivation card */}
      <div
        className="mx-5 mt-3 rounded-2xl px-4 py-4 flex items-center gap-3 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${T.motivA} 0%, ${T.motivB} 100%)`,
          boxShadow: `0 8px 20px ${T.motivA}66`,
        }}
      >
        <div style={{ position: 'absolute', right: -16, top: -16, fontSize: 72, opacity: 0.2 }}>✨</div>
        <IconBadge name="petal" size={44} bg="rgba(255,255,255,0.4)" radius={14} />
        <div style={{ position: 'relative' }}>
          <div className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '0.3px' }}>
            DAILY BLOOM
          </div>
          <div className="text-sm font-bold mt-1 leading-snug" style={{ color: '#fff' }}>
            {motivation}
          </div>
        </div>
      </div>

      {/* Hero flower */}
      <div
        className="flex justify-center mt-2 relative"
        style={{ filter: `drop-shadow(0 14px 24px ${T.deep}33)` }}
      >
        <KawaiiFlower
          size={180}
          faceVariant="happy"
          petalColor={T.flowerPetal}
          petalDeep={T.flowerDeep}
          centerColor={T.flowerCenter}
        />
        {pct > 0 && (
          <div
            className="absolute top-4 left-16 text-xs font-bold px-3 py-1 rounded-2xl"
            style={{
              background: '#fff',
              color: T.deep,
              boxShadow: '0 4px 14px rgba(255,105,180,0.12)',
              animation: 'flowerBob 3.6s ease-in-out infinite reverse',
            }}
          >
            🔥 {pct}% esta semana
          </div>
        )}
      </div>

      {/* Weekly progress */}
      <div
        className="mx-5 mt-2 rounded-2xl px-4 py-4 flex items-center gap-4"
        style={{ background: '#fff', boxShadow: '0 6px 20px rgba(180,120,160,0.1)' }}
      >
        <ProgressRing pct={pct} size={60} deep={T.deep} />
        <div className="flex-1">
          <div className="text-xs font-bold tracking-wide" style={{ color: '#8E7B92' }}>ESTA SEMANA</div>
          <div className="text-base font-bold mt-1" style={{ color: '#5A4A5C' }}>{goalLabel}</div>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: T.soft }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(pct, 100)}%`,
                background: `linear-gradient(90deg, ${T.mid}, ${T.deep})`,
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="mx-5 mt-4 flex gap-3">
        <a
          href="/workout"
          className="flex-1 flex items-center justify-center gap-2 font-bold text-sm text-white rounded-2xl py-4"
          style={{ background: '#5A4A5C', boxShadow: '0 8px 18px rgba(90,74,92,0.28)', textDecoration: 'none' }}
        >
          <BloomIcon name="timer" size={18} />
          Timer
        </a>
        <a
          href="/workout/register"
          className="flex-1 flex items-center justify-center gap-2 font-bold text-sm rounded-2xl py-4"
          style={{ background: '#fff', boxShadow: '0 4px 14px rgba(255,105,180,0.1)', color: '#5A4A5C', textDecoration: 'none' }}
        >
          <BloomIcon name="plus" size={18} />
          Agregar
        </a>
      </div>

      {/* Recent workouts */}
      <div className="mx-5 mt-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold" style={{ color: '#5A4A5C' }}>Recientes</div>
          <a href="/workouts" className="text-xs font-bold" style={{ color: T.deep, textDecoration: 'none' }}>
            Ver todo →
          </a>
        </div>

        {workouts.length === 0 ? (
          <div
            className="rounded-2xl px-4 py-6 text-center"
            style={{ background: '#fff', boxShadow: '0 4px 14px rgba(255,105,180,0.08)' }}
          >
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-sm font-bold" style={{ color: '#5A4A5C' }}>Aún no hay entrenamientos</div>
            <div className="text-xs mt-1" style={{ color: '#8E7B92' }}>¡Tu primera sesión hará crecer la flor!</div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {workouts.map((w) => (
              <WorkoutRow key={w.workoutId} workout={w} bg={T.motivA} deep={T.deep} />
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
