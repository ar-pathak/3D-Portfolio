export const springConfig = {
  tension: 120,
  friction: 14,
  mass: 1
}

export const createHoverAnimation = (scale = 1.1) => ({
  scale: scale,
  config: springConfig
})

export const createClickAnimation = (scale = 0.95) => ({
  scale: scale,
  config: { ...springConfig, tension: 200 }
})

export const createTransitionAnimation = (position, rotation, scale) => ({
  position,
  rotation,
  scale,
  config: springConfig
}) 