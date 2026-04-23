import { useState } from 'react'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { useLivePrices } from '@/hooks/useLivePrices'
import { useQueries } from '@tanstack/react-query'
import { fetchQuote } from '@/api/quotes'
import { queryKeys } from '@/constants/queryKeys'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { StockCard } from '@/components/stock/StockCard'
import { StockRow } from '@/components/stock/StockRow'
import { EmptyState } from '@/components/ui/EmptyState'
import { Star, LayoutGrid, List, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import toast from 'react-hot-toast'

export function WatchlistPage() {
  const { stocks, isWatchlisted, addStock, removeStock } = useWatchlistStore()
  const apiKey = usePreferencesStore((s) => s.apiKey)
  const [view, setView] = useState<'grid' | 'list'>('list')
  const livePrices = useLivePrices(stocks.map((s) => s.symbol))

  const quoteQueries = useQueries({
    queries: stocks.map((stock) => ({
      queryKey: queryKeys.quote(stock.symbol),
      queryFn: () => fetchQuote(stock.symbol),
      enabled: !!apiKey,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    })),
  })

  const quotesMap: Record<string, import('@/types').FinnhubQuote> = {}
  stocks.forEach((stock, i) => {
    const data = quoteQueries[i]?.data
    if (data) quotesMap[stock.symbol] = data
  })

  const isRefreshing = quoteQueries.some((q) => q.isFetching)

  const handleRefresh = () => {
    quoteQueries.forEach((q) => q.refetch())
    toast.success('Refreshing prices…')
  }

  if (stocks.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="Your watchlist is empty"
        description="Search for stocks and add them to your watchlist to start tracking prices."
        action={
          <Link to="/search">
            <Button>Search stocks</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">
          {stocks.length} stock{stocks.length !== 1 ? 's' : ''} tracked
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </button>
          <div className="flex bg-slate-800/60 border border-slate-700/50 rounded-lg p-0.5 gap-0.5">
            {(['list', 'grid'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  view === v ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                )}
              >
                {v === 'list' ? <List className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stocks.map((stock) => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              quote={quotesMap[stock.symbol]}
              livePrice={livePrices[stock.symbol]}
              isWatchlisted={isWatchlisted(stock.symbol)}
              onToggleWatchlist={() =>
                isWatchlisted(stock.symbol) ? removeStock(stock.symbol) : addStock(stock)
              }
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2.5 border-b border-slate-800/60 text-slate-500 text-xs uppercase tracking-wider">
            <span>Stock</span>
            <span className="text-right w-24">Price</span>
            <span className="text-right w-20">Exchange</span>
            <span className="w-4" />
          </div>
          {stocks.map((stock) => (
            <StockRow
              key={stock.symbol}
              stock={stock}
              quote={quotesMap[stock.symbol]}
              livePrice={livePrices[stock.symbol]}
              onRemove={() => { removeStock(stock.symbol); toast.success(`Removed ${stock.symbol}`) }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
