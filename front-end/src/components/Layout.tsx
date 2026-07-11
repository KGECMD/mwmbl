import { Outlet, Link, useLocation } from 'react-router-dom'
import { Search, Moon, Sun, Menu, X, User, Settings, Shield, BarChart3, Bookmark, History, Compass, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface LayoutProps {
  darkMode: boolean
  setDarkMode: (v: boolean) => void
}

const navigation = [
  { name: 'Home', href: '/', icon: Compass },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Discover', href: '/discover', icon: Sparkles },
  { name: 'Saved', href: '/saved', icon: Bookmark },
  { name: 'History', href: '/history', icon: History },
]

const userNav = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Admin', href: '/admin', icon: Shield },
]

export default function Layout({ darkMode, setDarkMode }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden">
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <LogoIcon className="w-8 h-8" />
                <span className="font-bold text-lg hidden sm:block">MWMBL</span>
              </Link>
            </div>
            <div className="flex-1 max-w-xl mx-4">
              <Link to="/search" className="block">
                <div className="relative group cursor-pointer">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="text" placeholder="Search..." readOnly className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white dark:focus:bg-neutral-800" />
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Link to="/auth" className="btn-ghost hidden sm:flex">Sign in</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-72 h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2">
              <LogoIcon className="w-8 h-8" />
              <span className="font-bold text-lg">MWMBL</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.href ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
              {userNav.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.href ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}>
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-xs text-neutral-400">MWMBL v2.0 • Open Source</p>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="pt-16 lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">MWMBL</span>
              <span>•</span>
              <span>Open Source Search Engine</span>
            </div>
            <div className="flex gap-4">
              <a href="https://github.com/mwmbl/mwmbl" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-700">GitHub</a>
              <a href="https://discord.gg/2BGSUYFdkD" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-700">Discord</a>
              <a href="https://opencollective.com/mwmbl" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-neutral-700">Donate</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" className="fill-primary-500" />
      <path d="M10 16C10 12.686 12.686 10 16 10V22C12.686 22 10 19.314 10 16Z" className="fill-white" />
      <circle cx="20" cy="16" r="4" className="fill-white" />
    </svg>
  )
}
