import { TrendingUp, DollarSign, BarChart2, Percent } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { formatCurrency, formatPct } from '@/lib/formatters'

interface PortfolioSummaryCardsProps {
  totalValue: number
  totalCost: number
  gainLoss: number
  gainLossPct: number
}

export function PortfolioSummaryCards({ totalValue, totalCost, gainLoss, gainLossPct }: PortfolioSummaryCardsProps) {
  const isPositive = gainLoss >= 0
  const trend = gainLoss > 0 ? 'up' : gainLoss < 0 ? 'down' : 'neutral'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Portfolio Value"
        value={formatCurrency(totalValue)}
        icon={DollarSign}
      />
      <StatCard
        label="Total Cost"
        value={formatCurrency(totalCost)}
        icon={BarChart2}
      />
      <StatCard
        label="Total Gain / Loss"
        value={formatCurrency(Math.abs(gainLoss))}
        subValue={gainLoss >= 0 ? `+${formatCurrency(gainLoss)}` : formatCurrency(gainLoss)}
        icon={TrendingUp}
        trend={trend}
      />
      <StatCard
        label="Return"
        value={formatPct(gainLossPct)}
        subValue={isPositive ? 'Profit' : 'Loss'}
        icon={Percent}
        trend={trend}
      />
    </div>
  )
}
