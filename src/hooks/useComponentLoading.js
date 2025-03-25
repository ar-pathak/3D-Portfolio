import { useState, useEffect } from 'react'

export const useComponentLoading = (initialDelay = 0) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let timeoutId

    if (initialDelay > 0) {
      timeoutId = setTimeout(() => {
        setIsLoading(false)
      }, initialDelay)
    } else {
      setIsLoading(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [initialDelay])

  const handleError = (error) => {
    setError(error)
    setIsLoading(false)
  }

  const reset = () => {
    setIsLoading(true)
    setError(null)
  }

  return {
    isLoading,
    error,
    handleError,
    reset
  }
} 