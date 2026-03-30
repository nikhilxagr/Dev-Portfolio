const LoadingState = ({ message = 'Loading data...', cards = 3 }) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">{message}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-2xl border border-cyan-300/10 bg-slate-900/70"
          />
        ))}
      </div>
    </div>
  )
}

export default LoadingState
