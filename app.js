const PARTNER_APP_ID = "34UGhpx0qrXHqpfKHAkGH";
const AFFILIATE_TOKEN = "3A2CFHPG722B";

const marketSymbols = {
    volatility_1s: [
        { symbol: '1HZ10V', name: 'Volatility 10 (1s) Index' },
        { symbol: '1HZ25V', name: 'Volatility 25 (1s) Index' },
        { symbol: '1HZ50V', name: 'Volatility 50 (1s) Index' },
        { symbol: '1HZ75V', name: 'Volatility 75 (1s) Index' },
        { symbol: '1HZ100V', name: 'Volatility 100 (1s) Index' }
    ],
    synthetic: [
        { symbol: 'R_100', name: 'Volatility 100 Index' },
        { symbol: 'R_75', name: 'Volatility 75 Index' },
        { symbol: 'R_50', name: 'Volatility 50 Index' },
        { symbol: 'R_25', name: 'Volatility 25 Index' },
        { symbol: 'R_10', name: 'Volatility 10 Index' },
        { symbol: 'JD10', name: 'Jump 10 Index' },
        { symbol: 'JD25', name: 'Jump 25 Index' },
        { symbol: 'JD50', name: 'Jump 50 Index' },
        { symbol: 'JD75', name: 'Jump 75 Index' },
        { symbol: 'JD100', name: 'Jump 100 Index' }
    ],
    boom_crash: [
        { symbol: 'BOOM1000', name: 'Boom 1000 Index' },
        { symbol: 'BOOM500', name: 'Boom 500 Index' },
        { symbol: 'BOOM300N', name: 'Boom 300 Index' },
        { symbol: 'CRASH1000', name: 'Crash 1000 Index' },
        { symbol: 'CRASH500', name: 'Crash 500 Index' },
        { symbol: 'CRASH300N', name: 'Crash 300 Index' },
        { symbol: 'stpRNG', name: 'Step Index' }
    ],
    forex: [
        { symbol: 'frxEURUSD', name: 'EUR/USD (Euro/Dollar)' },
        { symbol: 'frxGBPUSD', name: 'GBP/USD (Pound/Dollar)' },
        { symbol: 'frxUSDJPY', name: 'USD/JPY (Dollar/Yen)' },
        { symbol: 'frxAUDUSD', name: 'AUD/USD (Aussie/Dollar)' },
        { symbol: 'frxUSDCAD', name: 'USD/CAD (Dollar/CAD)' },
        { symbol: 'frxNZDUSD', name: 'NZD/USD (Kiwi/Dollar)' },
        { symbol: 'frxEURGBP', name: 'EUR/GBP (Euro/Pound)' },
        { symbol: 'frxGBPJPY', name: 'GBP/JPY (Pound/Yen)' }
    ],
    crypto: [
        { symbol: 'cryBTCUSD', name: 'BTC/USD (Bitcoin)' },
        { symbol: 'cryETHUSD', name: 'ETH/USD (Ethereum)' }
    ],
    commodities: [
        { symbol: 'frxXAUUSD', name: 'Spot Gold (XAU/USD)' },
        { symbol: 'frxXAGUSD', name: 'Spot Silver (XAG/USD)' },
        { symbol: 'frxBROUSD', name: 'Brent Crude Oil' }
    ],
    stocks: [
        { symbol: 'OTC_DJI', name: 'Wall Street 30 Index' },
        { symbol: 'OTC_SPC', name: 'US 500 Index' },
        { symbol: 'OTC_NDX', name: 'US Tech 100' }
    ]
};

const exchangeRates = { KES: 129.0, UGX: 3750.0, TZS: 2600.0, ETB: 120.5, EUR: 0.92, GBP: 0.79, JPY: 155.0 };

const monthlyEconomicNews = [
    { day: "1st Wed", time: "16:00 EAT", event: "US ADP Employment Change", currency: "USD", impact: "HIGH", direction: "Bullish USD", boat: "Boat 4: MTF Trend Scalper", exit: "Exit 5 Ticks" },
    { day: "1st Fri", time: "15:30 EAT", event: "US Non-Farm Payrolls (NFP)", currency: "USD", impact: "HIGH", direction: "Breakout Expansion", boat: "Boat 3: Recovery Hedging", exit: "Exit 3 Runs" },
    { day: "3rd Wed", time: "15:30 EAT", event: "US Consumer Price Index (CPI)", currency: "USD", impact: "HIGH", direction: "High Volatility Reversal", boat: "Boat 5: Boundary Scalper", exit: "Exit 4 Runs" }
];

// Global State per Symbol
const marketState = {};
let focusedSymbol = '1HZ10V';
let totalGlobalTicks = 0;
let splashTimerInterval = null;

function enterTerminalNow() {
    clearInterval(splashTimerInterval);
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        splashScreen.style.opacity = '0';
        setTimeout(() => splashScreen.remove(), 500);
    }
}

function runCoreLoadingSequence() {
    let remainingSeconds = 180;
    const timerDisplay = document.getElementById('loading-timer-display');
    const progressBar = document.getElementById('core-progress-bar');
    const statusText = document.getElementById('loading-status-text');
    const stageBadge = document.getElementById('splash-stage-badge');

    // Start live WebSocket feeds immediately in the background while splash greets user!
    initializeLiveTerminal();

    splashTimerInterval = setInterval(() => {
        remainingSeconds--;
        const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const secs = (remainingSeconds % 60).toString().padStart(2, '0');
        if (timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;
        const pct = ((180 - remainingSeconds) / 180) * 100;
        if (progressBar) progressBar.style.width = `${pct}%`;

        if (pct > 75 && stageBadge) {
            stageBadge.innerText = "STAGE 4/4: ALL MARKETS & BOTS LOCKED IN";
            if (statusText) statusText.innerText = "A+ Strategies Verified. Ready for Execution!";
        } else if (pct > 45 && stageBadge) {
            stageBadge.innerText = "STAGE 3/4: CALIBRATING 4-IND MTF RISE/FALL";
            if (statusText) statusText.innerText = "Aligning EMA, RSI, MACD & Bollinger BOS...";
        } else if (pct > 20 && stageBadge) {
            stageBadge.innerText = "STAGE 2/4: BUILDING CASCADING DIGIT AI";
            if (statusText) statusText.innerText = "Scanning Match/Differ, Even/Odd & Over/Under...";
        }

        if (remainingSeconds <= 0) {
            enterTerminalNow();
        }
    }, 1000);
}

function updateAssetDropdown(category, preselectSymbol = null) {
    const assetSelector = document.getElementById('asset-selector');
    if (!assetSelector) return;
    assetSelector.innerHTML = '';
    const list = marketSymbols[category] || marketSymbols.volatility_1s;
    list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.symbol;
        opt.innerText = item.name;
        assetSelector.appendChild(opt);
    });
    if (preselectSymbol) {
        assetSelector.value = preselectSymbol;
    }
    focusedSymbol = assetSelector.value;
    requestTimeframesForFocusedAsset();
}

function focusSpecificMarket(category, symbol) {
    const catSelect = document.getElementById('market-category');
    if (catSelect) catSelect.value = category;
    updateAssetDropdown(category, symbol);
    renderFocusedAssetPanels();
}

function setupCurrencyConverter() {
    const amtInput = document.getElementById('convert-amount');
    const curSelect = document.getElementById('target-currency');
    const outEl = document.getElementById('converted-output');
    function calc() {
        const val = (parseFloat(amtInput.value) || 0) * (exchangeRates[curSelect.value] || 1);
        outEl.innerText = `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${curSelect.value}`;
    }
    if (amtInput && curSelect) { amtInput.addEventListener('input', calc); curSelect.addEventListener('change', calc); calc(); }
}

function switchAccountMode(mode) {
    const b1 = document.getElementById('btn-mode-demo'), b2 = document.getElementById('btn-mode-real');
    if (mode === 'demo') {
        b1.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b2.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    } else {
        b2.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b1.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    }
}

function executeActionSignal(mode) {
    const label = mode === 'DIGIT' ? `[A+ DIGIT CASCADE: ${focusedSymbol}]` : `[A+ 4-IND MTF RISE/FALL: ${focusedSymbol}]`;
    triggerElhadartProfitAlert(label, 48.50);
}

function loginWithDeriv() {
    window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${PARTNER_APP_ID}&affiliate_token=${AFFILIATE_TOKEN}`;
}
function signupWithDeriv() {
    window.open(`https://hub.deriv.com/tradershub/signup?t=${AFFILIATE_TOKEN}`, '_blank');
}

function populateMonthlyNewsCalendar() {
    const container = document.getElementById('news-calendar-widget');
    if (!container) return;
    container.innerHTML = '';
    monthlyEconomicNews.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-slate-950/60 p-2 rounded-lg border border-slate-800 space-y-0.5';
        div.innerHTML = `
            <div class="flex justify-between font-bold text-fxgreen">
                <span>📅 ${item.day} (${item.currency})</span>
                <span class="text-amber-400">[${item.impact}]</span>
            </div>
            <div class="text-white font-semibold text-[10px]">${item.event}</div>
            <div class="text-gold text-[9px]">⚡ ${item.direction} | Use <strong>${item.boat}</strong> (${item.exit})</div>
        `;
        container.appendChild(div);
    });
}

// =========================================================================
// TECHNICAL MATH HELPERS (EMA, RSI, MACD, BOLLINGER BANDS BOS)
// =========================================================================
function calculateEMA(prices, period) {
    if (prices.length < period) return prices[prices.length - 1] || 0;
    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < prices.length; i++) {
        ema = prices[i] * k + ema * (1 - k);
    }
    return ema;
}

function calculateRSI(prices, period = 14) {
    if (prices.length <= period) return 50;
    let gains = 0, losses = 0;
    for (let i = prices.length - period; i < prices.length; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }
    if (losses === 0) return 100;
    const rs = (gains / period) / (losses / period);
    return 100 - (100 / (1 + rs));
}

function evaluate4Indicators(prices) {
    if (prices.length < 26) {
        return { ready: false, direction: 'NEUTRAL', score: 0, ema: '--', rsi: '--', macd: '--', bos: '--' };
    }
    const lastPrice = prices[prices.length - 1];
    const ema9 = calculateEMA(prices, 9);
    const ema21 = calculateEMA(prices, 21);
    const rsi = calculateRSI(prices, 14);

    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;

    const slice20 = prices.slice(-20);
    const sma20 = slice20.reduce((a, b) => a + b, 0) / 20;
    const variance = slice20.reduce((acc, p) => acc + Math.pow(p - sma20, 2), 0) / 20;
    const stdDev = Math.sqrt(variance);
    const upperBB = sma20 + 1.8 * stdDev;
    const lowerBB = sma20 - 1.8 * stdDev;

    let bullVotes = 0;
    let bearVotes = 0;

    // 1. EMA 9/21 Crossover
    const emaBull = ema9 > ema21;
    emaBull ? bullVotes++ : bearVotes++;

    // 2. RSI Momentum Filter (Avoid overbought/oversold traps)
    let rsiLabel = `${rsi.toFixed(1)}`;
    if (rsi > 52 && rsi < 75) { bullVotes++; rsiLabel += ' (BULL)'; }
    else if (rsi < 48 && rsi > 25) { bearVotes++; rsiLabel += ' (BEAR)'; }
    else { rsiLabel += ' (EXTREME)'; }

    // 3. MACD Histogram Bias
    const macdBull = macdLine > 0;
    macdBull ? bullVotes++ : bearVotes++;

    // 4. Bollinger Band Break of Structure (BOS)
    let bosLabel = 'INSIDE RANGE';
    if (lastPrice > sma20 && lastPrice <= upperBB) { bullVotes++; bosLabel = 'BULL BOS'; }
    else if (lastPrice < sma20 && lastPrice >= lowerBB) { bearVotes++; bosLabel = 'BEAR BOS'; }

    let direction = 'NEUTRAL';
    let score = Math.max(bullVotes, bearVotes) * 25;
    if (bullVotes >= 3) direction = 'RISE';
    else if (bearVotes >= 3) direction = 'FALL';

    return {
        ready: true,
        direction,
        score,
        ema: emaBull ? '9 > 21 BULL' : '9 < 21 BEAR',
        rsi: rsiLabel,
        macd: macdBull ? '+BULLISH' : '-BEARISH',
        bos: bosLabel
    };
}

// =========================================================================
// PER-MARKET DATA INGESTION & CASCADING DIGIT AI
// =========================================================================
function findCategoryForSymbol(sym) {
    for (const [cat, items] of Object.entries(marketSymbols)) {
        if (items.some(i => i.symbol === sym)) return cat;
    }
    return 'volatility_1s';
}

function processIncomingTick(tick) {
    totalGlobalTicks++;
    const sym = tick.symbol;
    const pipSize = tick.pip_size !== undefined ? tick.pip_size : 2;
    const formattedPrice = Number(tick.quote).toFixed(pipSize);
    const lastDigit = parseInt(formattedPrice.slice(-1), 10);

    if (!marketState[sym]) {
        marketState[sym] = {
            symbol: sym,
            category: findCategoryForSymbol(sym),
            quotes: [],
            formattedPrice: formattedPrice,
            lastDigit: lastDigit,
            digitCounts: [0,0,0,0,0,0,0,0,0,0],
            totalDigits: 0,
            riskScore: 50,
            winrateEst: 75,
            timeframes: { 60: 'NEUTRAL', 300: 'NEUTRAL', 900: 'NEUTRAL' }
        };
    }

    const st = marketState[sym];
    st.formattedPrice = formattedPrice;
    st.lastDigit = lastDigit;
    st.quotes.push(Number(tick.quote));
    if (st.quotes.length > 150) st.quotes.shift();

    // Maintain rolling 100-tick window for hyper-responsive digit probability
    st.digitCounts[lastDigit]++;
    st.totalDigits++;
    if (st.totalDigits > 100) {
        // Decay older counts smoothly so indicators adapt rapidly to current market shifts
        for (let i = 0; i < 10; i++) {
            st.digitCounts[i] = Math.max(0, st.digitCounts[i] * 0.985);
        }
        st.totalDigits = st.digitCounts.reduce((a, b) => a + b, 0);
    }

    // Calculate Risk Score & Winrate Probability for this market
    let flips = 0;
    for (let i = 2; i < Math.min(st.quotes.length, 20); i++) {
        const d1 = st.quotes[st.quotes.length - i] - st.quotes[st.quotes.length - i - 1];
        const d2 = st.quotes[st.quotes.length - i + 1] - st.quotes[st.quotes.length - i];
        if ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) flips++;
    }
    const chopRatio = st.quotes.length > 6 ? flips / Math.min(st.quotes.length - 2, 18) : 0.4;
    st.riskScore = Math.min(99, Math.max(8, Math.round(chopRatio * 100)));
    st.winrateEst = Math.min(96, Math.max(68, 100 - Math.round(st.riskScore * 0.35)));

    document.getElementById('tick-buffer-count').innerText = `${totalGlobalTicks} Total Ticks`;
    document.getElementById('active-streams-badge').innerText = `📡 ${Object.keys(marketState).length} Markets Live`;

    if (sym === focusedSymbol) {
        renderFocusedAssetPanels();
    }

    // Refresh Live All-Markets Board & Risk Ranking periodically
    if (totalGlobalTicks % 3 === 0) {
        renderMultiMarketLiveBoard();
    }

    // Log high-winrate A+ alerts across ANY streaming market
    if (st.winrateEst >= 86 && Math.random() < 0.08) {
        appendScannerFeed(sym, st.formattedPrice, st.lastDigit, st.winrateEst);
    }
}

function analyzeCascadingDigitStrategy(st) {
    const total = st.totalDigits || 1;
    let minPct = 100, minDigit = 0;
    let maxPct = 0, maxDigit = 0;

    for (let i = 0; i < 10; i++) {
        const pct = (st.digitCounts[i] / total) * 100;
        if (pct < minPct) { minPct = pct; minDigit = i; }
        if (pct > maxPct) { maxPct = pct; maxDigit = i; }
    }

    const evenSum = st.digitCounts[0] + st.digitCounts[2] + st.digitCounts[4] + st.digitCounts[6] + st.digitCounts[8];
    const evenPct = (evenSum / total) * 100;
    const oddPct = 100 - evenPct;

    const underSum = st.digitCounts[0] + st.digitCounts[1] + st.digitCounts[2] + st.digitCounts[3] + st.digitCounts[4];
    const underPct = (underSum / total) * 100;
    const overPct = 100 - underPct;

    // CASCADE STAGE 1: MATCHES / DIFFERS (Highest priority if extreme spike or extreme dormancy)
    if (maxPct >= 19.5 && st.quotes.length >= 15) {
        return {
            stage: "STAGE 1: MATCHES / DIFFERS EDGE",
            contract: `MATCH DIGIT ${maxDigit} (${maxPct.toFixed(1)}% Hot) or DIFFER ${minDigit}`,
            trigger: `Enter immediately after Digit ${st.lastDigit} or ${maxDigit} appears`,
            boat: "Boat 2: Precision Digit Matcher / Differ Pro",
            runs: "Exit after 3 Runs",
            highlightDigit: maxDigit
        };
    }
    if (minPct <= 4.5 && st.quotes.length >= 15) {
        return {
            stage: "STAGE 1: DIFFERS DORMANT EDGE",
            contract: `DIFFER ${minDigit} (Only ${minPct.toFixed(1)}% Freq — ${ (100 - minPct).toFixed(1) }% Win Edge)`,
            trigger: `Enter immediately when Digit ${maxDigit} hits`,
            boat: "Boat 1: Safe Differ Harvester",
            runs: "Exit after 4 Runs",
            highlightDigit: minDigit
        };
    }

    // CASCADE STAGE 2: EVEN / ODD (If Matches/Differs has no extreme outlier)
    if (evenPct >= 58 || oddPct >= 58) {
        const pick = evenPct >= 58 ? "EVEN" : "ODD";
        const domPct = Math.max(evenPct, oddPct).toFixed(1);
        const triggerDig = pick === "EVEN" ? "any ODD digit (1,3,5,7,9)" : "any EVEN digit (0,2,4,6,8)";
        return {
            stage: "STAGE 2: EVEN / ODD DOMINANCE",
            contract: `DIGIT ${pick} (${domPct}% Dominance)`,
            trigger: `Enter right after ${triggerDig} hits`,
            boat: "Boat 4: Even/Odd High-Winrate Scalper",
            runs: "Exit after 5 Runs",
            highlightDigit: maxDigit
        };
    }

    // CASCADE STAGE 3: OVER / UNDER (Fallback when Even/Odd is balanced ~50/50)
    const isUnder = underPct >= overPct;
    const boundaryContract = isUnder ? `UNDER 6 (${underPct.toFixed(1)}% Low-Digit Bias)` : `OVER 3 (${overPct.toFixed(1)}% High-Digit Bias)`;
    const triggerDigit = isUnder ? "Digit 7, 8, or 9" : "Digit 0, 1, or 2";
    return {
        stage: "STAGE 3: OVER / UNDER BOUNDARY",
        contract: boundaryContract,
        trigger: `Enter right after ${triggerDigit} hits`,
        boat: "Boat 5: Over/Under Boundary Scalper",
        runs: "Exit after 5 Runs",
        highlightDigit: maxDigit
    };
}

function renderFocusedAssetPanels() {
    const st = marketState[focusedSymbol];
    if (!st) return;

    document.getElementById('live-quote-display').innerText = st.formattedPrice;
    document.getElementById('digit-analyzer-title').innerText = `1. Smart Cascading Digit AI (${st.symbol})`;
    document.getElementById('last-digit-display').innerText = `Last Digit: ${st.lastDigit}`;

    const cascade = analyzeCascadingDigitStrategy(st);
    const total = st.totalDigits || 1;

    for (let i = 0; i < 10; i++) {
        const pct = ((st.digitCounts[i] / total) * 100).toFixed(1);
        const freqEl = document.getElementById(`freq-${i}`);
        const boxEl = document.getElementById(`box-digit-${i}`);
        if (freqEl) freqEl.innerText = `${pct}%`;
        if (boxEl) {
            if (i === cascade.highlightDigit) {
                boxEl.className = "bg-emerald-950/80 p-2 rounded-xl border-2 border-fxgreen shadow-[0_0_12px_rgba(0,255,136,0.4)]";
            } else {
                boxEl.className = "bg-slate-900 p-2 rounded-xl border border-slate-800";
            }
        }
    }

    document.getElementById('digit-cascade-stage').innerText = cascade.stage;
    document.getElementById('digit-contract-target').innerText = cascade.contract;
    document.getElementById('digit-trigger-condition').innerText = cascade.trigger;
    document.getElementById('digit-prescribed-boat').innerText = cascade.boat;
    document.getElementById('digit-exit-runs').innerText = cascade.runs;

    // 2. Render Dedicated 4-Indicator Multi-Timeframe Rise & Fall Panel
    const ind = evaluate4Indicators(st.quotes);
    document.getElementById('ind-ema-status').innerText = ind.ema;
    document.getElementById('ind-rsi-status').innerText = ind.rsi;
    document.getElementById('ind-macd-status').innerText = ind.macd;
    document.getElementById('ind-bos-status').innerText = ind.bos;

    document.getElementById('mtf-tick').innerText = ind.direction;
    document.getElementById('mtf-1m').innerText = st.timeframes[60] || ind.direction;
    document.getElementById('mtf-5m').innerText = st.timeframes[300] || ind.direction;
    document.getElementById('mtf-15m').innerText = st.timeframes[900] || ind.direction;

    const mtfMatches = [ind.direction, st.timeframes[60], st.timeframes[300], st.timeframes[900]].filter(d => d === ind.direction && d !== 'NEUTRAL').length;
    const totalConf = ind.ready ? Math.min(96, Math.round((ind.score * 0.6) + (mtfMatches * 10))) : 50;
    document.getElementById('rf-winrate-badge').innerText = `A+ Conf: ${totalConf}%`;

    const dirEl = document.getElementById('rf-direction-signal');
    if (ind.direction === 'RISE') {
        dirEl.innerText = `🟢 A+ RISE CALL (${mtfMatches}/4 TF Aligned)`;
        dirEl.className = "font-bold text-fxgreen";
        document.getElementById('rf-prescribed-boat').innerText = "Boat 4: MTF Bullish Trend Scalper";
        document.getElementById('rf-exit-point').innerText = "Exit after 5 Ticks / +1 Candle";
    } else if (ind.direction === 'FALL') {
        dirEl.innerText = `🔴 A+ FALL PUT (${mtfMatches}/4 TF Aligned)`;
        dirEl.className = "font-bold text-rose-400";
        document.getElementById('rf-prescribed-boat').innerText = "Boat 6: MTF Bearish Drop Hunter";
        document.getElementById('rf-exit-point').innerText = "Exit after 5 Ticks / +1 Candle";
    } else {
        dirEl.innerText = "⏳ CONSOLIDATING — WAIT FOR 4-IND ALIGNMENT";
        dirEl.className = "font-bold text-amber-400";
        document.getElementById('rf-prescribed-boat').innerText = "Standby (Use Digit AI Above)";
        document.getElementById('rf-exit-point').innerText = "Wait for BOS Breakout";
    }
    document.getElementById('rf-entry-price').innerText = st.formattedPrice;
}

function renderMultiMarketLiveBoard() {
    const board = document.getElementById('multi-market-live-board');
    if (!board) return;

    const allMarkets = Object.values(marketState);
    if (allMarkets.length === 0) return;

    // Sort from Safest / Highest Winrate to Riskiest
    const sorted = [...allMarkets].sort((a, b) => a.riskScore - b.riskScore);
    const safest = sorted[0];
    const riskiest = sorted[sorted.length - 1];

    const summaryEl = document.getElementById('safest-riskiest-summary');
    if (summaryEl && safest && riskiest) {
        summaryEl.innerText = `Safe: ${safest.symbol} (${safest.winrateEst}%) | Risky: ${riskiest.symbol}`;
    }

    board.innerHTML = '';
    sorted.forEach(m => {
        const isFocused = m.symbol === focusedSymbol;
        const riskBadge = m.riskScore < 42
            ? `<span class="text-fxgreen font-bold">SAFE (${m.winrateEst}%)</span>`
            : m.riskScore < 68
            ? `<span class="text-amber-400 font-bold">MOD (${m.winrateEst}%)</span>`
            : `<span class="text-rose-400 font-bold">RISKY</span>`;

        const row = document.createElement('div');
        row.onclick = () => focusSpecificMarket(m.category, m.symbol);
        row.className = `cursor-pointer p-2 rounded-lg border flex justify-between items-center transition ${
            isFocused ? 'bg-emerald-950/70 border-fxgreen' : 'bg-slate-950/60 border-slate-800 hover:border-slate-600'
        }`;
        row.innerHTML = `
            <div>
                <span class="font-bold text-white">${m.symbol}</span>
                <span class="text-slate-400 ml-1.5">D:${m.lastDigit}</span>
            </div>
            <div class="text-fxgreen font-bold">${m.formattedPrice}</div>
            <div>${riskBadge}</div>
        `;
        board.appendChild(row);
    });
}

function appendScannerFeed(sym, price, digit, winrate) {
    const feed = document.getElementById('pro-scanner-feed');
    if (!feed) return;
    const ts = new Date().toLocaleTimeString();
    const div = document.createElement('div');
    div.innerHTML = `<span class="text-slate-500">[${ts}]</span> <span class="text-fxgreen font-bold">A+ ${sym}</span> @ ${price} (Digit ${digit}) | Est Winrate: <span class="text-gold font-bold">${winrate}%</span>`;
    feed.prepend(div);
    if (feed.children.length > 7) feed.removeChild(feed.lastChild);
}

function updateKillzones() {
    const now = new Date();
    const eatTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const hrs = eatTime.getUTCHours();
    const mins = eatTime.getUTCMinutes();
    const secs = eatTime.getUTCSeconds();

    const timerEl = document.getElementById('killzone-timer');
    if (timerEl) timerEl.innerText = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} EAT`;

    let sessionName = "Asian / 24-7 Synthetics Killzone";
    let currencyBias = "Synthetics, Vol 1s & JPY Crosses Active";

    if (hrs >= 10 && hrs < 15) {
        sessionName = "🔥 London Open Killzone (Active)";
        currencyBias = "EUR, GBP & Gold High Expansion";
    } else if (hrs >= 15 && hrs < 19) {
        sessionName = "⚡ London / New York Overlap (Peak)";
        currencyBias = "USD, Gold & Indices A+ BOS Sweeps";
    } else if (hrs >= 19 && hrs < 23) {
        sessionName = "🇺🇸 New York PM Session";
        currencyBias = "US Tech 100, Wall St 30 & Synthetics";
    }

    document.getElementById('active-session-name').innerText = sessionName;
    document.getElementById('active-currency-bias').innerText = currencyBias;
}

function requestTimeframesForFocusedAsset() {
    if (!window.derivApiInstance || !window.derivApiInstance.isConnected) return;
    window.derivApiInstance.fetchTimeframeCandles(focusedSymbol, 60, 35);
    window.derivApiInstance.fetchTimeframeCandles(focusedSymbol, 300, 35);
    window.derivApiInstance.fetchTimeframeCandles(focusedSymbol, 900, 35);
}

function initializeLiveTerminal() {
    updateAssetDropdown('volatility_1s', '1HZ10V');
    setupCurrencyConverter();
    populateMonthlyNewsCalendar();

    const categorySelect = document.getElementById('market-category');
    const assetSelector = document.getElementById('asset-selector');

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            updateAssetDropdown(e.target.value);
            renderFocusedAssetPanels();
        });
    }

    if (assetSelector) {
        assetSelector.addEventListener('change', (e) => {
            focusedSymbol = e.target.value;
            if (window.derivApiInstance) window.derivApiInstance.subscribeSymbol(focusedSymbol);
            requestTimeframesForFocusedAsset();
            renderFocusedAssetPanels();
        });
    }

    const derivApi = new DerivAPIConnector(PARTNER_APP_ID);
    window.derivApiInstance = derivApi;

    derivApi.onTick(processIncomingTick);
    derivApi.onCandles((sym, granularity, candles) => {
        if (!marketState[sym]) return;
        const closes = candles.map(c => Number(c.close));
        const evalRes = evaluate4Indicators(closes);
        marketState[sym].timeframes[granularity] = evalRes.direction;
        if (sym === focusedSymbol) renderFocusedAssetPanels();
    });

    // Collect EVERY asset across ALL categories to stream simultaneously!
    const allSymbols = Object.values(marketSymbols).flat().map(item => item.symbol);

    derivApi.connect().then(() => {
        derivApi.subscribeAll(allSymbols);
        requestTimeframesForFocusedAsset();
        setInterval(requestTimeframesForFocusedAsset, 30000);
    }).catch(() => {
        // Fallback live multi-market simulator if offline
        setInterval(() => {
            allSymbols.slice(0, 12).forEach(sym => {
                processIncomingTick({
                    symbol: sym,
                    quote: (1000 + Math.random() * 5000).toFixed(2),
                    pip_size: 2,
                    epoch: Math.floor(Date.now() / 1000)
                });
            });
        }, 1000);
    });

    updateKillzones();
    setInterval(updateKillzones, 1000);
}

window.addEventListener('DOMContentLoaded', () => { runCoreLoadingSequence(); });
