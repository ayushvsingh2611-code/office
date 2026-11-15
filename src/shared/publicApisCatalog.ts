/**
 * Curated, Verified Public APIs Catalog for AgentHive
 *
 * Sourced from the best of:
 * 1. public-apis/public-apis (broad domain coverage)
 * 2. public-api-lists/public-api-lists (verified zero-auth, live-tested CORS)
 *
 * ALL APIs in this catalog MUST satisfy:
 * - Auth: NONE (no API keys, secrets, or tokens required)
 * - CORS: Supported (Access-Control-Allow-Origin: *)
 * - Protocol: HTTPS
 * - Free for public/client-side demo usage
 */

export interface PublicApiEntry {
  id: string;
  name: string;
  domain: string;
  category: 'ecommerce' | 'weather' | 'crypto' | 'finance' | 'food' | 'anime' | 'gaming' | 'trivia' | 'news' | 'books' | 'art' | 'users' | 'geography' | 'quotes';
  description: string;
  endpoint: string;
  docsUrl: string;
  keywords: string[];
  samplePath: string;
  mappingNotes: string;
  codeSample: string;
}

export const VERIFIED_PUBLIC_APIS: PublicApiEntry[] = [
  {
    id: 'dummyjson-products',
    name: 'DummyJSON Products',
    domain: 'E-Commerce / Shopping / Retail Store',
    category: 'ecommerce',
    description: 'High-quality e-commerce products with images, categories, ratings, reviews, stock, discounts, and prices.',
    endpoint: 'https://dummyjson.com/products?limit=12',
    docsUrl: 'https://dummyjson.com/docs/products',
    keywords: ['shop', 'store', 'cart', 'product', 'ecommerce', 'e-commerce', 'buy', 'retail', 'cloth', 'shoe', 'electronics', 'fashion', 'marketplace'],
    samplePath: 'data.products',
    mappingNotes: 'Each product has { id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images }',
    codeSample: `fetch('https://dummyjson.com/products?limit=12', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && Array.isArray(data.products) && data.products.length > 0) {
      renderProducts(data.products);
      showOnlineStatus('Live Catalog Data');
    }
  })
  .catch(err => console.warn('[DummyJSON] Fallback to seed data:', err.message));`
  },
  {
    id: 'fakestore-products',
    name: 'FakeStoreAPI',
    domain: 'Clothing, Jewelry & Electronics Store',
    category: 'ecommerce',
    description: 'Clean REST API for fashion, men & women clothing, jewelry, and electronics.',
    endpoint: 'https://fakestoreapi.com/products?limit=10',
    docsUrl: 'https://fakestoreapi.com/docs',
    keywords: ['fakestore', 'boutique', 'apparel', 'jewelry', 'clothing store'],
    samplePath: 'data (array)',
    mappingNotes: 'Array of { id, title, price, description, category, image, rating: { rate, count } }',
    codeSample: `fetch('https://fakestoreapi.com/products?limit=10', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(products => {
    if (Array.isArray(products) && products.length > 0) {
      renderProducts(products);
      showOnlineStatus('Live Store Data');
    }
  })
  .catch(err => console.warn('[FakeStore] Fallback to seed data:', err.message));`
  },
  {
    id: 'open-meteo',
    name: 'Open-Meteo Weather',
    domain: 'Weather & Climate Forecasts',
    category: 'weather',
    description: 'Accurate, global open-source weather forecast API. Zero key required, CORS enabled, no rate limits for non-commercial use.',
    endpoint: 'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto',
    docsUrl: 'https://open-meteo.com/en/docs',
    keywords: ['weather', 'forecast', 'temperature', 'climate', 'rain', 'humidity', 'wind', 'atmosphere', 'meteo'],
    samplePath: 'data.current',
    mappingNotes: 'Current values: { temperature_2m, relative_humidity_2m, weather_code, wind_speed_10m }. Units in current_units.',
    codeSample: `fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && data.current) {
      updateWeatherDisplay(data.current, data.current_units);
      showOnlineStatus('Live Satellite Weather');
    }
  })
  .catch(err => console.warn('[OpenMeteo] Fallback to seed weather:', err.message));`
  },
  {
    id: 'coingecko-crypto',
    name: 'CoinGecko Simple Price',
    domain: 'Cryptocurrency & Bitcoin Tracker',
    category: 'crypto',
    description: 'Live cryptocurrency market rates, prices, and 24h percentage changes across major coins.',
    endpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,ripple,dogecoin&vs_currencies=usd,inr,eur&include_24hr_change=true',
    docsUrl: 'https://www.coingecko.com/en/api/documentation',
    keywords: ['crypto', 'cryptocurrency', 'bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'doge', 'token', 'coin', 'blockchain', 'web3'],
    samplePath: 'data object keyed by coin id',
    mappingNotes: '{ bitcoin: { usd: 65000, inr: 5400000, usd_24h_change: 2.4 }, ethereum: { ... } }',
    codeSample: `fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,ripple,dogecoin&vs_currencies=usd,inr&include_24hr_change=true', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && data.bitcoin) {
      updateCryptoPrices(data);
      showOnlineStatus('Live Crypto Ticker');
    }
  })
  .catch(err => console.warn('[CoinGecko] Fallback to seed crypto rates:', err.message));`
  },
  {
    id: 'open-exchangerate',
    name: 'ExchangeRate-API Open Access',
    domain: 'Forex Currency Exchange Rates',
    category: 'finance',
    description: 'Real-time foreign exchange currency conversion rates with USD baseline.',
    endpoint: 'https://open.er-api.com/v6/latest/USD',
    docsUrl: 'https://www.exchangerate-api.com/docs/free',
    keywords: ['currency', 'forex', 'exchange rate', 'converter', 'dollar', 'euro', 'rupee', 'yen', 'finance', 'money'],
    samplePath: 'data.rates',
    mappingNotes: 'Response { result: "success", base_code: "USD", rates: { EUR: 0.92, INR: 83.5, GBP: 0.79, JPY: 155.1 } }',
    codeSample: `fetch('https://open.er-api.com/v6/latest/USD', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && data.rates) {
      updateExchangeRates(data.rates);
      showOnlineStatus('Live Forex Rates');
    }
  })
  .catch(err => console.warn('[Forex] Fallback to seed exchange rates:', err.message));`
  },
  {
    id: 'themealdb-recipes',
    name: 'TheMealDB',
    domain: 'Cooking, Food & Recipe Finder',
    category: 'food',
    description: 'Global food recipes with step-by-step instructions, ingredients, thumbnail photos, and video links.',
    endpoint: 'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken',
    docsUrl: 'https://www.themealdb.com/api.php',
    keywords: ['food', 'recipe', 'cooking', 'restaurant', 'meal', 'dish', 'dinner', 'chef', 'kitchen', 'menu', 'culinary', 'taste'],
    samplePath: 'data.meals',
    mappingNotes: 'Array of { idMeal, strMeal, strCategory, strArea, strInstructions, strMealThumb, strTags }',
    codeSample: `fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=chicken', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && Array.isArray(data.meals) && data.meals.length > 0) {
      renderRecipes(data.meals);
      showOnlineStatus('Live Chef Recipes');
    }
  })
  .catch(err => console.warn('[TheMealDB] Fallback to seed recipes:', err.message));`
  },
  {
    id: 'thecocktaildb-drinks',
    name: 'TheCocktailDB',
    domain: 'Beverages, Cocktails & Bartending',
    category: 'food',
    description: 'Drink and cocktail recipes with glass types, alcoholic classification, ingredients, and photos.',
    endpoint: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita',
    docsUrl: 'https://www.thecocktaildb.com/api.php',
    keywords: ['cocktail', 'drink', 'beverage', 'bar', 'bartender', 'mocktail', 'juice', 'smoothie'],
    samplePath: 'data.drinks',
    mappingNotes: 'Array of { idDrink, strDrink, strCategory, strAlcoholic, strGlass, strInstructions, strDrinkThumb }',
    codeSample: `fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && Array.isArray(data.drinks)) {
      renderDrinks(data.drinks);
      showOnlineStatus('Live Bar Menu');
    }
  })
  .catch(err => console.warn('[TheCocktailDB] Fallback to seed drinks:', err.message));`
  },
  {
    id: 'jikan-anime',
    name: 'Jikan (MyAnimeList Unofficial API)',
    domain: 'Anime, Manga & Japanese Animation',
    category: 'anime',
    description: 'Comprehensive anime database with titles, cover posters, ratings, synopsis, episodes, and studios.',
    endpoint: 'https://api.jikan.moe/v4/top/anime?limit=12',
    docsUrl: 'https://docs.api.jikan.moe/',
    keywords: ['anime', 'manga', 'otaku', 'naruto', 'one piece', 'japanese', 'animation', 'series', 'episodes'],
    samplePath: 'data.data',
    mappingNotes: 'Array of { mal_id, title, score, episodes, images: { jpg: { large_image_url } }, synopsis, genres: [...] }',
    codeSample: `fetch('https://api.jikan.moe/v4/top/anime?limit=12', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(res => {
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      renderAnimeCards(res.data);
      showOnlineStatus('Live Top Anime Feed');
    }
  })
  .catch(err => console.warn('[Jikan] Fallback to seed anime:', err.message));`
  },
  {
    id: 'pokeapi-pokemon',
    name: 'PokeAPI',
    domain: 'Pokémon Game & Pokedex',
    category: 'gaming',
    description: 'RESTful Pokémon API providing sprite artwork, types, moves, abilities, and stats.',
    endpoint: 'https://pokeapi.co/api/v2/pokemon?limit=12',
    docsUrl: 'https://pokeapi.co/docs/v2',
    keywords: ['pokemon', 'pokedex', 'pokeball', 'pikachu', 'charizard', 'creature', 'monster'],
    samplePath: 'data.results',
    mappingNotes: 'List of { name, url }. Sprites can be derived: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png',
    codeSample: `fetch('https://pokeapi.co/api/v2/pokemon?limit=12', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && Array.isArray(data.results)) {
      renderPokedex(data.results);
      showOnlineStatus('Live PokeDex');
    }
  })
  .catch(err => console.warn('[PokeAPI] Fallback to seed pokemon:', err.message));`
  },
  {
    id: 'opentdb-trivia',
    name: 'Open Trivia Database',
    domain: 'Quiz, Trivia & Learning Games',
    category: 'trivia',
    description: 'Thousands of verified multiple-choice trivia questions categorized by difficulty and subject.',
    endpoint: 'https://opentdb.com/api.php?amount=10&type=multiple',
    docsUrl: 'https://opentdb.com/api_config.php',
    keywords: ['quiz', 'trivia', 'question', 'exam', 'test', 'flashcard', 'kahoot', 'game show', 'knowledge'],
    samplePath: 'data.results',
    mappingNotes: 'Array of { category, type, difficulty, question, correct_answer, incorrect_answers: string[] }',
    codeSample: `fetch('https://opentdb.com/api.php?amount=10&type=multiple', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      loadQuizQuestions(data.results);
      showOnlineStatus('Live Trivia Questions');
    }
  })
  .catch(err => console.warn('[OpenTriviaDB] Fallback to seed quiz:', err.message));`
  },
  {
    id: 'devto-articles',
    name: 'Dev.to Articles Feed',
    domain: 'Tech News, Developer Blogs & Articles',
    category: 'news',
    description: 'Live developer articles, tutorials, trending tech posts, and coding discussions with covers and authors.',
    endpoint: 'https://dev.to/api/articles?per_page=10',
    docsUrl: 'https://developers.forem.com/api/v1',
    keywords: ['news', 'blog', 'article', 'feed', 'medium', 'devto', 'developer', 'tech news', 'post', 'stories'],
    samplePath: 'data (array)',
    mappingNotes: 'Array of { id, title, description, url, cover_image, tag_list, positive_reactions_count, user: { name, profile_image } }',
    codeSample: `fetch('https://dev.to/api/articles?per_page=10', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(articles => {
    if (Array.isArray(articles) && articles.length > 0) {
      renderBlogPosts(articles);
      showOnlineStatus('Live Tech Feed');
    }
  })
  .catch(err => console.warn('[DevTo] Fallback to seed articles:', err.message));`
  },
  {
    id: 'openlibrary-books',
    name: 'Open Library Books Search',
    domain: 'Books, Authors & Digital Library',
    category: 'books',
    description: 'Global book database with millions of titles, author biographies, cover art, and publication years.',
    endpoint: 'https://openlibrary.org/search.json?q=science&limit=10',
    docsUrl: 'https://openlibrary.org/developers/api',
    keywords: ['book', 'library', 'read', 'author', 'novel', 'ebook', 'literature', 'publish', 'goodreads'],
    samplePath: 'data.docs',
    mappingNotes: 'Array of { title, author_name: string[], first_publish_year, cover_i }. Cover art: https://covers.openlibrary.org/b/id/{cover_i}-M.jpg',
    codeSample: `fetch('https://openlibrary.org/search.json?q=bestseller&limit=10', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && Array.isArray(data.docs) && data.docs.length > 0) {
      renderBooks(data.docs);
      showOnlineStatus('Live Book Catalog');
    }
  })
  .catch(err => console.warn('[OpenLibrary] Fallback to seed books:', err.message));`
  },
  {
    id: 'artic-museum',
    name: 'Art Institute of Chicago API',
    domain: 'Art, Museum & Fine Art Gallery',
    category: 'art',
    description: 'World-renowned museum collection with artwork titles, artists, descriptions, and high-resolution images.',
    endpoint: 'https://api.artic.edu/api/v1/artworks?limit=10&fields=id,title,artist_title,date_display,image_id',
    docsUrl: 'https://api.artic.edu/docs/',
    keywords: ['art', 'museum', 'painting', 'gallery', 'sculpture', 'artist', 'exhibition'],
    samplePath: 'data.data',
    mappingNotes: 'Array of { id, title, artist_title, date_display, image_id }. Image url: https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg',
    codeSample: `fetch('https://api.artic.edu/api/v1/artworks?limit=10&fields=id,title,artist_title,date_display,image_id', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(res => {
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      renderArtworks(res.data);
      showOnlineStatus('Live Museum Gallery');
    }
  })
  .catch(err => console.warn('[ArtInstitute] Fallback to seed art:', err.message));`
  },
  {
    id: 'randomuser-profiles',
    name: 'Random User Generator',
    domain: 'Social Profiles, Team Members & Avatars',
    category: 'users',
    description: 'Generates realistic random user profiles with portraits, full names, locations, emails, and contact details.',
    endpoint: 'https://randomuser.me/api/?results=10',
    docsUrl: 'https://randomuser.me/documentation',
    keywords: ['user', 'profile', 'avatar', 'team', 'member', 'social', 'contact', 'crm', 'employee', 'directory'],
    samplePath: 'data.results',
    mappingNotes: 'Array of { name: { first, last }, email, picture: { large, medium }, location: { city, country } }',
    codeSample: `fetch('https://randomuser.me/api/?results=10', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && Array.isArray(data.results)) {
      renderTeamMembers(data.results);
      showOnlineStatus('Live Member Directory');
    }
  })
  .catch(err => console.warn('[RandomUser] Fallback to seed team:', err.message));`
  },
  {
    id: 'restcountries-geography',
    name: 'REST Countries v3.1',
    domain: 'Countries, Geography & World Travel',
    category: 'geography',
    description: 'Comprehensive country data including official names, capitals, flags (SVG/PNG), currencies, populations, and maps.',
    endpoint: 'https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,currencies',
    docsUrl: 'https://gitlab.com/restcountries/restcountries',
    keywords: ['country', 'countries', 'geography', 'flag', 'travel', 'world', 'capital', 'nation'],
    samplePath: 'data (array)',
    mappingNotes: 'Array of { name: { common, official }, capital: string[], flags: { svg, png }, population, region, currencies }',
    codeSample: `fetch('https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,currencies', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(countries => {
    if (Array.isArray(countries) && countries.length > 0) {
      renderCountryGrid(countries.slice(0, 16));
      showOnlineStatus('Live World Geography');
    }
  })
  .catch(err => console.warn('[RestCountries] Fallback to seed countries:', err.message));`
  },
  {
    id: 'adviceslip-quotes',
    name: 'Advice Slip / Daily Quotes',
    domain: 'Quotes, Motivation & Wisdom',
    category: 'quotes',
    description: 'Lightweight, cheerful daily advice and inspirational quote snippets.',
    endpoint: 'https://api.adviceslip.com/advice',
    docsUrl: 'https://api.adviceslip.com/',
    keywords: ['quote', 'advice', 'motivation', 'wisdom', 'thought', 'daily tip', 'inspire'],
    samplePath: 'data.slip',
    mappingNotes: 'Object { slip: { id, advice } }',
    codeSample: `fetch('https://api.adviceslip.com/advice', { signal: AbortSignal.timeout(5000) })
  .then(res => res.json())
  .then(data => {
    if (data && data.slip && data.slip.advice) {
      updateDailyQuote(data.slip.advice);
      showOnlineStatus('Live Quote of the Day');
    }
  })
  .catch(err => console.warn('[AdviceSlip] Fallback to seed quote:', err.message));`
  }
];

/**
 * Finds the best matching public API from the catalog based on the user's prompt.
 */
export function matchPublicApi(prompt: string): PublicApiEntry | null {
  if (!prompt || typeof prompt !== 'string') return null;
  const p = prompt.toLowerCase();

  // Score each API based on keyword matches
  let bestMatch: PublicApiEntry | null = null;
  let highestScore = 0;

  for (const api of VERIFIED_PUBLIC_APIS) {
    let score = 0;
    for (const kw of api.keywords) {
      if (p.includes(kw)) {
        // Multi-word matches score higher
        score += kw.includes(' ') ? 3 : 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = api;
    }
  }

  // Only return if at least 1 keyword matched
  return highestScore > 0 ? bestMatch : null;
}

/**
 * Builds standard instructions and code snippet to inject into the builder/orchestrator prompt.
 * Enforces the Zero-Blank Hybrid Fallback Pattern:
 * 1. Synchronous seed data rendered immediately on DOMContentLoaded.
 * 2. Background async fetch with 5-second timeout and try/catch.
 * 3. Graceful offline fallback.
 */
export function buildOnlineDataDirectives(prompt: string): string {
  const matched = matchPublicApi(prompt);

  if (matched) {
    return `
────────────────────────────────────────────────────────────────────────
🌐 LIVE ONLINE DATA ENRICHMENT (VERIFIED PUBLIC API AVAILABLE):
- Domain Detected: "${matched.domain}" (${matched.name})
- Verified Endpoint (Free, Zero Auth, CORS Enabled):
  ${matched.endpoint}
- Data Mapping: ${matched.mappingNotes}

MANDATORY HYBRID FETCH PATTERN (ANTI-BLANK GUARANTEE):
1. IMMEDIATE SEED RENDER (Priority #1):
   - Define a local const array of 6-12 realistic seed items matching the domain.
   - Render this seed data into the DOM immediately inside DOMContentLoaded. The UI must NEVER be blank or show a spinning loader on initial load!
2. BACKGROUND ONLINE FETCH:
   - Call fetch('${matched.endpoint}', { signal: AbortSignal.timeout(5000) }) in the background.
   - If response is valid, smoothly update state and re-render the cards/list.
   - Show a small, subtle status badge in the header/footer (e.g. "🟢 Live Online Data" on fetch success, or "🟡 Offline Seed Data" if fetch fails).
3. RESILIENT TRY/CATCH:
   - Wrap the fetch in try...catch. If offline, blocked, or slow, catch the error and do NOTHING that breaks the page. Keep local seed data visible.
────────────────────────────────────────────────────────────────────────`;
  }

  // Generic fallback guidance for unmatched prompts
  return `
────────────────────────────────────────────────────────────────────────
🌐 DATA PERSISTENCE & ONLINE ENRICHMENT DIRECTIVE:
1. MANDATORY SEED DATA (Priority #1):
   - Define realistic in-memory seed data (6-12 realistic items with titles, badges, dates, prices, images).
   - Render synchronously on DOMContentLoaded so the application is rich, beautiful, and NEVER blank!
2. OPTIONAL ONLINE REFRESH:
   - If appropriate for the domain, you may fetch from standard zero-auth CORS APIs (e.g. DummyJSON for e-commerce, Open-Meteo for weather, CoinGecko for crypto) using AbortSignal.timeout(5000) inside a try/catch.
   - ALWAYS retain the local seed data as the primary guaranteed fallback.
────────────────────────────────────────────────────────────────────────`;
}
