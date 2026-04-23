export interface TwelveDataQuote {
  close: number
  change: number
  percent_change: number
  high: number
  low: number
  open: number
  previous_close: number
  datetime: string
  symbol: string
}

export interface TwelveDataSearchResult {
  count: number
  status: string
  data: {
    symbol: string
    instrument_name: string
    exchange: string
    instrument_type: string
    country: string
    currency: string
  }[]
}

export interface StockProfile {
  symbol: string
  name: string
  exchange: string
  sector: string
  industry: string
  website: string
  country: string
  currency?: string
}

export interface TwelveDataTimeSeries {
  status: string
  values: {
    datetime: string
    open: string
    high: string
    low: string
    close: string
    volume: string
  }[]
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
  interval: string
  outputsize: number
}

export interface LivePrice {
  price: number
  timestamp: number
}
