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
import { prewarmBackendForCheckout } from "@/services/payment.service";

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

    return window.localStorage.getItem(LOADER_VISIT_KEY) !== "1";
  });

  const handleLoaderComplete = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOADER_VISIT_KEY, "1");
    }

    setShowLoader(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
          <main className="flex-1" style={mainStyle}>
            <AnimatePresence initial={false}>
              <MotionDiv
                key={location.pathname}
                initial={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10, scale: 0.99 }
                }
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -8, scale: 0.99 }
                }
                transition={{
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="transform-gpu"
              >
                <Suspense fallback={null}>
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
                    <Route path="/terminal" element={<TerminalPage />} />
                    <Route path="/cyber-tools" element={<CyberToolsPage />} />
                    <Route path="/dsa-lab" element={<DsaLabPage />} />
                    <Route path="/methodology" element={<MethodologyPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogDetailsPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/payment-success" element={<PaymentSuccessPage />} />
                    <Route path="/receipt-portal" element={<ReceiptPortalPage />} />
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

                    {/* Experiment sub-page aliases — navbar + ExperimentsPage links use these paths */}
                    <Route path="/experiments/security-labs" element={<Navigate to="/security" replace />} />
                    <Route path="/experiments/terminal" element={<Navigate to="/terminal" replace />} />
                    <Route path="/experiments/dsa" element={<Navigate to="/dsa-lab" replace />} />
                    <Route path="/experiments/tools" element={<Navigate to="/cyber-tools" replace />} />
                    <Route path="/experiments/methodology" element={<Navigate to="/methodology" replace />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </MotionDiv>
            </AnimatePresence>
          </main>
          <SignInModal />
          <UserProfileModal />
          {!showLoader ? <ScrollProgressButton /> : null}
          {!isAdminRoute ? <Footer /> : null}
        </div>
        <Analytics />
      </div>
    </LenisProvider>
  );
}

export default App;
