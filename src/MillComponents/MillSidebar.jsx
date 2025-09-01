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
  PowerIcon,
} from '@heroicons/react/24/outline';

// Sidebar component for navigation
const MillSidebar = ({ userData, onBackToHome }) => {
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
    // Sidebar container with responsive width and professional gradient
    <aside
      className={`bg-gradient-to-br from-emerald-800 to-green-900 text-white transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col min-h-screen shadow-2xl relative border-r border-emerald-700/50`}
    >
      {/* Toggle Button for collapsing/expanding sidebar */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg focus:outline-none transition-all duration-300"
      >
        {/* Show hamburger icon when collapsed, close icon when expanded */}
        {isCollapsed ? (
          <Bars3Icon className="h-5 w-5 transform hover:scale-110 transition-transform duration-300" />
        ) : (
          <XMarkIcon className="h-5 w-5 transform hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {/* Top Section: Logo and Title */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6 mt-2">
          {/* Show logo and title only when sidebar is expanded */}
          {!isCollapsed && (
            <>
              <div className="flex items-center gap-3">
                {/* Logo image */}
                <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
                <div className="leading-tight">
                  {/* Dashboard title */}
                  <h1 className="text-xl font-bold">Wee Saviya</h1>
                  <p className="text-sm text-white/80">Mill Dashboard</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col justify-between h-[calc(100vh-180px)]">
          <div className="flex flex-col space-y-1">
            {/* Render all navigation items */}
            {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-lg px-3 py-3 mx-1 transition-all duration-200 ${
                    isCollapsed ? 'justify-center' : 'gap-3'
                  } ${isActive 
                    ? 'bg-white/20 text-white shadow-lg border-l-4 border-yellow-400 backdrop-blur-sm' 
                    : 'hover:bg-white/10 hover:text-white text-white/80 hover:shadow-md'
                  }`
                }
              >
                {/* Navigation icon */}
                {icon}
                {/* Show label only when expanded */}
                {!isCollapsed && <span>{label}</span>}
                {/* Tooltip for collapsed sidebar */}
                {isCollapsed && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 whitespace-nowrap border border-gray-700 backdrop-blur-sm">
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* User Info and Logout Section */}
          <div className="border-t border-white/20 pt-4 mt-4">
            {/* User Info */}
            {!isCollapsed && userData && (
              <div className="px-3 py-2 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {userData.first_name ? userData.first_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {userData.first_name} {userData.last_name}
                    </p>
                    <p className="text-xs text-white/70 truncate">
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Logout Button */}
            <NavLink
              to="logout"
              className={({ isActive }) =>
                `group relative flex items-center rounded-lg px-3 py-3 mx-1 transition-all duration-200 ${
                  isCollapsed ? 'justify-center' : 'gap-3'
                } ${isActive 
                  ? 'bg-red-500/20 text-red-200 shadow-lg border-l-4 border-red-400' 
                  : 'hover:bg-red-500/10 hover:text-red-200 text-white/80 hover:shadow-md'
                }`
              }
            >
              {/* Logout icon */}
              <PowerIcon className="h-5 w-5" />
              {/* Show label only when expanded */}
              {!isCollapsed && <span className="font-medium">Logout</span>}
              {/* Tooltip for collapsed sidebar */}
              {isCollapsed && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 whitespace-nowrap border border-gray-700 backdrop-blur-sm">
                  Logout
                </span>
              )}
            </NavLink>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default MillSidebar;