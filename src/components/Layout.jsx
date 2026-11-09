import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Activity, Lightbulb, BarChart3, FileText, Settings, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useDevices } from '../context/DeviceContext.jsx'

const NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/monitoring', label: 'Live monitoring', icon: Activity },
  { to: '/controls', label: 'LED controls', icon: Lightbulb },
  { to: '/analytics', label: 'Energy analytics', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const TITLES = Object.fromEntries(NAV.map((n) => [n.to, n.label]))

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const { mode, activeCount } = useDevices()
  const { pathname } = useLocation()

  return (
    <div className="app">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-lamp" aria-hidden="true" />
          <div>
            <strong>Streetlight</strong>
            <small>Admin console</small>
          </div>
        </div>
        <nav>
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <button className="logout" onClick={logout}>
          <LogOut size={18} /> Sign out
        </button>
      </aside>
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1>{TITLES[pathname] || 'Dashboard'}</h1>
          <div className="topbar-right">
            <span className={`pill ${mode === 'AUTO' ? 'pill-cyan' : 'pill-amber'}`}>{mode} mode</span>
            <span className="pill pill-muted hide-sm">{activeCount}/8 lit</span>
            <div className="avatar" title={user?.email}>{user?.name?.[0] || 'A'}</div>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
