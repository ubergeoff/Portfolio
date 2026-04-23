import { useState } from 'react'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { usePortfolioStore } from '@/stores/portfolioStore'
import { Button } from '@/components/ui/Button'
import { Key, Palette, Clock, Trash2, Eye, EyeOff } from 'lucide-react'
import { CHART_RANGES } from '@/constants/ranges'
import type { ChartRange } from '@/types'
import toast from 'react-hot-toast'
import { cn } from '@/lib/cn'

export function SettingsPage() {
  const { apiKey, theme, defaultChartRange, refreshIntervalSecs, setApiKey, setTheme, setDefaultChartRange, setRefreshIntervalSecs } = usePreferencesStore()
  const clearHistory = usePortfolioStore((s) => s.clearHistory)
  const [keyInput, setKeyInput] = useState(apiKey)
  const [showKey, setShowKey] = useState(false)

  const handleSaveKey = () => {
    setApiKey(keyInput.trim())
    toast.success('API key saved')
  }

  const handleClearHistory = () => {
    if (!confirm('Clear all portfolio value history? This cannot be undone.')) return
    clearHistory()
    toast.success('Portfolio history cleared')
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* API Key */}
      <section className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800/60">
          <Key className="w-4 h-4 text-sky-400" />
          <h2 className="text-slate-200 font-medium text-sm">Twelve Data API Key</h2>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-slate-500 text-sm">
            Required to fetch live stock prices. Get a free key at twelvedata.com.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Your Twelve Data API key"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 pr-10 text-slate-200 placeholder:text-slate-500 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button onClick={handleSaveKey} disabled={keyInput.trim() === apiKey}>
              Save
            </Button>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800/60">
          <Palette className="w-4 h-4 text-sky-400" />
          <h2 className="text-slate-200 font-medium text-sm">Appearance</h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-2">Theme</label>
            <div className="flex gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    'flex-1 py-2 rounded-lg border text-sm font-medium capitalize transition-colors',
                    theme === t
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-600/60 hover:text-slate-300'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-2">Default Chart Range</label>
            <div className="flex gap-1.5 flex-wrap">
              {CHART_RANGES.map(({ label }) => (
                <button
                  key={label}
                  onClick={() => setDefaultChartRange(label as ChartRange)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors',
                    defaultChartRange === label
                      ? 'bg-sky-500/20 border-sky-500/50 text-sky-300'
                      : 'border-slate-700/50 text-slate-400 hover:border-slate-600/60'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Refresh */}
      <section className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800/60">
          <Clock className="w-4 h-4 text-sky-400" />
          <h2 className="text-slate-200 font-medium text-sm">Auto-Refresh</h2>
        </div>
        <div className="p-4">
          <label className="block text-slate-400 text-xs font-medium mb-2">Refresh interval</label>
          <select
            value={refreshIntervalSecs}
            onChange={(e) => setRefreshIntervalSecs(Number(e.target.value))}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value={30}>Every 30 seconds</option>
            <option value={60}>Every minute</option>
            <option value={300}>Every 5 minutes</option>
            <option value={0}>Manual only</option>
          </select>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-slate-900/60 border border-slate-800/60 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-800/60">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <h2 className="text-slate-200 font-medium text-sm">Data Management</h2>
        </div>
        <div className="p-4">
          <p className="text-slate-500 text-sm mb-3">
            Clear portfolio value history (snapshots). Holdings and watchlist are not affected.
          </p>
          <Button variant="danger" size="sm" onClick={handleClearHistory}>
            <Trash2 className="w-3.5 h-3.5" /> Clear history
          </Button>
        </div>
      </section>
    </div>
  )
}
