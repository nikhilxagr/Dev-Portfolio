import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Phone,
  Check,
  X,
  Camera,
  MapPin,
  Globe,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useUserAuth } from "@/context/UserAuthContext";
import UserAvatar from "@/components/ui/UserAvatar";
import { updateUserProfileService } from "@/services/userAuth.service";

const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state with active user object whenever modal opens
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setWebsite(user.website || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
      setAvatarPreview(user.avatar || "");
      setErrorMsg("");
      setSavedSuccess(false);
    }
  }, [user, isProfileModalOpen]);

  // Handle client-side image compression and square crop to crisp WebP/JPEG data URL
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (JPEG, PNG, or WebP).");
      return;
    }

    // Maximum 5 MB check
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size exceeds 5 MB. Please select a smaller photo.");
      return;
    }

    setErrorMsg("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const size = 256; // 256x256 square crop for crystal clarity
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");

          // Calculate center crop
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);

          // Convert to efficient WebP (or JPEG fallback)
          const dataUrl = canvas.toDataURL("image/webp", 0.88);
          setAvatar(dataUrl);
          setAvatarPreview(dataUrl);
        } catch {
          // If canvas fails, fallback to raw reader result
          setAvatar(event.target.result);
          setAvatarPreview(event.target.result);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Display name cannot be empty.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        name: name.trim(),
        bio: bio.trim().slice(0, 250),
        location: location.trim().slice(0, 100),
        website: website.trim().slice(0, 200),
        phone: phone.trim().slice(0, 30),
        avatar: avatar,
      };

      const updatedUser = await updateUserProfileService(payload);

      if (updatedUser) {
        updateUser(updatedUser);
      } else {
        updateUser(payload);
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        closeProfileModal();
      }, 1100);
    } catch (err) {
      setErrorMsg(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!isProfileModalOpen || !user) return null;

  const mockUserForAvatar = {
    ...user,
    name: name || user.name,
    avatar: avatarPreview,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProfileModal}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl z-10 text-slate-900 dark:text-zinc-100 my-8"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={closeProfileModal}
            className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white transition"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="border-b border-slate-100 dark:border-white/[0.08] pb-4">
            <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-lime-600 dark:text-lime-400">
              ACCOUNT PROFILE
            </p>
            <h3 className="font-jakarta text-2xl font-black text-slate-950 dark:text-white mt-1">
              Edit your profile
            </h3>
          </div>

          {savedSuccess ? (
            <div className="my-8 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Check size={24} />
              </div>
              <h4 className="text-base font-bold text-emerald-400">
                Profile Updated Successfully!
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Your public profile and account details have been saved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-6 space-y-5">
              {errorMsg && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-center gap-2.5 text-xs font-semibold text-rose-500 dark:text-rose-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Profile Image Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/50 p-4 sm:p-5">
                <div className="relative group shrink-0">
                  <UserAvatar
                    user={mockUserForAvatar}
                    className="h-16 w-16 text-2xl font-black border-2 border-lime-400 shadow-md ring-4 ring-lime-400/10"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 cursor-pointer"
                    title="Upload new image"
                  >
                    <Camera size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Profile image
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    JPEG, PNG, or WebP. Maximum 5 MB. Images are automatically cropped to a square.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-zinc-800 px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition shadow-xs"
                    >
                      <Camera size={13} />
                      <span>{avatarPreview ? "Change image" : "Upload image"}</span>
                    </button>

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/20 transition"
                      >
                        <Trash2 size={12} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Display name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User size={15} className="absolute left-3.5 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Display Name"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition"
                  />
                </div>
              </div>

              {/* Bio with Character Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Bio
                  </label>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                    {bio.length}/180
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={180}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short note about you, your tech stack, or interests..."
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 p-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition resize-none"
                />
              </div>

              {/* Location & Website Grid */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Location
                  </label>
                  <div className="relative flex items-center">
                    <MapPin size={15} className="absolute left-3.5 text-slate-400 dark:text-zinc-500" />
                    <input
                      type="text"
                      maxLength={100}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Lucknow, India"
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                    Website / Social
                  </label>
                  <div className="relative flex items-center">
                    <Globe size={15} className="absolute left-3.5 text-slate-400 dark:text-zinc-500" />
                    <input
                      type="url"
                      maxLength={200}
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300">
                  Phone number <span className="text-[10px] text-slate-400 dark:text-zinc-500">(Optional)</span>
                </label>
                <div className="relative flex items-center">
                  <Phone size={15} className="absolute left-3.5 text-slate-400 dark:text-zinc-500" />
                  <input
                    type="tel"
                    maxLength={30}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900/80 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition"
                  />
                </div>
              </div>

              {/* Google account email (Locked) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <span>Google account email</span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">🔒</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5">
                    <GoogleIcon />
                  </div>
                  <input
                    type="email"
                    readOnly
                    value={user.email || ""}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/70 dark:bg-zinc-900/40 pl-10 pr-3.5 py-2.5 text-xs text-slate-500 dark:text-zinc-400 cursor-not-allowed font-medium outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                  Managed by Google and locked for account security.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-lime-300 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin h-3.5 w-3.5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save profile</span>
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
