import type { Workout } from './firestore';

export type MessageContext =
  | 'goal_achieved'
  | 'low_progress'
  | 'post_workout'
  | 'pre_workout'
  | 'streak'
  | 'rest_day'
  | 'general';

const CATALOG: Record<MessageContext, string[]> = {
  goal_achieved: [
    '¡Lo lograste! Tu flor está en plena floración 🌸',
    '¡Meta cumplida! Tu dedicación hace que todo florezca ✨',
    '¡100%! Sos una campeona del bloom 💪',
    'Tu esfuerzo dio frutos — y la flor lo sabe 🌷',
  ],
  low_progress: [
    'Todavía hay tiempo para florecer esta semana 🌱',
    'Pequeños pasos cuentan — ¡una sesión hoy marca la diferencia! 💪',
    'Tu flor te necesita, ¡dale una sesión hoy! 🌸',
    'Mitad de semana, momento perfecto para retomar 🌿',
  ],
  post_workout: [
    '¡Sesión guardada! Tu flor creció un poco más 🌸',
    '¡Lo lograste! Cada entrenamiento la hace florecer ✨',
    '¡Eso estuvo increíble! Tu esfuerzo siempre vale 💪',
    'Guardado. Tu flor está radiante hoy 🌷',
  ],
  pre_workout: [
    '¡Tu flor te está esperando! 🌱',
    'Hoy es un buen día para florecer 🌸',
    'Pequeños pasos, grandes blooms ✨',
    'Cada sesión es un pétalo más 🌷',
    'Tú puedes — tu flor lo sabe 💪',
  ],
  streak: [
    '{count} semanas seguidas — ¡imparable! 🔥',
    'Streak de {count} semanas, tu flor lo siente 🌸',
    '¡{count} semanas en racha! La constancia es tu superpoder ✨',
    '{count} semanas bloom — sos una inspiración 🌷',
  ],
  rest_day: [
    'El descanso también hace crecer la flor 🌿',
    'Tu cuerpo se recupera, tu flor también 💚',
    'Hoy descansás, mañana florecés aún más 🌸',
    'Día de pausa — tu flor te espera sin prisa 🌱',
  ],
  general: [
    '¡Tu flor te está esperando! 🌱',
    'Cada entrenamiento la hace crecer ✨',
    'Pequeños pasos, grandes blooms 🌸',
    'Tú puedes, tu flor lo sabe 💪',
    'Hoy es un buen día para florecer 🌷',
    'Cada pétalo cuenta — ¡a moverlo! 🌸',
  ],
};

export interface MessageInterpolations {
  name?: string;
  count?: number;
}

export function getMotivationalMessage(
  context: MessageContext,
  interpolations?: MessageInterpolations,
): string {
  const list = CATALOG[context] ?? CATALOG.general;
  const raw = list[Math.floor(Math.random() * list.length)];
  let result = raw;
  if (interpolations?.name) result = result.replace('{name}', interpolations.name);
  if (interpolations?.count !== undefined) result = result.replace('{count}', String(interpolations.count));
  return result;
}

export function detectDashboardContext(
  pct: number,
  weeklyStreak: number,
  recentWorkouts: Workout[],
  savedJustNow: boolean,
): MessageContext {
  if (savedJustNow) return 'post_workout';
  if (pct >= 100) return 'goal_achieved';
  if (weeklyStreak >= 2) return 'streak';

  const now = new Date();
  const todayStr = now.toDateString();
  const yesterdayStr = new Date(now.getTime() - 86_400_000).toDateString();
  const workedRecently = recentWorkouts.some((w) => {
    const d = w.date?.toDate?.()?.toDateString();
    return d === todayStr || d === yesterdayStr;
  });

  const dow = now.getDay(); // 0=Sun … 6=Sat
  if (pct < 25 && dow >= 3 && dow <= 5) return 'low_progress';
  if (recentWorkouts.length > 0 && !workedRecently) return 'rest_day';

  return 'general';
}
