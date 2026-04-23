import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PortfolioHolding, PortfolioValueSnapshot } from '@/types'

interface PortfolioStore {
  holdings: PortfolioHolding[]
  history: PortfolioValueSnapshot[]
  addHolding: (holding: PortfolioHolding) => void
  updateHolding: (symbol: string, updates: Partial<PortfolioHolding>) => void
  removeHolding: (symbol: string) => void
  appendSnapshot: (prices: Record<string, number>) => void
  clearHistory: () => void
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      holdings: [],
      history: [],

      addHolding: (holding) => {
        const existing = get().holdings.find((h) => h.symbol === holding.symbol)
        if (existing) {
          const totalShares = existing.shares + holding.shares
          const newAvg =
            (existing.shares * existing.avgCostBasis + holding.shares * holding.avgCostBasis) /
            totalShares
          set((state) => ({
            holdings: state.holdings.map((h) =>
              h.symbol === holding.symbol
                ? { ...h, shares: totalShares, avgCostBasis: newAvg }
                : h
            ),
          }))
        } else {
          set((state) => ({ holdings: [...state.holdings, holding] }))
        }
      },

      updateHolding: (symbol, updates) =>
        set((state) => ({
          holdings: state.holdings.map((h) =>
            h.symbol === symbol ? { ...h, ...updates } : h
          ),
        })),

      removeHolding: (symbol) =>
        set((state) => ({
          holdings: state.holdings.filter((h) => h.symbol !== symbol),
        })),

      appendSnapshot: (prices) => {
        const { holdings, history } = get()
        if (holdings.length === 0) return

        const totalValue = holdings.reduce((sum, h) => {
          const price = prices[h.symbol] ?? 0
          return sum + h.shares * price
        }, 0)
        const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgCostBasis, 0)
        const gainLoss = totalValue - totalCost
        const gainLossPct = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0

        const lastSnapshot = history[history.length - 1]
        const oneHourMs = 60 * 60 * 1000
        if (lastSnapshot && Date.now() - lastSnapshot.timestamp < oneHourMs) return

        const snapshot: PortfolioValueSnapshot = {
          timestamp: Date.now(),
          totalValue,
          totalCost,
          gainLoss,
          gainLossPct,
        }
        set((state) => ({ history: [...state.history, snapshot] }))
      },

      clearHistory: () => set({ history: [] }),
    }),
    { name: 'portfolio-holdings' }
  )
)

export function computePortfolioTotals(
  holdings: PortfolioHolding[],
  prices: Record<string, number>
) {
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * (prices[h.symbol] ?? 0), 0)
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgCostBasis, 0)
  const gainLoss = totalValue - totalCost
  const gainLossPct = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0
  return { totalValue, totalCost, gainLoss, gainLossPct }
}
