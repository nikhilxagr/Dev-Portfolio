import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getErrorMessage = (error, fallbackMessage) => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  if (error?.message) {
    return error.message
  }

  return fallbackMessage
}
