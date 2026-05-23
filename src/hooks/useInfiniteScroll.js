import { useCallback, useEffect, useRef } from 'react'

const useInfiniteScroll = ({ loading, hasMore, onLoadMore }) => {
  const observerRef = useRef(null)

  const loaderRef = useCallback(
    (node) => {
      if (loading) return

      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onLoadMore()
          }
        },
        { rootMargin: '220px' },
      )

      if (node) {
        observerRef.current.observe(node)
      }
    },
    [hasMore, loading, onLoadMore],
  )

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return loaderRef
}

export default useInfiniteScroll
