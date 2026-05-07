interface KawaiiFlowerProps {
  size?: number;
  petalColor?: string;
  petalDeep?: string;
  centerColor?: string;
  leafColor?: string;
  potColor?: string;
  potRim?: string;
  stemColor?: string;
  faceVariant?: 'happy' | 'sleepy' | 'kissy' | 'neutral';
  bouncy?: boolean;
  petals?: number;
}

export default function KawaiiFlower({
  size = 200,
  petalColor = '#FFB7C5',
  petalDeep = '#FF8FAB',
  centerColor = '#FFF4C3',
  leafColor = '#A8D5BA',
  potColor = '#E5B299',
  potRim = '#D49B82',
  stemColor = '#A8D5BA',
  faceVariant = 'happy',
  bouncy = true,
  petals = 6,
}: KawaiiFlowerProps) {
  const cx = 100;
  const cy = 90;
  const petalArr = Array.from({ length: petals }, (_, i) => i);

  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      style={{
        overflow: 'visible',
        animation: bouncy ? 'flowerBob 3.6s ease-in-out infinite' : 'none',
      }}
    >
      <defs>
        <radialGradient id="bf-petalGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="60%" stopColor={petalColor} />
          <stop offset="100%" stopColor={petalDeep} />
        </radialGradient>
        <radialGradient id="bf-centerGrad" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FFFBE0" />
          <stop offset="100%" stopColor={centerColor} />
        </radialGradient>
        <linearGradient id="bf-potGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={potColor} />
          <stop offset="100%" stopColor={potRim} />
        </linearGradient>
        <radialGradient id="bf-leafGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#C9E4D0" />
          <stop offset="100%" stopColor={leafColor} />
        </radialGradient>
      </defs>

      {/* Pot */}
      <path
        d="M 62 168 Q 62 200 100 200 Q 138 200 138 168 L 132 150 L 68 150 Z"
        fill="url(#bf-potGrad)"
      />
      <ellipse cx="100" cy="150" rx="34" ry="6" fill={potRim} />
      <ellipse cx="100" cy="148" rx="32" ry="4.5" fill={potColor} />
      <ellipse cx="78" cy="172" rx="3" ry="14" fill="#fff" opacity="0.25" />

      {/* Stem */}
      <path
        d="M 100 150 Q 96 130 100 110 Q 104 100 100 90"
        stroke={stemColor}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Leaves */}
      <ellipse cx="82" cy="128" rx="14" ry="8" fill="url(#bf-leafGrad)" transform="rotate(-30 82 128)" />
      <ellipse cx="118" cy="120" rx="12" ry="7" fill="url(#bf-leafGrad)" transform="rotate(28 118 120)" />
      <path d="M 72 132 Q 82 128 92 124" stroke={leafColor} strokeWidth="1" fill="none" opacity="0.7" />

      {/* Petals */}
      {petalArr.map((i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy - 26}
          rx="14"
          ry="22"
          fill="url(#bf-petalGrad)"
          transform={`rotate(${(i * 360) / petals} ${cx} ${cy})`}
          stroke={petalDeep}
          strokeWidth="0.5"
          strokeOpacity="0.4"
        />
      ))}

      {/* Center disc */}
      <circle cx={cx} cy={cy} r="18" fill="url(#bf-centerGrad)" />
      <circle cx={cx} cy={cy} r="18" fill="none" stroke="#F2D87A" strokeWidth="0.8" opacity="0.6" />

      {/* Cheeks */}
      <ellipse cx={cx - 9} cy={cy + 3} rx="3.5" ry="2.2" fill="#FFB7C5" opacity="0.85" />
      <ellipse cx={cx + 9} cy={cy + 3} rx="3.5" ry="2.2" fill="#FFB7C5" opacity="0.85" />

      {/* Eyes */}
      {faceVariant === 'happy' && (
        <>
          <path d={`M ${cx - 7} ${cy - 2} q 2 -3 4 0`} stroke="#3A2F40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M ${cx + 3} ${cy - 2} q 2 -3 4 0`} stroke="#3A2F40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      )}
      {faceVariant === 'sleepy' && (
        <>
          <path d={`M ${cx - 7} ${cy - 1} q 2 2 4 0`} stroke="#3A2F40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M ${cx + 3} ${cy - 1} q 2 2 4 0`} stroke="#3A2F40" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      )}
      {faceVariant === 'kissy' && (
        <>
          <circle cx={cx - 5} cy={cy - 1} r="1.3" fill="#3A2F40" />
          <circle cx={cx + 5} cy={cy - 1} r="1.3" fill="#3A2F40" />
        </>
      )}
      {faceVariant === 'neutral' && (
        <>
          <circle cx={cx - 5} cy={cy - 1} r="1.5" fill="#3A2F40" />
          <circle cx={cx + 5} cy={cy - 1} r="1.5" fill="#3A2F40" />
        </>
      )}

      {/* Mouth */}
      {faceVariant === 'kissy' ? (
        <ellipse cx={cx} cy={cy + 5} rx="1.6" ry="2.2" fill="#FF6F91" />
      ) : (
        <path
          d={`M ${cx - 3} ${cy + 4} q 3 3 6 0`}
          stroke="#3A2F40"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
