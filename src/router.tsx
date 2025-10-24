import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import NewAditivoWizard from './screens/NewAditivoWizard'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/aditivos/novo', element: <NewAditivoWizard /> },
])

export default router
