// src/features/auth/api.ts
import { api } from '@/lib/api'

export type User = { id: string | number; nome: string; email: string }

export async function login(email: string, senha: string): Promise<User> {
  const { data } = await api.post('/auth/login', { email, senha })
  // backend retorna o userDTO no body e o cookie no header
  return data
}

export async function me(): Promise<User> {
  const { data } = await api.get('/auth/user')
  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/singout')
}
