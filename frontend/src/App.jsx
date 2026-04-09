import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BackgroundGrid from '@/components/layout/BackgroundGrid'
import PortfolioLoader from '@/components/layout/PortfolioLoader'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import SkillsPage from '@/pages/SkillsPage'
import ProjectsPage from '@/pages/ProjectsPage'
import ProjectDetailsPage from '@/pages/ProjectDetailsPage'
import SecurityPage from '@/pages/SecurityPage'
import ServicesPage from '@/pages/ServicesPage'
import BlogPage from '@/pages/BlogPage'
import BlogDetailsPage from '@/pages/BlogDetailsPage'
import ContactPage from '@/pages/ContactPage'
import AdminLoginPage from '@/pages/AdminLoginPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import NotFoundPage from '@/pages/NotFoundPage'

const LOADER_VISIT_KEY = 'portfolio_loader_seen'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    const isAdminPath = window.location.pathname.startsWith('/admin')
    if (isAdminPath) {
      return false
    }

    return window.sessionStorage.getItem(LOADER_VISIT_KEY) !== '1'
  })

  const handleLoaderComplete = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(LOADER_VISIT_KEY, '1')
    }

    setShowLoader(false)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {showLoader ? <PortfolioLoader onComplete={handleLoaderComplete} /> : null}
      <BackgroundGrid />
      <div className="relative z-10 flex min-h-screen flex-col">
        {!isAdminRoute ? <Navbar /> : null}
        <main className={isAdminRoute ? 'flex-1 pt-8' : 'flex-1 pt-24'}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blogs" element={<Navigate to="/blog" replace />} />
            <Route path="/blog/:slug" element={<BlogDetailsPage />} />
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
            <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!isAdminRoute ? <Footer /> : null}
      </div>
    </div>
  )
}

export default App
