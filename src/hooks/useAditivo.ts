// src/hooks/useAditivo.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AditivoPage, AditivoSimple } from '@/types'
import { ADITIVOS_LIST, ADITIVOS_SEARCH_BY_NOME } from '@/constants'

const normalize = (input: unknown): AditivoSimple[] => {
  if (input && typeof input === 'object' && 'content' in (input as any)) {
    const c = (input as any).content
    return Array.isArray(c) ? (c as AditivoSimple[]) : []
  }
  if (Array.isArray(input)) return input as AditivoSimple[]
  return []
}

export function useAditivos(params: { page: number; size: number; filtroEmpresa?: string }) {
  const { page, size, filtroEmpresa } = params

  return useQuery({
    queryKey: ['aditivos', page, size, filtroEmpresa || ''],
    queryFn: async (): Promise<AditivoPage> => {
      if (filtroEmpresa && filtroEmpresa.trim()) {
        const { data } = await api.get(ADITIVOS_SEARCH_BY_NOME(encodeURIComponent(filtroEmpresa.trim())))
        const content = normalize(data)
        return {
          content,
          pageNumber: 0,
          pageSize: content.length,
          totalElements: content.length,
          totalPages: 1,
          lastPage: true,
        }
      }

      const { data } = await api.get<AditivoPage>(ADITIVOS_LIST, {
        params: { pageNumber: page, pageSize: size, sortBy: 'empresaId', sortOrder: 'desc' },
      })
      return { ...data, content: normalize(data) }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  })
}

// DELETE /aditivos/empresa/deletar-aditivo/{id}
export function useDeleteAditivo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (aditivoId: string) => {
      if (!aditivoId) throw new Error('ID inválido')
      await api.delete(`/aditivos/empresa/deletar-aditivo/${aditivoId}`)
    },
    onSuccess: () => {
      // Recarrega quaisquer listas de aditivos (dashboard e /aditivos)
      qc.invalidateQueries({ queryKey: ['aditivos'] })
    },
  })
}
