export const createStandardMaterial = (color, options = {}) => {
  const {
    metalness = 0.5,
    roughness = 0.2,
    transparent = false,
    opacity = 1
  } = options

  return {
    color,
    metalness,
    roughness,
    transparent,
    opacity
  }
}

export const createThemeAwareMaterial = (darkColor, lightColor, options = {}) => {
  const { isDarkMode } = options
  return createStandardMaterial(isDarkMode ? darkColor : lightColor, options)
} 