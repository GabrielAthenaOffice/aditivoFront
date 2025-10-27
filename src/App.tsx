// ========================================
// src/App.tsx
// ========================================
import { Link } from 'react-router-dom'
import { useState } from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import AditivosTable from '@/screens/components/AditivosTable'
import Pagination from '@/screens/components/Pagination'
import { useAditivos } from '@/hooks/useAditivo'

export default function App() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10) // padrão 10
  const { data, isLoading, isError } = useAditivos({ page, size })

  return (
    <DashboardLayout>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="section">
          <div className="title">Ações</div>
          <div className="mt-3 flex gap-2">
            <Link to="/aditivos/novo" className="btn-primary">Criar aditivo</Link>
          </div>
        </div>

        <div className="section">
          <div className="title">Atalhos</div>
          <div className="mt-3">
            <Link className="text-brand-700 hover:underline" to="/historico">Ver histórico</Link>
          </div>
        </div>

        <div className="section">
          <div className="title">Status do sistema</div>
          <div className="mt-3"><span className="badge">Tudo ok</span></div>
        </div>
      </div>

      <div className="section mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Últimos aditivos</h2>
          <Link to="/aditivos" className="text-sm text-brand-700 hover:underline">Ver todos</Link>
        </div>

        {isLoading && <p className="text-sm text-ink-500 mt-2">Carregando…</p>}
        {isError && <p className="text-sm text-red-600 mt-2">Erro ao carregar.</p>}

        {data && (
          <>
            <div className="mt-3">
              <AditivosTable rows={data.content || []} />
            </div>

            <Pagination
              page={data.pageNumber}
              pageSize={size}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              onPageChange={(p) => setPage(p)}
              onPageSizeChange={(s) => { setPage(0); setSize(s) }}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
