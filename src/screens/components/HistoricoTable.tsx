import { HistoricoItem } from '@/types'

export default function HistoricoTable({ rows }: { rows: HistoricoItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-ink-500">
          <tr className="[&>th]:py-2 [&>th]:px-2">
            <th>ID</th>
            <th>Empresa ID</th>
            <th>Empresa</th>
            <th>Aditivo ID</th>
            <th>Status</th>
            <th>Mensagem</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.length === 0 && (
            <tr><td colSpan={6} className="py-6 text-center text-ink-500">Sem registros.</td></tr>
          )}
          {rows.map((r) => (
            <tr key={r.id} className="[&>td]:py-2 [&>td]:px-2">
              <td className="text-xs text-ink-500">{r.id}</td>
              <td className="font-medium">{r.empresaId || '—'}</td>
              <td>{r.empresaNome || '—'}</td>
              <td className="text-xs text-ink-500">{r.aditivoId || '—'}</td>
              <td><span className="badge">{r.status || '—'}</span></td>
              <td className="max-w-[420px] truncate" title={r.mensagem}>{r.mensagem || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
