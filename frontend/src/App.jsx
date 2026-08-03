import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackgroundGrid from "@/components/layout/BackgroundGrid";
import PortfolioLoader from "@/components/layout/PortfolioLoader";
import ScrollProgressButton from "@/components/layout/ScrollProgressButton";
import ScrollProgressBar from "@/components/layout/ScrollProgressBar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SignInModal from "@/components/auth/SignInModal";
import UserProfileModal from "@/components/auth/UserProfileModal";
import LenisProvider from "@/components/layout/LenisProvider";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import { prewarmBackendForCheckout } from "@/services/payment.service";
import { prefetchAllRoutesIdle } from "@/utils/prefetchRoute";

// Route-Level Lazy Loading — Non-critical pages dynamically imported as async chunks
const HomePage = lazy(() => import("@/pages/HomePage.jsx"));
const AboutPage = lazy(() => import("@/pages/AboutPage.jsx"));
const SkillsPage = lazy(() => import("@/pages/SkillsPage.jsx"));
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage.jsx"));
const JourneyPage = lazy(() => import("@/pages/JourneyPage.jsx"));
const ProjectDetailsPage = lazy(() => import("@/pages/ProjectDetailsPage.jsx"));
const ExperimentsPage = lazy(() => import("@/pages/ExperimentsPage.jsx"));
const SecurityPage = lazy(() => import("@/pages/SecurityPage.jsx"));
const TerminalPage = lazy(() => import("@/pages/TerminalPage.jsx"));
const CyberToolsPage = lazy(() => import("@/pages/CyberToolsPage.jsx"));
const DsaLabPage = lazy(() => import("@/pages/DsaLabPage.jsx"));
const MethodologyPage = lazy(() => import("@/pages/MethodologyPage.jsx"));
const ServicesPage = lazy(() => import("@/pages/ServicesPage.jsx"));
const SupportPage = lazy(() => import("@/pages/SupportPage.jsx"));
const PaymentSuccessPage = lazy(() => import("@/pages/PaymentSuccessPage.jsx"));
const ReceiptPortalPage = lazy(() => import("@/pages/ReceiptPortalPage.jsx"));
const RefundPolicyPage = lazy(() => import("@/pages/RefundPolicyPage.jsx"));
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage.jsx"));
const TermsPage = lazy(() => import("@/pages/TermsPage.jsx"));
const CancellationPolicyPage = lazy(
  () => import("@/pages/CancellationPolicyPage.jsx"),
);
const DeliveryPolicyPage = lazy(() => import("@/pages/DeliveryPolicyPage.jsx"));
const BlogPage = lazy(() => import("@/pages/BlogPage.jsx"));
const BlogDetailsPage = lazy(() => import("@/pages/BlogDetailsPage.jsx"));
const ContactPage = lazy(() => import("@/pages/ContactPage.jsx"));
const AdminLoginPage = lazy(() => import("@/pages/AdminLoginPage.jsx"));
const AdminDashboardPage = lazy(() => import("@/pages/AdminDashboardPage.jsx"));
const HowIBuildPage = lazy(() => import("@/pages/HowIBuildPage.jsx"));
const AuthCallbackPage = lazy(() => import("@/pages/AuthCallbackPage.jsx"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage.jsx"));

const LOADER_VISIT_KEY = "portfolio_loader_seen";
const MotionDiv = motion.div;

// Clean invisible route fallback — eliminates skeleton flash & CLS for smooth seamless page transitions
const RouteFallback = () => (
  <div className="min-h-[85vh] w-full" aria-hidden="true" />
);

const LegacyRedirect = ({ to }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
};

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
      window.scrollTo(0, 0);
    }

    setShowLoader(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, showLoader]);

  // Preload all page chunks in background idle time for instant, zero-wait navigation
  useEffect(() => {
    if (!showLoader) {
      prefetchAllRoutesIdle();
    }
  }, [showLoader]);

  useEffect(() => {
    if (isAdminRoute || showLoader) {
      return;
    }

    const timerId = window.setTimeout(() => {
      prewarmBackendForCheckout({ includeCashfreeScript: false }).catch(
        () => undefined,
      );
    }, 500);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isAdminRoute, showLoader]);

  const mainStyle = isAdminRoute
    ? { paddingTop: "2rem" }
    : { paddingTop: "var(--site-top-offset, 6rem)" };

  return (
    <LenisProvider>
      <div className="relative min-h-screen overflow-x-hidden">
        <ScrollProgressBar />
        <AnimatePresence mode="wait">
          {showLoader ? (
            <PortfolioLoader
              key="portfolio-loader"
              onComplete={handleLoaderComplete}
            />
          ) : null}
        </AnimatePresence>
        <BackgroundGrid />
        <div className="relative z-10 flex min-h-screen flex-col">
          {!isAdminRoute ? <Navbar /> : null}
          <main className="flex-1 min-h-[85vh]" style={mainStyle}>
            <AnimatePresence mode="wait">
              <MotionDiv
                key={location.pathname}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 4 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -2 }
                }
                transition={{
                  duration: 0.08,
                  ease: "easeOut",
                }}
                className="transform-gpu will-change-transform"
              >
                {/* Route-Level Error Boundary + Invisible Suspense Fallback (Zero Dotted Flash) */}
                <RouteErrorBoundary>
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
                      <Route path="/journey" element={<JourneyPage />} />
                      <Route path="/how-i-build" element={<HowIBuildPage />} />
                      <Route path="/experiments" element={<ExperimentsPage />} />
                      <Route path="/security" element={<SecurityPage />} />
                      <Route path="/experiments/security-labs" element={<SecurityPage />} />
                      <Route path="/terminal" element={<TerminalPage />} />
                      <Route path="/experiments/terminal" element={<TerminalPage />} />
                      <Route path="/cyber-tools" element={<CyberToolsPage />} />
                      <Route path="/experiments/tools" element={<CyberToolsPage />} />
                      <Route path="/dsa-lab" element={<DsaLabPage />} />
                      <Route path="/experiments/dsa" element={<DsaLabPage />} />
                      <Route path="/methodology" element={<MethodologyPage />} />
                      <Route path="/experiments/methodology" element={<MethodologyPage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/support" element={<SupportPage />} />
                      <Route path="/payment/success" element={<PaymentSuccessPage />} />
                      <Route path="/payment-success" element={<LegacyRedirect to="/payment/success" />} />
                      <Route path="/receipts" element={<ReceiptPortalPage />} />
                      <Route path="/receipt-portal" element={<LegacyRedirect to="/receipts" />} />
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
                      <Route path="/auth/callback" element={<AuthCallbackPage />} />
                      <Route path="/home" element={<Navigate to="/" replace />} />

                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Suspense>
                </RouteErrorBoundary>
              </MotionDiv>
            </AnimatePresence>
          </main>
          {!isAdminRoute ? <Footer /> : null}
        </div>
        {!showLoader ? <ScrollProgressButton /> : null}
        <SignInModal />
        <UserProfileModal />
        <Analytics />
      </div>
    </LenisProvider>
  );
}

export default App;