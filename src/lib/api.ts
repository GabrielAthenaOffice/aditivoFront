// ========================================
// src/lib/api.ts (VERIFICAR CONFIGURAÇÃO)
// ========================================
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL,
  withCredentials: true,            // <- LIGA ISSO
  headers: { 'Content-Type': 'application/json' },
})

// (opcional) logs – cuidado pra não vazar dados em prod
api.interceptors.request.use((config) => {
  console.log(`🔵 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params)
  return config
})
api.interceptors.response.use(
  (res) => { console.log(`🟢 ${res.config.url}`, res.data); return res },
  (err) => { console.error('❌', err.response?.data || err.message); return Promise.reject(err) }
)
