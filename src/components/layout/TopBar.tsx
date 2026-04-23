import { SearchBar } from '@/components/search/SearchBar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Bell } from 'lucide-react'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-slate-800/60 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
      <h1 className="text-slate-100 font-semibold text-base">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <SearchBar />
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  )
}
