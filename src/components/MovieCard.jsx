import { useState } from 'react'
import { FiHeart, FiStar } from 'react-icons/fi'
import { formatRating, getReleaseYear } from '../utils/helpers.js'
import useFavorites from '../hooks/useFavorites.js'

const MovieCard = ({ movie }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(movie.id)
  const [failedPosterUrls, setFailedPosterUrls] = useState([])
  const primaryPosterFailed = failedPosterUrls.includes(movie.poster_path)
  const fallbackPosterFailed = failedPosterUrls.includes(movie.poster_fallback)
  const posterUrl =
    movie.poster_path && !primaryPosterFailed
      ? movie.poster_path
      : movie.poster_fallback && !fallbackPosterFailed
        ? movie.poster_fallback
        : null

  const handlePosterError = () => {
    setFailedPosterUrls((currentUrls) =>
      currentUrls.includes(posterUrl) ? currentUrls : [...currentUrls, posterUrl],
    )
  }

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900">
      <div className="relative aspect-[2/3] bg-slate-800">
        {posterUrl ? (
          <img
            className="h-full w-full object-cover"
            src={posterUrl}
            alt={`${movie.title} poster`}
            loading="lazy"
            onError={handlePosterError}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-800 px-4 text-center text-sm font-medium text-slate-500">
            No Image
          </div>
        )}

        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-black/75 px-2 py-1 text-xs font-semibold text-amber-300 backdrop-blur">
          <FiStar className="fill-amber-300" />
          {formatRating(movie.vote_average)}
        </div>

        <button
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition ${
            favorite
              ? 'border-red-500 bg-red-600 text-white'
              : 'border-white/20 bg-black/55 text-white hover:bg-red-600'
          }`}
          type="button"
          onClick={() => toggleFavorite(movie)}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          title={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart className={favorite ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-100">
          {movie.title}
        </h3>
        <p className="text-xs text-slate-500">{getReleaseYear(movie.release_date)}</p>
      </div>
    </article>
  )
}

export default MovieCard
