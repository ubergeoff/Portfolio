import finnhub from './finnhub'
import type { StockProfile } from '@/types'

export async function fetchProfile(symbol: string): Promise<StockProfile> {
  const { data } = await finnhub.get<StockProfile>('/stock/profile2', { params: { symbol } })
  return data
}
