import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../../constants/projects.jsx'
import ProjectGrid from '../projects/ProjectGrid'
import ProjectModal from '../projects/ProjectModal'
import ProjectSkeleton from '../projects/ProjectSkeleton'
import SectionHeader from '../common/SectionHeader'
import { useComponentLoading } from '../../hooks/useComponentLoading'

const Projects = () => {
  const { isLoading, error, handleError } = useComponentLoading(1000)
  const [selectedProject, setSelectedProject] = useState(null)
  const [projectData, setProjectData] = useState([])

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setProjectData(projects.slice(0, 3)) // Show only first 3 projects
      } catch (error) {
        handleError(error)
      }
    }

    loadProjects()
  }, [handleError])

  if (error) {
    return (
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-red-500">Failed to load projects</h2>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Projects"
          subtitle="A showcase of my best work and innovative solutions in web development"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <ProjectGrid 
              projects={projectData} 
              onProjectSelect={setSelectedProject}
            />

            {selectedProject && (
              <ProjectModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mt-12"
            >
              <Link
                to="/projects"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                Explore All Projects
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

export default Projects 