/**
 * Web Audio API Sound Effect Generator
 */

let soundEnabled = true;
let masterVolume = 0.8;
let audioCtx = null;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
};

export const setVolume = (vol) => {
  masterVolume = Math.max(0, Math.min(100, vol)) / 100;
};

/**
 * Plays synthesized sound effects
 * @param {'roll'|'move'|'capture'|'win'|'safe'} effectName 
 */
export const playSound = (effectName) => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(masterVolume, now);
  gainNode.connect(ctx.destination);

  if (effectName === 'roll') {
    // Dice clatter sound
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200 + Math.random() * 300, now + i * 0.06);
      oscGain.gain.setValueAtTime(masterVolume * 0.3, now + i * 0.06);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.05);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.05);
    }
  } else if (effectName === 'move') {
    // Soft pop step
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
    gainNode.gain.setValueAtTime(masterVolume * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (effectName === 'capture') {
    // Capturing zap sound
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
    gainNode.gain.setValueAtTime(masterVolume * 0.6, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.25);
  } else if (effectName === 'safe') {
    // Chime
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    gainNode.gain.setValueAtTime(masterVolume * 0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (effectName === 'win') {
    // Victory fanfare arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);
      noteGain.gain.setValueAtTime(masterVolume * 0.5, now + idx * 0.15);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.3);
      osc.connect(noteGain);
      noteGain.connect(ctx.destination);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.3);
    });
  }
};
