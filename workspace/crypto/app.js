// ==========================================
// HASHPULSE MINING OS v2.4 - APP.JS
// ==========================================

// Global State
const state = {
  activeTab: 'dashboard',
  chartTimeframe: '24h',
  autoProfit: true,
  audioEnabled: false,
  terminalPaused: false,
  contractFilter: 'all',
  rigs: [
    { id: 1, name: 'Rig Alpha - RTX 4090', type: 'GPU (8x RTX 4080 16GB)', algo: 'SHA-256', hashrate: '142.5 TH/s', temp: 64, power: 1850, fan: 75, shares: '4,210 / 2', status: 'mining', coin: 'BTC' },
    { id: 2, name: 'Rig Beta - Antminer S21', type: 'ASIC Dedicated Unit', algo: 'SHA-256', hashrate: '200.0 TH/s', temp: 71, power: 3200, fan: 82, shares: '8,450 / 11', status: 'mining', coin: 'BTC' },
    { id: 3, name: 'Rig Gamma - RX 7900', type: 'GPU (8x RTX 4080 16GB)', algo: 'KawPow', hashrate: '310.2 MH/s', temp: 68, power: 1650, fan: 70, shares: '3,120 / 8', status: 'mining', coin: 'RVN' },
    { id: 4, name: 'Rig Delta - EPYC Node', type: 'CPU Mining Node', algo: 'RandomX (CPU)', hashrate: '45.2 KH/s', temp: 58, power: 420, fan: 55, shares: '1,890 / 0', status: 'mining', coin: 'XMR' },
    { id: 5, name: 'Rig Epsilon - Kaspa Miner', type: 'ASIC Dedicated Unit', algo: 'kHeavyHash', hashrate: '18.5 GH/s', temp: 76, power: 1200, fan: 90, shares: '5,020 / 14', status: 'overheating', coin: 'KAS' },
    { id: 6, name: 'Rig Zeta - Standby Rig', type: 'GPU (8x RTX 4080 16GB)', algo: 'Etchash', hashrate: '0.0 MH/s', temp: 42, power: 45, fan: 30, shares: '42 / 3', status: 'idle', coin: 'ETC' }
  ],
  coins: [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 65420.50, change: '+3.4%', algo: 'SHA-256', difficulty: '84.25 T', reward: '3.125 BTC', uri: 'stratum+tcp://btc.hashpulse-pool.com:3333', glyph: '₿' },
    { id: 'etc', name: 'Ethereum Classic', symbol: 'ETC', price: 28.40, change: '-1.2%', algo: 'Etchash', difficulty: '840 T', reward: '2.56 ETC', uri: 'stratum+tcp://etc.hashpulse-pool.com:4444', glyph: 'Ξ' },
    { id: 'rvn', name: 'Ravencoin', symbol: 'RVN', price: 0.024, change: '+5.8%', algo: 'KawPow', difficulty: '78.5 G', reward: '2500 RVN', uri: 'stratum+tcp://rvn.hashpulse-pool.com:5555', glyph: '🦅' },
    { id: 'kas', name: 'Kaspa', symbol: 'KAS', price: 0.162, change: '+8.1%', algo: 'kHeavyHash', difficulty: '320 P', reward: '119 KAS', uri: 'stratum+tcp://kas.hashpulse-pool.com:6666', glyph: '🅚' },
    { id: 'xmr', name: 'Monero', symbol: 'XMR', price: 168.20, change: '+0.5%', algo: 'RandomX', difficulty: '342 G', reward: '0.6 XMR', uri: 'stratum+tcp://xmr.hashpulse-pool.com:7777', glyph: 'ɱ' },
    { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: 0.125, change: '-2.1%', algo: 'Scrypt', difficulty: '12.4 M', reward: '10000 DOGE', uri: 'stratum+tcp://doge.hashpulse-pool.com:8888', glyph: 'Ð' }
  ],
  contracts: [
    { id: 1, title: 'SHA-256 Cloud Apex', algo: 'Bitcoin (SHA-256)', hashrate: '250 TH/s', duration: '30 Days', price: 499.00, returnUsd: 20.50, category: 'btc' },
    { id: 2, title: 'SHA-256 Titan Hydro', algo: 'Bitcoin (SHA-256)', hashrate: '600 TH/s', duration: '60 Days', price: 1150.00, returnUsd: 51.00, category: 'btc' },
    { id: 3, title: 'KawPow GPU Mega', algo: 'Ravencoin (KawPow)', hashrate: '1.2 GH/s', duration: '30 Days', price: 280.00, returnUsd: 12.20, category: 'alt' },
    { id: 4, title: 'kHeavyHash Kaspa Boost', algo: 'Kaspa (kHeavyHash)', hashrate: '50 GH/s', duration: '30 Days', price: 340.00, returnUsd: 15.80, category: 'alt' },
    { id: 5, title: 'Scrypt Multi-Pool Rental', algo: 'Dogecoin / Litecoin', hashrate: '2.5 GH/s', duration: '90 Days', price: 890.00, returnUsd: 38.40, category: 'alt' }
  ],
  activeContracts: [],
  walletBalances: [
    { coin: 'Bitcoin', symbol: 'BTC', amount: 0.0482, usd: 3153.27 },
    { coin: 'Ethereum Classic', symbol: 'ETC', amount: 24.50, usd: 695.80 },
    { coin: 'Ravencoin', symbol: 'RVN', amount: 12450.0, usd: 298.80 },
    { coin: 'Kaspa', symbol: 'KAS', amount: 3100.0, usd: 502.20 },
    { coin: 'Monero', symbol: 'XMR', amount: 1.25, usd: 210.25 },
    { coin: 'Dogecoin', symbol: 'DOGE', amount: 2500.0, usd: 312.50 }
  ],
  payoutHistory: [
    { id: 'TX-94821', date: '2025-03-20 14:22', coin: 'BTC', amount: '0.0250 BTC', usd: '$1,635.50', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', status: 'completed' },
    { id: 'TX-83920', date: '2025-03-15 09:10', coin: 'ETC', amount: '15.00 ETC', usd: '$426.00', address: '0x71C...38f9', status: 'completed' },
    { id: 'TX-72819', date: '2025-03-10 18:45', coin: 'KAS', amount: '2,500 KAS', usd: '$405.00', address: 'kaspa:qz9...21xx', status: 'completed' },
    { id: 'TX-61728', date: '2025-03-05 11:30', coin: 'BTC', amount: '0.0185 BTC', usd: '$1,210.27', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', status: 'pending' }
  ],
  logs: [
    '[00:00:00] [SYSTEM] Initializing HashPulse Mining OS v2.4...',
    '[00:00:01] [STRATUM] Connecting to primary pool stratum+tcp://btc.hashpulse-pool.com:3333...',
    '[00:00:02] [SUCCESS] Authorized worker connection for all 6 rigs.',
    '[00:00:15] [SHARE] Accepted diff 512M from Rig Alpha (BTC) [Latency: 24ms]',
    '[00:00:28] [SHARE] Accepted diff 1.02G from Rig Beta (BTC) [Latency: 19ms]',
    '[00:00:42] [AUTO-SWITCH] Profitability check: SHA-256 yields +4.2% over Scrypt. Maintaining route.'
  ]
};

// Global Chart Reference
let hashrateChartInstance = null;

// ==========================================
// TAB NAVIGATION
// ==========================================
function switchTab(tabName) {
  state.activeTab = tabName;

  // Update nav buttons
  document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
  const activeTabBtn = document.getElementById(`tab-btn-${tabName}`);
  if (activeTabBtn) activeTabBtn.classList.add('active');

  // Update view sections
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  const activeSection = document.getElementById(`view-${tabName}`);
  if (activeSection) activeSection.classList.add('active');

  // Specific render triggers per tab
  if (tabName === 'dashboard') {
    initHashrateChart();
  } else if (tabName === 'rigs') {
    renderRigCards();
  } else if (tabName === 'algorithms') {
    renderCoinsGrid();
  } else if (tabName === 'marketplace') {
    renderMarketplace();
    renderActiveContracts();
  } else if (tabName === 'calculator') {
    calculateProfitability();
  } else if (tabName === 'payouts') {
    renderWalletBalances();
    renderPayoutHistory();
  }
}

// ==========================================
// CHART TIMEFRAME
// ==========================================
function setChartTimeframe(timeframe) {
  state.chartTimeframe = timeframe;
  document.querySelectorAll('.timeframe-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById(`chart-timeframe-${timeframe}`);
  if (btn) btn.classList.add('active');
  
  showToast(`Hashrate chart updated to ${timeframe}`, 'info');
  initHashrateChart();
}

function initHashrateChart() {
  const canvas = document.getElementById('hashrate-chart-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (hashrateChartInstance) {
    hashrateChartInstance.destroy();
  }

  // Generate dummy data based on timeframe
  let labels = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  let dataPoints = [810, 815, 822, 819, 825, 824, 826.5];

  if (state.chartTimeframe === '1h') {
    labels = ['10m', '20m', '30m', '40m', '50m', '60m'];
    dataPoints = [820, 822, 825, 823, 826, 826.5];
  } else if (state.chartTimeframe === '6h') {
    labels = ['-5h', '-4h', '-3h', '-2h', '-1h', 'Now'];
    dataPoints = [805, 812, 818, 821, 824, 826.5];
  } else if (state.chartTimeframe === '7d') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    dataPoints = [790, 805, 815, 810, 820, 822, 826.5];
  }

  // Simple custom canvas rendering if Chart.js is not loaded, or fallback
  if (typeof Chart !== 'undefined') {
    hashrateChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Hashrate (TH/s)',
          data: dataPoints,
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#06b6d4'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(35, 45, 66, 0.5)' },
            ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } }
          },
          y: {
            grid: { color: 'rgba(35, 45, 66, 0.5)' },
            ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 10 } }
          }
        }
      }
    });
  } else {
    // Fallback simple line draw if Chart is missing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const stepX = canvas.width / (dataPoints.length - 1 || 1);
    dataPoints.forEach((val, idx) => {
      const x = idx * stepX;
      const y = canvas.height - ((val - 750) / 100) * canvas.height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
}

// ==========================================
// RIG MANAGER FUNCTIONS
// ==========================================
function renderRigCards() {
  const container = document.getElementById('rig-cards-container');
  if (!container) return;

  const searchQuery = (document.getElementById('rig-search-input')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('rig-status-filter')?.value || 'all';
  const sortSelect = document.getElementById('rig-sort-select')?.value || 'hashrate';

  let filtered = state.rigs.filter(rig => {
    const matchesSearch = rig.name.toLowerCase().includes(searchQuery) || rig.type.toLowerCase().includes(searchQuery) || rig.algo.toLowerCase().includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || rig.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  filtered.sort((a, b) => {
    if (sortSelect === 'name') return a.name.localeCompare(b.name);
    if (sortSelect === 'temp') return b.temp - a.temp;
    if (sortSelect === 'power') return b.power - a.power;
    // default hashrate
    return parseFloat(b.hashrate) - parseFloat(a.hashrate);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-notice">No mining rigs match your search filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(rig => {
    let tempClass = 'temp-ok';
    if (rig.temp >= 75) tempClass = 'temp-hot';
    else if (rig.temp >= 68) tempClass = 'temp-warn';

    return `
      <div class="rig-card">
        <div class="rig-header">
          <div class="rig-title-group">
            <h4>${rig.name}</h4>
            <span class="rig-device-type">${rig.type}</span>
          </div>
          <span class="rig-status-pill ${rig.status}">${rig.status}</span>
        </div>

        <div class="rig-coin-badge">
          <span>🪙</span> Mined: <strong>${rig.algo}</strong> (${rig.coin})
        </div>

        <div class="rig-hashrate-display">
          <span class="t-label">Current Hashrate</span>
          <span class="rig-hash-val">${rig.hashrate}</span>
        </div>

        <div class="rig-telemetry-grid">
          <div class="telemetry-item">
            <span class="t-label">Temp</span>
            <span class="t-val ${tempClass}">${rig.temp}°C</span>
          </div>
          <div class="telemetry-item">
            <span class="t-label">Power</span>
            <span class="t-val">${rig.power} W</span>
          </div>
          <div class="telemetry-item">
            <span class="t-label">Fan Speed</span>
            <span class="t-val">${rig.fan}%</span>
          </div>
        </div>

        <div class="rig-shares-bar">
          <span>Shares: ${rig.shares}</span>
          <span>Efficiency: 99.8%</span>
        </div>

        <div class="rig-actions-bar">
          <button class="btn-action btn-subtle" onclick="handleToggleRigPower(${rig.id})">${rig.status === 'mining' ? '⏸ Pause' : '▶ Start'}</button>
          <button class="btn-action btn-subtle" onclick="handleOpenTuneModal(${rig.id})">⚙ Tune</button>
          <button class="btn-action btn-subtle" onclick="handleRestartRig(${rig.id})">🔄 Reboot</button>
        </div>
      </div>
    `;
  }).join('');
}

function handleFilterRigs() {
  renderRigCards();
}

function handleStartAllRigs() {
  state.rigs.forEach(r => r.status = 'mining');
  renderRigCards();
  appendTerminalLog('[SUCCESS] Sent START command to all 6 registered workers.');
  showToast('All mining rigs started successfully', 'success');
}

function handleStopAllRigs() {
  state.rigs.forEach(r => {
    r.status = 'idle';
    r.hashrate = '0.0 TH/s';
    r.power = 45;
  });
  renderRigCards();
  appendTerminalLog('[WARNING] Sent PAUSE command to all workers.');
  showToast('All mining rigs paused', 'warning');
}

function handleToggleRigPower(id) {
  const rig = state.rigs.find(r => r.id === id);
  if (!rig) return;
  if (rig.status === 'mining') {
    rig.status = 'idle';
    rig.hashrate = '0.0 TH/s';
    showToast(`Rig ${rig.name} paused`, 'warning');
  } else {
    rig.status = 'mining';
    rig.hashrate = '142.5 TH/s';
    showToast(`Rig ${rig.name} started`, 'success');
  }
  renderRigCards();
}

function handleRestartRig(id) {
  const rig = state.rigs.find(r => r.id === id);
  if (!rig) return;
  appendTerminalLog(`[REBOOT] Sending restart sequence to worker ${rig.name}...`);
  showToast(`Rebooting ${rig.name}...`, 'info');
  setTimeout(() => {
    appendTerminalLog(`[SUCCESS] Worker ${rig.name} reinitialized and reconnected.`);
    showToast(`${rig.name} successfully rebooted`, 'success');
  }, 2000);
}

// ==========================================
// ADD RIG MODAL & ACTIONS
// ==========================================
function handleOpenAddRigModal() {
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('modal-add-rig');
  if (backdrop && modal) {
    backdrop.classList.add('active');
    modal.classList.add('active');
  }
}

function handleSaveNewRig() {
  const nameInput = document.getElementById('add-rig-name')?.value || 'Custom Worker';
  const typeSelect = document.getElementById('add-rig-type')?.value || 'GPU';
  const algoSelect = document.getElementById('add-rig-algo')?.value || 'SHA-256';

  const newRig = {
    id: state.rigs.length + 1,
    name: nameInput,
    type: typeSelect,
    algo: algoSelect,
    hashrate: '150.0 TH/s',
    temp: 65,
    power: 1750,
    fan: 75,
    shares: '0 / 0',
    status: 'mining',
    coin: 'BTC'
  };

  state.rigs.push(newRig);
  closeAllModals();
  renderRigCards();
  const navCount = document.getElementById('nav-rigs-count');
  if (navCount) navCount.innerText = state.rigs.length;
  const workersCount = document.getElementById('header-workers-count');
  if (workersCount) workersCount.innerText = `${state.rigs.filter(r => r.status === 'mining').length} Active / ${state.rigs.length} Total`;
  appendTerminalLog(`[DEPLOY] Registered and authorized new worker: ${nameInput}`);
  showToast(`Successfully deployed ${nameInput}!`, 'success');
}

// ==========================================
// TUNE / OVERCLOCK MODAL
// ==========================================
let currentTunableRigId = null;
function handleOpenTuneModal(id) {
  currentTunableRigId = id;
  const rig = state.rigs.find(r => r.id === id);
  if (rig) {
    const title = document.getElementById('tune-modal-title');
    if (title) title.innerText = `Tune Overclock: ${rig.name}`;
  }
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('modal-tune-rig');
  if (backdrop && modal) {
    backdrop.classList.add('active');
    modal.classList.add('active');
  }
}

function handleSaveTuneProfile() {
  const fan = document.getElementById('tune-fan-slider')?.value || 75;
  const power = document.getElementById('tune-power-slider')?.value || 85;

  if (currentTunableRigId) {
    const rig = state.rigs.find(r => r.id === currentTunableRigId);
    if (rig) {
      rig.fan = parseInt(fan);
      rig.power = Math.round(rig.power * (power / 100));
    }
  }

  closeAllModals();
  renderRigCards();
  showToast('Overclock profile applied successfully', 'success');
  appendTerminalLog(`[OC] Applied custom fan/power limits to worker.`);
}

// ==========================================
// WITHDRAWAL MODAL
// ==========================================
function handleOpenWithdrawModal(coinCode) {
  const select = document.getElementById('withdraw-coin-select');
  if (select && coinCode) {
    select.value = coinCode;
  }
  updateWithdrawalFeeCalc();
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('modal-withdraw');
  if (backdrop && modal) {
    backdrop.classList.add('active');
    modal.classList.add('active');
  }
}

function updateWithdrawalFeeCalc() {
  const coin = document.getElementById('withdraw-coin-select')?.value || 'btc';
  const amount = parseFloat(document.getElementById('withdraw-amount-input')?.value || '0.05');
  
  let fee = '0.0001 BTC (~$0.65)';
  let receive = (amount - 0.0001).toFixed(4) + ' BTC';

  if (coin === 'etc') {
    fee = '0.01 ETC (~$0.28)';
    receive = (amount - 0.01).toFixed(2) + ' ETC';
  } else if (coin === 'rvn') {
    fee = '5.0 RVN (~$0.12)';
    receive = (amount - 5).toFixed(2) + ' RVN';
  } else if (coin === 'kas') {
    fee = '1.0 KAS (~$0.16)';
    receive = (amount - 1).toFixed(2) + ' KAS';
  } else if (coin === 'xmr') {
    fee = '0.001 XMR (~$0.17)';
    receive = (amount - 0.001).toFixed(4) + ' XMR';
  } else if (coin === 'doge') {
    fee = '2.0 DOGE (~$0.25)';
    receive = (amount - 2).toFixed(2) + ' DOGE';
  }

  const feeDisplay = document.getElementById('withdraw-fee-display');
  const receiveDisplay = document.getElementById('withdraw-receive-display');
  if (feeDisplay) feeDisplay.innerText = fee;
  if (receiveDisplay) receiveDisplay.innerText = receive;
}

function handleConfirmWithdraw() {
  const coin = document.getElementById('withdraw-coin-select')?.value.toUpperCase() || 'BTC';
  const amount = document.getElementById('withdraw-amount-input')?.value || '0.05';
  const address = document.getElementById('withdraw-address-input')?.value || 'bc1q...';

  if (!address || address.length < 5) {
    showToast('Please enter a valid destination address', 'error');
    return;
  }

  state.payoutHistory.unshift({
    id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    coin: coin,
    amount: `${amount} ${coin}`,
    usd: `$${(parseFloat(amount) * 65000).toFixed(2)}`,
    address: address.substring(0, 10) + '...',
    status: 'pending'
  });

  closeAllModals();
  showToast(`Withdrawal of ${amount} ${coin} submitted successfully!`, 'success');
  appendTerminalLog(`[PAYOUT] Broadcasted withdrawal transaction to ${coin} network.`);
  if (state.activeTab === 'payouts') {
    renderPayoutHistory();
  }
}

// ==========================================
// ALGORITHMS & COINS GRID
// ==========================================
function renderCoinsGrid() {
  const container = document.getElementById('coins-grid-container');
  if (!container) return;

  const searchQuery = (document.getElementById('coins-filter-search')?.value || '').toLowerCase();
  const filtered = state.coins.filter(c => c.name.toLowerCase().includes(searchQuery) || c.symbol.toLowerCase().includes(searchQuery) || c.algo.toLowerCase().includes(searchQuery));

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-notice">No cryptocurrencies found matching search.</div>`;
    return;
  }

  container.innerHTML = filtered.map(coin => `
    <div class="coin-card">
      <div class="coin-card-header">
        <div class="coin-identity">
          <div class="coin-glyph">${coin.glyph}</div>
          <div class="coin-titles">
            <h4>${coin.name}</h4>
            <span class="coin-symbol">${coin.symbol} • ${coin.algo}</span>
          </div>
        </div>
        <div class="coin-price-info">
          <div class="coin-price">$${coin.price.toLocaleString()}</div>
          <div class="coin-change positive">${coin.change}</div>
        </div>
      </div>

      <div class="coin-stats-box">
        <div class="coin-stat-row">
          <span>Network Difficulty:</span>
          <span>${coin.difficulty}</span>
        </div>
        <div class="coin-stat-row">
          <span>Block Reward:</span>
          <span>${coin.reward}</span>
        </div>
      </div>

      <div class="stratum-uri-box">
        <span class="uri-text">${coin.uri}</span>
        <button class="copy-uri-btn" onclick="navigator.clipboard.writeText('${coin.uri}'); showToast('Stratum URI copied!', 'success');">📋 Copy</button>
      </div>

      <button class="btn-action btn-cyan-outline full-width" onclick="showToast('Worker pool redirected to ${coin.name}!', 'success'); appendTerminalLog('[POOL] Switched active worker stratum endpoint to ${coin.name}');">Switch Workers to ${coin.symbol}</button>
    </div>
  `).join('');
}

// ==========================================
// MARKETPLACE & CLOUD CONTRACTS
// ==========================================
function filterContracts(category) {
  state.contractFilter = category;
  document.querySelectorAll('.filter-pills .pill-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById(`btn-filter-contract-${category}`);
  if (btn) btn.classList.add('active');
  renderMarketplace();
}

function renderMarketplace() {
  const container = document.getElementById('marketplace-grid');
  if (!container) return;

  const filtered = state.contracts.filter(c => state.contractFilter === 'all' || c.category === state.contractFilter);

  container.innerHTML = filtered.map(contract => `
    <div class="contract-card">
      <span class="contract-badge">${contract.duration}</span>
      <div class="contract-titles">
        <h4>${contract.title}</h4>
        <span class="contract-algo">${contract.algo}</span>
      </div>

      <div class="contract-specs">
        <div class="contract-spec-row">
          <span>Hashrate Power:</span>
          <span>${contract.hashrate}</span>
        </div>
        <div class="contract-spec-row">
          <span>Est. Daily Return:</span>
          <span class="success-text">+$${contract.returnUsd.toFixed(2)} / day</span>
        </div>
      </div>

      <div class="contract-price-row">
        <span class="contract-price">$${contract.price.toFixed(2)}</span>
        <button class="btn-action btn-gold" onclick="openRentModal(${contract.id})">Rent Now</button>
      </div>
    </div>
  `).join('');
}

let selectedContractToRent = null;
function openRentModal(contractId) {
  selectedContractToRent = state.contracts.find(c => c.id === contractId);
  if (!selectedContractToRent) return;

  const titleEl = document.getElementById('rent-contract-title');
  if (titleEl) titleEl.innerText = `Rent: ${selectedContractToRent.title}`;
  const priceEl = document.getElementById('rent-contract-price');
  if (priceEl) priceEl.innerText = `$${selectedContractToRent.price.toFixed(2)}`;
  const hashrateEl = document.getElementById('rent-contract-hashrate');
  if (hashrateEl) hashrateEl.innerText = selectedContractToRent.hashrate;
  const durationEl = document.getElementById('rent-contract-duration');
  if (durationEl) durationEl.innerText = selectedContractToRent.duration;
  const returnEl = document.getElementById('rent-contract-return');
  if (returnEl) returnEl.innerText = `$${selectedContractToRent.returnUsd.toFixed(2)} / day`;

  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('modal-rent-contract');
  if (backdrop && modal) {
    backdrop.classList.add('active');
    modal.classList.add('active');
  }
}

function handleConfirmRentContract() {
  if (!selectedContractToRent) return;

  state.activeContracts.push({
    ...selectedContractToRent,
    rentedAt: new Date().toLocaleDateString()
  });

  closeAllModals();
  renderActiveContracts();
  showToast(`Successfully rented ${selectedContractToRent.title}!`, 'success');
  appendTerminalLog(`[CLOUD] Deployed cloud hashrate contract ${selectedContractToRent.title} (${selectedContractToRent.hashrate}).`);
  selectedContractToRent = null;
}

function renderActiveContracts() {
  const container = document.getElementById('active-contracts-container');
  if (!container) return;

  if (state.activeContracts.length === 0) {
    container.innerHTML = `<div class="empty-notice">No active cloud contracts rented yet. Select a plan above to start earning instantly!</div>`;
    return;
  }

  container.innerHTML = state.activeContracts.map(c => `
    <div class="active-contract-item">
      <div class="active-contract-header">
        <span>${c.title}</span>
        <span class="success-text">+$${c.returnUsd.toFixed(2)}/day</span>
      </div>
      <div class="active-contract-sub">Power: ${c.hashrate} • Expires in ${c.duration}</div>
    </div>
  `).join('');
}

// ==========================================
// CALCULATOR
// ==========================================
function handleHardwarePresetChange(preset) {
  const hashrateInput = document.getElementById('calc-hashrate-input');
  const powerInput = document.getElementById('calc-power-input');

  if (preset === 'rtx4090') {
    if (hashrateInput) hashrateInput.value = '854.0';
    if (powerInput) powerInput.value = '2700';
  } else if (preset === 's21') {
    if (hashrateInput) hashrateInput.value = '200.0';
    if (powerInput) powerInput.value = '3500';
  } else if (preset === 'rx7900xtx') {
    if (hashrateInput) hashrateInput.value = '310.2';
    if (powerInput) powerInput.value = '1950';
  } else if (preset === 'threadripper') {
    if (hashrateInput) hashrateInput.value = '45.2';
    if (powerInput) powerInput.value = '420';
  }
  calculateProfitability();
}

function calculateProfitability() {
  const hashrate = parseFloat(document.getElementById('calc-hashrate-input')?.value || '142.5');
  const power = parseFloat(document.getElementById('calc-power-input')?.value || '1850');
  const elecCost = parseFloat(document.getElementById('calc-electricity-cost')?.value || '0.08');

  const dailyPowerKwh = (power * 24) / 1000;
  const dailyPowerCostUsd = dailyPowerKwh * elecCost;
  const grossDailyUsd = hashrate * 0.14; // estimation factor
  const netDailyUsd = grossDailyUsd - dailyPowerCostUsd;
  const netMonthlyUsd = netDailyUsd * 30;

  const dProfit = document.getElementById('calc-profit-daily-usd');
  if (dProfit) dProfit.innerText = `$${netDailyUsd.toFixed(2)}`;
  const mProfit = document.getElementById('calc-profit-monthly-usd');
  if (mProfit) mProfit.innerText = `$${netMonthlyUsd.toFixed(2)}`;
  const pCost = document.getElementById('calc-power-cost-daily');
  if (pCost) pCost.innerText = `$${dailyPowerCostUsd.toFixed(2)}`;
  const cEst = document.getElementById('calc-crypto-daily-est');
  if (cEst) cEst.innerText = `${(netDailyUsd / 65000).toFixed(5)} BTC`;
}

// ==========================================
// WALLET & PAYOUTS
// ==========================================
function renderWalletBalances() {
  const container = document.getElementById('wallet-balances-grid');
  if (!container) return;

  container.innerHTML = state.walletBalances.map(w => `
    <div class="wallet-coin-card">
      <div class="w-card-header">
        <span class="w-coin-name">${w.coin}</span>
        <span class="w-coin-symbol">${w.symbol}</span>
      </div>
      <div class="w-coin-amount">${w.amount} ${w.symbol}</div>
      <div class="w-coin-usd">~$${w.usd.toLocaleString()} USD</div>
      <button class="btn-action btn-cyan-outline" onclick="handleOpenWithdrawModal('${w.symbol.toLowerCase()}')">Withdraw ${w.symbol}</button>
    </div>
  `).join('');
}

function renderPayoutHistory() {
  const tbody = document.getElementById('payout-history-tbody');
  if (!tbody) return;

  const searchQuery = (document.getElementById('payout-search-input')?.value || '').toLowerCase();
  const filtered = state.payoutHistory.filter(tx => tx.id.toLowerCase().includes(searchQuery) || tx.coin.toLowerCase().includes(searchQuery) || tx.address.toLowerCase().includes(searchQuery));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No matching transaction history found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(tx => `
    <tr>
      <td><strong>${tx.id}</strong></td>
      <td>${tx.date}</td>
      <td>${tx.coin}</td>
      <td>${tx.amount}</td>
      <td class="gold-text">${tx.usd}</td>
      <td style="font-family: var(--font-mono); color: var(--text-secondary);">${tx.address}</td>
      <td><span class="status-badge ${tx.status}">${tx.status.toUpperCase()}</span></td>
    </tr>
  `).join('');
}

// ==========================================
// TERMINAL & CONSOLE
// ==========================================
function toggleTerminalDrawer() {
  const consoleBody = document.getElementById('stratum-console');
  const toggleBtn = document.getElementById('terminal-toggle-btn');
  if (consoleBody && toggleBtn) {
    consoleBody.classList.toggle('collapsed');
    if (consoleBody.classList.contains('collapsed')) {
      toggleBtn.innerText = '▲ Expand';
    } else {
      toggleBtn.innerText = '▼ Collapse';
    }
  }
}

function toggleTerminalPause() {
  state.terminalPaused = !state.terminalPaused;
  const btn = document.getElementById('terminal-pause-btn');
  if (btn) {
    btn.innerText = state.terminalPaused ? '▶ Resume' : '⏸ Pause';
  }
  showToast(state.terminalPaused ? 'Terminal feed paused' : 'Terminal feed resumed', 'info');
}

function clearTerminalLogs() {
  const output = document.getElementById('terminal-log-output');
  if (output) {
    const codeEl = output.querySelector('code');
    if (codeEl) codeEl.innerText = '[00:00:00] [SYSTEM] Console cleared by user.';
  }
  const miniList = document.getElementById('mini-stratum-log-list');
  if (miniList) {
    miniList.innerHTML = '';
  }
  showToast('Terminal logs cleared', 'info');
}

function appendTerminalLog(text) {
  if (state.terminalPaused) return;
  state.logs.push(text);
  if (state.logs.length > 50) state.logs.shift();

  const timestamp = new Date().toTimeString().split(' ')[0];
  const formatted = `[${timestamp}] ${text}`;

  const output = document.getElementById('terminal-log-output');
  if (output) {
    const codeEl = output.querySelector('code');
    if (codeEl) {
      codeEl.innerText += `\n${formatted}`;
      output.scrollTop = output.scrollHeight;
    }
  }

  const miniList = document.getElementById('mini-stratum-log-list');
  if (miniList) {
    let cssClass = 'ok';
    if (text.includes('WARNING') || text.includes('AUTO-SWITCH')) cssClass = 'warn';
    if (text.includes('ERROR') || text.includes('FAILED')) cssClass = 'error';
    if (text.includes('STRATUM') || text.includes('SYSTEM')) cssClass = 'info';

    const div = document.createElement('div');
    div.className = `log-line ${cssClass}`;
    div.innerText = formatted;
    miniList.appendChild(div);
    if (miniList.children.length > 30) miniList.removeChild(miniList.firstChild);
    miniList.scrollTop = miniList.scrollHeight;
  }
}

// ==========================================
// MODALS MANAGEMENT
// ==========================================
function closeAllModals() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) backdrop.classList.remove('active');
  document.querySelectorAll('.modal-card').forEach(m => m.classList.remove('active'));
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '✅';
  if (type === 'error') icon = '❌';
  if (type === 'warning') icon = '⚠️';
  if (type === 'info') icon = 'ℹ️';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// AUTO-PROFIT TOGGLE & QUICK ACTIONS
// ==========================================
function handleToggleAutoProfitSwitch() {
  const toggle = document.getElementById('auto-profit-toggle');
  state.autoProfit = toggle ? toggle.checked : true;
  showToast(state.autoProfit ? 'Auto-Profit Switching Enabled' : 'Auto-Profit Switching Disabled', 'info');
  appendTerminalLog(`[AUTO-SWITCH] Mode changed to: ${state.autoProfit ? 'ENABLED' : 'DISABLED'}`);
}

// ==========================================
// INITIALIZATION ON DOM LOAD
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Populate Market Ticker
  const tickerTrack = document.getElementById('market-ticker-track');
  if (tickerTrack) {
    const tickerHtml = state.coins.map(c => `
      <div class="ticker-item">
        <span class="symbol">${c.symbol}:</span>
        <span class="price">$${c.price.toLocaleString()}</span>
        <span class="change ${c.change.startsWith('+') ? 'positive' : 'negative'}">${c.change}</span>
      </div>
    `).join('');
    tickerTrack.innerHTML = tickerHtml + tickerHtml; // double for infinite scroll
  }

  // Populate Mini Stratum Feed
  const miniList = document.getElementById('mini-stratum-log-list');
  if (miniList) {
    miniList.innerHTML = `
      <div class="log-line info">[00:00:00] [SYSTEM] Initializing HashPulse Mining OS v2.4...</div>
      <div class="log-line info">[00:00:01] [STRATUM] Connecting to primary pool stratum+tcp://btc...</div>
      <div class="log-line ok">[00:00:02] [SUCCESS] Authorized worker connection for all 6 rigs.</div>
      <div class="log-line ok">[00:00:15] [SHARE] Accepted diff 512M from Rig Alpha (BTC)</div>
    `;
  }

  // Initial tab view render & rig render so rig-search-input is ready and visible when switching tabs
  renderRigCards();
  switchTab('dashboard');

  // Wire header wallet summary & quick payout
  const btnOpenWallet = document.getElementById('btn-open-wallet');
  if (btnOpenWallet) {
    btnOpenWallet.addEventListener('click', () => {
      switchTab('payouts');
    });
  }

  const btnQuickPayout = document.getElementById('btn-quick-payout');
  if (btnQuickPayout) {
    btnQuickPayout.addEventListener('click', () => {
      switchTab('payouts');
      handleOpenWithdrawModal('btc');
    });
  }

  const brandLogo = document.getElementById('brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', () => {
      switchTab('dashboard');
    });
  }

  const btnToggleAudio = document.getElementById('btn-toggle-audio');
  if (btnToggleAudio) {
    btnToggleAudio.addEventListener('click', () => {
      state.audioEnabled = !state.audioEnabled;
      btnToggleAudio.innerText = state.audioEnabled ? '🔔' : '🔇';
      showToast(state.audioEnabled ? 'Stratum Audio Chime Enabled' : 'Stratum Audio Chime Muted', 'info');
    });
  }

  // Periodic simulation logs
  setInterval(() => {
    const randomRigs = ['Rig Alpha', 'Rig Beta', 'Rig Gamma', 'Rig Delta'];
    const chosen = randomRigs[Math.floor(Math.random() * randomRigs.length)];
    appendTerminalLog(`[SHARE] Accepted diff 1.02G from ${chosen} [Latency: ${Math.floor(15 + Math.random() * 20)}ms]`);
  }, 8000);
});
