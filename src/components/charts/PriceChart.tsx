import { useEffect, useRef } from 'react'
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type CandlestickSeriesOptions,
} from 'lightweight-charts'
import type { PriceCandle } from '@/types'
import { useTheme } from '@/hooks/useTheme'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface PriceChartProps {
  candles?: PriceCandle[]
  isLoading?: boolean
  error?: Error | null
  onRetry?: () => void
  height?: number
}

const darkTheme = {
  background: '#0f172a',
  text: '#94a3b8',
  grid: 'rgba(51,65,85,0.5)',
  border: '#334155',
}

const lightTheme = {
  background: '#f8fafc',
  text: '#475569',
  grid: 'rgba(203,213,225,0.5)',
  border: '#cbd5e1',
}

export function PriceChart({ candles, isLoading, error, onRetry, height = 350 }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const { isDark } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    const colors = isDark ? darkTheme : lightTheme
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: colors.border },
      timeScale: { borderColor: colors.border, timeVisible: false },
    })

    const series = chart.addCandlestickSeries({
      upColor: '#34d399',
      downColor: '#f87171',
      borderUpColor: '#34d399',
      borderDownColor: '#f87171',
      wickUpColor: '#34d399',
      wickDownColor: '#f87171',
    } as Partial<CandlestickSeriesOptions>)

    chartRef.current = chart
    seriesRef.current = series

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth })
      }
    }
    const observer = new ResizeObserver(handleResize)
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [height]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!chartRef.current) return
    const colors = isDark ? darkTheme : lightTheme
    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: colors.background },
        textColor: colors.text,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      rightPriceScale: { borderColor: colors.border },
      timeScale: { borderColor: colors.border },
    })
  }, [isDark])

  useEffect(() => {
    if (!seriesRef.current || !candles?.length) return
    seriesRef.current.setData(
      candles.map((c) => ({ time: c.time as `${number}-${number}-${number}`, open: c.open, high: c.high, low: c.low, close: c.close }))
    )
    chartRef.current?.timeScale().fitContent()
  }, [candles])

  if (isLoading) return <PageLoader />
  if (error) return <ErrorMessage message="Failed to load chart data" onRetry={onRetry} />

  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden" style={{ height }} />
}
