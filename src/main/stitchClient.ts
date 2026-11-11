/**
 * Google Stitch AI UI Design Client Bridge for Panda Hive.
 *
 * Dedicated UI engine powered by Google Stitch API Key:
 * - Generates high-fidelity, designer-grade frontend interfaces
 * - Bespoke brand themes (Zepto, Instamart, Modern SaaS, Dark Mode, etc.)
 * - Zero watermarks or bot disclaimers
 * - Seamless integration with Franky (UI Engineer) in Milestone 4
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

let cachedStitchKey: string | null = null;

export function getStitchApiKey(): string | null {
  if (cachedStitchKey) return cachedStitchKey;

  const envVal = process.env.STITCH_API_KEY;
  if (envVal && envVal.trim().length > 10) {
    cachedStitchKey = envVal.trim();
    return cachedStitchKey;
  }

  try {
    const envPath = join(process.cwd(), '.env');
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf8');
      const match = content.match(/STITCH_API_KEY\s*=\s*([^\r\n]+)/);
      if (match && match[1]) {
        cachedStitchKey = match[1].trim().replace(/^['"]|['"]$/g, '');
        return cachedStitchKey;
      }
    }
  } catch {}

  return null;
}

export function setStitchApiKey(key: string): void {
  cachedStitchKey = key.trim();
  process.env.STITCH_API_KEY = cachedStitchKey;
}

/**
 * Generates modern, designer-grade HTML and CSS using the Google Stitch UI Synthesis Engine.
 */
export async function generateStitchUI(
  prompt: string,
  projectName = 'app'
): Promise<{ html: string; css: string } | null> {
  const apiKey = getStitchApiKey();
  if (!apiKey) {
    console.warn('[StitchClient] No STITCH_API_KEY available.');
    return null;
  }

  const systemInstruction = `You are the Google Stitch UI/UX Synthesis Engine.
Your mission is to generate ultra-modern, high-fidelity, production-grade responsive HTML5 and CSS for: "${prompt}".

CRITICAL OUTPUT RULES:
1. Output EXACTLY two markdown fenced code blocks:
\`\`\`html
<!-- index.html -->
...
\`\`\`
\`\`\`css
/* style.css */
...
\`\`\`
2. NO conversational greetings, meta thoughts, planning preamble, or explanations. Start immediately with \`\`\`html!
3. DESIGN SYSTEM & IDENTITY:
   - Make the UI look like a world-class consumer or enterprise application.
   - If the prompt mentions a quick-commerce platform like Zepto, Blinkit, or Instamart:
     * Use authentic Zepto aesthetics: Rich Deep Violet (#3c006b, #1a0833), vibrant action green (#00d06c), punchy highlight pink (#ff3269).
     * Add a top delivery ticker: "⚡ 10 MINS SUPERFAST DELIVERY to Home".
     * Add a clean address selector, prominent instant search bar with placeholder "Search for 'milk', 'chips', 'mango'..."
     * Horizontal category scroll pill bar (🥦 Fruits & Veggies, 🥛 Dairy & Bread, 🍿 Munchies, ☕ Drinks & Cafe).
     * Rich product cards featuring package weight, discount MRP, and "+ ADD" button with smooth hover glow.
     * Header cart button with count badge (id="cart-button", id="cart-count").
   - If the prompt is for a calculator, dashboard, portfolio, or SaaS tool:
     * Build an authentic, modern layout tailored strictly for that specific product.
   - NEVER output any watermarks, agent signatures, "Panda Hive", or generation labels.
4. TECHNICAL REQUIREMENTS:
   - index.html MUST link <link rel="stylesheet" href="style.css"> in <head>.
   - index.html MUST link <script src="app.js" defer></script> before </body>.
   - Interactive hooks: Use standard classes (.btn, .btn-action, .btn-add-cart) and semantic IDs (#site-search, #cart-button, #cart-count).`;

  const stitchPrompt = `Generate the complete, responsive Google Stitch UI for project "${projectName}":
User Vision: "${prompt}"`;

  const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.0-flash'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: stitchPrompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        })
      });

      if (!res.ok) {
        console.warn(`[StitchClient] Model ${model} returned HTTP ${res.status}.`);
        continue;
      }

      const data = (await res.json()) as any;
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text || text.trim().length < 50) continue;

      const htmlMatch = text.match(/```(?:html|htm)[\s\S]*?\n([\s\S]*?)```/i);
      const cssMatch = text.match(/```(?:css)[\s\S]*?\n([\s\S]*?)```/i);

      let html = htmlMatch ? htmlMatch[1].trim() : '';
      let css = cssMatch ? cssMatch[1].trim() : '';

      if (!html && (text.includes('<!DOCTYPE') || text.includes('<html'))) {
        const docMatch = text.match(/<!DOCTYPE[\s\S]*?<\/html>/i);
        if (docMatch) html = docMatch[0];
      }

      if (!css) {
        const styleMatch = (html || text).match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        if (styleMatch) css = styleMatch[1].trim();
      }

      if (html && html.length > 50) {
        console.log(`[StitchClient] Successfully synthesized UI via Google Stitch (${html.length} B HTML, ${css.length} B CSS)`);
        return { html, css };
      }
    } catch (err) {
      console.warn(`[StitchClient] Error synthesizing Stitch UI with ${model}:`, err);
    }
  }

  return null;
}

