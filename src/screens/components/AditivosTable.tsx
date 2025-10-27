// src/screens/components/AditivosTable.tsx
import { AditivoSimple } from '@/types'
import { ADITIVOS_DOWNLOAD } from '@/constants'
import { useDeleteAditivo } from '@/hooks/useAditivo' // ← singular
import { Trash2 } from 'lucide-react'

const buildDownloadUrl = (id: string): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const path = ADITIVOS_DOWNLOAD(id)
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBaseUrl}${cleanPath}`
}

export default function AditivosTable({
  rows,
  enableDelete = false,
}: {
  rows: AditivoSimple[]
  enableDelete?: boolean
}) {
  const del = useDeleteAditivo()

  const onDelete = (id: string) => {
    if (!id) return
    const ok = window.confirm('Remover este aditivo? Essa ação não pode ser desfeita.')
    if (!ok) return
    del.mutate(id)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-ink-500">
          <tr className="[&>th]:py-2 [&>th]:px-2">
            <th>ID Empresa</th>
            <th>Nome da Empresa</th>
            <th>Status</th>
            <th>ID Aditivo</th>
            <th className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.length === 0 && (
            <tr>
              <td className="py-6 text-center text-ink-500" colSpan={5}>
                Sem aditivos.
              </td>
            </tr>
          )}

          {rows.map((r) => (
            <tr key={r.aditivoId} className="[&>td]:py-2 [&>td]:px-2">
              <td className="font-medium">{r.empresaId ?? '—'}</td>
              <td>{r.nomeEmpresa || '—'}</td>
              <td><span className="badge">{r.status || '—'}</span></td>
              <td className="text-xs text-ink-500">{r.aditivoId || '—'}</td>
              <td className="text-right flex items-center justify-end gap-2">
                <a
                  className="btn"
                  href={buildDownloadUrl(r.aditivoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Baixar
                </a>

                {enableDelete && (
                  <button
                    type="button"
                    className="btn-danger inline-flex items-center gap-1"
                    onClick={() => onDelete(r.aditivoId)}
                    disabled={del.isPending}
                    aria-label="Excluir aditivo"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
