// The Office cast — roster metadata + sprite frames.
//
// Both the static portraits (cards / picker) and the in-scene walking sprites are
// now fully custom-drawn from the same per-character recipes in portraitArt.ts:
// the scene sprite reuses the portrait's exact head/face/clothing and adds legs,
// so an agent on the office floor looks identical to its card. The LimeZu base
// sheets are no longer used for the cast. See assets/ATTRIBUTION.md.

import { Rectangle, Texture } from 'pixi.js';
import { paintPortrait, sceneFrameBufs, SCENE_W, SCENE_H } from './portraitArt';

import luffyWalkUrl from '@/assets/characters/luffy_walk.png';
import luffyAvatarUrl from '@/assets/characters/luffy_avatar_128.png';
import zoroWalkUrl from '@/assets/characters/zoro_walk.png';
import zoroAvatarUrl from '@/assets/characters/zoro_avatar_128.png';
import sanjiWalkUrl from '@/assets/characters/sanji_walk.png';
import sanjiAvatarUrl from '@/assets/characters/sanji_avatar_128.png';
import namiWalkUrl from '@/assets/characters/nami_walk.png';
import namiAvatarUrl from '@/assets/characters/nami_avatar_128.png';
import robinWalkUrl from '@/assets/characters/robin_walk.png';
import robinAvatarUrl from '@/assets/characters/robin_avatar_128.png';
import chopperWalkUrl from '@/assets/characters/chopper_walk.png';
import chopperAvatarUrl from '@/assets/characters/chopper_avatar_128.png';
import brookWalkUrl from '@/assets/characters/brook_walk.png';
import brookAvatarUrl from '@/assets/characters/brook_avatar_128.png';
import jinbeWalkUrl from '@/assets/characters/jinbe_walk.png';
import jinbeAvatarUrl from '@/assets/characters/jinbe_avatar_128.png';
import hancockWalkUrl from '@/assets/characters/hancock_walk.png';
import hancockAvatarUrl from '@/assets/characters/hancock_avatar_128.png';
import shanksWalkUrl from '@/assets/characters/shanks_walk.png';
import shanksAvatarUrl from '@/assets/characters/shanks_avatar_128.png';
import frankyWalkUrl from '@/assets/characters/franky_walk.png';
import frankyAvatarUrl from '@/assets/characters/franky_avatar_128.png';
import usoppWalkUrl from '@/assets/characters/usopp_walk.png';
import usoppAvatarUrl from '@/assets/characters/usopp_avatar_128.png';

export type OfficeCharacterName =
  | 'luffy' | 'zoro' | 'sanji' | 'nami' | 'robin' | 'chopper'
  | 'brook' | 'jinbe' | 'hancock' | 'shanks' | 'franky' | 'usopp'
  | 'michael' | 'jim' | 'pam' | 'dwight' | 'kevin' | 'angela'
  | 'oscar' | 'stanley' | 'phyllis' | 'andy' | 'kelly' | 'ryan'
  | 'toby' | 'creed' | 'meredith'
  | 'richard' | 'gilfoyle' | 'dinesh' | 'jared' | 'erlich' | 'bighead' | 'monica' | 'jianyang';

export interface CastMember {
  name: OfficeCharacterName;
  displayName: string;
  /** Signature accent color (hex) — used for the in-scene selection glow. */
  shirt: string;
  /** Blurb shown when this character is picked / has no description yet. */
  blurb: string;
  group?: 'central' | 'group1' | 'group2' | 'cafe';
  specialistRole?: 'orchestrator' | 'architect' | 'builder' | 'verifier' | 'waiter' | 'mascot';
  isAiWorker?: boolean;
  isVisualOnly?: boolean;
}

/** Selectable roster, in display order — One Piece Straw Hat Pirates & Allies. */
export const ONE_PIECE_CAST: CastMember[] = [
  // Central Orchestrator
  { name: 'luffy',   displayName: 'Luffy',   shirt: '#e63946', blurb: "Captain — I'm gonna be King of the Devs!", group: 'central', specialistRole: 'orchestrator', isAiWorker: true, isVisualOnly: false },

  // Group 1: Task A Squad
  { name: 'nami',    displayName: 'Nami',    shirt: '#f4a261', blurb: 'Group 1 Architect — Blueprint & DOM Contracts', group: 'group1', specialistRole: 'architect', isAiWorker: true, isVisualOnly: false },
  { name: 'zoro',    displayName: 'Zoro',    shirt: '#2a9d8f', blurb: 'Group 1 Builder — Full-Stack HTML/CSS/JS', group: 'group1', specialistRole: 'builder', isAiWorker: true, isVisualOnly: false },
  { name: 'sanji',   displayName: 'Sanji',   shirt: '#e9c46a', blurb: 'Group 1 Verifier — QA & Headless Browser Tester', group: 'group1', specialistRole: 'verifier', isAiWorker: true, isVisualOnly: false },
  { name: 'chopper', displayName: 'Chopper', shirt: '#ff006e', blurb: 'Group 1 Floor Mascot (Zero AI Calls)', group: 'group1', specialistRole: 'mascot', isAiWorker: false, isVisualOnly: true },
  { name: 'brook',   displayName: 'Brook',   shirt: '#3a0ca3', blurb: 'Group 1 Floor Mascot (Zero AI Calls)', group: 'group1', specialistRole: 'mascot', isAiWorker: false, isVisualOnly: true },

  // Group 2: Task B Squad
  { name: 'robin',   displayName: 'Robin',   shirt: '#8338ec', blurb: 'Group 2 Architect — Blueprint & DOM Contracts', group: 'group2', specialistRole: 'architect', isAiWorker: true, isVisualOnly: false },
  { name: 'shanks',  displayName: 'Shanks',  shirt: '#9b2226', blurb: 'Group 2 Builder — Full-Stack HTML/CSS/JS', group: 'group2', specialistRole: 'builder', isAiWorker: true, isVisualOnly: false },
  { name: 'hancock', displayName: 'Hancock', shirt: '#d90429', blurb: 'Group 2 Verifier — QA & Headless Browser Tester', group: 'group2', specialistRole: 'verifier', isAiWorker: true, isVisualOnly: false },
  { name: 'jinbe',   displayName: 'Jinbe',   shirt: '#0077b6', blurb: 'Group 2 Floor Mascot (Zero AI Calls)', group: 'group2', specialistRole: 'mascot', isAiWorker: false, isVisualOnly: true },
  { name: 'franky',  displayName: 'Franky',  shirt: '#48cae4', blurb: 'Group 2 Floor Mascot (Zero AI Calls)', group: 'group2', specialistRole: 'mascot', isAiWorker: false, isVisualOnly: true },

  // Office Café
  { name: 'usopp',   displayName: 'Usopp',   shirt: '#a7c957', blurb: 'Café Waiter — Serves Coffee & Snacks (Zero Dev AI Calls)', group: 'cafe', specialistRole: 'waiter', isAiWorker: false, isVisualOnly: false },
];

export const OFFICE_CAST: CastMember[] = ONE_PIECE_CAST;

/** Silicon Valley Tech / Hacker Roster */
export const SILICON_VALLEY_CAST: CastMember[] = [
  { name: 'richard',  displayName: 'Richard',  shirt: '#10b981', blurb: 'Pied Piper founder, algorithm wizard' },
  { name: 'gilfoyle', displayName: 'Gilfoyle', shirt: '#1e293b', blurb: 'Systems architect & security, crypto miner' },
  { name: 'dinesh',   displayName: 'Dinesh',   shirt: '#6366f1', blurb: 'Senior backend dev, Java champion' },
  { name: 'jared',    displayName: 'Jared',    shirt: '#38bdf8', blurb: 'Chief operating officer, loyal business lead' },
  { name: 'erlich',   displayName: 'Erlich',   shirt: '#f97316', blurb: 'Incubator boss, tech visionary' },
  { name: 'bighead',  displayName: 'Big Head', shirt: '#3b82f6', blurb: 'Co-founder, serendipitous tech giant' },
  { name: 'monica',   displayName: 'Monica',   shirt: '#ec4899', blurb: 'VC partner, strategic advisor' },
  { name: 'jianyang', displayName: 'Jian-Yang',shirt: '#e2e8f0', blurb: 'App builder, SeeFood innovator' },
];

export const ALL_CAST: CastMember[] = [...ONE_PIECE_CAST, ...SILICON_VALLEY_CAST];

export const CAST_BY_NAME: Record<OfficeCharacterName, CastMember> =
  Object.fromEntries([
    ...ALL_CAST.map((c) => [c.name, c]),
    // Aliases for backwards compatibility with any existing session data
    ['michael', ONE_PIECE_CAST[0]],
    ['jim', ONE_PIECE_CAST[2]],
    ['pam', ONE_PIECE_CAST[3]],
    ['dwight', ONE_PIECE_CAST[1]],
    ['kevin', ONE_PIECE_CAST[7]],
    ['angela', ONE_PIECE_CAST[4]],
    ['oscar', ONE_PIECE_CAST[6]],
    ['stanley', ONE_PIECE_CAST[10]],
    ['phyllis', ONE_PIECE_CAST[4]],
    ['andy', ONE_PIECE_CAST[11]],
    ['kelly', ONE_PIECE_CAST[8]],
    ['ryan', ONE_PIECE_CAST[9]],
    ['toby', ONE_PIECE_CAST[5]],
    ['creed', ONE_PIECE_CAST[6]],
    ['meredith', ONE_PIECE_CAST[3]],
  ]) as Record<OfficeCharacterName, CastMember>;

export const DEFAULT_CHARACTER: OfficeCharacterName = 'luffy';

export function hexToNumber(hex: string): number {
  return parseInt(hex.replace('#', ''), 16);
}

// ─── HD Assets Registry ──────────────────────────────────────────────────────
export const HD_WALK_SHEETS: Partial<Record<OfficeCharacterName, string>> = {
  luffy: luffyWalkUrl,
  zoro: zoroWalkUrl,
  sanji: sanjiWalkUrl,
  nami: namiWalkUrl,
  robin: robinWalkUrl,
  chopper: chopperWalkUrl,
  brook: brookWalkUrl,
  jinbe: jinbeWalkUrl,
  hancock: hancockWalkUrl,
  shanks: shanksWalkUrl,
  franky: frankyWalkUrl,
  usopp: usoppWalkUrl,

  // Aliases for backwards compatibility with any existing saved sessions
  michael: luffyWalkUrl,
  dwight: zoroWalkUrl,
  jim: sanjiWalkUrl,
  pam: namiWalkUrl,
  angela: robinWalkUrl,
  phyllis: robinWalkUrl,
  toby: chopperWalkUrl,
  oscar: brookWalkUrl,
  creed: brookWalkUrl,
  kevin: jinbeWalkUrl,
  kelly: hancockWalkUrl,
  ryan: shanksWalkUrl,
  stanley: frankyWalkUrl,
  andy: usoppWalkUrl,
  meredith: namiWalkUrl,
};

export const HD_PORTRAITS: Partial<Record<OfficeCharacterName, string>> = {
  luffy: luffyAvatarUrl,
  zoro: zoroAvatarUrl,
  sanji: sanjiAvatarUrl,
  nami: namiAvatarUrl,
  robin: robinAvatarUrl,
  chopper: chopperAvatarUrl,
  brook: brookAvatarUrl,
  jinbe: jinbeAvatarUrl,
  hancock: hancockAvatarUrl,
  shanks: shanksAvatarUrl,
  franky: frankyAvatarUrl,
  usopp: usoppAvatarUrl,

  // Aliases
  michael: luffyAvatarUrl,
  dwight: zoroAvatarUrl,
  jim: sanjiAvatarUrl,
  pam: namiAvatarUrl,
  angela: robinAvatarUrl,
  phyllis: robinAvatarUrl,
  toby: chopperAvatarUrl,
  oscar: brookAvatarUrl,
  creed: brookAvatarUrl,
  kevin: jinbeAvatarUrl,
  kelly: hancockAvatarUrl,
  ryan: shanksAvatarUrl,
  stanley: frankyAvatarUrl,
  andy: usoppAvatarUrl,
  meredith: namiAvatarUrl,
};

// ─── scene frames ────────────────────────────────────────────────────────────
const frameCache = new Map<OfficeCharacterName, Texture[][]>();

function loadTexture(url: string): Promise<Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const tex = Texture.from(img);
      resolve(tex);
    };
    img.onerror = () => reject(new Error('failed to load ' + url));
    img.src = url;
  });
}

async function loadHDFrames(url: string): Promise<Texture[][]> {
  const baseTex = await loadTexture(url);
  baseTex.source.scaleMode = 'linear';
  const FRAME_W = 48;
  const FRAME_H = 64;

  const sliceFrame = (r: number, c: number): Texture => {
    const t = new Texture({
      source: baseTex.source,
      frame: new Rectangle(c * FRAME_W, r * FRAME_H, FRAME_W, FRAME_H),
    });
    t.source.scaleMode = 'linear';
    return t;
  };

  const toRow = (r: number): Texture[] => {
    const stand = sliceFrame(r, 0);
    const stepL = sliceFrame(r, 1);
    const stepR = sliceFrame(r, 2);
    return [stand, stepL, stepR, stand, stand, stand, stand];
  };

  return [
    toRow(0), // down (front walk)
    toRow(1), // up (back walk)
    toRow(2), // right (side walk - left automatically flips row 2)
  ];
}

function bufToTexture(buf: Uint8ClampedArray): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = SCENE_W; canvas.height = SCENE_H;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(SCENE_W, SCENE_H);
  img.data.set(buf);
  ctx.putImageData(img, 0, 0);
  const tex = Texture.from(canvas);
  tex.source.scaleMode = 'nearest';
  return tex;
}

/**
 * Frame grid CharacterSprite expects: 3 rows (down, up, right) × 7 frames
 * [walk1, walk2, walk3, type1, type2, read1, read2].
 */
export async function getCastFrames(name: OfficeCharacterName): Promise<Texture[][]> {
  const cached = frameCache.get(name);
  if (cached) return cached;

  const hdSheet = HD_WALK_SHEETS[name];
  if (hdSheet) {
    try {
      const frames = await loadHDFrames(hdSheet);
      frameCache.set(name, frames);
      return frames;
    } catch (e) {
      console.warn(`Failed to load HD spritesheet for ${name}, using fallback:`, e);
    }
  }

  const bufs = sceneFrameBufs(name);
  const toRow = (bList: Uint8ClampedArray[]): Texture[] => {
    const [stand, stepL, stepR] = bList.map(bufToTexture);
    return [stand, stepL, stepR, stand, stand, stand, stand];
  };
  const frontRow = toRow(bufs.front);
  const backRow = toRow(bufs.back);
  const frames: Texture[][] = [frontRow, backRow, frontRow]; // down, up, right
  frameCache.set(name, frames);
  return frames;
}

/**
 * Paint a character's static portrait for cards / the picker.
 */
export async function paintCastPortrait(
  ctx: CanvasRenderingContext2D,
  name: OfficeCharacterName,
  scale = 1,
): Promise<void> {
  const hdPortrait = HD_PORTRAITS[name];
  if (hdPortrait) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
        resolve();
      };
      img.onerror = () => {
        paintPortrait(ctx, name, scale);
        resolve();
      };
      img.src = hdPortrait;
    });
  }
  paintPortrait(ctx, name, scale);
}
