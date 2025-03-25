import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

export const useThree = (options = {}) => {
  const {
    width = window.innerWidth,
    height = window.innerHeight,
    backgroundColor = 0x000000,
    antialias = true,
    pixelRatio = window.devicePixelRatio,
    onBeforeRender,
    onAfterRender,
    onResize,
    postProcessing = false
  } = options

  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const composerRef = useRef(null)
  const animationFrameRef = useRef(null)

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Create scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)
    sceneRef.current = scene

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Create renderer
    const renderer = new THREE.WebGLRenderer({
      antialias,
      alpha: true
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(pixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // Setup post-processing if enabled
    if (postProcessing) {
      const composer = new EffectComposer(renderer)
      const renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        1.5,  // strength
        0.4,  // radius
        0.85  // threshold
      )
      composer.addPass(bloomPass)

      composerRef.current = composer
    }

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()

      renderer.setSize(newWidth, newHeight)
      renderer.setPixelRatio(window.devicePixelRatio)

      if (composerRef.current) {
        composerRef.current.setSize(newWidth, newHeight)
      }

      onResize?.(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      controls.update()

      onBeforeRender?.()

      if (composerRef.current) {
        composerRef.current.render()
      } else {
        renderer.render(scene, camera)
      }

      onAfterRender?.()
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [width, height, backgroundColor, antialias, pixelRatio, postProcessing])

  return {
    containerRef,
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    controls: controlsRef.current,
    composer: composerRef.current
  }
}

// Three.js utility functions
export const threeUtils = {
  // Geometry helpers
  geometry: {
    createBox: (width = 1, height = 1, depth = 1) => new THREE.BoxGeometry(width, height, depth),
    createSphere: (radius = 1, segments = 32, rings = 32) => new THREE.SphereGeometry(radius, segments, rings),
    createCylinder: (radiusTop = 1, radiusBottom = 1, height = 1, segments = 32) => new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    createCone: (radius = 1, height = 1, segments = 32) => new THREE.ConeGeometry(radius, height, segments),
    createTorus: (radius = 1, tube = 0.4, radialSegments = 16, tubularSegments = 32) => new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments)
  },

  // Material helpers
  material: {
    createBasic: (color = 0xffffff) => new THREE.MeshBasicMaterial({ color }),
    createPhong: (color = 0xffffff) => new THREE.MeshPhongMaterial({ color }),
    createStandard: (color = 0xffffff) => new THREE.MeshStandardMaterial({ color }),
    createLambert: (color = 0xffffff) => new THREE.MeshLambertMaterial({ color }),
    createPoints: (color = 0xffffff) => new THREE.PointsMaterial({ color })
  },

  // Light helpers
  light: {
    createAmbient: (color = 0xffffff, intensity = 0.5) => new THREE.AmbientLight(color, intensity),
    createDirectional: (color = 0xffffff, intensity = 1) => new THREE.DirectionalLight(color, intensity),
    createPoint: (color = 0xffffff, intensity = 1) => new THREE.PointLight(color, intensity),
    createSpot: (color = 0xffffff, intensity = 1) => new THREE.SpotLight(color, intensity)
  },

  // Animation helpers
  animation: {
    rotate: (object, speed = 0.01) => {
      object.rotation.x += speed
      object.rotation.y += speed
    },
    pulse: (object, speed = 0.01, scale = 0.1) => {
      const time = Date.now() * speed
      object.scale.setScalar(1 + Math.sin(time) * scale)
    },
    bounce: (object, speed = 0.01, height = 0.5) => {
      const time = Date.now() * speed
      object.position.y = Math.sin(time) * height
    }
  },

  // Math helpers
  math: {
    lerp: (start, end, t) => start * (1 - t) + end * t,
    map: (value, inMin, inMax, outMin, outMax) => {
      return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
    },
    clamp: (value, min, max) => Math.min(Math.max(value, min), max)
  }
} 