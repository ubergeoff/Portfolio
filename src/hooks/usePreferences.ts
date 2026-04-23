import { usePreferencesStore } from '@/stores/preferencesStore'

export function usePreferences() {
  return usePreferencesStore()
}
