'use strict';
require('dotenv').config();
const fs = require('fs');

const keys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean);

const candidateModels = [
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
  'gemini-3-flash-preview',
  'antigravity-preview-09-2026',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2-flash',
  'gemini-2-flash-lite'
];

const sampleTool = [
  {
    functionDeclarations: [
      {
        name: 'testTool',
        description: 'A test tool for checking function calling support',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' }
          },
          required: ['query']
        }
      }
    ]
  }
];

async function probeModel(model, apiKey) {
  const result = {
    model,
    apiAvailability: 'UNKNOWN',
    freeTierQuota: 'UNKNOWN',
    functionCalling: 'UNKNOWN',
    contextWindow: 'UNKNOWN',
    compatibility: 'UNKNOWN',
    status: 'UNKNOWN',
    details: ''
  };

  const keySnippet = apiKey ? apiKey.slice(-6) : 'none';

  // 1. Test basic text generation
  const textUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  try {
    const textRes = await fetch(textUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Respond with exactly: PANDA_HIVE_OK' }] }]
      })
    });

    if (!textRes.ok) {
      const errText = await textRes.text().catch(() => '');
      if (textRes.status === 404) {
        result.apiAvailability = 'NOT_FOUND_404';
        result.status = 'UNSUPPORTED';
        result.details = `Model ID not recognized by API endpoint (HTTP 404).`;
        return result;
      }
      if (textRes.status === 429) {
        result.apiAvailability = 'AVAILABLE_429';
        result.status = 'QUOTA EXHAUSTED';
        result.details = `HTTP 429 Quota Exceeded. Free tier limit or rate limit reached.`;
        return result;
      }
      result.apiAvailability = `HTTP_${textRes.status}`;
      result.status = textRes.status >= 500 ? 'UNAVAILABLE' : 'REQUIRES DIFFERENT API';
      result.details = `HTTP ${textRes.status}: ${errText.slice(0, 200)}`;
      return result;
    }

    const textData = await textRes.json();
    const candidateText = textData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    result.apiAvailability = 'AVAILABLE_200';
    result.details = `Text response received (${candidateText.trim().slice(0, 50)}). `;

  } catch (err) {
    result.apiAvailability = 'ERROR';
    result.status = 'UNKNOWN';
    result.details = `Network error: ${err.message}`;
    return result;
  }

  // 2. Test Function Calling
  try {
    const toolRes = await fetch(textUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Call testTool with query "PandaHive"' }] }],
        tools: sampleTool,
        toolConfig: { functionCallingConfig: { mode: 'AUTO' } }
      })
    });

    if (!toolRes.ok) {
      const errText = await toolRes.text().catch(() => '');
      result.functionCalling = 'FAILED_HTTP_' + toolRes.status;
      result.details += `Function calling rejected: HTTP ${toolRes.status}: ${errText.slice(0, 150)}. `;
      if (errText.includes('not supported') || toolRes.status === 400) {
        result.status = 'REQUIRES DIFFERENT API';
      }
    } else {
      const toolData = await toolRes.json();
      const fnCall = toolData?.candidates?.[0]?.content?.parts?.find(p => p.functionCall);
      if (fnCall) {
        result.functionCalling = 'SUPPORTED_CONFIRMED';
        result.details += `Tool call generated successfully (${fnCall.functionCall.name}). `;
      } else {
        result.functionCalling = 'SUPPORTED_TEXT_FALLBACK';
        result.details += `Model accepted tool schema but answered in text. `;
      }
    }
  } catch (err) {
    result.functionCalling = 'ERROR: ' + err.message;
  }

  // Final status evaluation
  if (result.apiAvailability === 'AVAILABLE_200') {
    if (result.functionCalling === 'SUPPORTED_CONFIRMED' || result.functionCalling === 'SUPPORTED_TEXT_FALLBACK') {
      result.compatibility = 'HIGH';
      result.status = 'SUPPORTED';
    } else {
      result.compatibility = 'PARTIAL_OR_DIFFERENT_API';
      result.status = 'REQUIRES DIFFERENT API';
    }
  }

  return result;
}

async function run() {
  console.log(`Starting probe with ${keys.length} Gemini API keys...`);
  const report = [];

  for (const model of candidateModels) {
    console.log(`Probing ${model}...`);
    let res = null;
    for (let i = 0; i < keys.length; i++) {
      res = await probeModel(model, keys[i]);
      if (res.status === 'SUPPORTED' || res.status === 'UNSUPPORTED' || res.status === 'REQUIRES DIFFERENT API') {
        break; // Definitive answer
      }
    }
    report.push(res);
  }

  fs.writeFileSync('scratch-model-probe-results.json', JSON.stringify(report, null, 2));
  console.log('Results saved to scratch-model-probe-results.json');
}

run();

