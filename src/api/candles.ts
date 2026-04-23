import twelvedata from './finnhub'
import type { TwelveDataTimeSeries, PriceCandle, ChartRange } from '@/types'
import { getRangeParams, transformCandles, dedupeCandles } from '@/lib/chartUtils'

export async function fetchCandles(
  symbol: string,
  range: ChartRange
): Promise<PriceCandle[]> {
  const { interval, outputsize } = getRangeParams(range)
  const { data } = await twelvedata.get<TwelveDataTimeSeries>('/time_series', {
    params: { symbol, interval, outputsize },
  })
  return dedupeCandles(transformCandles(data))
}
