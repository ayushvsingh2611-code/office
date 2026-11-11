/**
 * Google Gemini & Groq Multi-Model API Client Bridge for Panda Hive.
 * Multi-Key Load Balancer & Auto-Failover Pool for Straw Hat Dev Crew.
 *
 * Powers all 12 Straw Hat agents with:
 * - 3x Gemini API Keys with Automatic Round-Robin load distribution
 * - Groq Cloud API for lightweight / secondary tasks (Llama 3.3 70B & 3.1 8B)
 * - Instant failover across candidate models ('gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.0-flash')
 * - Instant failover across keys on HTTP 429 or 503
 * - Generous maxOutputTokens (8192) to prevent response truncation
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  agentTools,
  type ToolExecutionContext,
  AGENT_ALLOWED_TOOLS,
  PANDA_HIVE_TOOL_DEFINITIONS,
  type NativeToolDefinition
} from './agentTools';
import { microsoftLearnMcpClient, MICROSOFT_LEARN_FALLBACK_TOOLS } from './mcpClient';

let cachedApiKeys: string[] = [];
let cachedGroqKey: string | null = null;
let currentKeyIndex = 0;

export const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3-flash-preview',
  'gemini-flash-latest'
];

export interface OmniRouteConfig {
  baseUrl: string;
  apiKey: string;
  architectModel: string;
  builderModel: string;
  verifierModel: string;
}

let cachedOmniRouteConfig: OmniRouteConfig | null = null;

export function getOmniRouteConfig(): OmniRouteConfig | null {
  if (cachedOmniRouteConfig) return cachedOmniRouteConfig;

  let baseUrl = process.env.OMNIROUTE_BASE_URL || '';
  let apiKey = process.env.OMNIROUTE_API_KEY || '';
  let architectModel = process.env.OMNIROUTE_ARCHITECT_MODEL || 'agy/gemini-3.8-flash-high';
  let builderModel = process.env.OMNIROUTE_BUILDER_MODEL || 'agy/gemini-3-flash';
  let verifierModel = process.env.OMNIROUTE_VERIFIER_MODEL || 'agy/gemini-3.8-flash-medium';

  try {
    const envPath = join(process.cwd(), '.env');
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf8');
      const baseMatch = content.match(/OMNIROUTE_BASE_URL\s*=\s*([^\r\n]+)/);
      if (baseMatch && baseMatch[1]) baseUrl = baseMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const keyMatch = content.match(/OMNIROUTE_API_KEY\s*=\s*([^\r\n]+)/);
      if (keyMatch && keyMatch[1]) apiKey = keyMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const archMatch = content.match(/OMNIROUTE_ARCHITECT_MODEL\s*=\s*([^\r\n]+)/);
      if (archMatch && archMatch[1]) architectModel = archMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const bldMatch = content.match(/OMNIROUTE_BUILDER_MODEL\s*=\s*([^\r\n]+)/);
      if (bldMatch && bldMatch[1]) builderModel = bldMatch[1].trim().replace(/^['"]|['"]$/g, '');
      const verMatch = content.match(/OMNIROUTE_VERIFIER_MODEL\s*=\s*([^\r\n]+)/);
      if (verMatch && verMatch[1]) verifierModel = verMatch[1].trim().replace(/^['"]|['"]$/g, '');
    }
  } catch { }

  if (baseUrl && apiKey) {
    cachedOmniRouteConfig = {
      baseUrl: baseUrl.replace('localhost', '127.0.0.1').replace(/\/+$/, ''),
      apiKey,
      architectModel,
      builderModel,
      verifierModel
    };
    return cachedOmniRouteConfig;
  }
  return null;
}

export function clearOmniRouteCache(): void {
  cachedOmniRouteConfig = null;
}

// ==============================================================================
// OMNIROUTE ANTIGRAVITY MODEL POOL & DYNAMIC AUTO-FAILOVER LOAD BALANCER
// ==============================================================================

export const OMNIROUTE_ANTIGRAVITY_MODELS = [
  'agy/gemini-3-flash',
  'agy/gpt-oss-120b-medium',
  'agy/gemini-3.1-flash-lite',
  'agy/gemini-3.8-flash-low',
  'agy/gemini-3.5-flash-lite',
  'agy/claude-opus-4-6-thinking',
  'agy/claude-sonnet-4-6',
  'agy/gemini-3.8-flash-high',
  'agy/gemini-3.8-flash-tiered',
  'agy/gemini-3.8-flash-medium'
] as const;

export type OmniRouteAntigravityModel = typeof OMNIROUTE_ANTIGRAVITY_MODELS[number];

// Role-tailored candidate fallback chains
export const OMNI_ARCHITECT_FALLBACK_CHAIN: string[] = [
  'agy/gemini-3.8-flash-high',
  'agy/claude-sonnet-4-6',
  'agy/claude-opus-4-6-thinking',
  'agy/gemini-3.8-flash-medium',
  'agy/gpt-oss-120b-medium',
  'agy/gemini-3-flash'
];

export const OMNI_BUILDER_FALLBACK_CHAIN: string[] = [
  'agy/gemini-3-flash',
  'agy/gemini-3.8-flash-tiered',
  'agy/gpt-oss-120b-medium',
  'agy/gemini-3.8-flash-medium',
  'agy/claude-sonnet-4-6',
  'agy/gemini-3.8-flash-low'
];

export const OMNI_VERIFIER_FALLBACK_CHAIN: string[] = [
  'agy/gemini-3.8-flash-medium',
  'agy/gemini-3.8-flash-low',
  'agy/gemini-3.1-flash-lite',
  'agy/gemini-3.5-flash-lite',
  'agy/gemini-3-flash'
];

const omniModelCooldowns = new Map<string, number>();

export function isOmniModelAvailable(model: string): boolean {
  const until = omniModelCooldowns.get(model);
  if (!until) return true;
  if (Date.now() > until) {
    omniModelCooldowns.delete(model);
    return true;
  }
  return false;
}

export function markOmniModelCooldown(model: string, cooldownMs = 60000): void {
  omniModelCooldowns.set(model, Date.now() + cooldownMs);
  console.warn(`[OmniRoute Pool] Model "${model}" temporarily cooled down for ${Math.round(cooldownMs / 1000)}s`);
}

export function clearOmniModelCooldowns(): void {
  omniModelCooldowns.clear();
}

export function getOmniCandidateModels(requestedModel?: string): string[] {
  if (!requestedModel) return [...OMNI_BUILDER_FALLBACK_CHAIN];

  if (requestedModel.includes('high') || requestedModel.includes('opus')) {
    const list = [requestedModel, ...OMNI_ARCHITECT_FALLBACK_CHAIN.filter((m) => m !== requestedModel)];
    return Array.from(new Set(list));
  }
  if (requestedModel.includes('verifier') || requestedModel.includes('lite') || requestedModel.includes('low') || requestedModel.includes('medium')) {
    const list = [requestedModel, ...OMNI_VERIFIER_FALLBACK_CHAIN.filter((m) => m !== requestedModel)];
    return Array.from(new Set(list));
  }
  const list = [requestedModel, ...OMNI_BUILDER_FALLBACK_CHAIN.filter((m) => m !== requestedModel)];
  return Array.from(new Set(list));
}

// Tracks models/keys that encountered HTTP 429 quota exhaustion with expiration timestamp
const modelKeyQuotaExhaustedUntil = new Map<string, number>();
const modelGlobalQuotaExhaustedUntil = new Map<string, number>();

export function isModelKeyExhausted(model: string, apiKey: string): boolean {
  const keyHash = apiKey.slice(-8);
  const until = modelKeyQuotaExhaustedUntil.get(`${model}:${keyHash}`);
  if (!until) return false;
  if (Date.now() > until) {
    modelKeyQuotaExhaustedUntil.delete(`${model}:${keyHash}`);
    return false;
  }
  return true;
}

export function isModelGloballyExhausted(model: string): boolean {
  const until = modelGlobalQuotaExhaustedUntil.get(model);
  if (!until) return false;
  if (Date.now() > until) {
    modelGlobalQuotaExhaustedUntil.delete(model);
    return false;
  }
  return true;
}

export function markModelKeyQuotaExhausted(model: string, apiKey: string, cooldownMs = 15 * 60 * 1000): void {
  const keyHash = apiKey.slice(-8);
  modelKeyQuotaExhaustedUntil.set(`${model}:${keyHash}`, Date.now() + cooldownMs);
}

export function markModelGloballyQuotaExhausted(model: string, cooldownMs = 15 * 60 * 1000): void {
  modelGlobalQuotaExhaustedUntil.set(model, Date.now() + cooldownMs);
}

export function clearModelQuotaExhaustion(): void {
  modelKeyQuotaExhaustedUntil.clear();
  modelGlobalQuotaExhaustedUntil.clear();
}

export function getGeminiApiKeys(): string[] {
  if (cachedApiKeys.length > 0) return cachedApiKeys;

  const rawKeys: string[] = [];

  // 1. Check process.env.GEMINI_API_KEYS or GEMINI_API_KEY
  const envVal = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY;
  if (envVal) {
    rawKeys.push(...envVal.split(/[,\s]+/).map((k) => k.trim()).filter(Boolean));
  }

  // 2. Check workspace .env file
  try {
    const envPath = join(process.cwd(), '.env');
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf8');
      const match = content.match(/(?:GEMINI_API_KEYS|GEMINI_API_KEY)\s*=\s*([^\r\n]+)/);
      if (match && match[1]) {
        const cleaned = match[1].trim().replace(/^['"]|['"]$/g, '');
        rawKeys.push(...cleaned.split(/[,\s]+/).map((k) => k.trim()).filter(Boolean));
      }
    }
  } catch { }

  cachedApiKeys = Array.from(new Set(rawKeys));
  return cachedApiKeys;
}

export function getGeminiApiKey(): string | null {
  const keys = getGeminiApiKeys();
  return keys.length > 0 ? keys[0] : null;
}

export function setGeminiApiKeys(keys: string | string[]): void {
  const arr = Array.isArray(keys) ? keys : keys.split(/[,\s]+/);
  cachedApiKeys = Array.from(new Set(arr.map((k) => k.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)));
  if (cachedApiKeys.length > 0) {
    process.env.GEMINI_API_KEY = cachedApiKeys[0];
    process.env.GEMINI_API_KEYS = cachedApiKeys.join(',');
  }
}

export function setGeminiApiKey(key: string): void {
  setGeminiApiKeys([key]);
}

export function getGrokApiKey(): string | null {
  if (cachedGroqKey) return cachedGroqKey;
  const envVal = process.env.GROK_API_KEY || process.env.XAI_API_KEY || process.env.GROQ_API_KEY;
  if (envVal) {
    cachedGroqKey = envVal.trim();
    return cachedGroqKey;
  }
  try {
    const envPath = join(process.cwd(), '.env');
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf8');
      const match = content.match(/(?:GROK_API_KEY|XAI_API_KEY|GROQ_API_KEY)\s*=\s*([^\r\n]+)/);
      if (match && match[1]) {
        cachedGroqKey = match[1].trim().replace(/^['"]|['"]$/g, '');
        return cachedGroqKey;
      }
    }
  } catch { }
  return null;
}

export const getGroqApiKey = getGrokApiKey;

export interface LlmExecutionResult {
  text: string;
  provider: 'omniroute' | 'gemini' | 'groq' | 'grok';
  model: string;
  keyIndex?: number;
  durationMs: number;
  fallbackOccurred?: boolean;
  activatedSkills?: Array<{
    name: string;
    version: string;
    sourcePath: string;
  }>;
  executionStatus?: 'COMPLETED' | 'PARTIAL' | 'BLOCKED' | 'FAILED';
  finalizationCalled?: boolean;
}

/**
 * Calls local OmniRoute server with Antigravity CLI models (OpenAI-compatible protocol).
 */
export async function callOmniRouteChatDetails(
  prompt: string,
  systemInstruction?: string,
  preferredModel?: string,
  timeoutMs = 120000
): Promise<Omit<LlmExecutionResult, 'durationMs'> | null> {
  const cfg = getOmniRouteConfig();
  if (!cfg) return null;

  const endpoint = `${cfg.baseUrl}/chat/completions`;
  const candidates = getOmniCandidateModels(preferredModel || cfg.builderModel);
  const unexhausted = candidates.filter(isOmniModelAvailable);
  const modelsToTry = unexhausted.length > 0 ? unexhausted : candidates;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cfg.apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(timeoutMs),
        body: JSON.stringify({
          model,
          messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 8192
        })
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const text = data?.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) {
          console.log(`[OmniRoute] Model ${model} succeeded (${text.length} chars)`);
          return {
            text: text.trim(),
            provider: 'omniroute',
            model
          };
        }
      } else {
        const errText = await res.text().catch(() => '');
        console.warn(`[OmniRoute] Model ${model} returned HTTP ${res.status}: ${errText.slice(0, 150)}`);
        markOmniModelCooldown(model, 60000);
        if (i < modelsToTry.length - 1) {
          console.log(`[OmniRoute Failover] Switching to candidate model "${modelsToTry[i + 1]}"...`);
        }
      }
    } catch (err: any) {
      console.warn(`[OmniRoute] Error calling ${model}:`, err?.message || err);
      markOmniModelCooldown(model, 60000);
      if (i < modelsToTry.length - 1) {
        console.log(`[OmniRoute Failover] Switching to candidate model "${modelsToTry[i + 1]}"...`);
      }
    }
  }

  return null;
}

/**
 * Calls xAI Grok API (grok-2, grok-beta) or Groq Cloud API depending on key prefix.
 * - If key starts with 'xai-', routes to https://api.x.ai/v1 (official xAI Grok).
 * - If key starts with 'gsk_', routes to https://api.groq.com/openai/v1.
 */
export async function callGrokChat(
  prompt: string,
  systemInstruction?: string,
  preferredModel?: string
): Promise<string | null> {
  const res = await callGroqChatDetails(prompt, systemInstruction, preferredModel);
  return res ? res.text : null;
}

export const callGroqChat = callGrokChat;

export async function callGroqChatDetails(
  prompt: string,
  systemInstruction?: string,
  preferredModel?: string,
  timeoutMs = 40000
): Promise<Omit<LlmExecutionResult, 'durationMs'> | null> {
  const apiKey = getGrokApiKey();
  if (!apiKey) return null;

  const isXaiGrok = apiKey.startsWith('xai-');
  const endpoint = isXaiGrok
    ? 'https://api.x.ai/v1/chat/completions'
    : 'https://api.groq.com/openai/v1/chat/completions';

  const modelsToTry = isXaiGrok
    ? (preferredModel ? [preferredModel, 'grok-2-latest', 'grok-2', 'grok-beta'] : ['grok-2-latest', 'grok-2', 'grok-beta'])
    : (preferredModel ? [preferredModel, 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'] : ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b']);

  const clientName = isXaiGrok ? 'GrokClient (xAI)' : 'GroqClient (groq.com)';
  const providerName = isXaiGrok ? 'grok' : 'groq';

  for (const currentModel of modelsToTry) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(timeoutMs),
        body: JSON.stringify({
          model: currentModel,
          messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 4096
        })
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const text = data?.choices?.[0]?.message?.content;
        if (text && text.trim().length > 0) {
          console.log(`[${clientName}] Model ${currentModel} succeeded (${text.length} chars)`);
          return {
            text: text.trim(),
            provider: providerName,
            model: currentModel
          };
        }
      } else {
        const errText = await res.text().catch(() => '');
        console.warn(`[${clientName}] Model ${currentModel} returned HTTP ${res.status}: ${errText.slice(0, 200)}`);
      }
    } catch (err: any) {
      console.warn(`[${clientName}] Error calling ${currentModel}:`, err?.message || err);
    }
  }

  return null;
}

/**
 * Calls Gemini API with smart round-robin load distribution and auto-failover across all available keys and candidate models.
 */
export async function callGeminiChat(
  prompt: string,
  systemInstruction?: string,
  preferredModel?: string
): Promise<string | null> {
  const res = await callGeminiChatDetails(prompt, systemInstruction, preferredModel);
  return res ? res.text : null;
}

export async function callGeminiChatDetails(
  prompt: string,
  systemInstruction?: string,
  preferredModel?: string,
  timeoutMs = 120000,
  minChars = 50
): Promise<Omit<LlmExecutionResult, 'durationMs'> | null> {
  const keys = getGeminiApiKeys();
  if (keys.length === 0) return null;

  const cleanPreferred = preferredModel
    ? preferredModel.replace(/^(?:agy|dva|aug|no-think\/agy)\//, '')
    : undefined;

  const modelsToTry = cleanPreferred && CANDIDATE_MODELS.includes(cleanPreferred)
    ? [cleanPreferred, ...CANDIDATE_MODELS.filter((m) => m !== cleanPreferred)]
    : CANDIDATE_MODELS;

  const startIndex = currentKeyIndex;
  currentKeyIndex = (currentKeyIndex + 1) % keys.length;

  const unexhaustedModels = modelsToTry.filter((m) => !isModelGloballyExhausted(m));
  const candidateModelsToIterate = unexhaustedModels.length > 0 ? unexhaustedModels : modelsToTry;

  for (const model of candidateModelsToIterate) {
    for (let attempt = 0; attempt < keys.length; attempt++) {
      const keyIdx = (startIndex + attempt) % keys.length;
      const apiKey = keys[keyIdx];

      if (isModelKeyExhausted(model, apiKey)) {
        continue;
      }

      try {
        const isOAuth = apiKey.startsWith('ya29.');
        const url = isOAuth
          ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
          : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        if (isOAuth) {
          headers['Authorization'] = `Bearer ${apiKey}`;
        } else {
          headers['x-goog-api-key'] = apiKey;
        }

        const body: any = {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192
          }
        };

        if (systemInstruction) {
          body.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        const res = await fetch(url, {
          method: 'POST',
          headers,
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = (await res.json()) as any;
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text && text.trim().length >= minChars) {
            console.log(`[GeminiClient] Key ${keyIdx + 1} with ${model} succeeded (${text.length} chars)`);
            return {
              text: text.trim(),
              provider: 'gemini',
              model,
              keyIndex: keyIdx + 1
            };
          } else if (text && text.trim().length > 0) {
            // Model returned valid content but shorter than expected threshold.
            // Do NOT churn through API keys for length; return text with active key.
            console.log(`[GeminiClient] Key ${keyIdx + 1} with ${model} returned ${text.trim().length} chars (threshold: ${minChars})`);
            return {
              text: text.trim(),
              provider: 'gemini',
              model,
              keyIndex: keyIdx + 1
            };
          }
        } else {
          const errText = await res.text().catch(() => '');
          console.warn(`[GeminiClient] Key ${keyIdx + 1} with ${model} returned HTTP ${res.status}: ${errText.slice(0, 200)}`);
          if (res.status === 429) {
            let cooldownMs = 15 * 60 * 1000;
            let isDailyExhausted = false;
            try {
              const errorData = JSON.parse(errText);
              const errMsg = (errorData?.error?.message || '').toLowerCase();
              if (errMsg.includes('limit exceeded') || errMsg.includes('free_tier_requests') || errMsg.includes('per day')) {
                isDailyExhausted = true;
              }
              const retryDelay = errorData?.error?.details?.find((d: any) => d['@type']?.includes('RetryInfo'))?.retryDelay;
              if (retryDelay) {
                const parsed = parseInt(retryDelay, 10);
                if (!isNaN(parsed) && parsed > 0) {
                  cooldownMs = Math.min(parsed * 1000, 24 * 60 * 60 * 1000);
                  if (parsed > 60) isDailyExhausted = true;
                }
              } else if (!isDailyExhausted) {
                // Short transient burst / concurrency limit
                cooldownMs = 10 * 1000;
              }
            } catch { }
            markModelKeyQuotaExhausted(model, apiKey, cooldownMs);
            if (isDailyExhausted && keys.every((k) => isModelKeyExhausted(model, k))) {
              markModelGloballyQuotaExhausted(model, cooldownMs);
              console.warn(`[GeminiClient] Model "${model}" daily quota exhausted across all keys. Cooldown set for ${Math.round(cooldownMs / 1000)}s.`);
            }
          }
          if (res.status === 400 || res.status === 401 || res.status === 403) {
            continue;
          }
          continue;
        }
      } catch (err: any) {
        console.error(`[GeminiClient] Request error with key ${keyIdx + 1} (${model}):`, err?.message || err);
        continue;
      }
    }
  }

  return null;
}

/**
 * Unified multi-provider LLM caller:
 * - If preferGroq is true: calls Groq first, then falls back to Gemini.
 * - Otherwise: calls Gemini 3x pool first, then falls back to Groq.
 */
export async function callUnifiedLlm(
  prompt: string,
  systemInstruction?: string,
  preferGroq = false
): Promise<string | null> {
  const res = await executeAgentLlmCall(prompt, systemInstruction, { preferGroq }).catch((err) => {
    console.warn('[callUnifiedLlm] Execution error:', err.message);
    return null;
  });
  return res ? res.text : null;
}

/**
 * Autonomous LLM execution primitive for Panda Hive Agents.
 * Guarantees zero silent fallbacks. Throws an explicit error if all providers fail.
 */
export async function executeAgentLlmCall(
  prompt: string,
  systemInstruction?: string,
  options?: {
    preferGroq?: boolean;
    timeoutMs?: number;
    preferredModel?: string;
    minChars?: number;
  }
): Promise<LlmExecutionResult> {
  const timeoutMs = options?.timeoutMs ?? 120000;
  const minChars = options?.minChars ?? 50;
  const start = Date.now();

  // Exclusively route through OmniRoute Antigravity Model Pool & Load Balancer
  const omniRes = await callOmniRouteChatDetails(prompt, systemInstruction, options?.preferredModel, timeoutMs);
  if (omniRes && omniRes.text.length >= minChars) {
    return {
      ...omniRes,
      durationMs: Date.now() - start,
      fallbackOccurred: false
    };
  }

  throw new Error(`OmniRoute Antigravity Model Pool failed to generate output (> ${minChars} chars)`);
}

// ─── Phase 4E: Advanced Tool-Calling Integration (Gemini & Groq) ──────────────

export interface ToolCallTelemetry {
  turn: number;
  toolName: string;
  args: Record<string, unknown>;
  resultSummary: string;
  status: 'success' | 'failure';
  error?: string;
  durationMs: number;
}

export interface LlmToolExecutionResult extends LlmExecutionResult {
  toolCallsExecuted: ToolCallTelemetry[];
  turnsCount: number;
  executionStatus?: 'COMPLETED' | 'PARTIAL' | 'BLOCKED' | 'FAILED';
  finalizationCalled?: boolean;
}

function toGeminiSchema(schema: any): any {
  if (!schema) return { type: 'OBJECT', properties: {} };
  const rawType = String(schema.type || 'object').toUpperCase();
  const res: any = { type: rawType };
  if (schema.description) res.description = schema.description;
  if (Array.isArray(schema.required) && schema.required.length > 0) res.required = schema.required;
  if (schema.properties && typeof schema.properties === 'object') {
    res.properties = {};
    for (const [key, val] of Object.entries(schema.properties)) {
      res.properties[key] = toGeminiSchema(val);
    }
  }
  if (schema.items) {
    res.items = toGeminiSchema(schema.items);
  }
  if (schema.enum) {
    res.enum = schema.enum;
  }
  return res;
}

export function formatToolsForGemini(tools: NativeToolDefinition[]): any[] {
  if (!tools || tools.length === 0) return [];
  return [
    {
      functionDeclarations: tools.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: toGeminiSchema(t.parameters)
      }))
    }
  ];
}

export function formatToolsForGroq(tools: NativeToolDefinition[]): any[] {
  if (!tools || tools.length === 0) return [];
  return tools.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters
    }
  }));
}

export function resolveAllowedToolsForAgent(agentId: string): NativeToolDefinition[] {
  const allowedNames = AGENT_ALLOWED_TOOLS[agentId] || ['ReadFile', 'ListFiles'];
  const definitions: NativeToolDefinition[] = [];

  for (const name of allowedNames) {
    if (name === 'CallMcpTool') {
      definitions.push(PANDA_HIVE_TOOL_DEFINITIONS['CallMcpTool']);
      for (const mcpTool of MICROSOFT_LEARN_FALLBACK_TOOLS) {
        definitions.push({
          name: mcpTool.name,
          description: mcpTool.description,
          parameters: mcpTool.inputSchema as any
        });
      }
    } else if (PANDA_HIVE_TOOL_DEFINITIONS[name]) {
      definitions.push(PANDA_HIVE_TOOL_DEFINITIONS[name]);
    }
  }

  return definitions;
}

/**
 * Autonomous Tool-Calling Execution Primitive for Straw Hat Crew Agents.
 * Supports multi-turn tool loops with turn bounding, audit logging,
 * and seamless provider failover context preservation between Gemini and Groq.
 */
export async function executeAgentLlmCallWithTools(
  prompt: string,
  systemInstruction?: string,
  ctx?: ToolExecutionContext,
  options?: {
    preferGroq?: boolean;
    timeoutMs?: number;
    preferredModel?: string;
    minChars?: number;
    maxTurns?: number;
    allowedTools?: string[];
  }
): Promise<LlmToolExecutionResult> {
  if (!ctx) {
    const directRes = await executeAgentLlmCall(prompt, systemInstruction, options);
    return {
      ...directRes,
      toolCallsExecuted: [],
      turnsCount: 1
    };
  }

  const agentPermitted = resolveAllowedToolsForAgent(ctx.agentId);
  const allowedTools = options?.allowedTools
    ? agentPermitted.filter((def) => options.allowedTools!.includes(def.name))
    : agentPermitted;

  if (allowedTools.length === 0) {
    const directRes = await executeAgentLlmCall(prompt, systemInstruction, options);
    return {
      ...directRes,
      toolCallsExecuted: [],
      turnsCount: 1
    };
  }

  const executionContext: ToolExecutionContext = ctx;
  const maxTurns = options?.maxTurns ?? 8;
  const timeoutMs = options?.timeoutMs ?? 120000;
  const minChars = options?.minChars ?? 50;
  const toolCallsExecuted: ToolCallTelemetry[] = [];
  const start = Date.now();

  // Helper for executing Gemini multi-turn tool calling loop
  async function runGeminiToolLoop(): Promise<Omit<LlmExecutionResult, 'durationMs'>> {
    const keys = getGeminiApiKeys();
    if (keys.length === 0) throw new Error('No Gemini API keys configured');

    const cleanPreferred = options?.preferredModel
      ? options.preferredModel.replace(/^(?:agy|dva|aug|no-think\/agy)\//, '')
      : undefined;

    const modelsToTry = cleanPreferred && CANDIDATE_MODELS.includes(cleanPreferred)
      ? [cleanPreferred, ...CANDIDATE_MODELS.filter((m) => m !== cleanPreferred)]
      : CANDIDATE_MODELS;

    const unexhaustedModels = modelsToTry.filter((m) => !isModelGloballyExhausted(m));
    const candidateModelsToIterate = unexhaustedModels.length > 0 ? unexhaustedModels : modelsToTry;

    const geminiTools = formatToolsForGemini(allowedTools);
    const contents: any[] = [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];

    for (const model of candidateModelsToIterate) {
      for (let attempt = 0; attempt < keys.length; attempt++) {
        const keyIdx = (currentKeyIndex + attempt) % keys.length;
        const apiKey = keys[keyIdx];

        if (isModelKeyExhausted(model, apiKey)) {
          continue;
        }

        try {
          let turn = 0;
          while (turn < maxTurns) {
            turn++;
            const isOAuth = apiKey.startsWith('ya29.');
            const url = isOAuth
              ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
              : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

            const headers: Record<string, string> = {
              'Content-Type': 'application/json'
            };
            if (isOAuth) {
              headers['Authorization'] = `Bearer ${apiKey}`;
            } else {
              headers['x-goog-api-key'] = apiKey;
            }

            const body: any = {
              contents,
              tools: geminiTools,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192
              }
            };

            if (systemInstruction) {
              body.systemInstruction = {
                parts: [{ text: systemInstruction }]
              };
            }

            const res = await fetch(url, {
              method: 'POST',
              headers,
              signal: AbortSignal.timeout(timeoutMs),
              body: JSON.stringify(body)
            });

            if (!res.ok) {
              const errText = await res.text().catch(() => '');
              if (res.status === 429) {
                let cooldownMs = 15 * 60 * 1000;
                let isDailyExhausted = false;
                try {
                  const errorData = JSON.parse(errText);
                  const errMsg = (errorData?.error?.message || '').toLowerCase();
                  if (errMsg.includes('limit exceeded') || errMsg.includes('free_tier_requests') || errMsg.includes('per day')) {
                    isDailyExhausted = true;
                  }
                  const retryDelay = errorData?.error?.details?.find((d: any) => d['@type']?.includes('RetryInfo'))?.retryDelay;
                  if (retryDelay) {
                    const parsed = parseInt(retryDelay, 10);
                    if (!isNaN(parsed) && parsed > 0) {
                      cooldownMs = Math.min(parsed * 1000, 24 * 60 * 60 * 1000);
                      if (parsed > 60) isDailyExhausted = true;
                    }
                  } else if (!isDailyExhausted) {
                    // Short transient burst / concurrency limit
                    cooldownMs = 10 * 1000;
                  }
                } catch { }
                markModelKeyQuotaExhausted(model, apiKey, cooldownMs);
                if (isDailyExhausted && keys.every((k) => isModelKeyExhausted(model, k))) {
                  markModelGloballyQuotaExhausted(model, cooldownMs);
                  console.warn(`[executeAgentLlmCallWithTools] Model "${model}" daily quota exhausted across all keys. Cooldown set for ${Math.round(cooldownMs / 1000)}s.`);
                }
              }
              throw new Error(`HTTP ${res.status}: ${errText}`);
            }

            const data = (await res.json()) as any;
            const candidateParts: any[] = data?.candidates?.[0]?.content?.parts || [];

            // Check if model called a tool
            const fnCallPart = candidateParts.find((p) => p.functionCall);
            if (fnCallPart && fnCallPart.functionCall) {
              const { name, args } = fnCallPart.functionCall;
              const toolStart = Date.now();
              let toolResult: any;
              let toolError: string | undefined;

              try {
                toolResult = await agentTools.executeToolByName(executionContext, name, args || {});
                if ((name === 'ListFiles' || name === 'SearchFiles') && turn >= 2) {
                  const emptyResult = !toolResult || (Array.isArray(toolResult?.files) && toolResult.files.length === 0) || (Array.isArray(toolResult?.matches) && toolResult.matches.length === 0);
                  if (emptyResult && typeof toolResult === 'object') {
                    toolResult.hint = 'Workspace is clean. Please proceed immediately to writing the deliverable with WriteFile.';
                  }
                }
              } catch (err: any) {
                toolError = err.message;
                toolResult = { error: err.message };
              }

              toolCallsExecuted.push({
                turn,
                toolName: name,
                args: args || {},
                resultSummary: typeof toolResult === 'string' ? toolResult.slice(0, 80) : JSON.stringify(toolResult).slice(0, 80),
                status: toolError ? 'failure' : 'success',
                error: toolError,
                durationMs: Date.now() - toolStart
              });

              // Push model turn and function response turn into conversation contents
              // Preserve exact fnCallPart returned by model so thoughtSignature is retained
              contents.push({
                role: 'model',
                parts: [fnCallPart]
              });
              contents.push({
                role: 'user',
                parts: [
                  {
                    functionResponse: {
                      name,
                      response: { result: toolResult }
                    }
                  }
                ]
              });
              continue; // proceed to next turn
            }

            // Otherwise model returned final text
            const textParts = candidateParts.map((p) => p.text || '').join('\n').trim();
            if (textParts.length >= minChars || (toolCallsExecuted.length > 0 && textParts.length > 0)) {
              currentKeyIndex = (keyIdx + 1) % keys.length;
              return {
                text: textParts,
                provider: 'gemini',
                model,
                keyIndex: keyIdx + 1,
                executionStatus: 'COMPLETED'
              };
            }
          }

          // Tool execution turn limit reached: perform one additional finalization-only call WITHOUT tools
          if (toolCallsExecuted.length >= maxTurns) {
            const finalPrompt = `You have reached the maximum tool execution limit (${maxTurns} turns). Do not call any more tools. Summarize:
1. Work completed
2. Files created or modified
3. Remaining tasks
4. Any blockers or issues encountered`;

            contents.push({
              role: 'user',
              parts: [{ text: finalPrompt }]
            });

            const isOAuth = apiKey.startsWith('ya29.');
            const url = isOAuth
              ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
              : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

            const headers: Record<string, string> = {
              'Content-Type': 'application/json'
            };
            if (isOAuth) {
              headers['Authorization'] = `Bearer ${apiKey}`;
            } else {
              headers['x-goog-api-key'] = apiKey;
            }

            // Finalization-only call strictly omits executable tools
            const finalBody: any = {
              contents,
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 4096
              }
            };
            if (systemInstruction) {
              finalBody.systemInstruction = {
                parts: [{ text: systemInstruction }]
              };
            }

            const finalRes = await fetch(url, {
              method: 'POST',
              headers,
              signal: AbortSignal.timeout(timeoutMs),
              body: JSON.stringify(finalBody)
            });

            if (finalRes.ok) {
              const finalData = (await finalRes.json()) as any;
              const finalParts: any[] = finalData?.candidates?.[0]?.content?.parts || [];
              const finalText = finalParts.map((p) => p.text || '').join('\n').trim();
              if (finalText.length > 0) {
                currentKeyIndex = (keyIdx + 1) % keys.length;
                return {
                  text: finalText,
                  provider: 'gemini',
                  model,
                  keyIndex: keyIdx + 1,
                  executionStatus: 'COMPLETED',
                  finalizationCalled: true
                };
              }
            }

            throw new Error(`Autonomous tool execution reached maximum turn limit (${maxTurns}) without concluding (insufficient output)`);
          }
        } catch (err: any) {
          if (err?.message?.includes('maximum turn limit')) {
            throw err;
          }
          console.warn(`[executeAgentLlmCallWithTools] Gemini model ${model} attempt failed:`, err?.message || err);
          continue;
        }
      }
    }

    throw new Error('All Gemini keys/models failed in tool calling loop');
  }

  // Helper for executing Groq tool calling loop
  async function runGroqToolLoop(): Promise<Omit<LlmExecutionResult, 'durationMs'>> {
    const apiKey = getGrokApiKey();
    if (!apiKey) throw new Error('No Groq/xAI API key configured');

    const isXaiGrok = apiKey.startsWith('xai-');
    const endpoint = isXaiGrok
      ? 'https://api.x.ai/v1/chat/completions'
      : 'https://api.groq.com/openai/v1/chat/completions';

    const modelsToTry = isXaiGrok
      ? (options?.preferredModel ? [options.preferredModel, 'grok-2-latest'] : ['grok-2-latest', 'grok-2'])
      : (options?.preferredModel ? [options.preferredModel, 'openai/gpt-oss-120b', 'qwen/qwen3.8-27b'] : ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b']);

    const groqTools = formatToolsForGroq(allowedTools);
    const messages: any[] = [
      ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
      { role: 'user', content: prompt }
    ];

    // Preserve any tool results already executed in prior provider attempt
    for (const tc of toolCallsExecuted) {
      const callId = `call_${tc.turn}_${tc.toolName}`;
      messages.push({
        role: 'assistant',
        content: null,
        tool_calls: [
          {
            id: callId,
            type: 'function',
            function: {
              name: tc.toolName,
              arguments: JSON.stringify(tc.args)
            }
          }
        ]
      });
      messages.push({
        role: 'tool',
        tool_call_id: callId,
        content: JSON.stringify({ result: tc.resultSummary, error: tc.error })
      });
    }

    for (const model of modelsToTry) {
      try {
        let turn = toolCallsExecuted.length;
        while (turn < maxTurns) {
          turn++;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(timeoutMs),
            body: JSON.stringify({
              model,
              messages,
              tools: groqTools,
              temperature: 0.7,
              max_tokens: 4096
            })
          });

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${await res.text().catch(() => '')}`);
          }

          const data = (await res.json()) as any;
          const choice = data?.choices?.[0];
          const msg = choice?.message;

          console.log(`[Groq Loop] Turn ${turn}/${maxTurns} | Model: ${model} | ToolCalls: ${msg?.tool_calls?.length || 0} | Finish: ${choice?.finish_reason} | Content: ${(msg?.content || '').slice(0, 100).replace(/\n/g, ' ')}`);

          if (msg?.tool_calls && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
            messages.push(msg);
            for (const tc of msg.tool_calls) {
              const toolStart = Date.now();
              let parsedArgs = {};
              try {
                parsedArgs = JSON.parse(tc.function.arguments || '{}');
              } catch { }

              let toolResult: any;
              let toolError: string | undefined;

              try {
                toolResult = await agentTools.executeToolByName(executionContext, tc.function.name, parsedArgs);
              } catch (err: any) {
                toolError = err.message;
                toolResult = { error: err.message };
              }

              toolCallsExecuted.push({
                turn,
                toolName: tc.function.name,
                args: parsedArgs,
                resultSummary: typeof toolResult === 'string' ? toolResult.slice(0, 80) : JSON.stringify(toolResult).slice(0, 80),
                status: toolError ? 'failure' : 'success',
                error: toolError,
                durationMs: Date.now() - toolStart
              });

              messages.push({
                role: 'tool',
                tool_call_id: tc.id,
                content: JSON.stringify(toolResult)
              });
            }
            continue;
          }

          const text = (msg?.content || '').trim();
          if (text.length >= minChars || (toolCallsExecuted.length > 0 && text.length > 0)) {
            return {
              text,
              provider: isXaiGrok ? 'grok' : 'groq',
              model,
              executionStatus: 'COMPLETED'
            };
          }
        }

        // Tool execution turn limit reached on Groq: perform one finalization-only call WITHOUT tools
        if (toolCallsExecuted.length >= maxTurns) {
          messages.push({
            role: 'user',
            content: `You have reached the maximum tool execution limit (${maxTurns} turns). Do not call any more tools. Summarize:
1. Work completed
2. Files created or modified
3. Remaining tasks
4. Any blockers or issues encountered`
          });

          const finalRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(timeoutMs),
            body: JSON.stringify({
              model,
              messages,
              // NO tools property!
              temperature: 0.5,
              max_tokens: 4096
            })
          });

          if (finalRes.ok) {
            const finalData = (await finalRes.json()) as any;
            const finalContent = (finalData?.choices?.[0]?.message?.content || '').trim();
            if (finalContent.length > 0) {
              return {
                text: finalContent,
                provider: isXaiGrok ? 'grok' : 'groq',
                model,
                executionStatus: 'COMPLETED',
                finalizationCalled: true
              };
            }
          }

          throw new Error(`Autonomous tool execution reached maximum turn limit (${maxTurns}) without concluding (insufficient output)`);
        }
      } catch (err: any) {
        if (err?.message?.includes('maximum turn limit')) {
          throw err;
        }
        console.warn(`[executeAgentLlmCallWithTools] Groq model ${model} attempt failed:`, err?.message || err);
        continue;
      }
    }

    throw new Error('All Groq models failed in tool calling loop');
  }

  // Helper for executing OmniRoute tool calling loop with dynamic model pool failover
  async function runOmniRouteToolLoop(): Promise<Omit<LlmExecutionResult, 'durationMs'>> {
    const config = getOmniRouteConfig();
    if (!config) throw new Error('No OmniRoute configuration found');

    const endpoint = `${config.baseUrl}/chat/completions`;
    const candidateModels = getOmniCandidateModels(options?.preferredModel || config.builderModel);
    let activeModelIndex = 0;
    const openaiTools = formatToolsForGroq(allowedTools);

    const messages: any[] = [
      ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
      { role: 'user', content: prompt }
    ];

    // Preserve any tool results already executed in prior attempts
    for (const tc of toolCallsExecuted) {
      const callId = `call_${tc.turn}_${tc.toolName}`;
      messages.push({
        role: 'assistant',
        content: null,
        tool_calls: [
          {
            id: callId,
            type: 'function',
            function: {
              name: tc.toolName,
              arguments: JSON.stringify(tc.args)
            }
          }
        ]
      });
      messages.push({
        role: 'tool',
        tool_call_id: callId,
        content: JSON.stringify({ result: tc.resultSummary, error: tc.error })
      });
    }

    let turn = toolCallsExecuted.length;
    while (turn < maxTurns) {
      turn++;

      let turnSuccess = false;
      let lastTurnError = '';

      // Try active model; if it fails or times out, auto-failover to next candidate model
      for (let attempt = 0; attempt < candidateModels.length; attempt++) {
        const currentModel = candidateModels[(activeModelIndex + attempt) % candidateModels.length];
        if (!isOmniModelAvailable(currentModel) && attempt < candidateModels.length - 1) {
          continue;
        }

        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(timeoutMs),
            body: JSON.stringify({
              model: currentModel,
              messages,
              tools: openaiTools,
              temperature: 0.7,
              max_tokens: 16384
            })
          });

          if (!res.ok) {
            const errText = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status}: ${errText.slice(0, 150)}`);
          }

          const data = (await res.json()) as any;
          const choice = data?.choices?.[0];
          const msg = choice?.message;

          console.log(`[OmniRoute Loop] Turn ${turn}/${maxTurns} | Model: ${currentModel} | ToolCalls: ${msg?.tool_calls?.length || 0} | Finish: ${choice?.finish_reason} | Content: ${(msg?.content || '').slice(0, 100).replace(/\n/g, ' ')}`);

          // Model succeeded! Keep activeModelIndex on currentModel
          activeModelIndex = (activeModelIndex + attempt) % candidateModels.length;
          turnSuccess = true;

          if (msg?.tool_calls && Array.isArray(msg.tool_calls) && msg.tool_calls.length > 0) {
            messages.push(msg);
            for (const tc of msg.tool_calls) {
              const toolStart = Date.now();
              let parsedArgs: any = {};
              try {
                parsedArgs = JSON.parse(tc.function.arguments || '{}');
              } catch (parseErr: any) {
                console.warn(`[OmniRoute Tool] Failed to parse arguments for ${tc.function.name}: ${parseErr.message}`);
                parsedArgs = { _rawArguments: tc.function.arguments };
              }

              let toolResult: any;
              let toolError: string | undefined;

              try {
                console.log(`[OmniRoute Tool] Executing ${tc.function.name} (${parsedArgs.filePath || ''})`);
                toolResult = await agentTools.executeToolByName(executionContext, tc.function.name, parsedArgs);
              } catch (err: any) {
                toolError = err.message;
                toolResult = { error: err.message };
                console.warn(`[OmniRoute Tool] Error executing ${tc.function.name}: ${err.message}`);
              }

              toolCallsExecuted.push({
                turn,
                toolName: tc.function.name,
                args: parsedArgs,
                resultSummary: typeof toolResult === 'string' ? toolResult.slice(0, 80) : JSON.stringify(toolResult).slice(0, 80),
                status: toolError ? 'failure' : 'success',
                error: toolError,
                durationMs: Date.now() - toolStart
              });

              messages.push({
                role: 'tool',
                tool_call_id: tc.id,
                content: JSON.stringify(toolResult)
              });
            }
            break; // Proceed to next turn
          }

          const text = (msg?.content || '').trim();
          const isWriteExpected = allowedTools.some((t) => t.name === 'WriteFile' || t.name === 'EditFile');
          const hasWriteToolExecuted = toolCallsExecuted.some((tc) => tc.toolName === 'WriteFile' || tc.toolName === 'EditFile');

          // If output was cut off by token limit, prompt model to continue writing
          if (choice?.finish_reason === 'length' && turn < maxTurns - 1) {
            messages.push(msg || { role: 'assistant', content: text });
            messages.push({
              role: 'user',
              content: 'Your previous turn reached maximum token limit. Please immediately invoke WriteFile to complete the required code files directly.'
            });
            break;
          }

          // If a write tool is expected but the model returned explanatory text instead of calling WriteFile:
          if (isWriteExpected && !hasWriteToolExecuted && turn < maxTurns - 1) {
            messages.push(msg);
            messages.push({
              role: 'user',
              content: 'DO NOT just describe the code in chat. You MUST invoke the WriteFile tool to save the complete code file directly into the workspace now.'
            });
            break; // Proceed to next turn so model can invoke WriteFile
          }

          if (choice?.finish_reason === 'stop' && (text.length >= minChars || hasWriteToolExecuted)) {
            return {
              text: text || `Executed ${toolCallsExecuted.length} tool calls successfully.`,
              provider: 'omniroute',
              model: currentModel,
              executionStatus: 'COMPLETED'
            };
          }

          if (hasWriteToolExecuted && turn >= 3) {
            return {
              text: text || `Executed ${toolCallsExecuted.length} tool calls successfully.`,
              provider: 'omniroute',
              model: currentModel,
              executionStatus: 'COMPLETED'
            };
          }

          break; // Empty content received, proceed to next turn
        } catch (turnErr: any) {
          lastTurnError = turnErr.message;
          console.warn(`[OmniRoute Failover] Model "${currentModel}" failed on turn ${turn}: ${turnErr.message}`);
          markOmniModelCooldown(currentModel, 45000);
          const nextModel = candidateModels[(activeModelIndex + attempt + 1) % candidateModels.length];
          console.log(`[OmniRoute Failover] Auto-switching immediately to candidate "${nextModel}"...`);
        }
      }

      if (!turnSuccess) {
        throw new Error(`All candidate OmniRoute models in pool failed on turn ${turn}: ${lastTurnError}`);
      }
    }

    // Turn limit reached on OmniRoute: perform one finalization-only call WITHOUT tools
    if (toolCallsExecuted.length >= maxTurns) {
      messages.push({
        role: 'user',
        content: `You have reached the maximum tool execution limit (${maxTurns} turns). Do not call any more tools. Summarize:
1. Work completed
2. Files created or modified
3. Remaining tasks
4. Any blockers or issues encountered`
      });

      for (let attempt = 0; attempt < candidateModels.length; attempt++) {
        const finalModel = candidateModels[(activeModelIndex + attempt) % candidateModels.length];
        try {
          const finalRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.apiKey}`,
              'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(timeoutMs),
            body: JSON.stringify({
              model: finalModel,
              messages,
              temperature: 0.5,
              max_tokens: 4096
            })
          });

          if (finalRes.ok) {
            const finalData = (await finalRes.json()) as any;
            const finalContent = (finalData?.choices?.[0]?.message?.content || '').trim();
            if (finalContent.length > 0) {
              return {
                text: finalContent,
                provider: 'omniroute',
                model: finalModel,
                executionStatus: 'COMPLETED',
                finalizationCalled: true
              };
            }
          }
        } catch (fErr: any) {
          console.warn(`[OmniRoute Failover] Finalization call failed on ${finalModel}:`, fErr.message);
        }
      }

      throw new Error(`Autonomous tool execution reached maximum turn limit (${maxTurns}) without concluding`);
    }

    if (toolCallsExecuted.length > 0) {
      return {
        text: `Executed ${toolCallsExecuted.length} tool calls successfully.`,
        provider: 'omniroute',
        model: candidateModels[activeModelIndex],
        executionStatus: 'COMPLETED'
      };
    }

    throw new Error('OmniRoute tool loop exited without response');
  }

  // Exclusively route through OmniRoute Antigravity Model Pool & Load Balancer
  const omniRes = await runOmniRouteToolLoop();
  return {
    ...omniRes,
    durationMs: Date.now() - start,
    fallbackOccurred: false,
    toolCallsExecuted,
    turnsCount: toolCallsExecuted.length + 1
  };
}
