import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  // Set page title
  useEffect(() => {
    document.title = 'Admin Dashboard | PMB Sri Lanka';
  }, []);

  // Simple logout handler (optional - can be removed if not needed)
  const handleAdminLogout = () => {
    console.log('Logout clicked');
    // You can add logout logic here if needed
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AdminDashboard onLogout={handleAdminLogout} />
      </div>
    </Router>
  )
}

export default App