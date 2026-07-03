import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// Simple Scene containing realistic floating 3D blood drop
const Scene = () => {
  const dropRef = useRef()
  const lightRef = useRef()

  // Generate teardrop points path for LatheGeometry
  const dropPoints = useEffect(() => {
    // We compute this inside the component to prevent recreating it
  }, [])

  // Create points for lathe teardrop
  const points = []
  for (let i = 0; i < 35; i++) {
    const t = i / 34
    const angle = t * Math.PI
    // Teardrop shape formula: wide at the bottom (t = 0), tapered at the top (t = 1)
    const x = Math.sin(angle) * (1.1 - t * 0.95) * 1.15
    const y = -Math.cos(angle) * 1.4 + 0.2
    points.push(new THREE.Vector2(x, y))
  }

  // Float animation & Mouse Parallax
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    const { x, y } = state.pointer

    if (dropRef.current) {
      // 1. Slow Y axis rotation
      dropRef.current.rotation.y = elapsed * 0.25
      
      // 2. Slow floating bounce
      const bounce = Math.sin(elapsed * 1.2) * 0.12
      
      // 3. Mouse Parallax (interpolate target positions based on cursor coordinates)
      const targetX = x * 0.6
      const targetY = y * 0.6 + bounce
      
      dropRef.current.position.x = THREE.MathUtils.lerp(dropRef.current.position.x, targetX, 0.05)
      dropRef.current.position.y = THREE.MathUtils.lerp(dropRef.current.position.y, targetY, 0.05)
      
      // Subtle tilt rotation based on cursor
      dropRef.current.rotation.x = THREE.MathUtils.lerp(dropRef.current.rotation.x, -y * 0.2, 0.05)
      dropRef.current.rotation.z = THREE.MathUtils.lerp(dropRef.current.rotation.z, -x * 0.2, 0.05)
    }

    if (lightRef.current) {
      // Light follows droplet position with offset
      lightRef.current.position.x = dropRef.current.position.x
      lightRef.current.position.y = dropRef.current.position.y - 1.2
    }
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      {/* Directional shines for reflections */}
      <directionalLight position={[3, 5, 2]} intensity={1.5} castShadow />
      <directionalLight position={[-3, 2, 4]} intensity={0.8} />
      
      {/* Soft red glow pointlight beneath the blood drop */}
      <pointLight ref={lightRef} position={[0, -1.2, 0]} intensity={3.5} distance={5} color="#E53935" />

      {/* Floating cell particles around the droplet */}
      <Sparkles count={45} scale={5.5} size={2.5} speed={0.35} color="#E53935" opacity={0.65} />

      {/* Teardrop Mesh */}
      <mesh ref={dropRef} position={[0, 0, 0]}>
        <latheGeometry args={[points, 64]} />
        <meshPhysicalMaterial
          color="#E53935"
          roughness={0.03}
          metalness={0.02}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          transmission={0.88}    // Translucent glass transmission
          ior={1.42}             // Index of Refraction
          thickness={1.8}        // Glass thickness for refraction
          specularIntensity={1.2}
          specularColor="#ffffff"
          emissive="#610b0b"     // Deep red interior core emissive glow
          emissiveIntensity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </>
  )
}

export const ThreeDrop = () => {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      setWebglSupported(support)
    } catch (e) {
      setWebglSupported(false)
    }
  }, [])

  if (!webglSupported) {
    // Teardrop Fallback
    return (
      <div className="relative w-full h-[380px] md:h-[500px] flex items-center justify-center select-none">
        {/* Pulsing Glass Droplet */}
        <div className="relative z-10 w-44 h-44 md:w-56 md:h-56 filter drop-shadow-[0_20px_40px_rgba(229,57,53,0.38)] animate-[bounce_4s_easeInOut_infinite] flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="w-full h-full">
            <path 
              d="M50,0 C50,0 90,45 90,75 C90,97 72,115 50,115 C28,115 10,97 10,75 C10,45 50,0 50,0 Z" 
              fill="url(#gradRed)"
              style={{ filter: 'drop-shadow(0 0 15px rgba(229, 57, 53, 0.45))' }}
            />
            <defs>
              <linearGradient id="gradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FF5252', stopOpacity: 1 }} />
                <stop offset="60%" style={{ stopColor: '#E53935', stopOpacity: 0.95 }} />
                <stop offset="100%" style={{ stopColor: '#880e4f', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            {/* Highlight */}
            <path 
              d="M36,22 C36,22 24,37 24,56" 
              stroke="#FFFFFF" 
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-35"
              fill="none"
            />
          </svg>
        </div>

        {/* Shadow glow under drop */}
        <div className="absolute bottom-[20%] w-32 h-6 bg-primary-red/20 blur-xl rounded-full animate-pulse" />

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-primary-red/35 rounded-full blur-[1px]"
              style={{
                width: `${Math.random() * 8 + 5}px`,
                height: `${Math.random() * 8 + 5}px`,
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-[380px] md:h-[500px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
export default ThreeDrop
