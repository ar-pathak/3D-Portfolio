import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useSpring, animated } from '@react-spring/three'
import { Suspense } from 'react'

const AnimatedMesh = () => {
  const springs = useSpring({
    scale: 1.2,
    config: { mass: 1, tension: 280, friction: 60 }
  })
  
  return (
    <animated.mesh scale={springs.scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#64ffda" />
    </animated.mesh>
  )
}

const LoadingFallback = () => (
  <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)

const Project3DPreview = ({ project }) => {
  return (
    <div className="h-48 w-full">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedMesh />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default Project3DPreview 