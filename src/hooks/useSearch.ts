import { useQuery } from '@tanstack/react-query'
import { searchSymbols } from '@/api/search'
import { queryKeys } from '@/constants/queryKeys'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function useSearch(query: string) {
  const apiKey = usePreferencesStore((s) => s.apiKey)
  return useQuery({
    queryKey: queryKeys.search(query),
    queryFn: () => searchSymbols(query),
    enabled: query.trim().length >= 1 && !!apiKey,
    staleTime: 30 * 1000,
  })
}
