import { Link } from 'react-router-dom'
import { Star, StarOff } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatCurrency } from '@/lib/formatters'
import { ChangeIndicator } from './ChangeIndicator'
import { MiniSparkline } from './MiniSparkline'
import type { Stock, FinnhubQuote, PriceCandle } from '@/types'

interface StockCardProps {
  stock: Stock
  quote?: FinnhubQuote
  candles?: PriceCandle[]
  livePrice?: number
  isWatchlisted: boolean
  onToggleWatchlist: () => void
}

export function StockCard({ stock, quote, candles, livePrice, isWatchlisted, onToggleWatchlist }: StockCardProps) {
  const price = livePrice ?? quote?.c ?? 0
  const change = quote?.dp ?? 0
  const isPositive = change >= 0

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/60 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <Link to={`/stock/${stock.symbol}`} className="flex items-center gap-2.5 min-w-0">
          {stock.logo ? (
            <img src={stock.logo} alt="" className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-slate-300">{stock.symbol[0]}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-slate-100 font-semibold text-sm leading-tight truncate">{stock.symbol}</p>
            <p className="text-slate-500 text-xs truncate">{stock.name}</p>
          </div>
        </Link>
        <button
          onClick={onToggleWatchlist}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-amber-400 ml-2 flex-shrink-0"
        >
          {isWatchlisted ? <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> : <StarOff className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className={cn('text-lg font-semibold tabular-nums', livePrice ? 'text-sky-300' : 'text-slate-100')}>
            {formatCurrency(price)}
          </p>
          <ChangeIndicator value={change} />
        </div>
        {candles && <MiniSparkline candles={candles} positive={isPositive} />}
      </div>
    </div>
  )
}
