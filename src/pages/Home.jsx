import { motion } from 'framer-motion'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import ProjectShowcase from '../components/3d/ProjectShowcase'
import Contact from '../components/sections/Contact'

const Home = () => {
  return (
    <div className="relative">
      <Hero />
      <About />
      <ProjectShowcase />
      <Contact />
    </div>
  )
}

export default Home 