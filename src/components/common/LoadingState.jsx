import React from 'react'
import { Html } from '@react-three/drei'

const LoadingState = () => {
  return (
    <Html center>
      <div className="relative w-32 h-32 overflow-hidden rounded-lg bg-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    </Html>
  )
}

export default LoadingState 