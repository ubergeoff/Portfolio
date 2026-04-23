import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { ChangeIndicator } from './ChangeIndicator'
import type { Stock, FinnhubQuote } from '@/types'

interface StockRowProps {
  stock: Stock
  quote?: FinnhubQuote
  livePrice?: number
  onRemove?: () => void
}

export function StockRow({ stock, quote, livePrice, onRemove }: StockRowProps) {
  const price = livePrice ?? quote?.c ?? 0
  const change = quote?.d ?? 0
  const changePct = quote?.dp ?? 0

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/40 rounded-lg transition-colors group">
      <Link to={`/stock/${stock.symbol}`} className="flex items-center gap-3 flex-1 min-w-0">
        {stock.logo ? (
          <img src={stock.logo} alt="" className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-slate-300">{stock.symbol[0]}</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-slate-100 font-medium text-sm">{stock.symbol}</p>
          <p className="text-slate-500 text-xs truncate">{stock.name}</p>
        </div>
      </Link>

      <div className="text-right">
        <p className="text-slate-100 font-medium tabular-nums text-sm">{formatCurrency(price)}</p>
        <div className="flex items-center gap-1 justify-end">
          <span className={changePct >= 0 ? 'text-emerald-400 text-xs tabular-nums' : 'text-rose-400 text-xs tabular-nums'}>
            {change >= 0 ? '+' : ''}{formatCurrency(change)}
          </span>
          <ChangeIndicator value={changePct} showIcon={false} className="text-xs" />
        </div>
      </div>

      <div className="text-slate-500 text-xs text-right w-20 hidden sm:block truncate">{stock.exchange}</div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-rose-400 ml-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
