import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import pmbLogo from '../assets/logo-p.png';

const Header = ({ onNavigate = () => {}, currentPage = 'home', onMillRegistrationClick = () => {}, onAdminClick = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentTime, setCurrentTime] = useState(''); // Will hold full formatted date/time string

  const navigationItems = [
    { 
      name: 'Products', 
      id: 'products',
      hasDropdown: true,
      items: [
        { name: 'Paddy Purchase', description: 'Direct paddy procurement services', icon: '🌾' },
        { name: 'Storage Solutions', description: 'Modern storage facilities', icon: '🏪' },
        { name: 'Distribution', description: 'Island-wide distribution network', icon: '🚛' },
        { name: 'Quality Control', description: 'Advanced quality assurance', icon: '✅' }
      ]
    },
    { 
      name: 'Services', 
      id: 'services',
      hasDropdown: true,
      items: [
        { name: 'Mill Registration', description: 'Register your mill with PMB', icon: '🏭' },
        { name: 'Price Information', description: 'Live paddy price updates', icon: '💰' },
        { name: 'Collection Centers', description: 'Find nearest collection points', icon: '📍' },
        { name: 'Support', description: '24/7 farmer support services', icon: '🤝' }
      ]
    },
    { name: 'Leadership', id: 'leadership' },
    { 
      name: 'Resources', 
      id: 'resources',
      hasDropdown: true,
      items: [
        { name: 'Documentation', description: 'Guides and procedures', icon: '📚' },
        { name: 'Training', description: 'Educational programs', icon: '🎓' },
        { name: 'News & Updates', description: 'Latest announcements', icon: '📰' },
        { name: 'Contact Support', description: 'Get help when you need it', icon: '📞' }
      ]
    },
    { name: 'About', id: 'platform-features-section' },
    { name: 'Contact', id: 'contact' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Update Sri Lankan real-time date & time (weekday • Month Day, Year • hh:mm:ss AM)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const localeOpts = { timeZone: 'Asia/Colombo' };
      const weekday = now.toLocaleString('en-US', { weekday: 'long', ...localeOpts });
      const month = now.toLocaleString('en-US', { month: 'long', ...localeOpts });
      const day = now.toLocaleString('en-US', { day: '2-digit', ...localeOpts });
      const year = now.toLocaleString('en-US', { year: 'numeric', ...localeOpts });
      const time = now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, ...localeOpts });
      setCurrentTime(`${weekday} • ${month} ${day}, ${year} • ${time}`);
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  const handleNavClick = (sectionId) => {
    console.log('Navigation clicked:', sectionId);
    
    // Close mobile menu immediately
    setIsMenuOpen(false);
    
    // Add smooth transition effect
    document.body.style.pointerEvents = 'none';
    
    // Create subtle ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'fixed inset-0 bg-emerald-500/3 z-40 pointer-events-none transition-opacity duration-300';
    document.body.appendChild(ripple);
    
    // Navigate with proper offset calculation
    setTimeout(() => {
      const headerHeight = isScrolled ? 120 : 140; // Account for banner + header
      
      if (sectionId === 'home') {
        // Scroll to top for home
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('Scrolled to top');
      } else {
        // Try to find the target section
        let targetElement = document.getElementById(sectionId);
        
        // Fallback mappings for different section IDs
        const sectionMappings = {
          'platform-features-section': ['platform-features-section', 'about'],
          'collection-centers': ['collection-centers'],
          'live-paddy-prices': ['live-paddy-prices'],
          'leadership': ['leadership'],
          'contact': ['contact']
        };
        
        // Try alternative IDs if primary not found
        if (!targetElement && sectionMappings[sectionId]) {
          for (const altId of sectionMappings[sectionId]) {
            targetElement = document.getElementById(altId);
            if (targetElement) {
              console.log(`Found section with alternative ID: ${altId}`);
              break;
            }
          }
        }
        
        if (targetElement) {
          const elementTop = targetElement.offsetTop - headerHeight;
          window.scrollTo({ top: Math.max(0, elementTop), behavior: 'smooth' });
          console.log(`Successfully scrolled to: ${sectionId}`);
        } else {
          console.error(`Section not found: ${sectionId}`);
          console.log('Available sections:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
          // Use the original navigation function as fallback
          onNavigate(sectionId);
        }
      }
      
      // Clean up ripple effect
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        if (document.body.contains(ripple)) {
          document.body.removeChild(ripple);
        }
      }, 300);
    }, 100);
  };

  // Removed handleAdminClick and onAdminClick as Admin button is no longer used

  const handleDropdownToggle = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap');
          .time-display {
            font-family: 'Roboto Mono', monospace;
          }
        `}
      </style>
      <header className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        {/* Top bar for time and language */}
        <div className="bg-gray-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-10">
            <div className="time-display text-xs font-medium tracking-wider text-emerald-300">
              {currentTime}
            </div>
          </div>
        </div>

        {/* Main navigation bar */}
        <nav className={`bg-white/80 backdrop-blur-lg transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
          <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center`}>
            {/* Logo section */}
            <div className="flex-shrink-0">
              <button 
                onClick={() => handleNavClick('home')}
                className="flex items-center cursor-pointer"
                title="Paddy Marketing Board - Go to Home"
              >
                <img
                  src="/paddy-marketing-board-logo.png"
                  alt="Paddy Marketing Board"
                  className={`object-contain ${isScrolled ? 'h-8 w-auto' : 'h-12 w-auto'} max-w-full`}
                  onError={(e) => {
                    console.warn('New PMB logo not found, trying fallback');
                    // Try the asset logo first
                    if (e.target.src.includes('paddy-marketing-board-logo.png')) {
                      e.target.src = pmbLogo;
                    } else if (e.target.src === pmbLogo) {
                      // Final fallback to SVG
                      e.target.src = '/logo.svg';
                    } else {
                      // Last resort: show PMB text
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="text-emerald-800 font-bold text-xl">PMB</div>';
                    }
                  }}
                  onLoad={() => {
                    console.log('✅ PMB Official Logo loaded successfully');
                  }}
                />
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <nav className="flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <div key={item.name} className="relative dropdown-container">
                    {item.hasDropdown ? (
                      <>
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                          className={`px-3 py-1 text-sm font-medium transition-colors duration-200 flex items-center space-x-1 hover:bg-gray-50 ${
                            activeDropdown === item.id ? 'bg-gray-50 text-orange-600' : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <span>{item.name}</span>
                          <svg className={`w-4 h-4 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* AWS-style Dropdown Menu */}
                        {activeDropdown === item.id && (
                          <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-4 space-y-2">
                              {item.items.map((subItem, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (subItem.name === 'Mill Registration') {
                                      onMillRegistrationClick();
                                    } else if (subItem.name === 'Collection Centers') {
                                      handleNavClick('collection-centers');
                                    } else if (subItem.name === 'Price Information') {
                                      handleNavClick('live-paddy-prices');
                                    } else if (subItem.name === 'Contact Support') {
                                      handleNavClick('contact');
                                    }
                                    setActiveDropdown(null);
                                  }}
                                  className="w-full text-left p-3 rounded-md hover:bg-gray-50 transition-colors group"
                                >
                                  <div className="flex items-start space-x-3">
                                    <span className="text-lg mt-0.5">{subItem.icon}</span>
                                    <div>
                                      <div className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                                        {subItem.name}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-0.5">
                                        {subItem.description}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`px-3 py-1 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 ${
                          currentPage === item.id ? 'text-orange-600 bg-gray-50' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {item.name}
                      </button>
                    )}
                  </div>
                ))}
              </nav>
              {/* Enhanced Action Section */}
              <div className="flex items-center space-x-4 ml-8">
                {/* Language Selector */}
                <LanguageSelector />
                
                {/* Enhanced Mill Owner Portal Button */}
                <button
                  onClick={() => {
                    // Mill Owner Portal button clicked
                    onMillRegistrationClick();
                  }}
                  className="relative px-4 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-md hover:bg-emerald-200 hover:text-emerald-800 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                >
                  <span className="relative z-10">Mill Portal</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.name} className="space-y-2">
                    {item.hasDropdown ? (
                      <>
                        <div className="font-medium text-gray-900 px-3 py-2 border-b border-gray-100">
                          {item.name}
                        </div>
                        <div className="pl-4 space-y-1">
                          {item.items.map((subItem, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                if (subItem.name === 'Mill Registration') {
                                  onMillRegistrationClick();
                                } else if (subItem.name === 'Collection Centers') {
                                  handleNavClick('collection-centers');
                                } else if (subItem.name === 'Price Information') {
                                  handleNavClick('live-paddy-prices');
                                } else if (subItem.name === 'Contact Support') {
                                  handleNavClick('contact');
                                }
                                setIsMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
                            >
                              <span>{subItem.icon}</span>
                              <span>{subItem.name}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          handleNavClick(item.id);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                          currentPage === item.id ? 'text-orange-600 bg-orange-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.name}
                      </button>
                    )}
                  </div>
                ))}
              </nav>
              
              {/* Mobile Action Section */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                {/* Language Selector for Mobile */}
                <div className="flex justify-center">
                  <LanguageSelector />
                </div>
                
                {/* Mobile Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Enhanced Mobile Mill Portal Button */}
                <button
                  onClick={() => {
                    onMillRegistrationClick();
                    setIsMenuOpen(false);
                  }}
                  className="relative w-full px-5 py-3 text-sm font-light text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-emerald-500/50 hover:shadow-2xl transform hover:scale-105 group"
                >
                  <span className="relative z-10">Mill Portal</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-30 rounded-full blur-md transition-all duration-300"></div>
                </button>
                
                {/* Quick Access Links */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      handleNavClick('live-paddy-prices');
                      setIsMenuOpen(false);
                    }}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    <span className="text-lg mb-1">💰</span>
                    <span className="text-xs text-gray-600">Live Prices</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleNavClick('contact');
                      setIsMenuOpen(false);
                    }}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                  >
                    <span className="text-lg mb-1">📞</span>
                    <span className="text-xs text-gray-600">Contact</span>
                  </button>
                </div>
                
                {/* Admin Login Button - Mobile */}
                <div className="border-t pt-4 mt-2 space-y-2">
                  <button
                    onClick={onMillRegistrationClick}
                    className="w-full bg-orange-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-orange-600 transition-all"
                  >
                    Mill Registration
                  </button>
                  <button
                    onClick={onAdminClick}
                    className="w-full bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 transition-all"
                  >
                    Admin Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;