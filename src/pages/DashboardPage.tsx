import { useWatchlistStore } from '@/stores/watchlistStore'
import { usePortfolioStore, computePortfolioTotals } from '@/stores/portfolioStore'
import { useLivePrices } from '@/hooks/useLivePrices'
import { useQueries } from '@tanstack/react-query'
import { fetchQuote } from '@/api/quotes'
import { queryKeys } from '@/constants/queryKeys'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { StockCard } from '@/components/stock/StockCard'
import { PortfolioSummaryCards } from '@/components/portfolio/PortfolioSummaryCards'
import { EmptyState } from '@/components/ui/EmptyState'
import { Star, Briefcase } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function DashboardPage() {
  const watchlist = useWatchlistStore((s) => s.stocks)
  const { isWatchlisted, addStock, removeStock } = useWatchlistStore()
  const holdings = usePortfolioStore((s) => s.holdings)
  const apiKey = usePreferencesStore((s) => s.apiKey)

  const allSymbols = [
    ...new Set([...watchlist.map((s) => s.symbol), ...holdings.map((h) => h.symbol)]),
  ]
  const livePrices = useLivePrices(allSymbols)

  const quoteQueries = useQueries({
    queries: watchlist.map((stock) => ({
      queryKey: queryKeys.quote(stock.symbol),
      queryFn: () => fetchQuote(stock.symbol),
      enabled: !!apiKey,
      staleTime: 60 * 1000,
    })),
  })

  const quotesMap: Record<string, import('@/types').TwelveDataQuote> = {}
  watchlist.forEach((stock, i) => {
    const data = quoteQueries[i]?.data
    if (data) quotesMap[stock.symbol] = data
  })

  const pricesMap: Record<string, number> = {}
  allSymbols.forEach((sym) => {
    pricesMap[sym] = livePrices[sym] ?? quotesMap[sym]?.close ?? 0
  })

  const totals = computePortfolioTotals(holdings, pricesMap)

  return (
    <div className="space-y-6 max-w-6xl">
      {holdings.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-300 font-medium text-sm">Portfolio Overview</h2>
            <Link to="/portfolio" className="text-sky-400 text-xs hover:text-sky-300 transition-colors">
              View full portfolio →
            </Link>
          </div>
          <PortfolioSummaryCards {...totals} />
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-slate-300 font-medium text-sm">
            Watchlist {watchlist.length > 0 && <span className="text-slate-600 ml-1">({watchlist.length})</span>}
          </h2>
          <Link to="/watchlist" className="text-sky-400 text-xs hover:text-sky-300 transition-colors">
            Manage watchlist →
          </Link>
        </div>

        {watchlist.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Your watchlist is empty"
            description="Search for stocks and add them to your watchlist to track them here."
            action={
              <Link to="/search">
                <Button size="sm">Search stocks</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {watchlist.map((stock) => (
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
        )}
      </section>

      {holdings.length === 0 && watchlist.length > 0 && (
        <section className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-5 h-5 text-sky-400" />
            <h3 className="text-slate-200 font-medium">Start tracking your portfolio</h3>
          </div>
          <p className="text-slate-500 text-sm mb-4">
            Add your share holdings to track their value and performance over time.
          </p>
          <Link to="/portfolio">
            <Button size="sm">Add holdings</Button>
          </Link>
        </section>
      )}
    </div>
  )
}
