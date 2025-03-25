import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

const HeroContent = () => {
  const { isDarkMode } = useTheme()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-bold"
        >
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Creative Developer
          </span>
          <br />
          <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Building Digital Experiences
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className={`text-lg sm:text-xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          Crafting immersive web experiences with modern technologies and creative solutions.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#projects"
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Projects
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className={`px-8 py-3 rounded-lg border-2 transition-colors ${
              isDarkMode
                ? 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500/10'
            }`}
          >
            Get in Touch
          </motion.a>
        </motion.div>

        <ScrollIndicator isDarkMode={isDarkMode} />
      </motion.div>
    </div>
  )
}

const ScrollIndicator = ({ isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 1 }}
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
  >
    <div className="flex flex-col items-center">
      <span className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Scroll Down
      </span>
      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </div>
  </motion.div>
)

export default HeroContent 