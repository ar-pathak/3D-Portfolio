import { useState, useRef, Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { OrbitControls, Stage, Float, Environment, Text3D } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration } from '@react-three/postprocessing'
import { useSpring, animated } from '@react-spring/three'
import { useTheme } from '../../hooks/useTheme'
import { Physics, RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import ParticleBackground from './ParticleBackground'

// Extend Three.js with custom shaders
extend({ ShaderMaterial: THREE.ShaderMaterial })

// Custom shader for glowing effect
const GlowShader = {
  uniforms: {
    color: { value: new THREE.Color(0x00ff00) },
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color;
    uniform float time;
    varying vec2 vUv;
    void main() {
      float glow = sin(vUv.x * 10.0 + time) * 0.5 + 0.5;
      gl_FragColor = vec4(color * glow, 1.0);
    }
  `,
}

const BackgroundMesh = () => {
  const meshRef = useRef()
  const { isDarkMode } = useTheme()
  const { viewport } = useThree()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.05
    meshRef.current.position.y = Math.sin(time * 0.2) * 0.1
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
      <meshBasicMaterial
        color={isDarkMode ? '#0a0a0a' : '#f5f5f5'}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

const ProjectModel = ({ project, isSelected }) => {
  const meshRef = useRef()
  const { isDarkMode } = useTheme()
  const [hovered, setHovered] = useState(false)
  const { viewport } = useThree()
  const shaderRef = useRef()

  const { scale, rotation, position } = useSpring({
    scale: hovered ? 1.2 : 1,
    rotation: hovered ? [0, Math.PI / 4, 0] : [0, 0, 0],
    position: hovered ? [0, 0.2, 0] : [0, 0, 0],
    config: { tension: 300, friction: 10 }
  })

  useFrame((state) => {
    if (!isSelected) {
      meshRef.current.rotation.y += 0.005
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = state.clock.getElapsedTime()
    }
  })

  return (
    <animated.group
      scale={scale}
      rotation={rotation}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <RigidBody type="dynamic" colliders="ball">
        <mesh ref={meshRef}>
          <torusKnotGeometry args={[0.5, 0.2, 128, 16]} />
          <shaderMaterial
            ref={shaderRef}
            attach="material"
            uniforms={GlowShader.uniforms}
            vertexShader={GlowShader.vertexShader}
            fragmentShader={GlowShader.fragmentShader}
          />
        </mesh>
      </RigidBody>
      <Float
        speed={1.5}
        rotationIntensity={1}
        floatIntensity={0.5}
      >
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[0.5, 0.2, 0.2]} />
          <meshStandardMaterial
            color={isDarkMode ? '#ffffff' : '#000000'}
            metalness={0.5}
            roughness={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
    </animated.group>
  )
}

const SearchBar = ({ onSearch, onFilter }) => {
  const { isDarkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState('all')

  const techOptions = ['all', 'React', 'Three.js', 'WebGL', 'D3.js', 'Redux', 'TailwindCSS', 'Framer Motion', 'GSAP']

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilter = (tech) => {
    setSelectedTech(tech)
    onFilter(tech)
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search projects..."
          className={`w-full px-4 py-3 rounded-lg bg-opacity-20 backdrop-blur-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-200 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {techOptions.map((tech) => (
          <button
            key={tech}
            onClick={() => handleFilter(tech)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTech === tech
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  )
}

const ProjectCard = ({ project, isSelected, onClick }) => {
  const controlsRef = useRef()
  const { isDarkMode } = useTheme()
  const [isARSupported, setIsARSupported] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setIsARSupported(supported)
      })
    }
  }, [])

  const handleViewClick = (e) => {
    e.stopPropagation()
    // Handle view project
    window.open(project.demoUrl, '_blank')
  }

  const handleGitHubClick = (e) => {
    e.stopPropagation()
    // Handle GitHub link
    window.open(project.githubUrl, '_blank')
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`relative cursor-pointer rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
        isSelected ? 'col-span-2 row-span-2 z-50' : 'hover:scale-[1.02]'
      }`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="aspect-square bg-gradient-to-br from-gray-900 to-black">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={null}>
            <BackgroundMesh />
            <Physics>
              <Stage environment="city" intensity={0.6}>
                <ProjectModel project={project} isSelected={isSelected} />
              </Stage>
            </Physics>
            <Environment preset="city" />
            <OrbitControls
              ref={controlsRef}
              enableZoom={!isSelected}
              enablePan={!isSelected}
              autoRotate={!isSelected}
              autoRotateSpeed={2}
              enableDamping
              dampingFactor={0.05}
              rotateSpeed={0.5}
              zoomSpeed={0.5}
              panSpeed={0.5}
              minDistance={3}
              maxDistance={10}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              target={[0, 0, 0]}
              makeDefault
              passive
            />
            <EffectComposer>
              <Bloom luminanceThreshold={0.5} intensity={1.5} />
              <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
              <ChromaticAberration offset={[0.002, 0.002]} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
            <div className="flex gap-2">
              {isARSupported && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle AR view
                  }}
                >
                  View in AR
                </motion.button>
              )}
            </div>
          </div>
          <p className="text-gray-300 text-base mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewClick}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Project
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGitHubClick}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
        />
      )}
    </motion.div>
  )
}

const ProjectShowcase = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState('all')
  const { isDarkMode } = useTheme()

  const projects = [
    {
      id: 1,
      title: "3D Portfolio Website",
      description: "A modern portfolio website built with React and Three.js, featuring interactive 3D elements and smooth animations.",
      tech: ["React", "Three.js", "TailwindCSS", "Framer Motion"],
      demoUrl: "https://your-portfolio-demo.com",
      githubUrl: "https://github.com/yourusername/portfolio"
    },
    {
      id: 2,
      title: "Interactive Dashboard",
      description: "Real-time data visualization dashboard with 3D elements, dynamic charts, and responsive design.",
      tech: ["React", "D3.js", "WebGL", "Redux"],
      demoUrl: "https://your-dashboard-demo.com",
      githubUrl: "https://github.com/yourusername/dashboard"
    },
    {
      id: 3,
      title: "3D Game Experience",
      description: "Browser-based 3D game with physics, animations, and immersive gameplay mechanics.",
      tech: ["Three.js", "Cannon.js", "React", "GSAP"],
      demoUrl: "https://your-game-demo.com",
      githubUrl: "https://github.com/yourusername/game"
    }
  ]

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTech = selectedTech === 'all' || project.tech.includes(selectedTech)
    return matchesSearch && matchesTech
  })

  return (
    <section className={`relative min-h-screen py-16 px-4 md:px-8 ${
      isDarkMode ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      <div className="absolute inset-0">
        <Canvas>
          <Suspense fallback={null}>
            <ParticleBackground />
          </Suspense>
        </Canvas>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Explore my latest work and interactive experiences
          </p>
        </motion.div>

        <SearchBar
          onSearch={setSearchTerm}
          onFilter={setSelectedTech}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isSelected={selectedProject?.id === project.id}
                onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects found matching your criteria
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default ProjectShowcase 