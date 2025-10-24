import { ReactNode } from 'react'
import { Menu, FileText, History, PlusCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const NavItem = ({ to, icon: Icon, label }: any) => {
    const active = pathname === to
    return (
      <Link to={to}
        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition
         ${active ? 'bg-panel-100 text-ink-700' : 'text-ink-500 hover:bg-panel-100'}`}>
        <Icon size={18} /> {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="h-14 border-b bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="btn-ghost"><Menu size={18} /></button>
            <span className="font-semibold">Athena Office · Aditivos</span>
          </div>
          <span className="badge">v0.1</span>
        </div>
      </header>

      {/* Shell */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <nav className="card p-3 space-y-1">
            <NavItem to="/" icon={FileText} label="Dashboard" />
            <NavItem to="/aditivos/novo" icon={PlusCircle} label="Criar aditivo" />
            <NavItem to="/historico" icon={History} label="Histórico" />
          </nav>
        </aside>

        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          {children}
        </main>
      </div>
    </div>
  )
}
