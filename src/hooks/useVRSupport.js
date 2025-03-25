import { useState, useEffect } from 'react'

const useVRSupport = () => {
  const [isVRSupported, setIsVRSupported] = useState(false)
  const [isVRInitialized, setIsVRInitialized] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeVR = async () => {
      try {
        if (!window.navigator.xr) {
          throw new Error('WebXR not supported')
        }

        const supported = await navigator.xr.isSessionSupported('immersive-vr')
        if (!supported) {
          throw new Error('VR not supported on this device')
        }

        setIsVRSupported(true)
        setIsVRInitialized(true)
      } catch (err) {
        console.error('VR initialization error:', err)
        setError(err.message || 'Failed to initialize VR')
      }
    }

    initializeVR()
  }, [])

  return {
    isVRSupported,
    isVRInitialized,
    error,
    retryInitialization: () => window.location.reload()
  }
}

export default useVRSupport 