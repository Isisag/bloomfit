type SoundType = 'complete' | 'unlock' | 'goal';

interface Note {
  freq: number;
  start: number;
  duration: number;
}

let ctx: AudioContext | null = null;

const NOTES: Record<SoundType, Note[]> = {
  complete: [
    { freq: 523.25, start: 0,   duration: 0.14 },
    { freq: 659.25, start: 0.1, duration: 0.14 },
    { freq: 783.99, start: 0.2, duration: 0.22 },
  ],
  unlock: [
    { freq: 523.25, start: 0,    duration: 0.09 },
    { freq: 659.25, start: 0.09, duration: 0.09 },
    { freq: 783.99, start: 0.18, duration: 0.09 },
    { freq: 1046.5, start: 0.27, duration: 0.28 },
  ],
  goal: [
    { freq: 523.25, start: 0,   duration: 0.10 },
    { freq: 659.25, start: 0.1, duration: 0.10 },
    { freq: 783.99, start: 0.2, duration: 0.10 },
    { freq: 1046.5, start: 0.3, duration: 0.28 },
    { freq: 1318.5, start: 0.5, duration: 0.45 },
  ],
};

export function getSoundEnabled(): boolean {
  try {
    return localStorage.getItem('bloomfit-sound') !== 'false';
  } catch {
    return true;
  }
}

export function setSoundEnabled(val: boolean): void {
  try {
    localStorage.setItem('bloomfit-sound', String(val));
  } catch { /* localStorage unavailable */ }
}

export async function playSound(type: SoundType): Promise<void> {
  if (!getSoundEnabled()) return;
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
    const now = ctx.currentTime;
    for (const note of NOTES[type]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = note.freq;
      gain.gain.setValueAtTime(0.16, now + note.start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.duration);
      osc.start(now + note.start);
      osc.stop(now + note.start + note.duration + 0.05);
    }
  } catch {
    // AudioContext unavailable or blocked by browser policy
  }
}
