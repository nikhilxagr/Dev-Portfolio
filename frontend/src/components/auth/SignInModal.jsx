import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Mail, User as UserIcon, X, ArrowRight } from "lucide-react";
import { useUserAuth } from "@/context/UserAuthContext";
import {
  getGoogleAuthUrl,
  loginUserService,
  registerUserService,
} from "@/services/userAuth.service";

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

const SignInModal = () => {
  const { isSignInModalOpen, closeSignInModal, signInModalOptions, login } =
    useUserAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isSignInModalOpen) return null;

  const {
    title = isRegister ? "Create an account" : "Sign in",
    subtitle = "Access your profile, receipts, and saved activity.",
    onSuccess,
  } = signInModalOptions;

  const handleGoogleSignIn = () => {
    const returnUrl =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/";
    if (typeof window !== "undefined") {
      sessionStorage.setItem("auth_return_url", returnUrl);
    }
    window.location.href = getGoogleAuthUrl(returnUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error("Please enter your name");
        }
        const res = await registerUserService({ name, email, password });
        if (res.data?.token && res.data?.user) {
          login(res.data.token, res.data.user);
          if (onSuccess) onSuccess(res.data.user);
        }
      } else {
        const res = await loginUserService({ email, password });
        if (res.data?.token && res.data?.user) {
          login(res.data.token, res.data.user);
          if (onSuccess) onSuccess(res.data.user);
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          onClick={closeSignInModal}
          className="absolute inset-0 bg-black/65"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md rounded-xl border border-black/[0.08] bg-white p-6 shadow-xl sm:p-7 dark:border-white/[0.08] dark:bg-[#11141c] dark:shadow-none"
        >
          <button
            type="button"
            onClick={closeSignInModal}
            aria-label="Close sign in dialog"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 dark:text-[#7a8296] dark:hover:bg-white/[0.06] dark:hover:text-[#eef0f5]"
          >
            <X size={16} strokeWidth={1.5} />
          </button>

          <div>
            <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
              Account
            </p>
            <h2 className="mt-1.5 font-display text-xl font-medium tracking-[-0.01em] text-slate-900 dark:text-[#eef0f5]">
              {isRegister ? "Create an account" : title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
              {subtitle}
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-medium text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <div className="mt-5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-black/[0.10] bg-slate-50 px-4 text-sm font-medium text-slate-900 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-100 dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#222734]"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.08]" />
            <span className="font-mono text-xs text-slate-400 dark:text-[#7a8296]">
              or with email
            </span>
            <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.08]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label
                  htmlFor="auth-name"
                  className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
                >
                  Full name
                </label>
                <div className="relative">
                  <UserIcon
                    size={16}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
                  />
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nikhil Agrahari"
                    className="h-10 w-full rounded-lg border border-black/[0.10] bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
                />
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-lg border border-black/[0.10] bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="mb-1.5 block text-xs font-medium text-slate-700 dark:text-[#a3a9b8]"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  strokeWidth={1.5}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7a8296]"
                />
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-lg border border-black/[0.10] bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors duration-150 focus:border-emerald-600 dark:border-white/[0.08] dark:bg-[#0b0d14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
            >
              {loading ? (
                "Processing..."
              ) : isRegister ? (
                <>
                  <span>Create account</span>
                  <ArrowRight size={16} strokeWidth={1.5} />
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight size={16} strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-600 dark:text-[#a3a9b8]">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                  }}
                  className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                  }}
                  className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                >
                  Create one
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SignInModal;
