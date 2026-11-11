```javascript
// app.js - Usopp's Backend & Application Logic Engine
// Sports Management — Premier League & Arena Hub

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ENGINE & LOCALSTORAGE REHYDRATION ---
  const STORAGE_KEY = 'SPORTS_HUB_STATE_v1';

  const defaultState = {
    searchQuery: '',
    currentCategory: 'all',
    savedMatches: ['m1', 'm3'],
    bookings: [
      { id: 'b1', turf: 'Emirates Turf Arena - Pitch A', date: '2025-05-12', time: '18:00 - 19:30', sport: 'Football', price: 45, status: 'Confirmed' },
      { id: 'b2', turf: 'Stamford Indoor Court 2', date: '2025-05-14', time: '20:00 - 21:00', sport: 'Basketball', price: 60, status: 'Confirmed' }
    ],
    matches: [
      { id: 'm1', league: 'Premier League', home: 'Arsenal FC', away: 'Chelsea FC', scoreHome: 2, scoreAway: 1, time: '78\' Live', status: 'live', venue: 'Emirates Arena', sport: 'football' },
      { id: 'm2', league: 'T20 Super Cup', home: 'Mumbai Indians', away: 'Chennai Kings', scoreHome: '184/5', scoreAway: '142/3', time: '15.4 ov', status: 'live', venue: 'Wankhede Stadium', sport: 'cricket' },
      { id: 'm3', league: 'Pro League', home: 'LA Lakers', away: 'GS Warriors', scoreHome: 108, scoreAway: 102, time: 'Q4 1:45', status: 'live', venue: 'Crypto Arena', sport: 'basketball' },
      { id: 'm4', league: 'Champions League', home: 'Real Madrid', away: 'Bayern Munich', scoreHome: 0, scoreAway: 0, time: '21:00 GMT', status: 'upcoming', venue: 'Santiago Bernabéu', sport: 'football' }
    ],
    turfs: [
      { id: 't1', name: 'Emirates Elite Turf - Pitch A', location: 'North London, UK', sport: 'Football / Soccer', price: 45, rating: 4.9, slots: 3, image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80' },
      { id: 't2', name: 'Stamford Indoor Hardcourt', location: 'West London, UK', sport: 'Basketball / Futsal', price: 60, rating: 4.8, slots: 2, image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80' },
      { id: 't3', name: 'Lord\'s Cricket Net Arena', location: 'St John\'s Wood, London', sport: 'Cricket Practice', price: 50, rating: 4.9, slots: 4, image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80' }
    ],
    rosters: [
      { id: 'r1', team: 'Arsenal FC', player: 'Bukayo Saka', position: 'Right Winger', rating: 91, stats: '16 Goals, 12 Assists', status: 'Match Fit' },
      { id: 'r2', team: 'Arsenal FC', player: 'Martin Ødegaard', position: 'Attacking Midfield', rating: 89, stats: '9 Goals, 14 Assists', status: 'Match Fit' },
      { id: 'r3', team: 'Chelsea FC', player: 'Cole Palmer', position: 'Attacking Midfield', rating: 90, stats: '20 Goals, 9 Assists', status: 'Match Fit' },
      { id: 'r4', team: 'LA Lakers', player: 'LeBron James', position: 'Forward', rating: 96, stats: '25.4 PPG, 8.2 APG', status: 'Match Fit' }
    ],
    tournaments: [
      { id: 'to1', name: 'Global Champions Cup 2025', sport: 'Football', prize: '$50,000', dates: 'June 10 - July 02', status: 'Registration Open', teams: '16/32 Slots' },
      { id: 'to2', name: 'Metro T20 Smash League', sport: 'Cricket', prize: '$25,000', dates: 'July 15 - Aug 10', status: 'Upcoming', teams: '8/12 Slots' },
      { id: 'to3', name: 'City Streetball Open', sport: 'Basketball', prize: '$10,000', dates: 'May 20 - May 22', status: 'Filling Fast', teams: '14/16 Slots' }
    ],
    coaching: [
      { id: 'c1', title: 'Pro Striker Masterclass', coach: 'Thierry H. (Legend)', duration: '4 Weeks', price: 199, level: 'Advanced' },
      { id: 'c2', title: 'Elite Playmaking & Vision', coach: 'Zinedine Z.', duration: '6 Weeks', price: 249, level: 'Pro Level' },
      { id: 'c3', title: 'Power Pace & Agility Clinic', coach: 'Usain B. Performance', duration: '3 Weeks', price: 149, level: 'All Levels' }
    ]
  };

  let state = loadState();

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('State load error:', e);
    }
    return defaultState;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      updateBadgeCounts();
    } catch (e) {
      console.error('State save error:', e);
    }
  }

  // --- TOAST NOTIFICATION ENGINE ---
  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-slate-800';
    toast.className = `${bg} text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 transform translate-y-5 opacity-0 transition-all duration-300 font-medium text-sm border border-white/10`;
    
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
    toast.innerHTML = `<i class="fa-solid ${icon} text-lg"></i><span>${message}</span>`;
    
    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-5', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('translate-y-5', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- MODAL ENGINE ---
  function createModal(title, bodyHTML, onSubmit = null) {
    const existing = document.getElementById('dynamic-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'dynamic-modal';
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn';
    
    overlay.innerHTML = `
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <h3 class="text-lg font-bold flex items-center gap-2"><i class="fa-solid fa-trophy text-amber-400"></i> ${title}</h3>
          <button type="button" class="modal-close text-slate-400 hover:text-white transition w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/50 hover:bg-slate-800">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>
        <div class="p-6 overflow-y-auto space-y-4">
          ${bodyHTML}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeModal = () => overlay.remove();
    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    const form = overlay.querySelector('form');
    if (form && onSubmit) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data, closeModal);
      });
    }

    return { overlay, closeModal };
  }

  // --- DYNAMIC RENDERING & HUB GENERATOR ---
  const mainContentEl = document.querySelector('.main-content');
  
  function renderHub() {
    // Preserve overview banner if 'all' or category selected, or render dynamic section container
    let container = document.getElementById('hub-dynamic-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'hub-dynamic-container';
      container.className = 'mt-8 space-y-10';
      mainContentEl.appendChild(container);
    }

    const q = state.searchQuery.toLowerCase().trim();
    const cat = state.currentCategory;

    let html = '';

    // Matches Section
    if (cat === 'all' || cat === 'matches') {
      const filteredMatches = state.matches.filter(m => 
        m.home.toLowerCase().includes(q) || m.away.toLowerCase().includes(q) || m.league.toLowerCase().includes(q) || m.venue.toLowerCase().includes(q)
      );

      if (filteredMatches.length > 0 || cat === 'matches') {
        html += `
          <section class="hub-section">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i class="fa-solid fa-futbol text-emerald-400"></i> Live Match Fixtures</h3>
                <p class="text-xs text-slate-400 mt-1">Real-time telemetry and schedule tracker</p>
              </div>
              <button type="button" data-action="add-match" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-emerald-900/30">
                <i class="fa-solid fa-plus"></i> Add Fixture
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              ${filteredMatches.map(m => {
                const isSaved = state.savedMatches.includes(m.id);
                return `
                  <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between shadow-xl relative group">
                    <div class="flex items-center justify-between text-xs text-slate-400 mb-3 pb-3 border-b border-slate-800">
                      <span class="px-2.5 py-1 bg-slate-800 rounded-lg font-medium text-slate-300">${m.league}</span>
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded font-semibold uppercase tracking-wider animate-pulse">${m.time}</span>
                        <button type="button" data-action="toggle-save" data-id="${m.id}" class="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition" title="Save Match">
                          <i class="${isSaved ? 'fa-solid text-amber-400' : 'fa-regular'} fa-bookmark"></i>
                        </button>
                      </div>
                    </div>
                    <div class="flex items-center justify-between my-2">
                      <div class="font-bold text-base text-white w-2/5 truncate">${m.home}</div>
                      <div class="px-3 py-1.5 bg-slate-800/90 rounded-xl font-mono text-emerald-400 font-extrabold text-lg tracking-wider border border-slate-700/50">${m.scoreHome} - ${m.scoreAway}</div>
                      <div class="font-bold text-base text-white w-2/5 truncate text-right">${m.away}</div>
                    </div>
                    <div class="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-800/50">
                      <span><i class="fa-solid fa-location-dot mr-1"></i> ${m.venue}</span>
                      <button type="button" data-action="simulate-goal" data-id="${m.id}" class="text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                        <i class="fa-solid fa-bolt"></i> Simulate Action
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        `;
      }
    }

    // Turf Booking Section
    if (cat === 'all' || cat === 'turf') {
      const filteredTurfs = state.turfs.filter(t => 
        t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q) || t.sport.toLowerCase().includes(q)
      );

      if (filteredTurfs.length > 0 || cat === 'turf') {
        html += `
          <section class="hub-section">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i class="fa-solid fa-calendar-check text-cyan-400"></i> Arena Turf & Pitch Bookings</h3>
                <p class="text-xs text-slate-400 mt-1">Reserve premier synthetic turfs and indoor courts instantly</p>
              </div>
              <button type="button" data-action="add-turf" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-cyan-900/30">
                <i class="fa-solid fa-plus"></i> List New Turf
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              ${filteredTurfs.map(t => `
                <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group">
                  <div class="h-36 relative overflow-hidden">
                    <img src="${t.image}" alt="${t.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <div class="absolute top-3 right-3 bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 flex items-center gap-1">
                      <i class="fa-solid fa-star"></i> ${t.rating}
                    </div>
                    <div class="absolute bottom-3 left-3 bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-md text-xs font-semibold">
                      ${t.slots} Slots Left Tonight
                    </div>
                  </div>
                  <div class="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <span class="text-xs text-cyan-400 font-semibold uppercase tracking-wider">${t.sport}</span>
                      <h4 class="text-base font-bold text-white mt-1">${t.name}</h4>
                      <p class="text-xs text-slate-400 mt-1"><i class="fa-solid fa-location-dot mr-1"></i> ${t.location}</p>
                    </div>
                    <div class="flex items-center justify-between mt-5 pt-4 border-t border-slate-800">
                      <div>
                        <span class="text-xs text-slate-400">Rate:</span>
                        <span class="text-base font-extrabold text-white ml-1">$${t.price}<small class="text-xs text-slate-400 font-normal">/hr</small></span>
                      </div>
                      <button type="button" data-action="book-turf" data-id="${t.id}" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-cyan-900/30">
                        Book Slot
                      </button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        `;
      }
    }

    // Team Rosters & Player Stats Section
    if (cat === 'all' || cat === 'roster') {
      const filteredRosters = state.rosters.filter(r => 
        r.team.toLowerCase().includes(q) || r.player.toLowerCase().includes(q) || r.position.toLowerCase().includes(q)
      );

      if (filteredRosters.length > 0 || cat === 'roster') {
        html += `
          <section class="hub-section">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i class="fa-solid fa-users text-purple-400"></i> Team Rosters & Player Analytics</h3>
                <p class="text-xs text-slate-400 mt-1">Player ratings, performance metrics and squad management</p>
              </div>
              <button type="button" data-action="add-player" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-purple-900/30">
                <i class="fa-solid fa-plus"></i> Add Player
              </button>
            </div>
            <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-slate-800 text-xs font-semibold text-slate-400 bg-slate-950/60">
                      <th class="p-4">Player Name</th>
                      <th class="p-4">Team</th>
                      <th class="p-4">Position</th>
                      <th class="p-4">Rating</th>
                      <th class="p-4">Key Stats</th>
                      <th class="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-800/60 text-sm">
                    ${filteredRosters.map(r => `
                      <tr class="hover:bg-slate-800/40 transition">
                        <td class="p-4 font-bold text-white flex items-center gap-2">
                          <div class="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-extrabold text-xs">${r.player.charAt(0)}</div>
                          ${r.player}
                        </td>
                        <td class="p-4 text-slate-300">${r.team}</td>
                        <td class="p-4"><span class="px-2.5 py-1 bg-slate-800 rounded-lg text-xs text-slate-300 font-medium">${r.position}</span></td>
                        <td class="p-4 font-mono font-bold text-amber-400">${r.rating}</td>
                        <td class="p-4 text-xs text-slate-300">${r.stats}</td>
                        <td class="p-4 text-right">
                          <button type="button" data-action="view-player" data-id="${r.id}" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition">
                            Profile
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        `;
      }
    }

    // Tournaments Section
    if (cat === 'all' || cat === 'tournament') {
      const filteredTournaments = state.tournaments.filter(to => 
        to.name.toLowerCase().includes(q) || to.sport.toLowerCase().includes(q)
      );

      if (filteredTournaments.length > 0 || cat === 'tournament') {
        html += `
          <section class="hub-section">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i class="fa-solid fa-award text-amber-400"></i> Championships & Tournaments</h3>
                <p class="text-xs text-slate-400 mt-1">Compete in verified leagues and win cash prize pools</p>
              </div>
              <button type="button" data-action="add-tournament" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-amber-900/30">
                <i class="fa-solid fa-plus"></i> Host Tournament
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              ${filteredTournaments.map(to => `
                <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span class="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-semibold rounded">${to.sport}</span>
                      <span class="text-emerald-400 font-semibold">${to.status}</span>
                    </div>
                    <h4 class="text-base font-bold text-white">${to.name}</h4>
                    <p class="text-xs text-slate-400 mt-2"><i class="fa-regular fa-calendar mr-1"></i> ${to.dates}</p>
                  </div>
                  <div class="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span class="text-xs text-slate-400 block">Prize Pool</span>
                      <span class="text-base font-extrabold text-amber-400">${to.prize}</span>
                    </div>
                    <button type="button" data-action="register-tournament" data-id="${to.id}" class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-amber-900/30">
                      Register
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        `;
      }
    }

    // Coaching / Pro Academy Section
    if (cat === 'all' || cat === 'coaching') {
      const filteredCoaching = state.coaching.filter(c => 
        c.title.toLowerCase().includes(q) || c.coach.toLowerCase().includes(q) || c.level.toLowerCase().includes(q)
      );

      if (filteredCoaching.length > 0 || cat === 'coaching') {
        html += `
          <section class="hub-section">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-xl font-bold text-white flex items-center gap-2"><i class="fa-solid fa-dumbbell text-rose-400"></i> Pro Academy & Coaching Clinics</h3>
                <p class="text-xs text-slate-400 mt-1">Train with legendary coaches and level up your game</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              ${filteredCoaching.map(c => `
                <div class="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                  <div>
                    <span class="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded">${c.level}</span>
                    <h4 class="text-base font-bold text-white mt-2">${c.title}</h4>
                    <p class="text-xs text-slate-400 mt-1"><i class="fa-solid fa-chalkboard-user mr-1"></i> ${c.coach}</p>
                    <p class="text-xs text-slate-500 mt-1"><i class="fa-regular fa-clock mr-1"></i> Duration: ${c.duration}</p>
                  </div>
                  <div class="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span class="text-xs text-slate-400 block">Tuition</span>
                      <span class="text-base font-extrabold text-white">$${c.price}</span>
                    </div>
                    <button type="button" data-action="enroll-coaching" data-id="${c.id}" class="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-900/30">
                      Enroll Now
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        `;
      }
    }

    container.innerHTML = html;
  }

  function updateBadgeCounts() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = state.bookings.length;
    }
  }

  // --- EVENT BINDING & INTERACTION ENGINE ---
  
  // Search Form Binding
  const searchForm = document.getElementById('search-form');
  const siteSearchInput = document.getElementById('site-search');
  
  if (searchForm && siteSearchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.searchQuery = siteSearchInput.value;
      renderHub();
      showToast(`Showing results for "${state.searchQuery}"`, 'info');
    });

    siteSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderHub();
    });
  }

  // Category Filter Buttons Binding
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentCategory = btn.getAttribute('data-category');
      renderHub();
      showToast(`Switched to ${btn.textContent.trim()} Hub`, 'info');
    });
  });

  // Header Actions: Saved Matches & Passes
  const wishlistButton = document.getElementById('wishlist-button');
  if (wishlistButton) {
    wishlistButton.addEventListener('click', () => {
      const saved = state.matches.filter(m => state.savedMatches.includes(m.id));
      const bodyHTML = saved.length > 0 ? `
        <div class="space-y-3">
          ${saved.map(m => `
            <div class="bg-slate-800/80 p-3 rounded-xl flex items-center justify-between text-sm">
              <div>
                <span class="text-xs text-amber-400 font-semibold">${m.league}</span>
                <div class="font-bold text-white">${m.home} vs ${m.away}</div>
              </div>
              <span class="text-xs text-emerald-400 font-mono">${m.scoreHome} - ${m.scoreAway}</span>
            </div>
          `).join('')}
        </div>
      ` : `<p class="text-slate-400 text-sm text-center py-6">No saved matches in your bookmark list yet.</p>`;
      createModal('Saved Match Bookmarks', bodyHTML);
    });
  }

  const cartButton = document.getElementById('cart-button');
  if (cartButton) {
    cartButton.addEventListener('click', () => {
      const bodyHTML = state.bookings.length > 0 ? `
        <div class="space-y-3">
          ${state.bookings.map(b => `
            <div class="bg-slate-800/80 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span class="text-xs text-cyan-400 font-semibold">${b.sport} • ${b.status}</span>
                <div class="font-bold text-white text-sm mt-0.5">${b.turf}</div>
                <div class="text-xs text-slate-400 mt-1"><i class="fa-regular fa-calendar mr-1"></i> ${b.date} | ${b.time}</div>
              </div>
              <div class="text-right">
                <span class="font-extrabold text-emerald-400 text-sm block">$${b.price}</span>
                <button type="button" data-action="cancel-booking" data-id="${b.id}" class="text-xs text-rose-400 hover:underline mt-1 block">Cancel Pass</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="pt-4 border-t border-slate-800 flex items-center justify-between font-bold text-base">
          <span>Total Active Passes:</span>
          <span class="text-emerald-400">$${state.bookings.reduce((sum, b) => sum + b.price, 0)}</span>
        </div>
      ` : `<p class="text-slate-400 text-sm text-center py-6">No active turf bookings or match passes found.</p>`;
      
      const { overlay, closeModal } = createModal('My Active Passes & Bookings', bodyHTML);
      
      // Bind cancel pass inside modal
      overlay.querySelectorAll('[data-action="cancel-booking"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          state.bookings = state.bookings.filter(b => b.id !== id);
          saveState();
          closeModal();
          renderHub();
          showToast('Pass successfully cancelled & refunded.', 'success');
        });
      });
    });
  }

  // --- GLOBAL DELEGATED ACTION ENGINE ---
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!