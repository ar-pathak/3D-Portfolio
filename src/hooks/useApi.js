import { useState, useCallback } from 'react'

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const execute = useCallback(async (...params) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await apiFunction(...params)
      setData(result)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [apiFunction])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    data,
    error,
    isLoading,
    execute,
    reset
  }
}

// API utility functions
export const api = {
  // HTTP methods
  get: async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    return handleResponse(response)
  },

  post: async (url, data, options = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  put: async (url, data, options = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data)
    })
    return handleResponse(response)
  },

  delete: async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    return handleResponse(response)
  },

  // File upload
  upload: async (url, file, options = {}) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        ...options.headers
      },
      body: formData
    })
    return handleResponse(response)
  }
}

// Response handler
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An error occurred'
    }))
    throw new Error(error.message || 'An error occurred')
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

// API error handling
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// API interceptors
export const interceptors = {
  request: [],
  response: []
}

// Add request interceptor
export const addRequestInterceptor = (interceptor) => {
  interceptors.request.push(interceptor)
}

// Add response interceptor
export const addResponseInterceptor = (interceptor) => {
  interceptors.response.push(interceptor)
}

// Remove request interceptor
export const removeRequestInterceptor = (interceptor) => {
  const index = interceptors.request.indexOf(interceptor)
  if (index > -1) {
    interceptors.request.splice(index, 1)
  }
}

// Remove response interceptor
export const removeResponseInterceptor = (interceptor) => {
  const index = interceptors.response.indexOf(interceptor)
  if (index > -1) {
    interceptors.response.splice(index, 1)
  }
} 