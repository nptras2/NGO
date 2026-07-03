import React from 'react'
import { useLocation } from 'react-router-dom'
import { PhoneCall } from 'lucide-react'
import { motion } from 'framer-motion'

export const EmergencyCallButton = () => {
  const location = useLocation()

  // Hide button on Admin Dashboard
  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-40 select-none">
      <a href="tel:+919876543210" className="block relative group" aria-label="Call Emergency Hotline">
        {/* Pulsing Backglow Rings */}
        <motion.div 
          className="absolute inset-0 bg-primary-red rounded-full opacity-60"
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute inset-0 bg-primary-red rounded-full opacity-35"
          animate={{ scale: [1, 1.8, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />

        {/* Core Button */}
        <div className="relative w-14 h-14 bg-primary-red hover:bg-dark-red rounded-full flex items-center justify-center text-pure-white shadow-[0_6px_20px_rgba(229,57,53,0.4)] border border-primary-red/20 transition-all duration-300 transform active:scale-95">
          <PhoneCall size={22} className="animate-[wiggle_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Tooltip Hover indicator */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border dark:border-transparent">
          Call 24/7 Hotline: +91 98765 43210
        </div>
      </a>
    </div>
  )
}
export default EmergencyCallButton
