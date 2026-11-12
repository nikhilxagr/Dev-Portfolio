import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

/**
 * RouteErrorBoundary - Error boundary for catching chunk load errors
 * (e.g., network drop during dynamic import) and showing a clean reload UI.
 */
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[RouteErrorBoundary] Dynamic import failure:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[70vh] w-full flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-rose-500/30 bg-white p-8 dark:bg-[#11141c]">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={22} strokeWidth={1.5} />
            </div>

            <h2 className="font-display text-xl font-semibold text-ink-950 dark:text-ink-50">
              Connection Interrupted
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Unable to load this page section. Check your network connection and try again.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-ink-950 px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-ink-900 dark:border-white/[0.1] dark:bg-emerald-500 dark:text-ink-950 dark:hover:bg-emerald-400"
            >
              <RefreshCw size={14} strokeWidth={1.5} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
