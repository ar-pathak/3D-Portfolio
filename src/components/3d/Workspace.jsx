import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { Computer } from './Computer'
import { Desk } from './Desk'
import { COLORS } from './constants'

export const Workspace = () => {
  const [activeObject, setActiveObject] = useState(null)
  const { isDarkMode } = useTheme()

  const handleObjectClick = (object) => {
    setActiveObject(activeObject === object ? null : object)
  }

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Computer
        isActive={activeObject === 'computer'}
        onClick={() => handleObjectClick('computer')}
      />
      <Desk
        isActive={activeObject === 'desk'}
        onClick={() => handleObjectClick('desk')}
      />
      <mesh position={[0, -2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color={isDarkMode ? COLORS.dark.primary : COLORS.light.primary}
        />
      </mesh>
    </group>
  )
} 