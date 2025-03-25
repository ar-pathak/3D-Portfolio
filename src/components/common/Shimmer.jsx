import { motion } from 'framer-motion'

const Shimmer = ({ className = '', width = '100%', height = '100%' }) => {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

export const ShimmerText = ({ className = '', lines = 1 }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className="rounded"
          height="1rem"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}

export const ShimmerCard = ({ className = '' }) => {
  return (
    <div className={`p-4 rounded-lg bg-gray-800/50 ${className}`}>
      <Shimmer className="rounded-lg mb-4" height="200px" />
      <ShimmerText lines={3} />
    </div>
  )
}

export default Shimmer 