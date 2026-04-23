import finnhub from './finnhub'
import type { FinnhubSearchResult } from '@/types'

export async function searchSymbols(query: string): Promise<FinnhubSearchResult> {
  const { data } = await finnhub.get<FinnhubSearchResult>('/search', { params: { q: query } })
  return data
}
