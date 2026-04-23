export interface FinnhubQuote {
  c: number   // current price
  d: number   // change
  dp: number  // percent change
  h: number   // day high
  l: number   // day low
  o: number   // open
  pc: number  // previous close
  t: number   // timestamp
}

export interface FinnhubSearchResult {
  count: number
  result: {
    description: string
    displaySymbol: string
    symbol: string
    type: string
  }[]
}

export interface StockProfile {
  country: string
  currency: string
  exchange: string
  ipo: string
  logo: string
  marketCapitalization: number
  name: string
  phone: string
  shareOutstanding: number
  ticker: string
  weburl: string
  finnhubIndustry: string
}

export interface FinnhubCandleResponse {
  c: number[]
  h: number[]
  l: number[]
  o: number[]
  s: string
  t: number[]
  v: number[]
}

export interface PriceCandle {
  time: string  // 'YYYY-MM-DD' for lightweight-charts
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Stock {
  symbol: string
  name: string
  logo: string
  exchange: string
  industry: string
  currency: string
  addedAt: number
}

export interface PortfolioHolding {
  symbol: string
  name: string
  shares: number
  avgCostBasis: number
  purchasedAt: number
  notes?: string
}

export interface PortfolioValueSnapshot {
  timestamp: number
  totalValue: number
  totalCost: number
  gainLoss: number
  gainLossPct: number
}

export interface UserPreferences {
  apiKey: string
  theme: 'dark' | 'light'
  defaultChartRange: ChartRange
  refreshIntervalSecs: number
}

export type ChartRange = '1D' | '1W' | '1M' | '3M' | '1Y'

export interface RangeConfig {
  label: ChartRange
  resolution: string
  days: number
}

export interface LivePrice {
  price: number
  timestamp: number
}
