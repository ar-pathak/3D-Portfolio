import { createContext, useContext, useState, useEffect } from 'react'

const VRSupportContext = createContext()

export const useVRSupport = () => {
  const context = useContext(VRSupportContext)
  if (!context) {
    throw new Error('useVRSupport must be used within a VRSupportProvider')
  }
  return context
}

export const VRSupportProvider = ({ children }) => {
  const [isVRSupported, setIsVRSupported] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkVRSupport = async () => {
      try {
        if ('xr' in navigator) {
          const supported = await navigator.xr.isSessionSupported('immersive-vr')
          setIsVRSupported(supported)
        }
      } catch (error) {
        console.error('Error checking VR support:', error)
        setIsVRSupported(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkVRSupport()
  }, [])

  const value = {
    isVRSupported,
    isLoading
  }

  return (
    <VRSupportContext.Provider value={value}>
      {children}
    </VRSupportContext.Provider>
  )
} 