import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { HistoricoItem, HistoricoPage } from '@/types'
import { HIST_LIST, HIST_SEARCH_BY_NOME } from '@/constants'

const norm = (x: unknown): HistoricoItem[] => Array.isArray(x) ? x as HistoricoItem[] : []

export function useHistorico(params: {
  page: number
  size: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  filtroEmpresa?: string
}) {
  const { page, size, sortBy = 'criadoEm', sortDir = 'desc', filtroEmpresa } = params

  return useQuery({
    queryKey: ['historico', page, size, sortBy, sortDir, filtroEmpresa || ''],
    queryFn: async (): Promise<HistoricoPage> => {
      // busca por nome → endpoint retorna List<HistoricoResponseDTO>
      if (filtroEmpresa?.trim()) {
        try {
            const nome = encodeURIComponent(filtroEmpresa.trim())
            const { data } = await api.get(HIST_SEARCH_BY_NOME(nome))
            const content = norm(data)
          return {
            content,
            pageNumber: 0,
            pageSize: content.length,
            totalElements: content.length,
            totalPages: 1,
            lastPage: true,
          }
        } catch (e: any) {
          // 404/500 → retorna vazio (evita quebrar tela)
          return { content: [], pageNumber: 0, pageSize: 0, totalElements: 0, totalPages: 1, lastPage: true }
        }
      }

      // paginação normal
      const { data } = await api.get<HistoricoPage>(HIST_LIST, {
        params: { pageNumber: page, pageSize: size, sortBy, sortOrder: sortDir },
      })
      return data
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  })
}
