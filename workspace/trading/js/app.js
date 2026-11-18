document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        activeTab: 'btc',
        account: {
            equity: 50000.00,
            balance: 50000.00,
            pnl: 0.00
        },
        positions: [],
        openOrders: [],
        tradeHistory: [],
        watchlist: [
            { symbol: 'BTC-USDT', name: 'Bitcoin', price: 64280.50, change: 2.45, high: 65100.00, low: 63200.00, vol: '1.24B', spread: '0.50', category: 'crypto' },
            { symbol: 'ETH-USDT', name: 'Ethereum', price: 3450.20, change: -0.85, high: 3520.00, low: 3410.00, vol: '680M', spread: '0.20', category: 'crypto' },
            { symbol: 'SOL-USDT', name: 'Solana', price: 142.75, change: 5.60, high: 148.00, low: 134.50, vol: '310M', spread: '0.05', category: 'crypto' },
            { symbol: 'AAPL', name: 'Apple Inc.', price: 178.40, change: 0.35, high: 179.50, low: 177.20, vol: '4.5B', spread: '0.02', category: 'stocks' },
            { symbol: 'TSLA', name: 'Tesla Inc.', price: 171.50, change: -2.10, high: 176.00, low: 169.80, vol: '5.2B', spread: '0.03', category: 'stocks' },
            { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 880.20, change: 3.80, high: 895.00, low: 865.00, vol: '8.1B', spread: '0.10', category: 'stocks' },
            { symbol: 'EUR-USD', name: 'Euro / US Dollar', price: 1.0835, change: 0.05, high: 1.0860, low: 1.0820, vol: '12B', spread: '0.0001', category: 'forex' },
            { symbol: 'GBP-USD', name: 'British Pound', price: 1.2640, change: -0.15, high: 1.2680, low: 1.2610, vol: '8.4B', spread: '0.0002', category: 'forex' },
            { symbol: 'XAU-USD', name: 'Gold Spot', price: 2335.50, change: 1.15, high: 2345.00, low: 2320.00, vol: '2.8B', spread: '0.25', category: 'commodities' },
            { symbol: 'WTI-OIL', name: 'Crude Oil', price: 85.20, change: -0.45, high: 86.40, low: 84.80, vol: '1.9B', spread: '0.05', category: 'commodities' }
        ],
        selectedSymbol: 'BTC-USDT',
        marketCategory: 'all',
        searchQuery: '',
        side: 'buy',
        orderType: 'market',
        leverage: 10,
        amount: 0.100,
        soundEnabled: true,
        chartType: 'candle',
        indicators: { sma: true, ema: true, rsi: true },
        timeframe: '15m'
    };

    // DOM Elements
    const elements = {
        accountEquity: document.getElementById('account-equity-val'),
        accountBalance: document.getElementById('account-balance-val'),
        accountPnl: document.getElementById('account-pnl-val'),
        depositModal: document.getElementById('modal-deposit'),
        btnDepositModal: document.getElementById('btn-deposit-modal'),
        btnCloseDeposit: document.getElementById('btn-close-deposit'),
        btnConfirmDeposit: document.getElementById('btn-confirm-deposit'),
        inputDepositAmount: document.getElementById('input-deposit-amount'),
        presetDepBtns: document.querySelectorAll('.preset-dep-btn'),
        btnResetAccount: document.getElementById('btn-reset-account'),
        btnSoundToggle: document.getElementById('btn-sound-toggle'),
        btnFullscreen: document.getElementById('btn-fullscreen'),
        watchlistSearch: document.getElementById('watchlist-search-input'),
        watchlistTableBody: document.getElementById('watchlist-table-body'),
        categoryFilterBtns: document.querySelectorAll('.cat-filter-btn'),
        activeSymbolBadge: document.getElementById('active-symbol-badge'),
        activePriceDisplay: document.getElementById('active-price-display'),
        activeChangeBadge: document.getElementById('active-change-badge'),
        statHigh: document.getElementById('stat-high'),
        statLow: document.getElementById('stat-low'),
        statVol: document.getElementById('stat-vol'),
        statSpread: document.getElementById('stat-spread'),
        tfBtns: document.querySelectorAll('.tf-btn'),
        toggleChartType: document.getElementById('toggle-chart-type'),
        toggleIndicatorSma: document.getElementById('toggle-indicator-sma'),
        toggleIndicatorEma: document.getElementById('toggle-indicator-ema'),
        toggleIndicatorRsi: document.getElementById('toggle-indicator-rsi'),
        mainChartCanvas: document.getElementById('main-chart-canvas'),
        rsiChartCanvas: document.getElementById('rsi-chart-canvas'),
        rsiContainer: document.getElementById('rsi-container'),
        hudO: document.getElementById('hud-o'),
        hudH: document.getElementById('hud-h'),
        hudL: document.getElementById('hud-l'),
        hudC: document.getElementById('hud-c'),
        hudV: document.getElementById('hud-v'),
        tabOrderbook: document.getElementById('tab-orderbook'),
        tabTrades: document.getElementById('tab-trades'),
        viewOrderbook: document.getElementById('view-orderbook'),
        viewTrades: document.getElementById('view-trades'),
        orderbookPrecision: document.getElementById('orderbook-precision-select'),
        orderbookAsks: document.getElementById('orderbook-asks-container'),
        orderbookBids: document.getElementById('orderbook-bids-container'),
        orderbookSpread: document.getElementById('orderbook-spread-value'),
        recentTrades: document.getElementById('recent-trades-container'),
        btnSideBuy: document.getElementById('btn-side-buy'),
        btnSideSell: document.getElementById('btn-side-sell'),
        tabOrderMarket: document.getElementById('tab-order-market'),
        tabOrderLimit: document.getElementById('tab-order-limit'),
        tabOrderStop: document.getElementById('tab-order-stop'),
        inputOrderPrice: document.getElementById('input-order-price'),
        groupOrderPrice: document.getElementById('group-order-price'),
        inputOrderAmount: document.getElementById('input-order-amount'),
        labelAssetUnit: document.getElementById('label-asset-unit'),
        amountQuick25: document.getElementById('amount-quick-25'),
        amountQuick50: document.getElementById('amount-quick-50'),
        amountQuick75: document.getElementById('amount-quick-75'),
        amountQuick100: document.getElementById('amount-quick-100'),
        sliderleverage: document.getElementById('slider-leverage'),
        displayLeverageVal: document.getElementById('display-leverage-val'),
        checkboxTpsl: document.getElementById('checkbox-tpsl'),
        containerTpslInputs: document.getElementById('container-tpsl-inputs'),
        inputTpPrice: document.getElementById('input-tp-price'),
        inputSlPrice: document.getElementById('input-sl-price'),
        orderCostCalc: document.getElementById('order-cost-calc'),
        orderMaxCalc: document.getElementById('order-max-calc'),
        btnExecuteOrder: document.getElementById('btn-execute-order'),
        tabBottomPositions: document.getElementById('tab-bottom-positions'),
        tabBottomOpenOrders: document.getElementById('tab-bottom-open-orders'),
        tabBottomHistory: document.getElementById('tab-bottom-history'),
        viewPositions: document.getElementById('view-positions'),
        viewOpenOrders: document.getElementById('view-open-orders'),
        viewHistory: document.getElementById('view-history'),
        badgePositionsCount: document.getElementById('badge-positions-count'),
        badgeOrdersCount: document.getElementById('badge-orders-count'),
        btnCloseAllPositions: document.getElementById('btn-close-all-positions'),
        btnCancelAllOrders: document.getElementById('btn-cancel-all-orders'),
        tablePositionsBody: document.getElementById('table-positions-body'),
        tableOrdersBody: document.getElementById('table-orders-body'),
        tableHistoryBody: document.getElementById('table-history-body'),
        toastContainer: document.getElementById('toast-container'),
        tickerMarquee: document.getElementById('ticker-marquee')
    };

    // Toast Notification System
    function showToast(message, type = 'success') {
        if (!elements.toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} px-4 py-2 rounded shadow-lg text-sm flex items-center gap-2 mb-2 bg-surface-2 border border-border-subtle text-main transition-all duration-300 transform translate-y-2 opacity-0`;
        
        let icon = 'fa-check-circle text-emerald-500';
        if (type === 'error') icon = 'fa-triangle-exclamation text-primary';
        if (type === 'info') icon = 'fa-circle-info text-blue-400';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        
        elements.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('translate-y-2', 'opacity-0');
        }, 10);

        setTimeout(() => {
            toast.classList.add('translate-y-2', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Audio FX helper using Web Audio API
    function playBeep(freq = 440, duration = 0.05, type = 'sine') {
        if (!state.soundEnabled) return;
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio context not allowed or supported
        }
    }

    // Render Account Stats
    function renderAccount() {
        if (elements.accountEquity) elements.accountEquity.textContent = `$${state.account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (elements.accountBalance) elements.accountBalance.textContent = `$${state.account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (elements.accountPnl) {
            elements.accountPnl.textContent = `${state.account.pnl >= 0 ? '+' : ''}$${state.account.pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            elements.accountPnl.className = `metric-value ${state.account.pnl >= 0 ? 'profit text-emerald-400' : 'loss text-primary'}`;
        }
    }

    // Render Watchlist
    function renderWatchlist() {
        if (!elements.watchlistTableBody) return;
        const q = state.searchQuery.toLowerCase();
        const filtered = state.watchlist.filter(item => {
            const matchesCat = state.marketCategory === 'all' || item.category === state.marketCategory;
            const matchesSearch = item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
            return matchesCat && matchesSearch;
        });

        elements.watchlistTableBody.innerHTML = filtered.map(item => `
            <tr class="watchlist-row ${item.symbol === state.selectedSymbol ? 'active bg-surface-3' : ''}" data-symbol="${item.symbol}">
                <td>
                    <div class="symbol-cell flex flex-col">
                        <span class="font-bold text-main">${item.symbol}</span>
                        <span class="text-xs text-muted">${item.name}</span>
                    </div>
                </td>
                <td class="text-right font-mono">${item.price.toLocaleString('en-US', { minimumFractionDigits: item.symbol.includes('USD') && !item.symbol.includes('USDT') && !item.symbol.includes('BTC') ? 4 : 2 })}</td>
                <td class="text-right font-mono ${item.change >= 0 ? 'text-emerald-400' : 'text-primary'}">
                    ${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%
                </td>
            </tr>
        `).join('');

        // Row clicks
        elements.watchlistTableBody.querySelectorAll('.watchlist-row').forEach(row => {
            row.addEventListener('click', () => {
                const sym = row.getAttribute('data-symbol');
                selectSymbol(sym);
            });
        });
    }

    // Render Ticker Marquee
    function renderTickerMarquee() {
        if (!elements.tickerMarquee) return;
        elements.tickerMarquee.innerHTML = state.watchlist.map(item => `
            <div class="ticker-item inline-flex items-center gap-2 px-3 text-xs font-mono cursor-pointer hover:bg-surface-2 py-1" data-symbol="${item.symbol}">
                <span class="text-muted font-bold">${item.symbol}</span>
                <span class="text-main">${item.price.toLocaleString()}</span>
                <span class="${item.change >= 0 ? 'text-emerald-400' : 'text-primary'}">${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%</span>
            </div>
        `).join('');

        elements.tickerMarquee.querySelectorAll('.ticker-item').forEach(el => {
            el.addEventListener('click', () => {
                selectSymbol(el.getAttribute('data-symbol'));
            });
        });
    }

    function selectSymbol(sym) {
        state.selectedSymbol = sym;
        const item = state.watchlist.find(w => w.symbol === sym);
        if (!item) return;

        if (elements.activeSymbolBadge) elements.activeSymbolBadge.textContent = item.symbol;
        if (elements.activePriceDisplay) elements.activePriceDisplay.textContent = item.price.toLocaleString('en-US', { minimumFractionDigits: 2 });
        if (elements.activeChangeBadge) {
            elements.activeChangeBadge.textContent = `${item.change >= 0 ? '+' : ''}${item.change.toFixed(2)}%`;
            elements.activeChangeBadge.className = `change-badge ${item.change >= 0 ? 'profit text-emerald-400' : 'loss text-primary'}`;
        }
        if (elements.statHigh) elements.statHigh.textContent = item.high.toLocaleString();
        if (elements.statLow) elements.statLow.textContent = item.low.toLocaleString();
        if (elements.statVol) elements.statVol.textContent = item.vol;
        if (elements.statSpread) elements.statSpread.textContent = item.spread;

        const baseAsset = sym.split('-')[0];
        if (elements.labelAssetUnit) elements.labelAssetUnit.textContent = baseAsset;

        if (elements.inputOrderPrice) {
            elements.inputOrderPrice.value = item.price.toFixed(2);
        }

        renderWatchlist();
        updateOrderCalculations();
        renderOrderbook();
        renderRecentTrades();
        renderChart();
    }

    // Render Orderbook & Trades
    function renderOrderbook() {
        if (!elements.orderbookAsks || !elements.orderbookBids) return;
        const item = state.watchlist.find(w => w.symbol === state.selectedSymbol);
        if (!item) return;

        const currentPrice = item.price;
        const prec = parseFloat(elements.orderbookPrecision ? elements.orderbookPrecision.value : '1.0');

        let asksHTML = '';
        let cumulativeAsk = 0;
        for (let i = 8; i >= 1; i--) {
            const askPrice = currentPrice + (i * prec * 1.5);
            const size = (Math.random() * 2 + 0.1).toFixed(3);
            cumulativeAsk += parseFloat(size);
            asksHTML += `
                <div class="orderbook-row grid grid-cols-3 text-xs font-mono py-0.5 px-2 hover:bg-surface-3 cursor-pointer text-primary">
                    <span>${askPrice.toFixed(2)}</span>
                    <span class="text-right text-main">${size}</span>
                    <span class="text-right text-muted">${cumulativeAsk.toFixed(3)}</span>
                </div>
            `;
        }
        elements.orderbookAsks.innerHTML = asksHTML;

        let bidsHTML = '';
        let cumulativeBid = 0;
        for (let i = 1; i <= 8; i++) {
            const bidPrice = currentPrice - (i * prec * 1.5);
            const size = (Math.random() * 2 + 0.1).toFixed(3);
            cumulativeBid += parseFloat(size);
            bidsHTML += `
                <div class="orderbook-row grid grid-cols-3 text-xs font-mono py-0.5 px-2 hover:bg-surface-3 cursor-pointer text-emerald-400">
                    <span>${bidPrice.toFixed(2)}</span>
                    <span class="text-right text-main">${size}</span>
                    <span class="text-right text-muted">${cumulativeBid.toFixed(3)}</span>
                </div>
            `;
        }
        elements.orderbookBids.innerHTML = bidsHTML;
        if (elements.orderbookSpread) {
            elements.orderbookSpread.textContent = `${item.spread} (${(parseFloat(item.spread) / currentPrice * 100).toFixed(4)}%)`;
        }
    }

    function renderRecentTrades() {
        if (!elements.recentTrades) return;
        const item = state.watchlist.find(w => w.symbol === state.selectedSymbol);
        if (!item) return;

        let html = '';
        for (let i = 0; i < 15; i++) {
            const isBuy = Math.random() > 0.45;
            const priceVar = item.price + (Math.random() - 0.5) * 5;
            const amount = (Math.random() * 1.5 + 0.01).toFixed(3);
            const timeStr = new Date(Date.now() - i * 4000).toLocaleTimeString();
            html += `
                <div class="trade-row grid grid-cols-3 text-xs font-mono py-1 px-2 border-b border-border-subtle/50">
                    <span class="text-muted">${timeStr}</span>
                    <span class="text-right ${isBuy ? 'text-emerald-400' : 'text-primary'}">${priceVar.toFixed(2)}</span>
                    <span class="text-right text-main">${amount}</span>
                </div>
            `;
        }
        elements.recentTrades.innerHTML = html;
    }

    // Chart rendering simulation
    function renderChart() {
        if (!elements.mainChartCanvas) return;
        const ctx = elements.mainChartCanvas.getContext('2d');
        const width = elements.mainChartCanvas.parentElement.clientWidth;
        const height = elements.mainChartCanvas.parentElement.clientHeight - 40;
        elements.mainChartCanvas.width = width;
        elements.mainChartCanvas.height = height;

        ctx.clearRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = '#242933';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw candlestick / price line
        const item = state.watchlist.find(w => w.symbol === state.selectedSymbol) || { price: 64280 };
        const baseP = item.price;
        
        ctx.beginPath();
        ctx.strokeStyle = '#FF3E1D';
        ctx.lineWidth = 2;

        let points = [];
        for (let x = 0; x < width; x += 15) {
            const variance = Math.sin(x * 0.02) * 100 + (Math.random() - 0.5) * 40;
            const y = height / 2 + variance;
            points.push({ x, y });
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw SMA line if active
        if (state.indicators.sma) {
            ctx.beginPath();
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1.5;
            points.forEach((p, idx) => {
                const py = p.y + 15;
                if (idx === 0) ctx.moveTo(p.x, py);
                else ctx.lineTo(p.x, py);
            });
            ctx.stroke();
        }

        // RSI canvas
        if (elements.rsiChartCanvas && state.indicators.rsi) {
            const rctx = elements.rsiChartCanvas.getContext('2d');
            const rWidth = elements.rsiChartCanvas.parentElement.clientWidth;
            const rHeight = 60;
            elements.rsiChartCanvas.width = rWidth;
            elements.rsiChartCanvas.height = rHeight;
            rctx.clearRect(0, 0, rWidth, rHeight);

            rctx.beginPath();
            rctx.strokeStyle = '#a855f7';
            rctx.lineWidth = 1.5;
            for (let x = 0; x < rWidth; x += 15) {
                const ry = rHeight / 2 + Math.cos(x * 0.03) * 20;
                if (x === 0) rctx.moveTo(x, ry);
                else rctx.lineTo(x, ry);
            }
            rctx.stroke();
        }
    }

    // Order Calculations
    function updateOrderCalculations() {
        const item = state.watchlist.find(w => w.symbol === state.selectedSymbol);
        if (!item) return;

        const price = state.orderType === 'market' ? item.price : parseFloat(elements.inputOrderPrice.value) || item.price;
        state.amount = parseFloat(elements.inputOrderAmount.value) || 0.1;

        const notional = price * state.amount;
        const margin = notional / state.leverage;

        if (elements.orderCostCalc) elements.orderCostCalc.textContent = `$${margin.toFixed(2)}`;
        if (elements.orderMaxCalc) elements.orderMaxCalc.textContent = `$${notional.toFixed(2)}`;
    }

    // Positions & Orders Management
    function renderPortfolio() {
        if (elements.badgePositionsCount) elements.badgePositionsCount.textContent = state.positions.length;
        if (elements.badgeOrdersCount) elements.badgeOrdersCount.textContent = state.openOrders.length;

        // Positions table
        if (elements.tablePositionsBody) {
            if (state.positions.length === 0) {
                elements.tablePositionsBody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-muted">No open positions. Execute an order to start trading.</td></tr>`;
            } else {
                elements.tablePositionsBody.innerHTML = state.positions.map((pos, idx) => `
                    <tr class="border-b border-border-subtle hover:bg-surface-3">
                        <td class="font-bold text-main">${pos.symbol} <span class="${pos.side === 'buy' ? 'text-emerald-400' : 'text-primary'} text-xs uppercase">(${pos.side})</span></td>
                        <td class="text-right font-mono">${pos.amount}</td>
                        <td class="text-right font-mono">$${pos.entryPrice.toFixed(2)}</td>
                        <td class="text-right font-mono">$${pos.markPrice.toFixed(2)}</td>
                        <td class="text-right font-mono text-primary">$${pos.liqPrice.toFixed(2)}</td>
                        <td class="text-right font-mono">$${pos.margin.toFixed(2)} (${pos.leverage}x)</td>
                        <td class="text-right font-mono ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-primary'}">$${pos.pnl.toFixed(2)} (${pos.roe.toFixed(2)}%)</td>
                        <td class="text-center"><button class="btn btn-xs bg-primary/20 text-primary hover:bg-primary/30 px-2 py-1 rounded close-pos-btn" data-index="${idx}">Close</button></td>
                    </tr>
                `).join('');

                elements.tablePositionsBody.querySelectorAll('.close-pos-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = parseInt(btn.getAttribute('data-index'));
                        closePosition(idx);
                    });
                });
            }
        }

        // Open Orders table
        if (elements.tableOrdersBody) {
            if (state.openOrders.length === 0) {
                elements.tableOrdersBody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-muted">No active open orders.</td></tr>`;
            } else {
                elements.tableOrdersBody.innerHTML = state.openOrders.map((ord, idx) => `
                    <tr class="border-b border-border-subtle hover:bg-surface-3">
                        <td class="font-mono text-xs text-muted">${ord.id}</td>
                        <td class="font-bold text-main">${ord.symbol}</td>
                        <td>${ord.type.toUpperCase()}</td>
                        <td class="${ord.side === 'buy' ? 'text-emerald-400' : 'text-primary'} uppercase font-bold">${ord.side}</td>
                        <td class="text-right font-mono">$${ord.price.toFixed(2)}</td>
                        <td class="text-right font-mono">${ord.amount}</td>
                        <td class="text-center"><button class="btn btn-xs bg-surface-3 text-muted hover:text-main px-2 py-1 rounded cancel-ord-btn" data-index="${idx}">Cancel</button></td>
                    </tr>
                `).join('');

                elements.tableOrdersBody.querySelectorAll('.cancel-ord-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = parseInt(btn.getAttribute('data-index'));
                        cancelOrder(idx);
                    });
                });
            }
        }

        // History table
        if (elements.tableHistoryBody) {
            if (state.tradeHistory.length === 0) {
                elements.tableHistoryBody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-muted">No trade history yet.</td></tr>`;
            } else {
                elements.tableHistoryBody.innerHTML = state.tradeHistory.map(h => `
                    <tr class="border-b border-border-subtle hover:bg-surface-3">
                        <td class="text-muted text-xs">${h.time}</td>
                        <td class="font-bold text-main">${h.symbol}</td>
                        <td>${h.type.toUpperCase()} (${h.side})</td>
                        <td class="text-right font-mono">$${h.price.toFixed(2)}</td>
                        <td class="text-right font-mono">${h.amount}</td>
                        <td class="text-right font-mono ${h.pnl >= 0 ? 'text-emerald-400' : 'text-primary'}">$${h.pnl.toFixed(2)}</td>
                    </tr>
                `).join('');
            }
        }
    }

    function closePosition(idx) {
        const pos = state.positions[idx];
        if (!pos) return;
        state.account.balance += pos.margin + pos.pnl;
        state.account.equity = state.account.balance;
        state.tradeHistory.unshift({
            symbol: pos.symbol,
            type: 'market',
            side: pos.side === 'buy' ? 'sell' : 'buy',
            price: pos.markPrice,
            amount: pos.amount,
            pnl: pos.pnl,
            time: new Date().toLocaleTimeString()
        });
        state.positions.splice(idx, 1);
        renderAccount();
        renderPortfolio();
        showToast(`Closed position for ${pos.symbol} with PnL: $${pos.pnl.toFixed(2)}`, pos.pnl >= 0 ? 'success' : 'error');
        playBeep(pos.pnl >= 0 ? 587.33 : 220, 0.1);
    }

    function cancelOrder(idx) {
        const ord = state.openOrders[idx];
        if (!ord) return;
        state.openOrders.splice(idx, 1);
        renderPortfolio();
        showToast(`Cancelled order ${ord.id}`, 'info');
    }

    // Event Listeners Binding
    // Deposit Modal
    if (elements.btnDepositModal && elements.depositModal) {
        elements.btnDepositModal.addEventListener('click', () => {
            elements.depositModal.classList.remove('hidden');
        });
    }
    if (elements.btnCloseDeposit && elements.depositModal) {
        elements.btnCloseDeposit.addEventListener('click', () => {
            elements.depositModal.classList.add('hidden');
        });
    }
    if (elements.depositModal) {
        window.addEventListener('click', (e) => {
            if (e.target === elements.depositModal) {
                elements.depositModal.classList.add('hidden');
            }
        });
    }
    if (elements.presetDepBtns) {
        elements.presetDepBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-val');
                if (elements.inputDepositAmount) elements.inputDepositAmount.value = val;
            });
        });
    }
    if (elements.btnConfirmDeposit) {
        elements.btnConfirmDeposit.addEventListener('click', () => {
            const amt = parseFloat(elements.inputDepositAmount.value) || 10000;
            state.account.balance += amt;
            state.account.equity += amt;
            renderAccount();
            elements.depositModal.classList.add('hidden');
            showToast(`Successfully deposited $${amt.toLocaleString()} USDT`, 'success');
            playBeep(659.25, 0.15);
        });
    }

    // Reset Account
    if (elements.btnResetAccount) {
        elements.btnResetAccount.addEventListener('click', () => {
            if (confirm('Reset account balance to $50,000.00 and clear all positions?')) {
                state.account.balance = 50000.00;
                state.account.equity = 50000.00;
                state.account.pnl = 0.00;
                state.positions = [];
                state.openOrders = [];
                renderAccount();
                renderPortfolio();
                showToast('Account reset successfully', 'info');
                playBeep(440, 0.2);
            }
        });
    }

    // Sound Toggle
    if (elements.btnSoundToggle) {
        elements.btnSoundToggle.addEventListener('click', () => {
            state.soundEnabled = !state.soundEnabled;
            elements.btnSoundToggle.classList.toggle('active', state.soundEnabled);
            elements.btnSoundToggle.querySelector('i').className = state.soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
            showToast(state.soundEnabled ? 'Audio FX enabled' : 'Audio FX muted', 'info');
        });
    }

    // Fullscreen Toggle
    if (elements.btnFullscreen) {
        elements.btnFullscreen.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
            }
        });
    }

    // Watchlist Search & Category Filters
    if (elements.watchlistSearch) {
        elements.watchlistSearch.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            renderWatchlist();
        });
    }

    if (elements.categoryFilterBtns) {
        elements.categoryFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.categoryFilterBtns.forEach(b => b.classList.remove('active', 'bg-primary', 'text-white'));
                btn.classList.add('active');
                const id = btn.id.replace('filter-cat-', '');
                state.marketCategory = id;
                renderWatchlist();
            });
        });
    }

    // Timeframe buttons
    if (elements.tfBtns) {
        elements.tfBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.tfBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.timeframe = btn.textContent;
                renderChart();
            });
        });
    }

    // Indicator Toggles
    if (elements.toggleChartType) {
        elements.toggleChartType.addEventListener('click', () => {
            state.chartType = state.chartType === 'candle' ? 'line' : 'candle';
            showToast(`Chart mode: ${state.chartType.toUpperCase()}`, 'info');
            renderChart();
        });
    }

    if (elements.toggleIndicatorSma) {
        elements.toggleIndicatorSma.addEventListener('click', () => {
            state.indicators.sma = !state.indicators.sma;
            elements.toggleIndicatorSma.classList.toggle('active', state.indicators.sma);
            renderChart();
        });
    }
    if (elements.toggleIndicatorEma) {
        elements.toggleIndicatorEma.addEventListener('click', () => {
            state.indicators.ema = !state.indicators.ema;
            elements.toggleIndicatorEma.classList.toggle('active', state.indicators.ema);
            renderChart();
        });
    }
    if (elements.toggleIndicatorRsi) {
        elements.toggleIndicatorRsi.addEventListener('click', () => {
            state.indicators.rsi = !state.indicators.rsi;
            elements.toggleIndicatorRsi.classList.toggle('active', state.indicators.rsi);
            if (elements.rsiContainer) elements.rsiContainer.style.display = state.indicators.rsi ? 'block' : 'none';
            renderChart();
        });
    }

    // Orderbook / Trades tabs
    if (elements.tabOrderbook && elements.viewOrderbook && elements.tabTrades && elements.viewTrades) {
        elements.tabOrderbook.addEventListener('click', () => {
            elements.tabOrderbook.classList.add('active');
            elements.tabTrades.classList.remove('active');
            elements.viewOrderbook.classList.add('active');
            elements.viewTrades.classList.remove('active');
        });
        elements.tabTrades.addEventListener('click', () => {
            elements.tabTrades.classList.add('active');
            elements.tabOrderbook.classList.remove('active');
            elements.viewTrades.classList.add('active');
            elements.viewOrderbook.classList.remove('active');
        });
    }

    if (elements.orderbookPrecision) {
        elements.orderbookPrecision.addEventListener('change', () => {
            renderOrderbook();
        });
    }

    // Order Side (Buy / Sell)
    if (elements.btnSideBuy && elements.btnSideSell && elements.btnExecuteOrder) {
        elements.btnSideBuy.addEventListener('click', () => {
            state.side = 'buy';
            elements.btnSideBuy.classList.add('active', 'buy');
            elements.btnSideSell.classList.remove('active', 'sell');
            elements.btnExecuteOrder.textContent = `Buy / Long ${state.selectedSymbol}`;
            elements.btnExecuteOrder.className = 'btn btn-execute-cta buy bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded';
        });
        elements.btnSideSell.addEventListener('click', () => {
            state.side = 'sell';
            elements.btnSideSell.classList.add('active', 'sell');
            elements.btnSideBuy.classList.remove('active', 'buy');
            elements.btnExecuteOrder.textContent = `Sell / Short ${state.selectedSymbol}`;
            elements.btnExecuteOrder.className = 'btn btn-execute-cta sell bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded';
        });
    }

    // Order Type Tabs
    if (elements.tabOrderMarket && elements.tabOrderLimit && elements.tabOrderStop) {
        const orderTabs = [elements.tabOrderMarket, elements.tabOrderLimit, elements.tabOrderStop];
        orderTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                orderTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab === elements.tabOrderMarket) {
                    state.orderType = 'market';
                    if (elements.inputOrderPrice) elements.inputOrderPrice.disabled = true;
                } else if (tab === elements.tabOrderLimit) {
                    state.orderType = 'limit';
                    if (elements.inputOrderPrice) elements.inputOrderPrice.disabled = false;
                } else {
                    state.orderType = 'stop';
                    if (elements.inputOrderPrice) elements.inputOrderPrice.disabled = false;
                }
                updateOrderCalculations();
            });
        });
    }

    // Amount & Leverage Inputs
    if (elements.inputOrderAmount) {
        elements.inputOrderAmount.addEventListener('input', updateOrderCalculations);
    }
    if (elements.inputOrderPrice) {
        elements.inputOrderPrice.addEventListener('input', updateOrderCalculations);
    }

    if (elements.amountQuick25 && elements.amountQuick50 && elements.amountQuick75 && elements.amountQuick100) {
        elements.amountQuick25.addEventListener('click', () => setQuickAmount(0.25));
        elements.amountQuick50.addEventListener('click', () => setQuickAmount(0.50));
        elements.amountQuick75.addEventListener('click', () => setQuickAmount(0.75));
        elements.amountQuick100.addEventListener('click', () => setQuickAmount(1.00));
    }

    function setQuickAmount(pct) {
        const maxAmt = state.account.balance * state.leverage / 64000;
        state.amount = parseFloat((maxAmt * pct).toFixed(3)) || 0.1;
        if (elements.inputOrderAmount) elements.inputOrderAmount.value = state.amount;
        updateOrderCalculations();
    }

    if (elements.sliderleverage && elements.displayLeverageVal) {
        elements.sliderleverage.addEventListener('input', (e) => {
            state.leverage = parseInt(e.target.value);
            elements.displayLeverageVal.textContent = `${state.leverage}x`;
            updateOrderCalculations();
        });
    }

    // TP/SL checkbox
    if (elements.checkboxTpsl && elements.containerTpslInputs) {
        elements.checkboxTpsl.addEventListener('change', (e) => {
            if (e.target.checked) {
                elements.containerTpslInputs.classList.remove('hidden');
            } else {
                elements.containerTpslInputs.classList.add('hidden');
            }
        });
    }

    // Execute Order CTA
    if (elements.btnExecuteOrder) {
        elements.btnExecuteOrder.addEventListener('click', () => {
            const item = state.watchlist.find(w => w.symbol === state.selectedSymbol);
            if (!item) return;

            const price = state.orderType === 'market' ? item.price : parseFloat(elements.inputOrderPrice.value) || item.price;
            const notional = price * state.amount;
            const marginRequired = notional / state.leverage;

            if (marginRequired > state.account.balance) {
                showToast('Insufficient balance for margin requirement', 'error');
                playBeep(150, 0.2);
                return;
            }

            state.account.balance -= marginRequired;
            state.account.equity = state.account.balance;

            if (state.orderType === 'market') {
                const liqPrice = state.side === 'buy' ? price * (1 - 0.9 / state.leverage) : price * (1 + 0.9 / state.leverage);
                state.positions.unshift({
                    symbol: state.selectedSymbol,
                    side: state.side,
                    amount: state.amount,
                    entryPrice: price,
                    markPrice: price,
                    liqPrice: Math.max(0, liqPrice),
                    margin: marginRequired,
                    leverage: state.leverage,
                    pnl: 0,
                    roe: 0
                });
                showToast(`Market ${state.side.toUpperCase()} order executed for ${state.amount} ${state.selectedSymbol}`, 'success');
            } else {
                state.openOrders.unshift({
                    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                    symbol: state.selectedSymbol,
                    type: state.orderType,
                    side: state.side,
                    price: price,
                    amount: state.amount
                });
                showToast(`${state.orderType.toUpperCase()} order placed successfully`, 'success');
            }

            renderAccount();
            renderPortfolio();
            playBeep(880, 0.1);
        });
    }

    // Bottom Portfolio Tabs
    if (elements.tabBottomPositions && elements.viewPositions && elements.tabBottomOpenOrders && elements.viewOpenOrders && elements.tabBottomHistory && elements.viewHistory) {
        const pTabs = [
            { btn: elements.tabBottomPositions, view: elements.viewPositions },
            { btn: elements.tabBottomOpenOrders, view: elements.viewOpenOrders },
            { btn: elements.tabBottomHistory, view: elements.viewHistory }
        ];

        pTabs.forEach(item => {
            item.btn.addEventListener('click', () => {
                pTabs.forEach(t => {
                    t.btn.classList.remove('active');
                    t.view.classList.remove('active');
                });
                item.btn.classList.add('active');
                item.view.classList.add('active');
            });
        });
    }

    if (elements.btnCloseAllPositions) {
        elements.btnCloseAllPositions.addEventListener('click', () => {
            if (state.positions.length === 0) return;
            state.positions.forEach(pos => {
                state.account.balance += pos.margin + pos.pnl;
            });
            state.account.equity = state.account.balance;
            state.positions = [];
            renderAccount();
            renderPortfolio();
            showToast('All positions closed successfully', 'info');
        });
    }

    if (elements.btnCancelAllOrders) {
        elements.btnCancelAllOrders.addEventListener('click', () => {
            state.openOrders = [];
            renderPortfolio();
            showToast('All open orders cancelled', 'info');
        });
    }

    // Live simulation loop
    setInterval(() => {
        state.watchlist.forEach(item => {
            const delta = (Math.random() - 0.48) * (item.price * 0.001);
            item.price = Math.max(0.01, item.price + delta);
            item.change += (delta / item.price) * 100;
            if (item.price > item.high) item.high = item.price;
            if (item.price < item.low) item.low = item.price;
        });

        // Update open positions PnL
        state.positions.forEach(pos => {
            const item = state.watchlist.find(w => w.symbol === pos.symbol);
            if (item) {
                pos.markPrice = item.price;
                const diff = pos.side === 'buy' ? (pos.markPrice - pos.entryPrice) : (pos.entryPrice - pos.markPrice);
                pos.pnl = diff * pos.amount * pos.leverage * 0.1; // simulated scaling
                pos.roe = (pos.pnl / pos.margin) * 100;
            }
        });

        const totalUnrealizedPnL = state.positions.reduce((acc, p) => acc + p.pnl, 0);
        state.account.pnl = totalUnrealizedPnL;
        state.account.equity = state.account.balance + totalUnrealizedPnL;

        renderAccount();
        renderWatchlist();
        renderTickerMarquee();
        renderOrderbook();
        renderPortfolio();
        renderChart();
    }, 2000);

    // Initial render
    renderAccount();
    renderWatchlist();
    renderTickerMarquee();
    renderOrderbook();
    renderRecentTrades();
    renderChart();
    renderPortfolio();
    showToast('NEXUS-PRO Terminal initialized successfully', 'info');
});
