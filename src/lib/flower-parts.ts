export type PartType = 'pot' | 'stem' | 'petals' | 'face' | 'accessory';

export interface FlowerPart {
  id: string;
  name: string;
  type: PartType;
  description: string;
  preview: string;
  unlockCondition: { type: 'weekStreak'; weeks: number };
}

export const FLOWER_PARTS: FlowerPart[] = [
  {
    id: 'pot_basic',
    name: 'Maceta básica',
    type: 'pot',
    description: '4 colores para personalizar tu maceta',
    preview: '🪴',
    unlockCondition: { type: 'weekStreak', weeks: 1 },
  },
  {
    id: 'stem_leaves',
    name: 'Tallo frondoso',
    type: 'stem',
    description: 'Un tallo con hojas más abundantes',
    preview: '🌿',
    unlockCondition: { type: 'weekStreak', weeks: 2 },
  },
  {
    id: 'petals_round',
    name: 'Pétalos redondos',
    type: 'petals',
    description: 'Pétalos suaves y redondeados',
    preview: '🌸',
    unlockCondition: { type: 'weekStreak', weeks: 3 },
  },
  {
    id: 'face_kawaii',
    name: 'Carita kawaii',
    type: 'face',
    description: 'Una carita extra expresiva y adorable',
    preview: '🥰',
    unlockCondition: { type: 'weekStreak', weeks: 4 },
  },
  {
    id: 'acc_bow',
    name: 'Moño',
    type: 'accessory',
    description: 'Un lazo adorable para tu flor',
    preview: '🎀',
    unlockCondition: { type: 'weekStreak', weeks: 6 },
  },
  {
    id: 'acc_crown',
    name: 'Corona de flores',
    type: 'accessory',
    description: 'Para la reina del entrenamiento',
    preview: '👑',
    unlockCondition: { type: 'weekStreak', weeks: 8 },
  },
  {
    id: 'petals_heart',
    name: 'Pétalos de corazón',
    type: 'petals',
    description: 'Pétalos en forma de corazón',
    preview: '💝',
    unlockCondition: { type: 'weekStreak', weeks: 10 },
  },
  {
    id: 'pot_gold',
    name: 'Maceta dorada',
    type: 'pot',
    description: 'El premio a la dedicación total',
    preview: '✨',
    unlockCondition: { type: 'weekStreak', weeks: 12 },
  },
];

export function getPartsForStreak(streak: number, alreadyUnlocked: string[]): FlowerPart[] {
  const unlocked = new Set(alreadyUnlocked);
  return FLOWER_PARTS.filter(
    (p) => p.unlockCondition.weeks === streak && !unlocked.has(p.id),
  );
}

// ─── Swatch catalogs ──────────────────────────────────────────────────────────

export interface PetalSwatch {
  id: string;
  name: string;
  color: string;
  deep: string;
}

export interface PotSwatch {
  id: string;
  name: string;
  color: string;
  rim: string;
}

export interface Charm {
  id: string;
  label: string;
  sub: string;
  emoji: string | null;
}

export const PETAL_SWATCHES: PetalSwatch[] = [
  { id: 'sakura',   name: 'Sakura',   color: '#FFB7C5', deep: '#FF8FAB' },
  { id: 'lavender', name: 'Lavender', color: '#E0C3FC', deep: '#B89BE8' },
  { id: 'sky',      name: 'Sky',      color: '#C3E0FC', deep: '#9BC4F0' },
  { id: 'mint',     name: 'Mint',     color: '#C3FCD8', deep: '#8DD9A8' },
  { id: 'butter',   name: 'Butter',   color: '#FFE38A', deep: '#E8B948' },
  { id: 'peach',    name: 'Peach',    color: '#FFC299', deep: '#E89968' },
  { id: 'cream',    name: 'Cream',    color: '#FFF0D8', deep: '#E5C690' },
  { id: 'rose',     name: 'Rose',     color: '#FF8FAB', deep: '#E66B8B' },
];

export const POT_SWATCHES: PotSwatch[] = [
  { id: 'terra', name: 'Terra', color: '#E5B299', rim: '#D49B82' },
  { id: 'cloud', name: 'Cloud', color: '#F0EAEE', rim: '#D9CFD5' },
  { id: 'sky',   name: 'Sky',   color: '#B6D8F5', rim: '#7FB0DB' },
  { id: 'mint',  name: 'Mint',  color: '#A8DEBA', rim: '#6FBF8E' },
  { id: 'plum',  name: 'Plum',  color: '#D5BDF5', rim: '#B89BE8' },
  { id: 'honey', name: 'Honey', color: '#FFE38A', rim: '#E8B948' },
];

export const CHARMS: Charm[] = [
  { id: 'none',      label: 'Ninguno',  sub: 'Flor limpia',     emoji: null },
  { id: 'butterfly', label: 'Mariposa', sub: 'Flota cerca',     emoji: '🦋' },
  { id: 'ribbon',    label: 'Moño',     sub: 'Lazo adorable',   emoji: '🎀' },
];

export function resolvePetalSwatch(id: string): PetalSwatch {
  return PETAL_SWATCHES.find((s) => s.id === id) ?? PETAL_SWATCHES[0];
}

export function resolvePotSwatch(id: string): PotSwatch {
  return POT_SWATCHES.find((s) => s.id === id) ?? POT_SWATCHES[0];
}
