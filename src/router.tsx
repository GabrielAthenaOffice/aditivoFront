// src/router.tsx
import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '@/features/auth/protectedRoute'
import App from './App'
import NewAditivoWizard from './screens/NewAditivoWizard'
import AditivosAll from './screens/AditivosAll'
import HistoricoPage from './screens/HistoricoPage'
import LoginPage from './screens/LoginPage'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    element: <ProtectedRoute />, // tudo abaixo exige login
    children: [
      { path: '/', element: <App /> },
      { path: '/aditivos', element: <AditivosAll /> },
      { path: '/aditivos/novo', element: <NewAditivoWizard /> },
      { path: '/historico', element: <HistoricoPage /> },
    ],
  },
])

export default router
