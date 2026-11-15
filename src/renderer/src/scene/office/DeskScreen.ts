import { Container, Graphics, Sprite } from 'pixi.js';
import type { TiledMapRenderer } from './TiledMapRenderer';
import type { MonitorConfig } from './themeRegistry';

// The office tileset ships every desk PC twice: a dark, switched-off monitor
// (gids 365/366 + 381/382 — what the map paints) and the SAME monitor with a
// lit blue desktop (367/368 + 383/384). DeskScreen overlays the lit variant on
// a desk's monitor block while its agent is seated, plus a tiny screen-life
// animation (scrolling lines + a blinking cursor) so the PC visibly works when
// its owner does. Hidden, the map's off art shows through — no state to undo.

/** gid of the OFF monitor block's top-left tile, as painted in the office map.
 *  Default for the office theme; a theme supplies its own via MonitorConfig. */
export const MONITOR_OFF_TOPLEFT_GID = 365;
/** Matching ON tiles for the office theme, laid out 2×2 directly right of the
 *  off block — used when no per-theme MonitorConfig is passed. */
const DEFAULT_ON_GIDS: ReadonlyArray<readonly [number, number, number]> = [
  // [gid, dx, dy] in tiles relative to the block's top-left
  [367, 0, 0], [368, 1, 0],
  [383, 0, 1], [384, 1, 1]
];

/** Screen interior of the 2×2 (32×32px) block, in local pixels — where the
 *  blue desktop is drawn in the tile art. The animation stays inside it. */
const SCREEN = { x: 3, y: 5, w: 25, h: 12 };

export class DeskScreen {
  readonly container = new Container();
  private anim = new Graphics();
  private on = false;
  private t = 0;

  constructor(mapRenderer: TiledMapRenderer, topLeft: { x: number; y: number }, monitor?: MonitorConfig) {
    const ts = mapRenderer.tileSize;
    const onGids = monitor?.onGids ?? DEFAULT_ON_GIDS;
    for (const [gid, dx, dy] of onGids) {
      const tex = mapRenderer.textureForGid(gid);
      if (!tex) continue;
      const s = new Sprite(tex);
      s.x = dx * ts;
      s.y = dy * ts;
      this.container.addChild(s);
    }
    this.anim.eventMode = 'none';
    this.container.addChild(this.anim);
    this.container.x = topLeft.x * ts;
    this.container.y = topLeft.y * ts;
    // Sort with the characters: the block's bottom edge sits above the seated
    // agent's anchor row, so the avatar's head draws over the keyboard, not
    // under it — same painter's order the map art implies.
    this.container.zIndex = (topLeft.y + 2) * ts - 1;
    this.container.visible = true; // Always visible so modern screen art is displayed
    this.container.eventMode = 'none';
  }

  /** Light the screen (agent sat down) or switch to standby (stood up / left). */
  setOn(on: boolean): void {
    if (on === this.on) return;
    this.on = on;
    this.t = 0;
  }

  update(dt: number): void {
    this.t += dt;
    const g = this.anim;
    g.clear();

    if (this.on) {
      // ─── Active modern IDE / developer display ─────────────────────────────
      // 1. Sleek dark OLED surface
      g.roundRect(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, 1)
        .fill({ color: 0x070c16, alpha: 0.98 })
        .stroke({ color: 0x1e293b, width: 1 });

      // 2. Top window bar with 3 mini macOS traffic light dots
      g.rect(SCREEN.x, SCREEN.y, SCREEN.w, 3).fill({ color: 0x0f172a, alpha: 0.95 });
      g.rect(SCREEN.x + 2, SCREEN.y + 1, 1, 1).fill({ color: 0xff5f56 }); // red
      g.rect(SCREEN.x + 4, SCREEN.y + 1, 1, 1).fill({ color: 0xffbd2e }); // yellow
      g.rect(SCREEN.x + 6, SCREEN.y + 1, 1, 1).fill({ color: 0x27c93f }); // green
      // Active tab marker
      g.rect(SCREEN.x + 9, SCREEN.y + 1, 6, 1).fill({ color: 0x38bdf8, alpha: 0.8 });

      // 3. Multi-colored syntax code lines (Modern VS Code aesthetic)
      // Line 1: Keyword + function
      g.rect(SCREEN.x + 2, SCREEN.y + 4, 3, 1).fill({ color: 0x38bdf8 });
      g.rect(SCREEN.x + 6, SCREEN.y + 4, 6, 1).fill({ color: 0xf1f5f9 });
      g.rect(SCREEN.x + 13, SCREEN.y + 4, 4, 1).fill({ color: 0xa78bfa });

      // Line 2: String + variable
      g.rect(SCREEN.x + 4, SCREEN.y + 6, 5, 1).fill({ color: 0x34d399 });
      g.rect(SCREEN.x + 10, SCREEN.y + 6, 7, 1).fill({ color: 0xfbbf24 });

      // Line 3: Live typing animation with glowing cyan cursor
      const typeW = 3 + (Math.floor(this.t * 3.5) % 9);
      g.rect(SCREEN.x + 4, SCREEN.y + 8, typeW, 1).fill({ color: 0x38bdf8, alpha: 0.9 });
      if (Math.floor(this.t * 3) % 2 === 0) {
        g.rect(SCREEN.x + 4 + typeW + 1, SCREEN.y + 8, 1, 1).fill({ color: 0x00f0ff });
      }

      // Line 4: Terminal status line & bottom-right green activity bar
      g.rect(SCREEN.x + 2, SCREEN.y + 10, 5, 1).fill({ color: 0x64748b });
      g.rect(SCREEN.x + SCREEN.w - 5, SCREEN.y + 10, 3, 1).fill({ color: 0x10b981 });
    } else {
      // ─── Standby modern ambient screen (clean & sleek) ─────────────────────
      g.roundRect(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, 1)
        .fill({ color: 0x060911, alpha: 0.95 });

      // Subtle minimalist digital clock in the center
      g.rect(SCREEN.x + 8, SCREEN.y + 5, 3, 1).fill({ color: 0x334155 });
      g.rect(SCREEN.x + 12, SCREEN.y + 5, 1, 1).fill({ color: 0x0ea5e9, alpha: 0.7 });
      g.rect(SCREEN.x + 14, SCREEN.y + 5, 3, 1).fill({ color: 0x334155 });

      // Soft standby cyan LED in the bottom right corner
      if (Math.floor(this.t * 1.5) % 2 === 0) {
        g.rect(SCREEN.x + SCREEN.w - 3, SCREEN.y + SCREEN.h - 2, 1, 1).fill({ color: 0x0ea5e9, alpha: 0.8 });
      }
    }
  }

  destroy(): void {
    this.container.destroy({ children: true });
  }
}
