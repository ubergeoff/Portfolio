import { useQuery } from '@tanstack/react-query'
import { fetchQuote } from '@/api/quotes'
import { queryKeys } from '@/constants/queryKeys'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function useStockQuote(symbol: string | undefined) {
  const apiKey = usePreferencesStore((s) => s.apiKey)
  return useQuery({
    queryKey: queryKeys.quote(symbol ?? ''),
    queryFn: () => fetchQuote(symbol!),
    enabled: !!symbol && !!apiKey,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })
}
