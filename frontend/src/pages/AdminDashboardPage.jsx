import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BookOpen,
  Compass,
  CreditCard,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  RefreshCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Users,
  X,
} from "lucide-react";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import AdminOverviewTab from "@/components/admin/AdminOverviewTab";
import AdminSiteContentTab from "@/components/admin/AdminSiteContentTab";
import AdminProjectsTab from "@/components/admin/AdminProjectsTab";
import AdminBlogsTab from "@/components/admin/AdminBlogsTab";
import AdminJourneyTab from "@/components/admin/AdminJourneyTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminMessagesTab from "@/components/admin/AdminMessagesTab";
import AdminPaymentsTab from "@/components/admin/AdminPaymentsTab";
import { useTheme } from "@/context/ThemeContext";
import {
  broadcastSiteContentSync,
  useSiteContent,
} from "@/context/SiteContentContext";
import { SIGNATURE_PROJECTS } from "@/data/projectsData";
import { BLOG_POSTS } from "@/data/blogsData";
import { journeyData as STATIC_JOURNEY_DATA } from "@/data/journeyData";
import { mergeStaticAndApiContent } from "@/services/contentMerge";
import { getErrorMessage } from "@/services/api";
import {
  createAdminBlog,
  createAdminJourney,
  createAdminProject,
  deleteAdminBlog,
  deleteAdminContact,
  deleteAdminJourney,
  deleteAdminProject,
  deleteAdminUser,
  getAdminBlogs,
  getAdminContacts,
  getAdminJourney,
  getAdminOverview,
  getAdminPaymentsHistory,
  getAdminProjects,
  getAdminSystemStatus,
  getAdminUsers,
  markAdminContactAsRead,
  updateAdminBlog,
  updateAdminJourney,
  updateAdminProject,
  updateAdminSiteContent,
  updateAdminUser,
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
  tagline: "",
  description: "",
  overview: "",
  category: "Full Stack",
  projectType: "Solo",
  techStack: "",
  role: "",
  outcome: "",
  githubUrl: "",
  liveDemoUrl: "",
  apkUrl: "",
  imageUrl: "",
  problemStatement: "",
  solutionSummary: "",
  featured: false,
  status: "published",
});

const createInitialBlogForm = () => ({
  title: "",
  subtitle: "",
  category: "System Design",
  readTime: "5 min read",
  url: "",
  status: "published",
  excerpt: "",
  content: "",
  tags: "",
  imageUrl: "",
});

const parseCommaList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCount = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value) || 0);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatPercent = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "—";
  return `${Math.round(parsed)}%`;
};

const formatUptime = (value) => {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const formatShortId = (value) => {
  if (!value) return "—";
  const text = String(value);
  if (text.length <= 14) return text;
  return `${text.slice(0, 8)}...${text.slice(-4)}`;
};

const getPaymentBadgeClasses = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "paid":
      return "border-emerald-600/25 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400";
    case "failed":
      return "border-rose-500/25 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300";
    case "refunded":
      return "border-amber-500/25 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300";
    default:
      return "border-black/[0.08] bg-slate-100 text-slate-700 dark:border-white/[0.1] dark:bg-[#1a1e28] dark:text-[#a3a9b8]";
  }
};

const mergeProjectList = (staticList = [], apiList = []) => {
  const map = new Map();

  staticList.forEach((item) => {
    const key = String(item.slug || "").toLowerCase();
    if (key) {
      map.set(key, { ...item, status: item.status || "published" });
    }
  });

  apiList.forEach((doc) => {
    const key = String(doc.slug || "").toLowerCase();
    if (!key) return;
    const existing = map.get(key);
    if (existing) {
      map.set(key, mergeStaticAndApiContent(existing, doc));
    } else {
      map.set(key, doc);
    }
  });

  return Array.from(map.values());
};

const mergeBlogList = (staticList = [], apiList = []) => {
  const map = new Map();

  staticList.forEach((item) => {
    const key = String(item.slug || "").toLowerCase();
    if (key) {
      map.set(key, { ...item, status: item.status || "published" });
    }
  });

  apiList.forEach((doc) => {
    const key = String(doc.slug || "").toLowerCase();
    if (!key) return;
    const existing = map.get(key);
    if (existing) {
      map.set(key, mergeStaticAndApiContent(existing, doc));
    } else {
      map.set(key, doc);
    }
  });

  return Array.from(map.values());
};

const mergeAdminJourneyList = (staticList = [], apiList = []) => {
  const map = new Map();

  staticList.forEach((item) => {
    const key = String(item.entryId || item.id || "").toLowerCase();
    if (key) {
      map.set(key, { ...item, entryId: item.id, status: item.status || "published" });
    }
  });

  apiList.forEach((doc) => {
    const key = String(doc.entryId || doc.id || "").toLowerCase();
    if (!key) return;
    const existing = map.get(key) || {};
    map.set(key, {
      ...existing,
      ...doc,
      id: existing.id || doc.entryId || doc._id,
      entryId: doc.entryId || existing.id,
      details:
        doc.details && Object.keys(doc.details).length > 0
          ? { ...(existing.details || {}), ...doc.details }
          : existing.details,
    });
  });

  return Array.from(map.values()).sort((a, b) => {
    if ((a.year || 0) !== (b.year || 0)) return (b.year || 0) - (a.year || 0);
    return String(b.duration || "").localeCompare(String(a.duration || ""));
  });
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const adminUser = getStoredAdminUser();
  const { isDark, toggleTheme } = useTheme();
  const { sections, refreshSiteContent } = useSiteContent();

  const [activePanel, setActivePanel] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [rangeDays, setRangeDays] = useState(90);
  const [contactStatus, setContactStatus] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [paymentServiceFilter, setPaymentServiceFilter] = useState("all");

  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("All");
  const [showProjectFormModal, setShowProjectFormModal] = useState(false);
  const [showBlogFormModal, setShowBlogFormModal] = useState(false);

  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");

  const [projects, setProjects] = useState(SIGNATURE_PROJECTS);
  const [blogs, setBlogs] = useState(BLOG_POSTS);
  const [milestones, setMilestones] = useState(STATIC_JOURNEY_DATA);
  const [contentLoading, setContentLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactsError, setContactsError] = useState("");

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentMeta, setPaymentMeta] = useState({
    rangeDays: 90,
    totalCount: 0,
    paidRevenueInr: 0,
    statusCounts: DEFAULT_STATUS_COUNTS,
  });
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState("");

  const [systemStatus, setSystemStatus] = useState(null);
  const [systemLoading, setSystemLoading] = useState(true);
  const [systemError, setSystemError] = useState("");

  const [projectForm, setProjectForm] = useState(createInitialProjectForm);
  const [editingProjectKey, setEditingProjectKey] = useState("");
  const [blogForm, setBlogForm] = useState(createInitialBlogForm);
  const [editingBlogKey, setEditingBlogKey] = useState("");
  const [siteContentVersion, setSiteContentVersion] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState("");
  const [actionError, setActionError] = useState("");

  const handleAuthFailure = useCallback(() => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const loadOverview = useCallback(
    async ({ range = rangeDays, useLoader = true } = {}) => {
      if (useLoader) setOverviewLoading(true);
      setOverviewError("");
      try {
        const res = await getAdminOverview({ range });
        setOverview(res.data || null);
      } catch (err) {
        if (err?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setOverviewError(getErrorMessage(err, "Unable to load admin overview."));
      } finally {
        if (useLoader) setOverviewLoading(false);
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
      if (useLoader) setPaymentsLoading(true);
      setPaymentsError("");
      try {
        const res = await getAdminPaymentsHistory({
          range,
          status: status === "all" ? undefined : status,
          service: service === "all" ? undefined : service,
          limit: 100,
        });
        const payload = res?.data || {};
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.items)
          ? payload.items
          : [];
        setPaymentHistory(items);
        setPaymentMeta(
          res?.meta || {
            rangeDays: payload.rangeDays || range,
            totalCount: payload.totalCount ?? items.length,
            paidRevenueInr: payload.paidRevenueInr || 0,
            statusCounts: payload.statusCounts || DEFAULT_STATUS_COUNTS,
          },
        );
      } catch (err) {
        if (err?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setPaymentsError(getErrorMessage(err, "Unable to load payments."));
      } finally {
        if (useLoader) setPaymentsLoading(false);
      }
    },
    [handleAuthFailure, paymentServiceFilter, paymentStatusFilter, rangeDays],
  );

  const loadContent = useCallback(
    async ({ useLoader = true } = {}) => {
      if (useLoader) setContentLoading(true);
      try {
        const [projRes, blogRes, journeyRes] = await Promise.allSettled([
          getAdminProjects({ limit: 100 }),
          getAdminBlogs({ limit: 100 }),
          getAdminJourney({ limit: 100 }),
        ]);

        if (projRes.status === "fulfilled" && Array.isArray(projRes.value?.data)) {
          setProjects(mergeProjectList(SIGNATURE_PROJECTS, projRes.value.data));
        }
        if (blogRes.status === "fulfilled" && Array.isArray(blogRes.value?.data)) {
          setBlogs(mergeBlogList(BLOG_POSTS, blogRes.value.data));
        }
        if (journeyRes.status === "fulfilled" && Array.isArray(journeyRes.value?.data)) {
          setMilestones(
            mergeAdminJourneyList(STATIC_JOURNEY_DATA, journeyRes.value.data),
          );
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          handleAuthFailure();
        }
      } finally {
        if (useLoader) setContentLoading(false);
      }
    },
    [handleAuthFailure],
  );

  const loadUsers = useCallback(
    async ({ useLoader = true } = {}) => {
      if (useLoader) setUsersLoading(true);
      setUsersError("");
      try {
        const res = await getAdminUsers({ limit: 100 });
        setUsers(res.data || []);
      } catch (err) {
        if (err?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setUsersError(getErrorMessage(err, "Unable to load registered users."));
      } finally {
        if (useLoader) setUsersLoading(false);
      }
    },
    [handleAuthFailure],
  );

  const loadContacts = useCallback(
    async ({ status = contactStatus, useLoader = true } = {}) => {
      if (useLoader) setContactsLoading(true);
      setContactsError("");
      try {
        const res = await getAdminContacts({ status, limit: 100 });
        setContacts(res.data || []);
      } catch (err) {
        if (err?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setContactsError(getErrorMessage(err, "Unable to load messages."));
      } finally {
        if (useLoader) setContactsLoading(false);
      }
    },
    [contactStatus, handleAuthFailure],
  );

  const loadSystem = useCallback(
    async ({ useLoader = true } = {}) => {
      if (useLoader) setSystemLoading(true);
      setSystemError("");
      try {
        const res = await getAdminSystemStatus();
        setSystemStatus(res.data || null);
      } catch (err) {
        if (err?.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setSystemError(getErrorMessage(err, "Unable to load system status."));
      } finally {
        if (useLoader) setSystemLoading(false);
      }
    },
    [handleAuthFailure],
  );

  useEffect(() => {
    loadOverview({ range: rangeDays, useLoader: true }).catch(() => undefined);
    loadPayments({
      range: rangeDays,
      status: paymentStatusFilter,
      service: paymentServiceFilter,
      useLoader: true,
    }).catch(() => undefined);
  }, [loadOverview, loadPayments, paymentServiceFilter, paymentStatusFilter, rangeDays]);

  useEffect(() => {
    loadContent({ useLoader: true }).catch(() => undefined);
    loadUsers({ useLoader: true }).catch(() => undefined);
    loadSystem({ useLoader: true }).catch(() => undefined);
  }, [loadContent, loadSystem, loadUsers]);

  useEffect(() => {
    loadContacts({ status: contactStatus, useLoader: true }).catch(() => undefined);
  }, [contactStatus, loadContacts]);

  const refreshAll = async () => {
    setRefreshing(true);
    setActionError("");
    await Promise.allSettled([
      loadOverview({ range: rangeDays, useLoader: false }),
      loadPayments({
        range: rangeDays,
        status: paymentStatusFilter,
        service: paymentServiceFilter,
        useLoader: false,
      }),
      loadContent({ useLoader: false }),
      loadUsers({ useLoader: false }),
      loadContacts({ status: contactStatus, useLoader: false }),
      loadSystem({ useLoader: false }),
      refreshSiteContent(),
    ]);
    setSiteContentVersion((v) => v + 1);
    setRefreshing(false);
    setNotice("Synced live data across portfolio and database.");
  };

  // --- Site Content Handlers ---
  const handleSaveSiteSection = async (partialSections) => {
    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      await updateAdminSiteContent(partialSections);
      await refreshSiteContent();
      broadcastSiteContentSync();
      setSiteContentVersion((v) => v + 1);
      setNotice("Site content saved and pushed to live portfolio.");
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to update site content."));
    } finally {
      setSubmitting(false);
    }
  };

  // --- Project Handlers ---
  const resetProjectForm = () => {
    setProjectForm(createInitialProjectForm());
    setEditingProjectKey("");
    setShowProjectFormModal(false);
  };

  const updateProjectField = (field) => (event) => {
    const value =
      field === "featured" ? event.target.checked : event.target.value;
    setProjectForm((prev) => ({ ...prev, [field]: value }));
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
        setSubmitting(false);
        return;
      }

      const payload = {
        title: projectForm.title.trim(),
        subtitle: projectForm.tagline.trim(),
        tagline: projectForm.tagline.trim(),
        description: projectForm.description.trim(),
        overview: projectForm.overview.trim(),
        category: projectForm.category,
        projectType: projectForm.projectType.trim() || "Solo",
        techStack,
        role: projectForm.role.trim(),
        outcome: projectForm.outcome.trim(),
        githubUrl: projectForm.githubUrl.trim(),
        liveDemoUrl: projectForm.liveDemoUrl.trim(),
        apkUrl: projectForm.apkUrl.trim(),
        imageUrl: projectForm.imageUrl.trim(),
        problemStatement: projectForm.problemStatement.trim(),
        solutionSummary: projectForm.solutionSummary.trim(),
        featured: Boolean(projectForm.featured),
        status: projectForm.status || "published",
      };

      if (editingProjectKey) {
        await updateAdminProject(editingProjectKey, payload);
        setNotice("Project saved and synced to live portfolio.");
      } else {
        await createAdminProject(payload);
        setNotice("New project created and published.");
      }

      resetProjectForm();
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
      broadcastSiteContentSync();
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to save project."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectKey(project._id || project.slug);
    setProjectForm({
      title: project.title || "",
      tagline: project.tagline || project.subtitle || "",
      description: project.description || "",
      overview: project.overview || "",
      category: project.category || "Full Stack",
      projectType: project.projectType || "Solo",
      techStack: (project.techStack || project.tags || []).join(", "),
      role: project.role || "",
      outcome: project.outcome || project.result || "",
      githubUrl: project.githubUrl || "",
      liveDemoUrl: project.liveDemoUrl || "",
      apkUrl: project.apkUrl || "",
      imageUrl: project.imageUrl || "",
      problemStatement: project.problemStatement || "",
      solutionSummary: project.solutionSummary || "",
      featured: Boolean(project.featured),
      status: project.status || "published",
    });
    setShowProjectFormModal(true);
    setActionError("");
    setNotice("");
  };

  const handleDeleteProject = async (idOrSlug) => {
    if (!idOrSlug) return;
    if (!window.confirm("Remove or hide this project from the public portfolio?")) {
      return;
    }

    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      await deleteAdminProject(idOrSlug);
      setNotice("Project removed / unpublished from portfolio.");
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
      broadcastSiteContentSync();
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to delete project."));
    } finally {
      setSubmitting(false);
    }
  };

  // --- Blog Handlers ---
  const resetBlogForm = () => {
    setBlogForm(createInitialBlogForm());
    setEditingBlogKey("");
    setShowBlogFormModal(false);
  };

  const updateBlogField = (field) => (event) => {
    setBlogForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const submitBlog = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setActionError("");
    setNotice("");

    try {
      const payload = {
        title: blogForm.title.trim(),
        subtitle: blogForm.subtitle.trim(),
        category: blogForm.category.trim() || "System Design",
        readTime: blogForm.readTime.trim() || "5 min read",
        url: blogForm.url.trim(),
        status: blogForm.status || "published",
        excerpt: blogForm.excerpt.trim(),
        content: blogForm.content.trim(),
        tags: parseCommaList(blogForm.tags),
        imageUrl: blogForm.imageUrl.trim(),
      };

      if (editingBlogKey) {
        await updateAdminBlog(editingBlogKey, payload);
        setNotice("Article updated and synced.");
      } else {
        await createAdminBlog(payload);
        setNotice("New article created.");
      }

      resetBlogForm();
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
      broadcastSiteContentSync();
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to save article."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogKey(blog._id || blog.slug);
    setBlogForm({
      title: blog.title || "",
      subtitle: blog.subtitle || "",
      category: blog.category || blog.source || "System Design",
      readTime: blog.readTime || "5 min read",
      url: blog.url || "",
      status: blog.status || "published",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      tags: (blog.tags || []).join(", "),
      imageUrl: blog.imageUrl || "",
    });
    setShowBlogFormModal(true);
    setActionError("");
    setNotice("");
  };

  const handleDeleteBlog = async (blog) => {
    const key = typeof blog === "string" ? blog : blog?._id || blog?.slug;
    if (!key) return;
    if (!window.confirm("Remove or hide this article from the blog?")) return;

    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      await deleteAdminBlog(key, {
        title: typeof blog === "object" ? blog.title : undefined,
      });
      setNotice("Article removed / unpublished.");
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
      broadcastSiteContentSync();
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to delete article."));
    } finally {
      setSubmitting(false);
    }
  };

  // --- Journey Handlers ---
  const handleSaveMilestone = async (editingKey, payload) => {
    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      if (editingKey) {
        await updateAdminJourney(editingKey, payload);
        setNotice("Journey milestone updated and synced to /journey.");
      } else {
        await createAdminJourney(payload);
        setNotice("Journey milestone created and added to timeline.");
      }
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        refreshSiteContent(),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
      broadcastSiteContentSync();
      return true;
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return false;
      }
      setActionError(getErrorMessage(err, "Unable to save milestone."));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMilestone = async (item) => {
    const key = item?._id || item?.entryId || item?.id;
    if (!key) return;
    if (!window.confirm(`Remove or hide "${item.title}" from the Journey page?`)) {
      return;
    }

    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      await deleteAdminJourney(key, { year: item.year, title: item.title });
      setNotice("Journey milestone removed / hidden.");
      await Promise.allSettled([
        loadContent({ useLoader: false }),
        refreshSiteContent(),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
      broadcastSiteContentSync();
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to delete milestone."));
    } finally {
      setSubmitting(false);
    }
  };

  // --- Users Handlers ---
  const handleUpdateUser = async (userId, payload) => {
    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      await updateAdminUser(userId, payload);
      setNotice("User profile updated.");
      await Promise.allSettled([
        loadUsers({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
      return true;
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return false;
      }
      setActionError(getErrorMessage(err, "Unable to update user profile."));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Delete registered user ${email || userId}?`)) return;
    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      await deleteAdminUser(userId);
      setNotice("User account removed.");
      await Promise.allSettled([
        loadUsers({ useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to delete user."));
    } finally {
      setSubmitting(false);
    }
  };

  // --- Contact Handlers ---
  const handleMarkRead = async (id) => {
    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      await markAdminContactAsRead(id);
      setNotice("Enquiry marked as read.");
      await Promise.allSettled([
        loadContacts({ status: contactStatus, useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to update enquiry."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    setSubmitting(true);
    setActionError("");
    setNotice("");
    try {
      await deleteAdminContact(id);
      setNotice("Enquiry deleted.");
      await Promise.allSettled([
        loadContacts({ status: contactStatus, useLoader: false }),
        loadOverview({ range: rangeDays, useLoader: false }),
      ]);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setActionError(getErrorMessage(err, "Unable to delete enquiry."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  const unreadContactsCount = overview?.contacts?.unread || 0;

  const navItems = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: LayoutDashboard, badge: null },
      { id: "site", label: "Site Content", icon: SlidersHorizontal, badge: null },
      { id: "projects", label: "Projects", icon: FolderKanban, badge: projects.length },
      { id: "blogs", label: "Blogs", icon: BookOpen, badge: blogs.length },
      { id: "journey", label: "Journey", icon: Compass, badge: milestones.length },
      { id: "users", label: "Users", icon: Users, badge: users.length || overview?.users?.total || 0 },
      { id: "messages", label: "Enquiries", icon: Mail, badge: unreadContactsCount },
      { id: "payments", label: "Payments", icon: CreditCard, badge: paymentMeta.totalCount || 0 },
      { id: "system", label: "System", icon: ShieldCheck, badge: null },
    ],
    [blogs.length, milestones.length, overview?.users?.total, paymentMeta.totalCount, projects.length, unreadContactsCount, users.length],
  );

  const navigateTab = (id) => {
    setActivePanel(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Admin Console | {sections?.profile?.brandName || "Nikhil"} Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#f5f7fa] text-slate-900 dark:bg-[#090a0f] dark:text-[#eef0f5] flex flex-col">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 border-b border-black/[0.08] bg-white/95 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#090a0f]/95">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-[#f8fafc] text-slate-700 lg:hidden dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5]"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <X size={18} strokeWidth={1.6} /> : <Menu size={18} strokeWidth={1.6} />}
              </button>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-600/25 bg-emerald-50 font-mono text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
                  CMS
                </div>
                <div>
                  <span className="font-display text-base font-semibold tracking-tight text-slate-900 dark:text-[#eef0f5]">
                    Portfolio Console
                  </span>
                  <span className="hidden sm:inline-block ml-2 rounded-md border border-black/[0.08] bg-[#f8fafc] px-2 py-0.5 font-mono text-[11px] text-slate-500 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#7a8296]">
                    Live Sync
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="hidden md:flex items-center rounded-lg border border-black/[0.08] bg-[#f8fafc] p-0.5 dark:border-white/[0.08] dark:bg-[#11141c]">
                {RANGE_OPTIONS.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setRangeDays(days)}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                      rangeDays === days
                        ? "bg-emerald-600 font-medium text-white dark:bg-emerald-500 dark:text-slate-950"
                        : "text-slate-600 hover:text-slate-900 dark:text-[#a3a9b8] dark:hover:text-[#eef0f5]"
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={refreshAll}
                disabled={refreshing}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:bg-[#1a1e28]"
              >
                <RefreshCcw size={14} strokeWidth={1.6} className={refreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">{refreshing ? "Syncing..." : "Sync Data"}</span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:bg-[#1a1e28]"
              >
                <ExternalLink size={14} strokeWidth={1.6} />
                <span className="hidden sm:inline">View Site</span>
              </a>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle Light/Dark theme"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:bg-[#1a1e28]"
              >
                {isDark ? <Sun size={15} strokeWidth={1.6} /> : <Moon size={15} strokeWidth={1.6} />}
              </button>

              {adminUser?.email && (
                <div className="hidden xl:flex items-center gap-2 rounded-lg border border-black/[0.08] bg-[#f8fafc] px-3 py-1.5 text-xs text-slate-600 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#a3a9b8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>{adminUser.email}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-50 px-3 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
              >
                <LogOut size={14} strokeWidth={1.6} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Body Layout */}
        <div className="mx-auto flex w-full max-w-[1440px] flex-1">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-60 shrink-0 flex-col justify-between border-r border-black/[0.08] bg-white/60 px-3 py-5 dark:border-white/[0.08] dark:bg-[#0c0e14]/70">
            <nav className="space-y-1">
              <p className="px-3 pb-2 text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                Workspace
              </p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activePanel === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigateTab(item.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      active
                        ? "border border-emerald-600/25 bg-emerald-50 font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "border border-transparent text-slate-600 hover:bg-black/[0.03] hover:text-slate-900 dark:text-[#a3a9b8] dark:hover:bg-white/[0.04] dark:hover:text-[#eef0f5]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={16} strokeWidth={1.6} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] tabular-nums ${
                          item.id === "messages" && item.badge > 0
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                            : "bg-black/[0.05] text-slate-600 dark:bg-white/[0.06] dark:text-[#a3a9b8]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="rounded-xl border border-black/[0.08] bg-[#f8fafc] p-3.5 text-xs dark:border-white/[0.08] dark:bg-[#11141c]">
              <p className="font-medium text-slate-900 dark:text-[#eef0f5]">
                Service Health
              </p>
              <p className="mt-1 text-slate-600 dark:text-[#a3a9b8]">
                Database: {systemStatus?.dbConnected ? "Connected" : "Checking"}
              </p>
              <p className="text-slate-500 tabular-nums dark:text-[#7a8296]">
                Unread enquiries: {unreadContactsCount}
              </p>
            </div>
          </aside>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-40 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                onClick={() => setMobileMenuOpen(false)}
              />
              <aside className="relative z-10 flex w-72 max-w-[85vw] flex-col justify-between border-r border-black/[0.08] bg-white p-4 dark:border-white/[0.08] dark:bg-[#0c0e14]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-black/[0.08] pb-3 dark:border-white/[0.08]">
                    <span className="font-display text-base font-semibold text-slate-900 dark:text-[#eef0f5]">
                      Navigation
                    </span>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-[#7a8296] dark:hover:bg-[#1a1e28]"
                    >
                      <X size={18} strokeWidth={1.6} />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const active = activePanel === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateTab(item.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${
                            active
                              ? "border border-emerald-600/25 bg-emerald-50 font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "text-slate-600 hover:bg-black/[0.04] dark:text-[#a3a9b8] dark:hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon size={16} strokeWidth={1.6} />
                            <span>{item.label}</span>
                          </span>
                          {item.badge !== null && item.badge !== undefined && (
                            <span className="font-mono text-xs tabular-nums opacity-80">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-black/[0.08] bg-[#f8fafc] p-1 dark:border-white/[0.08] dark:bg-[#11141c]">
                  {RANGE_OPTIONS.map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setRangeDays(days)}
                      className={`flex-1 rounded-md py-1.5 font-mono text-xs ${
                        rangeDays === days
                          ? "bg-emerald-600 font-medium text-white dark:bg-emerald-500 dark:text-slate-950"
                          : "text-slate-600 dark:text-[#a3a9b8]"
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          )}

          {/* Main Workspace */}
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Global Feedback Banners */}
            {(notice || actionError) && (
              <div className="space-y-2">
                {notice && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-600/25 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <span>{notice}</span>
                    <button
                      type="button"
                      onClick={() => setNotice("")}
                      className="rounded-md p-1 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
                      aria-label="Dismiss notice"
                    >
                      <X size={15} strokeWidth={1.6} />
                    </button>
                  </div>
                )}

                {actionError && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-500/25 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                    <span className="flex items-center gap-2">
                      <AlertCircle size={16} strokeWidth={1.6} />
                      {actionError}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActionError("")}
                      className="rounded-md p-1 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
                      aria-label="Dismiss error"
                    >
                      <X size={15} strokeWidth={1.6} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activePanel === "overview" && (
              <AdminOverviewTab
                overviewLoading={overviewLoading}
                overviewError={overviewError}
                overview={overview}
                loadOverview={loadOverview}
                rangeDays={rangeDays}
                projectsCount={projects.length}
                blogsCount={blogs.length}
                journeyCount={milestones.length}
                usersCount={users.length || overview?.users?.total || 0}
                paymentCount={paymentMeta.totalCount || 0}
                onNavigateTab={navigateTab}
                formatCurrency={formatCurrency}
                formatCount={formatCount}
                formatPercent={formatPercent}
              />
            )}

            {activePanel === "site" && (
              <AdminSiteContentTab
                key={`site-${siteContentVersion}`}
                sections={sections}
                onSaveSection={handleSaveSiteSection}
                submitting={submitting}
              />
            )}

            {activePanel === "projects" && (
              <AdminProjectsTab
                projects={projects}
                contentLoading={contentLoading}
                projectSearch={projectSearch}
                setProjectSearch={setProjectSearch}
                projectCategoryFilter={projectCategoryFilter}
                setProjectCategoryFilter={setProjectCategoryFilter}
                showProjectFormModal={showProjectFormModal}
                setShowProjectFormModal={setShowProjectFormModal}
                editingProjectKey={editingProjectKey}
                projectForm={projectForm}
                updateProjectField={updateProjectField}
                resetProjectForm={resetProjectForm}
                submitProject={submitProject}
                handleEditProject={handleEditProject}
                handleDeleteProject={handleDeleteProject}
                submitting={submitting}
              />
            )}

            {activePanel === "blogs" && (
              <AdminBlogsTab
                blogs={blogs}
                contentLoading={contentLoading}
                showBlogFormModal={showBlogFormModal}
                setShowBlogFormModal={setShowBlogFormModal}
                editingBlogKey={editingBlogKey}
                blogForm={blogForm}
                updateBlogField={updateBlogField}
                resetBlogForm={resetBlogForm}
                submitBlog={submitBlog}
                handleEditBlog={handleEditBlog}
                handleDeleteBlog={handleDeleteBlog}
                formatDate={formatDate}
                submitting={submitting}
              />
            )}

            {activePanel === "journey" && (
              <AdminJourneyTab
                milestones={milestones}
                onSaveMilestone={handleSaveMilestone}
                onDeleteMilestone={handleDeleteMilestone}
                submitting={submitting}
              />
            )}

            {activePanel === "users" && (
              <AdminUsersTab
                users={users}
                usersLoading={usersLoading}
                usersError={usersError}
                onReloadUsers={loadUsers}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                formatDate={formatDate}
                submitting={submitting}
              />
            )}

            {activePanel === "messages" && (
              <AdminMessagesTab
                contactsLoading={contactsLoading}
                contactsError={contactsError}
                contacts={contacts}
                contactStatus={contactStatus}
                setContactStatus={setContactStatus}
                loadContacts={loadContacts}
                handleMarkRead={handleMarkRead}
                handleDeleteContact={handleDeleteContact}
                formatDate={formatDate}
                submitting={submitting}
              />
            )}

            {activePanel === "payments" && (
              <AdminPaymentsTab
                paymentsLoading={paymentsLoading}
                paymentsError={paymentsError}
                paymentHistory={paymentHistory}
                paymentMeta={paymentMeta}
                loadPayments={loadPayments}
                paymentStatusFilter={paymentStatusFilter}
                setPaymentStatusFilter={setPaymentStatusFilter}
                paymentServiceFilter={paymentServiceFilter}
                setPaymentServiceFilter={setPaymentServiceFilter}
                PAYMENT_STATUS_OPTIONS={PAYMENT_STATUS_OPTIONS}
                PAYMENT_SERVICE_OPTIONS={PAYMENT_SERVICE_OPTIONS}
                formatCurrency={formatCurrency}
                formatCount={formatCount}
                formatDate={formatDate}
                formatShortId={formatShortId}
                getPaymentBadgeClasses={getPaymentBadgeClasses}
              />
            )}

            {activePanel === "system" && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-[#eef0f5]">
                      System &amp; Diagnostics
                    </h1>
                    <p className="mt-1 text-sm text-slate-600 dark:text-[#a3a9b8]">
                      API runtime status, database connectivity, and environment summary.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadSystem({ useLoader: true })}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-white/[0.08] dark:bg-[#11141c] dark:text-[#eef0f5] dark:hover:bg-[#1a1e28]"
                  >
                    <RefreshCcw size={14} strokeWidth={1.6} />
                    Check Health
                  </button>
                </div>

                {systemLoading ? (
                  <LoadingState message="Checking system diagnostics..." cards={3} />
                ) : systemError ? (
                  <ErrorState
                    message={systemError}
                    onRetry={() => loadSystem({ useLoader: true })}
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
                      <p className="text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                        Server Runtime
                      </p>
                      <p className="mt-2 font-display text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
                        Online
                      </p>
                      <p className="mt-1 font-mono text-xs text-slate-500 tabular-nums dark:text-[#a3a9b8]">
                        Uptime: {formatUptime(systemStatus?.uptime)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
                      <p className="text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                        Database Connection
                      </p>
                      <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-[#eef0f5]">
                        {systemStatus?.dbConnected ? "Connected" : "Fallback Mode"}
                      </p>
                      <p className="mt-1 font-mono text-xs text-slate-500 dark:text-[#a3a9b8]">
                        MongoDB Atlas Cluster
                      </p>
                    </div>

                    <div className="rounded-xl border border-black/[0.08] bg-white p-5 dark:border-white/[0.08] dark:bg-[#11141c]">
                      <p className="text-xs font-medium text-slate-500 dark:text-[#7a8296]">
                        Payment Gateway
                      </p>
                      <p className="mt-2 font-display text-2xl font-semibold text-slate-900 capitalize dark:text-[#eef0f5]">
                        {systemStatus?.gateway?.mode || "not-configured"}
                      </p>
                      <p className="mt-1 font-mono text-xs text-slate-500 dark:text-[#a3a9b8]">
                        Webhooks: {systemStatus?.gateway?.webhookReady ? "Ready" : "Unavailable"} · Emails: {systemStatus?.gateway?.receiptEmailReady ? "Enabled" : "Off"}
                      </p>
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
