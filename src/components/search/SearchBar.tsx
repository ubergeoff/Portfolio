import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '@/hooks/useSearch'
import { SearchResultItem } from './SearchResultItem'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/cn'

interface SearchBarProps {
  autoFocus?: boolean
  inline?: boolean
}

export function SearchBar({ autoFocus, inline }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const { data, isLoading } = useSearch(debouncedQuery)
  const results = data?.result?.slice(0, 8) ?? []

  const handleFocus = () => setIsOpen(true)

  const handleViewAll = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('relative', inline ? 'w-full' : 'w-72')}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={handleFocus}
          placeholder={inline ? 'Search stocks, companies…' : 'Search… ⌘K'}
          autoFocus={autoFocus}
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-9 pr-8 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setDebouncedQuery('') }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isOpen && query.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 bg-slate-900 border border-slate-700/50 rounded-xl shadow-xl z-50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <LoadingSpinner size="sm" />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-1">
                {results.map((r) => (
                  <SearchResultItem
                    key={r.symbol}
                    symbol={r.symbol}
                    description={r.description}
                    type={r.type}
                    displaySymbol={r.displaySymbol}
                  />
                ))}
              </div>
              {(data?.count ?? 0) > 8 && (
                <div className="border-t border-slate-700/50 px-4 py-2">
                  <button
                    onClick={handleViewAll}
                    className="text-sky-400 text-xs hover:text-sky-300 transition-colors"
                  >
                    View all {data?.count} results →
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-500 text-sm text-center py-6">No results for "{query}"</p>
          )}
        </div>
      )}
    </div>
  )
}
