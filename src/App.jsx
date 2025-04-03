import { Suspense, useState, useEffect, createContext, useContext } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/index'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Contact from './pages/Contact'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CustomCursor from './components/3d/CustomCursor'
import ScrollProgress from './components/3d/ScrollProgress'
import { SceneManager } from './components/3d/SceneManager'
import { Workspace } from './components/3d/Workspace'
import LoadingScreen from './components/3d/LoadingScreen'
import { ThemeProvider } from './context/ThemeContext'

// Create a responsive context
const ResponsiveContext = createContext(null);

export const useResponsive = () => useContext(ResponsiveContext);

// Responsive provider component
const ResponsiveProvider = ({ children }) => {
  const [deviceType, setDeviceType] = useState('desktop');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [devicePerformance, setDevicePerformance] = useState('high');

  useEffect(() => {
    // Detect touch capability
    const detectTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        navigator.msMaxTouchPoints > 0
      );
    };

    // Detect reduced motion preference
    const detectReducedMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };

    // Detect device type and performance
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      if (width <= 768) {
        setDeviceType('mobile');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width <= 1280) {
        setDeviceType('tablet');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setDeviceType('desktop');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }

      // Detect performance based on device type and GPU capabilities
      const detectPerformance = () => {
        // Check for WebGL support
        const gl = document.createElement('canvas').getContext('webgl');
        if (!gl) return 'low';
        
        // Try to get GPU info
        let renderer = '';
        try {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
          }
        } catch (e) {
          // Fallback if we can't get GPU info
        }
        
        const isHighEndGPU = 
          renderer.includes('nvidia') || 
          renderer.includes('amd') || 
          renderer.includes('radeon') ||
          renderer.includes('geforce');
          
        if (prefersReducedMotion) {
          return 'low';
        } else if (width <= 768) {
          return 'low';
        } else if (width <= 1280 && !isHighEndGPU) {
          return 'medium';
        } else if (width <= 1280 && isHighEndGPU) {
          return 'medium';
        } else {
          return 'high';
        }
      };
      
      setDevicePerformance(detectPerformance());
    };

    // Initial detection
    detectTouch();
    detectReducedMotion();
    handleResize();

    // Listen for changes
    window.addEventListener('resize', handleResize);
    
    // Media query for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', detectReducedMotion);

    return () => {
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', detectReducedMotion);
    };
  }, [prefersReducedMotion]);

  const value = {
    deviceType,
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    prefersReducedMotion,
    devicePerformance
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

// Page transition wrapper
const PageTransition = ({ children }) => {
  const variants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

// Animated Routes
const AnimatedRoutes = () => {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <PageTransition>
              <Projects />
            </PageTransition>
          } 
        />
        <Route 
          path="/about" 
          element={
            <PageTransition>
              <About />
            </PageTransition>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading - reduce time on low-end devices
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, window.innerWidth <= 768 ? 1500 : 3000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      <ResponsiveProvider>
        <Provider store={store}>
          <Router>
            <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-white">
              <CustomCursor />
              <ScrollProgress />
              
              {isLoading ? (
                <LoadingScreen />
              ) : (
                <>
                  <Header />
                  <main className="relative z-10">
                    <Suspense fallback={<LoadingScreen />}>
                      <div className="fixed inset-0 z-0">
                        <SceneManager>
                          <Workspace />
                        </SceneManager>
                      </div>
                      <div className="relative z-10">
                        <AnimatedRoutes />
                      </div>
                    </Suspense>
                  </main>
                  <Footer />
                </>
              )}
            </div>
          </Router>
        </Provider>
      </ResponsiveProvider>
    </ThemeProvider>
  )
}

export default App 