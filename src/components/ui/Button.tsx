import { cn } from '@/lib/cn'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-sky-500 text-white hover:bg-sky-600 focus:ring-offset-slate-900':
            variant === 'primary',
          'bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-offset-slate-900':
            variant === 'secondary',
          'text-slate-400 hover:text-slate-200 hover:bg-slate-800':
            variant === 'ghost',
          'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500':
            variant === 'danger',
        },
        {
          'px-2.5 py-1 text-xs gap-1': size === 'sm',
          'px-4 py-2 text-sm gap-1.5': size === 'md',
          'px-5 py-2.5 text-base gap-2': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
