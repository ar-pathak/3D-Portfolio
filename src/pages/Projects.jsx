import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'
import { projects } from '../constants/projects.jsx'

const Projects = () => {
  const { isDarkMode } = useTheme()
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [selectedTech, setSelectedTech] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [hoveredProject, setHoveredProject] = useState(null)

  // Get all unique technologies from projects
  const allTechnologies = ['all', ...new Set(projects.flatMap(project => project.tech))]

  // Filter and sort projects
  useEffect(() => {
    let result = [...projects]

    // Filter by technology
    if (selectedTech !== 'all') {
      result = result.filter(project => project.tech.includes(selectedTech))
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(project => 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      )
    }

    // Sort projects
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.id - a.id)
        break
      case 'oldest':
        result.sort((a, b) => a.id - b.id)
        break
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    setFilteredProjects(result)
  }, [selectedTech, searchQuery, sortBy])

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className={`text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-blue-400 via-purple-500 to-pink-500' : 'from-blue-600 via-purple-600 to-pink-600'}`}>
            My Projects
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Explore my collection of innovative projects and experiments
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mb-16 p-8 rounded-2xl backdrop-blur-sm ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200 shadow-lg'}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Search */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-700/50 text-white placeholder-gray-400 hover:bg-gray-700/70' : 'bg-gray-100 text-gray-900 placeholder-gray-500 hover:bg-gray-200'
                }`}
              />
            </div>

            {/* Technology Filter */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-700/50 text-white hover:bg-gray-700/70' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {allTechnologies.map(tech => (
                  <option key={tech} value={tech}>
                    {tech === 'all' ? 'All Technologies' : tech}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-700/50 text-white hover:bg-gray-700/70' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-2xl overflow-hidden ${
                  isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-lg hover:shadow-2xl transition-all duration-300`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    isDarkMode ? 'from-gray-900/90 via-gray-900/50 to-transparent' : 'from-gray-900/80 via-gray-900/40 to-transparent'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
                <div className="p-8">
                  <h3 className={`text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {project.title}
                  </h3>
                  <p className={`text-base mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          isDarkMode
                            ? 'bg-gray-700/50 text-blue-400 group-hover:bg-gray-700'
                            : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                        } transition-colors duration-300`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 text-center py-3 rounded-xl font-medium ${
                        isDarkMode
                          ? 'bg-gray-700/50 text-white hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } transition-all duration-300`}
                    >
                      GitHub
                    </motion.a>
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 text-center py-3 rounded-xl font-medium ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      } transition-all duration-300`}
                    >
                      Live Demo
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className={`inline-block p-6 rounded-full ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
            }`}>
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 18.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className={`mt-6 text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No projects found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Projects 