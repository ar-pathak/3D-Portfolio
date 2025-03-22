export const COLORS = {
  dark: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    accent: '#00ff00',
    text: '#ffffff',
    surface: '#333333'
  },
  light: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    accent: '#00ff00',
    text: '#000000',
    surface: '#e0e0e0'
  }
}

export const POSITIONS = {
  computer: {
    default: [0, 0, 0],
    active: [0, 0, 0]
  },
  desk: {
    default: [0, -1, 0],
    active: [0, -1, 0]
  }
}

export const ROTATIONS = {
  computer: {
    default: [0, 0, 0],
    active: [0, Math.PI / 4, 0]
  },
  desk: {
    default: [0, 0, 0],
    active: [0, Math.PI / 4, 0]
  }
}

export const SCALES = {
  computer: {
    default: 1,
    active: 1.1
  },
  desk: {
    default: 1,
    active: 1.05
  }
} 