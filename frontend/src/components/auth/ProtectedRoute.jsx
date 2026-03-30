import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingState from '@/components/ui/LoadingState'
import { getErrorMessage } from '@/services/api'
import {
  clearAdminSession,
  getStoredAdminToken,
  verifyAdminSession,
} from '@/services/auth.service'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const [authState, setAuthState] = useState('checking')
  const [reason, setReason] = useState('')

  useEffect(() => {
    let isMounted = true

    const validateAdminSession = async () => {
      const token = getStoredAdminToken()
      if (!token) {
        if (isMounted) {
          setAuthState('unauthenticated')
        }
        return
      }

      try {
        await verifyAdminSession()
        if (isMounted) {
          setAuthState('authenticated')
        }
      } catch (error) {
        clearAdminSession()
        if (isMounted) {
          setReason(getErrorMessage(error, 'Admin session expired. Please sign in again.'))
          setAuthState('unauthenticated')
        }
      }
    }

    validateAdminSession().catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [location.pathname])

  if (authState === 'checking') {
    return (
      <section className="section-wrap pt-12 sm:pt-20">
        <LoadingState message="Verifying admin session..." cards={3} />
      </section>
    )
  }

  if (authState !== 'authenticated') {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
          reason,
        }}
      />
    )
  }

  return children
}

export default ProtectedRoute
