import { useState } from 'react'
import { Key, ExternalLink } from 'lucide-react'
import { Button } from './Button'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function ApiKeyModal() {
  const apiKey = usePreferencesStore((s) => s.apiKey)
  const setApiKey = usePreferencesStore((s) => s.setApiKey)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  if (apiKey) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputValue.trim()
    if (!trimmed) {
      setError('Please enter your API key.')
      return
    }
    if (trimmed.length < 10) {
      setError('That key looks too short. Double-check and try again.')
      return
    }
    setApiKey(trimmed)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h1 className="text-slate-100 font-semibold text-lg">Welcome to SharesTracker</h1>
            <p className="text-slate-400 text-sm">Enter your Finnhub API key to get started</p>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-4 mb-6 text-sm text-slate-400 space-y-1.5">
          <p className="font-medium text-slate-300">How to get a free API key:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Visit finnhub.io and create a free account</li>
            <li>Copy your API key from the dashboard</li>
            <li>Paste it below — it's stored only in your browser</li>
          </ol>
          <a
            href="https://finnhub.io/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 mt-1"
          >
            Get free key <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setError('') }}
            placeholder="e.g. cq1234abcdefgh567890"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono"
            autoFocus
          />
          {error && <p className="text-rose-400 text-xs">{error}</p>}
          <Button type="submit" className="w-full" size="lg">
            Start Tracking
          </Button>
        </form>
      </div>
    </div>
  )
}
