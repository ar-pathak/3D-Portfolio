import { useTheme } from '../../hooks/useTheme'
import { useParticles } from '../hooks/useParticles'
import { createThemeAwareMaterial } from '../utils/materials'

const FloatingParticles = () => {
  const { isDarkMode } = useTheme()
  const { particlesRef, spread } = useParticles(50, {
    amplitude: 0.5,
    speed: 1,
    rotationSpeed: 0.2
  })

  const material = createThemeAwareMaterial(
    "#64ffda",
    "#00bcd4",
    { isDarkMode, transparent: true, opacity: 0.6, metalness: 0.5, roughness: 0.2 }
  )

  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          ref={particlesRef.current[i]}
          position={[
            Math.random() * spread - spread/2,
            Math.random() * spread - spread/2,
            Math.random() * spread - spread/2,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial {...material} />
        </mesh>
      ))}
    </>
  )
}

export default FloatingParticles 