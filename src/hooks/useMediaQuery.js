import { useState, useEffect } from 'react'

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Media query utility functions
export const mediaQueries = {
  // Breakpoint queries
  breakpoints: {
    xs: '(max-width: 639px)',
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)'
  },

  // Device queries
  devices: {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
    retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
    touch: '(hover: none) and (pointer: coarse)',
    mouse: '(hover: hover) and (pointer: fine)'
  },

  // Feature queries
  features: {
    darkMode: '(prefers-color-scheme: dark)',
    lightMode: '(prefers-color-scheme: light)',
    reducedMotion: '(prefers-reduced-motion: reduce)',
    highContrast: '(prefers-contrast: high)',
    lowContrast: '(prefers-contrast: low)',
    portrait: '(orientation: portrait)',
    landscape: '(orientation: landscape)'
  },

  // Custom queries
  custom: {
    // Aspect ratio queries
    aspectRatio: {
      square: '(aspect-ratio: 1/1)',
      portrait: '(aspect-ratio: 3/4)',
      landscape: '(aspect-ratio: 16/9)',
      wide: '(aspect-ratio: 21/9)'
    },

    // Print queries
    print: {
      print: 'print',
      screen: 'screen'
    },

    // Animation queries
    animation: {
      prefersReducedMotion: '(prefers-reduced-motion: reduce)',
      prefersReducedTransparency: '(prefers-reduced-transparency: reduce)'
    },

    // Color queries
    color: {
      color: '(color)',
      monochrome: '(monochrome)',
      colorGamut: {
        srgb: '(color-gamut: srgb)',
        p3: '(color-gamut: p3)',
        rec2020: '(color-gamut: rec2020)'
      }
    },

    // Display queries
    display: {
      grid: '(display: grid)',
      flexbox: '(display: flex)',
      hover: '(hover: hover)',
      anyHover: '(any-hover: hover)',
      pointer: '(pointer: fine)',
      anyPointer: '(any-pointer: fine)'
    }
  }
}

// Media query manager
export class MediaQueryManager {
  constructor() {
    this.queries = new Map()
  }

  addQuery(query, callback) {
    const media = window.matchMedia(query)
    const listener = (e) => callback(e.matches)
    
    media.addEventListener('change', listener)
    this.queries.set(query, { media, listener })
    
    return () => this.removeQuery(query)
  }

  removeQuery(query) {
    const queryData = this.queries.get(query)
    if (queryData) {
      queryData.media.removeEventListener('change', queryData.listener)
      this.queries.delete(query)
    }
  }

  clear() {
    this.queries.forEach(({ media, listener }) => {
      media.removeEventListener('change', listener)
    })
    this.queries.clear()
  }
}

// Create a singleton instance
export const mediaQueryManager = new MediaQueryManager() 