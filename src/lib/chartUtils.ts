import { format, fromUnixTime, subDays, subMonths, subYears, startOfDay } from 'date-fns'
import type { FinnhubCandleResponse, PriceCandle, ChartRange } from '@/types'
import { CHART_RANGES } from '@/constants/ranges'

export function getRangeTimestamps(range: ChartRange): { from: number; to: number; resolution: string } {
  const config = CHART_RANGES.find(r => r.label === range)!
  const to = Math.floor(Date.now() / 1000)
  let fromDate: Date
  const now = new Date()

  switch (range) {
    case '1D': fromDate = subDays(startOfDay(now), 1); break
    case '1W': fromDate = subDays(now, 7); break
    case '1M': fromDate = subMonths(now, 1); break
    case '3M': fromDate = subMonths(now, 3); break
    case '1Y': fromDate = subYears(now, 1); break
    default:   fromDate = subMonths(now, 1)
  }

  return { from: Math.floor(fromDate.getTime() / 1000), to, resolution: config.resolution }
}

export function transformCandles(response: FinnhubCandleResponse): PriceCandle[] {
  if (response.s !== 'ok' || !response.t?.length) return []

  return response.t.map((timestamp, i) => ({
    time: format(fromUnixTime(timestamp), 'yyyy-MM-dd'),
    open: response.o[i],
    high: response.h[i],
    low: response.l[i],
    close: response.c[i],
    volume: response.v[i],
  }))
}

export function dedupeCandles(candles: PriceCandle[]): PriceCandle[] {
  const seen = new Set<string>()
  return candles.filter(c => {
    if (seen.has(c.time)) return false
    seen.add(c.time)
    return true
  })
}
