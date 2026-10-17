import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  CreditCard,
  Receipt,
  Heart,
  LogIn,
  Edit3,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Globe,
  RotateCw,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import clsx from "clsx";
import { useUserAuth } from "@/context/UserAuthContext";
import UserAvatar from "@/components/ui/UserAvatar";
import SeoHead from "@/components/seo/SeoHead";
import { getUserActivityService } from "@/services/userAuth.service";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();
    return `${date}, ${time}`;
  } catch {
    return dateStr;
  }
};

export default function ProfilePage() {
  const { user, isLoggedIn, loading: authLoading, openSignInModal, openProfileModal } = useUserAuth();

  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "payments" | "signins" | "activity"
  const [activityData, setActivityData] = useState(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState("");

  const fetchActivity = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setLoadingActivity(true);
      setActivityError("");
      const data = await getUserActivityService();
      setActivityData(data);
    } catch (err) {
      console.error("Failed to load user activity:", err);
      setActivityError("Could not refresh live activity. Showing cached profile data.");
    } finally {
      setLoadingActivity(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchActivity();
    }
  }, [isLoggedIn, fetchActivity]);

  const metrics = useMemo(() => {
    return {
      paymentsCount: activityData?.metrics?.paymentsCount || 0,
      receiptsCount: activityData?.metrics?.receiptsCount || 0,
      supportTotalInr: activityData?.metrics?.supportTotalInr || 0,
      signInsCount: activityData?.metrics?.signInsCount || user?.loginCount || 1,
    };
  }, [activityData, user]);

  return (
    <>
      <SeoHead
        title="My Profile & Activity — Nikhil Agrahari"
        description="View your user profile, transactions, verified receipts, and portfolio interactions."
        canonicalUrl="/profile"
      />

      <div className="relative min-h-[85vh] py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* USER NOT SIGNED IN GATE */}
          {!isLoggedIn && !authLoading ? (
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-zinc-950/80 p-8 sm:p-12 text-center shadow-xl space-y-6 max-w-2xl mx-auto backdrop-blur-md">
              <div className="h-16 w-16 rounded-2xl bg-lime-400/10 text-lime-500 flex items-center justify-center mx-auto border border-lime-500/20 shadow-sm">
                <User size={32} />
              </div>

              <div className="space-y-2">
                <h2 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white">
                  Sign in to view your profile
                </h2>
                <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Access your personal profile, download verified receipts, view sign-in logs, and track your comments and support activity.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    openSignInModal({
                      title: "Sign In to Your Account",
                      subtitle: "Sign in with Google or email to access your profile and activity dashboard.",
                    })
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-7 py-3 text-sm font-bold text-slate-950 hover:bg-lime-300 shadow-md transition"
                >
                  <LogIn size={16} />
                  <span>Sign in with Google</span>
                </button>
                <Link
                  to="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 px-6 py-3 text-sm font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 transition"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : null}

          {/* SIGNED IN PROFILE VIEW */}
          {isLoggedIn && user ? (
            <>
              {/* TOP PROFILE HEADER CARD (Image 1 Style) */}
              <div className="relative rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-md shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Left: Avatar + Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
                    <div className="relative shrink-0">
                      <UserAvatar
                        user={user}
                        className="h-20 w-20 sm:h-24 sm:w-24 text-3xl font-black border-2 border-lime-400 shadow-xl ring-4 ring-lime-400/10"
                      />
                      <span
                        className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 shadow-xs"
                        title="Account Active"
                      />
                    </div>

                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white truncate">
                          {user.name}
                        </h1>

                        <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/5 flex items-center gap-1">
                          <ShieldCheck size={12} className="text-lime-500" />
                          <span>{user.authProvider === "google" ? "Google Account" : "Verified Member"}</span>
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                        {user.bio ? (
                          user.bio
                        ) : (
                          <span className="text-slate-400 dark:text-zinc-500 italic">
                            Add a short bio so your account feels like yours.
                          </span>
                        )}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium pt-1">
                        <span className="flex items-center gap-1.5">
                          <span>✉️</span>
                          <span className="text-slate-800 dark:text-zinc-200">{user.email}</span>
                        </span>

                        {user.location && (
                          <span className="flex items-center gap-1 text-slate-700 dark:text-zinc-300">
                            <MapPin size={13} className="text-lime-500" />
                            <span>{user.location}</span>
                          </span>
                        )}

                        {user.website && (
                          <a
                            href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-lime-600 dark:text-lime-400 hover:underline font-semibold"
                          >
                            <Globe size={13} />
                            <span>Website</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Edit Profile Trigger */}
                  <div className="shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={openProfileModal}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-800 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition shadow-xs"
                    >
                      <Edit3 size={15} />
                      <span>Edit profile</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Strip: Timestamps */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-slate-400 dark:text-zinc-500" />
                    <span>
                      Member since <strong className="text-slate-800 dark:text-zinc-200">{formatDate(user.createdAt)}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-slate-400 dark:text-zinc-500" />
                    <span>
                      Last sign-in <strong className="text-slate-800 dark:text-zinc-200">{formatDateTime(user.lastLoginAt)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* METRICS ROW (Image 1 Style: PAYMENTS, RECEIPTS, SUPPORT TOTAL, SIGN-INS) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Payments */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 dark:text-zinc-500">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      PAYMENTS
                    </span>
                    <CreditCard size={16} />
                  </div>
                  <p className="font-mono text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                    {metrics.paymentsCount}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                    Total transactions
                  </p>
                </div>

                {/* 2. Receipts */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 dark:text-zinc-500">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      RECEIPTS
                    </span>
                    <Receipt size={16} />
                  </div>
                  <p className="font-mono text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                    {metrics.receiptsCount}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                    Verified access codes
                  </p>
                </div>

                {/* 3. Support Total */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 dark:text-zinc-500">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      SUPPORT TOTAL
                    </span>
                    <Heart size={16} className="text-rose-500" />
                  </div>
                  <p className="font-mono text-2xl sm:text-3xl font-black text-lime-600 dark:text-lime-400">
                    INR {metrics.supportTotalInr}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                    Total lifetime contributions
                  </p>
                </div>

                {/* 4. Sign-Ins */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 dark:text-zinc-500">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      SIGN-INS
                    </span>
                    <LogIn size={16} />
                  </div>
                  <p className="font-mono text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                    {metrics.signInsCount}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                    Active login sessions
                  </p>
                </div>
              </div>

              {/* TABS ROW (Overview, Payments, Sign-ins, Activity) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={clsx(
                      "rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition",
                      activeTab === "overview"
                        ? "bg-lime-400 text-slate-950 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                    )}
                  >
                    Overview
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("payments")}
                    className={clsx(
                      "rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition flex items-center gap-1.5",
                      activeTab === "payments"
                        ? "bg-lime-400 text-slate-950 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                    )}
                  >
                    <span>Payments</span>
                    <span className="font-mono text-xs opacity-75">
                      {activityData?.payments?.length || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("signins")}
                    className={clsx(
                      "rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition flex items-center gap-1.5",
                      activeTab === "signins"
                        ? "bg-lime-400 text-slate-950 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                    )}
                  >
                    <span>Sign-ins</span>
                    <span className="font-mono text-xs opacity-75">
                      {activityData?.signIns?.length || metrics.signInsCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("activity")}
                    className={clsx(
                      "rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition flex items-center gap-1.5",
                      activeTab === "activity"
                        ? "bg-lime-400 text-slate-950 shadow-xs"
                        : "text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900"
                    )}
                  >
                    <span>Activity</span>
                    <span className="font-mono text-xs opacity-75">
                      {activityData?.activities?.length || 0}
                    </span>
                  </button>
                </div>

                {/* Refresh Activity Trigger */}
                <button
                  type="button"
                  onClick={fetchActivity}
                  disabled={loadingActivity}
                  className="rounded-xl border border-slate-200 dark:border-white/10 p-2 text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:border-lime-500 transition disabled:opacity-50"
                  title="Refresh activity"
                >
                  <RotateCw size={15} className={clsx(loadingActivity ? "animate-spin text-lime-500" : "")} />
                </button>
              </div>

              {activityError && (
                <p className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                  {activityError}
                </p>
              )}

              {/* TAB CONTENT AREAS */}
              {/* 1. OVERVIEW TAB (Image 1 Style: Latest Activity & Quick Actions) */}
              {activeTab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Left (2 Cols): Latest Activity Feed */}
                  <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                      <div>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                          RECENT
                        </p>
                        <h3 className="font-jakarta text-lg font-bold text-slate-950 dark:text-white">
                          Latest activity
                        </h3>
                      </div>
                      {activityData?.activities?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("activity")}
                          className="text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
                        >
                          <span>View all</span>
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>

                    {activityData?.activities && activityData.activities.length > 0 ? (
                      <div className="space-y-3 pt-1">
                        {activityData.activities.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-zinc-900/40 hover:border-lime-500/30 transition group"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="h-8 w-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                                {item.type === "payment" ? (
                                  <CreditCard size={15} />
                                ) : item.type === "comment" ? (
                                  <MessageSquare size={15} />
                                ) : item.type === "like" ? (
                                  <Heart size={15} />
                                ) : (
                                  <LogIn size={15} />
                                )}
                              </div>
                              <div className="min-w-0 space-y-0.5">
                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                  {item.title}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2">
                                  {item.description}
                                </p>
                                <p className="text-[10px] text-slate-400 dark:text-zinc-500 pt-0.5">
                                  {formatDateTime(item.timestamp)}
                                </p>
                              </div>
                            </div>

                            {item.link && (
                              <Link
                                to={item.link}
                                className="shrink-0 p-1.5 rounded-lg text-slate-400 group-hover:text-lime-500 transition"
                                title="Open item"
                              >
                                <ArrowUpRight size={15} />
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 dark:border-white/10 space-y-2">
                        <Sparkles size={24} className="mx-auto text-slate-400 dark:text-zinc-500" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          No activity yet
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                          Your latest payments, sign-ins, and system design article interactions will appear right here.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right (1 Col): Quick Actions (Image 1 Style) */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-7 shadow-sm space-y-4 h-fit">
                    <div className="pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                        ACCOUNT
                      </p>
                      <h3 className="font-jakarta text-lg font-bold text-slate-950 dark:text-white">
                        Quick actions
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to="/services"
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/40 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition group"
                      >
                        <span>Explore services</span>
                        <ChevronRight size={15} className="opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition" />
                      </Link>

                      <Link
                        to="/receipts"
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/40 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition group"
                      >
                        <span>View receipts</span>
                        <ChevronRight size={15} className="opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition" />
                      </Link>

                      <Link
                        to="/support"
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/40 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition group"
                      >
                        <span>Payment help</span>
                        <ChevronRight size={15} className="opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition" />
                      </Link>

                      <Link
                        to="/system-design"
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50/70 dark:bg-zinc-900/40 text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition group"
                      >
                        <span>System Design Deep Dives</span>
                        <ChevronRight size={15} className="opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PAYMENTS TAB */}
              {activeTab === "payments" && (
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                    <div>
                      <h3 className="font-jakarta text-lg font-bold text-slate-950 dark:text-white">
                        Transaction History ({activityData?.payments?.length || 0})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        All payments initiated or completed with this account.
                      </p>
                    </div>
                    <Link
                      to="/receipts"
                      className="text-xs font-bold text-lime-600 dark:text-lime-400 hover:underline flex items-center gap-1"
                    >
                      <span>Receipt Portal</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>

                  {activityData?.payments && activityData.payments.length > 0 ? (
                    <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                      {activityData.payments.map((p) => (
                        <div
                          key={p.id}
                          className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900 dark:text-white">
                                {p.serviceName}
                              </p>
                              <span
                                className={clsx(
                                  "font-mono text-[10px] font-bold px-2 py-0.5 rounded-md uppercase",
                                  p.status === "SUCCESS"
                                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                    : p.status === "PENDING"
                                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                                )}
                              >
                                {p.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                              Date: {formatDateTime(p.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <p className="font-mono text-base font-bold text-slate-900 dark:text-white">
                              INR {p.amountInr}
                            </p>
                            {p.receiptNumber && (
                              <Link
                                to="/receipts"
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:border-lime-500 hover:text-lime-600 dark:hover:text-lime-400 transition"
                              >
                                <Receipt size={12} />
                                <span>Receipt</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-2">
                      <CreditCard size={28} className="mx-auto text-slate-400" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                        No transactions found
                      </p>
                      <p className="text-xs text-slate-400">
                        Explore our services to book a consulting call or custom development.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SIGN-INS TAB */}
              {activeTab === "signins" && (
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                    <h3 className="font-jakarta text-lg font-bold text-slate-950 dark:text-white">
                      Sign-In Sessions ({activityData?.signIns?.length || metrics.signInsCount})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Recent successful account authentications and security audit timestamps.
                    </p>
                  </div>

                  {activityData?.signIns && activityData.signIns.length > 0 ? (
                    <div className="space-y-3">
                      {activityData.signIns.map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-zinc-900/40"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0">
                              <LogIn size={15} />
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {s.device || "Web Browser"}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                                IP: {s.ip || "127.0.0.1"} &bull; {user.authProvider === "google" ? "Google OAuth" : "Password Auth"}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                            {formatDateTime(s.loggedInAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-zinc-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <LogIn size={16} className="text-lime-500" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Current Session
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Authenticated via {user.authProvider === "google" ? "Google" : "Email"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {formatDateTime(user.lastLoginAt)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 4. ACTIVITY & INTERACTIONS TAB */}
              {activeTab === "activity" && (
                <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-zinc-900/60 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                    <h3 className="font-jakarta text-lg font-bold text-slate-950 dark:text-white">
                      Community &amp; Article Activity ({activityData?.activities?.length || 0})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Comments posted, system design likes, and community discussions.
                    </p>
                  </div>

                  {activityData?.activities && activityData.activities.length > 0 ? (
                    <div className="space-y-3">
                      {activityData.activities.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 p-4 rounded-xl border border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-zinc-900/40"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                              {item.type === "comment" ? (
                                <MessageSquare size={15} />
                              ) : item.type === "like" ? (
                                <Heart size={15} />
                              ) : item.type === "payment" ? (
                                <CreditCard size={15} />
                              ) : (
                                <LogIn size={15} />
                              )}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                                {item.description}
                              </p>
                              <p className="text-[10px] text-slate-400 dark:text-zinc-500 pt-0.5 font-mono">
                                {formatDateTime(item.timestamp)}
                              </p>
                            </div>
                          </div>

                          {item.link && (
                            <Link
                              to={item.link}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-lime-600 dark:text-lime-400 hover:underline shrink-0"
                            >
                              <span>View</span>
                              <ChevronRight size={13} />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 space-y-2">
                      <MessageSquare size={28} className="mx-auto text-slate-400" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
                        No community interactions yet
                      </p>
                      <p className="text-xs text-slate-400">
                        Leave a comment or support an article in our System Design lab!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
