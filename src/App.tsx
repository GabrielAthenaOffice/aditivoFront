import { Link } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'

export default function App() {
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
          <Link to="/aditivos/novo" className="text-sm text-brand-700 hover:underline">Novo</Link>
        </div>
        <p className="text-sm text-ink-500 mt-2">Em breve: tabela com paginação.</p>
      </div>
    </DashboardLayout>
  )
}
