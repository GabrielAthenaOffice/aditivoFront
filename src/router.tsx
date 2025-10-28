import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import NewAditivoWizard from './screens/NewAditivoWizard'
import AditivosAll from './screens/AditivosAll'  // ⇐ adicione
import HistoricoPage from '@/screens/HistoricoPage'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/aditivos', element: <AditivosAll /> },          // ⇐ nova rota "Ver todos"
  { path: '/aditivos/novo', element: <NewAditivoWizard /> },
  { path: '/historico', element: <HistoricoPage /> },
])

export default router
