import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'
import { useState, useEffect } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'
import ProjectShowcaseSkeleton from '../projects/ProjectShowcaseSkeleton'
import { projects } from '../../constants/projects.jsx'

const ProjectCard = ({ title, description, tech, image, github, demo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-tertiary p-4 sm:p-6 rounded-lg"
    >
      <div className="h-40 sm:h-48 mb-4 bg-gray-800 rounded-lg overflow-hidden">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color="#64ffda" />
          </Box>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-400 mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((t) => (
          <span
            key={t}
            className="px-2 py-1 bg-secondary bg-opacity-10 text-secondary rounded text-xs sm:text-sm"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-secondary hover:text-blue-500 transition-colors"
        >
          GitHub →
        </a>
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-secondary hover:text-blue-500 transition-colors"
        >
          Live Demo →
        </a>
      </div>
    </motion.div>
  )
}

const Projects = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [projectData, setProjectData] = useState([])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setProjectData(projects)
      } catch (error) {
        console.error('Error loading projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <section id="projects" className="min-h-screen py-12 sm:py-20 bg-primary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center">
            Featured Projects
          </h2>
          
          {isLoading ? (
            <ProjectShowcaseSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {projectData.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects 