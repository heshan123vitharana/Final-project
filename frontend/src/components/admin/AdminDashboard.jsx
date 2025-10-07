import { useState } from 'react'
import { 
  FileText, 
  BarChart3, 
  Map, 
  FileBarChart, 
  DollarSign, 
  Menu, 
  X,
  LogOut,
  Image as GalleryIcon 
} from 'lucide-react';
import LicenseRequestManagement from './LicenseRequestManagement'
import StockDashboard from './StockDashboard'
import MillMap from './MillMap'
import Reports from './Reports'
import PriceManagement from './UpdatePrice'
import ImageGalleryManager from './ImageGalleryManager';
import rainbowNature from '../../assets/beautiful-rainbow-nature.jpg'
import pmbLogo from '../../assets/logo-p.png'
import { handleLogoutSuccess } from '../../utils/validation'

const AdminDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('license-requests')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const navigationItems = [
     {
      id: 'stock-dashboard',
      label: 'Live Stock Dashboard',
      icon: BarChart3,
      component: StockDashboard
    },
    {
      id: 'gallery-management',
      label: 'Gallery Management',
      icon: GalleryIcon,
      component: ImageGalleryManager
    },
    {
      id: 'license-requests',
      label: 'License Requests',
      icon: FileText,
      component: LicenseRequestManagement
    },
   
    {
      id: 'mill-map',
      label: 'Mill Map',
      icon: Map,
      component: MillMap
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileBarChart,
      component: Reports
    },
    {
      id: 'price-management',
      label: 'Update Price',
      icon: DollarSign,
      component: PriceManagement
    }
  ]

  const ActiveComponent = navigationItems.find(item => item.id === activeSection)?.component

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Fixed */}
      <div 
        className={`text-white transition-all duration-300 flex flex-col flex-shrink-0 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
        style={{
          backgroundImage: `url(${rainbowNature})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 40
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-green-900 bg-opacity-30"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${sidebarOpen ? 'flex' : 'hidden'}`}>
                <img 
                  src={pmbLogo} 
                  alt="PMB Logo" 
                  className="w-16 h-16 object-contain drop-shadow-lg mr-3"
                />
                <div className="font-bold text-sm text-white drop-shadow-lg tracking-wide">
                  <div>PADDY MARKETING</div>
                  <div>BOARD</div>
                </div>
              </div>
              <div className={`flex items-center ${!sidebarOpen ? 'justify-center w-full' : ''}`}>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-white hover:text-green-200 transition-colors drop-shadow-lg p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                >
                  {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          {/* Navigation - takes up remaining space */}
          <nav className="flex-1 mt-8 overflow-y-auto">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-white hover:bg-opacity-15 transition-colors backdrop-blur-sm ${
                    activeSection === item.id ? 'bg-white bg-opacity-20 border-r-4 border-yellow-400 shadow-lg' : ''
                  }`}
                >
                  <IconComponent size={20} className="drop-shadow-lg" />
                  <span className={`ml-3 drop-shadow-lg ${sidebarOpen ? 'block' : 'hidden'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Logout Button - fixed at bottom */}
          <div className="p-4 flex-shrink-0">
            <button
              onClick={() => {
                console.log('Admin logout button clicked');
                
                // Clear admin session data
                sessionStorage.removeItem('adminData');
                localStorage.removeItem('adminData');
                
                // Show logout success toast
                handleLogoutSuccess('Admin');
                
                // Call logout handler
                if (onLogout) {
                  setTimeout(() => {
                    onLogout();
                  }, 500); // Small delay to show toast
                }
              }}
              className={`w-full flex items-center text-left bg-red-600 bg-opacity-70 hover:bg-red-700 hover:bg-opacity-80 transition-colors rounded text-white font-medium backdrop-blur-sm shadow-lg ${
                sidebarOpen ? 'px-4 py-2' : 'px-2 py-3 justify-center'
              }`}
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <LogOut size={20} className="drop-shadow-lg" />
              <span className={`ml-3 drop-shadow-lg ${sidebarOpen ? 'block' : 'hidden'}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col min-w-0"
        style={{ 
          marginLeft: sidebarOpen ? '256px' : '64px',
          transition: 'margin-left 300ms'
        }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {navigationItems.find(item => item.id === activeSection)?.label}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto" style={{ height: 'calc(100vh - 73px)' }}>
          {ActiveComponent && <ActiveComponent />}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
