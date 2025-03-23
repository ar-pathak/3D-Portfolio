import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import ProjectsPage from './pages/Projects'
import CustomCursor from './components/3d/CustomCursor'
import ScrollProgress from './components/3d/ScrollProgress'
import WebXRScene from './components/3d/WebXRScene'
import LoadingScreen from './components/3d/LoadingScreen'
import { useTheme } from './context/ThemeContext'

function AppContent() {
  const { isDarkMode } = useTheme()
  
  return (
    <div className={`relative w-full min-h-screen overflow-x-hidden ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <CustomCursor />
      <ScrollProgress />
      <Header />
      <main className="relative z-10">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
                <Projects />
                <Contact />
              </>
            }
          />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      </main>
      <Footer />
      <WebXRScene />
    </div>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  )
}

export default App 