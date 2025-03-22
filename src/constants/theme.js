export const THEME = {
  DARK: {
    DESK: "#1a1a1a",
    COMPUTER: "#2a2a2a",
    PARTICLES: "#64ffda",
    AMBIENT_LIGHT: 0.3,
    POINT_LIGHT: 0.8,
    ENVIRONMENT: 'night'
  },
  LIGHT: {
    DESK: "#e0e0e0",
    COMPUTER: "#d0d0d0",
    PARTICLES: "#00bcd4",
    AMBIENT_LIGHT: 0.5,
    POINT_LIGHT: 1,
    ENVIRONMENT: 'day'
  }
}

export const MATERIALS = {
  DESK: {
    metalness: 0.5,
    roughness: 0.2
  },
  COMPUTER: {
    metalness: 0.8,
    roughness: 0.1
  },
  PARTICLES: {
    metalness: 0.5,
    roughness: 0.2,
    transparent: true,
    opacity: 0.6
  }
} 