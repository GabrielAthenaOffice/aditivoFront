// src/screens/AditivosAll.tsx
import { useEffect, useState } from 'react'
import DashboardLayout from '@/layouts/DashboardLayout'
import { useAditivos } from '@/hooks/useAditivo'
import AditivosTable from '@/screens/components/AditivosTable'
import Pagination from '@/screens/components/Pagination'

export default function AditivosAll() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [filtroInput, setFiltroInput] = useState('')
  const [filtro, setFiltro] = useState('') // valor “debounced”

  useEffect(() => {
    const t = setTimeout(() => { setPage(0); setFiltro(filtroInput) }, 350)
    return () => clearTimeout(t)
  }, [filtroInput])

  const { data, isLoading, isError } = useAditivos({ page, size, filtroEmpresa: filtro })

  return (
    <DashboardLayout>
      <div className="section">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Aditivos</h2>
          <input
            placeholder="Filtrar por nome da empresa…"
            className="input max-w-xs"
            value={filtroInput}
            onChange={(e) => setFiltroInput(e.target.value)}
          />
        </div>

        {isLoading && <p className="text-sm text-ink-500 mt-2">Carregando…</p>}
        {isError && <p className="text-sm text-red-600 mt-2">Erro ao carregar.</p>}

        {data && (
          <>
            <div className="mt-3">
              <AditivosTable rows={data.content || []} />
            </div>

            {/* sem paginação quando há filtro por nome */}
            {!filtro && (
              <Pagination
                page={data.pageNumber}
                pageSize={size}
                totalPages={data.totalPages}
                totalElements={data.totalElements}
                onPageChange={setPage}
                onPageSizeChange={(s) => { setPage(0); setSize(s) }}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
