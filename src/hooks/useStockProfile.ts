import { useQuery } from '@tanstack/react-query'
import { fetchProfile } from '@/api/profile'
import { queryKeys } from '@/constants/queryKeys'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function useStockProfile(symbol: string | undefined) {
  const apiKey = usePreferencesStore((s) => s.apiKey)
  return useQuery({
    queryKey: queryKeys.profile(symbol ?? ''),
    queryFn: () => fetchProfile(symbol!),
    enabled: !!symbol && !!apiKey,
    staleTime: 24 * 60 * 60 * 1000,
  })
}
