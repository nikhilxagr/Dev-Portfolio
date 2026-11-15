import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
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
  ArrowUpRight,
  Mail,
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
    const time = d
      .toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    return `${date}, ${time}`;
  } catch {
    return dateStr;
  }
};

export default function ProfilePage() {
  const { user, isLoggedIn, loading: authLoading, openSignInModal, openProfileModal } =
    useUserAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [likeCommentFilter, setLikeCommentFilter] = useState("all");
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

  const likesList = useMemo(() => activityData?.likes || [], [activityData]);
  const commentsList = useMemo(() => activityData?.comments || [], [activityData]);

  const likesAndCommentsList = useMemo(() => {
    if (Array.isArray(activityData?.likesAndComments)) {
      return activityData.likesAndComments;
    }
    if (Array.isArray(activityData?.interactions)) {
      return activityData.interactions;
    }
    return [...likesList, ...commentsList].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );
  }, [activityData, likesList, commentsList]);

  const filteredLikesComments = useMemo(() => {
    if (likeCommentFilter === "likes") {
      return likesAndCommentsList.filter((item) => item.type === "like");
    }
    if (likeCommentFilter === "comments") {
      return likesAndCommentsList.filter((item) => item.type === "comment");
    }
    return likesAndCommentsList;
  }, [likesAndCommentsList, likeCommentFilter]);

  const metrics = useMemo(
    () => ({
      paymentsCount: activityData?.metrics?.paymentsCount || 0,
      receiptsCount: activityData?.metrics?.receiptsCount || 0,
      supportTotalInr: activityData?.metrics?.supportTotalInr || 0,
      signInsCount: activityData?.metrics?.signInsCount || user?.loginCount || 1,
      likesCount: activityData?.metrics?.likesCount || likesList.length,
      commentsCount: activityData?.metrics?.commentsCount || commentsList.length,
      likesAndCommentsCount:
        activityData?.metrics?.likesAndCommentsCount || likesAndCommentsList.length,
    }),
    [activityData, user, likesList.length, commentsList.length, likesAndCommentsList.length],
  );

  const tabButtonClass = (isActive) =>
    clsx(
      "inline-flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-xs font-medium transition-colors duration-150 sm:text-sm cursor-pointer",
      isActive
        ? "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#a3a9b8] dark:hover:bg-[#1a1e28] dark:hover:text-[#eef0f5]",
    );

  return (
    <>
      <SeoHead
        title="My Profile & Activity — Nikhil Agrahari"
        description="View your user profile, transactions, verified receipts, and portfolio interactions."
        canonicalUrl="/profile"
      />

      <div className="relative min-h-[85vh] py-10 sm:py-14">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 lg:px-10">
          {/* USER NOT SIGNED IN GATE */}
          {!isLoggedIn && !authLoading ? (
            <div className="mx-auto max-w-lg space-y-6 rounded-xl border border-black/[0.08] bg-white p-8 text-center sm:p-10 dark:border-white/[0.08] dark:bg-[#11141c]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-black/[0.08] bg-slate-50 text-emerald-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-emerald-400">
                <User size={22} strokeWidth={1.5} />
              </div>

              <div className="space-y-2">
                <h2 className="font-display text-2xl font-medium tracking-[-0.02em] text-slate-900 dark:text-[#eef0f5]">
                  Sign in to view your profile
                </h2>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                  Access your personal profile, download verified receipts, view sign-in logs, and track your activity.
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    openSignInModal({
                      title: "Sign in",
                      subtitle: "Sign in with Google or email to access your profile.",
                    })
                  }
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-emerald-700 sm:w-auto dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                >
                  <LogIn size={16} strokeWidth={1.5} />
                  <span>Sign in</span>
                </button>
                <Link
                  to="/"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-black/[0.10] bg-white px-5 text-sm font-medium text-slate-800 transition-colors duration-150 hover:bg-slate-50 sm:w-auto dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:bg-[#222734]"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : null}

          {/* SIGNED IN PROFILE VIEW */}
          {isLoggedIn && user ? (
            <>
              {/* TOP PROFILE HEADER CARD */}
              <div className="space-y-6 rounded-xl border border-black/[0.08] bg-white p-6 sm:p-8 dark:border-white/[0.08] dark:bg-[#11141c]">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                  <div className="flex min-w-0 flex-col items-start gap-5 sm:flex-row sm:items-center">
                    <div className="relative shrink-0">
                      <UserAvatar
                        user={user}
                        className="h-20 w-20 text-2xl sm:h-24 sm:w-24"
                      />
                      <span
                        className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-600 dark:border-[#11141c] dark:bg-emerald-400"
                        title="Account Active"
                      />
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="truncate font-display text-2xl font-medium tracking-[-0.02em] text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
                          {user.name}
                        </h1>

                        <span className="inline-flex items-center gap-1.5 rounded-md border border-black/[0.08] bg-slate-50 px-2.5 py-0.5 font-mono text-xs text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                          <ShieldCheck size={13} strokeWidth={1.5} className="text-emerald-700 dark:text-emerald-400" />
                          <span>{user.authProvider === "google" ? "Google Account" : "Verified Member"}</span>
                        </span>
                      </div>

                      <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                        {user.bio ? (
                          user.bio
                        ) : (
                          <span className="text-slate-400 dark:text-[#7a8296]">
                            Add a short bio to personalize your profile.
                          </span>
                        )}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1 text-xs text-slate-500 dark:text-[#7a8296]">
                        <span className="flex items-center gap-1.5">
                          <Mail size={14} strokeWidth={1.5} />
                          <span className="text-slate-700 dark:text-[#a3a9b8]">{user.email}</span>
                        </span>

                        {user.location && (
                          <span className="flex items-center gap-1.5 text-slate-700 dark:text-[#a3a9b8]">
                            <MapPin size={14} strokeWidth={1.5} className="text-emerald-700 dark:text-emerald-400" />
                            <span>{user.location}</span>
                          </span>
                        )}

                        {user.website && (
                          <a
                            href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                          >
                            <Globe size={14} strokeWidth={1.5} />
                            <span>Website</span>
                            <ExternalLink size={12} strokeWidth={1.5} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full shrink-0 sm:w-auto">
                    <button
                      type="button"
                      onClick={openProfileModal}
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-black/[0.10] bg-slate-50 px-4 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-100 sm:w-auto dark:border-white/[0.10] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.18] dark:hover:bg-[#222734]"
                    >
                      <Edit3 size={15} strokeWidth={1.5} />
                      <span>Edit profile</span>
                    </button>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-4 text-xs text-slate-500 dark:border-white/[0.08] dark:text-[#7a8296]">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} strokeWidth={1.5} />
                    <span>
                      Member since{" "}
                      <span className="font-medium text-slate-800 dark:text-[#a3a9b8]">
                        {formatDate(user.createdAt)}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={14} strokeWidth={1.5} />
                    <span>
                      Last sign-in{" "}
                      <span className="font-medium text-slate-800 dark:text-[#a3a9b8]">
                        {formatDateTime(user.lastLoginAt)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* METRICS ROW */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="space-y-1.5 rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#7a8296]">
                    <span className="font-mono text-xs">Payments</span>
                    <CreditCard size={16} strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-2xl font-medium text-slate-900 tabular-nums sm:text-3xl dark:text-[#eef0f5]">
                    {metrics.paymentsCount}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                    Total transactions
                  </p>
                </div>

                <div className="space-y-1.5 rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#7a8296]">
                    <span className="font-mono text-xs">Receipts</span>
                    <Receipt size={16} strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-2xl font-medium text-slate-900 tabular-nums sm:text-3xl dark:text-[#eef0f5]">
                    {metrics.receiptsCount}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                    Verified access codes
                  </p>
                </div>

                <div className="space-y-1.5 rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#7a8296]">
                    <span className="font-mono text-xs">Support Total</span>
                    <Heart size={16} strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-2xl font-medium text-emerald-700 tabular-nums sm:text-3xl dark:text-emerald-400">
                    INR {metrics.supportTotalInr}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                    Lifetime contributions
                  </p>
                </div>

                <div className="space-y-1.5 rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#7a8296]">
                    <span className="font-mono text-xs">Sign-ins</span>
                    <LogIn size={16} strokeWidth={1.5} />
                  </div>
                  <p className="font-display text-2xl font-medium text-slate-900 tabular-nums sm:text-3xl dark:text-[#eef0f5]">
                    {metrics.signInsCount}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                    Login sessions
                  </p>
                </div>
              </div>

              {/* TABS ROW */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("overview")}
                    className={tabButtonClass(activeTab === "overview")}
                  >
                    Overview
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("payments")}
                    className={tabButtonClass(activeTab === "payments")}
                  >
                    <span>Payments</span>
                    <span className="font-mono text-xs tabular-nums opacity-75">
                      {activityData?.payments?.length || 0}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("signins")}
                    className={tabButtonClass(activeTab === "signins")}
                  >
                    <span>Sign-ins</span>
                    <span className="font-mono text-xs tabular-nums opacity-75">
                      {activityData?.signIns?.length || metrics.signInsCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("likes-comments")}
                    className={tabButtonClass(activeTab === "likes-comments")}
                  >
                    <span>Likes &amp; Comments</span>
                    <span className="font-mono text-xs tabular-nums opacity-75">
                      {likesAndCommentsList.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("activity")}
                    className={tabButtonClass(activeTab === "activity")}
                  >
                    <span>Activity</span>
                    <span className="font-mono text-xs tabular-nums opacity-75">
                      {activityData?.activities?.length || 0}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={fetchActivity}
                  disabled={loadingActivity}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-slate-600 transition-colors duration-150 hover:border-slate-300 hover:text-slate-900 disabled:opacity-50 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8] dark:hover:border-white/[0.16] dark:hover:text-[#eef0f5]"
                  title="Refresh activity"
                >
                  <RotateCw
                    size={15}
                    strokeWidth={1.5}
                    className={clsx(loadingActivity ? "animate-spin text-emerald-500" : "")}
                  />
                </button>
              </div>

              {activityError && (
                <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                  {activityError}
                </p>
              )}

              {/* 1. OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="space-y-4 rounded-xl border border-black/[0.08] bg-white p-6 lg:col-span-2 dark:border-white/[0.08] dark:bg-[#11141c]">
                    <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 dark:border-white/[0.08]">
                      <div>
                        <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                          Recent
                        </p>
                        <h3 className="mt-0.5 font-display text-lg font-medium text-slate-900 dark:text-[#eef0f5]">
                          Latest activity
                        </h3>
                      </div>
                      {activityData?.activities?.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("activity")}
                          className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                        >
                          <span>View all</span>
                          <ChevronRight size={14} strokeWidth={1.5} />
                        </button>
                      )}
                    </div>

                    {activityData?.activities && activityData.activities.length > 0 ? (
                      <div className="space-y-2.5 pt-1">
                        {activityData.activities.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="group flex items-start justify-between gap-3 rounded-lg border border-black/[0.06] bg-slate-50 p-3.5 transition-colors duration-150 hover:border-slate-300 dark:border-white/[0.06] dark:bg-[#1a1e28] dark:hover:border-white/[0.14]"
                          >
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black/[0.08] bg-white text-emerald-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-emerald-400">
                                {item.type === "payment" ? (
                                  <CreditCard size={16} strokeWidth={1.5} />
                                ) : item.type === "comment" ? (
                                  <MessageSquare size={16} strokeWidth={1.5} />
                                ) : item.type === "like" ? (
                                  <Heart size={16} strokeWidth={1.5} />
                                ) : (
                                  <LogIn size={16} strokeWidth={1.5} />
                                )}
                              </div>
                              <div className="min-w-0 space-y-0.5">
                                <p className="truncate text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                                  {item.title}
                                </p>
                                <p className="text-xs text-slate-600 line-clamp-2 dark:text-[#a3a9b8]">
                                  {item.description}
                                </p>
                                <p className="pt-0.5 font-mono text-xs text-slate-400 dark:text-[#7a8296]">
                                  {formatDateTime(item.timestamp)}
                                </p>
                              </div>
                            </div>

                            {item.link && (
                              <Link
                                to={item.link}
                                className="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors duration-150 group-hover:text-emerald-700 dark:text-[#7a8296] dark:group-hover:text-emerald-400"
                                title="Open item"
                              >
                                <ArrowUpRight size={16} strokeWidth={1.5} />
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 rounded-lg border border-dashed border-black/[0.10] px-4 py-10 text-center dark:border-white/[0.10]">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                          No activity yet
                        </h4>
                        <p className="mx-auto max-w-sm text-xs text-slate-500 dark:text-[#7a8296]">
                          Payments, sign-ins, and system design article interactions will appear here.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="h-fit space-y-4 rounded-xl border border-black/[0.08] bg-white p-6 dark:border-white/[0.08] dark:bg-[#11141c]">
                    <div className="border-b border-black/[0.06] pb-3 dark:border-white/[0.08]">
                      <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                        Account
                      </p>
                      <h3 className="mt-0.5 font-display text-lg font-medium text-slate-900 dark:text-[#eef0f5]">
                        Quick actions
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {[
                        { to: "/services", label: "Explore services" },
                        { to: "/receipts", label: "View receipts" },
                        { to: "/support", label: "Payment help" },
                        { to: "/system-design", label: "System Design Deep Dives" },
                      ].map((action) => (
                        <Link
                          key={action.to}
                          to={action.to}
                          className="group flex items-center justify-between rounded-lg border border-black/[0.06] bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:bg-slate-100 dark:border-white/[0.06] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:border-white/[0.14] dark:hover:bg-[#222734]"
                        >
                          <span>{action.label}</span>
                          <ChevronRight
                            size={15}
                            strokeWidth={1.5}
                            className="text-slate-400 transition-colors duration-150 group-hover:text-emerald-700 dark:text-[#7a8296] dark:group-hover:text-emerald-400"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PAYMENTS TAB */}
              {activeTab === "payments" && (
                <div className="space-y-4 rounded-xl border border-black/[0.08] bg-white p-6 sm:p-7 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 dark:border-white/[0.08]">
                    <div>
                      <h3 className="font-display text-lg font-medium text-slate-900 dark:text-[#eef0f5]">
                        Transaction History ({activityData?.payments?.length || 0})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                        Payments initiated or completed with this account.
                      </p>
                    </div>
                    <Link
                      to="/receipts"
                      className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                      <span>Receipt Portal</span>
                      <ChevronRight size={14} strokeWidth={1.5} />
                    </Link>
                  </div>

                  {activityData?.payments && activityData.payments.length > 0 ? (
                    <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
                      {activityData.payments.map((p) => (
                        <div
                          key={p.id}
                          className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                                {p.serviceName}
                              </p>
                              <span
                                className={clsx(
                                  "rounded-md px-2 py-0.5 font-mono text-xs",
                                  p.status === "SUCCESS"
                                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                                    : p.status === "PENDING"
                                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                                      : "bg-rose-500/15 text-rose-700 dark:text-rose-400",
                                )}
                              >
                                {p.status}
                              </span>
                            </div>
                            <p className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                              {formatDateTime(p.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <p className="font-mono text-base font-medium text-slate-900 tabular-nums dark:text-[#eef0f5]">
                              INR {p.amountInr}
                            </p>
                            {p.receiptNumber && (
                              <Link
                                to="/receipts"
                                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-black/[0.08] bg-slate-50 px-3 text-xs font-medium text-slate-800 transition-colors duration-150 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#eef0f5] dark:hover:bg-[#222734]"
                              >
                                <Receipt size={13} strokeWidth={1.5} />
                                <span>Receipt</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 py-10 text-center">
                      <CreditCard size={24} strokeWidth={1.5} className="mx-auto text-slate-400 dark:text-[#7a8296]" />
                      <p className="text-sm font-medium text-slate-800 dark:text-[#eef0f5]">
                        No transactions found
                      </p>
                      <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                        Explore services to book a session or custom development.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. SIGN-INS TAB */}
              {activeTab === "signins" && (
                <div className="space-y-4 rounded-xl border border-black/[0.08] bg-white p-6 sm:p-7 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="border-b border-black/[0.06] pb-3 dark:border-white/[0.08]">
                    <h3 className="font-display text-lg font-medium text-slate-900 dark:text-[#eef0f5]">
                      Sign-In Sessions ({activityData?.signIns?.length || metrics.signInsCount})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                      Recent account authentications and timestamps.
                    </p>
                  </div>

                  {activityData?.signIns && activityData.signIns.length > 0 ? (
                    <div className="space-y-2.5">
                      {activityData.signIns.map((s, idx) => (
                        <div
                          key={s.id || idx}
                          className="flex items-center justify-between gap-3 rounded-lg border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black/[0.08] bg-white text-emerald-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-emerald-400">
                              <LogIn size={16} strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                                {s.device || "Web Browser"}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                                IP: {s.ip || "127.0.0.1"} ·{" "}
                                {user.authProvider === "google" ? "Google OAuth" : "Password Auth"}
                              </p>
                            </div>
                          </div>
                          <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                            {formatDateTime(s.loggedInAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-lg border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]">
                      <div className="flex items-center gap-3">
                        <LogIn size={16} strokeWidth={1.5} className="text-emerald-700 dark:text-emerald-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                            Current Session
                          </p>
                          <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                            Authenticated via {user.authProvider === "google" ? "Google" : "Email"}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-slate-500 dark:text-[#7a8296]">
                        {formatDateTime(user.lastLoginAt)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 4. LIKES & COMMENTS TAB */}
              {activeTab === "likes-comments" && (
                <div className="space-y-6 rounded-xl border border-black/[0.08] bg-white p-6 sm:p-7 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="flex flex-col justify-between gap-4 border-b border-black/[0.06] pb-4 sm:flex-row sm:items-center dark:border-white/[0.08]">
                    <div>
                      <h3 className="flex items-center gap-2 font-display text-lg font-medium text-slate-900 dark:text-[#eef0f5]">
                        <span>Likes &amp; Comments</span>
                        <span className="rounded-md border border-black/[0.08] bg-slate-50 px-2 py-0.5 font-mono text-xs tabular-nums text-slate-700 dark:border-white/[0.08] dark:bg-[#1a1e28] dark:text-[#a3a9b8]">
                          {likesAndCommentsList.length}
                        </span>
                      </h3>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-[#7a8296]">
                        System design articles you liked and discussions you joined.
                      </p>
                    </div>

                    <div className="flex items-center gap-1 self-start rounded-lg border border-black/[0.08] bg-slate-50 p-1 sm:self-auto dark:border-white/[0.08] dark:bg-[#1a1e28]">
                      {[
                        { key: "all", label: `All (${likesAndCommentsList.length})` },
                        { key: "likes", label: `Likes (${likesList.length})` },
                        { key: "comments", label: `Comments (${commentsList.length})` },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setLikeCommentFilter(opt.key)}
                          className={clsx(
                            "cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-colors duration-150",
                            likeCommentFilter === opt.key
                              ? "bg-white text-slate-900 shadow-xs dark:bg-[#11141c] dark:text-[#eef0f5]"
                              : "text-slate-600 hover:text-slate-900 dark:text-[#a3a9b8] dark:hover:text-[#eef0f5]",
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredLikesComments && filteredLikesComments.length > 0 ? (
                    <div className="space-y-3">
                      {filteredLikesComments.map((item) => (
                        <div
                          key={item.id}
                          className="group flex flex-col justify-between gap-3 rounded-lg border border-black/[0.06] bg-slate-50 p-4 transition-colors duration-150 hover:border-slate-300 sm:flex-row sm:items-start dark:border-white/[0.06] dark:bg-[#1a1e28] dark:hover:border-white/[0.14]"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black/[0.08] bg-white text-emerald-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-emerald-400">
                              {item.type === "like" ? (
                                <Heart size={16} strokeWidth={1.5} />
                              ) : (
                                <MessageSquare size={16} strokeWidth={1.5} />
                              )}
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="truncate text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                                  {item.title}
                                </p>
                                <span className="rounded border border-black/[0.08] bg-white px-2 py-0.5 font-mono text-xs text-slate-600 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8]">
                                  {item.type === "like" ? "Like" : "Comment"}
                                </span>
                              </div>

                              {item.type === "comment" ? (
                                <div className="my-1.5 rounded-md border border-black/[0.06] bg-white p-2.5 dark:border-white/[0.06] dark:bg-[#11141c]">
                                  <p className="text-xs leading-relaxed text-slate-700 dark:text-[#a3a9b8]">
                                    &ldquo;{item.description || item.comment}&rdquo;
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-slate-600 dark:text-[#a3a9b8]">
                                  {item.description}
                                </p>
                              )}

                              <p className="pt-0.5 font-mono text-xs text-slate-400 dark:text-[#7a8296]">
                                {formatDateTime(item.timestamp)}
                              </p>
                            </div>
                          </div>

                          {item.link && (
                            <Link
                              to={item.link}
                              className="inline-flex h-8 shrink-0 items-center gap-1.5 self-end rounded-lg border border-black/[0.08] bg-white px-3 text-xs font-medium text-slate-800 transition-colors duration-150 hover:border-slate-300 hover:text-emerald-700 sm:self-center dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:border-white/[0.16] dark:hover:text-emerald-400"
                            >
                              <span>{item.type === "like" ? "View Article" : "View Discussion"}</span>
                              <ArrowUpRight size={14} strokeWidth={1.5} />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 rounded-lg border border-dashed border-black/[0.10] bg-slate-50/50 px-4 py-10 text-center dark:border-white/[0.10] dark:bg-[#1a1e28]/50">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                        {likeCommentFilter === "likes"
                          ? "No liked articles yet"
                          : likeCommentFilter === "comments"
                            ? "No comments posted yet"
                            : "No likes or comments yet"}
                      </h4>
                      <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-500 dark:text-[#7a8296]">
                        Read through the System Design case studies and share feedback or questions in the thread.
                      </p>
                      <div className="pt-1">
                        <Link
                          to="/experiments/system-design"
                          className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-medium text-white transition-colors duration-150 hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                        >
                          <span>Explore System Design</span>
                          <ChevronRight size={14} strokeWidth={1.5} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. ALL ACTIVITY TAB */}
              {activeTab === "activity" && (
                <div className="space-y-4 rounded-xl border border-black/[0.08] bg-white p-6 sm:p-7 dark:border-white/[0.08] dark:bg-[#11141c]">
                  <div className="border-b border-black/[0.06] pb-3 dark:border-white/[0.08]">
                    <h3 className="font-display text-lg font-medium text-slate-900 dark:text-[#eef0f5]">
                      Account Activity ({activityData?.activities?.length || 0})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                      Timeline of payments, likes, comments, and sign-ins.
                    </p>
                  </div>

                  {activityData?.activities && activityData.activities.length > 0 ? (
                    <div className="space-y-2.5">
                      {activityData.activities.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-3 rounded-lg border border-black/[0.06] bg-slate-50 p-4 dark:border-white/[0.06] dark:bg-[#1a1e28]"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-black/[0.08] bg-white text-emerald-700 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-emerald-400">
                              {item.type === "comment" ? (
                                <MessageSquare size={16} strokeWidth={1.5} />
                              ) : item.type === "like" ? (
                                <Heart size={16} strokeWidth={1.5} />
                              ) : item.type === "payment" ? (
                                <CreditCard size={16} strokeWidth={1.5} />
                              ) : (
                                <LogIn size={16} strokeWidth={1.5} />
                              )}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <p className="truncate text-sm font-medium text-slate-900 dark:text-[#eef0f5]">
                                {item.title}
                              </p>
                              <p className="text-xs leading-relaxed text-slate-600 dark:text-[#a3a9b8]">
                                {item.description}
                              </p>
                              <p className="pt-0.5 font-mono text-xs text-slate-400 dark:text-[#7a8296]">
                                {formatDateTime(item.timestamp)}
                              </p>
                            </div>
                          </div>

                          {item.link && (
                            <Link
                              to={item.link}
                              className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                            >
                              <span>View</span>
                              <ChevronRight size={14} strokeWidth={1.5} />
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 py-10 text-center">
                      <MessageSquare size={24} strokeWidth={1.5} className="mx-auto text-slate-400 dark:text-[#7a8296]" />
                      <p className="text-sm font-medium text-slate-800 dark:text-[#eef0f5]">
                        No activity recorded yet
                      </p>
                      <p className="text-xs text-slate-500 dark:text-[#7a8296]">
                        Leave a comment or like an article in the System Design section.
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
