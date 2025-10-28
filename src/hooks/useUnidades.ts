// src/hooks/useUnidades.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export type UnidadeDTO = {
  unidadeNome: string
  unidadeCnpj: string
  unidadeEndereco: string
}

export function useListaUnidades() {
  return useQuery({
    queryKey: ['unidades'],
    queryFn: async (): Promise<string[]> => {
      const { data } = await api.get('/unidades')
      return data
    },
    staleTime: 5 * 60_000,
  })
}

export function useUnidade(nome?: string) {
  return useQuery({
    enabled: !!nome,
    queryKey: ['unidade', nome],
    queryFn: async (): Promise<UnidadeDTO> => {
      const { data } = await api.get(`/unidades/${encodeURIComponent(nome!)}`)
      return data
    },
    staleTime: 5 * 60_000,
  })
}
