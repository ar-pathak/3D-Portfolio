import { ShimmerCard } from './Shimmer'

export const LoadingFallback = () => (
  <div className="space-y-8">
    <ShimmerCard />
    <ShimmerCard />
    <ShimmerCard />
    <ShimmerCard />
  </div>
)

export const ScrollProgressFallback = () => (
  <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800">
    <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
  </div>
)

export const WebXRFallback = () => (
  <div className="fixed inset-0 bg-gray-900/50">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
  </div>
) 