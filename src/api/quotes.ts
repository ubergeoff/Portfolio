import finnhub from './finnhub'
import type { FinnhubQuote } from '@/types'

export async function fetchQuote(symbol: string): Promise<FinnhubQuote> {
  const { data } = await finnhub.get<FinnhubQuote>('/quote', { params: { symbol } })
  return data
}

export async function fetchMultipleQuotes(
  symbols: string[]
): Promise<Record<string, FinnhubQuote>> {
  const results = await Promise.allSettled(symbols.map((s) => fetchQuote(s)))
  const map: Record<string, FinnhubQuote> = {}
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') map[symbols[i]] = result.value
  })
  return map
}
