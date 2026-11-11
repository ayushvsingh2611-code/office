'use strict';
/**
 * Test Real Agent LLM Connection
 * Directly tests whether Google Gemini API accepts your AQ. key
 * and returns live AI-generated code from Franky.
 */
const fs = require('node:fs');
const path = require('node:path');

// 1. Read API Key from .env
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/GEMINI_API_KEY_1\s*=\s*([^\r\n]+)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
  console.error('❌ No GEMINI_API_KEY_1 found in .env');
  process.exit(1);
}

console.log('====================================================');
console.log('🤖 TESTING REAL GEMINI API FOR STRAW HAT AGENTS');
console.log('====================================================');
console.log(`Using Key: ${apiKey.slice(0, 10)}...${apiKey.slice(-6)}`);

async function testFrankyLiveAgent() {
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];

  for (const model of models) {
    console.log(`\n📡 Calling Google Gemini with model: ${model}...`);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            role: 'user',
            parts: [{
              text: 'You are Franky, UI Engineer from Straw Hat Dev Crew. Say hello in 1 sentence and output a simple 3-line HTML button for a gym.'
            }]
          }]
        })
      });

      console.log(`Response HTTP Status: ${res.status} ${res.statusText}`);
      const text = await res.text();

      if (res.ok) {
        const data = JSON.parse(text);
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log('\n✅ SUCCESS! REAL AI OUTPUT FROM FRANKY VIA GEMINI:');
        console.log('----------------------------------------------------');
        console.log(reply);
        console.log('----------------------------------------------------');
        return;
      } else {
        console.warn(`❌ Model ${model} returned non-200:`);
        console.warn(text);
      }
    } catch (err) {
      console.error(`Request failed:`, err.message);
    }
  }
}

testFrankyLiveAgent();

