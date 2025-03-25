import React, { useMemo } from 'react'
import { Environment, OrbitControls } from '@react-three/drei'
import { useTheme } from '../../../hooks/useTheme'

const VREnvironment = () => {
  const { isDarkMode } = useTheme()
  const environmentPreset = useMemo(() => 
    isDarkMode ? "night" : "sunset", 
    [isDarkMode]
  )

  return (
    <>
      <Environment preset={environmentPreset} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enableDamping={false}
        rotateSpeed={0.5}
      />
    </>
  )
}

export default VREnvironment 