import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/watchlist': 'Watchlist',
  '/portfolio': 'Portfolio',
  '/search': 'Search',
  '/settings': 'Settings',
}

export function AppShell() {
  const { pathname } = useLocation()
  const title = pathname.startsWith('/stock/')
    ? pathname.split('/')[2].toUpperCase()
    : PAGE_TITLES[pathname] ?? 'SharesTracker'

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
