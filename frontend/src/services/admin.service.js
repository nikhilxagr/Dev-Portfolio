import { api } from '@/services/api'
import { getAdminAuthHeaders } from '@/services/auth.service'

const withAdminHeaders = () => ({
  headers: getAdminAuthHeaders(),
})

export const createAdminProject = async (payload) => {
  const { data } = await api.post('/projects', payload, withAdminHeaders())
  return data
}

export const updateAdminProject = async (id, payload) => {
  const { data } = await api.put(`/projects/${id}`, payload, withAdminHeaders())
  return data
}

export const deleteAdminProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`, withAdminHeaders())
  return data
}

export const createAdminBlog = async (payload) => {
  const { data } = await api.post('/blogs', payload, withAdminHeaders())
  return data
}

export const updateAdminBlog = async (id, payload) => {
  const { data } = await api.put(`/blogs/${id}`, payload, withAdminHeaders())
  return data
}

export const deleteAdminBlog = async (id) => {
  const { data } = await api.delete(`/blogs/${id}`, withAdminHeaders())
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
