import { useState, useCallback, useRef } from 'react'

export const useDragAndDrop = (options = {}) => {
  const {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave,
    accept = '*',
    multiple = false
  } = options

  const [isDragging, setIsDragging] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)
  const dropRef = useRef(null)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    setDragCounter(prev => prev + 1)
    if (dragCounter === 0) {
      setIsDragging(true)
    }

    onDragEnter?.(e)
  }, [dragCounter, onDragEnter])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    setDragCounter(prev => prev - 1)
    if (dragCounter === 1) {
      setIsDragging(false)
    }

    onDragLeave?.(e)
  }, [dragCounter, onDragLeave])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    onDragOver?.(e)
  }, [onDragOver])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    setIsDragging(false)
    setDragCounter(0)

    const files = Array.from(e.dataTransfer.files)
    const items = Array.from(e.dataTransfer.items)

    if (files.length > 0) {
      const acceptedFiles = files.filter(file => {
        if (accept === '*') return true
        return accept.split(',').some(type => file.type.match(type.trim()))
      })

      if (acceptedFiles.length > 0) {
        onDrop?.(multiple ? acceptedFiles : acceptedFiles[0])
      }
    } else if (items.length > 0) {
      const acceptedItems = items.filter(item => {
        if (accept === '*') return true
        return accept.split(',').some(type => item.type.match(type.trim()))
      })

      if (acceptedItems.length > 0) {
        onDrop?.(multiple ? acceptedItems : acceptedItems[0])
      }
    }
  }, [accept, multiple, onDrop])

  const handleDragStart = useCallback((e) => {
    onDragStart?.(e)
  }, [onDragStart])

  const handleDragEnd = useCallback((e) => {
    onDragEnd?.(e)
  }, [onDragEnd])

  return {
    dropRef,
    isDragging,
    dragProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd
    }
  }
}

// Drag and drop utility functions
export const dragAndDrop = {
  // File type helpers
  fileTypes: {
    images: 'image/*',
    documents: '.pdf,.doc,.docx,.txt',
    audio: 'audio/*',
    video: 'video/*',
    archives: '.zip,.rar,.7z',
    spreadsheets: '.xls,.xlsx,.csv',
    presentations: '.ppt,.pptx'
  },

  // File size helpers
  fileSizes: {
    bytes: (bytes) => bytes,
    kilobytes: (bytes) => bytes / 1024,
    megabytes: (bytes) => bytes / (1024 * 1024),
    gigabytes: (bytes) => bytes / (1024 * 1024 * 1024)
  },

  // File validation helpers
  validators: {
    maxSize: (file, maxSize) => file.size <= maxSize,
    minSize: (file, minSize) => file.size >= minSize,
    type: (file, type) => file.type.match(type),
    extension: (file, extensions) => {
      const fileExt = '.' + file.name.split('.').pop().toLowerCase()
      return extensions.split(',').map(ext => ext.trim()).includes(fileExt)
    }
  },

  // File processing helpers
  processors: {
    readAsText: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsText(file)
      })
    },
    readAsDataURL: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    readAsArrayBuffer: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      })
    }
  }
} 