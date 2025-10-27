// src/hooks/useAditivos.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AditivoPage } from '@/types'
import { ADITIVOS_LIST, ADITIVOS_SEARCH_BY_NOME } from '@/constants'

export function useAditivos({ page, size = 10, filtroEmpresa = '' }: {
  page: number; size?: number; filtroEmpresa?: string
}) {
  const filtro = filtroEmpresa.trim()

  return useQuery({
    queryKey: ['aditivos', page, size, filtro],
    queryFn: async (): Promise<AditivoPage> => {
      if (filtro) {
        const { data } = await api.get(ADITIVOS_SEARCH_BY_NOME(filtro))
        // backend retorna List<AditivoSimpleResponseDTO>; empacotamos num AditivoPage “fake”
        return {
          content: data ?? [],
          pageNumber: 0,
          pageSize: (data ?? []).length,
          totalElements: (data ?? []).length,
          totalPages: 1,
          lastPage: true,
        }
      }
      const { data } = await api.get<AditivoPage>(ADITIVOS_LIST, {
        params: { pageNumber: page, pageSize: size, sortBy: 'empresaId', sortOrder: 'desc' },
      })
      return data
    },
    staleTime: 60_000,
    placeholderData: (prev) => prev, // v5 (substitui keepPreviousData)
  })
}
