import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTheme } from '../../hooks/useTheme'
import { Workspace } from './Workspace'
import { COLORS } from './constants'

export const SceneManager = () => {
  const { isDarkMode } = useTheme()

  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 75 }}
      style={{ background: isDarkMode ? COLORS.dark.primary : COLORS.light.primary }}
    >
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
      <Workspace />
    </Canvas>
  )
} 