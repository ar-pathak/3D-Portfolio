import React from 'react'
import { Interactive } from '@react-three/xr'

const InteractiveMesh = ({ position, geometry, color, onClick }) => (
  <Interactive onSelect={onClick}>
    <mesh position={position} castShadow receiveShadow>
      {geometry}
      <meshStandardMaterial 
        color={color}
        roughness={0.5}
        metalness={0.5}
      />
    </mesh>
  </Interactive>
)

const VRObjects = () => {
  return (
    <>
      <InteractiveMesh 
        position={[0, 1, -2]}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#64ffda"
        onClick={() => console.log('Box clicked')}
      />
      
      <InteractiveMesh 
        position={[2, 1, -2]}
        geometry={<sphereGeometry args={[0.5, 16, 16]} />}
        color="#ff64da"
        onClick={() => console.log('Sphere clicked')}
      />
      
      <InteractiveMesh 
        position={[-2, 1, -2]}
        geometry={<torusGeometry args={[0.5, 0.2, 8, 16]} />}
        color="#64daff"
        onClick={() => console.log('Torus clicked')}
      />
    </>
  )
}

export default VRObjects 