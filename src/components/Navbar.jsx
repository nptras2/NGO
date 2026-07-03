import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Droplet, Sun, Moon, ShieldAlert, PhoneCall, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Hide Navbar completely inside the Admin Dashboard
  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Blood', path: '/find-blood' },
    { name: 'Donor Directory', path: '/directory' },
    { name: 'Camps', path: '/camps' },
    { name: 'Members', path: '/members' },
    { name: 'About NGO', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Top Emergency Hotline Bar */}
      <div className="w-full bg-primary-red text-pure-white py-2 px-4 text-center text-xs font-semibold tracking-wider flex items-center justify-center gap-2 z-50 relative select-none">
        <PhoneCall size={14} className="pulse-red" />
        <span>NEED BLOOD URGENTLY? CALL EMERGENCY HOTLINE: <a href="tel:+919876543210" className="underline hover:text-soft-silver transition-colors">+91 98765 43210</a> (AVAILABLE 24/7)</span>
      </div>

      {/* Main Sticky Glass Header */}
      <header className="sticky top-0 z-40 w-full glass-nav shadow-sm border-b transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full overflow-hidden border border-border-color bg-pure-white shadow-sm flex items-center justify-center shrink-0"
            >
              <img src="/logo.jpg" alt="AZAAD Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-wider text-sm leading-tight text-text-primary uppercase">
                AZAAD HUMAN RIGHTS
              </span>
              <span className="text-[9px] text-primary-red tracking-wider uppercase font-bold -mt-0.5">
                ASSOCIATION • PUNJAB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-all relative py-1 ${
                  isActive(link.path)
                    ? 'text-primary-red font-semibold'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-red"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-bg-secondary border border-transparent hover:border-border-color transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Admin Console Link */}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal hover:bg-primary-red hover:dark:bg-primary-red hover:dark:text-pure-white rounded-lg shadow-sm border border-transparent transition-all duration-300"
            >
              <ShieldAlert size={14} />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Right Bar Actions (Condensed) */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/admin"
              className="p-2 text-text-secondary hover:text-primary-red transition-all"
              aria-label="Admin Portal"
            >
              <ShieldAlert size={20} />
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-secondary hover:text-text-primary rounded-full transition-all"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden border-t bg-bg-primary overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg text-base font-semibold tracking-wide transition-all ${
                      isActive(link.path)
                        ? 'bg-primary-red/10 text-primary-red'
                        : 'text-text-secondary hover:bg-bg-secondary'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Menu Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 py-3 px-4 rounded-lg text-base font-semibold tracking-wide text-text-secondary hover:bg-bg-secondary w-full text-left cursor-pointer border border-transparent"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  <span>Toggle Theme</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
export default Navbar
