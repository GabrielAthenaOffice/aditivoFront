// src/screens/components/AditivosTable.tsx

import { AditivoSimple } from '@/types'
import { ADITIVOS_DOWNLOAD } from '@/constants'
import { useDeleteAditivo } from '@/hooks/useAditivo'
import { useSecureDownload } from '@/hooks/useSecureDownload'
import { Trash2, Download, Loader2 } from 'lucide-react'

const buildDownloadUrl = (id: string): string => {
  const baseUrl = 'https://api-aditivo.onrender.com'
  const path = ADITIVOS_DOWNLOAD(id)
  return `${baseUrl}${path}`
}

export default function AditivosTable({
  rows,
  enableDelete = false,
}: {
  rows: AditivoSimple[]
  enableDelete?: boolean
}) {
  const del = useDeleteAditivo()
  const { download, isDownloading, error } = useSecureDownload()

  const onDelete = (id: string) => {
    if (!id) return
    const ok = window.confirm('Remover este aditivo? Essa ação não pode ser desfeita.')
    if (!ok) return
    del.mutate(id)
  }

  const onDownload = async (id: string, nomeEmpresa: string) => {
    const url = buildDownloadUrl(id)
    const filename = `aditivo_${nomeEmpresa.replace(/[^a-zA-Z0-9]/g, '_')}_${id}.docx`
    const success = await download(url, filename)
    
    if (!success && error?.includes('Sessão expirada')) {
      // Redireciona para login se sessão expirou
      window.location.href = '/login'
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
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
                <td>
                  <span className="badge">{r.status || '—'}</span>
                </td>
                <td className="text-xs text-ink-500">{r.aditivoId || '—'}</td>
                <td className="text-right flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="btn inline-flex items-center gap-2"
                    onClick={() => onDownload(r.aditivoId, r.nomeEmpresa)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    Baixar
                  </button>

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
    </div>
  )
}