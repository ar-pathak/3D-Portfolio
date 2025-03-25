import { useAnimation, useInView } from 'framer-motion'
import { useEffect } from 'react'

export const useFramerMotion = (options = {}) => {
  const {
    initial = 'hidden',
    animate = 'visible',
    exit = 'hidden',
    variants,
    transition = { duration: 0.5 },
    threshold = 0.1,
    once = true
  } = options

  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once
  })

  useEffect(() => {
    if (inView) {
      controls.start(animate)
    }
  }, [controls, inView, animate])

  return {
    ref,
    controls,
    initial,
    animate,
    exit,
    variants,
    transition
  }
}

// Framer Motion utility functions
export const framerMotion = {
  // Animation variants
  variants: {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    slideDown: {
      hidden: { y: -20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    slideLeft: {
      hidden: { x: 20, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    },
    slideRight: {
      hidden: { x: -20, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 }
    },
    rotate: {
      hidden: { rotate: -180, scale: 0 },
      visible: { rotate: 0, scale: 1 }
    }
  },

  // Transition presets
  transitions: {
    default: { duration: 0.5 },
    fast: { duration: 0.2 },
    slow: { duration: 0.8 },
    spring: { type: 'spring', stiffness: 100 },
    bounce: { type: 'spring', stiffness: 200, damping: 10 },
    easeIn: { type: 'tween', ease: 'easeIn' },
    easeOut: { type: 'tween', ease: 'easeOut' },
    easeInOut: { type: 'tween', ease: 'easeInOut' }
  },

  // Gesture variants
  gestures: {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    drag: {
      scale: 1.1,
      transition: { duration: 0.2 }
    }
  },

  // Layout variants
  layouts: {
    list: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    grid: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }
  },

  // Page transitions
  pageTransitions: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '-100%' }
    },
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    }
  }
}

// Framer Motion manager
export class FramerMotionManager {
  constructor() {
    this.animations = new Map()
  }

  registerAnimation(id, animation) {
    this.animations.set(id, animation)
  }

  getAnimation(id) {
    return this.animations.get(id)
  }

  removeAnimation(id) {
    this.animations.delete(id)
  }

  clear() {
    this.animations.clear()
  }
}

// Create a singleton instance
export const framerMotionManager = new FramerMotionManager() 