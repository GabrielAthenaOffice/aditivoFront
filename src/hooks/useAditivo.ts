// src/hooks/useAditivo.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { AditivoPage, AditivoSimple } from '@/types'
import { ADITIVOS_LIST, ADITIVOS_SEARCH_BY_NOME } from '@/constants'

const normalize = (input: unknown): AditivoSimple[] => {
  // se vier como { content: [...] }
  if (input && typeof input === 'object' && 'content' in (input as any)) {
    const c = (input as any).content
    return Array.isArray(c) ? c as AditivoSimple[] : []
  }
  // se a API (ou vc) já retornou um array direto
  if (Array.isArray(input)) return input as AditivoSimple[]
  return []
}

export function useAditivos(params: { page: number; size: number; filtroEmpresa?: string }) {
  const { page, size, filtroEmpresa } = params

  return useQuery({
    queryKey: ['aditivos', page, size, filtroEmpresa || ''],
    queryFn: async (): Promise<AditivoPage> => {
      // filtro por nome: endpoint retorna List<AditivoSimpleResponseDTO>
      if (filtroEmpresa && filtroEmpresa.trim()) {
        const { data } = await api.get(ADITIVOS_SEARCH_BY_NOME(filtroEmpresa.trim()))
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

      // paginação normal
      const { data } = await api.get<AditivoPage>(ADITIVOS_LIST, {
        params: { pageNumber: page, pageSize: size, sortBy: 'empresaId', sortOrder: 'desc' },
      })
      return {
        ...data,
        content: normalize(data), // garante array
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  })
}
