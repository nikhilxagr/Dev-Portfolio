import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { LogOut, MailOpen, RefreshCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { PROJECT_CATEGORIES } from "@/constants/siteData";
import { getErrorMessage } from "@/services/api";
import { getProjects } from "@/services/projects.service";
import { getBlogs } from "@/services/blogs.service";
import {
  createAdminBlog,
  createAdminProject,
  deleteAdminBlog,
  deleteAdminProject,
  getAdminContacts,
  getAdminOverview,
  getAdminPaymentsHistory,
  getAdminSystemStatus,
  markAdminContactAsRead,
  updateAdminBlog,
  updateAdminProject,
} from "@/services/admin.service";
import { getStoredAdminUser, logoutAdmin } from "@/services/auth.service";

const RANGE_OPTIONS = [7, 30, 90];
const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "created", label: "Created" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];
const PAYMENT_SERVICE_OPTIONS = [
  { value: "all", label: "All services" },
  { value: "support", label: "Support contributions" },
];
const DEFAULT_STATUS_COUNTS = {
  created: 0,
  paid: 0,
  failed: 0,
  refunded: 0,
};

const createInitialProjectForm = () => ({
  title: "",
  description: "",
  category: PROJECT_CATEGORIES[1],
  techStack: "",
  githubUrl: "",
  liveDemoUrl: "",
  imageUrl: "",
  problemStatement: "",
  solutionSummary: "",
  featured: false,
});

const createInitialBlogForm = () => ({
  title: "",
  excerpt: "",
  content: "",
  tags: "",
  imageUrl: "",
});

const parseCommaList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

const formatCount = (value) => {
  const parsed = Number(value) || 0;
  return new Intl.NumberFormat("en-IN").format(parsed);
};

const formatCurrency = (value) => {
  const parsed = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(parsed);
};

const formatPercent = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return "-";
  }

  return `${Math.round(parsed)}%`;
};

const formatUptime = (value) => {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "-";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours <= 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

const formatShortId = (value) => {
  if (!value) {
    return "-";
  }

  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const getPaymentBadgeClasses = (status) => {
  switch (status) {
    case "paid":
      return "border-emerald-300/40 bg-emerald-300/10 text-emerald-200";
    case "failed":
      return "border-rose-300/40 bg-rose-300/10 text-rose-200";
    case "refunded":
      return "border-amber-300/40 bg-amber-300/10 text-amber-200";
    case "created":
    default:
      return "border-slate-500/40 bg-slate-500/10 text-slate-300";
  }
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const adminUser = useMemo(() => getStoredAdminUser(), []);

  const [activePanel, setActivePanel] = useState("payments");
  const [rangeDays, setRangeDays] = useState(30);

  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentMeta, setPaymentMeta] = useState({
    totalCount: 0,
    statusCounts: DEFAULT_STATUS_COUNTS,
    rangeDays: 30,
  });
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentServiceFilter, setPaymentServiceFilter] = useState("all");
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState("");

  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState("");

  const [contacts, setContacts] = useState([]);
  const [contactStatus, setContactStatus] = useState("all");
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState("");

  const [systemStatus, setSystemStatus] = useState(null);
  const [systemLoading, setSystemLoading] = useState(true);
  const [systemError, setSystemError] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const [projectForm, setProjectForm] = useState(createInitialProjectForm());
  const [blogForm, setBlogForm] = useState(createInitialBlogForm());
  const [editingProjectId, setEditingProjectId] = useState("");
  const [editingBlogId, setEditingBlogId] = useState("");

  const handleAuthFailure = useCallback(() => {
    logoutAdmin();
    navigate("/admin/login", {
      replace: true,
      state: { reason: "Session expired. Please sign in again." },
    });
  }, [navigate]);

  const loadOverview = useCallback(
    async ({ range = rangeDays, useLoader = true } = {}) => {
      setOverviewError("");

      if (useLoader) {
        setOverviewLoading(true);
      }

      try {
        const response = await getAdminOverview({ range });
        setOverview(response.data || null);
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }

        setOverviewError(
          getErrorMessage(requestError, "Unable to load overview."),
        );
      } finally {
        if (useLoader) {
          setOverviewLoading(false);
        }
      }
    },
    [handleAuthFailure, rangeDays],
  );

  const loadPayments = useCallback(
    async ({
      range = rangeDays,
      status = paymentStatusFilter,
      service = paymentServiceFilter,
      useLoader = true,
    } = {}) => {
      setPaymentsError("");

      if (useLoader) {
        setPaymentsLoading(true);
      }

      try {
        const response = await getAdminPaymentsHistory({
          range,
          status,
          service,
        });
        const payload = response.data || {};
        setPaymentHistory(payload.items || []);
        setPaymentMeta({
          totalCount: payload.totalCount || 0,
          statusCounts: {
            ...DEFAULT_STATUS_COUNTS,
            ...(payload.statusCounts || {}),
          },
          rangeDays: payload.rangeDays || range,
        });
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }

        setPaymentsError(
          getErrorMessage(requestError, "Unable to load payment history."),
        );
      } finally {
        if (useLoader) {
          setPaymentsLoading(false);
        }
      }
    },
    [handleAuthFailure, paymentServiceFilter, paymentStatusFilter, rangeDays],
  );

  const loadContent = useCallback(
    async ({ useLoader = true } = {}) => {
      setContentError("");

      if (useLoader) {
        setContentLoading(true);
      }

      try {
        const [projectResponse, blogResponse] = await Promise.all([
          getProjects({ limit: 100 }),
          getBlogs({ limit: 100 }),
        ]);

        setProjects(projectResponse.data || []);
        setBlogs(blogResponse.data || []);
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }

        setContentError(
          getErrorMessage(requestError, "Unable to load content data."),
        );
      } finally {
        if (useLoader) {
          setContentLoading(false);
        }
      }
    },
    [handleAuthFailure],
  );

  const loadContacts = useCallback(
    async ({ status = contactStatus, useLoader = true } = {}) => {
      setContactsError("");

      if (useLoader) {
        setContactsLoading(true);
      }

      try {
        const response = await getAdminContacts({ status, limit: 300 });
        setContacts(response.data || []);
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }

        setContactsError(
          getErrorMessage(requestError, "Unable to load contact messages."),
        );
      } finally {
        if (useLoader) {
          setContactsLoading(false);
        }
      }
    },
    [contactStatus, handleAuthFailure],
  );

  const loadSystem = useCallback(
    async ({ useLoader = true } = {}) => {
      setSystemError("");

      if (useLoader) {
        setSystemLoading(true);
      }

      try {
        const response = await getAdminSystemStatus();
        setSystemStatus(response.data || null);
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }

        setSystemError(
          getErrorMessage(requestError, "Unable to load system status."),
        );
      } finally {
        if (useLoader) {
          setSystemLoading(false);
        }
      }
    },
    [handleAuthFailure],
  );

  useEffect(() => {
    loadOverview({ range: rangeDays, useLoader: true }).catch(() => undefined);
  }, [loadOverview, rangeDays]);

  useEffect(() => {
    loadPayments({
      range: rangeDays,
      status: paymentStatusFilter,
      service: paymentServiceFilter,
      useLoader: true,
    }).catch(() => undefined);
  }, [loadPayments, paymentServiceFilter, paymentStatusFilter, rangeDays]);

  useEffect(() => {
    loadContent({ useLoader: true }).catch(() => undefined);
  }, [loadContent]);

  useEffect(() => {
    loadContacts({ status: contactStatus, useLoader: true }).catch(
      () => undefined,
    );
  }, [contactStatus, loadContacts]);

  useEffect(() => {
    loadSystem({ useLoader: true }).catch(() => undefined);
  }, [loadSystem]);

  const refreshAll = async () => {
    setRefreshing(true);

    await Promise.allSettled([
      loadOverview({ range: rangeDays, useLoader: false }),
      loadPayments({
        range: rangeDays,
        status: paymentStatusFilter,
        service: paymentServiceFilter,
        useLoader: false,
      }),
      loadContent({ useLoader: false }),
      loadContacts({ status: contactStatus, useLoader: false }),
      loadSystem({ useLoader: false }),
    ]);

    setRefreshing(false);
  };

  const resetProjectForm = () => {
    setProjectForm(createInitialProjectForm());
    setEditingProjectId("");
  };

  const resetBlogForm = () => {
    setBlogForm(createInitialBlogForm());
    setEditingBlogId("");
  };

  const updateProjectField = (field) => (event) => {
    const value =
      field === "featured" ? event.target.checked : event.target.value;

    setProjectForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateBlogField = (field) => (event) => {
    setBlogForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const submitProject = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setActionError("");
    setNotice("");

    try {
      const techStack = parseCommaList(projectForm.techStack);
      if (techStack.length === 0) {
        setActionError("Tech stack requires at least one item.");
        return;
      }

      const payload = {
        title: projectForm.title.trim(),
        description: projectForm.description.trim(),
        category: projectForm.category,
        techStack,
        githubUrl: projectForm.githubUrl.trim(),
        liveDemoUrl: projectForm.liveDemoUrl.trim(),
        imageUrl: projectForm.imageUrl.trim(),
        problemStatement: projectForm.problemStatement.trim(),
        solutionSummary: projectForm.solutionSummary.trim(),
        featured: Boolean(projectForm.featured),
      };

      if (editingProjectId) {
        await updateAdminProject(editingProjectId, payload);
        setNotice("Project updated successfully.");
      } else {
        await createAdminProject(payload);
        setNotice("Project created successfully.");
      }

      resetProjectForm();
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure();
        return;
      }

      setActionError(getErrorMessage(requestError, "Unable to save project."));
    } finally {
      setSubmitting(false);
    }
  };

  const submitBlog = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setActionError("");
    setNotice("");

    try {
      const payload = {
        title: blogForm.title.trim(),
        excerpt: blogForm.excerpt.trim(),
        content: blogForm.content.trim(),
        tags: parseCommaList(blogForm.tags),
        imageUrl: blogForm.imageUrl.trim(),
      };

      if (editingBlogId) {
        await updateAdminBlog(editingBlogId, payload);
        setNotice("Blog updated successfully.");
      } else {
        await createAdminBlog(payload);
        setNotice("Blog created successfully.");
      }

      resetBlogForm();
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure();
        return;
      }

      setActionError(getErrorMessage(requestError, "Unable to save blog."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project? This action cannot be undone.")) {
      return;
    }

    setSubmitting(true);
    setActionError("");
    setNotice("");

    try {
      await deleteAdminProject(id);
      setNotice("Project deleted successfully.");
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure();
        return;
      }

      setActionError(
        getErrorMessage(requestError, "Unable to delete project."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (
      !window.confirm("Delete this blog post? This action cannot be undone.")
    ) {
      return;
    }

    setSubmitting(true);
    setActionError("");
    setNotice("");

    try {
      await deleteAdminBlog(id);
      setNotice("Blog deleted successfully.");
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure();
        return;
      }

      setActionError(getErrorMessage(requestError, "Unable to delete blog."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkRead = async (id) => {
    setSubmitting(true);
    setActionError("");
    setNotice("");

    try {
      await markAdminContactAsRead(id);
      setNotice("Message marked as read.");
      await Promise.allSettled([
        loadContacts({ status: contactStatus, useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        handleAuthFailure();
        return;
      }

      setActionError(
        getErrorMessage(requestError, "Unable to update message status."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || PROJECT_CATEGORIES[1],
      techStack: Array.isArray(project.techStack)
        ? project.techStack.join(", ")
        : "",
      githubUrl: project.githubUrl || "",
      liveDemoUrl: project.liveDemoUrl || "",
      imageUrl: project.imageUrl || "",
      problemStatement: project.problemStatement || "",
      solutionSummary: project.solutionSummary || "",
      featured: Boolean(project.featured),
    });
    setActivePanel("content");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      imageUrl: blog.imageUrl || "",
    });
    setActivePanel("content");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const signOut = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  const totalPayments = overview?.payments?.total || 0;
  const paidPayments = overview?.payments?.paid || 0;
  const paymentSuccessRate = totalPayments
    ? (paidPayments / totalPayments) * 100
    : null;
  const failedPayments = overview?.payments?.failed || 0;
  const unreadContacts = overview?.contacts?.unread || 0;
  const newContacts = overview?.contacts?.new || 0;
  const supportRevenue = overview?.payments?.supportRevenueInr || 0;

  const opsBriefPrimary = overview
    ? `Payments running at ${formatPercent(paymentSuccessRate)} success with ${formatCount(
        unreadContacts,
      )} unread contacts in queue.`
    : "Awaiting secure sync from payments, contacts, and content services.";
  const opsBriefSecondary = overview
    ? `Failed payments: ${formatCount(
        failedPayments,
      )}. Support revenue: ${formatCurrency(supportRevenue)}.`
    : "Once connected, this panel will highlight priorities and response volume.";

  const overviewCards = overview
    ? [
        {
          label: "Revenue",
          value: formatCurrency(overview.payments?.revenueInr),
          hint: `Paid in last ${overview.rangeDays || rangeDays} days`,
        },
        {
          label: "Payments",
          value: `${formatCount(overview.payments?.paid)} / ${formatCount(overview.payments?.total)}`,
          hint: "Paid vs total",
        },
        {
          label: "Support",
          value: formatCurrency(overview.payments?.supportRevenueInr),
          hint: `${formatCount(overview.payments?.supportCount)} contributions`,
        },
        {
          label: "Contacts",
          value: formatCount(overview.contacts?.new),
          hint: `${formatCount(overview.contacts?.unread)} unread`,
        },
        {
          label: "Projects",
          value: formatCount(overview.content?.projectsNew),
          hint: `${formatCount(overview.content?.projectsTotal)} total`,
        },
        {
          label: "Blogs",
          value: formatCount(overview.content?.blogsNew),
          hint: `${formatCount(overview.content?.blogsTotal)} total`,
        },
      ]
    : [];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Nikhil Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="section-wrap pt-8 sm:pt-10">
        <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/85 p-5 shadow-neon sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="admin-fade-up text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                Admin Dashboard
              </p>
              <h1 className="admin-fade-up admin-fade-up-1 font-display text-xl uppercase tracking-wide text-cyan-50 sm:text-2xl">
                <span className="admin-shimmer-text">
                  Operations Control Center
                </span>
              </h1>
              <p className="admin-fade-up admin-fade-up-2 mt-1 text-sm text-slate-400">
                Signed in as{" "}
                <span className="text-cyan-100">
                  {adminUser?.email || "admin"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                onClick={refreshAll}
                disabled={refreshing || submitting}
                className="px-3 py-2"
              >
                <RefreshCcw size={15} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="secondary"
                onClick={signOut}
                className="px-3 py-2"
              >
                <LogOut size={15} />
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRangeDays(option)}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition sm:text-sm ${
                    rangeDays === option
                      ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                      : "border-slate-600 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-100"
                  }`}
                >
                  {option} days
                </button>
              ))}
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Overview window: last {rangeDays} days
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
              <div className="flex items-center gap-2">
                <span className="admin-pulse-dot" />
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Ops briefing
                </p>
              </div>
              <p className="admin-fade-up admin-fade-up-1 mt-2 text-sm text-slate-200">
                {opsBriefPrimary}
              </p>
              <p className="admin-fade-up admin-fade-up-2 mt-1 text-xs text-slate-400">
                {opsBriefSecondary}
              </p>
            </div>

            <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Live signals
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.14em] text-slate-300">
                <span className="admin-fade-up admin-fade-up-1 rounded-full border border-cyan-300/20 bg-slate-950/70 px-3 py-1">
                  Success rate:{" "}
                  {overview ? formatPercent(paymentSuccessRate) : "Pending"}
                </span>
                <span className="admin-fade-up admin-fade-up-2 rounded-full border border-cyan-300/20 bg-slate-950/70 px-3 py-1">
                  Unread: {overview ? formatCount(unreadContacts) : "--"}
                </span>
                <span className="admin-fade-up admin-fade-up-3 rounded-full border border-cyan-300/20 bg-slate-950/70 px-3 py-1">
                  Failed: {overview ? formatCount(failedPayments) : "--"}
                </span>
                <span className="admin-fade-up admin-fade-up-3 rounded-full border border-cyan-300/20 bg-slate-950/70 px-3 py-1">
                  New contacts: {overview ? formatCount(newContacts) : "--"}
                </span>
              </div>
            </div>
          </div>

          {notice ? (
            <p className="mt-4 rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-100">
              {notice}
            </p>
          ) : null}

          {actionError ? (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {actionError}
            </p>
          ) : null}
        </div>

        <div className="mt-6 space-y-6">
          <div className="card-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-cyan-100">
                  Executive overview
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Snapshot of payments, contacts, and content performance.
                </p>
                <p className="admin-fade-up admin-fade-up-1 mt-2 text-xs text-slate-400">
                  Review success rates and unread volume before daily close.
                </p>
              </div>
            </div>

            {overviewLoading ? (
              <LoadingState message="Loading overview..." cards={6} />
            ) : overviewError ? (
              <ErrorState
                message={overviewError}
                onRetry={() =>
                  loadOverview({ range: rangeDays, useLoader: true })
                }
              />
            ) : (
              <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {overviewCards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {card.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold text-cyan-100">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{card.hint}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-cyan-100">
                      Recent payments
                    </h3>
                    <span className="text-xs uppercase tracking-[0.14em] text-slate-400">
                      Last {overview?.recentPayments?.length || 0}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {overview?.recentPayments?.length ? (
                      overview.recentPayments.map((payment) => (
                        <div
                          key={payment.id}
                          className="rounded-lg border border-cyan-300/10 bg-slate-950/70 px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-cyan-100">
                                {payment.customerName}
                              </p>
                              <p className="text-xs text-slate-400">
                                {payment.serviceName}
                              </p>
                            </div>
                            <span
                              className={`rounded-full border px-2 py-1 text-[0.65rem] uppercase tracking-[0.12em] ${getPaymentBadgeClasses(
                                payment.status,
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                            <span>{formatDate(payment.createdAt)}</span>
                            <span className="text-cyan-100">
                              {formatCurrency(payment.amountInr)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        title="No payments yet"
                        message="New payment activity will appear here."
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-cyan-300/25 bg-slate-950/60 p-4 shadow-neon sm:p-5">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: "payments",
                  label: `Payments (${formatCount(paymentMeta.totalCount)})`,
                },
                {
                  key: "contacts",
                  label: `Contacts (${formatCount(contacts.length)})`,
                },
                {
                  key: "content",
                  label: `Content (${formatCount(projects.length + blogs.length)})`,
                },
                { key: "system", label: "System" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActivePanel(tab.key)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    activePanel === tab.key
                      ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                      : "border-slate-600 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activePanel === "payments" ? (
            <div className="card-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-cyan-100">
                    Payment history
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Track Cashfree transactions and support contributions in the
                    last {paymentMeta.rangeDays} days.
                  </p>
                  <p className="admin-fade-up admin-fade-up-1 mt-2 text-xs text-slate-400">
                    Filter by status or service to isolate at-risk activity.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={paymentStatusFilter}
                    onChange={(event) =>
                      setPaymentStatusFilter(event.target.value)
                    }
                    className="rounded-full border border-cyan-300/25 bg-slate-900/80 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-200 outline-none focus:border-cyan-300"
                  >
                    {PAYMENT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={paymentServiceFilter}
                    onChange={(event) =>
                      setPaymentServiceFilter(event.target.value)
                    }
                    className="rounded-full border border-cyan-300/25 bg-slate-900/80 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-200 outline-none focus:border-cyan-300"
                  >
                    {PAYMENT_SERVICE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.12em] text-slate-400">
                <span className="rounded-full border border-cyan-300/20 bg-slate-900/70 px-3 py-1">
                  Paid: {formatCount(paymentMeta.statusCounts.paid)}
                </span>
                <span className="rounded-full border border-cyan-300/20 bg-slate-900/70 px-3 py-1">
                  Created: {formatCount(paymentMeta.statusCounts.created)}
                </span>
                <span className="rounded-full border border-cyan-300/20 bg-slate-900/70 px-3 py-1">
                  Failed: {formatCount(paymentMeta.statusCounts.failed)}
                </span>
                <span className="rounded-full border border-cyan-300/20 bg-slate-900/70 px-3 py-1">
                  Refunded: {formatCount(paymentMeta.statusCounts.refunded)}
                </span>
              </div>

              {paymentsLoading ? (
                <LoadingState message="Loading payment history..." cards={6} />
              ) : paymentsError ? (
                <ErrorState
                  message={paymentsError}
                  onRetry={() => loadPayments({ useLoader: true })}
                />
              ) : paymentHistory.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No payments found"
                    message="Try a different filter or time range."
                  />
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-xl border border-cyan-300/20">
                  <table className="min-w-full text-sm text-slate-200">
                    <thead className="bg-slate-950/80 text-xs uppercase tracking-[0.16em] text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Service</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Gateway</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-300/10">
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id} className="bg-slate-900/70">
                          <td className="px-4 py-3 text-xs text-slate-300">
                            {formatDate(payment.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-cyan-100">
                              {payment.customerName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {payment.customerEmail}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-slate-100">
                              {payment.serviceName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {payment.serviceSlug}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-cyan-100">
                            {formatCurrency(payment.amountInr)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full border px-2 py-1 text-[0.65rem] uppercase tracking-[0.12em] ${getPaymentBadgeClasses(
                                payment.status,
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400">
                            <p>Order: {formatShortId(payment.orderId)}</p>
                            <p>Pay: {formatShortId(payment.paymentId)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}

          {activePanel === "contacts" ? (
            <div className="card-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-cyan-100">
                    Contact inbox
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Review inbound leads and support messages.
                  </p>
                  <p className="admin-fade-up admin-fade-up-1 mt-2 text-xs text-slate-400">
                    Prioritize new requests to keep response SLAs on track.
                  </p>
                </div>

                <div className="flex gap-2">
                  {["all", "new", "read"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setContactStatus(status)}
                      className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition ${
                        contactStatus === status
                          ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                          : "border-slate-600 text-slate-300 hover:border-cyan-300/50 hover:text-cyan-100"
                      }`}
                      disabled={refreshing || submitting}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {contactsLoading ? (
                <LoadingState message="Loading contact messages..." cards={4} />
              ) : contactsError ? (
                <ErrorState
                  message={contactsError}
                  onRetry={() =>
                    loadContacts({ status: contactStatus, useLoader: true })
                  }
                />
              ) : (
                <div className="mt-4 space-y-3">
                  {contacts.length === 0 ? (
                    <EmptyState
                      title="No contact messages"
                      message="Incoming messages will appear here."
                    />
                  ) : null}

                  {contacts.map((message) => (
                    <article
                      key={message._id}
                      className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-cyan-100">
                            {message.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-300">
                            {message.email}
                          </p>
                          {message.phone ? (
                            <p className="mt-1 text-sm text-slate-300">
                              {message.phone}
                            </p>
                          ) : null}
                          {message.service ? (
                            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-emerald-200">
                              {message.service}
                            </p>
                          ) : null}
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                            {formatDate(message.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-2 py-1 text-xs uppercase tracking-[0.12em] ${
                            message.status === "read"
                              ? "border-slate-500 bg-slate-500/10 text-slate-300"
                              : "border-amber-300/40 bg-amber-300/10 text-amber-200"
                          }`}
                        >
                          {message.status}
                        </span>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
                        {message.message}
                      </p>

                      {message.status !== "read" ? (
                        <div className="mt-4">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleMarkRead(message._id)}
                            disabled={submitting}
                          >
                            <MailOpen size={14} />
                            Mark as read
                          </Button>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {activePanel === "content" ? (
            <div className="space-y-6">
              {contentLoading ? (
                <LoadingState message="Loading content..." cards={6} />
              ) : contentError ? (
                <ErrorState
                  message={contentError}
                  onRetry={() => loadContent({ useLoader: true })}
                />
              ) : null}

              <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Editorial control
                </p>
                <p className="admin-fade-up admin-fade-up-1 mt-2 text-sm text-slate-200">
                  Changes publish immediately once saved. Double-check copy and
                  visuals before pushing updates.
                </p>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
                <form
                  onSubmit={submitProject}
                  className="card-surface p-5 sm:p-6"
                >
                  <h2 className="text-lg font-semibold text-cyan-100">
                    {editingProjectId ? "Edit project" : "Create project"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Required: title, description, category, and at least one
                    tech stack item.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                      <span>Title</span>
                      <input
                        required
                        value={projectForm.title}
                        onChange={updateProjectField("title")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200">
                      <span>Category</span>
                      <select
                        value={projectForm.category}
                        onChange={updateProjectField("category")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      >
                        {PROJECT_CATEGORIES.filter(
                          (item) => item !== "All",
                        ).map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-2 text-sm text-slate-200">
                      <span>Tech stack (comma separated)</span>
                      <input
                        required
                        value={projectForm.techStack}
                        onChange={updateProjectField("techStack")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                        placeholder="React, Node.js, MongoDB"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                      <span>Description</span>
                      <textarea
                        required
                        rows={3}
                        value={projectForm.description}
                        onChange={updateProjectField("description")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200">
                      <span>GitHub URL</span>
                      <input
                        value={projectForm.githubUrl}
                        onChange={updateProjectField("githubUrl")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200">
                      <span>Live demo URL</span>
                      <input
                        value={projectForm.liveDemoUrl}
                        onChange={updateProjectField("liveDemoUrl")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                      <span>Image URL</span>
                      <input
                        value={projectForm.imageUrl}
                        onChange={updateProjectField("imageUrl")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                      <span>Problem statement</span>
                      <textarea
                        rows={3}
                        value={projectForm.problemStatement}
                        onChange={updateProjectField("problemStatement")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200 sm:col-span-2">
                      <span>Solution summary</span>
                      <textarea
                        rows={4}
                        value={projectForm.solutionSummary}
                        onChange={updateProjectField("solutionSummary")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={projectForm.featured}
                        onChange={updateProjectField("featured")}
                        className="h-4 w-4 rounded border-cyan-300/50"
                      />
                      Mark as featured project
                    </label>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? "Saving..."
                        : editingProjectId
                          ? "Update project"
                          : "Create project"}
                    </Button>
                    {editingProjectId ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetProjectForm}
                        disabled={submitting}
                      >
                        Cancel edit
                      </Button>
                    ) : null}
                  </div>
                </form>

                <div className="card-surface p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-cyan-100">
                    Published projects
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Manage project cards displayed on the public portfolio.
                  </p>

                  <div className="mt-4 space-y-3">
                    {projects.length === 0 ? (
                      <EmptyState
                        title="No projects available"
                        message="Create your first project from the form."
                      />
                    ) : null}

                    {projects.map((project) => (
                      <article
                        key={project._id}
                        className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-cyan-100">
                              {project.title}
                            </h3>
                            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                              {project.category} |{" "}
                              {formatDate(project.createdAt)}
                            </p>
                            <p className="mt-2 text-sm text-slate-300 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          {project.featured ? (
                            <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2 py-1 text-xs text-emerald-200">
                              Featured
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleEditProject(project)}
                            disabled={submitting}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleDeleteProject(project._id)}
                            disabled={submitting}
                          >
                            Delete
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
                <form onSubmit={submitBlog} className="card-surface p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-cyan-100">
                    {editingBlogId ? "Edit blog" : "Create blog"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Required: title and content (minimum 40 characters).
                  </p>

                  <div className="mt-4 space-y-3">
                    <label className="space-y-2 text-sm text-slate-200">
                      <span>Title</span>
                      <input
                        required
                        value={blogForm.title}
                        onChange={updateBlogField("title")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200">
                      <span>Excerpt</span>
                      <textarea
                        rows={2}
                        value={blogForm.excerpt}
                        onChange={updateBlogField("excerpt")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200">
                      <span>Content</span>
                      <textarea
                        required
                        rows={10}
                        value={blogForm.content}
                        onChange={updateBlogField("content")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200">
                      <span>Tags (comma separated)</span>
                      <input
                        value={blogForm.tags}
                        onChange={updateBlogField("tags")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                        placeholder="security, backend, react"
                      />
                    </label>

                    <label className="space-y-2 text-sm text-slate-200">
                      <span>Image URL</span>
                      <input
                        value={blogForm.imageUrl}
                        onChange={updateBlogField("imageUrl")}
                        className="w-full rounded-xl border border-cyan-300/25 bg-slate-900/80 px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
                      />
                    </label>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting
                        ? "Saving..."
                        : editingBlogId
                          ? "Update blog"
                          : "Create blog"}
                    </Button>
                    {editingBlogId ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={resetBlogForm}
                        disabled={submitting}
                      >
                        Cancel edit
                      </Button>
                    ) : null}
                  </div>
                </form>

                <div className="card-surface p-5 sm:p-6">
                  <h2 className="text-lg font-semibold text-cyan-100">
                    Published blog posts
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Manage articles shown in the public blog feed.
                  </p>

                  <div className="mt-4 space-y-3">
                    {blogs.length === 0 ? (
                      <EmptyState
                        title="No blog posts available"
                        message="Create your first post from the form."
                      />
                    ) : null}

                    {blogs.map((blog) => (
                      <article
                        key={blog._id}
                        className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4"
                      >
                        <h3 className="text-base font-semibold text-cyan-100">
                          {blog.title}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </p>
                        <p className="mt-2 text-sm text-slate-300 line-clamp-3">
                          {blog.excerpt || blog.content}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleEditBlog(blog)}
                            disabled={submitting}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleDeleteBlog(blog._id)}
                            disabled={submitting}
                          >
                            Delete
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {activePanel === "system" ? (
            <div className="card-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-cyan-100">
                    System status
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Monitor backend health and payment gateway readiness.
                  </p>
                  <p className="admin-fade-up admin-fade-up-1 mt-2 text-xs text-slate-400">
                    Confirm webhook activity and receipt email readiness before
                    live pushes.
                  </p>
                </div>
              </div>

              {systemLoading ? (
                <LoadingState message="Loading system status..." cards={4} />
              ) : systemError ? (
                <ErrorState
                  message={systemError}
                  onRetry={() => loadSystem({ useLoader: true })}
                />
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Database
                    </p>
                    <p className="mt-2 text-lg font-semibold text-cyan-100">
                      {systemStatus?.dbConnected ? "Connected" : "Unavailable"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Uptime: {formatUptime(systemStatus?.uptime)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Gateway
                    </p>
                    <p className="mt-2 text-lg font-semibold text-cyan-100">
                      {systemStatus?.gateway?.configured
                        ? "Ready"
                        : "Not configured"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Mode: {systemStatus?.gateway?.mode || "unknown"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Receipts
                    </p>
                    <p className="mt-2 text-lg font-semibold text-cyan-100">
                      {systemStatus?.gateway?.receiptEmailEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Email ready:{" "}
                      {systemStatus?.gateway?.receiptEmailReady ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Webhooks
                    </p>
                    <p className="mt-2 text-lg font-semibold text-cyan-100">
                      {systemStatus?.gateway?.webhookReady
                        ? "Ready"
                        : "Pending"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Last: {formatDate(systemStatus?.gateway?.lastWebhookAt)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-300/20 bg-slate-900/70 p-4 sm:col-span-2 xl:col-span-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      Latest payment activity
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      Last payment:{" "}
                      {formatDate(systemStatus?.gateway?.lastPaymentAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};

export default AdminDashboardPage;
