const LoadingState = ({
  message = "Loading data...",
  cards = 3,
  variant = "cards",
}) => {
  if (variant === "blog") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-400">{message}</p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-cyan-300/10 bg-slate-900/70 p-5"
            >
              <div className="h-44 rounded-xl bg-slate-800/80" />
              <div className="mt-4 h-3 w-8/12 rounded bg-slate-800/80" />
              <div className="mt-3 h-5 w-11/12 rounded bg-slate-800/80" />
              <div className="mt-3 h-3 w-full rounded bg-slate-800/80" />
              <div className="mt-2 h-3 w-10/12 rounded bg-slate-800/80" />
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 rounded bg-slate-800/80" />
                <div className="h-6 w-16 rounded bg-slate-800/80" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "details") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-400">{message}</p>
        <div className="animate-pulse space-y-4">
          <div className="h-40 rounded-2xl border border-cyan-300/10 bg-slate-900/70" />
          <div className="h-60 rounded-2xl border border-cyan-300/10 bg-slate-900/70" />
          <div className="h-52 rounded-2xl border border-cyan-300/10 bg-slate-900/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">{message}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-2xl border border-cyan-300/10 bg-slate-900/70 p-4"
          >
            <div className="h-36 rounded-xl bg-slate-800/80" />
            <div className="mt-4 h-4 w-11/12 rounded bg-slate-800/80" />
            <div className="mt-2 h-4 w-8/12 rounded bg-slate-800/80" />
            <div className="mt-3 h-3 w-full rounded bg-slate-800/80" />
            <div className="mt-2 h-3 w-10/12 rounded bg-slate-800/80" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-16 rounded bg-slate-800/80" />
              <div className="h-6 w-16 rounded bg-slate-800/80" />
              <div className="h-6 w-16 rounded bg-slate-800/80" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
