import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onAuthStateChanged, auth } from '@/lib/auth';
import {
  getActiveGoals, createGoal, deactivateGoal, checkAndResetGoals,
} from '@/lib/firestore';
import type { Goal } from '@/lib/firestore';
import { BloomIcon } from './BloomIcons';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C2 = {
  bg: '#FFF5F7',
  ink: '#5A4A5C', inkSoft: '#8E7B92',
  pink: '#FFB7C5', pinkDeep: '#FF8FAB', pinkSoft: '#FFD4E0',
  lavenderSoft: '#EBDDFC', mintSoft: '#DEF5E6',
  shadowSoft: '0 4px 14px rgba(180,120,160,0.08)',
  shadowDark: '0 8px 18px rgba(90,74,92,0.28)',
  shadowCard: '0 6px 20px rgba(180,120,160,0.1)',
};
const FONT = `'Quicksand','Nunito',-apple-system,sans-serif`;

// ─── Goal type colors ─────────────────────────────────────────────────────────
const GOAL_COLORS = {
  weekly:  { accent: '#FF8FAB', iconBg: '#FFD4E0' },
  monthly: { accent: '#B89BE8', iconBg: '#EBDDFC' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pct(goal: Goal) {
  return goal.target > 0 ? Math.min(Math.round((goal.current / goal.target) * 100), 100) : 0;
}

function unitLabel(metric: 'count' | 'minutes', n: number) {
  return metric === 'count'
    ? `${n} sesión${n !== 1 ? 'es' : ''}`
    : `${n} min`;
}

function periodLabel(type: 'weekly' | 'monthly') {
  return type === 'weekly' ? 'Semanal' : 'Mensual';
}

// ─── GoalCard ─────────────────────────────────────────────────────────────────
function GoalCard({
  goal, onDelete, deleting,
}: {
  goal: Goal;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const { accent, iconBg } = GOAL_COLORS[goal.type];
  const p = pct(goal);
  const iconName = goal.metric === 'count' ? 'cardio' : 'timer';

  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: 14,
      boxShadow: C2.shadowCard, borderLeft: `4px solid ${accent}`,
      marginBottom: 12, fontFamily: FONT, position: 'relative',
    }}>
      {/* Row 1 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <BloomIcon name={iconName} size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C2.ink }}>
            {unitLabel(goal.metric, goal.target)}{' '}
            {goal.type === 'weekly' ? 'esta semana' : 'este mes'}
          </div>
          <div style={{
            display: 'inline-block', marginTop: 4,
            background: accent, color: '#fff',
            fontSize: 10, fontWeight: 800, letterSpacing: '0.5px',
            padding: '2px 8px', borderRadius: 8,
          }}>
            {periodLabel(goal.type).toUpperCase()}
          </div>
        </div>
        <button
          onClick={() => onDelete(goal.goalId)}
          disabled={deleting}
          aria-label="Eliminar meta"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: C2.inkSoft, fontSize: 18, lineHeight: 1, padding: '2px 4px',
            opacity: deleting ? 0.4 : 1,
          }}
        >×</button>
      </div>

      {/* Row 2 — progress */}
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: C2.inkSoft, fontWeight: 700 }}>
            <span style={{ color: C2.ink, fontWeight: 800 }}>{goal.current}</span>
            {' / '}{goal.target} {goal.metric === 'count' ? 'sesiones' : 'min'}
          </span>
          <span style={{ fontSize: 12, fontWeight: 800, color: accent }}>{p}%</span>
        </div>
        <div style={{ height: 7, background: '#FFF0F4', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            width: `${p}%`,
            background: `linear-gradient(90deg, ${accent}99, ${accent})`,
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── Segmented control ────────────────────────────────────────────────────────
function SegmentedControl<T extends string>({
  options, value, onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 5,
      boxShadow: C2.shadowSoft, display: 'flex',
    }}>
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          style={{
            flex: 1, padding: '12px 0', borderRadius: 12, border: 'none',
            cursor: 'pointer', fontSize: 14, fontWeight: 800, fontFamily: FONT,
            background: value === o.id ? C2.ink : 'transparent',
            color: value === o.id ? '#fff' : C2.inkSoft,
            boxShadow: value === o.id ? '0 4px 10px rgba(90,74,92,0.22)' : 'none',
            transition: 'all 0.2s',
          }}
        >{o.label}</button>
      ))}
    </div>
  );
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({
  icon, label, sublabel, selected, onClick,
}: {
  icon: string; label: string; sublabel: string;
  selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, background: '#fff', borderRadius: 18, padding: '16px 12px',
        border: 'none', cursor: 'pointer', fontFamily: FONT, textAlign: 'center',
        outline: selected ? `2.5px solid ${C2.pinkDeep}` : '2px solid #fff',
        boxShadow: selected ? '0 6px 14px rgba(255,105,180,0.15)' : C2.shadowSoft,
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 12, background: C2.pinkSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 8px',
      }}>
        <BloomIcon name={icon} size={24} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: C2.ink }}>{label}</div>
      <div style={{ fontSize: 11, color: C2.inkSoft, marginTop: 2 }}>{sublabel}</div>
    </button>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
function Stepper({
  value, min, max, step = 1, onChange,
}: {
  value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: 22, padding: '14px 18px',
      boxShadow: C2.shadowSoft, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        style={{
          width: 44, height: 44, borderRadius: 14, border: 'none',
          background: C2.pinkSoft, color: C2.pinkDeep,
          fontSize: 22, fontWeight: 800, cursor: 'pointer', fontFamily: FONT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >−</button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: C2.ink, lineHeight: 1 }}>{value}</div>
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        style={{
          width: 44, height: 44, borderRadius: 14, border: 'none',
          background: C2.ink, color: '#fff',
          fontSize: 22, fontWeight: 800, cursor: 'pointer', fontFamily: FONT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(90,74,92,0.22)',
        }}
      >+</button>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function GoalSetter() {
  const [uid, setUid] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create'>('list');

  // Create form state
  const [goalType, setGoalType] = useState<'weekly' | 'monthly'>('weekly');
  const [goalMetric, setGoalMetric] = useState<'count' | 'minutes'>('count');
  const [goalTarget, setGoalTarget] = useState(3);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.href = '/login'; return; }
      setUid(user.uid);
      await checkAndResetGoals(user.uid);
      const g = await getActiveGoals(user.uid);
      setGoals(g);
      setLoading(false);
    });
    return unsub;
  }, []);

  function openCreate() {
    setGoalType(hasWeekly ? 'monthly' : 'weekly');
    setGoalMetric('count');
    setGoalTarget(3);
    setFormError('');
    setView('create');
  }

  function handleMetricChange(m: 'count' | 'minutes') {
    setGoalMetric(m);
    setGoalTarget(m === 'count' ? 3 : 60);
  }

  async function handleCreate() {
    if (!uid) return;
    setCreating(true);
    setFormError('');
    try {
      await createGoal(uid, { type: goalType, metric: goalMetric, target: goalTarget });
      const g = await getActiveGoals(uid);
      setGoals(g);
      setView('list');
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al crear la meta.');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(goalId: string) {
    if (!uid) return;
    setDeletingId(goalId);
    await deactivateGoal(uid, goalId);
    setGoals((prev) => prev.filter((g) => g.goalId !== goalId));
    setDeletingId(null);
  }

  const hasWeekly = goals.some((g) => g.type === 'weekly');
  const hasMonthly = goals.some((g) => g.type === 'monthly');
  const canCreate = !hasWeekly || !hasMonthly;

  const previewText = (() => {
    const unit = goalMetric === 'count' ? 'sesiones' : 'min';
    const period = goalType === 'weekly' ? 'esta semana' : 'este mes';
    const extra =
      goalMetric === 'count' && goalType === 'weekly' && goalTarget > 0
        ? ` (~${Math.round(45 * goalTarget)} min totales)`
        : '';
    return `${goalTarget} ${unit} ${period}${extra}`;
  })();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C2.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 40, animation: 'flowerBob 1.2s ease-in-out infinite' }}>🌸</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C2.bg, fontFamily: FONT }}>
      <div style={{ maxWidth: 375, margin: '0 auto', minHeight: '100vh', paddingBottom: 32 }}>

        {/* Header */}
        <div style={{ padding: '52px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', textDecoration: 'none' }}>
            <BloomIcon name="back" size={40} />
          </a>
          <div style={{ fontSize: 14, fontWeight: 800, color: C2.ink }}>Mis metas</div>
          <div style={{ width: 40 }} />
        </div>

        {/* Goal list */}
        <div style={{ margin: '20px 20px 0' }}>
          {goals.length === 0 ? (
            <div style={{
              background: '#fff', borderRadius: 20, padding: '32px 20px',
              boxShadow: C2.shadowCard, textAlign: 'center',
            }}>
              <BloomIcon name="flower" size={48} />
              <div style={{ fontSize: 15, fontWeight: 800, color: C2.ink, marginTop: 12 }}>
                Aún no tenés metas activas
              </div>
              <div style={{ fontSize: 13, color: C2.inkSoft, marginTop: 6, lineHeight: 1.5 }}>
                Creá tu primera meta para que tu flor crezca
              </div>
            </div>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.goalId}
                goal={goal}
                onDelete={handleDelete}
                deleting={deletingId === goal.goalId}
              />
            ))
          )}
        </div>

        {/* Create button */}
        {canCreate && (
          <div style={{ margin: '20px 20px 0' }}>
            <button
              onClick={openCreate}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '17px 26px', borderRadius: 22, border: 'none', cursor: 'pointer',
                background: C2.ink, color: '#fff', fontSize: 16, fontWeight: 700,
                fontFamily: FONT, boxShadow: C2.shadowDark, letterSpacing: '0.2px',
              }}
            >
              <BloomIcon name="plus" size={20} />
              Nueva meta
            </button>
          </div>
        )}

        {!canCreate && (
          <div style={{ margin: '16px 20px 0', padding: '12px 16px', background: '#FFF0F4', borderRadius: 14 }}>
            <div style={{ fontSize: 13, color: C2.inkSoft, fontWeight: 700, textAlign: 'center' }}>
              Ya tenés una meta semanal y una mensual activas
            </div>
          </div>
        )}

      </div>

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {view === 'create' && (
          <>
            {/* Dim overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setView('list')}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(90,74,92,0.4)', zIndex: 40,
              }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
                background: '#FFF5F7',
                borderRadius: '24px 24px 0 0',
                padding: '8px 20px 48px',
                fontFamily: FONT,
              }}
            >
              {/* Drag handle */}
              <div style={{ width: 40, height: 4, background: '#FFD4E0', borderRadius: 2, margin: '8px auto 20px' }} />

              {/* Sheet title */}
              <div style={{ fontSize: 18, fontWeight: 800, color: C2.ink, marginBottom: 20 }}>
                Nueva meta
              </div>

              {/* Section: tipo */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C2.inkSoft, letterSpacing: '0.6px', marginBottom: 8 }}>
                  PERÍODO
                </div>
                <SegmentedControl
                  options={[
                    { id: 'weekly' as const, label: 'Semanal' },
                    { id: 'monthly' as const, label: 'Mensual' },
                  ]}
                  value={goalType}
                  onChange={(v) => {
                    if (v === 'weekly' && hasWeekly) return;
                    if (v === 'monthly' && hasMonthly) return;
                    setGoalType(v);
                  }}
                />
                {goalType === 'weekly' && hasWeekly && (
                  <div style={{ fontSize: 12, color: C2.pinkDeep, fontWeight: 700, marginTop: 6 }}>
                    Ya tenés una meta semanal activa
                  </div>
                )}
                {goalType === 'monthly' && hasMonthly && (
                  <div style={{ fontSize: 12, color: C2.pinkDeep, fontWeight: 700, marginTop: 6 }}>
                    Ya tenés una meta mensual activa
                  </div>
                )}
              </div>

              {/* Section: métrica */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C2.inkSoft, letterSpacing: '0.6px', marginBottom: 8 }}>
                  MIDO POR
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <MetricCard
                    icon="cardio"
                    label="Sesiones"
                    sublabel="# de entrenamientos"
                    selected={goalMetric === 'count'}
                    onClick={() => handleMetricChange('count')}
                  />
                  <MetricCard
                    icon="timer"
                    label="Minutos"
                    sublabel="tiempo total"
                    selected={goalMetric === 'minutes'}
                    onClick={() => handleMetricChange('minutes')}
                  />
                </div>
              </div>

              {/* Section: target */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C2.inkSoft, letterSpacing: '0.6px', marginBottom: 8 }}>
                  OBJETIVO
                </div>
                <Stepper
                  value={goalTarget}
                  min={goalMetric === 'count' ? 1 : 10}
                  max={goalMetric === 'count' ? 30 : 600}
                  step={goalMetric === 'count' ? 1 : 10}
                  onChange={setGoalTarget}
                />
                <div style={{
                  marginTop: 10, padding: '10px 14px',
                  background: 'linear-gradient(135deg, rgba(255,244,195,0.6), rgba(255,183,197,0.4))',
                  borderRadius: 14, fontSize: 12, color: C2.ink, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <BloomIcon name="sparkle" size={16} />
                  {previewText}
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div style={{
                  marginBottom: 12, padding: '10px 14px',
                  background: '#FFE4EC', borderRadius: 14,
                  fontSize: 13, color: C2.pinkDeep, fontWeight: 700,
                }}>
                  {formError}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleCreate}
                disabled={creating || (goalType === 'weekly' && hasWeekly) || (goalType === 'monthly' && hasMonthly)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '17px 26px', borderRadius: 22, border: 'none',
                  cursor: creating ? 'default' : 'pointer',
                  background: C2.ink, color: '#fff', fontSize: 16, fontWeight: 700,
                  fontFamily: FONT, boxShadow: C2.shadowDark,
                  opacity: creating || (goalType === 'weekly' && hasWeekly) || (goalType === 'monthly' && hasMonthly) ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <BloomIcon name="check" size={20} />
                {creating ? 'Creando…' : 'Crear meta'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
