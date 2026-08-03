import { memo } from "react";
import { Mail } from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

const AdminMessagesTab = ({
  contactsLoading,
  contactsError,
  contacts,
  loadContacts,
  handleMarkContactAsRead,
  formatDate,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
          <Mail className="text-cyan-400" /> Contact Inquiries Inbox
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Direct messages and project inquiries sent via contact form ({contacts.length} total).
        </p>
      </div>

      {contactsLoading ? (
        <LoadingState message="Loading inquiries..." cards={3} />
      ) : contactsError ? (
        <ErrorState message={contactsError} onRetry={() => loadContacts({ useLoader: true })} />
      ) : contacts.length === 0 ? (
        <EmptyState title="No contact messages" message="New messages sent from your contact form will show here." />
      ) : (
        <div className="space-y-4">
          {contacts.map((msg) => (
            <article
              key={msg._id}
              className={`rounded-2xl border p-5 transition ${
                msg.isRead
                  ? "border-slate-800 bg-[#050e17] opacity-80"
                  : "border-cyan-500/40 bg-[#071726] shadow-lg"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-white">{msg.name || "Anonymous Sender"}</h3>
                  <p className="text-xs font-mono text-cyan-400">{msg.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-400">{formatDate(msg.createdAt)}</span>
                  {!msg.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkContactAsRead(msg._id)}
                      className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300 hover:bg-cyan-500/20"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">{msg.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const MemoizedAdminMessagesTab = memo(AdminMessagesTab);
MemoizedAdminMessagesTab.displayName = "AdminMessagesTab";

export default MemoizedAdminMessagesTab;
