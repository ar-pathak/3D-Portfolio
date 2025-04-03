import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  const { isDarkMode } = useTheme()

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const spinnerContent = (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} border-4 rounded-full ${
          isDarkMode ? 'border-gray-700 border-t-blue-500' : 'border-gray-200 border-t-blue-500'
        }`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        {spinnerContent}
      </div>
    )
  }

  return spinnerContent
}

export default LoadingSpinner 