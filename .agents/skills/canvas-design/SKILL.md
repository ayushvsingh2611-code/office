---
name: canvas-design
description: Interactive visual rendering on HTML5 Canvas, mathematical generative art, particle systems, charts, graphs, and export to PNG.
license: MIT
---

# Canvas Design & Generative Visual Systems

## Purpose
Create high-performance, beautiful 2D canvas designs, generative visual simulations, particle backgrounds, and data charts with pure JavaScript.

## Core Rules
1. **Particle Systems:**
   - Pre-allocate particle objects in an array. Update positions with velocity and boundary bounce/wrap.
   - Use radial gradients for glowing particles:
     ```javascript
     const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
     grad.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
     grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
     ctx.fillStyle = grad;
     ```

2. **Charts & Graphs Without Heavy Libraries:**
   - Generate bar charts, line graphs, and pie charts with native Canvas 2D methods (`ctx.arc`, `ctx.lineTo`, `ctx.stroke`).
   - Draw coordinate axes with neat ticks, labels, and translucent grid lines.

3. **Export to PNG / Download:**
   - Provide 1-click image export:
     ```javascript
     function downloadCanvasImage(canvas, filename = 'canvas-art.png') {
       const link = document.createElement('a');
       link.download = filename;
       link.href = canvas.toDataURL('image/png');
       link.click();
     }
     ```
