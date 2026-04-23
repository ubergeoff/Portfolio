import { Link } from 'react-router-dom'
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency, formatPct } from '@/lib/formatters'
import type { PortfolioHolding } from '@/types'
import { cn } from '@/lib/cn'

interface HoldingRowProps {
  holding: PortfolioHolding
  currentPrice?: number
  onRemove: () => void
}

export function HoldingRow({ holding, currentPrice = 0, onRemove }: HoldingRowProps) {
  const currentValue = holding.shares * currentPrice
  const costBasis = holding.shares * holding.avgCostBasis
  const gainLoss = currentValue - costBasis
  const gainLossPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0
  const isPositive = gainLoss >= 0

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 rounded-lg transition-colors group">
      <Link to={`/stock/${holding.symbol}`} className="w-24 flex-shrink-0">
        <p className="text-slate-100 font-semibold text-sm">{holding.symbol}</p>
        <p className="text-slate-500 text-xs truncate">{holding.name}</p>
      </Link>

      <div className="flex-1 grid grid-cols-4 gap-2 text-sm tabular-nums">
        <div className="text-right">
          <p className="text-slate-400 text-xs mb-0.5">Shares</p>
          <p className="text-slate-200">{holding.shares}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs mb-0.5">Avg Cost</p>
          <p className="text-slate-200">{formatCurrency(holding.avgCostBasis)}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs mb-0.5">Cur. Price</p>
          <p className="text-slate-200">{currentPrice ? formatCurrency(currentPrice) : '—'}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs mb-0.5">P&amp;L</p>
          <div className={cn('flex items-center gap-1 justify-end', isPositive ? 'text-emerald-400' : 'text-rose-400')}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{formatPct(gainLossPct)}</span>
          </div>
          <p className={cn('text-xs', isPositive ? 'text-emerald-500/70' : 'text-rose-500/70')}>
            {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
          </p>
        </div>
      </div>

      <div className="text-right w-24 flex-shrink-0 hidden md:block">
        <p className="text-slate-400 text-xs mb-0.5">Total Value</p>
        <p className="text-slate-100 font-medium">{currentPrice ? formatCurrency(currentValue) : '—'}</p>
      </div>

      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-rose-400 flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
