import { useState, useEffect } from 'react'

const MillDashboard = ({ userData, onStartPMBRegistration, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [registrationStatus, setRegistrationStatus] = useState('not_started') // not_started, in_progress, completed

  useEffect(() => {
    // Check if user has started PMB registration
    const savedStatus = localStorage.getItem(`pmb_registration_${userData.id}`)
    if (savedStatus) {
      setRegistrationStatus(savedStatus)
    }
  }, [userData.id])

  const dashboardStats = [
    {
      title: 'Total Orders',
      value: '45',
      change: '+12%',
      icon: '📦',
      color: 'emerald'
    },
    {
      title: 'Revenue',
      value: 'LKR 2.5M',
      change: '+8%',
      icon: '💰',
      color: 'blue'
    },
    {
      title: 'Active Contracts',
      value: '12',
      change: '+3',
      icon: '📋',
      color: 'purple'
    },
    {
      title: 'PMB License',
      value: registrationStatus === 'completed' ? 'Active' : 'Pending',
      change: registrationStatus === 'completed' ? 'Verified' : 'Action Required',
      icon: '🏆',
      color: registrationStatus === 'completed' ? 'green' : 'orange'
    }
  ]

  const recentOrders = [
    { id: 'ORD-001', customer: 'ABC Traders', amount: 'LKR 150,000', status: 'Processing', date: '2025-08-05' },
    { id: 'ORD-002', customer: 'XYZ Distributors', amount: 'LKR 225,000', status: 'Completed', date: '2025-08-04' },
    { id: 'ORD-003', customer: 'Local Market', amount: 'LKR 75,000', status: 'Pending', date: '2025-08-03' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handlePMBRegistration = () => {
    setRegistrationStatus('in_progress')
    localStorage.setItem(`pmb_registration_${userData.id}`, 'in_progress')
    onStartPMBRegistration()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mill Dashboard</h1>
                <p className="text-sm text-gray-600">{userData.businessName}</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userData.firstName} {userData.lastName}</p>
                <p className="text-xs text-gray-600">{userData.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.firstName}! 👋
          </h2>
          <p className="text-lg text-gray-600">
            Manage your rice mill operations and connect with PMB Sri Lanka
          </p>
        </div>

        {/* PMB Registration Alert */}
        {registrationStatus !== 'completed' && (
          <div className="mb-8 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-900 mb-2">
                  {registrationStatus === 'not_started' ? 'Get Your PMB License' : 'Complete Your PMB Registration'}
                </h3>
                <p className="text-emerald-700 mb-4">
                  {registrationStatus === 'not_started' 
                    ? 'Register with Paddy Marketing Board to unlock premium features, better rates, and official recognition.'
                    : 'You have started your PMB registration. Complete the process to get your official license.'
                  }
                </p>
                <button
                  onClick={handlePMBRegistration}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  {registrationStatus === 'not_started' ? 'Start PMB Registration' : 'Continue Registration'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{stat.icon}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 
                  stat.change === 'Action Required' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'orders', name: 'Orders', icon: '📦' },
                { id: 'inventory', name: 'Inventory', icon: '🏪' },
                { id: 'contracts', name: 'Contracts', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                          <td className="py-3 px-4 text-gray-700">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-900 font-semibold">{order.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
                <p className="text-gray-600">Manage your rice orders and track shipments</p>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Inventory Management</h3>
                <p className="text-gray-600">Track your rice stock and manage inventory levels</p>
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Contract Management</h3>
                <p className="text-gray-600">View and manage your PMB contracts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MillDashboard
