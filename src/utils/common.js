// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Theme colors
export const THEME_COLORS = {
  light: {
    primary: '#3B82F6',
    secondary: '#10B981',
    background: '#FFFFFF',
    text: '#1F2937',
    accent: '#8B5CF6'
  },
  dark: {
    primary: '#60A5FA',
    secondary: '#34D399',
    background: '#111827',
    text: '#F9FAFB',
    accent: '#A78BFA'
  }
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Check if element is in viewport
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Smooth scroll to element
export const scrollToElement = (element, offset = 0) => {
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

// Handle keyboard navigation
export const handleKeyboardNavigation = (event, options) => {
  const { onNext, onPrevious, onSelect } = options

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault()
      onNext?.()
      break
    case 'ArrowLeft':
      event.preventDefault()
      onPrevious?.()
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      onSelect?.()
      break
    default:
      break
  }
} 