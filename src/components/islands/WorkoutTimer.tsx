import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import KawaiiFlower from './KawaiiFlower';
import { getMotivationalMessage } from '@/lib/messages';

// ─── Types ─────────────────────────────────────────────────────────────────────
type TimerState = 'ready' | 'running' | 'paused' | 'completed';

const MODES = [
  { id: 'session', label: 'Sesión', targetMs: 40 * 60 * 1000 },
  { id: 'quick',   label: 'Rápido', targetMs: 15 * 60 * 1000 },
  { id: 'free',    label: 'Libre',  targetMs: 0 },
] as const;
type ModeId = typeof MODES[number]['id'];

const LIBRE_PRESETS = [0, 5, 10, 15, 20, 30]; // 0 = sin límite

// ─── Design tokens ────────────────────────────────────────────────────────────
const C2 = {
  bg: '#FFF5F7', bgTop: '#FFF0F6',
  ink: '#5A4A5C', inkSoft: '#7A6880',
  pink: '#FFB7C5', pinkDeep: '#FF8FAB', pinkSoft: '#FFD4E0',
  shadowSoft: '0 4px 14px rgba(180,120,160,0.08)',
  shadowDark: '0 8px 18px rgba(90,74,92,0.28)',
};
const FONT = `'Quicksand','Nunito',-apple-system,sans-serif`;

// Icon palette (from icons.jsx)
const IP = {
  peachMid: '#FFC299', skyMid: '#B6D8F5', mintMid: '#A8DEBA',
  cream: '#FFF8EE', stroke: '#4A3D4D', white: '#FFFFFF',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(ms: number): string {
  const totalSec = Math.floor(Math.max(0, ms) / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Icons (from icons.jsx pastel system) ─────────────────────────────────────
function IconBack({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={IP.cream} stroke={IP.stroke} strokeWidth="1.4" />
      <path d="M14 7 L9 12 L14 17" stroke={IP.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function IconStop({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={IP.peachMid} stroke={IP.stroke} strokeWidth="1.4" />
      <rect x="8" y="8" width="8" height="8" rx="1.5" fill={IP.white} stroke={IP.stroke} strokeWidth="1.2" />
    </svg>
  );
}

function IconSkip({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={IP.skyMid} stroke={IP.stroke} strokeWidth="1.4" />
      <path d="M8 8 L13 12 L8 16 Z" fill={IP.white} stroke={IP.stroke} strokeWidth="1.1" strokeLinejoin="round" />
      <rect x="14" y="8" width="2" height="8" rx="0.8" fill={IP.white} stroke={IP.stroke} strokeWidth="1.1" />
    </svg>
  );
}

function IconCheck({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill={IP.mintMid} stroke={IP.stroke} strokeWidth="1.4" />
      <path d="M7.5 12.5 L10.5 15.5 L16.5 9" stroke={IP.white} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5 V19 M5 12 H19" stroke={IP.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Raw play/pause for the center ink button (no circle background)
function IconRawPlay() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24">
      <path d="M9 6 L18 12 L9 18 Z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}
function IconRawPause() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24">
      <rect x="7" y="6" width="3.5" height="12" rx="1.5" fill="#fff" />
      <rect x="13.5" y="6" width="3.5" height="12" rx="1.5" fill="#fff" />
    </svg>
  );
}

// ─── Control button wrappers ──────────────────────────────────────────────────
function CtrlBtn({ onClick, size, children, disabled = false, ariaLabel }: {
  onClick?: () => void; size: number; children: React.ReactNode; disabled?: boolean; ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={{
        width: size, height: size, borderRadius: '50%', border: 'none',
        background: '#fff', boxShadow: C2.shadowSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        transition: 'opacity 0.2s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function CenterBtn({ onClick, children, ariaLabel }: { onClick: () => void; children: React.ReactNode; ariaLabel: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 86, height: 86, borderRadius: '50%', border: 'none',
        background: C2.ink, boxShadow: '0 12px 28px rgba(90,74,92,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        cursor: 'pointer', flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ─── Timer ring SVG ───────────────────────────────────────────────────────────
function TimerRing({ progress, completed }: { progress: number; completed: boolean }) {
  const size = 260;
  const r = size / 2 - 18;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = c * (1 - clamped);
  const angle = 2 * Math.PI * clamped - Math.PI / 2;
  const dotX = cx + r * Math.cos(angle);
  const dotY = cy + r * Math.sin(angle);

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }} aria-hidden="true">
      <defs>
        <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C2.pink} />
          <stop offset="100%" stopColor={C2.pinkDeep} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} stroke={C2.pinkSoft} strokeWidth="14" fill="none" />
      <circle cx={cx} cy={cy} r={r - 18} fill="#fff" />
      <circle
        cx={cx} cy={cy} r={r}
        stroke={completed ? C2.pinkDeep : 'url(#timerGrad)'}
        strokeWidth="14" fill="none" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.15s linear' }}
      />
      {clamped > 0 && clamped < 1 && (
        <circle cx={dotX} cy={dotY} r={9} fill="#fff" stroke={C2.pinkDeep} strokeWidth="3" />
      )}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const x1 = cx + (r - 28) * Math.cos(a);
        const y1 = cy + (r - 28) * Math.sin(a);
        const x2 = cx + (r - 22) * Math.cos(a);
        const y2 = cy + (r - 22) * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C2.pinkSoft} strokeWidth="2" strokeLinecap="round" />;
      })}
    </svg>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function WorkoutTimer() {
  const [timerState, setTimerState] = useState<TimerState>('ready');
  const [modeId, setModeId] = useState<ModeId>('session');
  const [customMs, setCustomMs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [wakeLockUnavailable, setWakeLockUnavailable] = useState(false);

  const workerRef    = useRef<Worker | null>(null);
  const wakeLockRef  = useRef<WakeLockSentinel | null>(null);
  const stateRef     = useRef<TimerState>('ready');
  const targetMsRef  = useRef(0);

  const activeMode  = MODES.find((m) => m.id === modeId) ?? MODES[0];
  const targetMs    = modeId === 'free' ? customMs : activeMode.targetMs;
  const isCountdown = targetMs > 0;

  const isReady     = timerState === 'ready';
  const isRunning   = timerState === 'running';
  const isPaused    = timerState === 'paused';
  const isCompleted = timerState === 'completed';

  // Keep refs in sync after each commit (never during render)
  useEffect(() => { stateRef.current = timerState; });
  useEffect(() => { targetMsRef.current = targetMs; });

  // ── Worker ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (workerRef.current) return;
    const w = new Worker(
      new URL('../../workers/timer.worker.ts', import.meta.url),
      { type: 'module' },
    );
    w.addEventListener('message', (e: MessageEvent<{ elapsed: number }>) => {
      const { elapsed } = e.data;
      setElapsed(elapsed);
      const tMs = targetMsRef.current;
      if (tMs > 0 && stateRef.current === 'running' && elapsed >= tMs) {
        w.postMessage({ type: 'stop' });
        wakeLockRef.current?.release();
        setTimerState('completed');
      }
    });
    workerRef.current = w;
    return () => {
      w.postMessage({ type: 'reset' });
      w.terminate();
      workerRef.current = null;
    };
  }, []);

  // ── Wake Lock ──────────────────────────────────────────────────────────────
  async function requestWakeLock() {
    if (!('wakeLock' in navigator)) { setWakeLockUnavailable(true); return; }
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      wakeLockRef.current.addEventListener('release', () => { wakeLockRef.current = null; });
    } catch { setWakeLockUnavailable(true); }
  }

  function releaseWakeLock() {
    wakeLockRef.current?.release().catch(() => undefined);
    wakeLockRef.current = null;
  }

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === 'visible' && stateRef.current === 'running') requestWakeLock();
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // ── Controls ───────────────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    setElapsed(0);
    workerRef.current?.postMessage({ type: 'start' });
    await requestWakeLock();
    setTimerState('running');
  }, []);

  const handlePause = useCallback(() => {
    workerRef.current?.postMessage({ type: 'pause' });
    releaseWakeLock();
    setTimerState('paused');
  }, []);

  const handleResume = useCallback(async () => {
    workerRef.current?.postMessage({ type: 'resume' });
    await requestWakeLock();
    setTimerState('running');
  }, []);

  const handleStop = useCallback(() => {
    workerRef.current?.postMessage({ type: 'stop' });
    releaseWakeLock();
    setTimerState('completed');
  }, []);

  const handleReset = useCallback(() => {
    workerRef.current?.postMessage({ type: 'reset' });
    releaseWakeLock();
    setElapsed(0);
    setTimerState('ready');
  }, []);

  // Allows tab switching even when paused or completed
  const handleModeSwitch = useCallback((newId: ModeId) => {
    if (timerState === 'running') return;
    workerRef.current?.postMessage({ type: 'reset' });
    releaseWakeLock();
    setElapsed(0);
    setTimerState('ready');
    setModeId(newId);
  }, [timerState]);

  const handleRegister = useCallback(() => {
    const minutes = Math.max(1, Math.round(elapsed / 60_000));
    window.location.href = `/workout/register?duration=${minutes}`;
  }, [elapsed]);

  // ── Progress ───────────────────────────────────────────────────────────────
  let progress: number;
  if (isCountdown) {
    progress = targetMs > 0 ? 1 - Math.min(elapsed / targetMs, 1) : 1;
  } else {
    const cycleMs = 60_000;
    progress = (elapsed % cycleMs) / cycleMs;
  }
  const displayMs = isCountdown ? Math.max(0, targetMs - elapsed) : elapsed;

  // Stable messages — computed once per mount, not on every re-render
  const preMsg = useMemo(() => getMotivationalMessage('pre_workout'), []);
  const doneMsg = useMemo(() => getMotivationalMessage('post_workout'), []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C2.bgTop} 0%, ${C2.bg} 60%)` }}>
      <div
        style={{
          maxWidth: 375, margin: '0 auto', minHeight: '100vh',
          position: 'relative', display: 'flex', flexDirection: 'column',
          fontFamily: FONT, overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '52px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" aria-label="Volver" style={{ display: 'flex', textDecoration: 'none' }}>
            <IconBack size={40} />
          </a>
          <div style={{ fontSize: 14, fontWeight: 800, color: C2.ink }}>
            {isCompleted ? '¡Completado!' : 'Entrenamiento'}
          </div>
          {/* Direct register — skip timer flow */}
          <a
            href="/workout/register"
            aria-label="Agregar entrenamiento"
            style={{
              width: 40, height: 40, borderRadius: 14, background: '#fff',
              boxShadow: C2.shadowSoft, display: 'flex', alignItems: 'center',
              justifyContent: 'center', textDecoration: 'none',
            }}
          >
            <IconPlus />
          </a>
        </div>

        {/* Wake Lock notice */}
        {wakeLockUnavailable && (
          <div style={{
            margin: '8px 20px 0', padding: '8px 12px',
            background: '#FFF3CD', borderRadius: 12,
            fontSize: 11, fontWeight: 600, color: C2.inkSoft,
          }}>
            Mantén la pantalla activa manualmente.
          </div>
        )}

        {/* Mode tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <div style={{
            display: 'inline-flex', background: '#fff', borderRadius: 14, padding: 4,
            boxShadow: C2.shadowSoft, gap: 2,
          }}>
            {MODES.map((m) => {
              const active = modeId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeSwitch(m.id)}
                  disabled={isRunning}
                  aria-pressed={active}
                  style={{
                    padding: '0 18px', minHeight: 44, borderRadius: 11, fontSize: 12, fontWeight: 800,
                    border: 'none', cursor: isRunning ? 'default' : 'pointer',
                    background: active ? C2.ink : 'transparent',
                    color: active ? '#fff' : C2.inkSoft,
                    boxShadow: active ? '0 3px 8px rgba(90,74,92,0.22)' : 'none',
                    fontFamily: FONT,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Libre preset chips */}
        {modeId === 'free' && !isRunning && (
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            gap: 8, marginTop: 12, padding: '0 24px',
          }}>
            {LIBRE_PRESETS.map((min) => {
              const ms = min * 60_000;
              const active = customMs === ms;
              return (
                <button
                  key={min}
                  onClick={() => { setCustomMs(ms); if (!isReady) handleReset(); }}
                  aria-pressed={active}
                  style={{
                    padding: '0 14px', minHeight: 44, borderRadius: 20, fontSize: 12, fontWeight: 800,
                    border: 'none', cursor: 'pointer', fontFamily: FONT,
                    background: active ? C2.pinkSoft : '#fff',
                    color: active ? C2.pinkDeep : C2.inkSoft,
                    boxShadow: C2.shadowSoft,
                    transition: 'all 0.2s',
                  }}
                >
                  {min === 0 ? 'Sin límite' : `${min} min`}
                </button>
              );
            })}
          </div>
        )}

        {/* Timer circle + time overlay */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22, position: 'relative' }}>
          <TimerRing progress={progress} completed={isCompleted} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C2.pinkDeep, letterSpacing: '2px' }}>
              {isCompleted ? 'TERMINADO' : isCountdown ? 'RESTANTE' : 'TIEMPO'}
            </div>
            <div style={{
              fontSize: 54, fontWeight: 800, color: C2.ink, lineHeight: 1,
              marginTop: 6, fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px',
              fontFamily: FONT,
            }}>
              {isCompleted ? formatTime(elapsed) : formatTime(displayMs)}
            </div>
            {isCountdown && !isCompleted && (
              <div style={{ fontSize: 12, color: C2.inkSoft, marginTop: 6, fontWeight: 600 }}>
                de {formatTime(targetMs)}
              </div>
            )}
          </div>
        </div>

        {/* Floating kawaii flower — absolute within inner container */}
        {(isRunning || isPaused) && (
          <div style={{
            position: 'absolute', top: 336, right: 24,
            animation: 'flowerBob 3.6s ease-in-out infinite',
            pointerEvents: 'none',
          }}>
            <KawaiiFlower
              size={64} faceVariant={isPaused ? 'sleepy' : 'kissy'}
              petalColor="#FFB7C5" petalDeep="#FF8FAB" centerColor="#FFF4C3"
              bouncy={false}
            />
          </div>
        )}

        {/* Motivation / status text */}
        <div style={{ margin: '28px 32px 0', textAlign: 'center' }}>
          {isReady && (
            <>
              <div style={{ fontSize: 17, fontWeight: 800, color: C2.ink, letterSpacing: '-0.3px' }}>
                {modeId === 'free'
                  ? customMs > 0 ? `${LIBRE_PRESETS.find(m => m * 60_000 === customMs)} min · ¡A tu ritmo!` : '¡Entrena a tu ritmo!'
                  : `${activeMode.label} · ${formatTime(targetMs)}`}
              </div>
              <div style={{ fontSize: 13, color: C2.inkSoft, marginTop: 4 }}>
                {preMsg}
              </div>
            </>
          )}
          {isRunning && (
            <>
              <div style={{ fontSize: 17, fontWeight: 800, color: C2.ink, letterSpacing: '-0.3px' }}>
                ¡Lo estás haciendo genial!
              </div>
              <div style={{ fontSize: 13, color: C2.inkSoft, marginTop: 4 }}>
                Mantén el ritmo. Tu flor te está esperando.
              </div>
            </>
          )}
          {isPaused && (
            <>
              <div style={{ fontSize: 17, fontWeight: 800, color: C2.ink, letterSpacing: '-0.3px' }}>
                Pequeño descanso
              </div>
              <div style={{ fontSize: 13, color: C2.inkSoft, marginTop: 4 }}>
                Cuando estés lista, seguimos juntas.
              </div>
            </>
          )}
          {isCompleted && (
            <>
              <div style={{ fontSize: 17, fontWeight: 800, color: C2.ink, letterSpacing: '-0.3px' }}>
                ¡Sesión completada!
              </div>
              <div style={{ fontSize: 13, color: C2.inkSoft, marginTop: 4 }}>
                {doneMsg}
              </div>
            </>
          )}
        </div>

        {/* Spacer — pushes controls to bottom */}
        <div style={{ flex: 1, minHeight: 24 }} />

        {/* Completed CTAs */}
        {isCompleted && (
          <div style={{ margin: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleRegister}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '17px 26px', borderRadius: 22, border: 'none', cursor: 'pointer',
                background: C2.ink, color: '#fff', fontSize: 16, fontWeight: 700,
                fontFamily: FONT, boxShadow: C2.shadowDark, letterSpacing: '0.2px',
              }}
            >
              <IconCheck size={22} />
              Guardar entrenamiento
            </button>
            <button
              onClick={handleReset}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '14px 26px', borderRadius: 22, border: 'none', cursor: 'pointer',
                background: '#fff', color: C2.inkSoft, fontSize: 14, fontWeight: 700,
                fontFamily: FONT, boxShadow: C2.shadowSoft,
              }}
            >
              Nuevo entrenamiento
            </button>
          </div>
        )}

        {/* Circular controls */}
        {!isCompleted && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 22, padding: '0 0 28px',
          }}>
            {/* Left: stop */}
            <CtrlBtn size={56} onClick={isReady ? undefined : handleStop} disabled={isReady} ariaLabel="Detener entrenamiento">
              <IconStop size={32} />
            </CtrlBtn>

            {/* Center: play / pause / resume */}
            <CenterBtn
              onClick={isRunning ? handlePause : isPaused ? handleResume : handleStart}
              ariaLabel={isRunning ? 'Pausar' : isPaused ? 'Continuar' : 'Iniciar entrenamiento'}
            >
              {isRunning ? <IconRawPause /> : <IconRawPlay />}
            </CenterBtn>

            {/* Right: skip to complete (running/paused) or disabled */}
            <CtrlBtn size={56} onClick={isReady ? undefined : handleStop} disabled={isReady} ariaLabel="Completar entrenamiento">
              <IconSkip size={32} />
            </CtrlBtn>
          </div>
        )}

        {/* Nav bar clearance */}
        <div style={{ height: 86 }} />
      </div>
    </div>
  );
}
