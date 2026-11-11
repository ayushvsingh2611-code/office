```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STRIKEX - Pro Sports Management & Arena Booking Portal</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Teko:wght@500;700&display=swap" rel="stylesheet">
    <!-- FontAwesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        strikex: {
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            500: '#22c55e',
                            600: '#16a34a',
                            700: '#15803d',
                            950: '#052e16',
                        },
                        turf: {
                            dark: '#090d16',
                            card: '#111827',
                            border: '#1f2937',
                            accent: '#10b981',
                            neon: '#39ff14'
                        }
                    },
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        display: ['"Teko"', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-turf-dark text-slate-100 font-sans antialiased min-h-screen flex flex-col selection:bg-emerald-500 selection:text-black">

    <!-- TOP BAR NOTIFICATION -->
    <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span class="bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider text-[10px] animate-pulse">🔥 LIVE MATCH</span>
        <span>FC Vipers vs Titan United playing right now in Arena A!</span>
        <button onclick="switchTab('fixtures')" class="underline hover:text-emerald-200 transition">Watch Live Stats &rarr;</button>
    </div>

    <!-- MAIN APP SHELL -->
    <div class="flex flex-1 relative overflow-hidden">

        <!-- SIDEBAR NAVIGATION -->
        <aside id="sidebar" class="w-64 bg-turf-card/90 backdrop-blur-xl border-r border-turf-border flex flex-col z-30 transition-all duration-300 -translate-x-full lg:translate-x-0 fixed lg:static inset-y-0 left-0">
            <!-- Brand Logo -->
            <div class="p-6 border-b border-turf-border flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20 font-display tracking-wider">
                        SX
                    </div>
                    <div>
                        <h1 class="font-display text-2xl font-bold tracking-wider text-white leading-none">STRIKE<span class="text-emerald-400">X</span></h1>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">Sports OS & Turf Pro</p>
                    </div>
                </div>
                <button id="closeSidebar" class="lg:hidden text-slate-400 hover:text-white">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
            </div>

            <!-- Nav Links -->
            <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                <p class="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
                <button onclick="switchTab('dashboard')" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all text-slate-400 hover:text-white hover:bg-slate-800/60 active" data-tab="dashboard">
                    <i class="fa-solid fa-chart-pie w-5 text-center text-emerald-400"></i> Dashboard
                </button>
                <button onclick="switchTab('fixtures')" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="fixtures">
                    <i class="fa-solid fa-calendar-days w-5 text-center text-emerald-400"></i> Live Fixtures & Scores
                </button>
                <button onclick="switchTab('turf')" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="turf">
                    <i class="fa-solid fa-futbol w-5 text-center text-emerald-400"></i> Arena Turf Booking
                </button>
                <button onclick="switchTab('rosters')" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="rosters">
                    <i class="fa-solid fa-shield-halved w-5 text-center text-emerald-400"></i> Team Rosters
                </button>
                <button onclick="switchTab('stats')" class="nav-btn w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all text-slate-400 hover:text-white hover:bg-slate-800/60" data-tab="stats">
                    <i class="fa-solid fa-chart-column w-5 text-center text-emerald-400"></i> Player Stats & Rankings
                </button>

                <p class="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-8 mb-2">Management</p>
                <button onclick="openModal('quickBookingModal')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20">
                    <i class="fa-solid fa-plus-circle w-5 text-center"></i> Quick Turf Slot
                </button>
                <button onclick="openModal('addPlayerModal')" class="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all text-slate-400 hover:text-white hover:bg-slate-800/60">
                    <i class="fa-solid fa-user-plus w-5 text-center text-teal-400"></i> Register Player
                </button>
            </nav>

            <!-- User Profile Footer -->
            <div class="p-4 border-t border-turf-border flex items-center gap-3 bg-slate-900/50">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Admin" class="w-10 h-10 rounded-full object-cover border-2 border-emerald-500">
                <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold text-white truncate">Samantha Vance</h4>
                    <p class="text-xs text-emerald-400 truncate">Arena Commissioner</p>
                </div>
                <button class="text-slate-400 hover:text-white p-2">
                    <i class="fa-solid fa-gear"></i>
                </button>
            </div>
        </aside>

        <!-- MAIN CONTENT AREA -->
        <main class="flex-1 flex flex-col min-w-0 overflow-y-auto h-[calc(100vh-2.5rem)]">
            
            <!-- TOP NAVBAR -->
            <header class="bg-turf-card/60 backdrop-blur-md border-b border-turf-border sticky top-0 z-20 px-6 py-4 flex items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <button id="sidebarToggle" class="lg:hidden text-slate-300 hover:text-white text-xl">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <div>
                        <h2 id="pageTitle" class="text-xl font-bold font-display tracking-wider text-white">COMMAND DASHBOARD</h2>
                        <p id="pageSubtitle" class="text-xs text-slate-400">Overview of active fixtures, arena schedules & top athlete metrics.</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <div class="relative hidden sm:block">
                        <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                        <input type="text" placeholder="Search matches, players, turfs..." class="bg-slate-900/80 border border-turf-border rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-64 transition">
                    </div>
                    <button onclick="openModal('quickBookingModal')" class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                        <i class="fa-solid fa-bolt"></i> Book Turf
                    </button>
                </div>
            </header>

            <!-- DYNAMIC TAB PANELS CONTAINER -->
            <div class="flex-1 p-6 max-w-7xl w-full mx-auto space-y-8">

                <!-- ================= TAB 1: DASHBOARD ================= -->
                <section id="tab-dashboard" class="tab-content space-y-6">
                    <!-- Metric Cards Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div class="bg-turf-card border border-turf-border rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/50 transition">
                            <div class="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition"></div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Live Matches</span>
                                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                    <i class="fa-solid fa-satellite-dish"></i>
                                </div>
                            </div>
                            <h3 class="text-3xl font-extrabold font-display tracking-wide text-white">3 <span class="text-xs text-emerald-400 font-sans font-medium">Active Now</span></h3>
                            <p class="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></i> Arena A, B & C fully occupied
                            </p>
                        </div>

                        <div class="bg-turf-card border border-turf-border rounded-2xl p-5 relative overflow-hidden group hover:border-teal-500/50 transition">
                            <div class="absolute right-0 top-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition"></div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Turf Utilization</span>
                                <div class="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                                    <i class="fa-solid fa-chart-pie"></i>
                                </div>
                            </div>
                            <h3 class="text-3xl font-extrabold font-display tracking-wide text-white">88.4%</h3>
                            <p class="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
                                <i class="fa-solid fa-arrow-trend-up"></i> +4.2% from last week
                            </p>
                        </div>

                        <div class="bg-turf-card border border-turf-border rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/50 transition">
                            <div class="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition"></div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Teams</span>
                                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                    <i class="fa-solid fa-shield"></i>
                                </div>
                            </div>
                            <h3 class="text-3xl font-extrabold font-display tracking-wide text-white">42 <span class="text-xs text-slate-400 font-sans font-medium">Clubs</span></h3>
                            <p class="text-xs text-slate-400 mt-2">Over 520 active players</p>
                        </div>

                        <div class="bg-turf-card border border-turf-border rounded-2xl p-5 relative overflow-hidden group hover:border-yellow-500/50 transition">
                            <div class="absolute right-0 top-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition"></div>
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Revenue</span>
                                <div class="w-10 h-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
                                    <i class="fa-solid fa-wallet"></i>
                                </div>
                            </div>
                            <h3 class="text-3xl font-extrabold font-display tracking-wide text-white">$3,420</h3>
                            <p class="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
                                <i class="fa-solid fa-circle-check"></i> 18 Slots Booked Today
                            </p>
                        </div>
                    </div>

                    <!-- Live Featured Match Banner & Quick Status -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- Live Hero Banner -->
                        <div class="lg:col-span-2 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between">
                            <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-10"></div>
                            
                            <div class="relative z-10 flex items-center justify-between mb-8">
                                <div class="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                    CHAMPIONSHIP LEAGUE - SEMI FINAL
                                </div>
                                <span class="text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg">Arena Turf Alpha</span>
                            </div>

                            <div class="relative z-10 grid grid-cols-3 items-center text-center my-4">
                                <!-- Team 1 -->
                                <div class="flex flex-col items-center">
                                    <img src="https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=150" class="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg shadow-emerald-500/20 mb-3" alt="Vipers">
                                    <h4 class="font-bold text-lg text-white">FC Vipers</h4>
                                    <p class="text-xs text-slate-400">Home</p>
                                </div>
                                <!-- Scoreboard -->
                                <div class="flex flex-col items-center">
                                    <div class="flex items-center gap-3 text-4xl md:text-5xl font-black font-display tracking-widest text-white bg-slate-950/60 px-6 py-2 rounded-2xl border border-turf-border shadow-inner">
                                        <span class="text-emerald-400">3</span>
                                        <span class="text-slate-600 font-sans text-2xl">:</span>
                                        <span class="text-teal-400">2</span>
                                    </div>
                                    <span class="text-xs text-yellow-400 font-bold mt-2 bg-yellow-500/10 px-2.5 py-0.5 rounded animate-pulse">78' 2nd Half</span>
                                </div>
                                <!-- Team 2 -->
                                <div class="flex flex-col items-center">
                                    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=150" class="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-lg shadow-teal-500/20 mb-3" alt="Titans">
                                    <h4 class="font-bold text-lg text-white">Titan United</h4>
                                    <p class="text-xs text-slate-400">Away</p>
                                </div>
                            </div>

                            <div class="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/80 text-xs text-slate-400">
                                <span>Referee: Marcus Aurelius</span>
                                <button onclick="switchTab('fixtures')" class="text-emerald-400 font-semibold hover:underline flex items-center gap-1">View Live Match Center &rarr;</button>
                            </div>
                        </div>

                        <!-- Quick Turf Status Widget -->
                        <div class="bg-turf-card border border-turf-border rounded-3xl p-6 flex flex-col justify-between">
                            <div>
                                <h3 class="font-bold text-base text-white mb-1 flex items-center justify-between">
                                    Arena Availability
                                    <i class="fa-solid fa-circle-nodes text-emerald-400 text-sm"></i>
                                </h3>
                                <p class="text-xs text-slate-400 mb-4">Real-time turf slot status for today.</p>

                                <div class="space-y-3">
                                    <div class="p-3 bg-slate-900/60 rounded-xl border border-turf-border flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">A</div>
                                            <div>
                                                <h5 class="text-sm font-semibold text-white">Turf Alpha (Pro 7v7)</h5>
                                                <p class="text-[11px] text-emerald-400">Occupied till 19:00</p>
                                            </div>
                                        </div>
                                        <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                                    </div>

                                    <div class="p-3 bg-slate-900/60 rounded-xl border border-turf-border flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">B</div>
                                            <div>
                                                <h5 class="text-sm font-semibold text-white">Turf Beta (FIFA 5v5)</h5>
                                                <p class="text-[11px] text-yellow-400">Next Slot: 18:30</p>
                                            </div>
                                        </div>
                                        <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
                                    </div>

                                    <div class="p-3 bg-slate-900/60 rounded-xl border border-turf-border flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">C</div>
                                            <div>
                                                <h5 class="text-sm font-semibold text-white">Turf Gamma (Cricket Box)</h5>
                                                <p class="text-[11px] text-emerald-400">Available Now</p>
                                            </div>
                                        </div>
                                        <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    </div>
                                </div>
                            </div>

                            <button onclick="switchTab('turf')" class="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl text-xs transition border border-turf-border">
                                Open Full Schedule Planner
                            </button>
                        </div>
                    </div>

                    <!-- Recent Activity & Top Scorer Mini-Table -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Upcoming Fixtures Preview -->
                        <div class="bg-turf-card border border-turf-border rounded-3xl p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-base text-white">Upcoming Match Fixtures</h3>
                                <button onclick="switchTab('fixtures')" class="text-xs text-emerald-400 font-semibold hover:underline">View All</button>
                            </div>
                            <div class="space-y-3">
                                <div class="p-4 bg-slate-900/40 rounded-2xl border border-turf-border flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <div class="text-center bg-slate-800 px-3 py-2 rounded-xl">
                                            <span class="block text-xs text-emerald-400 font-bold">TODAY</span>
                                            <span class="block text-sm font-black text-white">19:30</span>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-sm text-white">Red Bull FC vs Phoenix Strikers</h4>
                                            <p class="text-xs text-slate-400">Arena Beta &bull; Premier League</p>
                                        </div>
                                    </div>
                                    <button onclick="openModal('quickBookingModal')" class="bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition">Book Box</button>
                                </div>

                                <div class="p-4 bg-slate-900/40 rounded-2xl border border-turf-border flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <div class="text-center bg-slate-800 px-3 py-2 rounded-xl">
                                            <span class="block text-xs text-slate-400 font-bold">TOMORROW</span>
                                            <span class="block text-sm font-black text-white">18:00</span>
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-sm text-white">Cyber Ninjas vs Galaxy Rovers</h4>
                                            <p class="text-xs text-slate-400">Arena Alpha &bull; Super Cup</p>
                                        </div>
                                    </div>
                                    <button onclick="openModal('quickBookingModal')" class="bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition">Book Box</button>
                                </div>
                            </div>
                        </div>

                        <!-- Top Goalscorers Leaderboard Mini -->
                        <div class="bg-turf-card border border-turf-border rounded-3xl p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-bold text-base text-white">Golden Boot Standings</h3>
                                <button onclick="switchTab('stats')" class="text-xs text-emerald-400 font-semibold hover:underline">Full Stats</button>
                            </div>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-turf-border">
                                    <div class="flex items-center gap-3">
                                        <span class="w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-xs flex items-center justify-center">1</span>
                                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" class="w-9 h-9 rounded-full object-cover" alt="Player">
                                        <div>
                                            <h5 class="text-sm font-bold text-white">Alexandre Silva</h5>
                                            <p class="text-[11px] text-slate-400">FC Vipers</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-sm font-black text-emerald-400 font-display text-lg">14 Goals</span>
                                        <span class="block text-[10px] text-slate-500">8 Matches</span>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between p-3 bg-slate-900/40 rounded-xl border border-turf-border">
                                    <div class="flex items-center gap-3">
                                        <span class="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">2</span>
                                        <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100" class="w-9 h-9 rounded-full object-cover" alt="Player">
                                        <div>
                                            <h5 class="text-sm font-bold text-white">Marcus Rashford Jr.</h5>
                                            <p class="text-[11px] text-slate-400">Titan United</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <span class="text-sm font-black text-teal-400 font-display text-lg">11 Goals</span>
                                        <span class="block text-[10px] text-slate-500">7 Matches</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <!-- ================= TAB 2: LIVE FIXTURES ================= -->
                <section id="tab-fixtures" class="tab-content hidden space-y-6">
                    <!-- Filters & Category Tabs -->
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-turf-card p-4 rounded-2xl border border-turf-border">
                        <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                            <button class="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs transition">All Fixtures</button>
                            <button class="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-medium text-xs transition border border-turf-border">Live Now (3)</button>
                            <button class="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-medium text-xs transition border border-turf-border">Upcoming</button>
                            <button class="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-medium text-xs transition border border-turf-border">Completed</button>
                        </div>
                        <div class="flex items-center gap-3">
                            <select class="bg-slate-900 border border-turf-border rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500">
                                <option>Filter by League: All Tournaments</option>
                                <option>Premier League 7v7</option>
                                <option>Super Cup Championship</option>
                                <option>Weekend Warriors</option>
                            </select>
                        </div>
                    </div>

                    <!-- Fixtures Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="fixturesGrid">
                        <!-- Fixture Card 1 -->
                        <div class="bg-turf-card border border-emerald-500/40 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-emerald-500/5">
                            <div class="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-widest animate-pulse">LIVE</div>
                            <div>
                                <span class="