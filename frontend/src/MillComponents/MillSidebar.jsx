import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  BellIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import rainbowNature from '../assets/beautiful-rainbow-nature.jpg';
import pmbLogo from '../assets/logo-p.png';

// Sidebar component for navigation
const MillSidebar = ({ onBackToHome }) => {
  // State to control sidebar collapse (responsive)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Collapse sidebar on small screens (mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, []);

  // Toggle sidebar collapse/expand
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  // Navigation items for sidebar
  const navItems = [
    { to: 'home', icon: <HomeIcon className="h-5 w-5" />, label: 'Home' },
    { to: 'register', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, label: 'Mill Registration' },
    { to: 'paddy-price', icon: <CurrencyDollarIcon className="h-5 w-5" />, label: 'Paddy Price' },
    { to: 'update-stock', icon: <ArrowUpTrayIcon className="h-5 w-5" />, label: 'Update Stock' },
    { to: 'view-stock', icon: <EyeIcon className="h-5 w-5" />, label: 'View Stock' },
    { to: 'payment', icon: <CreditCardIcon className="h-5 w-5" />, label: 'Payment' },
    { to: 'notifications', icon: <BellIcon className="h-5 w-5" />, label: 'Notifications' },
    { to: 'profile', icon: <UserCircleIcon className="h-5 w-5" />, label: 'Profile' },
  ];

  return (
    // Sidebar container with responsive width and rainbow nature background
    <aside
      className={`text-white transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col min-h-screen shadow-2xl relative`}
      style={{
        backgroundImage: `url(${rainbowNature})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-green-900 bg-opacity-30"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${!isCollapsed ? 'flex' : 'hidden'}`}>
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
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <button
                onClick={toggleSidebar}
                className="text-white hover:text-green-200 transition-colors drop-shadow-lg p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
              >
                {!isCollapsed ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation - takes up remaining space */}
        <nav className="flex-1 mt-8 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative w-full flex items-center px-4 py-3 text-left hover:bg-white hover:bg-opacity-15 transition-colors backdrop-blur-sm ${
                  isActive ? 'bg-white bg-opacity-20 border-r-4 border-yellow-400 shadow-lg' : ''
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              <div className="drop-shadow-lg">{icon}</div>
              <span className={`ml-3 drop-shadow-lg ${isCollapsed ? 'hidden' : 'block'}`}>
                {label}
              </span>
              {/* Tooltip for collapsed sidebar */}
              {isCollapsed && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 whitespace-nowrap border border-gray-700 backdrop-blur-sm">
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button - fixed at bottom */}
        <div className="p-4 flex-shrink-0">
          <button
            onClick={() => {
              console.log('Logout button clicked');
              if (onBackToHome) {
                onBackToHome();
              }
            }}
            className={`group relative w-full flex items-center text-left bg-red-600 bg-opacity-70 hover:bg-red-700 hover:bg-opacity-80 transition-colors rounded text-white font-medium backdrop-blur-sm shadow-lg ${
              isCollapsed ? 'px-2 py-3 justify-center' : 'px-4 py-2'
            }`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 drop-shadow-lg" />
            <span className={`ml-3 drop-shadow-lg ${isCollapsed ? 'hidden' : 'block'}`}>
              Logout
            </span>
            {/* Tooltip for collapsed sidebar */}
            {isCollapsed && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 whitespace-nowrap border border-gray-700 backdrop-blur-sm">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MillSidebar;