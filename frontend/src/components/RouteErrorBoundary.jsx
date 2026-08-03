import React from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";

/**
 * RouteErrorBoundary — Error boundary for catching chunk load errors
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
          <div className="mx-auto max-w-md rounded-3xl border border-rose-500/30 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <AlertTriangle size={28} />
            </div>

            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
              Connection Interrupt
            </h2>

            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Unable to fetch this page section. Please check your network connection and try again.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg transition-transform hover:scale-[1.03] active:scale-95"
            >
              <RefreshCw size={14} className="animate-spin-slow" />
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
