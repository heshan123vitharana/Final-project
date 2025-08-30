import { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';
import logoP from '../assets/logo-p.png';

const Header = ({ onNavigate = () => {}, currentPage = 'home', onMillRegistrationClick = () => {}, onAdminClick = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  return (
    <header className={`fixed w-full z-50 top-0 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg border-b border-gray-200' : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
    }`}>
      {/* AWS-style Top Info Bar */}
      <div className={`bg-slate-900 text-white text-center relative overflow-hidden ${isScrolled ? 'py-0.5' : 'py-1'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <span className="mr-2"></span>
              Serving Farmers Island-wide with Fair Paddy Procurement
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="mr-2">📞</span>
              Hotline: +94 11 234 5678
            </span>
            <button
              title="Admin Login"
              onClick={onAdminClick}
              className="flex items-center px-2 py-1 rounded text-xs hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 8V7a5 5 0 0 0-10 0v1a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-8-1a3 3 0 0 1 6 0v1h-6zm9 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-6-3a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1z"/>
              </svg>
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* AWS-style Main Header */}
      <div className={`container mx-auto px-4 ${isScrolled ? 'py-2' : 'py-3'}`}>
        <div className="flex items-center justify-between">
          {/* AWS-style Logo Section */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center ${isScrolled ? 'w-14 h-14' : 'w-16 h-16'}`}>
              <img 
                src={logoP} 
                alt="PMB Logo" 
                className={`object-contain ${isScrolled ? 'w-12 h-12' : 'w-14 h-14'}`}
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-bold text-gray-900 leading-none">
                Paddy Marketing Board
              </h1>
              <p className="text-xs text-gray-600 mt-0.5">Ministry of Agriculture - Sri Lanka</p>
            </div>
          </div>

          {/* AWS-style Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <nav className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative dropdown-container">
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                        className={`px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center space-x-1 hover:bg-gray-50 ${
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
                      className={`px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 ${
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
              <LanguageSelector />
              
              
              {/* Enhanced Mill Owner Portal Button */}
              <button
                onClick={() => {
                  console.log('Mill Owner Portal button clicked');
                  onMillRegistrationClick();
                }}
                className="relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group"
              >
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m0 0h4M9 7h6m-6 4h6m-3 4h3" />
                </svg>
                <span>Mill Portal</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* AWS-style Mobile Menu Button */}
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

        {/* AWS-style Mobile Menu */}
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
                <LanguageSelector />
                
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
                  className="w-full px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m0 0h4M9 7h6m-6 4h6m-3 4h3" />
                  </svg>
                  <span>Access Mill Portal</span>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;