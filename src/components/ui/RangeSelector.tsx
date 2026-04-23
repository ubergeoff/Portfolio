import { cn } from '@/lib/cn'
import type { ChartRange } from '@/types'
import { CHART_RANGES } from '@/constants/ranges'

interface RangeSelectorProps {
  value: ChartRange
  onChange: (range: ChartRange) => void
}

export function RangeSelector({ value, onChange }: RangeSelectorProps) {
  return (
    <div className="flex bg-slate-800/60 border border-slate-700/50 rounded-lg p-0.5 gap-0.5">
      {CHART_RANGES.map(({ label }) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={cn(
            'px-3 py-1 rounded-md text-xs font-medium transition-colors',
            value === label
              ? 'bg-sky-500 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
