import twelvedata from './finnhub'
import type { TwelveDataSearchResult } from '@/types'

export async function searchSymbols(query: string): Promise<TwelveDataSearchResult> {
  const { data } = await twelvedata.get<TwelveDataSearchResult>('/symbol_search', {
    params: { symbol: query },
  })
  return data
}
