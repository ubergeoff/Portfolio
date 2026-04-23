type TradeCallback = (symbol: string, price: number, timestamp: number) => void

export class FinnhubWebSocket {
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

    this.ws = new WebSocket(`wss://ws.finnhub.io?token=${this.apiKey}`)

    this.ws.addEventListener('open', () => {
      this.subscribedSymbols.forEach((symbol) => this.sendSubscribe(symbol))
    })

    this.ws.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data as string)
        if (msg.type === 'trade' && Array.isArray(msg.data)) {
          for (const trade of msg.data) {
            this.onTrade(trade.s, trade.p, trade.t)
          }
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
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol }))
    }
  }

  disconnect() {
    this.shouldReconnect = false
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)
    this.ws?.close()
    this.ws = null
  }

  private sendSubscribe(symbol: string) {
    this.ws?.send(JSON.stringify({ type: 'subscribe', symbol }))
  }
}
