import { FiSearch, FiX } from 'react-icons/fi'

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="relative w-full">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        className="h-11 w-full rounded-md border border-slate-800 bg-slate-900/85 pl-10 pr-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search movies..."
        aria-label="Search movies"
      />
      {value ? (
        <button
          className="absolute right-2 top-1/2 rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
          type="button"
          onClick={onClear}
          aria-label="Clear search"
        >
          <FiX />
        </button>
      ) : null}
    </div>
  )
}

export default SearchBar
