import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
<<<<<<< HEAD
import App from './App.jsx'

// Import i18n configuration
import './i18n/i18n.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
=======
import AdminDashboard from './components/admin/AdminDashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminDashboard />
>>>>>>> 11172fac6621c27fbbff6f642c33a7a2ab704aeb
  </StrictMode>,
)
