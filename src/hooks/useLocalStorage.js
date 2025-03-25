import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  }

  const [storedValue, setStoredValue] = useState(readValue)

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    setStoredValue(readValue())
  }, [])

  return [storedValue, setValue]
}

// Local storage utility functions
export const storage = {
  // Get item from local storage
  get: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  },

  // Set item in local storage
  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  },

  // Remove item from local storage
  remove: (key) => {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  },

  // Clear all items from local storage
  clear: () => {
    try {
      window.localStorage.clear()
    } catch (error) {
      console.warn('Error clearing localStorage:', error)
    }
  },

  // Get all keys from local storage
  keys: () => {
    try {
      return Object.keys(window.localStorage)
    } catch (error) {
      console.warn('Error getting localStorage keys:', error)
      return []
    }
  },

  // Get storage size
  size: () => {
    try {
      let total = 0
      for (let key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
          total += window.localStorage[key].length + key.length
        }
      }
      return total
    } catch (error) {
      console.warn('Error getting localStorage size:', error)
      return 0
    }
  },

  // Check if storage is available
  isAvailable: () => {
    try {
      const storage = window.localStorage
      const x = '__storage_test__'
      storage.setItem(x, x)
      storage.removeItem(x)
      return true
    } catch (error) {
      return false
    }
  }
} 