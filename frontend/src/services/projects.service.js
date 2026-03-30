import { api } from '@/services/api'

export const getProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params })
  return data
}

export const getProjectBySlug = async (slug) => {
  const { data } = await api.get(`/projects/${slug}`)
  return data
}
