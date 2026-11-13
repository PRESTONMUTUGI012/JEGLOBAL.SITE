class DerivAPIConnector {
    constructor(appId) {
        this.appId = appId;
        this.ws = null;
        this.isConnected = false;
        this.activeSubscriptions = new Set();
        this.tickListeners = [];
        this.candleListeners = [];
        this.lastEpochs = {};
        this.pingInterval = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            const endpoint = `wss://ws.derivws.com/websockets/v3?app_id=${this.appId}`;
            this.ws = new WebSocket(endpoint);

            this.ws.onopen = () => {
                this.isConnected = true;
                this.startHeartbeat();
                // Re-subscribe any previously tracked symbols upon reconnect
                const existing = Array.from(this.activeSubscriptions);
                this.activeSubscriptions.clear();
                existing.forEach(sym => this.subscribeSymbol(sym));
                resolve(true);
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.msg_type === 'tick' && data.tick) {
                        const sym = data.tick.symbol;
                        const epoch = data.tick.epoch;
                        const quote = Number(data.tick.quote);

                        if (isNaN(quote) || quote <= 0) return;
                        if (this.lastEpochs[sym] && epoch <= this.lastEpochs[sym]) return;
                        this.lastEpochs[sym] = epoch;

                        this.tickListeners.forEach(cb => cb(data.tick));
                    } else if (data.msg_type === 'candles' && data.candles) {
                        const sym = data.echo_req.ticks_history;
                        const granularity = data.echo_req.granularity;
                        this.candleListeners.forEach(cb => cb(sym, granularity, data.candles));
                    }
                } catch (e) {
                    console.error("Stream parse error:", e);
                }
            };

            this.ws.onerror = (err) => reject(err);

            this.ws.onclose = () => {
                this.isConnected = false;
                clearInterval(this.pingInterval);
                setTimeout(() => this.connect(), 2000);
            };
        });
    }

    startHeartbeat() {
        clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
            if (this.ws && this.isConnected) {
                this.ws.send(JSON.stringify({ ping: 1 }));
            }
        }, 25000);
    }

    onTick(callback) {
        this.tickListeners.push(callback);
    }

    onCandles(callback) {
        this.candleListeners.push(callback);
    }

    // Subscribes WITHOUT cancelling other active market streams!
    subscribeSymbol(symbol) {
        if (!symbol || this.activeSubscriptions.has(symbol)) return;
        this.activeSubscriptions.add(symbol);
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
        }
    }

    subscribeAll(symbolsList) {
        symbolsList.forEach((sym, idx) => {
            setTimeout(() => this.subscribeSymbol(sym), idx * 60);
        });
    }

    fetchTimeframeCandles(symbol, granularity, count = 40) {
        if (this.ws && this.isConnected) {
            this.ws.send(JSON.stringify({
                ticks_history: symbol,
                adjust_start_time: 1,
                count: count,
                end: 'latest',
                style: 'candles',
                granularity: granularity
            }));
        }
    }
}
