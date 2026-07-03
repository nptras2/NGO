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
            {/* Heartbeat pulsing glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1, 1.2, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(229,57,53,0.3))',
                  'drop-shadow(0 0 25px rgba(229,57,53,0.8))',
                  'drop-shadow(0 0 10px rgba(229,57,53,0.3))',
                  'drop-shadow(0 0 35px rgba(229,57,53,0.9))',
                  'drop-shadow(0 0 10px rgba(229,57,53,0.3))'
                ]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-primary-red mb-6"
            >
              <HeartPulse size={64} className="stroke-[1.5]" />
            </motion.div>

            {/* Glowing Brand Name */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold tracking-widest uppercase mb-1"
            >
              LIFESAVER <span className="text-primary-red">NGO</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4 }}
              className="text-xs tracking-wider text-soft-silver font-light uppercase mb-8"
            >
              Blood Bank Management Platform
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
