import type { RangeConfig } from '@/types'

export const CHART_RANGES: RangeConfig[] = [
  { label: '1D', resolution: '60',  days: 1   },
  { label: '1W', resolution: 'D',   days: 7   },
  { label: '1M', resolution: 'D',   days: 30  },
  { label: '3M', resolution: 'D',   days: 90  },
  { label: '1Y', resolution: 'D',   days: 365 },
]

export const DEFAULT_RANGE = '1M' as const
