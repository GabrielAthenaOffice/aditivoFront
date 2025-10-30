// ========================================
// src/lib/api.ts (VERIFICAR CONFIGURAÇÃO)
// ========================================
import axios from 'axios'

const baseURL = 'https://api-aditivo.onrender.com';


export const api = axios.create({
  baseURL: "/api" , // <- USAR PROXY DO VITE
  withCredentials: true,            // <- LIGA ISSO
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
