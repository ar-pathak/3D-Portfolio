import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../hooks/useTheme'
import { useResponsive } from '../../App'

const ParticleBackground = ({ count = 2500 }) => {
  const { isDarkMode } = useTheme()
  const responsive = useResponsive()
  const pointsRef = useRef()
  const { mouse, viewport, size, camera, gl } = useThree()
  const [hovered, setHovered] = useState(false)
  const [rippleCenter, setRippleCenter] = useState({ x: 0, y: 0 })
  const [rippleTime, setRippleTime] = useState(0)
  
  // Use the device performance from the responsive context
  const devicePerformance = responsive?.devicePerformance || 'high'
  const isTouchDevice = responsive?.isTouchDevice || false
  const prefersReducedMotion = responsive?.prefersReducedMotion || false
  
  // Adjust particle count based on device performance from context
  const adjustedCount = useMemo(() => {
    switch(devicePerformance) {
      case 'low': return Math.min(800, count / 3);
      case 'medium': return Math.min(1500, count / 1.5);
      default: return count;
    }
  }, [count, devicePerformance]);
  
  // Generate random particles with memoization for better performance
  const particles = useMemo(() => {
    const temp = []
    const colors = []
    const sizes = []
    const randomData = [] // For varied animation
    
    // Color palette based on theme
    const primaryPalette = isDarkMode
      ? [
        new THREE.Color('#4C1D95').getStyle(), // indigo-900
        new THREE.Color('#6D28D9').getStyle(), // violet-700
        new THREE.Color('#8B5CF6').getStyle(), // violet-500
        new THREE.Color('#4F46E5').getStyle(), // indigo-600
        new THREE.Color('#2563EB').getStyle(), // blue-600
      ]
      : [
        new THREE.Color('#93C5FD').getStyle(), // blue-300
        new THREE.Color('#A5B4FC').getStyle(), // indigo-300
        new THREE.Color('#C4B5FD').getStyle(), // violet-300
        new THREE.Color('#DDD6FE').getStyle(), // purple-200
        new THREE.Color('#BFDBFE').getStyle(), // blue-200
      ]
    
    // Accent colors for highlights
    const accentPalette = isDarkMode
      ? [
        new THREE.Color('#F472B6').getStyle(), // pink-400
        new THREE.Color('#34D399').getStyle(), // emerald-400
        new THREE.Color('#60A5FA').getStyle(), // blue-400
        new THREE.Color('#FB923C').getStyle(), // orange-400
      ]
      : [
        new THREE.Color('#DB2777').getStyle(), // pink-600
        new THREE.Color('#059669').getStyle(), // emerald-600
        new THREE.Color('#2563EB').getStyle(), // blue-600
        new THREE.Color('#EA580C').getStyle(), // orange-600
      ]
    
    // Create different layers/depths for parallax effect
    for (let i = 0; i < adjustedCount; i++) {
      // Distribute particles in layers
      const layerFactor = Math.random()
      const layer = layerFactor < 0.3 ? 0 : // 30% in foreground
               layerFactor < 0.8 ? 1 : // 50% in middle
               2               // 20% in background
      
      // Create particles in a sphere with different distribution based on layer
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      // Distance varies by layer for parallax effect
      const baseDistance = layer === 0 ? 10 : 
                         layer === 1 ? 20 : 30
      const distance = baseDistance + Math.random() * 10
      
      const x = distance * Math.sin(phi) * Math.cos(theta)
      const y = distance * Math.sin(phi) * Math.sin(theta)
      const z = -distance + Math.random() * 5 // Negative to push into screen
      
      temp.push(x, y, z)
      
      // Assign colors with accent colors appearing less frequently
      const isAccent = Math.random() < 0.15 // 15% chance of accent color
      const palette = isAccent ? accentPalette : primaryPalette
      const color = new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
      colors.push(color.r, color.g, color.b)
      
      // Varied particle sizes - smaller on low-end devices
      const sizeMultiplier = devicePerformance === 'low' ? 0.7 : 
                             devicePerformance === 'medium' ? 0.85 : 1;
      
      const sizeVariation = layer === 0 ? (Math.random() * 0.8 + 0.8) * sizeMultiplier : // Larger in foreground
                            layer === 1 ? (Math.random() * 0.5 + 0.5) * sizeMultiplier : // Medium in midground
                                         (Math.random() * 0.3 + 0.3) * sizeMultiplier;   // Smaller in background
      sizes.push(sizeVariation)
      
      // Random data for varied animation
      randomData.push(
        Math.random() * 2 - 1, // Random offset -1 to 1
        Math.random() * 0.5 + 0.5, // Animation speed factor
        Math.random() * 4 - 2, // Wave amplitude
        Math.floor(Math.random() * 3) // Animation pattern
      )
    }
    
    return { 
      positions: new Float32Array(temp), 
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes),
      randomData: new Float32Array(randomData),
      originalPositions: new Float32Array(temp.slice())
    }
  }, [adjustedCount, isDarkMode, devicePerformance])
  
  // Store mouse movement for particle interaction
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetMousePosition = useRef({ x: 0, y: 0 })
  
  // Update mouse position smoothly
  useEffect(() => {
    // Skip intensive interactions for touch devices and reduced motion preference
    if (isTouchDevice || prefersReducedMotion) return;
    
    const updateMousePosition = () => {
      mousePosition.current.x += (targetMousePosition.current.x - mousePosition.current.x) * 0.1
      mousePosition.current.y += (targetMousePosition.current.y - mousePosition.current.y) * 0.1
      
      requestAnimationFrame(updateMousePosition)
    }
    
    updateMousePosition()
    
    // Event listener for ripple effect on click
    const handleClick = (event) => {
      // Only enable ripple on medium and high performance devices
      if (devicePerformance === 'low' || isTouchDevice || prefersReducedMotion) return;
      
      // Convert screen coordinates to normalized device coordinates
      const x = (event.clientX / size.width) * 2 - 1
      const y = -(event.clientY / size.height) * 2 + 1
      
      // Create a vector and project it into 3D space
      const vector = new THREE.Vector3(x, y, 0.5)
      vector.unproject(camera)
      
      // Set ripple center and reset time
      setRippleCenter({ x: vector.x, y: vector.y })
      setRippleTime(0)
    }
    
    // Only add click listener for medium and high performance devices
    if (devicePerformance !== 'low' && !isTouchDevice && !prefersReducedMotion) {
      window.addEventListener('click', handleClick)
    }
    
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [camera, size, devicePerformance, isTouchDevice, prefersReducedMotion])
  
  // Mouse hover detection for canvas
  useEffect(() => {
    // Skip for touch devices and reduced motion
    if (isTouchDevice || prefersReducedMotion) return;
    
    const handleCanvasHover = (event) => {
      const elements = document.elementsFromPoint(event.clientX, event.clientY)
      const isCanvasHovered = elements.some(el => el.tagName.toLowerCase() === 'canvas')
      setHovered(isCanvasHovered)
    }
    
    window.addEventListener('mousemove', handleCanvasHover)
    
    return () => {
      window.removeEventListener('mousemove', handleCanvasHover)
    }
  }, [isTouchDevice, prefersReducedMotion])
  
  // Animation and interaction
  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    
    // Update target mouse position - skip for touch devices
    if (!isTouchDevice && !prefersReducedMotion) {
      targetMousePosition.current.x = (mouse.x * viewport.width) / 2
      targetMousePosition.current.y = (mouse.y * viewport.height) / 2
    }
    
    const time = clock.getElapsedTime()
    const positions = pointsRef.current.geometry.attributes.position.array
    const sizes = pointsRef.current.geometry.attributes.size.array
    
    // Update ripple time for click effect - skip for touch/reduced motion
    if (rippleTime < 3 && !isTouchDevice && !prefersReducedMotion) {
      setRippleTime(prev => prev + 0.03)
    }
    
    // Optimize animation based on device performance
    const animationFPS = devicePerformance === 'low' ? 2 : 
                         devicePerformance === 'medium' ? 1 : 0;
    
    // For reduced motion preference, use even less frequent updates
    const reduceFrames = prefersReducedMotion ? 4 : animationFPS;
                        
    // Only update particles on certain frames to improve performance on low-end devices
    if (Math.floor(time * 60) % (reduceFrames + 1) === 0 || (devicePerformance === 'high' && !prefersReducedMotion)) {
      // Animate particles
      for (let i = 0; i < positions.length; i += 3) {
        const index = i / 3
        
        // Get random data for this particle
        const randomOffset = particles.randomData[index * 4]
        const speedFactor = particles.randomData[index * 4 + 1]
        const amplitude = particles.randomData[index * 4 + 2]
        const pattern = particles.randomData[index * 4 + 3]
        
        // Original position
        const originalX = particles.originalPositions[i]
        const originalY = particles.originalPositions[i + 1]
        const originalZ = particles.originalPositions[i + 2]
        
        // Minimal animation for reduced motion preference
        if (prefersReducedMotion) {
          positions[i] = originalX
          positions[i + 1] = originalY
          positions[i + 2] = originalZ
          continue
        }
        
        // Animation patterns - simplify on lower end devices
        let waveX = 0
        let waveY = 0
        
        if (devicePerformance !== 'low') {
          // Different animation patterns based on pattern value
          switch (Math.floor(pattern)) {
            case 0: // Sine wave
              waveX = Math.sin(time * speedFactor + originalX * 0.05) * amplitude * 0.1
              waveY = Math.cos(time * speedFactor + originalY * 0.04) * amplitude * 0.1
              break
            case 1: // Circular motion
              waveX = Math.sin(time * speedFactor) * amplitude * 0.1
              waveY = Math.cos(time * speedFactor) * amplitude * 0.1
              break
            case 2: // Figure-8 pattern
              waveX = Math.sin(time * speedFactor) * amplitude * 0.1
              waveY = Math.sin(time * speedFactor * 2) * amplitude * 0.05
              break
          }
        } else {
          // Simplified animation for low-end devices
          waveX = Math.sin(time * 0.2 + index * 0.1) * 0.1
          waveY = Math.cos(time * 0.2 + index * 0.1) * 0.1
        }
        
        // Mouse interaction effect - reduced or disabled based on performance
        let interactionX = 0
        let interactionY = 0
        
        if (devicePerformance !== 'low' && !isTouchDevice && !prefersReducedMotion) {
          const dx = originalX - mousePosition.current.x
          const dy = originalY - mousePosition.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = devicePerformance === 'high' ? 10 : 8
          
          if (dist < maxDist && hovered) {
            const force = (1 - dist / maxDist) * (hovered ? 3 : 2)
            const repel = hovered ? -1 : 1 // Attract when not hovered, repel when hovered
            interactionX = (dx / dist) * force * repel
            interactionY = (dy / dist) * force * repel
          }
        }
        
        // Ripple effect on click - only for medium and high performance
        let rippleEffect = 0
        if (rippleTime < 3 && devicePerformance !== 'low' && !isTouchDevice && !prefersReducedMotion) {
          const rippleDx = originalX - rippleCenter.x
          const rippleDy = originalY - rippleCenter.y
          const rippleDist = Math.sqrt(rippleDx * rippleDx + rippleDy * rippleDy)
          const rippleMaxDist = rippleTime * 8 // Expanding circle
          const rippleMinDist = rippleMaxDist - 2
          
          // Create a ring effect
          if (rippleDist < rippleMaxDist && rippleDist > rippleMinDist) {
            const rippleIntensity = 1 - (rippleTime / 3)
            const angle = Math.atan2(rippleDy, rippleDx)
            rippleEffect = rippleIntensity * 2
            
            // Add vertical displacement at ripple edge
            positions[i] = originalX + Math.cos(angle) * rippleEffect * 0.5
            positions[i + 1] = originalY + Math.sin(angle) * rippleEffect * 0.5
            
            // Temporarily increase size of particles in the ripple
            sizes[index] = particles.sizes[index] * (1 + rippleIntensity * 2)
          } else {
            sizes[index] = particles.sizes[index]
          }
        } else {
          // Size adjustments based on hover state
          sizes[index] = particles.sizes[index] * (hovered && devicePerformance !== 'low' && !isTouchDevice && !prefersReducedMotion ? 1.3 : 1)
        }
        
        // Apply all transformations
        if (rippleEffect === 0) {
          positions[i] = originalX + waveX + interactionX
          positions[i + 1] = originalY + waveY + interactionY
        }
        positions[i + 2] = originalZ
      }
    }
    
    // Flag attributes for update
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.size.needsUpdate = true
    
    // Rotate entire particle system - reduced on low performance devices
    const rotationSpeed = devicePerformance === 'low' ? 0.01 : 
                         devicePerformance === 'medium' ? 0.02 : 
                         prefersReducedMotion ? 0.005 : 0.03;
    
    pointsRef.current.rotation.y = time * rotationSpeed + (devicePerformance !== 'low' && !isTouchDevice && !prefersReducedMotion ? mouse.x * 0.01 : 0)
    
    if (devicePerformance === 'high' && !isTouchDevice && !prefersReducedMotion) {
      pointsRef.current.rotation.x = mouse.y * 0.01
    }
  })
  
  // Set renderer parameters for better performance on mobile
  useEffect(() => {
    if (devicePerformance === 'low') {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    }
  }, [gl, devicePerformance]);
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.sizes.length}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={devicePerformance === 'low' ? 0.15 : isTouchDevice ? 0.18 : 0.2}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={devicePerformance === 'low' || isTouchDevice ? 0.6 : 0.8}
        fog={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      >
        <texture attach="map" args={[createCircleTexture(devicePerformance)]} />
      </pointsMaterial>
    </points>
  )
}

// Create a circular texture for particles
function createCircleTexture(performance = 'high') {
  // Use smaller texture size on low-end devices
  const size = performance === 'low' ? 64 : 128;
  
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  
  const context = canvas.getContext('2d')
  
  // Create gradient
  const gradient = context.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  )
  
  // Simpler gradient for low performance devices
  if (performance === 'low') {
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  } else {
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.1)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  }
  
  // Draw circle
  context.fillStyle = gradient
  context.beginPath()
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false)
  context.fill()
  
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

export default ParticleBackground 