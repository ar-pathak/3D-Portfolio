import { Suspense } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/index'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CustomCursor from './components/3d/CustomCursor'
import ScrollProgress from './components/3d/ScrollProgress'
import { SceneManager } from './components/3d/SceneManager'
import { Workspace } from './components/3d/Workspace'
import ProjectShowcase from './components/3d/ProjectShowcase'
import WebXRScene from './components/3d/WebXRScene'
import LoadingScreen from './components/3d/LoadingScreen'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-white">
          <CustomCursor />
          <ScrollProgress />
          <Header />
          <main className="relative z-10">
            <Suspense fallback={<LoadingScreen />}>
              <div className="fixed inset-0 z-0">
                <SceneManager>
                  <Workspace />
                </SceneManager>
              </div>
              <div className="relative z-10">
                <Hero />
                <About />
                <ProjectShowcase />
                <Contact />
              </div>
            </Suspense>
          </main>
          <Footer />
          <WebXRScene />
        </div>
      </Provider>
    </ThemeProvider>
  )
}

export default App 