const Loader = ({ label = 'Loading movies' }) => {
  return (
    <div className="flex w-full items-center justify-center py-10 text-sm text-slate-400">
      <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-red-500" />
      <span>{label}</span>
    </div>
  )
}

export default Loader
