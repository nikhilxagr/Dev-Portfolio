import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import Button from "@/components/ui/Button";
import { getErrorMessage } from "@/services/api";
import {
  clearAdminSession,
  getStoredAdminToken,
  loginAdmin,
  verifyAdminSession,
} from "@/services/auth.service";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = useMemo(() => {
    if (location.state?.from && location.state.from !== "/admin/login") {
      return location.state.from;
    }
    return "/admin";
  }, [location.state]);

  useEffect(() => {
    const token = getStoredAdminToken();
    if (!token) return;

    verifyAdminSession()
      .then(() => {
        navigate("/admin", { replace: true });
      })
      .catch(() => {
        clearAdminSession();
      });
  }, [navigate]);

  const updateField = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginAdmin({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to sign in right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Sign In | Nikhil Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="section-wrap pt-12 sm:pt-20">
        <div className="mx-auto max-w-md rounded-2xl border border-black/[0.08] bg-white p-7 sm:p-8 dark:border-white/[0.08] dark:bg-[#11141c]">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-[#7a8296] dark:hover:text-[#eef0f5]"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to portfolio
          </Link>

          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400">
              <LockKeyhole size={18} strokeWidth={1.5} />
            </span>
            <div>
              <p className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Admin Console
              </p>
              <h1 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-[#eef0f5]">
                Secure Sign In
              </h1>
            </div>
          </div>

          {location.state?.reason ? (
            <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs font-medium text-amber-800 dark:text-amber-300">
              {location.state.reason}
            </p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-700 dark:text-rose-300">
              {error}
            </p>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-1.5 text-xs font-medium text-slate-700 dark:text-[#a3a9b8]">
              <span>Email Address</span>
              <input
                value={formData.email}
                onChange={updateField("email")}
                type="email"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block space-y-1.5 text-xs font-medium text-slate-700 dark:text-[#a3a9b8]">
              <span>Password</span>
              <input
                value={formData.password}
                onChange={updateField("password")}
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-black/[0.1] bg-[#f8fafc] px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 dark:border-white/[0.1] dark:bg-[#0c0e14] dark:text-[#eef0f5] dark:placeholder:text-[#7a8296] dark:focus:border-emerald-500"
                placeholder="Enter password"
              />
            </label>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in to dashboard"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
};

export default AdminLoginPage;
