import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const Shimmer = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className={`${height} ${width} ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
        } rounded`}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <div
        className={`absolute inset-0 ${height} ${width} ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        } rounded`}
      />
    </div>
  )
}

export default Shimmer 