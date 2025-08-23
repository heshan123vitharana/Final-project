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

// Sidebar component for navigation
const MillSidebar = () => {
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
    { to: '/', icon: <HomeIcon className="h-5 w-5" />, label: 'Home' },
    { to: '/register', icon: <ClipboardDocumentListIcon className="h-5 w-5" />, label: 'Mill Registration' },
    { to: '/paddy-price', icon: <CurrencyDollarIcon className="h-5 w-5" />, label: 'Paddy Price' },
    { to: '/update-stock', icon: <ArrowUpTrayIcon className="h-5 w-5" />, label: 'Update Stock' },
    { to: '/view-stock', icon: <EyeIcon className="h-5 w-5" />, label: 'View Stock' },
    { to: '/payment', icon: <CreditCardIcon className="h-5 w-5" />, label: 'Payment' },
    { to: '/notifications', icon: <BellIcon className="h-5 w-5" />, label: 'Notifications' },
    { to: '/profile', icon: <UserCircleIcon className="h-5 w-5" />, label: 'Profile' },
    // Logout is separated to be placed at the bottom
    { to: '/logout', icon: <ArrowLeftOnRectangleIcon className="h-5 w-5" />, label: 'Logout', isLogout: true },
  ];

  return (
    // Sidebar container with responsive width
    <aside
      className={`bg-green-700 text-white transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col justify-between min-h-screen shadow-lg relative`}
    >
      {/* Toggle Button for collapsing/expanding sidebar */}
      <button
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        className="absolute top-4 right-4 text-white focus:outline-none transition-transform duration-300"
      >
        {isCollapsed ? (
          <Bars3Icon className="h-6 w-6 transform hover:rotate-90 transition-transform duration-300" />
        ) : (
          <XMarkIcon className="h-6 w-6 transform hover:rotate-90 transition-transform duration-300" />
        )}
      </button>

      {/* Top Section: Logo and Title */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6 mt-2">
          {/* Show logo and title only when sidebar is expanded */}
          {!isCollapsed && (
            <>
              <img src="/logo.svg" alt="Logo" className="h-10 w-10" />
              <div className="leading-tight">
                <h1 className="text-xl font-bold">Wee Saviya</h1>
                <p className="text-sm text-white/80">Mill Dashboard</p>
              </div>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col justify-between h-[calc(100vh-100px)] space-y-3">
          <div className="flex flex-col space-y-3">
            {/* Render all navigation items except Logout */}
            {navItems.slice(0, -1).map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-lg px-2 py-2 transition-colors ${
                    isCollapsed ? 'justify-center' : 'gap-3'
                  } ${isActive ? 'bg-green-900 text-yellow-300 font-semibold' : 'hover:bg-green-800 hover:text-yellow-300'}`
                }
              >
                {icon}
                {/* Show label only when expanded */}
                {!isCollapsed && <span>{label}</span>}
                {/* Tooltip for collapsed sidebar */}
                {isCollapsed && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm bg-black text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Logout link placed at the bottom */}
          <div>
            <NavLink
              to={navItems[navItems.length - 1].to}
              className={({ isActive }) =>
                `group relative flex items-center rounded-lg px-2 py-2 transition-colors ${
                  isCollapsed ? 'justify-center' : 'gap-3'
                } ${isActive ? 'bg-green-900 text-yellow-300 font-semibold' : 'hover:bg-green-800 hover:text-yellow-300'}`
              }
            >
              {navItems[navItems.length - 1].icon}
              {/* Show label only when expanded */}
              {!isCollapsed && <span>{navItems[navItems.length - 1].label}</span>}
              {/* Tooltip for collapsed sidebar */}
              {isCollapsed && (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-sm bg-black text-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
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
