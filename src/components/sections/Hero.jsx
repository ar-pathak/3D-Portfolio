import { Suspense, useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ShimmerCard } from '../common/Shimmer'
import HeroBackground from '../3d/HeroBackground'
import HeroContent from './HeroContent'
import { useComponentLoading } from '../../hooks/useComponentLoading'

const Hero = () => {
  const { isDarkMode } = useTheme()
  const { isLoading, error, handleError } = useComponentLoading(1500)

  useEffect(() => {
    try {
      // Any additional initialization logic can go here
    } catch (err) {
      handleError(err)
    }
  }, [handleError])

  if (error) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
            <div className="flex justify-center gap-4">
              <ShimmerCard />
              <ShimmerCard />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Suspense fallback={<div className={`absolute inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} />}>
        <HeroBackground />
      </Suspense>
      <HeroContent />
    </section>
  )
}

export default Hero 