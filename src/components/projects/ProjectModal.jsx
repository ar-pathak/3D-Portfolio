import { motion } from 'framer-motion'
import Project3DPreview from './Project3DPreview'

const ProjectModal = ({ project, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <Project3DPreview project={project} />
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {project.description}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}

export default ProjectModal 