// BloomFit · Pastel kawaii icon system
// Port of icons.jsx to TypeScript React — single source of truth for all app icons
// Usage: <BloomIcon name="bell" size={24} />
//        <IconBadge name="yoga" size={44} bg="#EBDDFC" radius={12} />
import type { ReactElement } from 'react';

// ─── Palette ──────────────────────────────────────────────────────────────────
const I = {
  pinkSoft: '#FFD4E0', pinkMid: '#FFB7C5', pinkDeep: '#FF8FAB',
  lavSoft: '#EBDDFC', lavMid: '#D5BDF5', lavDeep: '#B89BE8',
  skySoft: '#D8EBFC', skyMid: '#B6D8F5', skyDeep: '#7FB0DB',
  mintSoft: '#D4F2DE', mintMid: '#A8DEBA', mintDeep: '#6FBF8E',
  butterSoft: '#FFF1B8', butterMid: '#FFE38A', butterDeep: '#E8B948',
  peachSoft: '#FFE0CC', peachMid: '#FFC299', peachDeep: '#E89968',
  ink: '#5A4A5C', inkSoft: '#7A6880',
  white: '#FFFFFF', cream: '#FFF8EE',
  leaf: '#A8D5BA', leafDeep: '#7FB89A',
  stroke: '#4A3D4D',
};

// ─── Glyph definitions ────────────────────────────────────────────────────────
// Each glyph is a function returning a JSX <g> element for a 24×24 viewBox.

type GlyphFn = () => ReactElement;

const GLYPHS: Record<string, GlyphFn> = {

  // ── Navigation ───────────────────────────────────────────────────────────────
  home: () => (
    <g>
      <path d="M4 11 L12 4 L20 11 V20 H4 Z" fill={I.peachSoft} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9.5 20 V14 H14.5 V20" fill={I.peachMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="12" cy="8.5" r="0.8" fill={I.stroke} />
    </g>
  ),

  flower: () => (
    <g>
      <ellipse cx="12" cy="6" rx="3" ry="4" fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.2" />
      <ellipse cx="12" cy="18" rx="3" ry="4" fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.2" />
      <ellipse cx="6" cy="12" rx="4" ry="3" fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.2" />
      <ellipse cx="18" cy="12" rx="4" ry="3" fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.2" />
      <circle cx="12" cy="12" r="3" fill={I.butterMid} stroke={I.stroke} strokeWidth="1.2" />
    </g>
  ),

  user: () => (
    <g>
      <circle cx="12" cy="8" r="4" fill={I.lavMid} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M4 21 Q4 14 12 14 Q20 14 20 21 Z" fill={I.lavSoft} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="10.5" cy="8" r="0.5" fill={I.stroke} />
      <circle cx="13.5" cy="8" r="0.5" fill={I.stroke} />
    </g>
  ),

  goal: () => (
    <g>
      <circle cx="12" cy="12" r="9" fill={I.pinkSoft} stroke={I.stroke} strokeWidth="1.4" />
      <circle cx="12" cy="12" r="5.5" fill={I.white} stroke={I.stroke} strokeWidth="1.2" />
      <circle cx="12" cy="12" r="2.4" fill={I.pinkDeep} stroke={I.stroke} strokeWidth="1.2" />
    </g>
  ),

  // ── Actions ──────────────────────────────────────────────────────────────────
  play: () => (
    <g>
      <circle cx="12" cy="12" r="10" fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M10 8 L16 12 L10 16 Z" fill={I.white} stroke={I.stroke} strokeWidth="1.2" strokeLinejoin="round" />
    </g>
  ),

  pause: () => (
    <g>
      <circle cx="12" cy="12" r="10" fill={I.lavMid} stroke={I.stroke} strokeWidth="1.4" />
      <rect x="8.5" y="8" width="2.5" height="8" rx="1" fill={I.white} stroke={I.stroke} strokeWidth="1.1" />
      <rect x="13" y="8" width="2.5" height="8" rx="1" fill={I.white} stroke={I.stroke} strokeWidth="1.1" />
    </g>
  ),

  stop: () => (
    <g>
      <circle cx="12" cy="12" r="10" fill={I.peachMid} stroke={I.stroke} strokeWidth="1.4" />
      <rect x="8" y="8" width="8" height="8" rx="1.5" fill={I.white} stroke={I.stroke} strokeWidth="1.2" />
    </g>
  ),

  skip: () => (
    <g>
      <circle cx="12" cy="12" r="10" fill={I.skyMid} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M8 8 L13 12 L8 16 Z" fill={I.white} stroke={I.stroke} strokeWidth="1.1" strokeLinejoin="round" />
      <rect x="14" y="8" width="2" height="8" rx="0.8" fill={I.white} stroke={I.stroke} strokeWidth="1.1" />
    </g>
  ),

  check: () => (
    <g>
      <circle cx="12" cy="12" r="10" fill={I.mintMid} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M7.5 12.5 L10.5 15.5 L16.5 9" stroke={I.white} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  ),

  close: () => (
    <g>
      <circle cx="12" cy="12" r="10" fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M8 8 L16 16 M16 8 L8 16" stroke={I.white} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  ),

  back: () => (
    <g>
      <circle cx="12" cy="12" r="10" fill={I.cream} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M14 7 L9 12 L14 17" stroke={I.stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  ),

  plus: () => (
    <g>
      <circle cx="12" cy="12" r="10" fill={I.mintMid} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M12 7 V17 M7 12 H17" stroke={I.white} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),

  arrow: () => (
    <g>
      <path d="M5 12 H19 M14 7 L19 12 L14 17" stroke={I.white} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  ),

  search: () => (
    <g>
      <circle cx="10.5" cy="10.5" r="6" fill={I.pinkSoft} stroke={I.stroke} strokeWidth="1.5" />
      <circle cx="10.5" cy="10.5" r="3" fill={I.white} stroke={I.stroke} strokeWidth="1.2" />
      <path d="M15 15 L20 20" stroke={I.stroke} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  ),

  // ── Stats / time ─────────────────────────────────────────────────────────────
  timer: () => (
    <g>
      <circle cx="12" cy="13" r="8" fill={I.lavSoft} stroke={I.stroke} strokeWidth="1.4" />
      <rect x="10" y="2.5" width="4" height="2" rx="0.6" fill={I.lavMid} stroke={I.stroke} strokeWidth="1.2" />
      <path d="M12 13 V8.5 M12 13 L15 14.5" stroke={I.stroke} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="13" r="0.9" fill={I.pinkDeep} />
    </g>
  ),

  flame: () => (
    <g>
      <path d="M12 3 Q8 7 8.5 11 Q5 12 6 16 Q6.5 21 12 21 Q17.5 21 18 16 Q19 12 15.5 11 Q16 7 12 3 Z"
        fill={I.peachMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 11 Q10 13 10.5 15.5 Q11 18 12 18 Q13 18 13.5 15.5 Q14 13 12 11 Z"
        fill={I.butterMid} stroke={I.stroke} strokeWidth="1" />
    </g>
  ),

  chart: () => (
    <g>
      <rect x="3" y="14" width="4" height="7" rx="1.2" fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.3" />
      <rect x="10" y="9" width="4" height="12" rx="1.2" fill={I.lavMid} stroke={I.stroke} strokeWidth="1.3" />
      <rect x="17" y="4" width="4" height="17" rx="1.2" fill={I.mintMid} stroke={I.stroke} strokeWidth="1.3" />
    </g>
  ),

  trophy: () => (
    <g>
      <path d="M7 4 H17 V10 Q17 14 12 14 Q7 14 7 10 Z" fill={I.butterMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 5 Q3 5 3 8 Q3 11 7 11" fill="none" stroke={I.stroke} strokeWidth="1.3" />
      <path d="M17 5 Q21 5 21 8 Q21 11 17 11" fill="none" stroke={I.stroke} strokeWidth="1.3" />
      <rect x="9.5" y="14" width="5" height="3" fill={I.butterDeep} stroke={I.stroke} strokeWidth="1.3" />
      <rect x="7" y="17" width="10" height="3" rx="0.8" fill={I.peachMid} stroke={I.stroke} strokeWidth="1.4" />
    </g>
  ),

  // ── Workout types ─────────────────────────────────────────────────────────────
  yoga: () => (
    <g>
      <circle cx="12" cy="5" r="2.5" fill={I.lavMid} stroke={I.stroke} strokeWidth="1.3" />
      <path d="M12 7.5 V13" stroke={I.stroke} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 11 Q8 10 12 11 Q16 10 19 11" stroke={I.lavDeep} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M6 19 Q12 14 18 19" stroke={I.stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <ellipse cx="12" cy="20.5" rx="9" ry="1.2" fill={I.lavSoft} stroke={I.stroke} strokeWidth="1.2" />
    </g>
  ),

  cardio: () => (
    <g>
      <path d="M12 20 Q4 14 4 9 Q4 5 8 5 Q10.5 5 12 7.5 Q13.5 5 16 5 Q20 5 20 9 Q20 14 12 20 Z"
        fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 10 H10 L11 8 L13 13 L14 10 H17" stroke={I.white} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  ),

  strength: () => (
    <g>
      <rect x="2" y="9" width="3" height="6" rx="1" fill={I.skyMid} stroke={I.stroke} strokeWidth="1.3" />
      <rect x="19" y="9" width="3" height="6" rx="1" fill={I.skyMid} stroke={I.stroke} strokeWidth="1.3" />
      <rect x="5" y="10" width="2" height="4" rx="0.5" fill={I.skyDeep} stroke={I.stroke} strokeWidth="1.1" />
      <rect x="17" y="10" width="2" height="4" rx="0.5" fill={I.skyDeep} stroke={I.stroke} strokeWidth="1.1" />
      <rect x="6.5" y="11" width="11" height="2" rx="0.6" fill={I.cream} stroke={I.stroke} strokeWidth="1.2" />
    </g>
  ),

  stretch: () => (
    <g>
      <circle cx="8" cy="6" r="2.2" fill={I.mintMid} stroke={I.stroke} strokeWidth="1.3" />
      <path d="M8 8 Q9 12 14 13 Q19 14 20 18" stroke={I.stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M8 8 V14 L5 19" stroke={I.stroke} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M14 13 V19" stroke={I.stroke} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),

  hiit: () => (
    <g>
      <path d="M13 2 L5 13 H11 L9 22 L19 10 H13 Z"
        fill={I.peachMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  ),

  walk: () => (
    <g>
      <circle cx="14" cy="4.5" r="2.2" fill={I.butterMid} stroke={I.stroke} strokeWidth="1.3" />
      <path d="M14 7 L11 12 L8 14 M11 12 L13 16 L11 21 M13 16 L17 18" stroke={I.stroke} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <path d="M7 21 L8 14" stroke={I.stroke} strokeWidth="1.7" strokeLinecap="round" />
    </g>
  ),

  // ── Settings / misc ──────────────────────────────────────────────────────────
  bell: () => (
    <g>
      <path d="M6 16 Q6 10 9 8 Q9 5 12 5 Q15 5 15 8 Q18 10 18 16 H6 Z"
        fill={I.butterMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 16 H19" stroke={I.stroke} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 18 Q12 20 13.5 18" stroke={I.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  ),

  gear: () => (
    <g>
      <path d="M12 3 L13 5.5 L15.5 5 L16 7.5 L18.5 8 L18 10.5 L20.5 12 L18 13.5 L18.5 16 L16 16.5 L15.5 19 L13 18.5 L12 21 L11 18.5 L8.5 19 L8 16.5 L5.5 16 L6 13.5 L3.5 12 L6 10.5 L5.5 8 L8 7.5 L8.5 5 L11 5.5 Z"
        fill={I.lavMid} stroke={I.stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill={I.white} stroke={I.stroke} strokeWidth="1.3" />
    </g>
  ),

  heart: () => (
    <g>
      <path d="M12 20 Q3 14 3 8.5 Q3 5 7 5 Q10 5 12 8 Q14 5 17 5 Q21 5 21 8.5 Q21 14 12 20 Z"
        fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  ),

  drop: () => (
    <g>
      <path d="M12 3 Q5 11 5 15 Q5 20 12 20 Q19 20 19 15 Q19 11 12 3 Z"
        fill={I.skyMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <ellipse cx="9.5" cy="13" rx="1.4" ry="2" fill={I.white} opacity={0.7} />
    </g>
  ),

  sparkle: () => (
    <g>
      <path d="M12 3 L13.5 10.5 L21 12 L13.5 13.5 L12 21 L10.5 13.5 L3 12 L10.5 10.5 Z"
        fill={I.butterMid} stroke={I.stroke} strokeWidth="1.3" strokeLinejoin="round" />
    </g>
  ),

  moon: () => (
    <g>
      <path d="M16 3 Q9 5 9 12 Q9 19 17 21 Q11 21 7 17 Q3 13 5 7 Q7 3 12 2 Q14 2 16 3 Z"
        fill={I.lavMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  ),

  star: () => (
    <g>
      <path d="M12 3 L14.5 9 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 9 Z"
        fill={I.butterMid} stroke={I.stroke} strokeWidth="1.3" strokeLinejoin="round" />
    </g>
  ),

  gem: () => (
    <g>
      <path d="M5 9 L8 4 H16 L19 9 L12 21 Z" fill={I.skyMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 9 H19 M8 4 L12 9 L16 4 M12 9 L12 21" stroke={I.stroke} strokeWidth="1.2" fill="none" />
      <ellipse cx="9" cy="6.5" rx="1" ry="0.5" fill={I.white} opacity={0.7} />
    </g>
  ),

  mail: () => (
    <g>
      <rect x="3" y="6" width="18" height="13" rx="2" fill={I.peachSoft} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M3 7 L12 13 L21 7" fill="none" stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  ),

  lock: () => (
    <g>
      <rect x="5" y="11" width="14" height="10" rx="2" fill={I.peachMid} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M8 11 V8 Q8 4 12 4 Q16 4 16 8 V11" fill="none" stroke={I.stroke} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.4" fill={I.stroke} />
      <rect x="11.4" y="15" width="1.2" height="3.5" rx="0.5" fill={I.stroke} />
    </g>
  ),

  eye: () => (
    <g>
      <path d="M2 12 Q7 5 12 5 Q17 5 22 12 Q17 19 12 19 Q7 19 2 12 Z" fill={I.lavSoft} stroke={I.stroke} strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3" fill={I.white} stroke={I.stroke} strokeWidth="1.2" />
      <circle cx="12" cy="12" r="1.4" fill={I.stroke} />
    </g>
  ),

  pot: () => (
    <g>
      <path d="M5 10 H19 L17 20 Q17 21 16 21 H8 Q7 21 7 20 Z" fill={I.peachMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="4" y="8" width="16" height="3" rx="1" fill={I.peachDeep} stroke={I.stroke} strokeWidth="1.3" />
    </g>
  ),

  petal: () => (
    <g>
      <path d="M12 3 Q6 8 6 13 Q6 19 12 21 Q18 19 18 13 Q18 8 12 3 Z"
        fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
      <ellipse cx="12" cy="10" rx="2" ry="3.5" fill={I.white} opacity={0.55} />
    </g>
  ),

  ribbon: () => (
    <g>
      <path d="M5 6 Q12 4 19 6 Q17 9 12 8.5 Q7 9 5 6 Z" fill={I.pinkMid} stroke={I.stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 8 L7 14 L10 12 L11 16 L13 13 L13 16 L17 13 L15 8" fill={I.pinkSoft} stroke={I.stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="1.4" fill={I.butterMid} stroke={I.stroke} strokeWidth="1.1" />
    </g>
  ),

  butterfly: () => (
    <g>
      <path d="M12 6 Q7 3 4 6 Q3 10 6 13 Q9 14 12 12 Q15 14 18 13 Q21 10 20 6 Q17 3 12 6 Z"
        fill={I.lavMid} stroke={I.stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12 12 Q9 16 7 19 M12 12 Q15 16 17 19" stroke={I.lavDeep} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="12" cy="11" rx="0.9" ry="4" fill={I.stroke} />
    </g>
  ),

  cloud: () => (
    <g>
      <path d="M6 16 Q3 16 3 13 Q3 10 7 10 Q7 6 11 6 Q15 6 16 9 Q21 9 21 13 Q21 16 18 16 Z"
        fill={I.skySoft} stroke={I.stroke} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  ),

  shop: () => (
    <g>
      <path d="M5 8 L7 4 H17 L19 8" fill={I.peachSoft} stroke={I.stroke} strokeWidth="1.3" strokeLinejoin="round" />
      <rect x="4" y="8" width="16" height="12" rx="1.5" fill={I.peachMid} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M9 11 V13 Q9 15 12 15 Q15 15 15 13 V11" stroke={I.stroke} strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </g>
  ),

  // ── Mood faces ───────────────────────────────────────────────────────────────
  faceSleep: () => (
    <g>
      <circle cx="12" cy="12" r="9" fill={I.lavSoft} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M7 11 Q9 12 11 11 M13 11 Q15 12 17 11" stroke={I.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M9 16 Q12 17 15 16" stroke={I.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  ),

  faceCalm: () => (
    <g>
      <circle cx="12" cy="12" r="9" fill={I.skySoft} stroke={I.stroke} strokeWidth="1.4" />
      <circle cx="9" cy="11" r="0.9" fill={I.stroke} />
      <circle cx="15" cy="11" r="0.9" fill={I.stroke} />
      <path d="M9 15 Q12 16.5 15 15" stroke={I.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  ),

  faceHappy: () => (
    <g>
      <circle cx="12" cy="12" r="9" fill={I.butterSoft} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M8 10 Q9 8.5 10 10 M14 10 Q15 8.5 16 10" stroke={I.stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M8 14 Q12 18 16 14" stroke={I.stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="7.5" cy="13" rx="1.2" ry="0.8" fill={I.pinkMid} opacity={0.7} />
      <ellipse cx="16.5" cy="13" rx="1.2" ry="0.8" fill={I.pinkMid} opacity={0.7} />
    </g>
  ),

  faceStar: () => (
    <g>
      <circle cx="12" cy="12" r="9" fill={I.peachSoft} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M9 11 L7 9 M9 11 L11 9 M9 11 L9 13 M9 11 L7 13 M9 11 L11 13" stroke={I.peachDeep} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M15 11 L13 9 M15 11 L17 9 M15 11 L15 13 M15 11 L13 13 M15 11 L17 13" stroke={I.peachDeep} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 14 Q12 18 16 14" stroke={I.stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  ),

  faceLove: () => (
    <g>
      <circle cx="12" cy="12" r="9" fill={I.pinkSoft} stroke={I.stroke} strokeWidth="1.4" />
      <path d="M9 10 Q8 8 7 10 Q7 11 9 12 Q11 11 11 10 Q10 8 9 10" fill={I.pinkDeep} stroke={I.stroke} strokeWidth="0.9" />
      <path d="M15 10 Q14 8 13 10 Q13 11 15 12 Q17 11 17 10 Q16 8 15 10" fill={I.pinkDeep} stroke={I.stroke} strokeWidth="0.9" />
      <path d="M9 14.5 Q12 17 15 14.5" stroke={I.stroke} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  ),
};

// ─── Public components ────────────────────────────────────────────────────────

export function BloomIcon({
  name,
  size = 24,
  style,
}: {
  name: string;
  size?: number;
  style?: React.CSSProperties;
}) {
  const glyph = GLYPHS[name];
  if (!glyph) {
    return (
      <span style={{ width: size, height: size, display: 'inline-block', background: '#FFE4EC', borderRadius: 4, ...style }} />
    );
  }
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    >
      {glyph()}
    </svg>
  );
}

export function IconBadge({
  name,
  size = 44,
  iconSize,
  bg = '#FFE4EC',
  radius,
  style,
}: {
  name: string;
  size?: number;
  iconSize?: number;
  bg?: string;
  radius?: number;
  style?: React.CSSProperties;
}) {
  const isize = iconSize ?? Math.round(size * 0.6);
  return (
    <div
      style={{
        width: size, height: size,
        borderRadius: radius != null ? radius : size / 2,
        background: bg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      <BloomIcon name={name} size={isize} />
    </div>
  );
}
