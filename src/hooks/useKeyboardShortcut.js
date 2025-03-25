import { useEffect, useCallback } from 'react'

export const useKeyboardShortcut = (key, callback, options = {}) => {
  const {
    ctrlKey = false,
    shiftKey = false,
    altKey = false,
    metaKey = false,
    preventDefault = true,
    stopPropagation = false
  } = options

  const handleKeyPress = useCallback((event) => {
    // Check if the pressed key matches our target key
    const isKeyMatch = event.key.toLowerCase() === key.toLowerCase()

    // Check if modifier keys match
    const isCtrlMatch = !ctrlKey || event.ctrlKey
    const isShiftMatch = !shiftKey || event.shiftKey
    const isAltMatch = !altKey || event.altKey
    const isMetaMatch = !metaKey || event.metaKey

    // If all conditions are met, execute the callback
    if (isKeyMatch && isCtrlMatch && isShiftMatch && isAltMatch && isMetaMatch) {
      if (preventDefault) {
        event.preventDefault()
      }
      if (stopPropagation) {
        event.stopPropagation()
      }
      callback(event)
    }
  }, [key, callback, ctrlKey, shiftKey, altKey, metaKey, preventDefault, stopPropagation])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])
}

// Keyboard shortcut utility functions
export const shortcuts = {
  // Common shortcuts
  copy: (callback) => useKeyboardShortcut('c', callback, { ctrlKey: true }),
  paste: (callback) => useKeyboardShortcut('v', callback, { ctrlKey: true }),
  cut: (callback) => useKeyboardShortcut('x', callback, { ctrlKey: true }),
  undo: (callback) => useKeyboardShortcut('z', callback, { ctrlKey: true }),
  redo: (callback) => useKeyboardShortcut('y', callback, { ctrlKey: true }),
  save: (callback) => useKeyboardShortcut('s', callback, { ctrlKey: true }),
  
  // Navigation shortcuts
  next: (callback) => useKeyboardShortcut('ArrowRight', callback),
  previous: (callback) => useKeyboardShortcut('ArrowLeft', callback),
  up: (callback) => useKeyboardShortcut('ArrowUp', callback),
  down: (callback) => useKeyboardShortcut('ArrowDown', callback),
  
  // Selection shortcuts
  selectAll: (callback) => useKeyboardShortcut('a', callback, { ctrlKey: true }),
  deselectAll: (callback) => useKeyboardShortcut('Escape', callback),
  
  // Search shortcuts
  search: (callback) => useKeyboardShortcut('f', callback, { ctrlKey: true }),
  findNext: (callback) => useKeyboardShortcut('g', callback, { ctrlKey: true }),
  findPrevious: (callback) => useKeyboardShortcut('g', callback, { ctrlKey: true, shiftKey: true }),
  
  // View shortcuts
  zoomIn: (callback) => useKeyboardShortcut('+', callback, { ctrlKey: true }),
  zoomOut: (callback) => useKeyboardShortcut('-', callback, { ctrlKey: true }),
  resetZoom: (callback) => useKeyboardShortcut('0', callback, { ctrlKey: true }),
  
  // Window shortcuts
  newWindow: (callback) => useKeyboardShortcut('n', callback, { ctrlKey: true }),
  closeWindow: (callback) => useKeyboardShortcut('w', callback, { ctrlKey: true }),
  refresh: (callback) => useKeyboardShortcut('r', callback, { ctrlKey: true }),
  
  // Help shortcuts
  help: (callback) => useKeyboardShortcut('?', callback, { shiftKey: true }),
  
  // Custom shortcuts
  custom: (key, callback, options = {}) => useKeyboardShortcut(key, callback, options)
}

// Keyboard shortcut manager
export class ShortcutManager {
  constructor() {
    this.shortcuts = new Map()
  }

  register(key, callback, options = {}) {
    const shortcut = useKeyboardShortcut(key, callback, options)
    this.shortcuts.set(key, shortcut)
    return shortcut
  }

  unregister(key) {
    this.shortcuts.delete(key)
  }

  clear() {
    this.shortcuts.clear()
  }
}

// Create a singleton instance
export const shortcutManager = new ShortcutManager() 