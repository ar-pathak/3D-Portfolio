import { useSpring } from '@react-spring/three'

export const useSpringAnimation = (config = {}) => {
  const defaultConfig = {
    mass: 1,
    tension: 280,
    friction: 60,
    ...config
  }

  return useSpring(defaultConfig)
} 