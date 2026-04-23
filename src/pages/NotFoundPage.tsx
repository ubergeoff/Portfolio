import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
      <p className="text-6xl font-bold text-slate-700">404</p>
      <h1 className="text-slate-300 font-semibold text-lg">Page not found</h1>
      <p className="text-slate-500 text-sm">The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button>
          <Home className="w-4 h-4" /> Go to Dashboard
        </Button>
      </Link>
    </div>
  )
}
