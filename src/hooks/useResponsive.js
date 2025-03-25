import { useState, useEffect } from 'react'
import { BREAKPOINTS } from '../utils/common'

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const [breakpoint, setBreakpoint] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial size

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const width = windowSize.width

    if (width < BREAKPOINTS.SM) {
      setBreakpoint('xs')
    } else if (width < BREAKPOINTS.MD) {
      setBreakpoint('sm')
    } else if (width < BREAKPOINTS.LG) {
      setBreakpoint('md')
    } else if (width < BREAKPOINTS.XL) {
      setBreakpoint('lg')
    } else if (width < BREAKPOINTS['2XL']) {
      setBreakpoint('xl')
    } else {
      setBreakpoint('2xl')
    }
  }, [windowSize.width])

  const isMobile = breakpoint === 'xs' || breakpoint === 'sm'
  const isTablet = breakpoint === 'md'
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl'

  return {
    windowSize,
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallerThan: (size) => windowSize.width < BREAKPOINTS[size],
    isLargerThan: (size) => windowSize.width >= BREAKPOINTS[size]
  }
}

// Responsive utility functions
export const responsive = {
  // Media query helpers
  mobile: `@media (max-width: ${BREAKPOINTS.SM - 1}px)`,
  tablet: `@media (min-width: ${BREAKPOINTS.SM}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.LG}px)`,
  
  // Breakpoint helpers
  sm: `@media (min-width: ${BREAKPOINTS.SM}px)`,
  md: `@media (min-width: ${BREAKPOINTS.MD}px)`,
  lg: `@media (min-width: ${BREAKPOINTS.LG}px)`,
  xl: `@media (min-width: ${BREAKPOINTS.XL}px)`,
  '2xl': `@media (min-width: ${BREAKPOINTS['2XL']}px)`,
  
  // Container widths
  container: {
    sm: `${BREAKPOINTS.SM}px`,
    md: `${BREAKPOINTS.MD}px`,
    lg: `${BREAKPOINTS.LG}px`,
    xl: `${BREAKPOINTS.XL}px`,
    '2xl': `${BREAKPOINTS['2XL']}px`
  }
} 