import { memo, useMemo, useState } from "react";
import { CheckCircle2, Edit3, Globe, MapPin, Phone, Search, Trash2, X } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

const INPUT_CLS =
  "w-full rounded-lg border border-black/[0.1] bg-[#f8fafc] px-3 py-2 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500";

const AdminUsersTab = ({
  users,
  usersLoading,
  usersError,
  onReloadUsers,
  onUpdateUser,
  onDeleteUser,
  formatDate,
  submitting,
}) => {
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    avatar: "",
    bio: "",
    isEmailVerified: false,
  });

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (providerFilter !== "all" && u.authProvider !== providerFilter) {
        return false;
      }
      if (!q) return true;
      return `${u.name || ""} ${u.email || ""} ${u.phone || ""} ${u.location || ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [users, search, providerFilter]);

  const openEditor = (u) => {
    setEditingUser(u);
    setUserForm({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      location: u.location || "",
      website: u.website || "",
      avatar: u.avatar || "",
      bio: u.bio || "",
      isEmailVerified: Boolean(u.isEmailVerified),
    });
  };

  const closeEditor = () => {
    setEditingUser(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!editingUser) return;
    const ok = await onUpdateUser(editingUser._id, {
      name: userForm.name.trim(),
      email: userForm.email.trim(),
      phone: userForm.phone.trim(),
      location: userForm.location.trim(),
      website: userForm.website.trim(),
      avatar: userForm.avatar.trim(),
      bio: userForm.bio.trim(),
      isEmailVerified: Boolean(userForm.isEmailVerified),
    });
    if (ok) closeEditor();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
            Users &amp; Profiles
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
            Inspect account activity, edit user profile details, verification status, or contact info ({users.length} accounts).
          </p>
        </div>

        <div className="inline-flex items-center gap-1 rounded-xl border border-black/[0.08] bg-white p-1 dark:border-white/[0.08] dark:bg-[#11141c]">
          {[
            { id: "all", label: "All" },
            { id: "google", label: "Google" },
            { id: "local", label: "Email" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setProviderFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                providerFilter === tab.id
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "text-slate-500 hover:text-slate-900 dark:text-[#7a8296] dark:hover:text-[#eef0f5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative rounded-xl border border-black/[0.08] bg-white p-3.5 dark:border-white/[0.08] dark:bg-[#11141c]">
        <Search
          size={15}
          strokeWidth={1.5}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search registered users by name, email, phone, or location..."
          className="w-full rounded-lg border border-black/[0.08] bg-[#f8fafc] py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:focus:border-emerald-500"
        />
      </div>

      {/* Edit User Modal / Panel */}
      {editingUser && (
        <div className="space-y-4 rounded-xl border border-emerald-600/35 bg-white p-5 sm:p-6 dark:border-emerald-500/35 dark:bg-[#11141c]">
          <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <UserAvatar user={editingUser} className="h-9 w-9 text-xs" />
              <div>
                <h2 className="font-display text-base font-semibold text-slate-900 dark:text-[#eef0f5]">
                  Edit User Details
                </h2>
                <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                  {editingUser.authProvider === "google" ? "Google OAuth" : "Local Account"} · Logins:{" "}
                  {editingUser.loginCount || 1}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-[#7a8296] dark:hover:bg-white/[0.06]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))}
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))}
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={userForm.phone}
                  onChange={(e) => setUserForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 ..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Location
                </label>
                <input
                  type="text"
                  value={userForm.location}
                  onChange={(e) => setUserForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="City, Country"
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Website URL
                </label>
                <input
                  type="text"
                  value={userForm.website}
                  onChange={(e) => setUserForm((p) => ({ ...p, website: e.target.value }))}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                  Avatar URL
                </label>
                <input
                  type="text"
                  value={userForm.avatar}
                  onChange={(e) => setUserForm((p) => ({ ...p, avatar: e.target.value }))}
                  placeholder="https://..."
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-[#a3a9b8]">
                Bio (max 250 characters)
              </label>
              <textarea
                rows={2}
                maxLength={250}
                value={userForm.bio}
                onChange={(e) => setUserForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Short profile bio..."
                className={INPUT_CLS}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700 dark:text-[#d1d5df]">
                <input
                  type="checkbox"
                  checked={userForm.isEmailVerified}
                  onChange={(e) =>
                    setUserForm((p) => ({ ...p, isEmailVerified: e.target.checked }))
                  }
                  className="h-4 w-4 rounded accent-emerald-600"
                />
                Email Verified Account
              </label>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-lg border border-black/[0.1] px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/[0.1] dark:text-[#d1d5df] dark:hover:bg-white/[0.05]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  {submitting ? "Saving..." : "Update User"}
                </button>
              </div>
            </div>

            {Array.isArray(editingUser.loginHistory) && editingUser.loginHistory.length > 0 && (
              <div className="border-t border-black/[0.08] pt-3 dark:border-white/[0.08]">
                <p className="mb-2 font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                  Recent Sign-Ins ({editingUser.loginHistory.length})
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {editingUser.loginHistory.slice(0, 4).map((entry, i) => (
                    <div
                      key={`${entry.loggedInAt}-${i}`}
                      className="rounded-lg border border-black/[0.06] bg-[#f8fafc] p-2.5 font-mono text-[11px] text-slate-600 dark:border-white/[0.06] dark:bg-[#0c0e14] dark:text-[#a3a9b8]"
                    >
                      <p className="font-medium text-slate-800 dark:text-[#eef0f5]">
                        {entry.device || "Browser Session"}
                      </p>
                      <p className="truncate text-slate-500 dark:text-[#7a8296]">
                        {entry.ip || "-"} · {formatDate(entry.loggedInAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {usersLoading ? (
        <LoadingState message="Loading registered accounts..." cards={4} />
      ) : usersError ? (
        <ErrorState message={usersError} onRetry={onReloadUsers} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No users match"
          message="Registered user accounts will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredUsers.map((u) => (
            <article
              key={u._id}
              className="flex flex-col justify-between rounded-xl border border-black/[0.08] bg-white p-4 transition-colors hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11141c] dark:hover:border-white/[0.16]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar user={u} className="h-10 w-10 shrink-0 text-sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate font-display text-sm font-semibold text-slate-900 dark:text-[#eef0f5]">
                          {u.name}
                        </h3>
                        {u.isEmailVerified && (
                          <CheckCircle2
                            size={13}
                            strokeWidth={1.75}
                            className="shrink-0 text-emerald-600 dark:text-emerald-400"
                            title="Verified"
                          />
                        )}
                      </div>
                      <p className="truncate font-mono text-xs text-emerald-700 dark:text-emerald-400">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-md border border-black/[0.08] bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-medium capitalize text-slate-600 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                    {u.authProvider || "local"}
                  </span>
                </div>

                {u.bio && (
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                    {u.bio}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-[#7a8296]">
                  {u.phone && (
                    <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                      <Phone size={12} strokeWidth={1.5} /> {u.phone}
                    </span>
                  )}
                  {u.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} strokeWidth={1.5} /> {u.location}
                    </span>
                  )}
                  {u.website && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <Globe size={12} strokeWidth={1.5} /> {u.website}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-black/[0.06] pt-3 text-xs dark:border-white/[0.08]">
                <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-[#7a8296]">
                  {u.loginCount || 1} sign-in{(u.loginCount || 1) !== 1 ? "s" : ""} · Last{" "}
                  {formatDate(u.lastLoginAt || u.createdAt)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditor(u)}
                    className="inline-flex items-center gap-1 rounded-lg border border-black/[0.08] bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-emerald-600/40 hover:text-emerald-700 dark:border-white/[0.1] dark:bg-[#1a1e28] dark:text-[#d1d5df] dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                  >
                    <Edit3 size={12} strokeWidth={1.5} /> Edit
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => onDeleteUser(u._id, u.email)}
                    aria-label={`Delete user ${u.email}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-500/15 dark:text-rose-300"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const MemoizedAdminUsersTab = memo(AdminUsersTab);
MemoizedAdminUsersTab.displayName = "AdminUsersTab";

export default MemoizedAdminUsersTab;
