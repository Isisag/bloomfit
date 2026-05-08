import { motion, useReducedMotion } from 'framer-motion';

type FlowerStage = 'seed' | 'sprout' | 'bud' | 'bloom' | 'superbloom';

function getStage(pct: number): FlowerStage {
  if (pct <= 0) return 'seed';
  if (pct <= 25) return 'sprout';
  if (pct <= 75) return 'bud';
  if (pct <= 100) return 'bloom';
  return 'superbloom';
}

const STAGE_LABELS: Record<FlowerStage, string> = {
  seed: 'Semilla — empieza a entrenar',
  sprout: 'Brote — vas por buen camino',
  bud: 'Capullo — casi en flor',
  bloom: 'Flor — meta cumplida',
  superbloom: 'Flor Grande — ¡superaste la meta!',
};

interface FlowerAvatarProps {
  pct: number;
  petalColor?: string;
  petalDeep?: string;
  centerColor?: string;
  size?: number;
}

export default function FlowerAvatar({
  pct,
  petalColor = '#FFB7C5',
  petalDeep = '#FF8FAB',
  centerColor = '#FFF4C3',
  size = 180,
}: FlowerAvatarProps) {
  const reducedMotion = useReducedMotion();
  const stage = getStage(pct);

  const cx = 100;
  const cy = 90;
  const stemColor = '#A8D5BA';
  const potColor = '#E5B299';
  const potRim = '#D49B82';

  const isSuperbloom = stage === 'superbloom';
  const petalCount = isSuperbloom ? 8 : 6;
  const petalRy = isSuperbloom ? 26 : 22;
  const petalRx = isSuperbloom ? 16 : 14;
  const activePetalColor = isSuperbloom ? petalDeep : petalColor;
  const activePetalDeep = isSuperbloom ? '#FF3B80' : petalDeep;

  const showFullStem = stage === 'bud' || stage === 'bloom' || stage === 'superbloom';
  const showLeaves = showFullStem;
  const showBud = stage === 'bud';
  const showBloom = stage === 'bloom' || stage === 'superbloom';

  return (
    <motion.svg
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      style={{ overflow: 'visible' }}
      animate={reducedMotion ? {} : { y: [0, -6, 0], rotate: [-1, 1, -1] }}
      transition={{ repeat: Infinity, duration: 3.6, ease: 'easeInOut' }}
      aria-label={STAGE_LABELS[stage]}
      role="img"
    >
      <defs>
        <radialGradient id="fav-petalGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="60%" stopColor={activePetalColor} />
          <stop offset="100%" stopColor={activePetalDeep} />
        </radialGradient>
        <radialGradient id="fav-centerGrad" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FFFBE0" />
          <stop offset="100%" stopColor={centerColor} />
        </radialGradient>
        <linearGradient id="fav-potGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={potColor} />
          <stop offset="100%" stopColor={potRim} />
        </linearGradient>
        <radialGradient id="fav-leafGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#C9E4D0" />
          <stop offset="100%" stopColor={stemColor} />
        </radialGradient>
        <radialGradient id="fav-budGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
          <stop offset="60%" stopColor={petalColor} />
          <stop offset="100%" stopColor={petalDeep} />
        </radialGradient>
      </defs>

      {/* Pot — always visible */}
      <path
        d="M 62 168 Q 62 200 100 200 Q 138 200 138 168 L 132 150 L 68 150 Z"
        fill="url(#fav-potGrad)"
      />
      <ellipse cx="100" cy="150" rx="34" ry="6" fill={potRim} />
      <ellipse cx="100" cy="148" rx="32" ry="4.5" fill={potColor} />
      <ellipse cx="78" cy="172" rx="3" ry="14" fill="#fff" opacity="0.25" />

      {/* Seed: soil + seed dot */}
      {stage === 'seed' && (
        <>
          <ellipse cx="100" cy="148" rx="16" ry="5" fill="#C4A882" opacity="0.6" />
          <ellipse cx="100" cy="145" rx="4" ry="3" fill="#8B6F47" opacity="0.8" />
        </>
      )}

      {/* Sprout: short stem + tiny leaves */}
      {stage === 'sprout' && (
        <>
          <path
            d="M 100 148 Q 99 137 100 122"
            stroke={stemColor}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="93" cy="134" rx="7" ry="4" fill="url(#fav-leafGrad)" transform="rotate(-25 93 134)" />
          <ellipse cx="108" cy="128" rx="6" ry="3.5" fill="url(#fav-leafGrad)" transform="rotate(20 108 128)" />
        </>
      )}

      {/* Bud / Bloom / Superbloom: full stem */}
      {showFullStem && (
        <path
          d="M 100 150 Q 96 130 100 110 Q 104 100 100 90"
          stroke={stemColor}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Leaves: bud+ */}
      {showLeaves && (
        <>
          <ellipse cx="82" cy="128" rx="14" ry="8" fill="url(#fav-leafGrad)" transform="rotate(-30 82 128)" />
          <ellipse cx="118" cy="120" rx="12" ry="7" fill="url(#fav-leafGrad)" transform="rotate(28 118 120)" />
          <path d="M 72 132 Q 82 128 92 124" stroke={stemColor} strokeWidth="1" fill="none" opacity="0.7" />
        </>
      )}

      {/* Bud: closed oval + calyx */}
      {showBud && (
        <>
          <ellipse cx={100} cy={94} rx={11} ry={7} fill="#90C4A4" />
          <ellipse cx={100} cy={76} rx={13} ry={20} fill="url(#fav-budGrad)" />
          <ellipse cx={96} cy={70} rx={4} ry={7} fill="#fff" opacity={0.25} />
        </>
      )}

      {/* Bloom / Superbloom: open petals + face */}
      {showBloom && (
        <>
          {Array.from({ length: petalCount }, (_, i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy - 26}
              rx={petalRx}
              ry={petalRy}
              fill="url(#fav-petalGrad)"
              transform={`rotate(${(i * 360) / petalCount} ${cx} ${cy})`}
              stroke={activePetalDeep}
              strokeWidth="0.5"
              strokeOpacity="0.4"
            />
          ))}
          <circle cx={cx} cy={cy} r="18" fill="url(#fav-centerGrad)" />
          <circle cx={cx} cy={cy} r="18" fill="none" stroke="#F2D87A" strokeWidth="0.8" opacity="0.6" />
          <ellipse cx={cx - 9} cy={cy + 3} rx="3.5" ry="2.2" fill="#FFB7C5" opacity="0.85" />
          <ellipse cx={cx + 9} cy={cy + 3} rx="3.5" ry="2.2" fill="#FFB7C5" opacity="0.85" />
          <path d={`M ${cx - 7} ${cy - 2} q 2 -3 4 0`} stroke="#3A2F40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M ${cx + 3} ${cy - 2} q 2 -3 4 0`} stroke="#3A2F40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M ${cx - 3} ${cy + 4} q 3 3 6 0`} stroke="#3A2F40" strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* Superbloom extras */}
          {isSuperbloom && (
            <>
              <circle cx="68" cy="60" r="3" fill="#FFD700" opacity="0.8" />
              <circle cx="132" cy="65" r="2.5" fill="#FFB7C5" opacity="0.8" />
              <circle cx="76" cy="45" r="2" fill="#E0C3FC" opacity="0.8" />
              <circle cx="124" cy="50" r="2" fill="#FFD700" opacity="0.7" />
              <ellipse cx={cx - 11} cy={cy + 5} rx="5" ry="3" fill="#FF8FAB" opacity="0.3" />
              <ellipse cx={cx + 11} cy={cy + 5} rx="5" ry="3" fill="#FF8FAB" opacity="0.3" />
            </>
          )}
        </>
      )}
    </motion.svg>
  );
}
