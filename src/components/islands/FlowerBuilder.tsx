import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onAuthStateChanged, auth } from '@/lib/auth';
import { getUserProfile, updateFlowerConfig } from '@/lib/firestore';
import {
  PETAL_SWATCHES, POT_SWATCHES, CHARMS,
  resolvePetalSwatch, resolvePotSwatch,
} from '@/lib/flower-parts';
import KawaiiFlower from './KawaiiFlower';
import { BloomIcon } from './BloomIcons';

const C = {
  ink: '#5A4A5C', inkSoft: '#7A6880',
  pink: '#FFB7C5', pinkDeep: '#FF8FAB', pinkSoft: '#FFD4E0',
  lavSoft: '#EBDDFC',
  shadowSoft: '0 4px 14px rgba(180,120,160,0.08)',
  shadowDark: '0 8px 18px rgba(90,74,92,0.28)',
};
const FONT = `'Quicksand','Nunito',-apple-system,sans-serif`;

type Tab = 'Petals' | 'Pot' | 'Charms';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'Petals', icon: 'petal',    label: 'Pétalos' },
  { id: 'Pot',    icon: 'drop',     label: 'Maceta' },
  { id: 'Charms', icon: 'sparkle',  label: 'Charms' },
];

function Skeleton() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, #F4E4FF 0%, #FFE4F0 100%)',
      fontFamily: FONT,
    }}>
      <div style={{ fontSize: 40, animation: 'flowerBob 1.2s ease-in-out infinite' }}>🌸</div>
    </div>
  );
}

export default function FlowerBuilder() {
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [tab, setTab] = useState<Tab>('Petals');
  const [selectedPetal, setSelectedPetal] = useState('sakura');
  const [selectedPot, setSelectedPot] = useState('terra');
  const [selectedCharm, setSelectedCharm] = useState('none');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.href = '/login'; return; }
      setUid(user.uid);
      const p = await getUserProfile(user.uid);
      if (p?.flowerConfig) {
        if (p.flowerConfig.petals) setSelectedPetal(p.flowerConfig.petals);
        if (p.flowerConfig.base) setSelectedPot(p.flowerConfig.base);
        if (p.flowerConfig.accessories?.[0]) setSelectedCharm(p.flowerConfig.accessories[0]);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleSave() {
    if (!uid) return;
    setSaving(true);
    await updateFlowerConfig(uid, {
      petals: selectedPetal,
      base: selectedPot,
      accessories: selectedCharm === 'none' ? [] : [selectedCharm],
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (loading) return <Skeleton />;

  const petalSwatch = resolvePetalSwatch(selectedPetal);
  const potSwatch = resolvePotSwatch(selectedPot);
  const charm = CHARMS.find((c) => c.id === selectedCharm) ?? CHARMS[0];

  return (
    <div style={{
      minHeight: '100vh', fontFamily: FONT,
      background: 'linear-gradient(180deg, #F4E4FF 0%, #FFE4F0 100%)',
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{
        padding: '52px 20px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <a
          href="/"
          style={{ display: 'flex', textDecoration: 'none' }}
          aria-label="Volver"
        >
          <BloomIcon name="back" size={40} />
        </a>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Mi flor</div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: 40, height: 40, borderRadius: 14, border: 'none',
            background: saved ? '#A8DEBA' : C.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: C.shadowDark, cursor: saving ? 'wait' : 'pointer',
            transition: 'background 0.3s',
          }}
          aria-label="Guardar"
        >
          <BloomIcon name="check" size={20} style={{ filter: 'brightness(0) invert(1)' }} />
        </button>
      </div>

      {/* Preview card */}
      <div style={{
        margin: '16px 20px 0',
        background: 'rgba(255,255,255,0.55)',
        borderRadius: 24, padding: '12px 16px',
        backdropFilter: 'blur(10px)',
        position: 'relative', overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.8)',
        height: 230,
      }}>
        {/* PREVIEW label */}
        <div style={{
          position: 'absolute', top: 12, left: 14, zIndex: 2,
          fontSize: 10, fontWeight: 800, color: C.pinkDeep, letterSpacing: '0.6px',
          background: '#fff', padding: '4px 10px', borderRadius: 10,
          boxShadow: C.shadowSoft,
        }}>
          PREVIEW
        </div>

        {/* Flower + charm */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          height: '100%', paddingTop: 14, position: 'relative',
          filter: 'drop-shadow(0 12px 20px rgba(255,105,180,0.2))',
        }}>
          <KawaiiFlower
            size={185}
            faceVariant="happy"
            petalColor={petalSwatch.color}
            petalDeep={petalSwatch.deep}
            potColor={potSwatch.color}
            potRim={potSwatch.rim}
          />
          {charm.emoji && (
            <div style={{
              position: 'absolute', top: 32, right: 72,
              fontSize: 28,
              animation: 'flowerBob 3.2s ease-in-out infinite',
            }}>
              {charm.emoji}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        margin: '14px 20px 0',
        display: 'flex', gap: 6,
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 14, padding: 4,
      }}>
        {TABS.map((t) => {
          const isActive = t.id === tab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                background: isActive ? C.ink : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                boxShadow: isActive ? '0 4px 10px rgba(90,74,92,0.22)' : 'none',
                cursor: 'pointer', fontFamily: FONT,
                transition: 'background 0.2s',
              }}
            >
              <BloomIcon
                name={t.icon}
                size={16}
                style={isActive ? { filter: 'brightness(0) invert(1)' } : { opacity: 0.7 }}
              />
              <span style={{ fontSize: 12, fontWeight: 800, color: isActive ? '#fff' : C.inkSoft }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          style={{ margin: '14px 20px 0' }}
        >
          {tab === 'Petals' && (
            <div style={{
              padding: 14, background: 'rgba(255,255,255,0.75)',
              borderRadius: 20, backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 12,
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.ink, letterSpacing: '0.5px' }}>
                  COLOR DE PÉTALOS
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft }}>
                  {petalSwatch.name}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {PETAL_SWATCHES.map((s) => {
                  const isSel = s.id === selectedPetal;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedPetal(s.id)}
                      style={{
                        background: '#fff', borderRadius: 14, padding: 8,
                        border: isSel ? `2.5px solid ${C.pinkDeep}` : '2px solid #fff',
                        boxShadow: isSel ? '0 6px 12px rgba(255,105,180,0.22)' : C.shadowSoft,
                        cursor: 'pointer', position: 'relative',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                      }}
                      aria-label={s.name}
                      aria-pressed={isSel}
                    >
                      {isSel && (
                        <div style={{ position: 'absolute', top: -6, right: -6, zIndex: 1 }}>
                          <BloomIcon name="check" size={18} />
                        </div>
                      )}
                      <div style={{
                        width: '100%', aspectRatio: '1 / 1', borderRadius: 10,
                        background: `radial-gradient(circle at 35% 35%, #fff8 0%, ${s.color} 50%, ${s.deep} 100%)`,
                        border: `1.5px solid ${s.deep}33`,
                      }} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'Pot' && (
            <div style={{
              padding: 14, background: 'rgba(255,255,255,0.75)',
              borderRadius: 20, backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 12,
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.ink, letterSpacing: '0.5px' }}>
                  COLOR DE MACETA
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.inkSoft }}>
                  {potSwatch.name}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {POT_SWATCHES.map((s) => {
                  const isSel = s.id === selectedPot;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedPot(s.id)}
                      style={{
                        background: '#fff', borderRadius: 14, padding: 10,
                        border: isSel ? `2.5px solid ${C.pinkDeep}` : '2px solid #fff',
                        boxShadow: isSel ? '0 6px 12px rgba(255,105,180,0.22)' : C.shadowSoft,
                        cursor: 'pointer', textAlign: 'center', position: 'relative',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                      }}
                      aria-label={s.name}
                      aria-pressed={isSel}
                    >
                      {isSel && (
                        <div style={{ position: 'absolute', top: -6, right: -6, zIndex: 1 }}>
                          <BloomIcon name="check" size={18} />
                        </div>
                      )}
                      <svg width="56" height="44" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto' }}>
                        <path
                          d="M5 10 H19 L17 20 Q17 21 16 21 H8 Q7 21 7 20 Z"
                          fill={s.color} stroke="#4A3D4D" strokeWidth="1.4"
                        />
                        <rect x="4" y="8" width="16" height="3" rx="1" fill={s.rim} stroke="#4A3D4D" strokeWidth="1.3" />
                      </svg>
                      <div style={{ fontSize: 11, fontWeight: 800, color: C.ink, marginTop: 4 }}>{s.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'Charms' && (
            <div style={{
              padding: 14, background: 'rgba(255,255,255,0.75)',
              borderRadius: 20, backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: C.ink, letterSpacing: '0.5px', marginBottom: 12 }}>
                ELIGE UN CHARM
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CHARMS.map((ch) => {
                  const isSel = ch.id === selectedCharm;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedCharm(ch.id)}
                      style={{
                        background: '#fff', borderRadius: 14, padding: '10px 14px',
                        border: isSel ? `2.5px solid ${C.pinkDeep}` : '2px solid #fff',
                        boxShadow: isSel ? '0 6px 12px rgba(255,105,180,0.18)' : C.shadowSoft,
                        display: 'flex', alignItems: 'center', gap: 12,
                        cursor: 'pointer', textAlign: 'left', fontFamily: FONT,
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                        width: '100%',
                      }}
                      aria-pressed={isSel}
                    >
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: ch.emoji ? C.lavSoft : '#FFF0F4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: 24,
                      }}>
                        {ch.emoji ?? (
                          <div style={{ width: 18, height: 2, borderRadius: 1, background: C.inkSoft, opacity: 0.4 }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{ch.label}</div>
                        <div style={{ fontSize: 11, color: C.inkSoft, marginTop: 1 }}>{ch.sub}</div>
                      </div>
                      {isSel && <BloomIcon name="check" size={22} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Saved toast */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
              background: C.ink, color: '#fff',
              padding: '10px 20px', borderRadius: 20,
              fontSize: 13, fontWeight: 800, fontFamily: FONT,
              boxShadow: C.shadowDark, zIndex: 50,
              whiteSpace: 'nowrap',
            }}
          >
            ¡Guardado! 🌸
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
