import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import MoodMatcher from '../components/MoodMatcher.jsx'
import MovieGrid from '../components/MovieGrid.jsx'
import useDebounce from '../hooks/useDebounce.js'
import useInfiniteScroll from '../hooks/useInfiniteScroll.js'
import { getFeaturedMovies, searchMovies } from '../services/omdbApi.js'
import { normalizeMovies } from '../utils/helpers.js'

const Home = () => {
  const location = useLocation()
  const query = new URLSearchParams(location.search).get('q') || ''
  const debouncedQuery = useDebounce(query, 500)
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const requestKeyRef = useRef('')

  const fetchMovies = useCallback(
    async (pageToFetch = 1, searchTerm = debouncedQuery) => {
      if (!import.meta.env.VITE_OMDB_KEY) {
        setError('Missing VITE_OMDB_KEY. Add your OMDb API key to a .env file.')
        setLoading(false)
        setHasMore(false)
        return
      }

      setLoading(true)
      setError('')

      const requestKey = `${searchTerm}-${pageToFetch}`
      requestKeyRef.current = requestKey

      try {
        const data = searchTerm.trim()
          ? await searchMovies(searchTerm.trim(), pageToFetch)
          : await getFeaturedMovies(pageToFetch)

        if (requestKeyRef.current !== requestKey) return

        setMovies((previousMovies) => {
          const nextMovies = pageToFetch === 1 ? data.results : [...previousMovies, ...data.results]
          return normalizeMovies(nextMovies)
        })
        setPage(pageToFetch)
        setHasMore(pageToFetch < data.total_pages && data.results.length > 0)
      } catch {
        setError('Something went wrong while loading movies from OMDb. Please try again.')
        if (pageToFetch === 1) setMovies([])
      } finally {
        if (requestKeyRef.current === requestKey) {
          setLoading(false)
        }
      }
    },
    [debouncedQuery],
  )

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetchMovies(1, debouncedQuery)
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [debouncedQuery, fetchMovies])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMovies(page + 1, debouncedQuery)
    }
  }, [debouncedQuery, fetchMovies, hasMore, loading, page])

  const loaderRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
  })

  const title = debouncedQuery ? `Search results for "${debouncedQuery}"` : 'Featured movies'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-400">
            Stream smarter
          </p>
          <h1 className="max-w-3xl text-3xl font-bold tracking-normal text-white sm:text-5xl">
            Discover movies worth adding to your watchlist.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Browse OMDb movie listings, search with debounce, save favorites, and
            let AI suggest one movie when you know the mood but not the title.
          </p>
        </div>
      </section>

      <div className="mb-8">
        <MoodMatcher />
      </div>

      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {debouncedQuery ? 'Search is debounced by 500ms.' : 'Fetched from a real OMDb movie search.'}
            </p>
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-md border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {loading && movies.length === 0 ? (
          <Loader />
        ) : (
          <MovieGrid
            movies={movies}
            emptyTitle={debouncedQuery ? 'No matches found' : 'No popular movies available'}
            emptyMessage={
              debouncedQuery
                ? 'Try a different title or check the spelling.'
                : 'OMDb did not return movies for this request.'
            }
          />
        )}

        <div ref={loaderRef} className="h-8" />
        {loading && movies.length > 0 ? <Loader label="Loading more movies" /> : null}
        {!hasMore && movies.length > 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            You have reached the end of this list.
          </p>
        ) : null}
      </section>
    </div>
  )
}

export default Home
