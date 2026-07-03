import React, { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

export const AnimatedCounter = ({ value, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // Premium easeOut cubic
        onUpdate: (latest) => {
          setCount(Math.floor(latest))
        }
      })
      return () => controls.stop()
    }
  }, [inView, value, duration])

  return (
    <span ref={ref} className="font-mono">
      {count.toLocaleString()}{suffix}
    </span>
  )
}
export default AnimatedCounter
