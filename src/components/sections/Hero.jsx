import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Float, useTexture, Sparkles, MeshDistortMaterial } from '@react-three/drei'
import { useTheme } from '../../hooks/useTheme'
import ParticleBackground from '../3d/ParticleBackground'
import LoadingSpinner from '../common/LoadingSpinner'
import Shimmer from '../common/Shimmer'
import * as THREE from 'three'
import { useResponsive } from '../../App'

// Helper to detect device performance
const useDevicePerformance = () => {
  const [performance, setPerformance] = useState('high');
  
  useEffect(() => {
    const detectPerformance = () => {
      // Check device capability
      const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
      const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
      
      // Check for WebGL capabilities
      const gl = document.createElement('canvas').getContext('webgl');
      if (!gl) {
        return 'low'; // No WebGL support
      }
      
      // Get GPU renderer info (may not work in all browsers)
      let renderer = '';
      try {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        }
      } catch (e) {
        // Ignore errors
      }
      
      // Check for high-end GPU
      const isHighEndGPU = 
        renderer.includes('nvidia') || 
        renderer.includes('amd') || 
        renderer.includes('radeon') ||
        renderer.includes('geforce');
        
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        return 'low';
      } else if (isMobile) {
        return 'low';
      } else if (isTablet && !isHighEndGPU) {
        return 'medium';
      } else if (isTablet && isHighEndGPU) {
        return 'medium';
      } else {
        return 'high';
      }
    };
    
    setPerformance(detectPerformance());
    
    const handleResize = () => {
      setPerformance(detectPerformance());
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return performance;
};

// Animated floating text component with interaction
const FloatingText = ({ text, color, position, size = 1, rotation = [0, 0, 0], performance = 'high' }) => {
  const textRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const { viewport } = useThree()
  const responsive = useResponsive()
  const isTouchDevice = responsive?.isTouchDevice || false
  const prefersReducedMotion = responsive?.prefersReducedMotion || false
  
  // Calculate responsive size based on viewport and device
  const sizeMultiplier = performance === 'low' ? 0.7 : 
                         performance === 'medium' ? 0.85 : 1;
  const responsiveSize = Math.min(viewport.width, viewport.height) * 0.03 * size * sizeMultiplier
  
  // Optimize animation based on performance level
  useFrame(({ clock }) => {
    if (!textRef.current) return
    
    // Basic floating animation - simplified for lower performance
    const time = clock.getElapsedTime()
    
    if (performance === 'low' || prefersReducedMotion) {
      // Simple animation for low-end devices or reduced motion
      textRef.current.position.y = position[1] + (prefersReducedMotion ? 0 : Math.sin(time * 0.3) * 0.05)
      textRef.current.rotation.y = rotation[1]
    } else {
      // More complex animation for better devices
      textRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1
      
      // Add rotation when hovered (medium and high only)
      if (hovered && performance !== 'low' && !prefersReducedMotion) {
        textRef.current.rotation.y = Math.sin(time * 2) * 0.1
      } else {
        textRef.current.rotation.y = rotation[1]
      }
      
      // Pulse effect when clicked (medium and high only)
      if (clicked && performance !== 'low' && !prefersReducedMotion) {
        const pulseScale = 1 + Math.sin(time * 8) * 0.05
        textRef.current.scale.set(pulseScale, pulseScale, pulseScale)
      } else {
        textRef.current.scale.set(1, 1, 1)
      }
    }
  })
  
  // Disable interactions on low-performance devices and touch devices
  const interactionsEnabled = performance !== 'low' && !isTouchDevice && !prefersReducedMotion;
  
  // Create interaction handlers
  const handlePointerOver = useCallback(() => {
    if (interactionsEnabled) {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }, [interactionsEnabled])
  
  const handlePointerOut = useCallback(() => {
    if (interactionsEnabled) {
      setHovered(false)
      document.body.style.cursor = 'auto'
    }
  }, [interactionsEnabled])
  
  const handleClick = useCallback(() => {
    if (interactionsEnabled) {
      setClicked(true)
      // Reset click state after animation
      setTimeout(() => setClicked(false), 800)
    }
  }, [interactionsEnabled])
  
  return (
    <Text
      ref={textRef}
      position={position}
      rotation={rotation}
      color={color}
      fontSize={responsiveSize}
      font="/fonts/helvetiker_regular.typeface.json"
      anchorX="center"
      anchorY="middle"
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      glyphGeometryDetail={performance === 'low' ? 4 : 8} // Lower detail on low-end devices
      curveSegments={performance === 'low' ? 6 : 12}
      fillOpacity={hovered ? 1 : 0.9}
    >
      {text}
      {/* Add glow effect when hovered (simplified on low-end devices) */}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered && performance !== 'low' && !prefersReducedMotion ? 1 : 0.2}
        metalness={performance === 'low' ? 0.1 : 0.3}
        roughness={performance === 'low' ? 0.6 : 0.4}
      />
    </Text>
  )
}

// Animated 3D shape that reacts to mouse - optimized for different devices
const InteractiveShape = ({ position, color, size = 1, performance = 'high' }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [rotation] = useState(() => new THREE.Euler(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  ))
  const responsive = useResponsive()
  const isTouchDevice = responsive?.isTouchDevice || false
  const prefersReducedMotion = responsive?.prefersReducedMotion || false
  
  // Adjust size for device performance
  const sizeMultiplier = performance === 'medium' ? 0.85 : 1;
  const adjustedSize = size * sizeMultiplier;
  
  // Skip rendering with null return after all hooks are called
  const shouldRender = !(performance === 'low' || prefersReducedMotion);
  
  useFrame(({ clock, mouse, viewport }) => {
    if (!meshRef.current || !shouldRender) return;
    
    const time = clock.getElapsedTime()
    
    // Floating animation - simplified based on performance
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1
    
    if (hovered && performance === 'high' && !isTouchDevice) {
      // Track mouse slightly when hovered (only on high-end devices)
      meshRef.current.rotation.x = mouse.y * 0.5 + rotation.x
      meshRef.current.rotation.y = mouse.x * 0.5 + rotation.y
    } else {
      // Slow rotation
      meshRef.current.rotation.x = rotation.x + time * (performance === 'medium' ? 0.1 : 0.2)
      meshRef.current.rotation.y = rotation.y + time * (performance === 'medium' ? 0.1 : 0.2)
    }
  })
  
  // Return null after all hooks have been called
  if (!shouldRender) {
    return null;
  }
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => !isTouchDevice && setHovered(true)}
      onPointerOut={() => !isTouchDevice && setHovered(false)}
      scale={hovered && !isTouchDevice ? [adjustedSize * 1.1, adjustedSize * 1.1, adjustedSize * 1.1] : [adjustedSize, adjustedSize, adjustedSize]}
    >
      <icosahedronGeometry args={[1, performance === 'medium' ? 0 : 1]} />
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered && !isTouchDevice ? 0.8 : 0.2}
        metalness={0.4}
        roughness={0.2}
        distort={hovered && !isTouchDevice ? 0.6 : 0.3} 
        speed={hovered && !isTouchDevice ? 4 : 2}
      />
    </mesh>
  )
}

// Enhanced 3D background - optimized for different devices
const EnhancedBackground = ({ performance = 'high' }) => {
  const { isDarkMode } = useTheme()
  const { viewport } = useThree()
  const responsive = useResponsive()
  const isTouchDevice = responsive?.isTouchDevice || false
  const prefersReducedMotion = responsive?.prefersReducedMotion || false
  
  // Colors adaptive to the theme
  const primaryColor = isDarkMode ? '#4F46E5' : '#4338CA' // indigo
  const secondaryColor = isDarkMode ? '#8B5CF6' : '#7C3AED' // violet
  const accentColor = isDarkMode ? '#EC4899' : '#DB2777' // pink
  const tertiaryColor = isDarkMode ? '#10B981' : '#059669' // emerald
  
  // Responsive positioning based on viewport size
  const scale = Math.min(viewport.width, viewport.height) * 0.05
  
  // Customize based on device capabilities
  // Skip some elements on low-end devices or when reduced motion is preferred
  const showSparkles = performance !== 'low' && !prefersReducedMotion;
  const sparkleCount = performance === 'medium' ? 25 : prefersReducedMotion ? 10 : 50;
  
  return (
    <>
      <ParticleBackground />
      
      {/* Reduce stars on low-end devices */}
      <Stars 
        radius={100} 
        depth={50} 
        count={performance === 'low' || prefersReducedMotion ? 2000 : 5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={prefersReducedMotion ? 0.5 : 1} 
      />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      {/* Only add second light on medium/high devices */}
      {performance !== 'low' && !prefersReducedMotion && (
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8B5CF6" />
      )}
      
      {/* Sparkles add atmospheric depth - skip on low-end devices */}
      {showSparkles && (
        <Sparkles 
          count={sparkleCount} 
          scale={scale * 10} 
          size={scale} 
          speed={prefersReducedMotion ? 0.1 : 0.3} 
          opacity={0.5} 
          color={secondaryColor} 
        />
      )}
      
      {/* Floating text elements - positioned responsively */}
      <Float speed={prefersReducedMotion ? 0.5 : 1.5} rotationIntensity={prefersReducedMotion ? 0.1 : 0.2} floatIntensity={performance === 'low' || prefersReducedMotion ? 0.2 : 0.5}>
        <FloatingText 
          text="3D" 
          color={primaryColor} 
          position={[-viewport.width * 0.15, viewport.height * 0.1, -5]} 
          size={1.5}
          rotation={[0, -0.2, 0]}
          performance={performance}
        />
        {performance !== 'low' && !prefersReducedMotion && (
          <InteractiveShape 
            position={[-viewport.width * 0.2, viewport.height * 0.2, -8]} 
            color={primaryColor}
            size={scale * 0.8}
            performance={performance}
          />
        )}
      </Float>
      
      <Float speed={performance === 'low' || prefersReducedMotion ? 0.5 : 2} rotationIntensity={performance === 'low' || prefersReducedMotion ? 0.1 : 0.3} floatIntensity={performance === 'low' || prefersReducedMotion ? 0.1 : 0.3}>
        <FloatingText 
          text="Creative" 
          color={secondaryColor} 
          position={[viewport.width * 0.15, -viewport.height * 0.15, -8]} 
          size={1.2}
          rotation={[0.1, 0.2, 0]}
          performance={performance}
        />
        {performance !== 'low' && !prefersReducedMotion && (
          <InteractiveShape 
            position={[viewport.width * 0.22, -viewport.height * 0.08, -7]} 
            color={secondaryColor}
            size={scale * 0.5}
            performance={performance}
          />
        )}
      </Float>
      
      <Float speed={performance === 'low' || prefersReducedMotion ? 0.2 : 1.2} rotationIntensity={prefersReducedMotion ? 0 : 0.1} floatIntensity={performance === 'low' || prefersReducedMotion ? 0 : 0.4}>
        <FloatingText 
          text="Portfolio" 
          color={accentColor} 
          position={[0, viewport.height * 0.15, -12]} 
          size={2}
          rotation={[-0.1, 0, 0]}
          performance={performance}
        />
        {performance !== 'low' && !prefersReducedMotion && (
          <InteractiveShape 
            position={[viewport.width * 0.05, viewport.height * 0.25, -10]} 
            color={tertiaryColor}
            size={scale * 0.6}
            performance={performance}
          />
        )}
      </Float>
    </>
  )
}

// Typing animation effect - optimized for performance
const TypingText = ({ text, delay = 0, performance = 'high' }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const responsive = useResponsive()
  const isTouchDevice = responsive?.isTouchDevice || false
  const prefersReducedMotion = responsive?.prefersReducedMotion || false
  
  useEffect(() => {
    // Skip animation for low performance devices, touch devices, or reduced motion
    if (performance === 'low' || isTouchDevice || prefersReducedMotion) {
      setDisplayedText(text);
      return;
    }
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, performance === 'medium' ? 70 : 50) // Slower on medium devices
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, performance, isTouchDevice, prefersReducedMotion])
  
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: performance === 'low' || isTouchDevice || prefersReducedMotion ? 0 : delay }}
    >
      {performance === 'low' || isTouchDevice || prefersReducedMotion ? text : displayedText}
      {currentIndex < text.length && performance !== 'low' && !isTouchDevice && !prefersReducedMotion && (
        <span className="animate-pulse">|</span>
      )}
    </motion.span>
  )
}

const Hero = () => {
  const { isDarkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const responsive = useResponsive()
  const devicePerformance = responsive?.devicePerformance || 'high'
  const isMobile = responsive?.isMobile || false
  const isTablet = responsive?.isTablet || false
  const isTouchDevice = responsive?.isTouchDevice || false
  const prefersReducedMotion = responsive?.prefersReducedMotion || false

  useEffect(() => {
    // Shorter loading time for low-end devices
    const loadTime = devicePerformance === 'low' || isTouchDevice ? 800 : 1500;
    
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, loadTime)

    return () => clearTimeout(timer)
  }, [devicePerformance, isTouchDevice])

  if (isLoading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="h-12 w-48 mx-auto">
              <Shimmer height="h-full" width="w-full" />
            </div>
            <div className="h-8 w-3/4 mx-auto">
              <Shimmer height="h-full" width="w-full" />
            </div>
            <div className="h-4 w-1/2 mx-auto">
              <Shimmer height="h-full" width="w-full" />
            </div>
            <div className="flex justify-center gap-4">
              <div className="h-10 w-32">
                <Shimmer height="h-full" width="w-full" />
              </div>
              <div className="h-10 w-32">
                <Shimmer height="h-full" width="w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Adjust text sizes and spacing for mobile
  const headingClass = isMobile 
    ? "text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
    : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold";
    
  const subheadingClass = isMobile
    ? "text-base sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
    : "text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed";
    
  const buttonClass = isMobile
    ? "px-4 sm:px-8 py-2 sm:py-4 rounded-lg font-medium"
    : "px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium";

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced 3D Background - adapt to device capabilities */}
      <div className="absolute inset-0">
        <Canvas 
          camera={{ position: [0, 0, 10], fov: devicePerformance === 'low' || isMobile ? 70 : isTablet ? 65 : 75 }}
          dpr={[1, devicePerformance === 'low' || isMobile ? 1 : isTablet ? 1.5 : 2]} // Lower resolution on low-end devices
        >
          <Suspense fallback={null}>
            <EnhancedBackground performance={devicePerformance} />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false} 
              enableRotate={isTouchDevice ? false : devicePerformance === 'high'} // Only enable rotation on high-performance non-touch devices
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: devicePerformance === 'low' || prefersReducedMotion ? 0.3 : 1 }}
          className="space-y-6 md:space-y-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={headingClass}
          >
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              <TypingText text="Creative Developer" delay={0.5} performance={devicePerformance} />
            </span>
            <br />
            <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <TypingText text="Building Digital Experiences" delay={2.0} performance={devicePerformance} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${subheadingClass} ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Crafting immersive web experiences with modern technologies and creative solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
          >
            <motion.a
              whileHover={devicePerformance === 'low' || isTouchDevice || prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={devicePerformance === 'low' || isTouchDevice ? {} : { scale: 0.95 }}
              href="#projects"
              className={`${buttonClass} ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
              } transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              View Projects
            </motion.a>
            <motion.a
              whileHover={devicePerformance === 'low' || isTouchDevice || prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
              whileTap={devicePerformance === 'low' || isTouchDevice ? {} : { scale: 0.95 }}
              href="#contact"
              className={`${buttonClass} border-2 ${
                isDarkMode
                  ? 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                  : 'border-blue-500 text-blue-500 hover:bg-blue-500/10'
              } transition-all duration-300 backdrop-blur-sm`}
            >
              Get in Touch
            </motion.a>
          </motion.div>

          {/* Scroll Indicator - hide on very small screens and touch devices */}
          {!isMobile && !isTouchDevice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
            >
              <div className="flex flex-col items-center">
                <span className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Scroll Down
                </span>
                <motion.div
                  animate={devicePerformance === 'low' || prefersReducedMotion ? {} : {
                    y: [0, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="backdrop-blur-sm bg-white/10 p-2 rounded-full shadow-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero 