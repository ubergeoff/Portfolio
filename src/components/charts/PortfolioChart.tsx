import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { PortfolioValueSnapshot } from '@/types'
import { formatCurrency, formatShortDate } from '@/lib/formatters'
import { EmptyState } from '@/components/ui/EmptyState'
import { TrendingUp } from 'lucide-react'

interface PortfolioChartProps {
  history: PortfolioValueSnapshot[]
}

export function PortfolioChart({ history }: PortfolioChartProps) {
  if (history.length < 2) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No history yet"
        description="Portfolio value history will appear here as you track your holdings over time."
        className="h-48"
      />
    )
  }

  const data = history.map((s) => ({
    date: formatShortDate(s.timestamp),
    value: s.totalValue,
    cost: s.totalCost,
  }))

  const isUp = history[history.length - 1].totalValue >= history[0].totalValue

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={isUp ? '#34d399' : '#f87171'} stopOpacity={0.3} />
            <stop offset="95%" stopColor={isUp ? '#34d399' : '#f87171'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(51,65,85,0.5)" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={{ stroke: '#334155' }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          width={50}
        />
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
          formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
          labelStyle={{ color: '#94a3b8', marginBottom: 4 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={isUp ? '#34d399' : '#f87171'}
          strokeWidth={2}
          fill="url(#portfolioGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
