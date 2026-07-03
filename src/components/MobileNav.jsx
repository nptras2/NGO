import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, MapPin, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export const MobileNav = () => {
  const location = useLocation()

  // Hide mobile bottom navigation inside the Admin Dashboard
  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  const items = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Find Blood', path: '/find-blood', icon: Search },
    { name: 'Donors', path: '/directory', icon: Users },
    { name: 'Camps', path: '/camps', icon: MapPin },
    { name: 'About', path: '/about', icon: Heart }
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border-color/30 rounded-t-2xl px-4 py-2 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon
        const active = isActive(item.path)
        
        return (
          <Link
            key={item.name}
            to={item.path}
            className="flex flex-col items-center justify-center py-1.5 px-3 relative"
          >
            <motion.div
              animate={{ 
                scale: active ? 1.1 : 1,
                color: active ? '#E53935' : '#888888'
              }}
              className="z-10 flex flex-col items-center"
            >
              <Icon size={20} className={active ? 'stroke-[2.5]' : 'stroke-[1.5]'} />
              <span className="text-[10px] tracking-wide mt-1 font-medium">{item.name}</span>
            </motion.div>
            
            {active && (
              <motion.div 
                layoutId="mobileNavActiveBg"
                className="absolute inset-0 bg-primary-red/5 dark:bg-primary-red/10 rounded-xl"
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              />
            )}
          </Link>
        )
      })}
    </div>
  )
}
export default MobileNav
