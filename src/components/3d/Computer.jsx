import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { useTheme } from '../../hooks/useTheme'
import { useSpringAnimation } from './hooks/useSpringAnimation'
import { createThemeAwareMaterial } from './utils/materials'
import { createHoverAnimation, createClickAnimation } from './utils/animations'
import { COLORS, POSITIONS, ROTATIONS, SCALES } from './constants'
import { THEME, MATERIALS } from '../../constants/theme'

export const Computer = ({ isActive, onClick }) => {
  const meshRef = useRef()
  const { isDarkMode } = useTheme()
  const spring = useSpringAnimation()

  const material = createThemeAwareMaterial(
    THEME.DARK.COMPUTER,
    THEME.LIGHT.COMPUTER,
    { isDarkMode, ...MATERIALS.COMPUTER }
  )

  const hoverSpring = useSpring(createHoverAnimation())
  const clickSpring = useSpring(createClickAnimation())

  useFrame((state) => {
    if (isActive) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <animated.mesh
      ref={meshRef}
      position={spring.position}
      rotation={spring.rotation}
      scale={spring.scale}
      onClick={onClick}
      onPointerOver={() => hoverSpring.scale.start(SCALES.computer.active)}
      onPointerOut={() => hoverSpring.scale.start(SCALES.computer.default)}
      onPointerDown={() => clickSpring.scale.start(SCALES.computer.default)}
      onPointerUp={() => clickSpring.scale.start(SCALES.computer.active)}
    >
      <boxGeometry args={[1, 0.5, 0.5]} />
      <meshStandardMaterial {...material} />
    </animated.mesh>
  )
} 