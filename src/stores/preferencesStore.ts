import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChartRange } from '@/types'

interface PreferencesStore {
  apiKey: string
  theme: 'dark' | 'light'
  defaultChartRange: ChartRange
  refreshIntervalSecs: number
  setApiKey: (key: string) => void
  setTheme: (theme: 'dark' | 'light') => void
  setDefaultChartRange: (range: ChartRange) => void
  setRefreshIntervalSecs: (secs: number) => void
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      apiKey: '',
      theme: 'dark',
      defaultChartRange: '1M',
      refreshIntervalSecs: 60,
      setApiKey: (apiKey) => set({ apiKey }),
      setTheme: (theme) => set({ theme }),
      setDefaultChartRange: (defaultChartRange) => set({ defaultChartRange }),
      setRefreshIntervalSecs: (refreshIntervalSecs) => set({ refreshIntervalSecs }),
    }),
    { name: 'portfolio-preferences' }
  )
)
