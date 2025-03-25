import { useEffect, useRef } from 'react'
import { useAnimation, animations } from './useAnimation'
import { isInViewport, debounce } from '../utils/common'

export const useScrollAnimation = (options = {}) => {
  const {
    threshold = 0.1,
    animation = animations.fadeIn,
    duration = 500,
    delay = 0,
    once = true,
    onVisible,
    onHidden
  } = options

  const { elementRef, animate, stop } = useAnimation({
    duration,
    delay
  })

  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleScroll = debounce(() => {
      const isVisible = isInViewport(element, threshold)

      if (isVisible && (!once || !hasAnimated.current)) {
        animate(animation)
        hasAnimated.current = true
        onVisible?.()
      } else if (!isVisible) {
        stop()
        onHidden?.()
      }
    }, 100)

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
      stop()
    }
  }, [threshold, animation, duration, delay, once, onVisible, onHidden])

  return {
    elementRef
  }
}

// Scroll-based animation variants
export const scrollAnimations = {
  fadeInUp: [
    { transform: 'translateY(20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  fadeInDown: [
    { transform: 'translateY(-20px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 }
  ],
  fadeInLeft: [
    { transform: 'translateX(-20px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ],
  fadeInRight: [
    { transform: 'translateX(20px)', opacity: 0 },
    { transform: 'translateX(0)', opacity: 1 }
  ],
  scaleIn: [
    { transform: 'scale(0.95)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 }
  ],
  rotateIn: [
    { transform: 'rotate(-180deg) scale(0)', opacity: 0 },
    { transform: 'rotate(0) scale(1)', opacity: 1 }
  ]
} 