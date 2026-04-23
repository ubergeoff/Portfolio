import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  icon?: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatCard({ label, value, subValue, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn('bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-slate-700/70 flex items-center justify-center">
            <Icon className="w-4 h-4 text-slate-400" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-slate-100 text-2xl font-semibold tabular-nums leading-none">{value}</span>
        {subValue && (
          <span
            className={cn('text-sm font-medium pb-0.5', {
              'text-emerald-400': trend === 'up',
              'text-rose-400': trend === 'down',
              'text-slate-400': trend === 'neutral' || !trend,
            })}
          >
            {subValue}
          </span>
        )}
      </div>
    </div>
  )
}
