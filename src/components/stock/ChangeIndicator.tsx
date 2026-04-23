import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatPct } from '@/lib/formatters'

interface ChangeIndicatorProps {
  value: number
  showIcon?: boolean
  className?: string
}

export function ChangeIndicator({ value, showIcon = true, className }: ChangeIndicatorProps) {
  const isPositive = value > 0
  const isNegative = value < 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium tabular-nums text-sm',
        isPositive && 'text-emerald-400',
        isNegative && 'text-rose-400',
        !isPositive && !isNegative && 'text-slate-400',
        className
      )}
    >
      {showIcon && (
        isPositive ? <TrendingUp className="w-3.5 h-3.5" /> :
        isNegative ? <TrendingDown className="w-3.5 h-3.5" /> :
        <Minus className="w-3.5 h-3.5" />
      )}
      {formatPct(value)}
    </span>
  )
}
