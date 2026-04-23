import type { TwelveDataTimeSeries, PriceCandle, ChartRange } from '@/types'
import { CHART_RANGES } from '@/constants/ranges'

export function getRangeParams(range: ChartRange): { interval: string; outputsize: number } {
  const config = CHART_RANGES.find(r => r.label === range)!
  return { interval: config.interval, outputsize: config.outputsize }
}

export function transformCandles(response: TwelveDataTimeSeries): PriceCandle[] {
  if (response.status !== 'ok' || !response.values?.length) return []

  return [...response.values].reverse().map((v) => ({
    time: v.datetime.split(' ')[0],
    open: parseFloat(v.open),
    high: parseFloat(v.high),
    low: parseFloat(v.low),
    close: parseFloat(v.close),
    volume: parseFloat(v.volume),
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
