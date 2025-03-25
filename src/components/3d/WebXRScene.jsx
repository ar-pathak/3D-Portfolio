import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, Controllers, Hands } from '@react-three/xr'
import VRButton from './vr/VRButton'
import VRObjects from './vr/VRObjects'
import VREnvironment from './vr/VREnvironment'
import LoadingState from '../common/LoadingState'
import ErrorState from '../common/ErrorState'
import useVRSupport from '../../hooks/useVRSupport'

const VRContent = () => (
  <Suspense fallback={<LoadingState />}>
    <VREnvironment />
    <VRObjects />
  </Suspense>
)

const WebXRScene = () => {
  const { isVRSupported, isVRInitialized, error, retryInitialization } = useVRSupport()

  if (error) {
    return <ErrorState message={error} onRetry={retryInitialization} />
  }

  if (!isVRInitialized) {
    return <LoadingState />
  }

  if (!isVRSupported) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-300">VR is not supported on your device</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-full">
      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 75 }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
          xrCompatible: true
        }}
      >
        <XR>
          <Controllers />
          <Hands />
          <VRContent />
        </XR>
      </Canvas>
      <VRButton
        onClick={() => {
          try {
            const vrButton = document.querySelector('button.VRButton')
            if (vrButton) {
              vrButton.click()
            }
          } catch (err) {
            console.error('Failed to enter VR:', err)
          }
        }}
      />
    </div>
  )
}

export default WebXRScene 