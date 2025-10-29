// src/features/auth/useAuth.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, me, logout as apiLogout, type User } from './api'

type AuthCtx = {
  user: User | null
  loading: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
}

const Ctx = createContext<AuthCtx>({} as any)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // hidrata sessão se já houver cookie
    me().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const doLogin = async (email: string, senha: string) => {
    const u = await apiLogin(email, senha)
    setUser(u)
  }

  const doLogout = async () => {
    await apiLogout()
    setUser(null)
  }

  return (
    <Ctx.Provider value={{ user, loading, login: doLogin, logout: doLogout }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  return useContext(Ctx)
}
