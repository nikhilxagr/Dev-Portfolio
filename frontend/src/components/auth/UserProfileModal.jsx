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
  Lock,
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
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (isProfileModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && window.__activeLenis) {
        window.__activeLenis.stop();
      }
      return () => {
        document.body.style.overflow = prevOverflow;
        if (typeof window !== "undefined" && window.__activeLenis) {
          window.__activeLenis.start();
        }
      };
    }
  }, [isProfileModalOpen]);

  const handleCardWheel = (e) => {
    e.stopPropagation();
    if (scrollContainerRef.current) {
      if (!scrollContainerRef.current.contains(e.target)) {
        scrollContainerRef.current.scrollTop += e.deltaY;
      }
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file (JPEG, PNG, or WebP).");
      return;
    }

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
          const size = 256;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");

          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
          const dataUrl = canvas.toDataURL("image/webp", 0.88);
          setAvatar(dataUrl);
          setAvatarPreview(dataUrl);
        } catch {
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
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-3 sm:p-4"
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          onClick={closeProfileModal}
          data-lenis-prevent="true"
          className="fixed inset-0 bg-black/65"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          data-lenis-prevent="true"
          data-lenis-prevent-touch="true"
          onWheel={handleCardWheel}
          className="relative z-10 my-auto flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-white text-slate-900 shadow-xl sm:max-h-[88vh] dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:shadow-none"
        >
          {/* Header */}
          <div className="relative shrink-0 border-b border-black/[0.06] px-6 py-5 sm:px-7 dark:border-white/[0.08]">
            <button
              type="button"
              onClick={closeProfileModal}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 dark:text-[#7a8296] dark:hover:bg-white/[0.06] dark:hover:text-[#eef0f5]"
              aria-label="Close modal"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
              Account profile
            </p>
            <h3 className="mt-1 font-display text-xl font-medium tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
              Edit your profile
            </h3>
          </div>

          {savedSuccess ? (
            <div className="m-6 my-auto space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                <Check size={20} strokeWidth={1.5} />
              </div>
              <h4 className="text-base font-medium text-emerald-800 dark:text-emerald-300">
                Profile updated
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#a3a9b8]">
                Your public profile and account details have been saved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div
                ref={scrollContainerRef}
                data-lenis-prevent="true"
                data-lenis-prevent-touch="true"
                onWheel={(e) => e.stopPropagation()}
                className="profile-modal-scroll min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5 sm:px-7"
              >
                {errorMsg && (
                  <div className="flex items-center gap-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <AlertCircle size={16} strokeWidth={1.5} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Profile Image Section */}
                <div className="flex flex-col items-start gap-4 rounded-xl border border-black/[0.06] bg-slate-50 p-4 sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#1a1e28]">
                  <div className="group relative shrink-0">
                    <UserAvatar
                      user={mockUserForAvatar}
                      className="h-16 w-16 text-xl"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      title="Upload new image"
                    >
                      <Camera size={16} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <p className="text-xs font-medium text-slate-900 dark:text-[#eef0f5]">
                      Profile image
                    </p>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-[#7a8296]">
                      JPEG, PNG, or WebP up to 5 MB. Cropped to square.
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
                        className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-black/[0.10] bg-white px-3 text-xs font-medium text-slate-800 transition-colors duration-150 hover:bg-slate-100 dark:border-white/[0.10] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:bg-[#222734]"
                      >
                        <Camera size={14} strokeWidth={1.5} />
                        <span>{avatarPreview ? "Change image" : "Upload image"}</span>
                      </button>

                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 text-xs font-medium text-rose-600 transition-colors duration-150 hover:bg-rose-500/20 dark:text-rose-400"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-name"
                    className="block text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
                  >
                    Display name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User size={16} strokeWidth={1.5} className="absolute left-3 text-slate-400 dark:text-[#7a8296]" />
                    <input
                      id="profile-name"
                      name="name"
                      type="text"
                      required
                      maxLength={120}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your display name"
                      className="h-10 w-full rounded-lg border border-black/[0.10] bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="profile-bio"
                      className="block text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
                    >
                      Bio
                    </label>
                    <span className="font-mono text-xs text-slate-400 tabular-nums dark:text-[#7a8296]">
                      {bio.length}/180
                    </span>
                  </div>
                  <textarea
                    id="profile-bio"
                    name="bio"
                    rows={2}
                    maxLength={180}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A short note about your role or interests"
                    className="w-full resize-none rounded-lg border border-black/[0.10] bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                  />
                </div>

                {/* Location & Website Grid */}
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-location"
                      className="block text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
                    >
                      Location
                    </label>
                    <div className="relative flex items-center">
                      <MapPin size={16} strokeWidth={1.5} className="absolute left-3 text-slate-400 dark:text-[#7a8296]" />
                      <input
                        id="profile-location"
                        name="location"
                        type="text"
                        maxLength={100}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Lucknow, India"
                        className="h-10 w-full rounded-lg border border-black/[0.10] bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-website"
                      className="block text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
                    >
                      Website
                    </label>
                    <div className="relative flex items-center">
                      <Globe size={16} strokeWidth={1.5} className="absolute left-3 text-slate-400 dark:text-[#7a8296]" />
                      <input
                        id="profile-website"
                        name="website"
                        type="url"
                        maxLength={200}
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://example.com"
                        className="h-10 w-full rounded-lg border border-black/[0.10] bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-phone"
                    className="block text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
                  >
                    Phone number <span className="text-slate-400 dark:text-[#7a8296]">(optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone size={16} strokeWidth={1.5} className="absolute left-3 text-slate-400 dark:text-[#7a8296]" />
                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      maxLength={30}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-10 w-full rounded-lg border border-black/[0.10] bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Google account email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="profile-email"
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
                  >
                    <span>Account email</span>
                    <Lock size={12} strokeWidth={1.5} className="text-slate-400 dark:text-[#7a8296]" />
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3">
                      <GoogleIcon />
                    </div>
                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      readOnly
                      value={user.email || ""}
                      className="h-10 w-full cursor-not-allowed rounded-lg border border-black/[0.06] bg-slate-100 pl-9 pr-3 text-sm text-slate-500 outline-none dark:border-white/[0.06] dark:bg-[#1a1e28] dark:text-[#7a8296]"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-black/[0.06] bg-slate-50 px-6 py-4 sm:px-7 dark:border-white/[0.08] dark:bg-[#0b0d14]">
                <button
                  type="button"
                  onClick={closeProfileModal}
                  disabled={saving}
                  className="h-9 cursor-pointer rounded-lg border border-black/[0.10] bg-white px-4 text-xs font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100 disabled:opacity-50 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:bg-[#222734]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-5 text-xs font-medium text-white transition-colors duration-150 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
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
