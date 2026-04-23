import { useEffect, useState } from 'react'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { usePortfolio } from '@/hooks/usePortfolio'
import { useQueries } from '@tanstack/react-query'
import { fetchQuote } from '@/api/quotes'
import { queryKeys } from '@/constants/queryKeys'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { PortfolioSummaryCards } from '@/components/portfolio/PortfolioSummaryCards'
import { HoldingRow } from '@/components/portfolio/HoldingRow'
import { AddHoldingModal } from '@/components/portfolio/AddHoldingModal'
import { PortfolioChart } from '@/components/charts/PortfolioChart'
import { AllocationPieChart } from '@/components/charts/AllocationPieChart'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { Briefcase, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export function PortfolioPage() {
  const { history, removeHolding, appendSnapshot } = usePortfolioStore()
  const apiKey = usePreferencesStore((s) => s.apiKey)
  const [addModalOpen, setAddModalOpen] = useState(false)

  const quoteQueries = useQueries({
    queries: usePortfolioStore.getState().holdings.map((h) => ({
      queryKey: queryKeys.quote(h.symbol),
      queryFn: () => fetchQuote(h.symbol),
      enabled: !!apiKey,
      staleTime: 60 * 1000,
    })),
  })

  const pricesMap: Record<string, number> = {}
  const rawHoldings = usePortfolioStore.getState().holdings
  rawHoldings.forEach((h, i) => {
    const price = quoteQueries[i]?.data?.c
    if (price) pricesMap[h.symbol] = price
  })

  const { holdings, totalValue, totalCost, gainLoss, gainLossPct } = usePortfolio(pricesMap)

  useEffect(() => {
    if (Object.keys(pricesMap).length > 0) {
      appendSnapshot(pricesMap)
    }
  }, [JSON.stringify(pricesMap)])  // eslint-disable-line react-hooks/exhaustive-deps

  if (holdings.length === 0) {
    return (
      <>
        <EmptyState
          icon={Briefcase}
          title="No holdings yet"
          description="Add your share purchases to track portfolio value and performance over time."
          action={
            <div className="flex gap-2">
              <Link to="/search">
                <Button variant="secondary" size="sm">
                  <Search className="w-4 h-4" /> Find stocks
                </Button>
              </Link>
              <Button size="sm" onClick={() => setAddModalOpen(true)}>
                <Plus className="w-4 h-4" /> Add holding
              </Button>
            </div>
          }
        />
        {addModalOpen && (
          <AddHoldingModal symbol="" onClose={() => setAddModalOpen(false)} />
        )}
      </>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PortfolioSummaryCards
        totalValue={totalValue}
        totalCost={totalCost}
        gainLoss={gainLoss}
        gainLossPct={gainLossPct}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <h2 className="text-slate-300 font-medium text-sm mb-3">Portfolio Value Over Time</h2>
          <PortfolioChart history={history} />
        </div>
        <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4">
          <h2 className="text-slate-300 font-medium text-sm mb-3">Allocation</h2>
          <AllocationPieChart holdings={holdings} prices={pricesMap} />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
          <h2 className="text-slate-300 font-medium text-sm">
            Holdings <span className="text-slate-600 ml-1">({holdings.length})</span>
          </h2>
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>

        <div className="hidden sm:grid grid-cols-[6rem_1fr_6rem] gap-3 px-4 py-2.5 border-b border-slate-800/60 text-slate-500 text-xs uppercase tracking-wider">
          <span>Stock</span>
          <div className="grid grid-cols-4 gap-2 text-right">
            <span>Shares</span><span>Avg Cost</span><span>Cur. Price</span><span>P&amp;L</span>
          </div>
          <span className="text-right">Total Value</span>
        </div>

        {holdings.map((holding) => (
          <HoldingRow
            key={holding.symbol}
            holding={holding}
            currentPrice={pricesMap[holding.symbol]}
            onRemove={() => { removeHolding(holding.symbol); toast.success(`Removed ${holding.symbol}`) }}
          />
        ))}
      </div>

      {addModalOpen && (
        <AddHoldingModal symbol="" onClose={() => setAddModalOpen(false)} />
      )}
    </div>
  )
}
