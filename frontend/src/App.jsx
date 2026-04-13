import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundGrid from "@/components/layout/BackgroundGrid";
import PortfolioLoader from "@/components/layout/PortfolioLoader";
import ScrollProgressButton from "@/components/layout/ScrollProgressButton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const HomePage = lazy(() => import("@/pages/HomePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const SkillsPage = lazy(() => import("@/pages/SkillsPage"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectDetailsPage = lazy(() => import("@/pages/ProjectDetailsPage"));
const SecurityPage = lazy(() => import("@/pages/SecurityPage"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage"));
const PaymentSuccessPage = lazy(() => import("@/pages/PaymentSuccessPage"));
const ReceiptPortalPage = lazy(() => import("@/pages/ReceiptPortalPage"));
const RefundPolicyPage = lazy(() => import("@/pages/RefundPolicyPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("@/pages/TermsPage"));
const CancellationPolicyPage = lazy(
  () => import("@/pages/CancellationPolicyPage"),
);
const DeliveryPolicyPage = lazy(() => import("@/pages/DeliveryPolicyPage"));
const BlogPage = lazy(() => import("@/pages/BlogPage"));
const BlogDetailsPage = lazy(() => import("@/pages/BlogDetailsPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const LOADER_VISIT_KEY = "portfolio_loader_seen";
const MotionDiv = motion.div;

const RouteFallback = () => (
  <div className="section-wrap pt-16 pb-16">
    <div className="mx-auto max-w-md rounded-2xl border border-cyan-300/25 bg-slate-950/70 p-5 text-center text-sm text-slate-300">
      Loading page...
    </div>
  </div>
);

function App() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const isAdminPath = window.location.pathname.startsWith("/admin");
    if (isAdminPath) {
      return false;
    }

    return window.sessionStorage.getItem(LOADER_VISIT_KEY) !== "1";
  });

  const handleLoaderComplete = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(LOADER_VISIT_KEY, "1");
    }

    setShowLoader(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const mainStyle = isAdminRoute
    ? { paddingTop: "2rem" }
    : { paddingTop: "var(--site-top-offset, 6rem)" };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatePresence>
        {showLoader ? (
          <PortfolioLoader
            key="portfolio-loader"
            onComplete={handleLoaderComplete}
          />
        ) : null}
      </AnimatePresence>
      {!showLoader ? <BackgroundGrid /> : null}
      <MotionDiv
        className="relative z-10 flex min-h-screen flex-col"
        initial={false}
        animate={showLoader ? { opacity: 0, y: 6 } : { opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0.12 : 0.42,
          ease: "easeOut",
          delay: showLoader ? 0 : 0.06,
        }}
      >
        {!isAdminRoute ? <Navbar /> : null}
        <main className="flex-1" style={mainStyle}>
          <AnimatePresence initial={false}>
            <MotionDiv
              key={location.pathname}
              initial={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: -6 }
              }
              transition={{
                duration: prefersReducedMotion ? 0.04 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Suspense fallback={<RouteFallback />}>
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/skills" element={<SkillsPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route
                    path="/projects/:slug"
                    element={<ProjectDetailsPage />}
                  />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route
                    path="/blogs"
                    element={<Navigate to="/blog" replace />}
                  />
                  <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route
                    path="/payment/success"
                    element={<PaymentSuccessPage />}
                  />
                  <Route path="/receipts" element={<ReceiptPortalPage />} />
                  <Route path="/refund-policy" element={<RefundPolicyPage />} />
                  <Route
                    path="/privacy-policy"
                    element={<PrivacyPolicyPage />}
                  />
                  <Route path="/terms-and-conditions" element={<TermsPage />} />
                  <Route
                    path="/cancellation-policy"
                    element={<CancellationPolicyPage />}
                  />
                  <Route
                    path="/delivery-policy"
                    element={<DeliveryPolicyPage />}
                  />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={<Navigate to="/admin" replace />}
                  />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </MotionDiv>
          </AnimatePresence>
        </main>
        {!showLoader ? <ScrollProgressButton /> : null}
        {!isAdminRoute ? <Footer /> : null}
      </MotionDiv>
      <Analytics />
    </div>
  );
}

export default App;
