import React from 'react'

const VRButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-4 right-4 px-4 py-2 bg-[#64ffda] text-[#0a192f] rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
    style={{
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    Enter VR
  </button>
)

export default VRButton 