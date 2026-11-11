const PageLoader = () => {
  return (
    <div
      aria-label="Loading page content"
      aria-live="polite"
      className="flex min-h-[80vh] w-full flex-col items-center justify-center px-4"
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="relative flex h-9 w-9 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent dark:border-emerald-400 dark:border-t-transparent" />
          <div className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
        </div>

        <p className="font-mono text-xs font-medium text-ink-500 dark:text-ink-400">
          Loading view...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
