import { useState, useEffect } from 'react';
import { onAuthStateChanged, auth } from '@/lib/auth';
import { getUserProfile, updateSoundEnabled } from '@/lib/firestore';
import { getSoundEnabled, setSoundEnabled } from '@/lib/sounds';
import { resolvePetalSwatch } from '@/lib/flower-parts';
import FlowerAvatar from './FlowerAvatar';
import { BloomIcon } from './BloomIcons';
import type { UserProfile } from '@/lib/firestore';

const C = {
  ink: '#5A4A5C',
  inkSoft: '#7A6880',
  pinkDeep: '#FF8FAB',
  bg: '#FFF5F7',
  bgTop: '#FFF0F6',
  shadowSoft: '0 4px 14px rgba(180,120,160,0.08)',
};
const FONT = `'Quicksand','Nunito',-apple-system,sans-serif`;

export default function MePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSoundOn(getSoundEnabled());
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.href = '/login'; return; }
      setUid(user.uid);
      const p = await getUserProfile(user.uid);
      setProfile(p);
      if (p?.soundEnabled !== undefined) {
        setSoundOn(p.soundEnabled);
        setSoundEnabled(p.soundEnabled);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleToggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (uid) updateSoundEnabled(uid, next).catch(() => {});
  }

  const petalSwatch = profile?.flowerConfig?.petals
    ? resolvePetalSwatch(profile.flowerConfig.petals)
    : null;
  const petalColor = petalSwatch?.color ?? '#FFB7C5';
  const petalDeep = petalSwatch?.deep ?? '#FF8FAB';

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${C.bgTop} 0%, ${C.bg} 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: FONT,
      }}>
        <div style={{ fontSize: 40, animation: 'flowerBob 1.2s ease-in-out infinite' }}>🌸</div>
      </div>
    );
  }

  const displayName = profile?.displayName || 'Bloom';

  return (
    <div style={{ minHeight: '100vh', background: `linear-gradient(180deg, ${C.bgTop} 0%, ${C.bg} 100%)`, fontFamily: FONT }}>
      <div style={{ maxWidth: 375, margin: '0 auto', paddingBottom: 32 }}>

        {/* Header */}
        <div style={{ padding: '52px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ display: 'flex', textDecoration: 'none' }}>
            <BloomIcon name="back" size={40} />
          </a>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Perfil</div>
          <div style={{ width: 40 }} />
        </div>

        {/* Profile hero */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 24px 20px' }}>
          <div style={{ filter: 'drop-shadow(0 10px 20px rgba(255,105,180,0.2))' }}>
            <FlowerAvatar pct={75} size={130} petalColor={petalColor} petalDeep={petalDeep} centerColor="#FFF4C3" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.ink, marginTop: 14 }}>{displayName}</div>
        </div>

        {/* Settings */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.inkSoft, letterSpacing: '0.6px', marginBottom: 10 }}>
            AJUSTES
          </div>

          {/* Sound toggle */}
          <div style={{
            background: '#fff', borderRadius: 20, padding: '16px 18px',
            boxShadow: C.shadowSoft, marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: soundOn ? '#FFF0F6' : '#F5F5F5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 22, transition: 'background 0.2s',
                }}>
                  {soundOn ? '🔔' : '🔕'}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Efectos de sonido</div>
                  <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>
                    {soundOn ? 'Activados' : 'Desactivados'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleSound}
                role="switch"
                aria-checked={soundOn}
                aria-label="Activar o desactivar efectos de sonido"
                style={{
                  width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: soundOn ? C.pinkDeep : '#D9D9D9',
                  position: 'relative', transition: 'background 0.2s', padding: 0, flexShrink: 0,
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3,
                  left: soundOn ? 23 : 3,
                  transition: 'left 0.2s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }} />
              </button>
            </div>
          </div>

          {/* Garden link */}
          <a href="/garden" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 20, padding: '16px 18px',
              boxShadow: C.shadowSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, background: '#FFF0F6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: 22,
                }}>
                  🌸
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>Personalizar flor</div>
                  <div style={{ fontSize: 12, color: C.inkSoft, marginTop: 2 }}>Pétalos, maceta y accesorios</div>
                </div>
              </div>
              <div style={{ fontSize: 20, color: C.pinkDeep, fontWeight: 800 }}>›</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
