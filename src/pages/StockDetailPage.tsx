import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star, StarOff, Plus, ExternalLink, Building2, Globe } from 'lucide-react'
import { useStockQuote } from '@/hooks/useStockQuote'
import { useStockProfile } from '@/hooks/useStockProfile'
import { useStockCandles } from '@/hooks/useStockCandles'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { useWatchlistStore } from '@/stores/watchlistStore'
import { PriceChart } from '@/components/charts/PriceChart'
import { RangeSelector } from '@/components/ui/RangeSelector'
import { ChangeIndicator } from '@/components/stock/ChangeIndicator'
import { AddHoldingModal } from '@/components/portfolio/AddHoldingModal'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { formatCurrency, formatLargeNumber, formatCurrency as fc } from '@/lib/formatters'
import type { ChartRange } from '@/types'
import toast from 'react-hot-toast'

export function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>()
  const defaultRange = usePreferencesStore((s) => s.defaultChartRange)
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol)
  const { data: profile, isLoading: profileLoading } = useStockProfile(symbol)
  const { data: candles, isLoading: candlesLoading, error: candlesError, refetch: refetchCandles } = useStockCandles(symbol, range)

  const { isWatchlisted, addStock, removeStock } = useWatchlistStore()
  const watchlisted = isWatchlisted(symbol ?? '')

  const handleToggleWatchlist = () => {
    if (!symbol) return
    if (watchlisted) {
      removeStock(symbol)
      toast.success(`Removed ${symbol} from watchlist`)
    } else {
      addStock({
        symbol,
        name: profile?.name ?? symbol,
        logo: '',
        exchange: profile?.exchange ?? '',
        industry: profile?.industry ?? '',
        currency: profile?.currency ?? 'USD',
        addedAt: Date.now(),
      })
      toast.success(`Added ${symbol} to watchlist`)
    }
  }

  if (quoteLoading || profileLoading) return <PageLoader />

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        {profile?.logo ? (
          <img src={profile.logo} alt="" className="w-12 h-12 rounded-xl bg-white p-1 object-contain flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-slate-300">{symbol?.[0]}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-slate-100 text-2xl font-bold">{symbol}</h1>
            {profile?.exchange && (
              <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-md">{profile.exchange}</span>
            )}
          </div>
          <p className="text-slate-400 text-sm">{profile?.name}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleToggleWatchlist}
            className={`p-2 rounded-lg border transition-colors ${watchlisted ? 'border-amber-400/30 text-amber-400 bg-amber-400/10' : 'border-slate-700/50 text-slate-400 hover:text-amber-400 hover:border-amber-400/30 bg-slate-800/60'}`}
          >
            {watchlisted ? <Star className="w-4 h-4 fill-amber-400" /> : <StarOff className="w-4 h-4" />}
          </button>
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Add to Portfolio
          </Button>
        </div>
      </div>

      {/* Price */}
      {quote && (
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-slate-100 tabular-nums">{formatCurrency(quote.close)}</span>
          <div>
            <ChangeIndicator value={quote.percent_change} className="text-base" />
            <p className="text-slate-500 text-xs">{quote.change >= 0 ? '+' : ''}{formatCurrency(quote.change)} today</p>
          </div>
        </div>
      )}

      {/* Key stats */}
      {quote && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { label: 'Open', value: fc(quote.open) },
            { label: 'High', value: fc(quote.high) },
            { label: 'Low', value: fc(quote.low) },
            { label: 'Prev Close', value: fc(quote.previous_close) },
            { label: 'Mkt Cap', value: '—' },
            { label: 'Currency', value: profile?.currency ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-800/60 border border-slate-700/40 rounded-lg px-3 py-2">
              <p className="text-slate-500 text-xs mb-0.5">{label}</p>
              <p className="text-slate-200 text-sm font-medium tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-300 font-medium text-sm">Price Chart</h2>
          <RangeSelector value={range} onChange={setRange} />
        </div>
        <PriceChart
          candles={candles}
          isLoading={candlesLoading}
          error={candlesError}
          onRetry={() => refetchCandles()}
          height={320}
        />
      </div>

      {/* Company info */}
      {profile && (
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <h2 className="text-slate-300 font-medium text-sm mb-3">Company Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {profile.industry && (
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-4 h-4 flex-shrink-0 text-slate-600" />
                <span>{profile.industry}</span>
              </div>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            )}
          </div>
        </div>
      )}

      {addModalOpen && (
        <AddHoldingModal symbol={symbol ?? ''} profile={profile} onClose={() => setAddModalOpen(false)} />
      )}
    </div>
  )
}
