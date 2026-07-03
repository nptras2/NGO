import React, { useRef, useState } from 'react'

export const PremiumCard = ({ children, className = '', onClick, hoverLift = true, borderGlow = true }) => {
  const cardRef = useRef(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Normalise mouse position relative to card dimensions
    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100
    setMousePos({ x: px, y: py })

    // Calculate rotation coordinates (centered around card middle)
    const cx = x - rect.width / 2
    const cy = y - rect.height / 2
    
    // Max rotation angles (subtle 3D tilt)
    const factorX = 4
    const factorY = 4
    
    setRotateX(-(cy / (rect.height / 2)) * factorX)
    setRotateY((cx / (rect.width / 2)) * factorY)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: isHovered && hoverLift
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)',
        transition: isHovered 
          ? 'transform 0.1s ease-out, border-color 0.3s ease, box-shadow 0.3s ease' 
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease',
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`
      }}
      className={`relative rounded-2xl p-6 bg-var-card border border-var-border transition-all duration-300 shadow-sm ${
        isHovered && borderGlow 
          ? 'border-primary-red/40 shadow-[0_15px_30px_-5px_rgba(229,57,53,0.12)] ring-1 ring-primary-red/10' 
          : 'shadow-sm'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Background radial highlight matching cursor */}
      {isHovered && borderGlow && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(229,57,53,0.25)_0%,transparent_60%)]"
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default PremiumCard
