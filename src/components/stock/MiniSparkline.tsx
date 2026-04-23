import { LineChart, Line, ResponsiveContainer } from 'recharts'
import type { PriceCandle } from '@/types'

interface MiniSparklineProps {
  candles: PriceCandle[]
  positive?: boolean
}

export function MiniSparkline({ candles, positive }: MiniSparklineProps) {
  if (!candles.length) return <div className="w-20 h-8 bg-slate-700/30 rounded animate-pulse" />

  const data = candles.slice(-14).map((c) => ({ v: c.close }))

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={positive ? '#34d399' : '#f87171'}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
