import { useEffect, useRef } from 'react'
import { ANIMATION_DURATIONS } from '../utils/common'

export const useAnimation = (options = {}) => {
  const {
    duration = ANIMATION_DURATIONS.NORMAL,
    delay = 0,
    easing = 'ease-in-out',
    onComplete,
    onStart
  } = options

  const elementRef = useRef(null)
  const animationRef = useRef(null)

  const animate = (keyframes) => {
    if (!elementRef.current) return

    const element = elementRef.current
    const animation = element.animate(keyframes, {
      duration,
      delay,
      easing,
      fill: 'forwards'
    })

    animationRef.current = animation

    animation.onfinish = () => {
      onComplete?.()
    }

    animation.onstart = () => {
      onStart?.()
    }

    return animation
  }

  const stop = () => {
    if (animationRef.current) {
      animationRef.current.cancel()
      animationRef.current = null
    }
  }

  const pause = () => {
    if (animationRef.current) {
      animationRef.current.pause()
    }
  }

  const resume = () => {
    if (animationRef.current) {
      animationRef.current.play()
    }
  }

  useEffect(() => {
    return () => {
      stop()
    }
  }, [])

  return {
    elementRef,
    animate,
    stop,
    pause,
    resume
  }
}

// Predefined animations
export const animations = {
  fadeIn: [
    { opacity: 0 },
    { opacity: 1 }
  ],
  fadeOut: [
    { opacity: 1 },
    { opacity: 0 }
  ],
  slideIn: [
    { transform: 'translateY(20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  slideOut: [
    { transform: 'translateY(0)', opacity: 1 },
    { transform: 'translateY(20px)', opacity: 0 }
  ],
  scaleIn: [
    { transform: 'scale(0.95)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 }
  ],
  scaleOut: [
    { transform: 'scale(1)', opacity: 1 },
    { transform: 'scale(0.95)', opacity: 0 }
  ],
  rotateIn: [
    { transform: 'rotate(-180deg) scale(0)', opacity: 0 },
    { transform: 'rotate(0) scale(1)', opacity: 1 }
  ],
  rotateOut: [
    { transform: 'rotate(0) scale(1)', opacity: 1 },
    { transform: 'rotate(180deg) scale(0)', opacity: 0 }
  ]
} 