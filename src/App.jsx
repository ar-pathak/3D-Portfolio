import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { VRSupportProvider } from './context/VRSupportContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import MainContent from './components/layout/MainContent'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <VRSupportProvider>
            <ErrorBoundary>
              <MainContent />
            </ErrorBoundary>
          </VRSupportProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App 