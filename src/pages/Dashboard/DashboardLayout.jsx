import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../services/db'
import { 
  ShieldAlert, LayoutDashboard, Users, Droplets, MapPin, 
  Send, Users2, FileBarChart, Bell, LogOut, Sun, Moon, Sparkles 
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export const DashboardLayout = () => {
  const { user, logout, switchDemoRole, demoUsers } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [requestsCount, setRequestsCount] = useState(0)

  // Fetch pending emergency requests for notification badge
  useEffect(() => {
    const fetchRequests = async () => {
      const allReqs = await db.getRequests()
      const pendings = allReqs.filter(r => r.status === 'Pending')
      setRequestsCount(pendings.length)
    }
    fetchRequests()
    // Poll every 10s for demo responsiveness
    const timer = setInterval(fetchRequests, 10000)
    return () => clearInterval(timer)
  }, [])

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Donors', path: '/admin/donors', icon: Users },
    { name: 'Blood Inventory', path: '/admin/inventory', icon: Droplets },
    { name: 'Blood Camps', path: '/admin/camps', icon: MapPin },
    { name: 'Requests Queue', path: '/admin/requests', icon: Send, badge: requestsCount },
    { name: 'Team Members', path: '/admin/members', icon: Users2 },
    { name: 'Logs & Backups', path: '/admin/reports', icon: FileBarChart }
  ]

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const handleLogoutClick = () => {
    logout()
    navigate('/')
  }

  return (
    // data-lenis-prevent disables Lenis smooth scrolling inside this dashboard scroll container
    <div data-lenis-prevent className="flex h-screen bg-bg-primary text-text-primary overflow-hidden transition-all">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-bg-secondary border-r border-border-color shrink-0 select-none">
        
        {/* Header */}
        <div className="h-16 px-5 border-b border-border-color flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-border-color bg-pure-white flex items-center justify-center shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-[11px] leading-tight text-text-primary uppercase">AZAAD HUMAN RIGHTS</span>
            <span className="text-[8px] text-primary-red tracking-wider uppercase font-bold">CABINET CONTROL</span>
          </div>
        </div>

        {/* Demo Sandbox Role Switcher */}
        <div className="p-4 border-b border-border-color bg-bg-primary/40 space-y-2">
          <span className="text-[9px] font-bold text-primary-red uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={10} className="pulse-red" />
            RBAC Playground Sandbox
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-text-secondary">Current Active Role:</span>
            <select
              value={user?.post || 'Admin'}
              onChange={(e) => switchDemoRole(e.target.value)}
              className="w-full h-8 px-2 rounded border border-border-color bg-bg-primary text-text-primary text-xs font-semibold focus:outline-none"
            >
              {demoUsers.map(u => (
                <option key={u.post} value={u.post}>{u.post}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Menu Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all ${
                  active
                    ? 'bg-primary-red text-pure-white shadow-md shadow-primary-red/10'
                    : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    active ? 'bg-pure-white text-primary-red' : 'bg-primary-red text-pure-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Info footer panel */}
        <div className="p-4 border-t border-border-color flex items-center justify-between bg-bg-primary/20">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={user?.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop'} 
              alt={user?.fullName}
              className="w-9 h-9 rounded-full object-cover border border-border-color"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate leading-tight">{user?.fullName}</h4>
              <span className="text-[10px] text-text-secondary tracking-wide uppercase font-light truncate block">{user?.post}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. RIGHT MAIN CONTENT PANEL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header navbar */}
        <header className="h-16 border-b border-border-color px-6 flex items-center justify-between bg-bg-secondary shrink-0 transition-all">
          <div className="flex items-center gap-2 lg:hidden">
            {/* Simple logo on mobile */}
            <div className="w-6 h-6 rounded-full overflow-hidden border border-border-color bg-pure-white flex items-center justify-center shrink-0">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-[10px] tracking-wide uppercase">AZAAD HUMAN RIGHTS</span>
          </div>

          <div className="hidden lg:block text-xs font-medium text-text-secondary select-none">
            Dashboard Workspace / System Status: <span className="text-green-600 dark:text-green-400 font-bold">Operational</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-primary transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notification Icon */}
            <div className="relative">
              <button className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-primary transition-all cursor-pointer">
                <Bell size={16} />
              </button>
              {requestsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-red rounded-full" />
              )}
            </div>

            {/* Exit Portal Link */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:text-primary-red transition-all border border-border-color hover:border-primary-red rounded-lg cursor-pointer"
            >
              <LogOut size={12} />
              Exit Portal
            </button>
          </div>
        </header>

        {/* Scrollable workspace contents */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-primary">
          {/* Inject nested routes */}
          <Outlet />
        </main>
      </div>

    </div>
  )
}
export default DashboardLayout
