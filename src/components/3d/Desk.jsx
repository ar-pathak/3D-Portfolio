import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { useTheme } from '../../hooks/useTheme'
import { useSpringAnimation } from './hooks/useSpringAnimation'
import { createThemeAwareMaterial } from './utils/materials'
import { createHoverAnimation, createClickAnimation } from './utils/animations'
import { COLORS, POSITIONS, ROTATIONS, SCALES } from './constants'
import { THEME, MATERIALS } from '../../constants/theme'

export const Desk = ({ isActive, onClick }) => {
  const meshRef = useRef()
  const { isDarkMode } = useTheme()
  const spring = useSpringAnimation()

  const material = createThemeAwareMaterial(
    THEME.DARK.DESK,
    THEME.LIGHT.DESK,
    { isDarkMode, ...MATERIALS.DESK }
  )

  const hoverSpring = useSpring(createHoverAnimation())
  const clickSpring = useSpring(createClickAnimation())

  useFrame((state) => {
    if (isActive) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <animated.mesh
      ref={meshRef}
      position={spring.position}
      rotation={spring.rotation}
      scale={spring.scale}
      onClick={onClick}
      onPointerOver={() => hoverSpring.scale.start(SCALES.desk.active)}
      onPointerOut={() => hoverSpring.scale.start(SCALES.desk.default)}
      onPointerDown={() => clickSpring.scale.start(SCALES.desk.default)}
      onPointerUp={() => clickSpring.scale.start(SCALES.desk.active)}
    >
      <boxGeometry args={[2, 0.1, 1]} />
      <meshStandardMaterial {...material} />
    </animated.mesh>
  )
} 