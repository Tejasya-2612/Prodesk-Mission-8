import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiHeart, FiHome } from 'react-icons/fi'
import SearchBar from './SearchBar.jsx'
import useFavorites from '../hooks/useFavorites.js'

const Navbar = () => {
  const { favoriteCount } = useFavorites()
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const currentSearch = location.pathname === '/' ? params.get('q') || '' : ''

  const handleSearch = (value) => {
    const trimmedValue = value.trimStart()

    if (location.pathname !== '/') {
      navigate(`/?q=${encodeURIComponent(trimmedValue)}`)
      return
    }

    navigate(trimmedValue ? `/?q=${encodeURIComponent(trimmedValue)}` : '/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/92 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" to="/">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-red-600 text-lg font-black text-white shadow-lg shadow-red-950/30">
              C
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-normal text-white">
                CineStream
              </span>
              <span className="hidden text-xs text-slate-500 sm:block">
                Movie discovery
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <NavLink
              className={({ isActive }) =>
                `inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
              to="/"
              aria-label="Home"
            >
              <FiHome />
              <span className="hidden sm:inline">Home</span>
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`
              }
              to="/favorites"
            >
              <FiHeart />
              <span>Favorites</span>
              {favoriteCount > 0 ? (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">
                  {favoriteCount}
                </span>
              ) : null}
            </NavLink>
          </div>
        </div>

        <div className="max-w-2xl">
          <SearchBar
            value={currentSearch}
            onChange={handleSearch}
            onClear={() => navigate('/')}
          />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
