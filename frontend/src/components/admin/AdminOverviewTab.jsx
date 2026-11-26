import { memo } from "react";
import {
  BookOpen,
  Compass,
  CreditCard,
  FolderKanban,
  Mail,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

const AdminOverviewTab = ({
  overviewLoading,
  overviewError,
  overview,
  loadOverview,
  rangeDays,
  projectsCount,
  blogsCount,
  journeyCount,
  usersCount,
  paymentCount,
  onNavigateTab,
  formatCurrency,
  formatCount,
  formatPercent,
}) => {
  const totalPayments = overview?.payments?.total || 0;
  const paidPayments = overview?.payments?.paid || 0;
  const paymentSuccessRate = totalPayments ? (paidPayments / totalPayments) * 100 : null;
  const unreadContacts = overview?.contacts?.unread || 0;
  const newContacts = overview?.contacts?.new || 0;
  const totalUsers = usersCount ?? overview?.users?.total ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
          Overview
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
          Live metrics, registered accounts, content counts, and quick shortcuts across your portfolio.
        </p>
      </div>

      {overviewLoading ? (
        <LoadingState message="Loading workspace metrics..." cards={4} />
      ) : overviewError ? (
        <ErrorState
          message={overviewError}
          onRetry={() => loadOverview({ range: rangeDays, useLoader: true })}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#7a8296]">
                <span className="font-mono text-xs">Revenue</span>
                <CreditCard size={16} strokeWidth={1.5} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-emerald-700 sm:text-3xl dark:text-emerald-400">
                {formatCurrency(overview?.payments?.revenueInr)}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#7a8296]">
                Last {overview?.rangeDays || rangeDays} days
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#7a8296]">
                <span className="font-mono text-xs">Paid orders</span>
                <CreditCard size={16} strokeWidth={1.5} />
              </div>
              <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
                {formatCount(paidPayments)}{" "}
                <span className="text-sm font-normal text-slate-400 dark:text-[#7a8296]">
                  / {formatCount(totalPayments)}
                </span>
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {formatPercent(paymentSuccessRate)} completion rate
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#7a8296]">
                <span className="font-mono text-xs">Unread enquiries</span>
                <Mail size={16} strokeWidth={1.5} />
              </div>
              <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-amber-600 sm:text-3xl dark:text-amber-400">
                {formatCount(unreadContacts)}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#7a8296]">
                {formatCount(newContacts)} new in range
              </p>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
              <div className="flex items-center justify-between text-slate-500 dark:text-[#7a8296]">
                <span className="font-mono text-xs">Registered users</span>
                <Users size={16} strokeWidth={1.5} />
              </div>
              <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
                {formatCount(totalUsers)}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#7a8296]">
                {formatCount(projectsCount)} projects · {formatCount(blogsCount)} articles
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-[#eef0f5]">
                Quick Shortcuts
              </h2>
              <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                Changes sync directly to the live site
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: "site",
                  label: "Customize Hero, About & Socials",
                  icon: SlidersHorizontal,
                },
                {
                  id: "projects",
                  label: `Edit Projects (${projectsCount})`,
                  icon: FolderKanban,
                },
                {
                  id: "blogs",
                  label: `Manage Articles (${blogsCount})`,
                  icon: BookOpen,
                },
                {
                  id: "journey",
                  label: `Edit Journey Milestones (${journeyCount})`,
                  icon: Compass,
                },
                {
                  id: "users",
                  label: `Manage User Details (${formatCount(totalUsers)})`,
                  icon: Users,
                },
                {
                  id: "contacts",
                  label: `Review Enquiries (${unreadContacts} unread)`,
                  icon: Mail,
                },
                {
                  id: "payments",
                  label: `Payment Ledger (${paymentCount})`,
                  icon: CreditCard,
                },
              ].map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <button
                    key={shortcut.id}
                    type="button"
                    onClick={() => onNavigateTab(shortcut.id)}
                    className="flex items-center gap-2.5 rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3.5 py-2.5 text-left text-xs font-medium text-slate-800 transition-colors hover:border-emerald-600/35 hover:text-emerald-700 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#d1d5df] dark:hover:border-emerald-500/35 dark:hover:text-emerald-400"
                  >
                    <Icon size={15} strokeWidth={1.5} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span className="truncate">{shortcut.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const MemoizedAdminOverviewTab = memo(AdminOverviewTab);
MemoizedAdminOverviewTab.displayName = "AdminOverviewTab";

export default MemoizedAdminOverviewTab;
