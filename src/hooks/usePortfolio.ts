import { usePortfolioStore, computePortfolioTotals } from '@/stores/portfolioStore'

export function usePortfolio(prices: Record<string, number> = {}) {
  const store = usePortfolioStore()
  const totals = computePortfolioTotals(store.holdings, prices)
  return { ...store, ...totals }
}
