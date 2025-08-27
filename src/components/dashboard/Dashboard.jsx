import React, { useState } from 'react';
// All imports must be at the top before any class/function declarations
import MetricCard from './MetricCard';
import MarketPriceCard from './MarketPriceCard';
import CollectionCenterCard from './CollectionCenterCard';
import OrderRow from './OrderRow';
import QuickActionButton from './QuickActionButton';
import LanguageSelector from './LanguageSelector';
import useLanguage from '../../hooks/useLanguage';
import useDashboardData from '../../hooks/useDashboardData';
import { formatCurrency, formatWeight } from '../../utils/formatters';
import { DollarSign, Package, Users, CheckCircle, TrendingUp, Truck, BarChart3, Settings, Eye, Plus, Download, Edit, XCircle } from 'lucide-react';

// Simple Error Boundary for dashboard
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    // You can log error here
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong in the Dashboard.</h2>
          <p className="text-red-600 mb-4">Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const DashboardContent = ({ userData, onBackToHome }) => {
  // Move hooks to top level
  const { language, setLanguage, t } = useLanguage();
  const { data, loading, error, refreshData } = useDashboardData();
  const [showRegistration, setShowRegistration] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Example stub for RegistrationForm usage
  // You can import and use your RegistrationForm component here
  // const RegistrationForm = ...

  // Conditional rendering for registration
  if (showRegistration) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setShowRegistration(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {/* Back Icon */}
              <span>Back to Dashboard</span>
            </button>
            <LanguageSelector language={language} setLanguage={setLanguage} />
          </div>
          {/* Registration form goes here */}
        </div>
      </div>
    );
  }

  // Main dashboard layout (restored)
  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      <div className="flex w-full">
        {/* Sidebar - Fixed */}
  <div className="text-white transition-all duration-300 flex flex-col fixed left-0 top-0 h-screen w-64 z-30" style={{background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)'}}>
          <div className="absolute inset-0 bg-emerald-900 bg-opacity-30"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl text-white drop-shadow-lg">Mill Dashboard</h2>
                <button className="text-white hover:text-emerald-200 transition-colors drop-shadow-lg" onClick={onBackToHome}>←</button>
              </div>
            </div>
            <nav className="flex-1 mt-8 overflow-y-auto">
              {[{ id: 'dashboard', label: t('dashboard'), icon: BarChart3 }, { id: 'orders', label: t('orders'), icon: Package }, { id: 'inventory', label: t('inventory'), icon: Package }, { id: 'collections', label: t('collections'), icon: Truck }, { id: 'analytics', label: t('analytics'), icon: TrendingUp }, { id: 'settings', label: t('settings'), icon: Settings }].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-white hover:bg-opacity-15 transition-colors backdrop-blur-sm ${activeTab === tab.id ? 'bg-white bg-opacity-20 border-r-4 border-yellow-400 shadow-lg' : ''}`}
                  >
                    <IconComponent size={20} className="drop-shadow-lg" />
                    <span className="ml-3 drop-shadow-lg">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        {/* Main Content */}
  <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-64" style={{maxWidth: 'calc(100vw - 16rem)'}}>
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">{[{ id: 'dashboard', label: t('dashboard') }, { id: 'orders', label: t('orders') }, { id: 'inventory', label: t('inventory') }, { id: 'collections', label: t('collections') }, { id: 'analytics', label: t('analytics') }, { id: 'settings', label: t('settings') }].find(tab => tab.id === activeTab)?.label}</h1>
              <div className="flex items-center space-x-4">
                <LanguageSelector language={language} setLanguage={setLanguage} />
                <div className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</div>
                <span className="text-sm font-medium text-gray-900">{userData?.firstName || 'User'}</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl text-white p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{t('welcome')}</h2>
                  <p className="text-emerald-100">Monitor your mill operations and track market trends in real-time</p>
                </div>
                <div className="hidden md:block">
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                  >
                    Register New Mill
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={refreshData}
                    className="ml-auto text-red-600 hover:text-red-800 underline"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard icon={DollarSign} title={t('totalRevenue')} value={formatCurrency(data.metrics.totalRevenue)} subtitle="This month" trend={12.5} color="emerald" />
              <MetricCard icon={Package} title={t('paddyProcessed')} value={formatWeight(data.metrics.paddyProcessed)} subtitle="This month" trend={8.2} color="emerald" />
              <MetricCard icon={Users} title={t('activeContracts')} value={data.metrics.activeContracts.toString()} subtitle="Current active" trend={5.1} color="emerald" />
              <MetricCard icon={CheckCircle} title={t('completedOrders')} value={data.metrics.completedOrders.toString()} subtitle="This month" trend={15.3} color="emerald" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{t('liveMarketPrices')}</h3>
                      <button
                        onClick={refreshData}
                        disabled={loading}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                            <span>Updating...</span>
                          </div>
                        ) : (
                          'Refresh Prices'
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.marketPrices.map((price) => (
                        <MarketPriceCard
                          key={price.variety}
                          variety={price.variety}
                          price={price.price}
                          change={price.change}
                          trend={price.trend}
                          t={t}
                          Icon={TrendingUp}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{t('recentOrders')}</h3>
                      <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                        View All Orders
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variety</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {data.recentOrders.map((order) => (
                          <OrderRow key={order.id} order={order} t={t} StatusIcon={CheckCircle} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">{t('quickActions')}</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <QuickActionButton icon={Plus} label={t('newOrder')} onClick={() => console.log('New Order')} primary />
                      <QuickActionButton icon={Eye} label={t('viewInventory')} onClick={() => console.log('View Inventory')} />
                      <QuickActionButton icon={Download} label={t('downloadReport')} onClick={() => console.log('Download Report')} />
                      <QuickActionButton icon={Edit} label={t('manageContracts')} onClick={() => console.log('Manage Contracts')} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">{t('nearbyCollectionCenters')}</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {data.collectionCenters.map((center) => (
                        <CollectionCenterCard key={center.id} center={center} t={t} StatusIcon={CheckCircle} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
  // ...existing main dashboard JSX (already present in previous code)...
}

const Dashboard = (props) => (
  <ErrorBoundary>
    <DashboardContent {...props} />
  </ErrorBoundary>
);

export default Dashboard;
