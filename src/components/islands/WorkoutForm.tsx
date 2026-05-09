import { useState, useEffect } from 'react';
import { onAuthStateChanged, auth } from '@/lib/auth';
import { saveWorkout, updateGoalProgress } from '@/lib/firestore';
import { playSound } from '@/lib/sounds';
import { Timestamp } from 'firebase/firestore';
import KawaiiFlower from './KawaiiFlower';
import { BloomIcon } from './BloomIcons';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C2 = {
  bg: '#FFF5F7',
  ink: '#5A4A5C', inkSoft: '#7A6880',
  pink: '#FFB7C5', pinkDeep: '#FF8FAB', pinkSoft: '#FFD4E0',
  lavenderSoft: '#EBDDFC', skySoft: '#DCEBFA', mintSoft: '#DEF5E6',
  butter: '#FFF4C3', peachSoft: '#FFE0CC', butterSoft: '#FFF1B8',
  shadowSoft: '0 4px 14px rgba(180,120,160,0.08)',
  shadowDark: '0 8px 18px rgba(90,74,92,0.28)',
  shadowCard: '0 6px 20px rgba(180,120,160,0.1)',
};
const FONT = `'Quicksand','Nunito',-apple-system,sans-serif`;

// ─── Icon palette ─────────────────────────────────────────────────────────────
const IP = {
  pinkMid: '#FFB7C5', pinkDeep: '#FF8FAB', pinkSoft: '#FFD4E0',
  lavMid: '#D5BDF5', lavDeep: '#B89BE8', lavSoft: '#EBDDFC',
  skyMid: '#B6D8F5', skyDeep: '#7FB0DB', skySoft: '#D8EBFC',
  mintMid: '#A8DEBA', mintDeep: '#6FBF8E',
  butterMid: '#FFE38A', butterSoft: '#FFF1B8',
  peachMid: '#FFC299', peachDeep: '#E89968', peachSoft: '#FFE0CC',
  cream: '#FFF8EE', white: '#FFFFFF', stroke: '#4A3D4D',
  ink: '#5A4A5C',
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconTimer({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="13" r="8" fill={IP.lavSoft} stroke={IP.stroke} strokeWidth="1.4" />
      <rect x="10" y="2.5" width="4" height="2" rx="0.6" fill={IP.lavMid} stroke={IP.stroke} strokeWidth="1.2" />
      <path d="M12 13 V8.5 M12 13 L15 14.5" stroke={IP.stroke} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="13" r="0.9" fill={IP.pinkDeep} />
    </svg>
  );
}

function IconDrop({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 3 Q5 11 5 15 Q5 20 12 20 Q19 20 19 15 Q19 11 12 3 Z"
        fill={IP.skyMid} stroke={IP.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <ellipse cx="9.5" cy="13" rx="1.4" ry="2" fill={IP.white} opacity="0.7" />
    </svg>
  );
}

function IconCheck({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={IP.mintMid} stroke={IP.stroke} strokeWidth="1.4" />
      <path d="M7.5 12.5 L10.5 15.5 L16.5 9" stroke={IP.white} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// Workout type icons (matching icons.jsx)
function TypeIcon({ type, size = 28 }: { type: string; size?: number }) {
  const icons: Record<string, React.ReactElement> = {
    yoga: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="5" r="2.5" fill={IP.lavMid} stroke={IP.stroke} strokeWidth="1.3" />
        <path d="M12 7.5 V13" stroke={IP.stroke} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 11 Q8 10 12 11 Q16 10 19 11" stroke={IP.lavDeep} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M6 19 Q12 14 18 19" stroke={IP.stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <ellipse cx="12" cy="20.5" rx="9" ry="1.2" fill={IP.lavSoft} stroke={IP.stroke} strokeWidth="1.2" />
      </svg>
    ),
    cardio: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 20 Q4 14 4 9 Q4 5 8 5 Q10.5 5 12 7.5 Q13.5 5 16 5 Q20 5 20 9 Q20 14 12 20 Z"
          fill={IP.pinkMid} stroke={IP.stroke} strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M7 10 H10 L11 8 L13 13 L14 10 H17" stroke={IP.white} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    strength: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <rect x="2" y="9" width="3" height="6" rx="1" fill={IP.skyMid} stroke={IP.stroke} strokeWidth="1.3" />
        <rect x="19" y="9" width="3" height="6" rx="1" fill={IP.skyMid} stroke={IP.stroke} strokeWidth="1.3" />
        <rect x="5" y="10" width="2" height="4" rx="0.5" fill={IP.skyDeep} stroke={IP.stroke} strokeWidth="1.1" />
        <rect x="17" y="10" width="2" height="4" rx="0.5" fill={IP.skyDeep} stroke={IP.stroke} strokeWidth="1.1" />
        <rect x="6.5" y="11" width="11" height="2" rx="0.6" fill={IP.cream} stroke={IP.stroke} strokeWidth="1.2" />
      </svg>
    ),
    stretching: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="8" cy="6" r="2.2" fill={IP.mintMid} stroke={IP.stroke} strokeWidth="1.3" />
        <path d="M8 8 Q9 12 14 13 Q19 14 20 18" stroke={IP.stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M8 8 V14 L5 19" stroke={IP.stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M14 13 V19" stroke={IP.stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    hiit: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M13 2 L5 13 H11 L9 22 L19 10 H13 Z"
          fill={IP.peachMid} stroke={IP.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    walking: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="14" cy="4.5" r="2.2" fill={IP.butterMid} stroke={IP.stroke} strokeWidth="1.3" />
        <path d="M14 7 L11 12 L8 14 M11 12 L13 16 L11 21 M13 16 L17 18" stroke={IP.stroke} strokeWidth="1.7" strokeLinecap="round" fill="none" />
        <path d="M7 21 L8 14" stroke={IP.stroke} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    other: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z"
          fill={IP.butterMid} stroke={IP.stroke} strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[type] ?? icons.other;
}

// Mood face icons (matching icons.jsx)
function MoodFaceIcon({ name, size = 32 }: { name: string; size?: number }) {
  const faces: Record<string, React.ReactElement> = {
    faceSleep: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill={IP.lavSoft} stroke={IP.stroke} strokeWidth="1.4" />
        <path d="M7 11 Q9 12 11 11 M13 11 Q15 12 17 11" stroke={IP.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M9 16 Q12 17 15 16" stroke={IP.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    ),
    faceCalm: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill={IP.skySoft} stroke={IP.stroke} strokeWidth="1.4" />
        <circle cx="9" cy="11" r="0.9" fill={IP.stroke} />
        <circle cx="15" cy="11" r="0.9" fill={IP.stroke} />
        <path d="M9 15 Q12 16.5 15 15" stroke={IP.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    ),
    faceHappy: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill={IP.butterSoft} stroke={IP.stroke} strokeWidth="1.4" />
        <path d="M8 10 Q9 8.5 10 10 M14 10 Q15 8.5 16 10" stroke={IP.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M8 14 Q12 18 16 14" stroke={IP.stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="7.5" cy="13" rx="1.2" ry="0.8" fill={IP.pinkMid} opacity="0.7" />
        <ellipse cx="16.5" cy="13" rx="1.2" ry="0.8" fill={IP.pinkMid} opacity="0.7" />
      </svg>
    ),
    faceStar: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill={IP.peachSoft} stroke={IP.stroke} strokeWidth="1.4" />
        <path d="M9 11 L7 9 M9 11 L11 9 M9 11 L9 13 M9 11 L7 13 M9 11 L11 13" stroke={IP.peachDeep} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M15 11 L13 9 M15 11 L17 9 M15 11 L15 13 M15 11 L13 13 M15 11 L17 13" stroke={IP.peachDeep} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M8 14 Q12 18 16 14" stroke={IP.stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
    ),
    faceLove: (
      <svg width={size} height={size} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill={IP.pinkSoft} stroke={IP.stroke} strokeWidth="1.4" />
        <path d="M9 10 Q8 8 7 10 Q7 11 9 12 Q11 11 11 10 Q10 8 9 10" fill={IP.pinkDeep} stroke={IP.stroke} strokeWidth="0.9" />
        <path d="M15 10 Q14 8 13 10 Q13 11 15 12 Q17 11 17 10 Q16 8 15 10" fill={IP.pinkDeep} stroke={IP.stroke} strokeWidth="0.9" />
        <path d="M9 14.5 Q12 17 15 14.5" stroke={IP.stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  };
  return faces[name] ?? faces.faceHappy;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const WORKOUT_TYPES = [
  { id: 'yoga',       label: 'Yoga',      bg: C2.lavenderSoft },
  { id: 'cardio',     label: 'Cardio',    bg: C2.pinkSoft },
  { id: 'strength',   label: 'Fuerza',    bg: C2.skySoft },
  { id: 'stretching', label: 'Stretching',bg: C2.mintSoft },
  { id: 'hiit',       label: 'HIIT',      bg: C2.peachSoft },
  { id: 'walking',    label: 'Caminata',  bg: C2.butterSoft },
];

const MOODS = [
  { id: 'tired',  icon: 'faceSleep', label: 'Cansada' },
  { id: 'calm',   icon: 'faceCalm',  label: 'Tranquila' },
  { id: 'good',   icon: 'faceHappy', label: 'Bien' },
  { id: 'great',  icon: 'faceStar',  label: '¡Genial!' },
  { id: 'loved',  icon: 'faceLove',  label: '¡Lo amé!' },
];

const DURATION_CHIPS = [15, 30, 45];

// ─── Main component ────────────────────────────────────────────────────────────
export default function WorkoutForm() {
  const [uid, setUid] = useState<string | null>(null);
  const [workoutType, setWorkoutType] = useState('cardio');
  const [duration, setDuration] = useState(30);
  const [mood, setMood] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        const params = new URLSearchParams(window.location.search);
        const d = parseInt(params.get('duration') ?? '', 10);
        if (!isNaN(d) && d > 0) setDuration(d);
      } else {
        window.location.href = '/login';
      }
    });
    return unsub;
  }, []);

  async function handleSave() {
    if (!uid) return;
    setSaving(true);
    setError('');
    try {
      await saveWorkout(uid, { type: workoutType, duration, date: Timestamp.now(), mood: mood ?? undefined });
      await updateGoalProgress(uid, duration);
      await playSound('complete');
      window.location.href = '/?saved=1';
    } catch {
      setError('No se pudo guardar. Intenta de nuevo.');
      setSaving(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C2.bg, fontFamily: FONT }}>
      <div style={{ maxWidth: 375, margin: '0 auto', minHeight: '100vh', paddingBottom: 32 }}>

        {/* Header */}
        <div style={{ padding: '52px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" aria-label="Volver" style={{ display: 'flex', textDecoration: 'none' }}>
            <BloomIcon name="back" size={40} />
          </a>
          <div style={{ fontSize: 14, fontWeight: 800, color: C2.ink }}>Log workout</div>
          <div style={{ width: 40 }} />
        </div>

        {/* Hero card */}
        <div style={{
          margin: '14px 20px 0',
          background: `linear-gradient(135deg, ${C2.butter} 0%, ${C2.pink} 100%)`,
          borderRadius: 22, padding: '18px 16px 16px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -16, right: -10, pointerEvents: 'none' }}>
            <KawaiiFlower size={86} faceVariant="kissy" bouncy={false}
              petalColor="#FFB7C5" petalDeep="#FF8FAB" centerColor="#FFF4C3" />
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C2.ink, letterSpacing: '-0.5px' }}>
            ¡Buen trabajo!
          </div>
          <div style={{ fontSize: 13, color: C2.ink, opacity: 0.8, marginTop: 4, maxWidth: 220, lineHeight: 1.4 }}>
            Cuéntame qué hicimos — tu flor quiere saber
          </div>
        </div>

        {/* Workout type */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C2.inkSoft, marginBottom: 10, letterSpacing: '0.6px' }}>
            ¿QUÉ HICISTE?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {WORKOUT_TYPES.map((t) => {
              const selected = workoutType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setWorkoutType(t.id)}
                  style={{
                    background: '#fff', borderRadius: 16, padding: '12px 8px',
                    textAlign: 'center', border: 'none', cursor: 'pointer', position: 'relative',
                    outline: selected ? `2.5px solid ${C2.pinkDeep}` : '2px solid #fff',
                    boxShadow: selected ? '0 6px 14px rgba(255,105,180,0.18)' : C2.shadowSoft,
                    transition: 'all 0.2s', fontFamily: FONT,
                  }}
                >
                  {selected && (
                    <div style={{ position: 'absolute', top: -7, right: -7, zIndex: 1 }}>
                      <IconCheck size={20} />
                    </div>
                  )}
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, background: t.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto',
                  }}>
                    <TypeIcon type={t.id} size={26} />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C2.ink, marginTop: 6 }}>{t.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C2.inkSoft, marginBottom: 10, letterSpacing: '0.6px' }}>
            DURACIÓN
          </div>
          <div style={{ background: '#fff', borderRadius: 20, padding: '14px 16px', boxShadow: C2.shadowSoft }}>
            {/* Badge + stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, background: C2.lavenderSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <IconTimer size={24} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: C2.inkSoft, fontWeight: 800 }}>MINUTOS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                  <button
                    aria-label="Reducir duración"
                    onClick={() => setDuration((d) => Math.max(1, d - 5))}
                    style={{
                      width: 44, height: 44, borderRadius: '50%', border: 'none',
                      background: C2.pinkSoft, color: C2.pinkDeep, fontSize: 18, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', lineHeight: '1', padding: 0, fontFamily: FONT,
                      flexShrink: 0,
                    }}
                  >−</button>
                  <span style={{ fontSize: 30, fontWeight: 800, color: C2.ink, lineHeight: 1, minWidth: 36, textAlign: 'center' }}>
                    {duration}
                  </span>
                  <button
                    aria-label="Aumentar duración"
                    onClick={() => setDuration((d) => Math.min(240, d + 5))}
                    style={{
                      width: 44, height: 44, borderRadius: '50%', border: 'none',
                      background: C2.pinkSoft, color: C2.pinkDeep, fontSize: 18, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', lineHeight: '1', padding: 0, fontFamily: FONT,
                      flexShrink: 0,
                    }}
                  >+</button>
                  <span style={{ fontSize: 14, color: C2.inkSoft, fontWeight: 600 }}>min</span>
                </div>
              </div>
            </div>
            {/* Quick-set chips — second row, full width */}
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {DURATION_CHIPS.map((q) => (
                <button
                  key={q}
                  onClick={() => setDuration(q)}
                  style={{
                    padding: '6px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: duration === q ? C2.pinkSoft : '#FFF5F7',
                    color: duration === q ? C2.pinkDeep : C2.inkSoft,
                    fontSize: 12, fontWeight: 800, fontFamily: FONT,
                    transition: 'all 0.2s',
                  }}
                >{q} min</button>
              ))}
            </div>
          </div>
        </div>

        {/* Mood */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C2.inkSoft, marginBottom: 10, letterSpacing: '0.6px' }}>
            ¿CÓMO TE SIENTES?
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {MOODS.map((m) => {
              const selected = mood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMood(selected ? null : m.id)}
                  title={m.label}
                  style={{
                    width: 52, height: 52, borderRadius: 16, border: 'none', cursor: 'pointer',
                    background: selected ? C2.ink : '#fff',
                    boxShadow: selected ? '0 6px 14px rgba(90,74,92,0.25)' : C2.shadowSoft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: selected ? 'translateY(-2px) scale(1.05)' : 'none',
                    transition: 'all 0.2s', padding: 0,
                  }}
                >
                  <MoodFaceIcon name={m.icon} size={32} />
                </button>
              );
            })}
          </div>
          {mood && (
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: C2.inkSoft, fontWeight: 700 }}>
              {MOODS.find((m) => m.id === mood)?.label}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: '#FFE4EC', borderRadius: 14, fontSize: 13, color: C2.pinkDeep, fontWeight: 700 }}>
            {error}
          </div>
        )}

        {/* Save button */}
        <div style={{ margin: '24px 20px 0' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '17px 26px', borderRadius: 22, border: 'none', cursor: saving ? 'default' : 'pointer',
              background: C2.ink, color: '#fff', fontSize: 16, fontWeight: 700,
              fontFamily: FONT, boxShadow: C2.shadowDark, letterSpacing: '0.2px',
              opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s',
            }}
          >
            <IconDrop size={20} />
            {saving ? 'Guardando…' : 'Guardar y regar la flor'}
          </button>
        </div>

      </div>
    </div>
  );
}
