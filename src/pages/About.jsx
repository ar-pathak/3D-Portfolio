import { motion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

const About = () => {
  const { isDarkMode } = useTheme()

  const skills = [
    { name: 'React', level: 90, icon: '⚛️' },
    { name: 'Three.js', level: 85, icon: '🎮' },
    { name: 'JavaScript', level: 95, icon: '📜' },
    { name: 'TypeScript', level: 80, icon: '📘' },
    { name: 'Node.js', level: 85, icon: '🖥️' },
    { name: 'WebGL', level: 75, icon: '🎨' },
    { name: 'Redux', level: 85, icon: '🔄' },
    { name: 'TailwindCSS', level: 90, icon: '🎨' }
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-gray-50 via-white to-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            About Me
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Passionate about creating immersive digital experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* About Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className={`p-8 rounded-2xl backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'
            } shadow-lg`}>
              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                I'm a creative developer with a passion for building immersive web experiences. 
                With expertise in modern web technologies and 3D graphics, I create engaging 
                applications that push the boundaries of what's possible on the web.
              </p>
              <p className={`text-lg leading-relaxed mt-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                My journey in web development started with a curiosity for creating interactive 
                experiences. Today, I specialize in combining cutting-edge technologies to build 
                applications that are both beautiful and functional.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="/contact"
                className={`px-8 py-4 rounded-xl font-medium text-center ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                } transition-all duration-300`}
              >
                Get in Touch
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="/resume.pdf"
                className={`px-8 py-4 rounded-xl font-medium text-center border-2 ${
                  isDarkMode
                    ? 'border-blue-500 text-blue-400 hover:bg-blue-500/10'
                    : 'border-blue-500 text-blue-500 hover:bg-blue-500/10'
                } transition-all duration-300`}
              >
                Download Resume
              </motion.a>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`p-8 rounded-2xl backdrop-blur-sm ${
              isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'
            } shadow-lg`}
          >
            <h3 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Skills & Expertise
            </h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{skill.icon}</span>
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {skill.name}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className={`h-2.5 rounded-full overflow-hidden ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default About 