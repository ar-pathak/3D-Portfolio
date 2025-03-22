import { Canvas } from '@react-three/fiber'
import { Stars, Float, OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const AnimatedStars = () => {
  const starsRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    starsRef.current.rotation.x = Math.sin(t / 10) / 10
    starsRef.current.rotation.y = Math.cos(t / 10) / 10
  })

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <Stars
        ref={starsRef}
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </Float>
  )
}

const Background = () => {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedStars />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}

export default Background 