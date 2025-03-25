import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

const ProjectGrid = ({ projects, onProjectSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onHoverStart={() => onProjectSelect(project)}
          onHoverEnd={() => onProjectSelect(null)}
        >
          <ProjectCard {...project} />
        </motion.div>
      ))}
    </div>
  )
}

export default ProjectGrid 