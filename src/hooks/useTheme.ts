import { useEffect } from 'react'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function useTheme() {
  const theme = usePreferencesStore((s) => s.theme)
  const setTheme = usePreferencesStore((s) => s.setTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return { theme, setTheme, isDark: theme === 'dark' }
}
