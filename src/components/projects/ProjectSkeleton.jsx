import { motion } from 'framer-motion'

const ProjectSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-6">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectSkeleton 