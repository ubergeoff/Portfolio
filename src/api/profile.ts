import twelvedata from './finnhub'
import type { StockProfile } from '@/types'

export async function fetchProfile(symbol: string): Promise<StockProfile> {
  const { data } = await twelvedata.get<StockProfile>('/profile', { params: { symbol } })
  return data
}
