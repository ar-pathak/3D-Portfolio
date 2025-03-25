import { lazy } from 'react'
import { ShimmerCard } from '../components/common/Shimmer'

// Error fallback component
const ErrorFallback = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Failed to load component</h2>
      <p className="text-gray-500 mb-4">Error: {error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Retry
      </button>
    </div>
  </div>
)

// Lazy load component with error handling
export const lazyLoad = (Component, fallback = <ShimmerCard />) => {
  return lazy(async () => {
    try {
      const module = await Component();
      return module.default ? module : { default: module };
    } catch (error) {
      console.error('Error loading component:', error);
      return {
        default: () => <ErrorFallback error={error} />
      };
    }
  });
}

// Preload component with fallback
export const preloadComponent = (Component, fallback = <ShimmerCard />) => {
  const LazyComponent = lazyLoad(Component, fallback)
  // Start preloading
  Component()
  return LazyComponent
}

// Component registry
export const components = {
  Hero: preloadComponent(() => import('../components/sections/Hero')),
  About: preloadComponent(() => import('../components/sections/About')),
  Projects: preloadComponent(() => import('../components/sections/Projects')),
  Contact: preloadComponent(() => import('../components/sections/Contact')),
  ProjectsPage: preloadComponent(() => import('../pages/Projects')),
  CustomCursor: preloadComponent(() => import('../components/3d/CustomCursor')),
  ScrollProgress: preloadComponent(() => import('../components/3d/ScrollProgress')),
  WebXRScene: preloadComponent(() => import('../components/3d/WebXRScene'))
} 