import { SetStateAction, useEffect, useState } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { useHistorico } from '@/hooks/useHistorico'
import HistoricoTable from '@/screens/components/HistoricoTable'
import Pagination from '@/screens/components/Pagination'
import { Card, Input } from '@/screens/components/ui'

export default function HistoricoPage() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [filtroInput, setFiltroInput] = useState('')
  const [filtro, setFiltro] = useState('')

  useEffect(() => {
    const t = setTimeout(() => { setPage(0); setFiltro(filtroInput) }, 350)
    return () => clearTimeout(t)
  }, [filtroInput])

  const { data, isLoading, isError } = useHistorico({
    page, size, sortBy: 'criadoEm', sortDir: 'desc', filtroEmpresa: filtro
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Histórico de Aditivos</h1>
          <p className="text-ink-500 text-sm mt-1">Eventos gerados pelo processamento dos aditivos.</p>
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Input
              type="text"
              placeholder="Buscar por nome da empresa…"
              value={filtroInput}
              onChange={(e: { target: { value: SetStateAction<string> } }) => setFiltroInput(e.target.value)}
            />
          </div>

          {isLoading && <div className="py-12 text-center">Carregando…</div>}
          {isError &&   <div className="py-8 text-center text-red-600">Erro ao carregar.</div>}

          {!isLoading && !isError && data && (
            <>
              <HistoricoTable rows={data.content || []} />

              {/* Sem paginação quando há filtro por nome (endpoint retorna lista simples) */}
              {!filtro && (
                <Pagination
                  page={data.pageNumber}
                  pageSize={size}                 // <- use o estado
                  totalPages={data.totalPages}
                  totalElements={data.totalElements ?? 0}
                  onPageChange={setPage}
                  onPageSizeChange={(s) => { setPage(0); setSize(s) }}
                />
              )}
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
