export const getReleaseYear = (date) => {
  if (!date) return 'TBA'
  return String(date).slice(0, 4)
}

export const formatRating = (rating) => {
  if (!Number.isFinite(rating) || rating <= 0) return 'NR'
  return rating.toFixed(1)
}

export const normalizeMovies = (movies = []) => {
  const seen = new Set()

  return movies.filter((movie) => {
    if (!movie?.id || seen.has(movie.id)) return false
    seen.add(movie.id)
    return true
  })
}
