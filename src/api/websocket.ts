type TradeCallback = (symbol: string, price: number, timestamp: number) => void

export class TwelveDataWebSocket {
  private ws: WebSocket | null = null
  private apiKey: string
  private subscribedSymbols = new Set<string>()
  private onTrade: TradeCallback
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private shouldReconnect = true

  constructor(apiKey: string, onTrade: TradeCallback) {
    this.apiKey = apiKey
    this.onTrade = onTrade
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?apikey=${this.apiKey}`)

    this.ws.addEventListener('open', () => {
      this.subscribedSymbols.forEach((symbol) => this.sendSubscribe(symbol))
    })

    this.ws.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data as string)
        if (msg.event === 'price') {
          this.onTrade(msg.symbol, parseFloat(msg.price), msg.timestamp)
        }
      } catch { /* ignore malformed messages */ }
    })

    this.ws.addEventListener('close', () => {
      if (this.shouldReconnect) {
        this.reconnectTimeout = setTimeout(() => this.connect(), 3000)
      }
    })

    this.ws.addEventListener('error', () => {
      this.ws?.close()
    })
  }

  subscribe(symbol: string) {
    this.subscribedSymbols.add(symbol)
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendSubscribe(symbol)
    }
  }

  unsubscribe(symbol: string) {
    this.subscribedSymbols.delete(symbol)
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: 'unsubscribe', params: { symbols: symbol } }))
    }
  }

  disconnect() {
    this.shouldReconnect = false
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)
    this.ws?.close()
    this.ws = null
  }

  private sendSubscribe(symbol: string) {
    this.ws?.send(JSON.stringify({ action: 'subscribe', params: { symbols: symbol } }))
  }
}
