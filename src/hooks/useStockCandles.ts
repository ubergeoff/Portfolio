import { useQuery } from '@tanstack/react-query'
import { fetchCandles } from '@/api/candles'
import { queryKeys } from '@/constants/queryKeys'
import type { ChartRange } from '@/types'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function useStockCandles(symbol: string | undefined, range: ChartRange) {
  const apiKey = usePreferencesStore((s) => s.apiKey)
  return useQuery({
    queryKey: queryKeys.candles(symbol ?? '', range),
    queryFn: () => fetchCandles(symbol!, range),
    enabled: !!symbol && !!apiKey,
    staleTime: 5 * 60 * 1000,
  })
}
