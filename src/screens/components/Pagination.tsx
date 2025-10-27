// src/screens/components/Pagination.tsx
export default function Pagination({
  page, pageSize, totalPages, totalElements,
  onPageChange, onPageSizeChange,
}: {
  page: number
  pageSize: number
  totalPages: number
  totalElements: number
  onPageChange: (p: number)=>void
  onPageSizeChange: (s: number)=>void
}) {
  return (
    <div className="flex items-center justify-between mt-3 gap-4">
      <div className="text-xs text-ink-500">
        Página {page + 1} de {Math.max(totalPages, 1)} • {totalElements} itens
      </div>

      <div className="flex items-center gap-2">
        <select
          className="input"
          value={pageSize}
          onChange={(e)=> onPageSizeChange(Number(e.target.value))}
        >
          {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <button className="btn" disabled={page<=0} onClick={()=>onPageChange(0)}>«</button>
        <button className="btn" disabled={page<=0} onClick={()=>onPageChange(page-1)}>Anterior</button>
        <button className="btn" disabled={page>=totalPages-1} onClick={()=>onPageChange(page+1)}>Próxima</button>
        <button className="btn" disabled={page>=totalPages-1} onClick={()=>onPageChange(totalPages-1)}>»</button>
      </div>
    </div>
  )
}
