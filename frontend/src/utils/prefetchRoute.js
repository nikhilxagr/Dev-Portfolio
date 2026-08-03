/**
 * Route Prefetch Registry
 * Maps page route paths to their dynamic import statements.
 * Triggers background preloading on link hover or browser idle.
 */
const routeImportMap = {
  "/": () => import("@/pages/HomePage.jsx"),
  "/about": () => import("@/pages/AboutPage.jsx"),
  "/skills": () => import("@/pages/SkillsPage.jsx"),
  "/projects": () => import("@/pages/ProjectsPage.jsx"),
  "/journey": () => import("@/pages/JourneyPage.jsx"),
  "/experiments": () => import("@/pages/ExperimentsPage.jsx"),
  "/security": () => import("@/pages/SecurityPage.jsx"),
  "/terminal": () => import("@/pages/TerminalPage.jsx"),
  "/cyber-tools": () => import("@/pages/CyberToolsPage.jsx"),
  "/dsa-lab": () => import("@/pages/DsaLabPage.jsx"),
  "/methodology": () => import("@/pages/MethodologyPage.jsx"),
  "/blog": () => import("@/pages/BlogPage.jsx"),
  "/services": () => import("@/pages/ServicesPage.jsx"),
  "/contact": () => import("@/pages/ContactPage.jsx"),
  "/how-i-build": () => import("@/pages/HowIBuildPage.jsx"),
  "/support": () => import("@/pages/SupportPage.jsx"),
};

const prefetchedRoutes = new Set();

/**
 * Trigger dynamic import prefetch for a route path.
 * Safe to call repeatedly — deduplicates prefetch calls.
 */
export const prefetchRoute = (path) => {
  if (!path || prefetchedRoutes.has(path)) return;

  const importer = routeImportMap[path];
  if (importer) {
    prefetchedRoutes.add(path);
    importer().catch(() => {
      prefetchedRoutes.delete(path);
    });
  }
};

/**
 * Preloads all main page chunks during browser idle time
 * so route switches are instant and show zero loading indicators.
 */
export const prefetchAllRoutesIdle = () => {
  const runPrefetch = () => {
    Object.keys(routeImportMap).forEach((path) => {
      prefetchRoute(path);
    });
  };

  if (typeof window !== "undefined") {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(runPrefetch, { timeout: 3000 });
    } else {
      window.setTimeout(runPrefetch, 1500);
    }
  }
};
