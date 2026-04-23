import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { usePortfolioStore } from '@/stores/portfolioStore'
import toast from 'react-hot-toast'
import type { StockProfile } from '@/types'

interface AddHoldingModalProps {
  symbol: string
  profile?: StockProfile
  onClose: () => void
}

export function AddHoldingModal({ symbol, profile, onClose }: AddHoldingModalProps) {
  const addHolding = usePortfolioStore((s) => s.addHolding)
  const [shares, setShares] = useState('')
  const [costBasis, setCostBasis] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sharesNum = parseFloat(shares)
    const costNum = parseFloat(costBasis)

    if (!sharesNum || sharesNum <= 0) { setError('Enter a valid number of shares.'); return }
    if (!costNum || costNum <= 0) { setError('Enter a valid cost per share.'); return }

    addHolding({
      symbol,
      name: profile?.name ?? symbol,
      shares: sharesNum,
      avgCostBasis: costNum,
      purchasedAt: Date.now(),
    })
    toast.success(`Added ${sharesNum} shares of ${symbol}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-slate-100 font-semibold">Add to Portfolio</h2>
            <p className="text-slate-400 text-sm">{symbol} {profile?.name ? `— ${profile.name}` : ''}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Number of shares</label>
            <input
              type="number"
              min="0.0001"
              step="any"
              value={shares}
              onChange={(e) => { setShares(e.target.value); setError('') }}
              placeholder="e.g. 10"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Average cost per share ($)</label>
            <input
              type="number"
              min="0.0001"
              step="any"
              value={costBasis}
              onChange={(e) => { setCostBasis(e.target.value); setError('') }}
              placeholder="e.g. 150.00"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          {error && <p className="text-rose-400 text-xs">{error}</p>}
          <div className="flex gap-2 pt-1">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1">
              <Plus className="w-4 h-4" /> Add Holding
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
