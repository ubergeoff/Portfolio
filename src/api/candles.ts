import finnhub from './finnhub'
import type { FinnhubCandleResponse, PriceCandle, ChartRange } from '@/types'
import { getRangeTimestamps, transformCandles, dedupeCandles } from '@/lib/chartUtils'

export async function fetchCandles(
  symbol: string,
  range: ChartRange
): Promise<PriceCandle[]> {
  const { from, to, resolution } = getRangeTimestamps(range)
  const { data } = await finnhub.get<FinnhubCandleResponse>('/stock/candle', {
    params: { symbol, resolution, from, to },
  })
  return dedupeCandles(transformCandles(data))
}
