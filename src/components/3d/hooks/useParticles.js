import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export const useParticles = (count, options = {}) => {
  const {
    amplitude = 0.5,
    speed = 1,
    rotationSpeed = 0.2,
    spread = 4
  } = options

  const particlesRef = useRef([])

  useEffect(() => {
    particlesRef.current = Array(count).fill().map(() => useRef(null))
    
    return () => {
      particlesRef.current = []
    }
  }, [count])

  useFrame((state) => {
    particlesRef.current.forEach((particleRef, i) => {
      if (particleRef.current) {
        const t = state.clock.getElapsedTime()
        particleRef.current.position.y = Math.sin(t * speed + i) * amplitude
        particleRef.current.position.x = Math.cos(t * speed + i) * amplitude
        particleRef.current.rotation.x = Math.sin(t * speed + i) * rotationSpeed
        particleRef.current.rotation.y = Math.cos(t * speed + i) * rotationSpeed
      }
    })
  })

  return {
    particlesRef,
    spread
  }
} 