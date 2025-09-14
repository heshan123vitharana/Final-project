import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AdminDashboard from './components/admin/AdminDashboard'

<<<<<<< HEAD
import { Suspense, lazy, memo, Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Lazy load components for better performance
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'))
const AdminLogin = lazy(() => import('./components/AdminLogin'))

// Loading component for Suspense
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
))

// Error Boundary component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">Please refresh the page to try again</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const App = memo(() => {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/" element={<AdminLogin />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  )
})

App.displayName = 'App'
LoadingSpinner.displayName = 'LoadingSpinner'

=======
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

>>>>>>> 04f545bdf77060208b211e0c0e429f712234081c
export default App