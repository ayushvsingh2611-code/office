// Design tokens — single source of truth. Mirrors tokens.css for non-styled consumers (Pixi).
// Any change here must also update tokens.css.

export const colors = {
  cream: {
    50: 0x080c14,
    100: 0x0d1527,
    200: 0x141e36,
    300: 0x1e2c4d
  },
  paper: {
    100: 0x0f192e,
    200: 0x17233e
  },
  ink: {
    900: 0x00f0ff,
    700: 0xe2e8f0,
    500: 0x8fa3c7,
    300: 0x4b638b,
    100: 0x1e2d4e
  },
  // Cyberpunk Neon palette (mirrors tokens.css)
  accent: {
    coral: 0xff0055,
    coralLight: 0x3b0817,
    mint: 0x00ff9d,
    mintLight: 0x063622,
    sky: 0x00f0ff,
    skyLight: 0x053447,
    lemon: 0xffe600,
    lemonLight: 0x383204,
    lilac: 0xbd00ff,
    lilacLight: 0x2c0740,
    peach: 0xff7700,
    peachLight: 0x3d1b04
  },
  status: {
    idle: 0x64748b,
    thinking: 0x00f0ff,
    working: 0xffe600,
    blocked: 0xff0055,
    success: 0x00ff9d,
    ghost: 0x475569
  },
  world: {
    grassLight: 0xd4eab0,
    grassDark: 0xb5d589,
    woodLight: 0xe5c896,
    woodDark: 0xc9a66b,
    path: 0xe8d8b0,
    wall: 0x8b6f47
  }
} as const;

export const space = {
  0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64
} as const;

export const type = {
  display: '"Press Start 2P", monospace',
  ui: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace'
} as const;

export const tileSize = 32; // px — the world is built from 32×32 tiles

export type AccentColorName =
  | 'coral' | 'mint' | 'sky' | 'lemon' | 'lilac' | 'peach';

export const accentByName: Record<AccentColorName, number> = {
  coral: colors.accent.coral,
  mint:  colors.accent.mint,
  sky:   colors.accent.sky,
  lemon: colors.accent.lemon,
  lilac: colors.accent.lilac,
  peach: colors.accent.peach
};

export const accentLightByName: Record<AccentColorName, number> = {
  coral: colors.accent.coralLight,
  mint:  colors.accent.mintLight,
  sky:   colors.accent.skyLight,
  lemon: colors.accent.lemonLight,
  lilac: colors.accent.lilacLight,
  peach: colors.accent.peachLight
};

// Convert 0xRRGGBB to "#RRGGBB"
export function hex(c: number): string {
  return '#' + c.toString(16).padStart(6, '0').toUpperCase();
}
