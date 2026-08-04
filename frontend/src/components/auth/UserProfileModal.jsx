import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Phone, Check, X, ShieldCheck, Loader2 } from "lucide-react";
import { useUserAuth } from "@/context/UserAuthContext";
import UserAvatar from "@/components/ui/UserAvatar";
import { updateUserProfileService } from "@/services/userAuth.service";

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const UserProfileModal = () => {
  const { user, isProfileModalOpen, closeProfileModal, updateUser } = useUserAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (!isProfileModalOpen || !user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setErrorMsg("");

    try {
      const updatedUser = await updateUserProfileService({
        name: name.trim(),
        phone: phone.trim(),
      });

      if (updatedUser) {
        updateUser(updatedUser);
      } else {
        updateUser({
          name: name.trim(),
          phone: phone.trim(),
        });
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        closeProfileModal();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProfileModal}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 shadow-2xl z-10 text-slate-100"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeProfileModal}
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <UserAvatar user={user} className="h-14 w-14 text-xl font-black border-2 border-emerald-400 shadow-md" />

            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-1.5">
                My Account Profile
                <ShieldCheck size={16} className="text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Manage your portfolio account profile
              </p>
            </div>
          </div>

          {savedSuccess ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-center">
              <Check className="mx-auto text-emerald-400 h-8 w-8" />
              <p className="mt-2 text-sm font-extrabold text-emerald-300">
                Profile Updated Successfully!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              {errorMsg && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-center text-xs font-bold text-rose-300">
                  {errorMsg}
                </div>
              )}

              {/* Full Name (Editable) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              {/* Email (Locked / Google Email) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  Account Email <span className="text-[10px] text-emerald-400 font-bold">(Google Mail 🔒)</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3">
                    <GoogleIcon />
                  </div>
                  <input
                    type="email"
                    readOnly
                    value={user.email || ""}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/40 pl-9 pr-3 py-2.5 text-xs text-slate-400 cursor-not-allowed font-medium outline-none"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Email is linked to your Google Account and cannot be modified.
                </p>
              </div>

              {/* Phone (Editable) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative flex items-center">
                  <Phone size={16} className="absolute left-3 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500 transition"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-2.5 text-xs font-extrabold text-slate-950 shadow-md hover:brightness-110 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserProfileModal;
