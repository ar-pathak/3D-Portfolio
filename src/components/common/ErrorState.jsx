import React from 'react'
import { Html } from '@react-three/drei'

const ErrorState = ({ message, onRetry }) => {
  return (
    <Html center>
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </Html>
  )
}

export default ErrorState 