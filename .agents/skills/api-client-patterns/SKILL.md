---
name: api-client-patterns
description: Robust client-side network patterns: zero-blank local seed data, background async refresh, 5-second timeouts, retry with exponential backoff, and LocalStorage cache.
license: MIT
---

# API Client & Resilient Network Patterns

## Purpose
Ensure web applications never turn blank, never crash on network outage, and provide real-time online updates with graceful offline seed fallbacks.

## The Mandatory Hybrid Pattern (Anti-Blank Guarantee)
1. **Synchronous Seed Render:**
   - Always define rich, realistic initial seed data (6-12 items).
   - Render to DOM synchronously inside `DOMContentLoaded`. The screen must NEVER be blank or show a spinning loader on initial load.

2. **Background Fetch with AbortSignal.timeout:**
   - Always bound network calls to a 5-second timeout so slow networks do not freeze state:
     ```javascript
     async function fetchWithFallback(url, onUpdate) {
       try {
         const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
         if (!res.ok) throw new Error(`HTTP ${res.status}`);
         const data = await res.json();
         onUpdate(data);
       } catch (err) {
         console.warn('[Network] Graceful fallback to seed data:', err.message);
       }
     }
     ```

3. **Status Indicator Badge:**
   - Show a subtle, non-intrusive status pill in the header:
     - `🟢 Live Online Data` when fetch succeeds.
     - `🟡 Offline / Local Data` when offline or on error.
