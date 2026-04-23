import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Star, Briefcase, Search, Settings, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/watchlist', icon: Star, label: 'Watchlist' },
  { to: '/portfolio', icon: Briefcase, label: 'Portfolio' },
  { to: '/search', icon: Search, label: 'Search' },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-slate-900/70 border-r border-slate-800/60 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-slate-800/60">
        <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-slate-100 font-semibold text-sm tracking-tight">SharesTracker</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-sky-500/15 text-sky-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Settings at bottom */}
      <div className="px-2.5 py-3 border-t border-slate-800/60">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-sky-500/15 text-sky-400 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            )
          }
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
