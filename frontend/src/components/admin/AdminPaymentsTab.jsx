import { memo } from "react";
import { CreditCard } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

const AdminPaymentsTab = ({
  paymentsLoading,
  paymentsError,
  paymentHistory,
  loadPayments,
  paymentStatusFilter,
  setPaymentStatusFilter,
  paymentServiceFilter,
  setPaymentServiceFilter,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_SERVICE_OPTIONS,
  formatCurrency,
  formatShortId,
  getPaymentBadgeClasses,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
            <CreditCard className="text-emerald-400" /> Cashfree Payment Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete transaction logs, webhook verifications, and order receipts ({paymentHistory.length} total).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 font-mono text-white outline-none focus:border-emerald-500"
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
            className="rounded-xl border border-slate-800 bg-slate-900 p-2 font-mono text-white outline-none focus:border-emerald-500"
          >
            {PAYMENT_SERVICE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {paymentsLoading ? (
        <LoadingState message="Loading payment transactions..." cards={4} />
      ) : paymentsError ? (
        <ErrorState message={paymentsError} onRetry={() => loadPayments({ useLoader: true })} />
      ) : paymentHistory.length === 0 ? (
        <EmptyState title="No transactions recorded" message="Payment orders will show up here once created." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#050e17]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400 uppercase">
              <tr>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">IDs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paymentHistory.map((pmt) => (
                <tr key={pmt.orderId || pmt._id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3.5">
                    <p className="font-bold text-white">{pmt.customerName || "Anonymous"}</p>
                    <p className="text-[10px] text-slate-500">{pmt.customerEmail}</p>
                  </td>
                  <td className="p-3.5 font-sans">
                    <p className="font-bold text-slate-200">{pmt.serviceName}</p>
                    <p className="text-[10px] font-mono text-slate-500">{pmt.serviceSlug}</p>
                  </td>
                  <td className="p-3.5 text-right font-bold text-emerald-400">{formatCurrency(pmt.amountInr)}</td>
                  <td className="p-3.5">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] uppercase font-bold ${getPaymentBadgeClasses(pmt.status)}`}>
                      {pmt.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
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
