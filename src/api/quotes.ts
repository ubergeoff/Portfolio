import twelvedata from './finnhub'
import type { TwelveDataQuote } from '@/types'

interface RawQuote {
  close: string; change: string; percent_change: string
  high: string; low: string; open: string; previous_close: string
  datetime: string; symbol: string
}

function parseQuote(raw: RawQuote): TwelveDataQuote {
  return {
    close: parseFloat(raw.close),
    change: parseFloat(raw.change),
    percent_change: parseFloat(raw.percent_change),
    high: parseFloat(raw.high),
    low: parseFloat(raw.low),
    open: parseFloat(raw.open),
    previous_close: parseFloat(raw.previous_close),
    datetime: raw.datetime,
    symbol: raw.symbol,
  }
}

export async function fetchQuote(symbol: string): Promise<TwelveDataQuote> {
  const { data } = await twelvedata.get<RawQuote>('/quote', { params: { symbol } })
  return parseQuote(data)
}

export async function fetchMultipleQuotes(
  symbols: string[]
): Promise<Record<string, TwelveDataQuote>> {
  const results = await Promise.allSettled(symbols.map((s) => fetchQuote(s)))
  const map: Record<string, TwelveDataQuote> = {}
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') map[symbols[i]] = result.value
  })
  return map
}
