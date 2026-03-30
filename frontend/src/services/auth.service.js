import { api } from '@/services/api'

const ADMIN_TOKEN_KEY = 'portfolio_admin_token'
const ADMIN_USER_KEY = 'portfolio_admin_user'

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage)

const safeParse = (value) => {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export const getStoredAdminToken = () => {
  if (!canUseStorage()) {
    return ''
  }

  return localStorage.getItem(ADMIN_TOKEN_KEY) || ''
}

export const getStoredAdminUser = () => {
  if (!canUseStorage()) {
    return null
  }

  return safeParse(localStorage.getItem(ADMIN_USER_KEY))
}

export const storeAdminSession = ({ token, admin }) => {
  if (!canUseStorage()) {
    return
  }

  localStorage.setItem(ADMIN_TOKEN_KEY, token)
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(admin || {}))
}

export const clearAdminSession = () => {
  if (!canUseStorage()) {
    return
  }

  localStorage.removeItem(ADMIN_TOKEN_KEY)
  localStorage.removeItem(ADMIN_USER_KEY)
}

export const getAdminAuthHeaders = () => {
  const token = getStoredAdminToken()

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {}
}

export const loginAdmin = async (payload) => {
  const { data } = await api.post('/auth/login', payload)
  const token = data?.data?.token

  if (token) {
    storeAdminSession({
      token,
      admin: data?.data?.admin,
    })
  }

  return data
}

export const verifyAdminSession = async () => {
  const headers = getAdminAuthHeaders()
  const { data } = await api.get('/auth/verify', { headers })
  return data
}

export const logoutAdmin = () => {
  clearAdminSession()
}
