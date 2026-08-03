import { memo } from "react";
import { CreditCard, Mail, RefreshCcw, ShieldCheck } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

const AdminOverviewTab = ({
  overviewLoading,
  overviewError,
  overview,
  loadOverview,
  rangeDays,
  setRangeDays,
  RANGE_OPTIONS,
  formatCurrency,
  formatCount,
  formatDate,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
            <ShieldCheck className="text-emerald-400" /> Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry, payment analytics, and contact inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {RANGE_OPTIONS.map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setRangeDays(days)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition ${
                rangeDays === days
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                  : "border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {days}d
            </button>
          ))}
          <button
            type="button"
            onClick={() => loadOverview({ useLoader: true })}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white transition"
            title="Refresh analytics"
          >
            <RefreshCcw size={15} />
          </button>
        </div>
      </div>

      {overviewLoading ? (
        <LoadingState message="Loading command center telemetry..." cards={4} />
      ) : overviewError ? (
        <ErrorState message={overviewError} onRetry={() => loadOverview({ useLoader: true })} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-[#050e17] p-5">
            <p className="font-mono text-xs uppercase text-slate-400">Total Revenue ({rangeDays}d)</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">{formatCurrency(overview?.revenueInr)}</p>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{overview?.paidCount || 0} Successful Transactions</p>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-[#050e17] p-5">
            <p className="font-mono text-xs uppercase text-slate-400">Contact Inquiries</p>
            <p className="mt-2 text-2xl font-black text-cyan-300">{formatCount(overview?.totalContacts)}</p>
            <p className="mt-1 font-mono text-[11px] text-cyan-400/80">{overview?.unreadContacts || 0} Unread Messages</p>
          </div>

          <div className="rounded-2xl border border-purple-500/30 bg-[#050e17] p-5">
            <p className="font-mono text-xs uppercase text-slate-400">Published Content</p>
            <p className="mt-2 text-2xl font-black text-purple-300">{formatCount(overview?.totalProjects + overview?.totalBlogs)}</p>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{overview?.totalProjects || 0} Projects · {overview?.totalBlogs || 0} Articles</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-[#050e17] p-5">
            <p className="font-mono text-xs uppercase text-slate-400">System Health</p>
            <p className="mt-2 text-2xl font-black text-amber-300">OPERATIONAL</p>
            <p className="mt-1 font-mono text-[11px] text-slate-500">API Latency &lt;45ms</p>
          </div>
        </div>
      )}
    </div>
  );
};

const MemoizedAdminOverviewTab = memo(AdminOverviewTab);
MemoizedAdminOverviewTab.displayName = "AdminOverviewTab";

export default MemoizedAdminOverviewTab;
