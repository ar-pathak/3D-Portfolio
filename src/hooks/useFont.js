import { useState, useEffect } from 'react'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

export const useFont = (url) => {
  const [font, setFont] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loader = new FontLoader()
    
    loader.load(
      url,
      (font) => {
        setFont(font)
        setError(null)
      },
      undefined,
      (error) => {
        console.error('Error loading font:', error)
        setError(error)
      }
    )
  }, [url])

  return { font, error }
} 