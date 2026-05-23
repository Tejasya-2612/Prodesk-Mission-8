import { useState } from 'react'
import { FiCpu, FiZap } from 'react-icons/fi'
import MovieCard from './MovieCard.jsx'
import Loader from './Loader.jsx'
import { getMoodMovieTitle } from '../services/aiApi.js'
import { getMovieByTitle, searchMovies } from '../services/omdbApi.js'

const MoodMatcher = () => {
  const [mood, setMood] = useState('')
  const [recommendedMovie, setRecommendedMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!mood.trim()) {
      setError('Tell CineStream what kind of mood you are in first.')
      return
    }

    if (!import.meta.env.VITE_OMDB_KEY) {
      setError('Add VITE_OMDB_KEY to .env first. The AI title still needs OMDb to display the recommended movie card.')
      return
    }

    setLoading(true)
    setError('')
    setRecommendedMovie(null)

    try {
      const title = await getMoodMovieTitle(mood.trim())
      const exactMovie = await getMovieByTitle(title)
      const results = exactMovie ? null : await searchMovies(title, 1)
      const movie = exactMovie || results?.results?.[0]

      if (!movie) {
        throw new Error('OMDb could not find a matching movie for that mood.')
      }

      setRecommendedMovie(movie)
    } catch (caughtError) {
      setError(
        caughtError?.message ||
          'Could not create a recommendation right now. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/65 p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-200">
            <FiCpu />
            AI Mood Matcher
          </div>
          <h2 className="text-xl font-semibold text-white">Find a movie for tonight</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Describe your mood and CineStream asks Gemini for one title, then searches
            OMDb for the real movie listing.
          </p>
        </div>
      </div>

      <form className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
        <textarea
          className="min-h-24 rounded-md border border-slate-800 bg-slate-950/80 p-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          value={mood}
          onChange={(event) => setMood(event.target.value)}
          placeholder="I am feeling sad but want an action movie"
          aria-label="Describe your movie mood"
        />
        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 md:self-end"
          type="submit"
          disabled={loading}
        >
          <FiZap />
          Match Mood
        </button>
      </form>

      {loading ? <Loader label="Finding a recommendation" /> : null}

      {error ? (
        <div className="mt-4 rounded-md border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {recommendedMovie ? (
        <div className="mt-6 max-w-[220px]">
          <MovieCard movie={recommendedMovie} />
        </div>
      ) : null}
    </section>
  )
}

export default MoodMatcher
