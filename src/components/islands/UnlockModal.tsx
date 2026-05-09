import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlowerPart } from '@/lib/flower-parts';
import { playSound } from '@/lib/sounds';

const C = {
  ink: '#5A4A5C',
  inkSoft: '#7A6880',
  pink: '#FFB7C5',
  pinkDeep: '#FF8FAB',
  pinkSoft: '#FFD4E0',
  shadowDark: '0 8px 18px rgba(90,74,92,0.28)',
};
const FONT = `'Quicksand','Nunito',-apple-system,sans-serif`;

const TYPE_LABELS: Record<string, string> = {
  pot: 'Maceta',
  stem: 'Tallo',
  petals: 'Pétalos',
  face: 'Carita',
  accessory: 'Accesorio',
};

interface UnlockModalProps {
  parts: FlowerPart[];
  onDismiss: () => void;
}

export default function UnlockModal({ parts, onDismiss }: UnlockModalProps) {
  useEffect(() => {
    playSound('unlock');
  }, []);

  if (parts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(90, 74, 92, 0.45)',
          backdropFilter: 'blur(6px)',
          padding: '24px',
          fontFamily: FONT,
        }}
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          style={{
            background: '#fff',
            borderRadius: 28,
            padding: '32px 28px 28px',
            maxWidth: 340,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(90,74,92,0.25)',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Sparkle decoration */}
          <div style={{
            fontSize: 52,
            lineHeight: 1,
            marginBottom: 8,
            animation: 'flowerBob 2s ease-in-out infinite',
          }}>
            🌟
          </div>

          <div style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '2px',
            color: C.pinkDeep, marginBottom: 8, textTransform: 'uppercase',
          }}>
            ¡Nueva parte desbloqueada!
          </div>

          <div style={{
            fontSize: 22, fontWeight: 800, color: C.ink,
            letterSpacing: '-0.4px', marginBottom: 4,
          }}>
            ¡Lo lograste!
          </div>

          <div style={{
            fontSize: 13, color: C.inkSoft, marginBottom: 24, lineHeight: 1.5,
          }}>
            {parts.length === 1
              ? 'Completaste una semana y desbloqueaste una parte nueva'
              : `Completaste tu meta y desbloqueaste ${parts.length} partes nuevas`}
          </div>

          {/* Unlocked parts list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {parts.map((part) => (
              <div
                key={part.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: '#FFF5F7',
                  borderRadius: 16, padding: '14px 16px',
                  boxShadow: '0 4px 14px rgba(255,105,180,0.08)',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{part.preview}</div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: C.pinkDeep, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    {TYPE_LABELS[part.type] ?? part.type}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.ink, marginTop: 1 }}>{part.name}</div>
                  <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>{part.description}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onDismiss}
            style={{
              width: '100%',
              background: C.ink,
              color: '#fff',
              border: 'none',
              borderRadius: 22,
              padding: '16px 24px',
              fontSize: 15,
              fontWeight: 800,
              fontFamily: FONT,
              cursor: 'pointer',
              boxShadow: C.shadowDark,
            }}
          >
            ¡Genial! 🌸
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
