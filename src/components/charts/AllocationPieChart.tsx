import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { PortfolioHolding } from '@/types'
import { formatCurrency } from '@/lib/formatters'

const COLORS = ['#38bdf8', '#34d399', '#a78bfa', '#fb923c', '#f472b6', '#facc15', '#60a5fa', '#4ade80']

interface AllocationPieChartProps {
  holdings: PortfolioHolding[]
  prices: Record<string, number>
}

export function AllocationPieChart({ holdings, prices }: AllocationPieChartProps) {
  const data = holdings
    .map((h) => ({
      name: h.symbol,
      value: h.shares * (prices[h.symbol] ?? 0),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)

  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9', fontSize: 12 }}
          formatter={(value: number) => [formatCurrency(value), 'Value']}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
