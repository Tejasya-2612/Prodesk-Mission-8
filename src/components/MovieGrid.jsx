import MovieCard from './MovieCard.jsx'

const MovieGrid = ({ movies, emptyTitle = 'No movies found', emptyMessage }) => {
  if (!movies.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-800 bg-slate-900/50 px-6 py-14 text-center">
        <h2 className="text-lg font-semibold text-slate-200">{emptyTitle}</h2>
        {emptyMessage ? (
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {emptyMessage}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default MovieGrid
