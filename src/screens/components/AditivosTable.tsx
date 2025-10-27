// ========================================
// src/screens/components/AditivosTable.tsx
// ========================================
import { AditivoSimple } from '@/types'
import { ADITIVOS_DOWNLOAD } from '@/constants'

const buildDownloadUrl = (id: string): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const path = ADITIVOS_DOWNLOAD(id)
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBaseUrl}${cleanPath}`
}

export default function AditivosTable({ rows }: { rows: AditivoSimple[] }) {
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
              <td className="font-medium">{r.empresaId}</td>
              <td>{r.nomeEmpresa || '—'}</td>
              <td>
                <span className="badge">{r.status || '—'}</span>
              </td>
              <td className="text-xs text-ink-500">{r.aditivoId}</td>
              <td className="text-right">
                <a
                  className="btn"
                  href={buildDownloadUrl(r.aditivoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Baixar
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
