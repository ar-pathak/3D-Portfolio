import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Html } from '@react-three/drei'
import * as THREE from 'three'
import { random } from 'maath'

const LoadingState = () => (
  <Html center>
    <div className="relative w-32 h-32 overflow-hidden rounded-lg bg-gray-800/50">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </div>
  </Html>
)

const ParticleBackground = () => {
  const ref = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const count = 2000 // Reduced from 5000 for better performance
  
  // Memoize positions calculation
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    random.inSphere(positions, { radius: 1.5 })
    return positions
  }, [count])

  // Optimize frame updates
  useFrame((state, delta) => {
    if (!ref.current) return
    
    // Reduce rotation speed for better performance
    ref.current.rotation.x -= delta / 20
    ref.current.rotation.y -= delta / 30
  })

  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={positions} 
        stride={3} 
        frustumCulled={false}
        // Add performance optimizations
        renderOrder={-1}
        depthWrite={false}
        depthTest={false}
      >
        <PointMaterial
          transparent
          color="#88ccff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          // Add performance optimizations
          blending={THREE.AdditiveBlending}
          vertexColors={false}
        />
      </Points>
    </group>
  )
}

export default ParticleBackground 