import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme, setTheme } from '../store/themeSlice'

export const useTheme = () => {
  const dispatch = useDispatch()
  const isDarkMode = useSelector((state) => state.theme.isDarkMode)

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggle = () => dispatch(toggleTheme())
  const set = (isDark) => dispatch(setTheme(isDark))

  return {
    isDarkMode,
    toggleTheme: toggle,
    setTheme: set
  }
} 