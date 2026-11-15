/**
 * APEX VELOCITY: ARCADE RACING LEAGUE
 * app.js - Complete Game Engine, Physics, Web Audio Synthesizer, and DOM Controller
 * Architect: Nami (Group 1 - Architect)
 * Builder: Zoro (Group 1 - Builder)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. DATA CATALOGS & PRELOADED SEED DATA
    // ==========================================
    const CAR_CATALOG = [
        {
            id: "apex-gtr",
            name: "Apex GT-R 'Ghostline'",
            tier: "S-CLASS",
            category: "Balanced Track Specialist",
            baseColor: "#E6ECEF",
            secondaryColor: "#FF2A54",
            underglowColor: "#00F0FF",
            specs: {
                topSpeedKmh: 318,
                accelRate: 8.8,
                handlingGrip: 8.5,
                driftFactor: 7.2,
                nitroCapacity: 100,
                nitroDrainRate: 22
            },
            audioProfile: { basePitch: 68, harmonicRatio: 2.0, revLimit: 8500 },
            description: "Twin-turbocharged all-wheel attack weapon engineered for surgical corner precision and blistering straightaways."
        },
        {
            id: "rotary-shinobi",
            name: "Shinobi RX-7 'Midnight'",
            tier: "A-CLASS",
            category: "Drift Master",
            baseColor: "#111215",
            secondaryColor: "#9D00FF",
            underglowColor: "#9D00FF",
            specs: {
                topSpeedKmh: 295,
                accelRate: 8.2,
                handlingGrip: 7.0,
                driftFactor: 9.8,
                nitroCapacity: 110,
                nitroDrainRate: 20
            },
            audioProfile: { basePitch: 84, harmonicRatio: 3.0, revLimit: 9600 },
            description: "High-revving quad-rotor legend designed for smoking sideways drifts with ultra-controllable counter-steering."
        },
        {
            id: "veloce-corsa",
            name: "Scuderia Veloce F40",
            tier: "S-CLASS",
            category: "Hyper Velocity Brawler",
            baseColor: "#E00025",
            secondaryColor: "#FFDD00",
            underglowColor: "#FF2A54",
            specs: {
                topSpeedKmh: 342,
                accelRate: 9.4,
                handlingGrip: 7.8,
                driftFactor: 6.5,
                nitroCapacity: 95,
                nitroDrainRate: 25
            },
            audioProfile: { basePitch: 60, harmonicRatio: 2.2, revLimit: 8800 },
            description: "Mid-engine Italian titanium monster boasting uncompromised top velocity and explosive straight-line acceleration."
        },
        {
            id: "cyber-hyperion",
            name: "Hyperion Volt EV-X",
            tier: "S-CLASS",
            category: "Instant Torque Prototype",
            baseColor: "#051622",
            secondaryColor: "#00F0FF",
            underglowColor: "#00F0FF",
            specs: {
                topSpeedKmh: 325,
                accelRate: 9.9,
                handlingGrip: 9.1,
                driftFactor: 6.0,
                nitroCapacity: 130,
                nitroDrainRate: 30
            },
            audioProfile: { basePitch: 120, harmonicRatio: 1.5, revLimit: 12000, isElectric: true },
            description: "Quad-motor electric titan delivering immediate instantaneous G-forces with computerized active aerodynamics."
        },
        {
            id: "muscle-brawler",
            name: "Thunder V8 'Havoc 69'",
            tier: "B-CLASS",
            category: "Raw American Muscle",
            baseColor: "#1E272C",
            secondaryColor: "#FF6200",
            underglowColor: "#FF6200",
            specs: {
                topSpeedKmh: 305,
                accelRate: 9.0,
                handlingGrip: 6.4,
                driftFactor: 8.9,
                nitroCapacity: 120,
                nitroDrainRate: 28
            },
            audioProfile: { basePitch: 46, harmonicRatio: 1.8, revLimit: 6800 },
            description: "Supercharged 8.4-liter roaring behemoth with massive wheelspin, wide drift angles, and earth-shattering torque."
        },
        {
            id: "phantom-valkyrie",
            name: "Phantom Valkyrie LM",
            tier: "HYPER",
            category: "Le Mans Prototype",
            baseColor: "#003B46",
            secondaryColor: "#00F296",
            underglowColor: "#00F296",
            specs: {
                topSpeedKmh: 355,
                accelRate: 9.7,
                handlingGrip: 9.6,
                driftFactor: 6.8,
                nitroCapacity: 105,
                nitroDrainRate: 24
            },
            audioProfile: { basePitch: 72, harmonicRatio: 2.4, revLimit: 10500 },
            description: "Pure carbon monocoque endurance prototype engineered for extreme downforce and hairpin turn dominance."
        }
    ];

    const TRACK_CATALOG = [
        {
            id: "tokyo-expressway",
            name: "Tokyo Night Expressway",
            location: "Tokyo, Japan",
            theme: "neon-night",
            difficulty: "Medium",
            laps: 3,
            lengthMeters: 4200,
            skyGradient: ["#050510", "#101028", "#1F1538"],
            roadColor: "#1A1C23",
            rumbleColors: ["#FF2A54", "#FFFFFF"],
            ambientLighting: "#8030FF",
            features: "Neon skyscrapers, overhead LED gantries, high-speed overpass sweepers",
            curveDifficulty: 6,
            elevationVariance: 4
        },
        {
            id: "redrock-canyon",
            name: "Red Rock Canyon Pass",
            location: "Nevada, USA",
            theme: "sunset-canyon",
            difficulty: "Hard",
            laps: 3,
            lengthMeters: 5100,
            skyGradient: ["#2B0C06", "#73240F", "#DE6B23"],
            roadColor: "#251F1E",
            rumbleColors: ["#FFD700", "#FFFFFF"],
            ambientLighting: "#FF6A00",
            features: "Steep elevation changes, double-apex canyon hairpin bends, rocky dust",
            curveDifficulty: 9,
            elevationVariance: 9
        },
        {
            id: "alpine-ridge",
            name: "Glacier Alpine Ridge",
            location: "Swiss Alps",
            theme: "snow-daylight",
            difficulty: "Expert",
            laps: 3,
            lengthMeters: 4800,
            skyGradient: ["#0C2340", "#28537C", "#8CA6C1"],
            roadColor: "#22262B",
            rumbleColors: ["#00F0FF", "#EBF5FF"],
            ambientLighting: "#60A5FA",
            features: "Snowy roadside banks, icy low-grip sections, sheer drop cliffs",
            curveDifficulty: 8,
            elevationVariance: 7
        },
        {
            id: "cyber-grid-2099",
            name: "Neo Sector 2099",
            location: "Orbital Habitat Neo-01",
            theme: "cyber-grid",
            difficulty: "Insane",
            laps: 3,
            lengthMeters: 5500,
            skyGradient: ["#000000", "#030A14", "#0C1E3A"],
            roadColor: "#080F18",
            rumbleColors: ["#00F0FF", "#FF007F"],
            ambientLighting: "#00F0FF",
            features: "Holographic barriers, magnetic speed-booster strips, zero-gravity dip",
            curveDifficulty: 10,
            elevationVariance: 10
        }
    ];

    const DEFAULT_LEADERBOARD = [
        { rank: 1, driver: "Hiroshi 'Kansei' Sato", carId: "rotary-shinobi", trackId: "tokyo-expressway", bestLap: "1:08.412", driftScore: 48200, date: "2025-02-14" },
        { rank: 2, driver: "Elena 'Viper' Vance", carId: "veloce-corsa", trackId: "tokyo-expressway", bestLap: "1:09.104", driftScore: 32400, date: "2025-02-13" },
        { rank: 3, driver: "Marcus 'Nitro' Cole", carId: "apex-gtr", trackId: "tokyo-expressway", bestLap: "1:09.890", driftScore: 41100, date: "2025-02-12" },
        { rank: 4, driver: "Kaelen Voss (AI)", carId: "cyber-hyperion", trackId: "tokyo-expressway", bestLap: "1:10.550", driftScore: 28900, date: "2025-02-11" },
        { rank: 5, driver: "Jax 'Iron' Cooper", carId: "muscle-brawler", trackId: "redrock-canyon", bestLap: "1:18.230", driftScore: 56300, date: "2025-02-14" },
        { rank: 6, driver: "Silvia Chevalier", carId: "phantom-valkyrie", trackId: "redrock-canyon", bestLap: "1:19.410", driftScore: 34100, date: "2025-02-10" },
        { rank: 7, driver: "Ralf 'Frost' Weber", carId: "apex-gtr", trackId: "alpine-ridge", bestLap: "1:22.180", driftScore: 39800, date: "2025-02-14" },
        { rank: 8, driver: "Nyx-09 Cybermind", carId: "cyber-hyperion", trackId: "cyber-grid-2099", bestLap: "1:14.390", driftScore: 62000, date: "2025-02-14" }
    ];

    // ==========================================
    // 2. GAME ENGINE STATE
    // ==========================================
    const state = {
        mode: 'MENU', // MENU | COUNTDOWN | RACING | PAUSED | FINISHED
        selectedCarIndex: 0,
        selectedTrackIndex: 0,
        cameraMode: 'CHASE', // CHASE | HOOD | TOP_DOWN
        cameraSettings: {
            fov: 100,
            height: 1200,
            distance: 2000,
            shake: 0
        },
        player: {
            x: 0,
            y: 0,
            z: 0,
            speed: 0,
            speedKmh: 0,
            rpm: 1000,
            gear: 1,
            driftAngle: 0,
            isDrifting: false,
            driftPoints: 0,
            driftMultiplier: 1.0,
            nitroFuel: 100,
            isBoosting: false,
            isDrafting: false,
            currentLap: 1,
            lapStartTime: 0,
            bestLapTime: null,
            totalRaceTime: 0,
            rank: 1,
            offRoadPenalty: 1.0
        },
        rivals: [],
        audio: {
            initialized: false,
            isMuted: false,
            masterVolume: 0.8,
            engineVolume: 0.9,
            sfxVolume: 0.85
        },
        settings: {
            unitSystem: 'KMH',
            graphicsQuality: 'ULTRA'
        },
        controls: {
            left: false,
            right: false,
            accelerate: false,
            brake: false,
            nitro: false,
            handbrake: false
        },
        roadSegments: [],
        trackLength: 160000, // in world units
        segmentLength: 200,
        countdownTimer: 3
    };

    // Load saved leaderboard from localStorage or default
    let leaderboardData = JSON.parse(localStorage.getItem('apex_leaderboard')) || DEFAULT_LEADERBOARD;

    // ==========================================
    // 3. WEB AUDIO PROCEDURAL SOUND SYNTHESIZER
    // ==========================================
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.masterGain = null;
            this.engineGain = null;
            this.sfxGain = null;
            this.engineOsc1 = null;
            this.engineOsc2 = null;
            this.filterNode = null;
        }

        init() {
            if (this.ctx) return;
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();

                this.masterGain = this.ctx.createGain();
                this.engineGain = this.ctx.createGain();
                this.sfxGain = this.ctx.createGain();

                this.masterGain.gain.value = state.audio.masterVolume;
                this.engineGain.gain.value = state.audio.engineVolume;
                this.sfxGain.gain.value = state.audio.sfxVolume;

                this.engineGain.connect(this.masterGain);
                this.sfxGain.connect(this.masterGain);
                this.masterGain.connect(this.ctx.destination);

                // Engine oscillators
                this.engineOsc1 = this.ctx.createOscillator();
                this.engineOsc1.type = 'sawtooth';
                this.engineOsc1.frequency.value = 80;

                this.engineOsc2 = this.ctx.createOscillator();
                this.engineOsc2.type = 'triangle';
                this.engineOsc2.frequency.value = 40;

                this.filterNode = this.ctx.createBiquadFilter();
                this.filterNode.type = 'lowpass';
                this.filterNode.frequency.value = 800;

                this.engineOsc1.connect(this.filterNode);
                this.engineOsc2.connect(this.filterNode);
                this.filterNode.connect(this.engineGain);

                this.engineOsc1.start();
                this.engineOsc2.start();

                state.audio.initialized = true;
            } catch (e) {
                console.warn('Web Audio Context initialization error:', e);
            }
        }

        updateEngine(rpm, throttle) {
            if (!this.ctx || state.audio.isMuted || !state.audio.initialized) return;
            const car = CAR_CATALOG[state.selectedCarIndex];
            const baseFreq = car.audioProfile.basePitch;
            const freq = baseFreq + (rpm / car.audioProfile.revLimit) * 350;

            try {
                this.engineOsc1.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
                this.engineOsc2.frequency.setTargetAtTime(freq * 0.5, this.ctx.currentTime, 0.05);
                this.filterNode.frequency.setTargetAtTime(300 + throttle * 1800, this.ctx.currentTime, 0.05);
            } catch (e) {}
        }

        playBeep(freq = 440, duration = 0.15) {
            if (!this.ctx || state.audio.isMuted || !state.audio.initialized) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.sfxGain);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {}
        }

        playCrash() {
            if (!this.ctx || state.audio.isMuted || !state.audio.initialized) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(120, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
                osc.connect(gain);
                gain.connect(this.sfxGain);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.3);
            } catch (e) {}
        }

        setMute(mute) {
            if (!this.masterGain) return;
            this.masterGain.gain.value = mute ? 0 : state.audio.masterVolume;
        }

        setVolumes() {
            if (!this.masterGain) return;
            this.masterGain.gain.value = state.audio.isMuted ? 0 : state.audio.masterVolume;
            if (this.engineGain) this.engineGain.gain.value = state.audio.engineVolume;
            if (this.sfxGain) this.sfxGain.gain.value = state.audio.sfxVolume;
        }
    }

    const soundEngine = new SoundEngine();

    // ==========================================
    // 4. ROAD GENERATION & 2.5D MATH
    // ==========================================
    function buildTrackGeometry(trackConfig) {
        state.roadSegments = [];
        const totalSegments = 800;
        const segmentLen = 200;
        state.trackLength = totalSegments * segmentLen;

        let curCurve = 0;
        let curHill = 0;
        let elevation = 0;

        for (let i = 0; i < totalSegments; i++) {
            // Generate curves and hills based on track difficulty
            if (i > 50 && i < 150) curCurve = trackConfig.curveDifficulty * 0.3;
            else if (i >= 150 && i < 250) curCurve = -trackConfig.curveDifficulty * 0.4;
            else if (i >= 300 && i < 450) curCurve = trackConfig.curveDifficulty * 0.5;
            else if (i >= 500 && i < 650) curCurve = -trackConfig.curveDifficulty * 0.3;
            else curCurve = 0;

            if (i > 100 && i < 220) elevation = Math.sin(i * 0.05) * trackConfig.elevationVariance * 300;
            else if (i > 400 && i < 600) elevation = Math.cos(i * 0.04) * trackConfig.elevationVariance * 400;
            else elevation = 0;

            const colorIndex = Math.floor(i / 3) % 2;
            const rCol = colorIndex === 0 ? trackConfig.rumbleColors[0] : trackConfig.rumbleColors[1];
            const roadCol = trackConfig.roadColor;

            state.roadSegments.push({
                index: i,
                p1: { world: { x: 0, y: elevation, z: i * segmentLen }, screen: {} },
                p2: { world: { x: 0, y: elevation, z: (i + 1) * segmentLen }, screen: {} },
                curve: curCurve,
                elevation: elevation,
                color: {
                    road: roadCol,
                    grass: colorIndex === 0 ? "#111822" : "#0A0D14",
                    rumble: rCol,
                    lane: i % 6 === 0 ? "#FFFFFF" : "transparent"
                },
                sprites: []
            });
        }
    }

    // Initialize Rivals
    function initRivals() {
        state.rivals = [
            { id: "r1", name: "Hiroshi 'Kansei'", carId: "rotary-shinobi", x: -0.4, z: 1200, speed: 280, color: "#9D00FF", laneOffset: -0.4, targetSpeed: 290, passedByPlayer: false },
            { id: "r2", name: "Elena 'Viper'", carId: "veloce-corsa", x: 0.5, z: 2400, speed: 310, color: "#FFDD00", laneOffset: 0.5, targetSpeed: 315, passedByPlayer: false },
            { id: "r3", name: "Marcus 'Nitro'", carId: "apex-gtr", x: -0.2, z: 3600, speed: 300, color: "#FF2A54", laneOffset: -0.2, targetSpeed: 305, passedByPlayer: false },
            { id: "r4", name: "Kaelen Voss", carId: "cyber-hyperion", x: 0.3, z: 5000, speed: 315, color: "#00F0FF", laneOffset: 0.3, targetSpeed: 320, passedByPlayer: false },
            { id: "r5", name: "Jax 'Iron'", carId: "muscle-brawler", x: -0.6, z: 6800, speed: 290, color: "#FF6200", laneOffset: -0.6, targetSpeed: 295, passedByPlayer: false }
        ];
    }

    // Initialize default track geometry on startup so roadSegments is never empty when rendering
    buildTrackGeometry(TRACK_CATALOG[0]);

    // ==========================================
    // 5. DOM & UI BINDINGS & CONTROLLER
    // ==========================================
    const canvas = document.getElementById('canvas-game');
    const ctx = canvas.getContext('2d');
    const minimapCanvas = document.getElementById('canvas-minimap');
    const minimapCtx = minimapCanvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Populate Garage Car Info
    function updateGarageUI() {
        const car = CAR_CATALOG[state.selectedCarIndex];
        document.getElementById('garage-car-name').textContent = car.name;
        document.getElementById('garage-car-category').textContent = `${car.category} • ${car.tier}`;
        document.getElementById('garage-car-desc').textContent = car.description;
        document.getElementById('nav-car-name-val').textContent = car.name;

        // Stat bars (0 - 100%)
        document.getElementById('stat-bar-speed').style.width = `${(car.specs.topSpeedKmh / 360) * 100}%`;
        document.getElementById('stat-bar-accel').style.width = `${(car.specs.accelRate / 10) * 100}%`;
        document.getElementById('stat-bar-handling').style.width = `${(car.specs.handlingGrip / 10) * 100}%`;
        document.getElementById('stat-bar-drift').style.width = `${(car.specs.driftFactor / 10) * 100}%`;

        document.getElementById('color-picker-primary').value = car.baseColor;
        document.getElementById('color-picker-accent').value = car.secondaryColor;
        document.getElementById('color-picker-neon').value = car.underglowColor;
    }

    // Populate Track Modal Cards
    function renderTrackCards() {
        const grid = document.getElementById('track-cards-grid');
        grid.innerHTML = '';
        TRACK_CATALOG.forEach((track, idx) => {
            const card = document.createElement('div');
            card.className = 'track-card';
            card.innerHTML = `
                <div class="track-card-header">
                    <h3>${track.name}</h3>
                    <span class="track-location">📍 ${track.location}</span>
                </div>
                <div class="track-card-body">
                    <div class="track-meta">
                        <span>Difficulty: ${track.difficulty}</span>
                        <span>Laps: ${track.laps}</span>
                    </div>
                    <div>Length: ${track.lengthMeters}m</div>
                    <div style="font-size:11px; color:var(--text-muted);">${track.features}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                state.selectedTrackIndex = idx;
                showToast(`Loaded Circuit: ${track.name}`);
                document.getElementById('track-modal').classList.add('hidden');
                startCountdown();
            });
            grid.appendChild(card);
        });
    }

    // Populate Leaderboard Table
    function renderLeaderboardTable(filterTrackId = 'all') {
        const tbody = document.getElementById('leaderboard-table-body');
        tbody.innerHTML = '';
        
        let filtered = leaderboardData;
        if (filterTrackId !== 'all') {
            filtered = leaderboardData.filter(item => item.trackId === filterTrackId);
        }

        filtered.forEach(item => {
            const car = CAR_CATALOG.find(c => c.id === item.carId) || CAR_CATALOG[0];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${item.rank}</strong></td>
                <td>${item.driver}</td>
                <td><span style="color:var(--accent-cyan);">${car.name}</span></td>
                <td>${item.trackId}</td>
                <td class="mono">${item.bestLap}</td>
                <td class="highlight-gold">${item.driftScore.toLocaleString()} PTS</td>
                <td style="color:var(--text-muted); font-size:11px;">${item.date}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Toast Notification helper
    function showToast(message) {
        const toast = document.getElementById('toast-notification');
        const msg = document.getElementById('toast-message');
        msg.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // ==========================================
    // 6. EVENT HANDLERS & REGISTRATIONS
    // ==========================================
    document.getElementById('btn-quick-race').addEventListener('click', () => {
        soundEngine.init();
        startCountdown();
    });

    document.getElementById('btn-open-garage').addEventListener('click', () => {
        document.getElementById('garage-drawer').classList.add('open');
        updateGarageUI();
    });

    document.getElementById('btn-garage-close').addEventListener('click', () => {
        document.getElementById('garage-drawer').classList.remove('open');
    });

    document.getElementById('garage-car-prev').addEventListener('click', () => {
        state.selectedCarIndex = (state.selectedCarIndex - 1 + CAR_CATALOG.length) % CAR_CATALOG.length;
        updateGarageUI();
    });

    document.getElementById('garage-car-next').addEventListener('click', () => {
        state.selectedCarIndex = (state.selectedCarIndex + 1) % CAR_CATALOG.length;
        updateGarageUI();
    });

    document.getElementById('btn-open-tracks').addEventListener('click', () => {
        renderTrackCards();
        document.getElementById('track-modal').classList.remove('hidden');
    });
    document.getElementById('btn-track-close').addEventListener('click', () => {
        document.getElementById('track-modal').classList.add('hidden');
    });

    document.getElementById('btn-open-leaderboard').addEventListener('click', () => {
        renderLeaderboardTable();
        document.getElementById('leaderboard-modal').classList.remove('hidden');
    });
    document.getElementById('btn-leaderboard-close').addEventListener('click', () => {
        document.getElementById('leaderboard-modal').classList.add('hidden');
    });
    document.getElementById('leaderboard-filter-track').addEventListener('change', (e) => {
        renderLeaderboardTable(e.target.value);
    });
    document.getElementById('btn-leaderboard-reset').addEventListener('click', () => {
        leaderboardData = DEFAULT_LEADERBOARD;
        localStorage.setItem('apex_leaderboard', JSON.stringify(leaderboardData));
        renderLeaderboardTable();
        showToast('Leaderboard reset to factory defaults.');
    });

    document.getElementById('btn-open-settings').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.remove('hidden');
    });
    document.getElementById('btn-settings-close').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('hidden');
    });

    document.getElementById('slider-vol-master').addEventListener('input', (e) => {
        state.audio.masterVolume = e.target.value / 100;
        document.getElementById('val-vol-master').textContent = e.target.value;
        soundEngine.setVolumes();
    });
    document.getElementById('slider-vol-engine').addEventListener('input', (e) => {
        state.audio.engineVolume = e.target.value / 100;
        document.getElementById('val-vol-engine').textContent = e.target.value;
        soundEngine.setVolumes();
    });
    document.getElementById('slider-vol-sfx').addEventListener('input', (e) => {
        state.audio.sfxVolume = e.target.value / 100;
        document.getElementById('val-vol-sfx').textContent = e.target.value;
        soundEngine.setVolumes();
    });
    document.getElementById('toggle-audio-mute').addEventListener('change', (e) => {
        state.audio.isMuted = e.target.checked;
        soundEngine.setMute(state.audio.isMuted);
    });

    document.getElementById('btn-open-help').addEventListener('click', () => {
        document.getElementById('help-modal').classList.remove('hidden');
    });
    document.getElementById('btn-help-close').addEventListener('click', () => {
        document.getElementById('help-modal').classList.add('hidden');
    });

    // In-Race HUD Buttons
    document.getElementById('btn-hud-camera').addEventListener('click', () => {
        const views = ['CHASE', 'HOOD', 'TOP_DOWN'];
        const idx = views.indexOf(state.cameraMode);
        state.cameraMode = views[(idx + 1) % views.length];
        showToast(`Camera View: ${state.cameraMode}`);
    });

    document.getElementById('btn-hud-mute').addEventListener('click', () => {
        state.audio.isMuted = !state.audio.isMuted;
        soundEngine.setMute(state.audio.isMuted);
        showToast(state.audio.isMuted ? 'Audio Muted' : 'Audio Unmuted');
    });

    document.getElementById('btn-hud-pause').addEventListener('click', () => {
        pauseRace();
    });

    document.getElementById('btn-pause-resume').addEventListener('click', () => {
        resumeRace();
    });
    document.getElementById('btn-pause-restart').addEventListener('click', () => {
        document.getElementById('pause-overlay').classList.add('hidden');
        startCountdown();
    });
    document.getElementById('btn-pause-garage').addEventListener('click', () => {
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('garage-drawer').classList.add('open');
        updateGarageUI();
    });
    document.getElementById('btn-pause-quit').addEventListener('click', () => {
        document.getElementById('pause-overlay').classList.add('hidden');
        returnToMenu();
    });

    // Finish Modal
    document.getElementById('btn-finish-restart').addEventListener('click', () => {
        document.getElementById('race-finish-modal').classList.add('hidden');
        startCountdown();
    });
    document.getElementById('btn-finish-next').addEventListener('click', () => {
        state.selectedTrackIndex = (state.selectedTrackIndex + 1) % TRACK_CATALOG.length;
        document.getElementById('race-finish-modal').classList.add('hidden');
        startCountdown();
    });
    document.getElementById('btn-finish-hub').addEventListener('click', () => {
        document.getElementById('race-finish-modal').classList.add('hidden');
        returnToMenu();
    });

    // Livery color change
    document.getElementById('color-picker-primary').addEventListener('input', (e) => {
        CAR_CATALOG[state.selectedCarIndex].baseColor = e.target.value;
    });
    document.getElementById('color-picker-accent').addEventListener('input', (e) => {
        CAR_CATALOG[state.selectedCarIndex].secondaryColor = e.target.value;
    });
    document.getElementById('color-picker-neon').addEventListener('input', (e) => {
        CAR_CATALOG[state.selectedCarIndex].underglowColor = e.target.value;
    });

    // Keyboard bindings
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') state.controls.accelerate = true;
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') state.controls.brake = true;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') state.controls.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.controls.right = true;
        if (e.key === ' ') state.controls.handbrake = true;
        if (e.key === 'Shift' || e.key === 'n' || e.key === 'N') state.controls.nitro = true;
        if (e.key === 'c' || e.key === 'C') {
            document.getElementById('btn-hud-camera').click();
        }
        if (e.key === 'p' || e.key === 'P') {
            if (state.mode === 'RACING') pauseRace();
            else if (state.mode === 'PAUSED') resumeRace();
        }
        if (e.key === 'm' || e.key === 'M') {
            document.getElementById('btn-hud-mute').click();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') state.controls.accelerate = false;
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') state.controls.brake = false;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') state.controls.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') state.controls.right = false;
        if (e.key === ' ') state.controls.handbrake = false;
        if (e.key === 'Shift' || e.key === 'n' || e.key === 'N') state.controls.nitro = false;
    });

    // Touch button bindings for mobile
    const bindTouch = (id, controlKey) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('touchstart', (e) => { e.preventDefault(); state.controls[controlKey] = true; });
        el.addEventListener('touchend', (e) => { e.preventDefault(); state.controls[controlKey] = false; });
        el.addEventListener('mousedown', (e) => { e.preventDefault(); state.controls[controlKey] = true; });
        el.addEventListener('mouseup', (e) => { e.preventDefault(); state.controls[controlKey] = false; });
    };
    bindTouch('btn-touch-steer-left', 'left');
    bindTouch('btn-touch-steer-right', 'right');
    bindTouch('btn-touch-accelerate', 'accelerate');
    bindTouch('btn-touch-brake', 'brake');
    bindTouch('btn-touch-nitro', 'nitro');

    // ==========================================
    // 7. GAME STATE FLOW CONTROL
    // ==========================================
    function startCountdown() {
        state.mode = 'COUNTDOWN';
        document.getElementById('top-nav-bar').style.display = 'none';
        document.getElementById('hud-container').classList.remove('hidden');
        if ('ontouchstart' in window) {
            document.getElementById('touch-controls-bar').classList.remove('hidden');
        }

        const track = TRACK_CATALOG[state.selectedTrackIndex];
        buildTrackGeometry(track);
        initRivals();

        // Reset player state
        state.player.z = 0;
        state.player.x = 0;
        state.player.speed = 0;
        state.player.currentLap = 1;
        state.player.lapStartTime = performance.now();
        state.player.bestLapTime = null;
        state.player.totalRaceTime = 0;
        state.player.driftPoints = 0;
        state.player.nitroFuel = 100;

        state.countdownTimer = 3;
        showToast(`READY... 3`);
        soundEngine.playBeep(440);

        const countdownInterval = setInterval(() => {
            state.countdownTimer--;
            if (state.countdownTimer > 0) {
                showToast(`READY... ${state.countdownTimer}`);
                soundEngine.playBeep(440);
            } else if (state.countdownTimer === 0) {
                showToast(`⚡ GO! ⚡`);
                soundEngine.playBeep(880, 0.3);
            } else {
                clearInterval(countdownInterval);
                state.mode = 'RACING';
                state.player.lapStartTime = performance.now();
            }
        }, 1000);
    }

    function pauseRace() {
        if (state.mode !== 'RACING') return;
        state.mode = 'PAUSED';
        document.getElementById('pause-overlay').classList.remove('hidden');
    }

    function resumeRace() {
        if (state.mode !== 'PAUSED') return;
        document.getElementById('pause-overlay').classList.add('hidden');
        state.mode = 'RACING';
    }

    function returnToMenu() {
        state.mode = 'MENU';
        document.getElementById('top-nav-bar').style.display = 'flex';
        document.getElementById('hud-container').classList.add('hidden');
        document.getElementById('touch-controls-bar').classList.add('hidden');
    }

    function finishRace() {
        state.mode = 'FINISHED';
        document.getElementById('hud-container').classList.add('hidden');
        document.getElementById('touch-controls-bar').classList.add('hidden');

        const totalMin = Math.floor(state.player.totalRaceTime / 60000);
        const totalSec = ((state.player.totalRaceTime % 60000) / 1000).toFixed(3);
        const formattedTotal = `${totalMin < 10 ? '0' : ''}${totalMin}:${totalSec < 10 ? '0' : ''}${totalSec}`;

        document.getElementById('finish-total-time').textContent = formattedTotal;
        document.getElementById('finish-best-lap').textContent = state.player.bestLapTime ? formatTime(state.player.bestLapTime) : '01:08.412';
        document.getElementById('finish-drift-score').textContent = `${Math.round(state.player.driftPoints).toLocaleString()} PTS`;

        document.getElementById('race-finish-modal').classList.remove('hidden');
        soundEngine.playBeep(660, 0.4);
    }

    function formatTime(ms) {
        const min = Math.floor(ms / 60000);
        const sec = ((ms % 60000) / 1000).toFixed(3);
        return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // ==========================================
    // 8. GAME LOOP & PHYSICS ENGINE
    // ==========================================
    let lastTime = performance.now();

    function gameLoop(now) {
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        updatePhysics(dt);
        renderScene();

        requestAnimationFrame(gameLoop);
    }

    function updatePhysics(dt) {
        if (state.mode !== 'RACING') return;

        const car = CAR_CATALOG[state.selectedCarIndex];
        const track = TRACK_CATALOG[state.selectedTrackIndex];
        const p = state.player;

        // Acceleration & Braking
        let accelPower = car.specs.accelRate * 120;
        let topSpeed = car.specs.topSpeedKmh * 0.45; // game units conversion

        // Nitro Boost
        if (state.controls.nitro && p.nitroFuel > 0) {
            p.isBoosting = true;
            p.nitroFuel = Math.max(0, p.nitroFuel - car.specs.nitroDrainRate * dt);
            topSpeed *= 1.28;
            accelPower *= 1.5;
        } else {
            p.isBoosting = false;
            if (p.nitroFuel < 100) {
                p.nitroFuel = Math.min(100, p.nitroFuel + 5 * dt);
            }
        }

        // Slipstream drafting check against rivals
        p.isDrafting = false;
        state.rivals.forEach(r => {
            const distZ = Math.abs(r.z - p.z);
            const distX = Math.abs(r.x - p.x);
            if (distZ > 30 && distZ < 300 && distX < 0.5 && r.z > p.z) {
                p.isDrafting = true;
                topSpeed += 15;
            }
        });

        // Steering
        let steerRate = 2.2 * dt;
        if (state.controls.left) {
            p.x -= steerRate * (1 + p.speed / 200);
            p.driftAngle = -22;
        } else if (state.controls.right) {
            p.x += steerRate * (1 + p.speed / 200);
            p.driftAngle = 22;
        } else {
            p.driftAngle *= 0.85;
        }

        // Handbrake Drift mode
        if (state.controls.handbrake && p.speed > 80) {
            p.isDrifting = true;
            p.driftMultiplier = Math.min(4.0, p.driftMultiplier + 0.5 * dt);
            p.driftPoints += Math.round(p.speed * p.driftMultiplier * dt * 2);
            document.getElementById('hud-drift-banner').classList.remove('hidden');
            document.getElementById('hud-drift-points').textContent = Math.round(p.driftPoints).toLocaleString();
            document.getElementById('hud-drift-mult').textContent = `x${p.driftMultiplier.toFixed(1)}`;
        } else {
            p.isDrifting = false;
            p.driftMultiplier = 1.0;
            document.getElementById('hud-drift-banner').classList.add('hidden');
        }

        // Off-road grass penalty if car goes wide
        if (Math.abs(p.x) > 1.2) {
            p.offRoadPenalty = 0.55;
            topSpeed *= 0.6;
        } else {
            p.offRoadPenalty = 1.0;
        }

        // Throttle & Brake
        if (state.controls.accelerate) {
            p.speed = Math.min(topSpeed, p.speed + accelPower * dt);
        } else if (state.controls.brake) {
            p.speed = Math.max(0, p.speed - accelPower * 2 * dt);
        } else {
            p.speed = Math.max(0, p.speed - 30 * dt); // natural rolling friction
        }

        p.speed *= p.offRoadPenalty;
        p.z += p.speed * dt * 10;

        // Gear & RPM computation
        p.gear = Math.min(6, Math.max(1, Math.floor(p.speed / 50) + 1));
        p.rpm = 1000 + (p.speed % 50) * 160;
        soundEngine.updateEngine(p.rpm, state.controls.accelerate ? 1 : 0);

        // Lap checking & Segment looping
        if (p.z >= state.trackLength) {
            p.z -= state.trackLength;
            const lapTime = performance.now() - p.lapStartTime;
            if (!p.bestLapTime || lapTime < p.bestLapTime) {
                p.bestLapTime = lapTime;
                document.getElementById('hud-timer-best').textContent = formatTime(lapTime);
            }
            p.currentLap++;
            p.lapStartTime = performance.now();
            showToast(`Completed Lap ${p.currentLap - 1}!`);

            if (p.currentLap > track.laps) {
                finishRace();
                return;
            }
        }

        // Update Rival AI Competitors
        state.rivals.forEach((r, idx) => {
            r.speed = r.targetSpeed + Math.sin(now * 0.002 + idx) * 15;
            r.z += r.speed * dt * 10;
            if (r.z >= state.trackLength) r.z -= state.trackLength;
        });

        // Compute Race Position Rank
        let rank = 1;
        state.rivals.forEach(r => {
            if (r.z > p.z) rank++;
        });
        p.rank = rank;

        // Update HUD DOM Elements
        const displaySpeed = Math.round(p.speed * (state.settings.unitSystem === 'MPH' ? 0.621371 : 1));
        document.getElementById('hud-speedometer-val').textContent = displaySpeed;
        document.getElementById('hud-speedometer-unit').textContent = state.settings.unitSystem;
        document.getElementById('hud-gear-val').textContent = p.gear;
        document.getElementById('hud-nitro-fill').style.width = `${p.nitroFuel}%`;
        document.getElementById('hud-nitro-status').textContent = p.isBoosting ? 'BOOSTING' : (p.nitroFuel > 95 ? 'READY' : 'CHARGING');
        document.getElementById('hud-lap-counter').textContent = `${p.currentLap} / ${track.laps}`;
        
        const rankSuffix = ['st', 'nd', 'rd', 'th'][Math.min(3, p.rank - 1)];
        document.getElementById('hud-position-rank').textContent = `${p.rank}${rankSuffix}`;

        const elapsed = performance.now() - p.lapStartTime;
        document.getElementById('hud-timer-current').textContent = formatTime(elapsed);

        // Tachometer needle rotation (-135deg to +135deg)
        const tachAngle = -135 + (p.rpm / car.audioProfile.revLimit) * 270;
        document.getElementById('hud-tachometer-needle').style.transform = `rotate(${tachAngle}deg)`;

        // Slipstream banner
        const slipAlert = document.getElementById('hud-slipstream-alert');
        if (p.isDrafting) slipAlert.classList.remove('hidden');
        else slipAlert.classList.add('hidden');
    }

    // ==========================================
    // 9. 2.5D PROJECTIVE ROAD & SCENE RENDERER
    // ==========================================
    function renderScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const track = TRACK_CATALOG[state.selectedTrackIndex];
        const car = CAR_CATALOG[state.selectedCarIndex];
        const p = state.player;

        // Draw Sky Gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
        skyGrad.addColorStop(0, track.skyGradient[0]);
        skyGrad.addColorStop(0.5, track.skyGradient[1]);
        skyGrad.addColorStop(1, track.skyGradient[2]);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

        // Draw Horizon Grid & Mountains silhouette
        ctx.fillStyle = track.ambientLighting;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        for (let x = 0; x <= canvas.width; x += 80) {
            const h = Math.sin(x * 0.01 + p.z * 0.0001) * 30 + (canvas.height / 2 - 40);
            ctx.lineTo(x, h);
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.fill();

        // Project Road Segments
        let baseSegmentIndex = Math.floor(p.z / state.segmentLength) % state.roadSegments.length;
        let camDepth = 200;
        let maxDrawDistance = 300;

        let maxY = canvas.height;

        for (let n = 0; n < maxDrawDistance; n++) {
            let segIndex = (baseSegmentIndex + n) % state.roadSegments.length;
            let segment = state.roadSegments[segIndex];
            if (!segment || !segment.p1) continue;

            // Pseudo 3D projection math
            let cameraZ = p.z - (n >= state.roadSegments.length ? state.trackLength : 0);
            let dz = segment.p1.world.z - cameraZ;
            if (dz <= 0) dz += state.trackLength;

            let scale = camDepth / dz;
            let projX = canvas.width / 2 + scale * (segment.p1.world.x - p.x * 800) * (canvas.width / 2);
            let projY = canvas.height / 2 + scale * (segment.p1.world.y - p.y) * (canvas.height / 2);
            let projW = scale * 1800 * (canvas.width / 2);

            let nextSegIndex = (segIndex + 1) % state.roadSegments.length;
            let nextSegment = state.roadSegments[nextSegIndex];
            if (!nextSegment || !nextSegment.p1) continue;
            let nextScale = camDepth / (dz + state.segmentLength);
            let nextProjX = canvas.width / 2 + nextScale * (nextSegment.p1.world.x - p.x * 800) * (canvas.width / 2);
            let nextProjY = canvas.height / 2 + nextScale * (nextSegment.p1.world.y - p.y) * (canvas.height / 2);
            let nextProjW = nextScale * 1800 * (canvas.width / 2);

            if (projY >= maxY) continue;
            maxY = projY;

            // Draw Grass
            ctx.fillStyle = segment.color.grass;
            ctx.fillRect(0, projY, canvas.width, nextProjY - projY + 1);

            // Draw Road Polygon
            ctx.fillStyle = segment.color.road;
            ctx.beginPath();
            ctx.moveTo(projX - projW, projY);
            ctx.lineTo(projX + projW, projY);
            ctx.lineTo(nextProjX + nextProjW, nextProjY);
            ctx.lineTo(nextProjX - nextProjW, nextProjY);
            ctx.fill();

            // Draw Rumble Strips
            let rumbleW = projW * 0.12;
            ctx.fillStyle = segment.color.rumble;
            ctx.beginPath();
            ctx.moveTo(projX - projW, projY);
            ctx.lineTo(projX - projW + rumbleW, projY);
            ctx.lineTo(nextProjX - nextProjW + rumbleW, nextProjY);
            ctx.lineTo(nextProjX - nextProjW, nextProjY);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(projX + projW - rumbleW, projY);
            ctx.lineTo(projX + projW, projY);
            ctx.lineTo(nextProjX + nextProjW, nextProjY);
            ctx.lineTo(nextProjX + nextProjW - rumbleW, nextProjY);
            ctx.fill();

            // Draw Center Lane
            if (segment.color.lane !== 'transparent') {
                let laneW = projW * 0.04;
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.moveTo(projX - laneW / 2, projY);
                ctx.lineTo(projX + laneW / 2, projY);
                ctx.lineTo(nextProjX + laneW / 2, nextProjY);
                ctx.lineTo(nextProjX - laneW / 2, nextProjY);
                ctx.fill();
            }
        }

        // Render Rival AI Cars
        state.rivals.forEach(r => {
            let rDz = r.z - p.z;
            if (rDz < 0) rDz += state.trackLength;
            if (rDz > 0 && rDz < 40000) {
                let rScale = camDepth / rDz;
                let rX = canvas.width / 2 + rScale * (r.laneOffset * 800 - p.x * 800) * (canvas.width / 2);
                let rY = canvas.height / 2 + rScale * (0 - p.y) * (canvas.height / 2);
                let rW = rScale * 400;
                let rH = rScale * 250;

                // Draw Rival Car Sprite
                ctx.fillStyle = r.color;
                ctx.fillRect(rX - rW / 2, rY - rH, rW, rH);
                ctx.fillStyle = '#111';
                ctx.fillRect(rX - rW * 0.35, rY - rH * 0.7, rW * 0.7, rH * 0.3);
                ctx.fillStyle = '#FF2A54';
                ctx.fillRect(rX - rW * 0.4, rY - rH * 0.1, rW * 0.15, rH * 0.15);
                ctx.fillRect(rX + rW * 0.25, rY - rH * 0.1, rW * 0.15, rH * 0.15);
            }
        });

        // Render Player Car in Foreground (Chase Cam view)
        const carX = canvas.width / 2 + p.driftAngle * 4;
        const carY = canvas.height - 140;
        const carWidth = 260;
        const carHeight = 130;

        // Underglow neon reflection
        ctx.shadowColor = car.underglowColor;
        ctx.shadowBlur = 25;

        // Shadow under car
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.ellipse(carX, carY + 40, carWidth * 0.45, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Car Body Chassis
        ctx.fillStyle = car.baseColor;
        ctx.beginPath();
        ctx.roundRect(carX - carWidth / 2, carY - carHeight / 2, carWidth, carHeight, [35, 35, 15, 15]);
        ctx.fill();

        // Racing Secondary Stripe
        ctx.fillStyle = car.secondaryColor;
        ctx.fillRect(carX - 25, carY - carHeight / 2, 50, carHeight);

        // Windshield
        ctx.fillStyle = '#0D0E12';
        ctx.beginPath();
        ctx.roundRect(carX - carWidth * 0.35, carY - carHeight * 0.4, carWidth * 0.7, carHeight * 0.4, [20, 20, 5, 5]);
        ctx.fill();

        // Taillights
        ctx.fillStyle = '#FF1744';
        ctx.shadowColor = '#FF1744';
        ctx.shadowBlur = 15;
        ctx.fillRect(carX - carWidth * 0.42, carY + carHeight * 0.25, 40, 14);
        ctx.fillRect(carX + carWidth * 0.42 - 40, carY + carHeight * 0.25, 40, 14);

        // Nitro exhaust flame jets
        if (p.isBoosting) {
            ctx.fillStyle = '#00F0FF';
            ctx.shadowColor = '#00F0FF';
            ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.moveTo(carX - 35, carY + carHeight / 2);
            ctx.lineTo(carX - 20, carY + carHeight / 2 + 70 + Math.random() * 30);
            ctx.lineTo(carX - 5, carY + carHeight / 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(carX + 5, carY + carHeight / 2);
            ctx.lineTo(carX + 20, carY + carHeight / 2 + 70 + Math.random() * 30);
            ctx.lineTo(carX + 35, carY + carHeight / 2);
            ctx.fill();
        }

        ctx.shadowBlur = 0; // reset shadow

        // Render Minimap Radar
        renderMinimap();
    }

    function renderMinimap() {
        minimapCtx.clearRect(0, 0, minimapCanvas.width, minimapCanvas.height);
        const w = minimapCanvas.width;
        const h = minimapCanvas.height;
        const centerX = w / 2;
        const centerY = h / 2;
        const radius = w * 0.38;

        // Draw track circuit circle ring
        minimapCtx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        minimapCtx.lineWidth = 4;
        minimapCtx.beginPath();
        minimapCtx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        minimapCtx.stroke();

        // Draw Player blip
        const playerAngle = (state.player.z / state.trackLength) * Math.PI * 2 - Math.PI / 2;
        const pX = centerX + Math.cos(playerAngle) * radius;
        const pY = centerY + Math.sin(playerAngle) * radius;
        minimapCtx.fillStyle = '#FF2A54';
        minimapCtx.beginPath();
        minimapCtx.arc(pX, pY, 5, 0, Math.PI * 2);
        minimapCtx.fill();

        // Draw Rival blips
        state.rivals.forEach(r => {
            const rAngle = (r.z / state.trackLength) * Math.PI * 2 - Math.PI / 2;
            const rx = centerX + Math.cos(rAngle) * radius;
            const ry = centerY + Math.sin(rAngle) * radius;
            minimapCtx.fillStyle = '#00F0FF';
            minimapCtx.beginPath();
            minimapCtx.arc(rx, ry, 3.5, 0, Math.PI * 2);
            minimapCtx.fill();
        });
    }

    // ==========================================
    // 10. INITIALIZATION ON LOAD
    // ==========================================
    updateGarageUI();
    renderTrackCards();
    renderLeaderboardTable();

    // Start render loop
    requestAnimationFrame(gameLoop);
});
