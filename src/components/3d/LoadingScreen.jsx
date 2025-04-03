import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { useTheme } from '../../hooks/useTheme'

const LoadingAnimation = () => {
  const { progress } = useProgress()
  const { isDarkMode } = useTheme()
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360)
    }, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex flex-col items-center">
      {/* 3D cube animation */}
      <div 
        className="w-16 h-16 mb-8"
        style={{
          perspective: '800px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="relative w-full h-full"
          style={{
            transform: `rotateX(${rotation}deg) rotateY(${rotation * 0.7}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front face */}
          <div 
            className="absolute w-full h-full bg-blue-500/80 backdrop-blur-md"
            style={{
              transform: 'translateZ(32px)',
            }}
          />
          {/* Back face */}
          <div 
            className="absolute w-full h-full bg-purple-500/80 backdrop-blur-md"
            style={{
              transform: 'translateZ(-32px) rotateY(180deg)',
            }}
          />
          {/* Left face */}
          <div 
            className="absolute w-full h-full bg-pink-500/80 backdrop-blur-md"
            style={{
              transform: 'translateX(-32px) rotateY(-90deg)',
              width: '64px',
              left: '-16px',
            }}
          />
          {/* Right face */}
          <div 
            className="absolute w-full h-full bg-indigo-500/80 backdrop-blur-md"
            style={{
              transform: 'translateX(32px) rotateY(90deg)',
              width: '64px',
              left: '-16px',
            }}
          />
          {/* Top face */}
          <div 
            className="absolute w-full h-full bg-sky-500/80 backdrop-blur-md"
            style={{
              transform: 'translateY(-32px) rotateX(90deg)',
              height: '64px',
              top: '-16px',
            }}
          />
          {/* Bottom face */}
          <div 
            className="absolute w-full h-full bg-violet-500/80 backdrop-blur-md"
            style={{
              transform: 'translateY(32px) rotateX(-90deg)',
              height: '64px',
              top: '-16px',
            }}
          />
        </div>
      </div>

      {/* Progress text */}
      <div className="text-center font-mono">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-2"
          style={{ width: '200px' }}
        />
        <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading {Math.round(progress)}%
        </p>
      </div>
    </div>
  )
}

const LoadingScreen = () => {
  const { isDarkMode } = useTheme()
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <LoadingAnimation />
        
        <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`mt-8 text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Preparing 3D Experience{dots}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className={`mt-4 max-w-sm mx-auto ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Creating an immersive journey through interactive design and development
        </motion.p>
      </motion.div>
    </div>
  )
}

export default LoadingScreen 