// src/features/auth/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return <div className="p-8 text-center">Carregando…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />
  return <Outlet />
}
