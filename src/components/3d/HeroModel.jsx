import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { motion } from 'framer-motion-3d'

export default function HeroModel() {
  const group = useRef()
  const { nodes, materials } = useGLTF('/models/hero.glb')

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.y = Math.sin(t / 4) / 8
  })

  return (
    <motion.group
      ref={group}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
      position={[0, 0, 0]}
    >
      <mesh
        geometry={nodes.Cube.geometry}
        material={materials.Material}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#64ffda"
          metalness={0.5}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </motion.group>
  )
} 