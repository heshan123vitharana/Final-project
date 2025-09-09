import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(true)
  const [adminData, setAdminData] = useState(null)
  
  // Admin login form state
  const [adminFormData, setAdminFormData] = useState({ email: '', password: '' });
  const [adminLoginErrors, setAdminLoginErrors] = useState({});
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  // Check for existing admin session on app load
  useEffect(() => {
    const savedAdminData = sessionStorage.getItem('adminData')
    if (savedAdminData) {
      const admin = JSON.parse(savedAdminData)
      setAdminData(admin)
      setIsAdminLoginOpen(false)
    }
  }, [])

  // Handle admin login form input change
  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData((prev) => ({ ...prev, [name]: value }));
    setAdminLoginErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  // Handle admin login form submit
  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginErrors({});
    
    // Simple validation
    if (!adminFormData.email || !adminFormData.password) {
      setAdminLoginErrors({
        email: !adminFormData.email ? 'Email is required' : undefined,
        password: !adminFormData.password ? 'Password is required' : undefined,
      });
      setAdminLoginLoading(false);
      return;
    }
    
    try {
      // Use correct backend API route for admin login
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminFormData.email,
          password: adminFormData.password
        })
      });
      const result = await response.json();
      
      if (response.ok && result.message === 'Login successful') {
        setAdminData(result.admin);
        sessionStorage.setItem('adminData', JSON.stringify(result.admin));
        setIsAdminLoginOpen(false);
        setAdminFormData({ email: '', password: '' });
      } else {
        setAdminLoginErrors({ general: result.message || 'Login failed' });
      }
    } catch {
      setAdminLoginErrors({ general: 'Server error. Please try again.' });
    }
    setAdminLoginLoading(false);
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    sessionStorage.removeItem('adminData');
    setAdminData(null);
    setIsAdminLoginOpen(true);
  }

  // Handle successful admin login
  const handleAdminLogin = (data) => {
    setAdminData(data)
    sessionStorage.setItem('adminData', JSON.stringify(data));
    setIsAdminLoginOpen(false)
  }

  // Set page title
  useEffect(() => {
    if (adminData) {
      document.title = 'Admin Dashboard | PMB Sri Lanka';
    } else {
      document.title = 'Admin Login | PMB Sri Lanka';
    }
  }, [adminData]);

  return (
    <Router>
      <div className="min-h-screen bg-white relative">
        {/* Admin Dashboard */}
        {adminData && !isAdminLoginOpen && (
          <AdminDashboard adminData={adminData} onLogout={handleAdminLogout} />
        )}
        
        {/* Admin Login Modal */}
        {isAdminLoginOpen && (
          <AdminLogin
            onClose={() => setIsAdminLoginOpen(false)}
            onLogin={handleAdminLogin}
            isLoading={adminLoginLoading}
            errors={adminLoginErrors}
            formData={adminFormData}
            handleInputChange={handleAdminInputChange}
            handleSubmit={handleAdminLoginSubmit}
          />
        )}
      </div>
    </Router>
  )
}

export default App