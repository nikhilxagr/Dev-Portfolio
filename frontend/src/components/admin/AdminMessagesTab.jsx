import { memo } from "react";
import { Mail, Send, Trash2 } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

const AdminMessagesTab = ({
  contactsLoading,
  contactsError,
  contacts,
  contactStatus,
  setContactStatus,
  loadContacts,
  handleMarkRead,
  handleDeleteContact,
  formatDate,
  submitting,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Enquiries &amp; Messages
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
            Inbound contact form submissions and service inquiries ({contacts.length} loaded).
          </p>
        </div>

        <div className="inline-flex items-center gap-1 rounded-xl border border-black/[0.08] bg-white p-1 dark:border-white/[0.08] dark:bg-[#11141c]">
          {[
            { id: "all", label: "All" },
            { id: "new", label: "Unread" },
            { id: "read", label: "Read" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setContactStatus(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                contactStatus === tab.id
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-500 hover:text-slate-900 dark:text-[#7a8296] dark:hover:text-[#eef0f5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {contactsLoading ? (
        <LoadingState message="Loading contact messages..." cards={4} />
      ) : contactsError ? (
        <ErrorState
          message={contactsError}
          onRetry={() => loadContacts({ status: contactStatus, useLoader: true })}
        />
      ) : contacts.length === 0 ? (
        <EmptyState
          title="No contact messages"
          message="Messages sent through the portfolio contact form will appear here."
        />
      ) : (
        <div className="space-y-4">
          {contacts.map((msg) => {
            const isRead = msg.status === "read";
            return (
              <article
                key={msg._id}
                className={`rounded-xl border p-5 transition-colors ${
                  isRead
                    ? "border-black/[0.08] bg-white opacity-85 dark:border-white/[0.08] dark:bg-[#11141c]"
                    : "border-amber-500/35 bg-white dark:border-amber-500/35 dark:bg-[#11141c]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/[0.06] pb-3.5 dark:border-white/[0.08]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-[#eef0f5]">
                        {msg.name || "Anonymous"}
                      </h3>
                      {!isRead && (
                        <span className="rounded-md border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-amber-700 dark:text-amber-300">
                          Unread
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-xs text-emerald-700 dark:text-emerald-400">
                      {msg.email}
                    </p>
                    {msg.phone && (
                      <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                        {msg.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1 text-right font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                    <span>{formatDate(msg.createdAt)}</span>
                    {msg.service && (
                      <span className="rounded-md border border-black/[0.08] bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#d1d5df]">
                        {msg.service}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-3 whitespace-pre-wrap rounded-lg border border-black/[0.06] bg-[#f8fafc] p-3.5 text-sm leading-relaxed text-slate-700 dark:border-white/[0.06] dark:bg-[#0c0e14] dark:text-[#d1d5df]">
                  {msg.message}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: Portfolio Enquiry - Nikhil Agrahari&body=Hi ${encodeURIComponent(
                      msg.name || "",
                    )},%0D%0A%0D%0AThank you for reaching out via my portfolio.`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-300"
                  >
                    <Send size={13} strokeWidth={1.5} /> Reply via Email
                  </a>

                  <div className="flex items-center gap-2">
                    {!isRead && (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleMarkRead(msg._id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/[0.1] dark:bg-[#1a1e28] dark:text-[#d1d5df] dark:hover:bg-[#222734]"
                      >
                        <Mail size={13} strokeWidth={1.5} /> Mark Read
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleDeleteContact(msg._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-500/15 dark:text-rose-300"
                    >
                      <Trash2 size={13} strokeWidth={1.5} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MemoizedAdminMessagesTab = memo(AdminMessagesTab);
MemoizedAdminMessagesTab.displayName = "AdminMessagesTab";

export default MemoizedAdminMessagesTab;
