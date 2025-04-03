import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

const ScrollProgress = () => {
  const { isDarkMode } = useTheme()
  const [showScrollInfo, setShowScrollInfo] = useState(false)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('down')
  const [lastScrollTop, setLastScrollTop] = useState(0)
  
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  })
  
  useEffect(() => {
    const updateScrollInfo = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollPercent = Math.round((scrollTop / scrollHeight) * 100) || 0
      
      // Update scroll percentage
      setScrollPercentage(scrollPercent)
      
      // Determine scroll direction
      if (scrollTop > lastScrollTop) {
        setScrollDirection('down')
      } else if (scrollTop < lastScrollTop) {
        setScrollDirection('up')
      }
      
      setLastScrollTop(scrollTop)
    }
    
    window.addEventListener('scroll', updateScrollInfo)
    return () => window.removeEventListener('scroll', updateScrollInfo)
  }, [lastScrollTop])
  
  // Show scroll info when hovering
  const handleMouseEnter = () => setShowScrollInfo(true)
  const handleMouseLeave = () => setShowScrollInfo(false)
  
  return (
    <>
      {/* Main scroll progress indicator */}
      <motion.div 
        className={`fixed top-0 left-0 right-0 h-1 origin-left z-50 ${
          isDarkMode ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
        }`}
        style={{ scaleX }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Custom scroll indicator on the side */}
      <div 
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={`w-1 h-40 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
          }`}
        >
          <motion.div 
            className={`w-full ${
              isDarkMode ? 'bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500' : 'bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600'
            }`}
            style={{ 
              height: '100%',
              originY: 0,
              scaleY: scrollYProgress 
            }}
          />
        </div>
        
        {/* Scroll position indicator */}
        {showScrollInfo && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`absolute -left-20 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-white' 
                : 'bg-white text-gray-800 shadow-md'
            }`}
          >
            <div className="text-center">
              <span className="text-xl font-bold">{scrollPercentage}%</span>
              <div className="flex items-center justify-center mt-1">
                <span className="text-xs mr-1">Scrolling</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className={scrollDirection === 'down' ? '' : 'rotate-180'}
                >
                  <path 
                    d="M12 4V20M12 20L18 14M12 20L6 14" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Scroll down arrow for the first section */}
      {scrollPercentage < 5 && (
        <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <div className={`flex flex-col items-center ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <span className="text-sm mb-2">Scroll down</span>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none"
              className={`${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              <path 
                d="M12 4V20M12 20L18 14M12 20L6 14" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default ScrollProgress 