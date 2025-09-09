import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  const [adminData] = useState({
    id: 1,
    username: 'admin',
    email: 'admin@pmb.gov.lk',
    status: 'active'
  })

  // Set page title
  useEffect(() => {
    document.title = 'Admin Dashboard | PMB Sri Lanka';
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white relative">
        {/* Admin Dashboard - Always visible */}
        <AdminDashboard adminData={adminData} onLogout={() => console.log('Logout clicked')} />
      </div>
    </Router>
  )
}

export default App