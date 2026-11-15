---
name: web-game-engine
description: 2D HTML5 Canvas game engine architecture, requestAnimationFrame game loops, collision detection, keyboard/touch input, sound effects via Web Audio API, and high-score state.
license: MIT
---

# Web Game Engine & Canvas Architecture Skill

## Purpose
Build fluid, 60 FPS interactive 2D HTML5 canvas games (Racing, Chess, Ludo, Snake, Pong, Arcade) with zero external physics library dependencies.

## Architecture Guidelines
1. **Rock-Solid Game Loop:**
   - Always use `requestAnimationFrame` with delta-time (`dt`) calculation to ensure consistent game speed regardless of monitor refresh rate (60Hz vs 144Hz).
   - Clear canvas each frame: `ctx.clearRect(0, 0, canvas.width, canvas.height)`.

2. **Responsive Canvas Auto-Scaling:**
   - Handle device pixel ratio (HiDPI / Retina):
     ```javascript
     const dpr = window.devicePixelRatio || 1;
     canvas.width = rect.width * dpr;
     canvas.height = rect.height * dpr;
     ctx.scale(dpr, dpr);
     ```

3. **Input Handling (Zero Stuck Keys):**
   - Bind `keydown` and `keyup` on `window`. Maintain an `activeKeys = new Set()` to track held keys.
   - Prevent default arrow key / Space bar scrolling: `if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) e.preventDefault();`.
   - Add on-screen touch buttons for mobile/tablet gameplay.

4. **Web Audio API Sound Effects (Zero External Audio Assets):**
   - Synthesize sound effects natively with `AudioContext`:
     ```javascript
     function playBeep(freq = 440, duration = 0.1, type = 'sine') {
       try {
         const ctx = new (window.AudioContext || window.webkitAudioContext)();
         const osc = ctx.createOscillator();
         const gain = ctx.createGain();
         osc.type = type;
         osc.frequency.value = freq;
         gain.gain.setValueAtTime(0.1, ctx.currentTime);
         gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
         osc.connect(gain);
         gain.connect(ctx.destination);
         osc.start();
         osc.stop(ctx.currentTime + duration);
       } catch (e) { /* ignore audio failure */ }
     }
     ```

5. **State Management & HUD:**
   - Keep game states clean: `'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER'`.
   - Render HUD (Score, Level, Lives, High-Score) on canvas or as HTML overlay.
   - Persist best score in `localStorage`.
