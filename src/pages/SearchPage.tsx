import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchResultItem } from '@/components/search/SearchResultItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useSearch } from '@/hooks/useSearch'
import { Search, X } from 'lucide-react'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350)
    return () => clearTimeout(timer)
  }, [query])

  const { data, isLoading } = useSearch(debouncedQuery)

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <p className="text-slate-400 text-sm mb-3">Search stocks and companies to add to your watchlist or portfolio</p>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ticker or company name…"
            autoFocus
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && debouncedQuery && data && (
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
          {data.data.length > 0 ? (
            <>
              <div className="px-4 py-2.5 border-b border-slate-800/60">
                <p className="text-slate-500 text-xs">
                  {data.count} result{data.count !== 1 ? 's' : ''} for &quot;{debouncedQuery}&quot;
                </p>
              </div>
              <div className="p-1">
                {data.data.map((r) => (
                  <SearchResultItem
                    key={r.symbol}
                    symbol={r.symbol}
                    description={r.instrument_name}
                    type={r.instrument_type}
                    displaySymbol={r.symbol}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No results found"
              description={`No stocks matched "${debouncedQuery}". Try a different ticker or company name.`}
            />
          )}
        </div>
      )}

      {!debouncedQuery && (
        <EmptyState
          icon={Search}
          title="Search for stocks"
          description="Enter a ticker symbol (e.g. AAPL) or company name to find stocks."
        />
      )}
    </div>
  )
}
