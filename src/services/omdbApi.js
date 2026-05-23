import axios from 'axios'

const FEATURED_QUERY = 'movie'

const omdbApi = axios.create({
  baseURL: 'https://www.omdbapi.com/',
  params: {
    apikey: import.meta.env.VITE_OMDB_KEY,
  },
})

const normalizeMovie = (movie) => {
  const posterUrl = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : null
  const posterFallback = movie.imdbID
    ? `https://img.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}&i=${movie.imdbID}`
    : null

  return {
    id: movie.imdbID,
    imdbID: movie.imdbID,
    title: movie.Title,
    release_date: movie.Year,
    vote_average:
      movie.imdbRating && movie.imdbRating !== 'N/A'
        ? Number.parseFloat(movie.imdbRating)
        : 0,
    poster_path: posterUrl,
    poster_fallback: posterFallback,
    type: movie.Type,
  }
}

export const getMovieByTitle = async (title) => {
  const response = await omdbApi.get('', {
    params: {
      t: title,
      type: 'movie',
      plot: 'short',
    },
  })

  if (response.data?.Response === 'False') {
    return null
  }

  return normalizeMovie(response.data)
}

const fetchMovieDetails = async (movieId) => {
  const response = await omdbApi.get('', {
    params: {
      i: movieId,
      plot: 'short',
    },
  })

  if (response.data?.Response === 'False') {
    return null
  }

  return normalizeMovie(response.data)
}

const searchOmdbMovies = async (query, page = 1) => {
  const response = await omdbApi.get('', {
    params: {
      s: query,
      type: 'movie',
      page,
    },
  })

  if (response.data?.Response === 'False') {
    if (response.data?.Error === 'Movie not found!') {
      return {
        results: [],
        total_pages: 0,
      }
    }

    if (response.data?.Error === 'Too many results.') {
      throw new Error('Please use a more specific movie title or mood. OMDb returned too many broad matches.')
    }

    throw new Error(response.data?.Error || 'OMDb request failed.')
  }

  const searchResults = response.data?.Search || []
  const detailedMovies = await Promise.all(
    searchResults.map((movie) => fetchMovieDetails(movie.imdbID)),
  )

  return {
    results: detailedMovies.filter(Boolean),
    total_pages: Math.ceil(Number(response.data.totalResults || 0) / 10),
  }
}

export const getFeaturedMovies = async (page = 1) => {
  return searchOmdbMovies(FEATURED_QUERY, page)
}

export const searchMovies = async (query, page = 1) => {
  return searchOmdbMovies(query, page)
}

export default omdbApi
