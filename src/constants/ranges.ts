import type { RangeConfig } from '@/types'

export const CHART_RANGES: RangeConfig[] = [
  { label: '1D', interval: '1h',   outputsize: 24  },
  { label: '1W', interval: '1day', outputsize: 7   },
  { label: '1M', interval: '1day', outputsize: 30  },
  { label: '3M', interval: '1day', outputsize: 90  },
  { label: '1Y', interval: '1day', outputsize: 365 },
]

export const DEFAULT_RANGE = '1M' as const
