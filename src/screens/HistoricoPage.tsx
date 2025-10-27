// ========================================
// src/screens/HistoricoPage.tsx (EXEMPLO COM PAGINAÇÃO COMPLETA)
// ========================================
import { useState } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { useAditivos } from '@/hooks/useAditivo'
import AditivosTable from './components/AditivosTable'
import Pagination from './components/Pagination'
import { Card, Input } from './components/ui'

export default function HistoricoPage() {
  const [page, setPage] = useState(0)
  const [filtro, setFiltro] = useState('')
  const [busca, setBusca] = useState('')

  const { data, isLoading, isError } = useAditivos({
    page,
    size: 10,
    sortBy: 'criadoEm',
    sortDir: 'desc',
    filtroEmpresa: busca
  })

  const handleBuscar = () => {
    setBusca(filtro)
    setPage(0)
  }

  const handleLimpar = () => {
    setFiltro('')
    setBusca('')
    setPage(0)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Histórico de Aditivos</h1>
          <p className="text-ink-500 text-sm mt-1">
            Visualize e gerencie todos os aditivos criados
          </p>
        </div>

        <Card>
          <div className="flex gap-3 mb-4">
            <Input
              type="text"
              placeholder="Buscar por nome da empresa..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            />
            <button onClick={handleBuscar} className="btn-primary whitespace-nowrap">
              Buscar
            </button>
            {busca && (
              <button onClick={handleLimpar} className="btn">
                Limpar
              </button>
            )}
          </div>

          {isLoading && (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-brand-600 border-t-transparent"></div>
            </div>
          )}

          {isError && (
            <div className="py-8 text-center text-red-600">
              Erro ao carregar dados. Tente novamente.
            </div>
          )}

          {!isLoading && !isError && data && (
            <>
              <AditivosTable rows={data.content} />
              {data.totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={data.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
