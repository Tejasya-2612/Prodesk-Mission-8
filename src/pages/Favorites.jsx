import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import MovieGrid from '../components/MovieGrid.jsx'
import useFavorites from '../hooks/useFavorites.js'

const Favorites = () => {
  const { favorites } = useFavorites()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-7 flex flex-col gap-4 border-b border-slate-800 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-400">
            Saved list
          </p>
          <h1 className="text-3xl font-bold tracking-normal text-white sm:text-4xl">
            Favorite movies
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Movies saved with the heart button are persisted in localStorage and
            stay here after refresh.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-800 px-4 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-900 hover:text-white"
          to="/"
        >
          <FiArrowLeft />
          Browse movies
        </Link>
      </section>

      <MovieGrid
        movies={favorites}
        emptyTitle="No favorites yet"
        emptyMessage="Start browsing featured movies or search for a title, then click the heart icon to save it here."
      />
    </div>
  )
}

export default Favorites
