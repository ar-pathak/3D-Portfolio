import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'
import { useResponsive } from '../../App'

const CustomCursor = () => {
  const { isDarkMode } = useTheme()
  const responsive = useResponsive()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [scale, setScale] = useState(1)
  const [elementType, setElementType] = useState('default')
  const [trailPositions, setTrailPositions] = useState([])
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  
  // Use values from the responsive context
  const isMobile = responsive?.isMobile || false
  const isTablet = responsive?.isTablet || false
  const isTouchDevice = responsive?.isTouchDevice || false
  const prefersReducedMotion = responsive?.prefersReducedMotion || false
  const windowWidth = responsive?.windowWidth || 1200
  
  // Adjust trail length based on device performance
  const devicePerformance = responsive?.devicePerformance || 'high'
  const baseTrailLength = devicePerformance === 'low' ? 3 : devicePerformance === 'medium' ? 4 : 5
  const trailLength = prefersReducedMotion ? 0 : baseTrailLength
  
  // Handle mouse movement
  useEffect(() => {
    // Skip for mobile, touch devices, or reduced motion
    if (isMobile || isTouchDevice || prefersReducedMotion) {
      return;
    }
    
    const updatePosition = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY }
      setPosition(newPosition)
      
      // Update trail positions
      setTrailPositions(prev => {
        const newTrail = [newPosition, ...prev.slice(0, trailLength - 1)]
        return newTrail
      })
    }
    
    window.addEventListener('mousemove', updatePosition)
    
    return () => {
      window.removeEventListener('mousemove', updatePosition)
    }
  }, [trailLength, isMobile, isTouchDevice, prefersReducedMotion])
  
  // Handle cursor style changes based on hovered elements
  useEffect(() => {
    // Skip for mobile, touch devices, or reduced motion
    if (isMobile || isTouchDevice || prefersReducedMotion) {
      return;
    }
    
    const handlePointerEvents = () => {
      const hoveredElements = document.querySelectorAll(':hover')
      
      // Check if hovering over interactive elements
      const isHoveringInteractive = Array.from(hoveredElements).some(el => {
        const tagName = el.tagName.toLowerCase()
        const isClickable = window.getComputedStyle(el).cursor === 'pointer'
        return ['a', 'button', 'input', 'select', 'textarea'].includes(tagName) || isClickable
      })
      
      setIsPointer(isHoveringInteractive)
      
      // Determine element type for custom cursor behavior
      const headings = Array.from(hoveredElements).some(el => {
        const tagName = el.tagName.toLowerCase()
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)
      })
      
      const images = Array.from(hoveredElements).some(el => {
        const tagName = el.tagName.toLowerCase()
        return ['img', 'svg', 'canvas'].includes(tagName)
      })
      
      const links = Array.from(hoveredElements).some(el => {
        const tagName = el.tagName.toLowerCase()
        return ['a'].includes(tagName)
      })
      
      const inputs = Array.from(hoveredElements).some(el => {
        const tagName = el.tagName.toLowerCase()
        return ['input', 'textarea'].includes(tagName)
      })
      
      // Set element type
      if (headings) {
        setElementType('heading')
        setScale(1.5)
      } else if (images) {
        setElementType('image')
        setScale(1.2)
      } else if (links) {
        setElementType('link')
        setScale(0.8)
      } else if (inputs) {
        setElementType('input')
        setScale(0.5)
      } else if (isHoveringInteractive) {
        setElementType('interactive')
        setScale(0.8)
      } else {
        setElementType('default')
        setScale(1)
      }
    }
    
    // Check for cursor visibility when mouse leaves window
    const handleMouseLeave = () => setIsHidden(true)
    const handleMouseEnter = () => setIsHidden(false)
    
    // Handle mouse click states
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    
    const checkCursorInterval = setInterval(handlePointerEvents, 50)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseenter', handleMouseEnter)
    
    return () => {
      clearInterval(checkCursorInterval)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isMobile, isTouchDevice, prefersReducedMotion])
  
  // Mouse follower animation
  useEffect(() => {
    // Skip for mobile, touch devices, or reduced motion
    if (isMobile || isTouchDevice || prefersReducedMotion) {
      return;
    }
    
    const moveCursor = () => {
      if (cursorRef.current && cursorDotRef.current) {
        // Outer ring follows with slight delay for trailing effect
        cursorRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`
        
        // Inner dot follows cursor exactly
        cursorDotRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`
      }
    }
    
    requestAnimationFrame(moveCursor)
  }, [position, scale, isMobile, isTouchDevice, prefersReducedMotion])
  
  // Generate cursor style based on element type
  const getCursorStyle = () => {
    // Optimize cursor size based on screen width
    const baseSize = windowWidth < 1200 ? 6 : 8; // Smaller on medium screens
    
    // Common styles with responsive sizing
    const commonStyles = {
      width: `${baseSize * scale}px`,
      height: `${baseSize * scale}px`,
      marginLeft: `-${baseSize / 2}px`,
      marginTop: `-${baseSize / 2}px`,
    };
    
    switch (elementType) {
      case 'heading':
        return {
          ...commonStyles,
          borderRadius: '4px',
          border: `2px solid ${isDarkMode ? '#8B5CF6' : '#4F46E5'}`,
          background: 'transparent',
          mixBlendMode: 'difference'
        }
      case 'image':
        return {
          ...commonStyles,
          borderRadius: '50%',
          border: `2px dashed ${isDarkMode ? '#EC4899' : '#DB2777'}`,
          background: 'rgba(236, 72, 153, 0.1)',
          mixBlendMode: 'normal'
        }
      case 'link':
        return {
          ...commonStyles,
          borderRadius: '50%',
          border: `2px solid ${isDarkMode ? '#64ffda' : '#0D9488'}`,
          background: 'rgba(20, 184, 166, 0.1)',
          mixBlendMode: 'normal'
        }
      case 'input':
        return {
          ...commonStyles,
          borderRadius: '4px',
          border: `2px solid ${isDarkMode ? '#38BDF8' : '#0EA5E9'}`,
          background: 'transparent',
          mixBlendMode: 'normal'
        }
      case 'interactive':
        return {
          ...commonStyles,
          borderRadius: '50%',
          border: `2px solid ${isDarkMode ? '#64ffda' : '#0D9488'}`,
          background: 'transparent',
          mixBlendMode: 'difference'
        }
      default:
        return {
          ...commonStyles,
          borderRadius: '50%',
          border: `2px solid ${isDarkMode ? '#ffffff' : '#000000'}`,
          background: 'transparent',
          mixBlendMode: 'difference'
        }
    }
  }
  
  const cursorStyle = getCursorStyle()
  
  // Check for SSR or if the cursor should be hidden
  if (typeof window === 'undefined' || isMobile || isTouchDevice || prefersReducedMotion) {
    return null;
  }
  
  // Custom cursor CSS styles
  const globalStyles = `
    * {
      cursor: none !important;
    }
    
    @media (max-width: 768px), (pointer: coarse) {
      * {
        cursor: auto !important;
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      /* Simplified animations for users who prefer reduced motion */
      .cursor-trail {
        display: none !important;
      }
    }
  `;
  
  // Simplify rendering for tablet devices
  const simplifiedMode = isTablet || devicePerformance === 'medium';
  
  return (
    <>
      {/* Cursor trail effect - only if enabled for this device */}
      {trailLength > 0 && trailPositions.length > 0 && trailPositions.map((pos, index) => (
        <motion.div
          key={`trail-${index}`}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] cursor-trail"
          style={{
            width: `${Math.max(4, 8 - index * 1.5)}px`,
            height: `${Math.max(4, 8 - index * 1.5)}px`,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
            opacity: simplifiedMode ? 0.6 - (index / trailLength * 0.5) : 1 - (index / trailLength),
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            marginLeft: `-${Math.max(2, 4 - index * 0.75)}px`,
            marginTop: `-${Math.max(2, 4 - index * 0.75)}px`,
          }}
        />
      ))}
      
      {/* Main cursor ring */}
      <motion.div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          ...cursorStyle,
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: 'opacity 0.3s ease, transform 0.1s cubic-bezier(0.23, 1, 0.32, 1), width 0.2s ease, height 0.2s ease',
        }}
      >
        {isPointer && !simplifiedMode && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs whitespace-nowrap"
            style={{
              color: elementType === 'link' || elementType === 'interactive' ? '#64ffda' : 'white',
              textShadow: '0 0 3px rgba(0,0,0,0.5)',
              fontWeight: 'bold',
              fontSize: windowWidth < 1200 ? '0.65rem' : '0.75rem'
            }}
          >
            {isClicking ? 'Click!' : elementType === 'link' ? 'Open' : 'Interact'}
          </motion.div>
        )}

        {/* Animated elements for different cursor types - simplified for medium performance */}
        {elementType === 'heading' && !simplifiedMode && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-1 h-1 rounded-full bg-purple-500 absolute top-0 left-1/2 transform -translate-x-1/2" />
            <div className="w-1 h-1 rounded-full bg-purple-500 absolute bottom-0 left-1/2 transform -translate-x-1/2" />
            <div className="w-1 h-1 rounded-full bg-purple-500 absolute left-0 top-1/2 transform -translate-y-1/2" />
            <div className="w-1 h-1 rounded-full bg-purple-500 absolute right-0 top-1/2 transform -translate-y-1/2" />
          </motion.div>
        )}

        {elementType === 'image' && !simplifiedMode && (
          <svg 
            viewBox="0 0 24 24" 
            className="absolute inset-0 w-full h-full p-1.5" 
            stroke={isDarkMode ? '#EC4899' : '#DB2777'} 
            fill="none"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </motion.div>
      
      {/* Center dot */}
      <motion.div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] ${
          isHidden ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          width: isClicking ? '4px' : '3px',
          height: isClicking ? '4px' : '3px',
          backgroundColor: (() => {
            switch(elementType) {
              case 'heading': return '#8B5CF6'
              case 'image': return '#EC4899'
              case 'link': return '#64ffda'
              case 'input': return '#38BDF8'
              default: return isDarkMode ? '#ffffff' : '#000000'
            }
          })(),
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'opacity 0.3s ease, width 0.1s ease, height 0.1s ease, background-color 0.3s ease',
          marginLeft: isClicking ? '-2px' : '-1.5px',
          marginTop: isClicking ? '-2px' : '-1.5px',
          boxShadow: `0 0 ${isClicking ? '6px' : '3px'} ${
            elementType === 'heading' ? '#8B5CF6' :
            elementType === 'image' ? '#EC4899' :
            elementType === 'link' ? '#64ffda' :
            elementType === 'input' ? '#38BDF8' :
            isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'
          }`
        }}
      />
      
      {/* Add global styles using style tag */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
    </>
  )
}

export default CustomCursor