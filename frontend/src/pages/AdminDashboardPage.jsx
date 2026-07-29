import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  CreditCard,
  BookOpen,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  RefreshCcw,
  Plus,
  Edit3,
  ExternalLink,
  Send,
  AlertCircle,
  Search,
} from "lucide-react";
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
  { value: "all", label: "All Statuses" },
  { value: "paid", label: "Paid" },
  { value: "created", label: "Created" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];
const PAYMENT_SERVICE_OPTIONS = [
  { value: "all", label: "All Services" },
  { value: "support", label: "Support Contributions" },
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
  category: PROJECT_CATEGORIES[1] || "Web Dev",
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
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
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
  if (!Number.isFinite(parsed)) return "-";
  return `${Math.round(parsed)}%`;
};

const formatUptime = (value) => {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return "-";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

const formatShortId = (value) => {
  if (!value) return "-";
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const getPaymentBadgeClasses = (status) => {
  switch (status) {
    case "paid":
      return "border-emerald-400/40 bg-emerald-500/15 text-emerald-300 font-bold";
    case "failed":
      return "border-rose-400/40 bg-rose-500/15 text-rose-300 font-bold";
    case "refunded":
      return "border-amber-400/40 bg-amber-500/15 text-amber-300 font-bold";
    case "created":
    default:
      return "border-slate-500/40 bg-slate-500/15 text-slate-300 font-bold";
  }
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const adminUser = useMemo(() => getStoredAdminUser(), []);

  // UI state
  const [activePanel, setActivePanel] = useState("overview"); // overview, projects, contacts, payments, blogs, system
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rangeDays, setRangeDays] = useState(30);

  // Data states
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
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("ALL");
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
  const [showProjectFormModal, setShowProjectFormModal] = useState(false);
  const [blogForm, setBlogForm] = useState(createInitialBlogForm());
  const [showBlogFormModal, setShowBlogFormModal] = useState(false);
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
      if (useLoader) setOverviewLoading(true);
      try {
        const response = await getAdminOverview({ range });
        setOverview(response.data || null);
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setOverviewError(getErrorMessage(requestError, "Unable to load overview."));
      } finally {
        if (useLoader) setOverviewLoading(false);
      }
    },
    [handleAuthFailure, rangeDays]
  );

  const loadPayments = useCallback(
    async ({
      range = rangeDays,
      status = paymentStatusFilter,
      service = paymentServiceFilter,
      useLoader = true,
    } = {}) => {
      setPaymentsError("");
      if (useLoader) setPaymentsLoading(true);
      try {
        const response = await getAdminPaymentsHistory({ range, status, service });
        const payload = response.data || {};
        setPaymentHistory(payload.items || []);
        setPaymentMeta({
          totalCount: payload.totalCount || 0,
          statusCounts: { ...DEFAULT_STATUS_COUNTS, ...(payload.statusCounts || {}) },
          rangeDays: payload.rangeDays || range,
        });
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setPaymentsError(getErrorMessage(requestError, "Unable to load payment history."));
      } finally {
        if (useLoader) setPaymentsLoading(false);
      }
    },
    [handleAuthFailure, paymentServiceFilter, paymentStatusFilter, rangeDays]
  );

  const loadContent = useCallback(
    async ({ useLoader = true } = {}) => {
      setContentError("");
      if (useLoader) setContentLoading(true);
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
        setContentError(getErrorMessage(requestError, "Unable to load content."));
      } finally {
        if (useLoader) setContentLoading(false);
      }
    },
    [handleAuthFailure]
  );

  const loadContacts = useCallback(
    async ({ status = contactStatus, useLoader = true } = {}) => {
      setContactsError("");
      if (useLoader) setContactsLoading(true);
      try {
        const response = await getAdminContacts({ status, limit: 300 });
        setContacts(response.data || []);
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setContactsError(getErrorMessage(requestError, "Unable to load messages."));
      } finally {
        if (useLoader) setContactsLoading(false);
      }
    },
    [contactStatus, handleAuthFailure]
  );

  const loadSystem = useCallback(
    async ({ useLoader = true } = {}) => {
      setSystemError("");
      if (useLoader) setSystemLoading(true);
      try {
        const response = await getAdminSystemStatus();
        setSystemStatus(response.data || null);
      } catch (requestError) {
        if (requestError?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setSystemError(getErrorMessage(requestError, "Unable to load system status."));
      } finally {
        if (useLoader) setSystemLoading(false);
      }
    },
    [handleAuthFailure]
  );

  useEffect(() => {
    loadOverview({ range: rangeDays, useLoader: true }).catch(() => undefined);
  }, [loadOverview, rangeDays]);

  useEffect(() => {
    loadPayments({ range: rangeDays, status: paymentStatusFilter, service: paymentServiceFilter, useLoader: true }).catch(() => undefined);
  }, [loadPayments, paymentServiceFilter, paymentStatusFilter, rangeDays]);

  useEffect(() => {
    loadContent({ useLoader: true }).catch(() => undefined);
  }, [loadContent]);

  useEffect(() => {
    loadContacts({ status: contactStatus, useLoader: true }).catch(() => undefined);
  }, [contactStatus, loadContacts]);

  useEffect(() => {
    loadSystem({ useLoader: true }).catch(() => undefined);
  }, [loadSystem]);

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.allSettled([
      loadOverview({ range: rangeDays, useLoader: false }),
      loadPayments({ range: rangeDays, status: paymentStatusFilter, service: paymentServiceFilter, useLoader: false }),
      loadContent({ useLoader: false }),
      loadContacts({ status: contactStatus, useLoader: false }),
      loadSystem({ useLoader: false }),
    ]);
    setRefreshing(false);
  };

  const resetProjectForm = () => {
    setProjectForm(createInitialProjectForm());
    setEditingProjectId("");
    setShowProjectFormModal(false);
  };

  const resetBlogForm = () => {
    setBlogForm(createInitialBlogForm());
    setEditingBlogId("");
    setShowBlogFormModal(false);
  };

  const updateProjectField = (field) => (event) => {
    const value = field === "featured" ? event.target.checked : event.target.value;
    setProjectForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateBlogField = (field) => (event) => {
    setBlogForm((prev) => ({ ...prev, [field]: event.target.value }));
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
    if (!window.confirm("Delete this project? This action cannot be undone.")) return;
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
      setActionError(getErrorMessage(requestError, "Unable to delete project."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post? This action cannot be undone.")) return;
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
      setActionError(getErrorMessage(requestError, "Unable to update message status."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project._id);
    setProjectForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || PROJECT_CATEGORIES[1] || "Web Dev",
      techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : "",
      githubUrl: project.githubUrl || "",
      liveDemoUrl: project.liveDemoUrl || "",
      imageUrl: project.imageUrl || "",
      problemStatement: project.problemStatement || "",
      solutionSummary: project.solutionSummary || "",
      featured: Boolean(project.featured),
    });
    setShowProjectFormModal(true);
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
    setShowBlogFormModal(true);
  };

  const signOut = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  // Nav Items array
  const NAV_ITEMS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, badge: null },
    { id: "projects", label: "Projects", icon: FolderKanban, badge: projects.length },
    { id: "contacts", label: "Enquiries & Emails", icon: Mail, badge: overview?.contacts?.unread || 0, badgeColor: "bg-amber-500 text-black" },
    { id: "payments", label: "Payments & Orders", icon: CreditCard, badge: paymentMeta.totalCount },
    { id: "blogs", label: "Blogs & Articles", icon: BookOpen, badge: blogs.length },
    { id: "system", label: "System Health", icon: ShieldCheck, badge: null },
  ];

  // Filtered Projects for Projects Tab
  const filteredAdminProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        projectCategoryFilter === "ALL" ||
        p.category?.toLowerCase() === projectCategoryFilter.toLowerCase();
      const matchSearch =
        !projectSearch.trim() ||
        `${p.title} ${p.description} ${p.category} ${(p.techStack || []).join(" ")}`
          .toLowerCase()
          .includes(projectSearch.trim().toLowerCase());
      return matchCat && matchSearch;
    });
  }, [projects, projectCategoryFilter, projectSearch]);

  const totalPayments = overview?.payments?.total || 0;
  const paidPayments = overview?.payments?.paid || 0;
  const paymentSuccessRate = totalPayments ? (paidPayments / totalPayments) * 100 : null;
  const failedPayments = overview?.payments?.failed || 0;
  const unreadContacts = overview?.contacts?.unread || 0;
  const newContacts = overview?.contacts?.new || 0;

  return (
    <>
      <Helmet>
        <title>Admin Control Center | Nikhil Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#03080e] text-slate-100 flex flex-col font-outfit">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-emerald-500/20 bg-[#050e17]/95 px-4 sm:px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
              aria-label="Toggle Navigation Sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="font-mono text-sm sm:text-base font-black tracking-wider text-white uppercase">
                ADMIN <span className="text-emerald-400">CONSOLE</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Range Selector */}
            <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1 text-xs">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRangeDays(opt)}
                  className={`rounded-lg px-2.5 py-1 font-mono font-bold transition ${
                    rangeDays === opt
                      ? "bg-emerald-500 text-black shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {opt}d
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={refreshAll}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <RefreshCcw size={14} className={refreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{refreshing ? "Syncing..." : "Sync Data"}</span>
            </button>

            {/* Admin Profile */}
            <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-mono text-slate-300">{adminUser?.email || "admin"}</span>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 transition"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Body with Sidebar Drawer */}
        <div className="flex flex-1 relative">

          {/* Sidebar Drawer Backdrop for Mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Left Navigation Sidebar */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-emerald-500/20 bg-[#050e17] p-4 flex flex-col justify-between transition-transform duration-300 ease-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="space-y-6 pt-12 lg:pt-0">
              <div className="px-3">
                <p className="font-mono text-[10px] uppercase font-bold text-slate-500 tracking-[0.25em]">
                  Navigation Menu
                </p>
              </div>

              <nav className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePanel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActivePanel(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
                          : "border border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={17} className={isActive ? "text-emerald-400" : "text-slate-500"} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && item.badge > 0 ? (
                        <span
                          className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                            item.badgeColor || "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Bottom Footer */}
            <div className="pt-6 border-t border-slate-800/80 px-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] font-mono text-slate-400 space-y-1">
                <p className="font-bold text-emerald-400">⚡ Operational SLA</p>
                <p>Status: All Services Healthy</p>
                <p>Unread Msgs: {unreadContacts}</p>
              </div>
            </div>
          </aside>

          {/* Right Main Content Panel */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            
            {/* Global Notice & Alert Banners */}
            {notice && (
              <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>{notice}</span>
                </div>
                <button type="button" onClick={() => setNotice("")} className="text-emerald-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}

            {actionError && (
              <div className="flex items-center justify-between rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs sm:text-sm font-bold text-rose-200">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-400 shrink-0" />
                  <span>{actionError}</span>
                </div>
                <button type="button" onClick={() => setActionError("")} className="text-rose-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* TAB 1: OVERVIEW */}
            {activePanel === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
                    Operations Control Overview
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Real-time metrics, revenue performance, and activity queues.
                  </p>
                </div>

                {overviewLoading ? (
                  <LoadingState message="Syncing operational metrics..." cards={6} />
                ) : overviewError ? (
                  <ErrorState message={overviewError} onRetry={() => loadOverview({ range: rangeDays, useLoader: true })} />
                ) : (
                  <>
                    {/* KPI Cards Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-2xl border border-emerald-500/30 bg-[#06141d]/90 p-5 shadow-lg">
                        <p className="font-mono text-xs uppercase tracking-wider text-slate-400">Total Revenue</p>
                        <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-400">
                          {formatCurrency(overview?.payments?.revenueInr)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">In last {overview?.rangeDays || rangeDays} days</p>
                      </div>

                      <div className="rounded-2xl border border-emerald-500/30 bg-[#06141d]/90 p-5 shadow-lg">
                        <p className="font-mono text-xs uppercase tracking-wider text-slate-400">Paid Transactions</p>
                        <p className="mt-2 text-2xl sm:text-3xl font-black text-cyan-300">
                          {formatCount(overview?.payments?.paid)} <span className="text-xs font-normal text-slate-400">/ {formatCount(overview?.payments?.total)}</span>
                        </p>
                        <p className="mt-1 text-xs text-emerald-400 font-bold">{formatPercent(paymentSuccessRate)} success rate</p>
                      </div>

                      <div className="rounded-2xl border border-emerald-500/30 bg-[#06141d]/90 p-5 shadow-lg">
                        <p className="font-mono text-xs uppercase tracking-wider text-slate-400">Unread Enquiries</p>
                        <p className="mt-2 text-2xl sm:text-3xl font-black text-amber-400">
                          {formatCount(unreadContacts)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{formatCount(newContacts)} new this week</p>
                      </div>
                    </div>

                    {/* Quick Jump Action Bar */}
                    <div className="rounded-2xl border border-slate-800 bg-[#050e17] p-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs uppercase font-bold text-slate-400">Quick Jump:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setActivePanel("projects")}
                          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition flex items-center gap-1.5"
                        >
                          <FolderKanban size={14} /> Manage Projects ({projects.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePanel("contacts")}
                          className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition flex items-center gap-1.5"
                        >
                          <Mail size={14} /> Read Enquiries ({unreadContacts} unread)
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivePanel("payments")}
                          className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition flex items-center gap-1.5"
                        >
                          <CreditCard size={14} /> View Payments ({paymentMeta.totalCount})
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 2: PROJECTS MANAGER (SEPARATE PROJECTS TAB) */}
            {activePanel === "projects" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
                      <FolderKanban className="text-emerald-400" /> Projects Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Manage portfolio projects, tech stack tags, live URLs, and featured flags ({projects.length} total).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      resetProjectForm();
                      setShowProjectFormModal(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-emerald-400 transition shadow-lg"
                  >
                    <Plus size={16} /> Add New Project
                  </button>
                </div>

                {/* Search & Category Filter Controls */}
                <div className="rounded-2xl border border-slate-800 bg-[#050e17] p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={projectSearch}
                      onChange={(e) => setProjectSearch(e.target.value)}
                      placeholder="Search projects by title, tech stack..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-2 text-xs font-mono text-white outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {["ALL", "FULL STACK", "WEB DEV", "PYTHON", "CYBER SECURITY", "AI"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProjectCategoryFilter(cat)}
                        className={`rounded-lg border px-3 py-1.5 text-[11px] font-mono font-bold transition ${
                          projectCategoryFilter === cat
                            ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                            : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Form Modal / Drawer */}
                {showProjectFormModal && (
                  <div className="rounded-2xl border border-emerald-500/40 bg-[#06141d] p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                      <h3 className="font-display text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        {editingProjectId ? <Edit3 size={16} className="text-emerald-400" /> : <Plus size={16} className="text-emerald-400" />}
                        {editingProjectId ? "Edit Project Details" : "Create New Project"}
                      </h3>
                      <button type="button" onClick={resetProjectForm} className="text-slate-400 hover:text-white">
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={submitProject} className="space-y-4 text-xs">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-slate-400 mb-1">Project Title *</label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={updateProjectField("title")}
                            placeholder="e.g. Kanoon-Mate"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-slate-400 mb-1">Category *</label>
                          <select
                            value={projectForm.category}
                            onChange={updateProjectField("category")}
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-emerald-500"
                          >
                            {PROJECT_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-slate-400 mb-1">Description *</label>
                        <textarea
                          required
                          rows={2}
                          value={projectForm.description}
                          onChange={updateProjectField("description")}
                          placeholder="Brief overview of the project..."
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-slate-400 mb-1">Tech Stack (comma separated) *</label>
                          <input
                            type="text"
                            required
                            value={projectForm.techStack}
                            onChange={updateProjectField("techStack")}
                            placeholder="React, Node.js, Express, MongoDB"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-slate-400 mb-1">Cover Image URL</label>
                          <input
                            type="text"
                            value={projectForm.imageUrl}
                            onChange={updateProjectField("imageUrl")}
                            placeholder="/images/projects/project-cover.webp"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-slate-400 mb-1">GitHub Repo URL</label>
                          <input
                            type="url"
                            value={projectForm.githubUrl}
                            onChange={updateProjectField("githubUrl")}
                            placeholder="https://github.com/nikhilxagr/repo"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-slate-400 mb-1">Live Demo URL</label>
                          <input
                            type="url"
                            value={projectForm.liveDemoUrl}
                            onChange={updateProjectField("liveDemoUrl")}
                            placeholder="https://demo-app.netlify.app"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="projectFeatured"
                          checked={projectForm.featured}
                          onChange={updateProjectField("featured")}
                          className="h-4 w-4 accent-emerald-500"
                        />
                        <label htmlFor="projectFeatured" className="font-mono text-slate-300 cursor-pointer">
                          ★ Feature this project on Home page
                        </label>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={resetProjectForm}
                          className="rounded-xl border border-slate-700 px-4 py-2 font-mono text-slate-300 hover:bg-slate-800 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="rounded-xl bg-emerald-500 px-5 py-2 font-mono font-bold text-black hover:bg-emerald-400 transition"
                        >
                          {submitting ? "Saving..." : editingProjectId ? "Update Project" : "Save Project"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Projects Grid / List */}
                {contentLoading ? (
                  <LoadingState message="Loading projects catalog..." cards={6} />
                ) : filteredAdminProjects.length === 0 ? (
                  <EmptyState title="No projects match filter" message="Try searching for another keyword or category." />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAdminProjects.map((project) => (
                      <article
                        key={project._id || project.slug}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#050e17] p-4 shadow-md transition hover:border-emerald-500/40"
                      >
                        <div>
                          {/* Thumbnail */}
                          <div className="h-32 w-full overflow-hidden rounded-xl bg-slate-900 mb-3 relative">
                            {project.imageUrl ? (
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                onError={(e) => { e.target.style.display = "none"; }}
                              />
                            ) : null}
                            <span className="absolute top-2 left-2 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                              {project.category}
                            </span>
                            {project.featured && (
                              <span className="absolute top-2 right-2 rounded-md bg-amber-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300 border border-amber-500/40">
                                ★ Featured
                              </span>
                            )}
                          </div>

                          <h3 className="font-display text-base font-bold text-white">{project.title}</h3>
                          <p className="mt-1 text-xs text-slate-400 line-clamp-2">{project.description}</p>

                          {/* Tech Stack */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {(project.techStack || []).map((t) => (
                              <span key={t} className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono text-emerald-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                          <div className="flex items-center gap-2">
                            {project.liveDemoUrl && (
                              <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[10px]">
                                Demo <ExternalLink size={10} />
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditProject(project)}
                              className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 font-mono text-[11px] text-slate-200 hover:border-emerald-400 hover:text-emerald-300 transition"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(project._id)}
                              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] text-rose-300 hover:bg-rose-500/20 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CONTACT ENQUIRIES & EMAIL NOTIFICATIONS (SEPARATE EMAILS TAB) */}
            {activePanel === "contacts" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
                      <Mail className="text-amber-400" /> Contact Enquiries & Email Notifications
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Inbound messages, client enquiries, and quick email response triggers ({contacts.length} total).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {["all", "new", "read"].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setContactStatus(st)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-mono font-bold uppercase transition ${
                          contactStatus === st
                            ? "border-amber-400 bg-amber-500/20 text-amber-300"
                            : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {contactsLoading ? (
                  <LoadingState message="Loading contact messages..." cards={4} />
                ) : contactsError ? (
                  <ErrorState message={contactsError} onRetry={() => loadContacts({ status: contactStatus, useLoader: true })} />
                ) : contacts.length === 0 ? (
                  <EmptyState title="No contact messages" message="Incoming messages from the contact form will appear here." />
                ) : (
                  <div className="space-y-4">
                    {contacts.map((msg) => (
                      <article
                        key={msg._id}
                        className={`rounded-2xl border p-5 transition ${
                          msg.status === "read"
                            ? "border-slate-800 bg-[#050e17]/80 opacity-80"
                            : "border-amber-500/40 bg-[#0a1510] shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-extrabold text-white">{msg.name}</h3>
                              {msg.status !== "read" && (
                                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300">
                                  UNREAD
                                </span>
                              )}
                            </div>
                            <p className="font-mono text-xs text-emerald-400 mt-0.5">{msg.email}</p>
                            {msg.phone && <p className="font-mono text-xs text-slate-400">Phone: {msg.phone}</p>}
                          </div>

                          <div className="text-right font-mono text-[11px] text-slate-500">
                            <p>{formatDate(msg.createdAt)}</p>
                            {msg.service && (
                              <span className="mt-1 inline-block rounded bg-slate-800 px-2 py-0.5 text-slate-300 font-bold uppercase">
                                {msg.service}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                            {msg.message}
                          </p>
                        </div>

                        {/* Email Action Bar */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
                          <a
                            href={`mailto:${msg.email}?subject=Re: Portfolio Enquiry - Nikhil Agrahari&body=Hi ${encodeURIComponent(msg.name)},\n\nThank you for reaching out via my portfolio!` }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-mono font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                          >
                            <Send size={13} /> Reply via Email
                          </a>

                          {msg.status !== "read" && (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(msg._id)}
                              className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 font-mono text-xs text-slate-300 hover:bg-slate-700 transition"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PAYMENTS & SUPPORT ORDERS (SEPARATE PAYMENTS TAB) */}
            {activePanel === "payments" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
                      <CreditCard className="text-cyan-400" /> Payments & Support Orders
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Cashfree & support contribution transaction history in last {paymentMeta.rangeDays} days ({paymentMeta.totalCount} orders).
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={paymentStatusFilter}
                      onChange={(e) => setPaymentStatusFilter(e.target.value)}
                      className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-200 outline-none focus:border-cyan-400"
                    >
                      {PAYMENT_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status Counter Cards */}
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 font-mono text-xs">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                    <p className="text-slate-400">Paid</p>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{formatCount(paymentMeta.statusCounts.paid)}</p>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-center">
                    <p className="text-slate-400">Created</p>
                    <p className="text-xl font-bold text-slate-200 mt-1">{formatCount(paymentMeta.statusCounts.created)}</p>
                  </div>
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-center">
                    <p className="text-slate-400">Failed</p>
                    <p className="text-xl font-bold text-rose-400 mt-1">{formatCount(paymentMeta.statusCounts.failed)}</p>
                  </div>
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                    <p className="text-slate-400">Refunded</p>
                    <p className="text-xl font-bold text-amber-400 mt-1">{formatCount(paymentMeta.statusCounts.refunded)}</p>
                  </div>
                </div>

                {/* Payments Data Table */}
                {paymentsLoading ? (
                  <LoadingState message="Loading payment transaction records..." cards={6} />
                ) : paymentsError ? (
                  <ErrorState message={paymentsError} onRetry={() => loadPayments({ useLoader: true })} />
                ) : paymentHistory.length === 0 ? (
                  <EmptyState title="No payment records found" message="Transactions will appear here once orders are initiated." />
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#050e17]">
                    <table className="w-full text-left font-mono text-xs text-slate-300">
                      <thead className="bg-slate-900/90 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Service / Tier</th>
                          <th className="p-3.5 text-right">Amount</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Transaction ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {paymentHistory.map((pmt) => (
                          <tr key={pmt.id} className="hover:bg-slate-900/50 transition">
                            <td className="p-3.5 text-slate-400">{formatDate(pmt.createdAt)}</td>
                            <td className="p-3.5 font-sans">
                              <p className="font-bold text-white">{pmt.customerName}</p>
                              <p className="text-[11px] font-mono text-emerald-400">{pmt.customerEmail}</p>
                            </td>
                            <td className="p-3.5 font-sans">
                              <p className="font-bold text-slate-200">{pmt.serviceName}</p>
                              <p className="text-[10px] font-mono text-slate-500">{pmt.serviceSlug}</p>
                            </td>
                            <td className="p-3.5 text-right font-bold text-emerald-400">{formatCurrency(pmt.amountInr)}</td>
                            <td className="p-3.5">
                              <span className={`rounded-md border px-2 py-0.5 text-[10px] uppercase font-bold ${getPaymentBadgeClasses(pmt.status)}`}>
                                {pmt.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              <p>Order: {formatShortId(pmt.orderId)}</p>
                              <p>Pay: {formatShortId(pmt.paymentId)}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: BLOGS & ARTICLES (SEPARATE BLOGS TAB) */}
            {activePanel === "blogs" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
                      <BookOpen className="text-purple-400" /> Blog & Article Publishing
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Manage published articles, medium cross-posts, and draft entries ({blogs.length} total).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      resetBlogForm();
                      setShowBlogFormModal(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-purple-400 transition shadow-lg"
                  >
                    <Plus size={16} /> Create New Blog
                  </button>
                </div>

                {/* Blog Form Modal */}
                {showBlogFormModal && (
                  <div className="rounded-2xl border border-purple-500/40 bg-[#06141d] p-5 sm:p-6 shadow-2xl space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                      <h3 className="font-display text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        {editingBlogId ? "Edit Blog Article" : "Publish New Article"}
                      </h3>
                      <button type="button" onClick={resetBlogForm} className="text-slate-400 hover:text-white">
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={submitBlog} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-mono text-slate-400 mb-1">Article Title *</label>
                        <input
                          type="text"
                          required
                          value={blogForm.title}
                          onChange={updateBlogField("title")}
                          placeholder="e.g. How I'm Learning Cybersecurity..."
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-slate-400 mb-1">Excerpt *</label>
                        <textarea
                          required
                          rows={2}
                          value={blogForm.excerpt}
                          onChange={updateBlogField("excerpt")}
                          placeholder="Brief summary for preview cards..."
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-slate-400 mb-1">Full Content (Markdown or HTML) *</label>
                        <textarea
                          required
                          rows={6}
                          value={blogForm.content}
                          onChange={updateBlogField("content")}
                          placeholder="Write full article body content..."
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-slate-400 mb-1">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={blogForm.tags}
                            onChange={updateBlogField("tags")}
                            placeholder="Cybersecurity, Web Development, AI"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-slate-400 mb-1">Cover Image URL</label>
                          <input
                            type="text"
                            value={blogForm.imageUrl}
                            onChange={updateBlogField("imageUrl")}
                            placeholder="/images/blogs/blog-cover.webp"
                            className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 font-mono text-white outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={resetBlogForm}
                          className="rounded-xl border border-slate-700 px-4 py-2 font-mono text-slate-300 hover:bg-slate-800 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="rounded-xl bg-purple-500 px-5 py-2 font-mono font-bold text-black hover:bg-purple-400 transition"
                        >
                          {submitting ? "Publishing..." : editingBlogId ? "Update Article" : "Publish Article"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Blogs Grid */}
                {contentLoading ? (
                  <LoadingState message="Loading articles..." cards={4} />
                ) : blogs.length === 0 ? (
                  <EmptyState title="No blog posts found" message="Published articles will appear here." />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((b) => (
                      <article key={b._id || b.slug} className="rounded-2xl border border-slate-800 bg-[#050e17] p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-display text-base font-bold text-white">{b.title}</h3>
                          <p className="mt-1 text-xs text-slate-400 line-clamp-2">{b.excerpt}</p>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {(b.tags || []).map((t) => (
                              <span key={t} className="rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-[10px] font-mono text-purple-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                          <span className="font-mono text-[10px] text-slate-500">{formatDate(b.publishedAt || b.createdAt)}</span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditBlog(b)}
                              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 font-mono text-[11px] text-slate-200 hover:text-white"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlog(b._id)}
                              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] text-rose-300 hover:bg-rose-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: SYSTEM & SECURITY HEALTH (SEPARATE SYSTEM TAB) */}
            {activePanel === "system" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" /> System & Security Diagnostics
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Server health, database connectivity, environment mode, and audit logs.
                  </p>
                </div>

                {systemLoading ? (
                  <LoadingState message="Running system diagnostics..." cards={3} />
                ) : systemError ? (
                  <ErrorState message={systemError} onRetry={() => loadSystem({ useLoader: true })} />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl border border-emerald-500/30 bg-[#050e17] p-5">
                      <p className="font-mono text-xs uppercase text-slate-400">Server Health</p>
                      <p className="mt-2 text-2xl font-black text-emerald-400">ONLINE</p>
                      <p className="mt-1 font-mono text-xs text-slate-400">Uptime: {formatUptime(systemStatus?.uptime)}</p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/30 bg-[#050e17] p-5">
                      <p className="font-mono text-xs uppercase text-slate-400">Database Status</p>
                      <p className="mt-2 text-2xl font-black text-cyan-300">CONNECTED</p>
                      <p className="mt-1 font-mono text-xs text-slate-400">MongoDB Atlas Cluster</p>
                    </div>

                    <div className="rounded-2xl border border-emerald-500/30 bg-[#050e17] p-5">
                      <p className="font-mono text-xs uppercase text-slate-400">Environment</p>
                      <p className="mt-2 text-2xl font-black text-purple-300">PRODUCTION</p>
                      <p className="mt-1 font-mono text-xs text-slate-400">Node v20.x // Vercel Cloud</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
