import { useState, useEffect, memo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import { handleLogoutSuccess } from '../utils/validation';

// Sidebar component for navigation
const MillSidebar = ({ onBackToHome }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State for user profile photo
  const [profilePhoto, setProfilePhoto] = useState('');
  const [userName, setUserName] = useState('');

  // Get current user ID from session data
  const getCurrentUserId = () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
      return userData.id || userData.user_id || 1;
    } catch (error) {
      console.error('Error getting user ID from session:', error);
      return 1;
    }
  };

  // Load profile photo from database
  const loadProfilePhoto = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/photo/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.photoData;
      } else if (response.status === 404) {
        return null; // No profile photo found, will use default
      } else {
        console.error('Failed to load profile photo:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
      return null;
    }
  };

  // Load user data and profile photo
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
        const fullName = userData.first_name && userData.last_name
          ? `${userData.first_name} ${userData.last_name}`
          : userData.first_name || userData.email || 'User';
        setUserName(fullName);

        // Load profile photo
        const userId = getCurrentUserId();
        const photoData = await loadProfilePhoto(userId);
        if (photoData) {
          setProfilePhoto(photoData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Collapse sidebar on small screens (mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  }, []);

  // Toggle sidebar collapse/expand
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

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
        ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col h-full shadow-2xl relative`}
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

        <nav className="flex-1 mt-8 overflow-y-auto">
          {navItems.map(({ to, icon, label }) => (
            <button
              key={to}
              onClick={(e) => {
                e.preventDefault();
                const targetPath = `/mill/${to}`;
                navigate(targetPath);
              }}
              className="group relative w-full flex items-center px-4 py-3 text-left hover:bg-white hover:bg-opacity-15 transition-colors backdrop-blur-sm text-white border-none cursor-pointer"
              style={{
                backgroundColor: location.pathname === `/mill/${to}` ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                borderRight: location.pathname === `/mill/${to}` ? '4px solid #facc15' : 'none'
              }}
            >
              <div className="drop-shadow-lg">{icon}</div>
              <span className={`ml-3 drop-shadow-lg ${isCollapsed ? 'hidden' : 'block'}`}>
                {label}
              </span>
              {/* Enhanced tooltip: always show on hover, better style */}
              <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 text-xs bg-gray-900 text-white rounded shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 whitespace-nowrap border border-gray-700 backdrop-blur-sm"
                style={{
                  minWidth: '90px',
                  display: isCollapsed ? 'block' : 'block',
                  visibility: isCollapsed || !isCollapsed ? 'visible' : 'hidden'
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white border-opacity-20">
            <div className="flex items-center gap-3 text-white">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white border-opacity-30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 border-2 border-white border-opacity-30 flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-white text-opacity-70">
                  Mill Owner
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button - fixed at bottom */}
        <div className="p-4 flex-shrink-0">
          <button
            onClick={() => {
              // Clear session data
              sessionStorage.removeItem('millOwnerData');
              sessionStorage.removeItem('token');
              localStorage.removeItem('millData');
              
              // Show logout success toast
              handleLogoutSuccess('Mill Owner');
              
              // Navigate back to home
              if (onBackToHome) {
                setTimeout(() => {
                  onBackToHome();
                }, 500); // Small delay to show toast
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

export default memo(MillSidebar);
