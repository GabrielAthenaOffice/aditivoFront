// ========================================
// src/lib/api.ts (VERIFICAR CONFIGURAÇÃO)
// ========================================
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para logs de debug (remover em produção)
api.interceptors.request.use(
  (config) => {
    console.log(`🔵 REQUEST: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params)
    return config
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log(`🟢 RESPONSE: ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error('❌ RESPONSE ERROR:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)
