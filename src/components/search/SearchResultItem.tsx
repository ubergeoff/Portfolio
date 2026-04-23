import { Star, StarOff, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWatchlistStore } from '@/stores/watchlistStore'
import toast from 'react-hot-toast'

interface SearchResultItemProps {
  symbol: string
  description: string
  type: string
  displaySymbol: string
}

export function SearchResultItem({ symbol, description, type, displaySymbol }: SearchResultItemProps) {
  const navigate = useNavigate()
  const { isWatchlisted, addStock, removeStock } = useWatchlistStore()
  const watchlisted = isWatchlisted(symbol)

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (watchlisted) {
      removeStock(symbol)
      toast.success(`Removed ${symbol} from watchlist`)
    } else {
      addStock({
        symbol,
        name: description,
        logo: '',
        exchange: '',
        industry: '',
        currency: 'USD',
        addedAt: Date.now(),
      })
      toast.success(`Added ${symbol} to watchlist`)
    }
  }

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/60 cursor-pointer rounded-lg transition-colors group"
      onClick={() => navigate(`/stock/${symbol}`)}
    >
      <div className="w-9 h-9 rounded-lg bg-slate-700/70 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-slate-300">{symbol[0]}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-slate-100 font-medium text-sm">{displaySymbol}</p>
        <p className="text-slate-500 text-xs truncate">{description}</p>
      </div>
      <span className="text-slate-600 text-xs bg-slate-700/50 px-2 py-0.5 rounded-md hidden sm:block">{type}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleToggleWatchlist}
          className={`p-1.5 rounded-lg transition-colors ${watchlisted ? 'text-amber-400 hover:bg-amber-400/10' : 'text-slate-500 hover:text-amber-400 hover:bg-slate-700'}`}
          title={watchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {watchlisted ? <Star className="w-4 h-4 fill-amber-400" /> : <StarOff className="w-4 h-4" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/stock/${symbol}`) }}
          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-sky-400/10 transition-colors"
          title="View details"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
