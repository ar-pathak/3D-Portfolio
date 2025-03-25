import { Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import Header from './Header'
import Footer from './Footer'
import { components } from '../../utils/componentLoader.jsx'
import { LoadingFallback, ScrollProgressFallback, WebXRFallback } from '../common/Fallbacks'

const MainContent = () => {
  const { isDarkMode } = useTheme()
  const [isVRSupported, setIsVRSupported] = useState(false)
  
  useEffect(() => {
    const checkVRSupport = async () => {
      if ('xr' in navigator) {
        const supported = await navigator.xr.isSessionSupported('immersive-vr')
        setIsVRSupported(supported)
      }
    }
    checkVRSupport()
  }, [])
  
  return (
    <div className={`relative w-full min-h-screen overflow-x-hidden ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <Suspense fallback={<LoadingFallback />}>
        <components.CustomCursor />
      </Suspense>
      <Suspense fallback={<ScrollProgressFallback />}>
        <components.ScrollProgress />
      </Suspense>
      <Header />
      <main className="relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <>
                  <components.Hero />
                  <components.About />
                  <components.Projects />
                  <components.Contact />
                </>
              </Suspense>
            }
          />
          <Route 
            path="/projects" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <components.ProjectsPage />
              </Suspense>
            } 
          />
        </Routes>
      </main>
      <Footer />
      {isVRSupported && (
        <Suspense fallback={<WebXRFallback />}>
          <components.WebXRScene />
        </Suspense>
      )}
    </div>
  )
}

export default MainContent 