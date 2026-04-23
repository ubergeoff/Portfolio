import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Stock } from '@/types'

interface WatchlistStore {
  stocks: Stock[]
  addStock: (stock: Stock) => void
  removeStock: (symbol: string) => void
  isWatchlisted: (symbol: string) => boolean
  reorderStocks: (stocks: Stock[]) => void
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      stocks: [],
      addStock: (stock) => {
        if (get().isWatchlisted(stock.symbol)) return
        set((state) => ({ stocks: [...state.stocks, stock] }))
      },
      removeStock: (symbol) =>
        set((state) => ({ stocks: state.stocks.filter((s) => s.symbol !== symbol) })),
      isWatchlisted: (symbol) => get().stocks.some((s) => s.symbol === symbol),
      reorderStocks: (stocks) => set({ stocks }),
    }),
    { name: 'portfolio-watchlist' }
  )
)
