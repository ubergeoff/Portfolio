import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({ message = 'Something went wrong', onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
      <AlertCircle className="w-10 h-10 text-rose-400" />
      <p className="text-slate-400 text-sm max-w-xs">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </Button>
      )}
    </div>
  )
}
