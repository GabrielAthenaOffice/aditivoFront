// src/screens/LoginPage.tsx
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as any
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [err, setErr] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null); setLoading(true)
    try {
      await login(email.trim(), senha)
      const to = loc?.state?.from?.pathname || '/'
      nav(to, { replace: true })
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4">Entrar</h1>

        <label className="block text-sm mb-1">E-mail</label>
        <input
          type="email"
          className="input w-full mb-3"
          placeholder="voce@empresa.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          autoFocus
        />

        <label className="block text-sm mb-1">Senha</label>
        <input
          type="password"
          className="input w-full mb-3"
          placeholder="••••••••"
          value={senha}
          onChange={(e)=>setSenha(e.target.value)}
        />

        {err && <div className="text-red-600 text-sm mb-3">{err}</div>}

        <button className="btn-primary w-full" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
