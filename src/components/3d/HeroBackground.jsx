import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import ParticleBackground from './ParticleBackground'
import { useTheme } from '../../hooks/useTheme'

const HeroBackground = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ 
          antialias: false, 
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ParticleBackground />
          <Stars 
            radius={100} 
            depth={50} 
            count={2000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
            color={isDarkMode ? '#ffffff' : '#000000'}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HeroBackground 