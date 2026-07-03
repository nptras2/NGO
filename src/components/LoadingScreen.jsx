import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartPulse } from 'lucide-react'

export const LoadingScreen = () => {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Incremental progress mock
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setVisible(false), 300)
          return 100
        }
        return prev + 5
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-charcoal text-pure-white"
        >
          <div className="relative flex flex-col items-center">
            {/* Logo container with pulsing glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1, 1.08, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(229,57,53,0.2))',
                  'drop-shadow(0 0 25px rgba(229,57,53,0.5))',
                  'drop-shadow(0 0 10px rgba(229,57,53,0.2))',
                  'drop-shadow(0 0 30px rgba(229,57,53,0.6))',
                  'drop-shadow(0 0 10px rgba(229,57,53,0.2))'
                ]
              }}
              transition={{ 
                duration: 2.2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-red/50 bg-pure-white mb-6 flex items-center justify-center shadow-lg"
            >
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </motion.div>

            {/* Glowing Brand Name */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-extrabold tracking-wider uppercase mb-1 text-center"
            >
              AZAAD HUMAN RIGHTS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4 }}
              className="text-[10px] tracking-widest text-primary-red font-bold uppercase mb-8 text-center"
            >
              ASSOCIATION • PUNJAB
            </motion.p>

            {/* Progress Bar Container */}
            <div className="w-48 h-[2px] bg-dark-gray rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-primary-red"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-[10px] text-soft-silver opacity-40 font-mono tracking-widest mt-2">
              {progress}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
export default LoadingScreen
