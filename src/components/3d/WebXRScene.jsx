import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { VRButton, XR, Controllers, Hands } from '@react-three/xr'
import { Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

const VRScene = () => {
  const [isVRSupported, setIsVRSupported] = useState(false)

  useEffect(() => {
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setIsVRSupported(supported)
      })
    }
  }, [])

  if (!isVRSupported) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-300">VR is not supported on your device</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-full">
      <Canvas>
        <XR>
          <Controllers />
          <Hands />
          <Suspense fallback={null}>
            <Environment preset="sunset" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#64ffda" />
            </mesh>
            <OrbitControls />
          </Suspense>
        </XR>
      </Canvas>
      <VRButton
        className="absolute bottom-4 right-4"
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '0.5rem',
          background: '#64ffda',
          color: '#0a192f',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold',
        }}
      />
    </div>
  )
}

export default VRScene 