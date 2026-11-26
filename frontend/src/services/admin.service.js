import { api } from '@/services/api'
import { getAdminAuthHeaders } from '@/services/auth.service'

const withAdminHeaders = () => ({
  headers: getAdminAuthHeaders(),
})

export const getAdminProjects = async (params = {}) => {
  const { data } = await api.get('/projects', {
    ...withAdminHeaders(),
    params: { includeDrafts: 'true', limit: 100, ...params },
  })
  return data
}

export const createAdminProject = async (payload) => {
  const { data } = await api.post('/projects', payload, withAdminHeaders())
  return data
}

export const updateAdminProject = async (idOrSlug, payload) => {
  const { data } = await api.put(`/projects/${encodeURIComponent(idOrSlug)}`, payload, withAdminHeaders())
  return data
}

export const deleteAdminProject = async (idOrSlug) => {
  const { data } = await api.delete(`/projects/${encodeURIComponent(idOrSlug)}`, withAdminHeaders())
  return data
}

export const getAdminBlogs = async (params = {}) => {
  const { data } = await api.get('/blogs', {
    ...withAdminHeaders(),
    params: { includeDrafts: 'true', limit: 100, ...params },
  })
  return data
}

export const createAdminBlog = async (payload) => {
  const { data } = await api.post('/blogs', payload, withAdminHeaders())
  return data
}

export const updateAdminBlog = async (idOrSlug, payload) => {
  const { data } = await api.put(`/blogs/${encodeURIComponent(idOrSlug)}`, payload, withAdminHeaders())
  return data
}

export const deleteAdminBlog = async (idOrSlug, params = {}) => {
  const { data } = await api.delete(`/blogs/${encodeURIComponent(idOrSlug)}`, {
    ...withAdminHeaders(),
    params,
  })
  return data
}

export const getAdminJourney = async (params = {}) => {
  const { data } = await api.get('/journey', {
    ...withAdminHeaders(),
    params: { includeDrafts: 'true', ...params },
  })
  return data
}

export const createAdminJourney = async (payload) => {
  const { data } = await api.post('/journey', payload, withAdminHeaders())
  return data
}

export const updateAdminJourney = async (idOrKey, payload) => {
  const { data } = await api.put(`/journey/${encodeURIComponent(idOrKey)}`, payload, withAdminHeaders())
  return data
}

export const deleteAdminJourney = async (idOrKey, params = {}) => {
  const { data } = await api.delete(`/journey/${encodeURIComponent(idOrKey)}`, {
    ...withAdminHeaders(),
    params,
  })
  return data
}

export const updateAdminSiteContent = async (sections) => {
  const { data } = await api.put('/site-content', { sections }, withAdminHeaders())
  return data
}

export const getAdminUsers = async (params = {}) => {
  const { data } = await api.get('/admin/users', {
    ...withAdminHeaders(),
    params,
  })
  return data
}

export const updateAdminUser = async (id, payload) => {
  const { data } = await api.patch(`/admin/users/${id}`, payload, withAdminHeaders())
  return data
}

export const deleteAdminUser = async (id) => {
  const { data } = await api.delete(`/admin/users/${id}`, withAdminHeaders())
  return data
}

export const getAdminContacts = async (params = {}) => {
  const { data } = await api.get('/admin/contacts', {
    ...withAdminHeaders(),
    params,
  })
  return data
}

export const markAdminContactAsRead = async (id) => {
  const { data } = await api.patch(`/admin/contacts/${id}/read`, {}, withAdminHeaders())
  return data
}

export const deleteAdminContact = async (id) => {
  const { data } = await api.delete(`/admin/contacts/${id}`, withAdminHeaders())
  return data
}

export const getAdminOverview = async (params = {}) => {
  const { data } = await api.get('/admin/overview', {
    ...withAdminHeaders(),
    params,
  })
  return data
}

export const getAdminPaymentsHistory = async (params = {}) => {
  const { data } = await api.get('/admin/payments', {
    ...withAdminHeaders(),
    params,
  })
  return data
}

export const getAdminSystemStatus = async () => {
  const { data } = await api.get('/admin/system-status', withAdminHeaders())
  return data
}
