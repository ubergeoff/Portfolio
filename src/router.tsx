import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { PageLoader } from '@/components/ui/LoadingSpinner'

const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const WatchlistPage = lazy(() => import('@/pages/WatchlistPage').then(m => ({ default: m.WatchlistPage })))
const PortfolioPage = lazy(() => import('@/pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })))
const StockDetailPage = lazy(() => import('@/pages/StockDetailPage').then(m => ({ default: m.StockDetailPage })))
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Lazy><DashboardPage /></Lazy> },
      { path: '/watchlist', element: <Lazy><WatchlistPage /></Lazy> },
      { path: '/portfolio', element: <Lazy><PortfolioPage /></Lazy> },
      { path: '/stock/:symbol', element: <Lazy><StockDetailPage /></Lazy> },
      { path: '/search', element: <Lazy><SearchPage /></Lazy> },
      { path: '/settings', element: <Lazy><SettingsPage /></Lazy> },
      { path: '*', element: <Lazy><NotFoundPage /></Lazy> },
    ],
  },
])
