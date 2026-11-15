'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const loadTs = require('./load-ts.cjs');

const {
  VERIFIED_PUBLIC_APIS,
  matchPublicApi,
  buildOnlineDataDirectives
} = loadTs('src/shared/publicApisCatalog.ts');

test('Public APIs Catalog — Structure and Integrity', (t) => {
  assert.ok(Array.isArray(VERIFIED_PUBLIC_APIS), 'Catalog should export an array');
  assert.ok(VERIFIED_PUBLIC_APIS.length >= 10, 'Catalog should have at least 10 curated APIs');

  for (const api of VERIFIED_PUBLIC_APIS) {
    assert.ok(api.id, `API ${api.name} missing id`);
    assert.ok(api.name, `API ${api.id} missing name`);
    assert.ok(api.endpoint.startsWith('https://'), `API ${api.id} endpoint must be HTTPS`);
    assert.ok(api.keywords.length > 0, `API ${api.id} must have keywords`);
    assert.ok(api.codeSample.includes('fetch'), `API ${api.id} codeSample must contain fetch`);
    assert.ok(api.codeSample.includes('AbortSignal.timeout'), `API ${api.id} codeSample must enforce timeout`);
    assert.ok(api.codeSample.includes('catch'), `API ${api.id} codeSample must handle errors gracefully`);
  }
});

test('Public APIs Catalog — Domain Keyword Matching', (t) => {
  // E-commerce
  const store = matchPublicApi('Create an modern e-commerce clothing store with cart');
  assert.ok(store, 'Should match an e-commerce API');
  assert.ok(store.category === 'ecommerce');

  // Weather
  const weather = matchPublicApi('Build a clean weather forecast application');
  assert.ok(weather, 'Should match a weather API');
  assert.equal(weather.id, 'open-meteo');

  // Crypto
  const crypto = matchPublicApi('Live cryptocurrency bitcoin portfolio dashboard');
  assert.ok(crypto, 'Should match a crypto API');
  assert.equal(crypto.id, 'coingecko-crypto');

  // Food / Recipes
  const food = matchPublicApi('A delicious cooking recipe finder with chicken dishes');
  assert.ok(food, 'Should match a food API');
  assert.equal(food.id, 'themealdb-recipes');

  // Anime
  const anime = matchPublicApi('Top anime series explorer with search');
  assert.ok(anime, 'Should match anime API');
  assert.equal(anime.id, 'jikan-anime');

  // Trivia
  const quiz = matchPublicApi('Multiplayer trivia quiz game with score');
  assert.ok(quiz, 'Should match trivia API');
  assert.equal(quiz.id, 'opentdb-trivia');

  // Pokemon
  const poke = matchPublicApi('Gotta catch em all Pokemon pokedex');
  assert.ok(poke, 'Should match Pokemon API');
  assert.equal(poke.id, 'pokeapi-pokemon');
});

test('Public APIs Catalog — Directives Generation & Zero-Blank Fallback', (t) => {
  const weatherDirectives = buildOnlineDataDirectives('Weather app for Tokyo');
  assert.ok(weatherDirectives.includes('LIVE ONLINE DATA ENRICHMENT'), 'Should include enrichment header');
  assert.ok(weatherDirectives.includes('api.open-meteo.com'), 'Should include Open-Meteo URL');
  assert.ok(weatherDirectives.includes('MANDATORY HYBRID FETCH PATTERN'), 'Should enforce hybrid fetch pattern');
  assert.ok(weatherDirectives.includes('ANTI-BLANK GUARANTEE'), 'Should mandate zero-blank guarantee');
  assert.ok(weatherDirectives.includes('AbortSignal.timeout(5000)'), 'Should specify 5-second timeout');

  // Generic prompt fallback
  const genericDirectives = buildOnlineDataDirectives('A simple calculator app');
  assert.ok(genericDirectives.includes('DATA PERSISTENCE & ONLINE ENRICHMENT DIRECTIVE'), 'Should provide generic directive');
  assert.ok(genericDirectives.includes('MANDATORY SEED DATA'), 'Should mandate seed data');
});
