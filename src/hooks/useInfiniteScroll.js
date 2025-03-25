import { useState, useEffect, useCallback, useRef } from 'react'

export const useInfiniteScroll = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    root = null,
    onLoadMore,
    hasMore = true,
    isLoading = false,
    initialPage = 1
  } = options

  const [page, setPage] = useState(initialPage)
  const [isFetching, setIsFetching] = useState(false)
  const observerRef = useRef(null)
  const loadMoreRef = useRef(null)

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoading && !isFetching) {
        setPage((prevPage) => prevPage + 1)
        setIsFetching(true)
        onLoadMore?.(page + 1)
      }
    },
    [hasMore, isLoading, isFetching, onLoadMore, page]
  )

  useEffect(() => {
    const options = {
      root,
      rootMargin,
      threshold
    }

    observerRef.current = new IntersectionObserver(handleObserver, options)

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver, root, rootMargin, threshold])

  useEffect(() => {
    setIsFetching(false)
  }, [isLoading])

  const reset = useCallback(() => {
    setPage(initialPage)
    setIsFetching(false)
  }, [initialPage])

  return {
    loadMoreRef,
    page,
    isFetching,
    reset
  }
}

// Infinite scroll utility functions
export const infiniteScroll = {
  // Scroll position helpers
  scroll: {
    toTop: () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    toBottom: () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      })
    },
    toElement: (element, offset = 0) => {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  },

  // Loading state helpers
  loading: {
    show: (element) => {
      if (element) {
        element.style.display = 'block'
      }
    },
    hide: (element) => {
      if (element) {
        element.style.display = 'none'
      }
    }
  },

  // Pagination helpers
  pagination: {
    getPageFromUrl: () => {
      const params = new URLSearchParams(window.location.search)
      return parseInt(params.get('page')) || 1
    },
    updateUrl: (page) => {
      const url = new URL(window.location.href)
      url.searchParams.set('page', page)
      window.history.pushState({}, '', url)
    }
  },

  // Scroll event helpers
  events: {
    onScroll: (callback) => {
      window.addEventListener('scroll', callback)
      return () => window.removeEventListener('scroll', callback)
    },
    onScrollEnd: (callback, threshold = 100) => {
      let timeout
      const handler = () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          const isBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - threshold
          if (isBottom) {
            callback()
          }
        }, 150)
      }

      window.addEventListener('scroll', handler)
      return () => window.removeEventListener('scroll', handler)
    }
  }
} 