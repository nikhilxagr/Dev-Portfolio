import { memo } from "react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

const AdminPaymentsTab = ({
  paymentsLoading,
  paymentsError,
  paymentHistory,
  paymentMeta,
  loadPayments,
  paymentStatusFilter,
  setPaymentStatusFilter,
  paymentServiceFilter,
  setPaymentServiceFilter,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_SERVICE_OPTIONS,
  formatCurrency,
  formatCount,
  formatDate,
  formatShortId,
  getPaymentBadgeClasses,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Payments &amp; Orders
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
            Cashfree bookings and support contributions over the last {paymentMeta.rangeDays} days (
            {paymentMeta.totalCount} records).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            aria-label="Filter payments by status"
            className="rounded-lg border border-black/[0.08] bg-white px-3 py-2 font-mono text-xs text-slate-800 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#11141c] dark:text-[#eef0f5] dark:focus:border-emerald-500"
          >
            {PAYMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={paymentServiceFilter}
            onChange={(e) => setPaymentServiceFilter(e.target.value)}
            aria-label="Filter payments by service"
            className="rounded-lg border border-black/[0.08] bg-white px-3 py-2 font-mono text-xs text-slate-800 outline-none focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#11141c] dark:text-[#eef0f5] dark:focus:border-emerald-500"
          >
            {PAYMENT_SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Paid", value: paymentMeta.statusCounts.paid, color: "text-emerald-700 dark:text-emerald-400" },
          { label: "Created", value: paymentMeta.statusCounts.created, color: "text-slate-900 dark:text-[#eef0f5]" },
          { label: "Failed", value: paymentMeta.statusCounts.failed, color: "text-rose-600 dark:text-rose-400" },
          { label: "Refunded", value: paymentMeta.statusCounts.refunded, color: "text-amber-600 dark:text-amber-400" },
        ].map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl border border-black/[0.08] bg-white p-3.5 text-center dark:border-white/[0.08] dark:bg-[#11141c]"
          >
            <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">{tile.label}</p>
            <p className={`mt-1 font-display text-2xl font-semibold tabular-nums ${tile.color}`}>
              {formatCount(tile.value)}
            </p>
          </div>
        ))}
      </div>

      {paymentsLoading ? (
        <LoadingState message="Loading payment records..." cards={4} />
      ) : paymentsError ? (
        <ErrorState message={paymentsError} onRetry={() => loadPayments({ useLoader: true })} />
      ) : paymentHistory.length === 0 ? (
        <EmptyState
          title="No payment records found"
          message="Transactions will appear here once checkout orders are created."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-[#11141c]">
          <table className="w-full min-w-[680px] text-left text-xs">
            <thead className="border-b border-black/[0.08] bg-[#f8fafc] font-mono text-slate-500 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#7a8296]">
              <tr>
                <th className="p-3.5 font-medium">Date</th>
                <th className="p-3.5 font-medium">Customer</th>
                <th className="p-3.5 font-medium">Service / Tier</th>
                <th className="p-3.5 text-right font-medium">Amount</th>
                <th className="p-3.5 font-medium">Status</th>
                <th className="p-3.5 font-medium">IDs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
              {paymentHistory.map((pmt) => (
                <tr
                  key={pmt.id || pmt.orderId}
                  className="transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.02]"
                >
                  <td className="p-3.5 font-mono text-slate-500 dark:text-[#7a8296]">
                    {formatDate(pmt.createdAt)}
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-slate-900 dark:text-[#eef0f5]">
                      {pmt.customerName || "Anonymous"}
                    </p>
                    <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                      {pmt.customerEmail}
                    </p>
                  </td>
                  <td className="p-3.5">
                    <p className="font-medium text-slate-800 dark:text-[#d1d5df]">
                      {pmt.serviceName}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500 dark:text-[#7a8296]">
                      {pmt.serviceSlug}
                    </p>
                  </td>
                  <td className="p-3.5 text-right font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(pmt.amountInr)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium capitalize ${getPaymentBadgeClasses(
                        pmt.status,
                      )}`}
                    >
                      {pmt.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500 dark:text-[#7a8296]">
                    <p>Order: {formatShortId(pmt.orderId)}</p>
                    <p>Pay: {formatShortId(pmt.paymentId)}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const MemoizedAdminPaymentsTab = memo(AdminPaymentsTab);
MemoizedAdminPaymentsTab.displayName = "AdminPaymentsTab";

export default MemoizedAdminPaymentsTab;
