import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import logoP from '../assets/logo-p.png';

const Header = ({ onNavigate = () => {}, currentPage = 'home', onAdminClick = () => {}, isAdminLoggedIn = false, onMillRegistrationClick = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  const navigationItems = [
    { name: t('header.home'), id: 'home', icon: '🏠' },
    { name: t('header.about'), id: 'about', icon: 'ℹ️' },
    { name: t('header.collection_centers'), id: 'collection-centers', icon: '🏢' },
    { name: t('header.live_prices'), id: 'live-paddy-prices', icon: '💰' },
    { name: t('header.contact'), id: 'contact', icon: '📞' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    // Add smooth transition effect
    document.body.style.pointerEvents = 'none';
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'fixed inset-0 bg-green-500/5 z-40 pointer-events-none';
    ripple.style.animation = 'pulse 0.6s ease-out';
    document.body.appendChild(ripple);
    
    // Navigate after short delay for smooth effect
    setTimeout(() => {
      onNavigate(sectionId);
      setIsMenuOpen(false);
      
      // Clean up
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
        if (document.body.contains(ripple)) {
          document.body.removeChild(ripple);
        }
      }, 300);
    }, 150);
  };

  const handleAdminClick = () => {
    onAdminClick();
  };

  return (
    <header className={`fixed w-full z-40 top-0 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-elevation' : 'bg-white shadow-lg'
    }`}>
      {/* Enhanced Colorful Top Banner - Reduced Height */}
      <div className="gradient-bg-vibrant text-white text-center py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <p className="text-xs font-medium relative z-10 animate-fade-in">
          <span className="inline-block text-sm">🌾</span> 
          <span className="mx-2">{t('header.serving_farmers')}</span>
          <span className="mx-4">|</span>
          <span className="font-semibold">
            <span className="inline-block animate-pulse-glow text-sm">📞</span> 
            <span className="ml-2">{t('header.hotline')}</span>
          </span>
        </p>
      </div>

      {/* Enhanced Main Header - Reduced Padding */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo Section - Compact */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 gradient-bg-primary rounded-lg flex items-center justify-center shadow-glow overflow-hidden">
                <img 
                  src={logoP} 
                  alt="PMB Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient-primary">
                Paddy Marketing Board
              </h1>
              <p className="text-xs text-gray-600">Ministry of Agriculture - Sri Lanka</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1 font-semibold text-sm transition-all duration-300 flex items-center gap-2 nav-btn-${item.id} ${
                    currentPage === item.id ? 'text-paddy-green' : 'text-gray-700 hover:text-paddy-green'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* Language Selector */}
            <LanguageSelector />

            {/* Mill Registration - styled like navigation items */}
            <button
              onClick={() => {
                console.log('Header Register button clicked - using prop function');
                onMillRegistrationClick();
              }}
              className="px-3 py-2 font-semibold text-sm transition-all duration-300 flex items-center gap-2 text-gray-700 hover:text-paddy-green border border-gray-300 hover:border-paddy-green rounded-md hover:bg-green-50"
            >
              <span className="text-base">🏭</span>
              <span className="text-xs">{t('header.register')}</span>
            </button>
            
            {/* Admin Login Button */}
            <button
              onClick={handleAdminClick}
              className={`${isAdminLoggedIn ? 'bg-green-600 hover:bg-green-700 btn-admin-success' : 'bg-orange-500 hover:bg-orange-600 btn-admin-warning'} px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:scale-105 transition-all duration-300`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {isAdminLoggedIn ? t('header.admin_panel') : t('header.admin')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mobile-menu-icon"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-gray-200 space-y-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 nav-btn-${item.id} ${
                    currentPage === item.id ? 'bg-paddy-green text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* Mobile Language Selector */}
            <div className="px-4">
              <LanguageSelector />
            </div>
            
            {/* Mobile Admin Button */}
            <div className="px-4">
              <button
                onClick={handleAdminClick}
                className={`${isAdminLoggedIn ? 'bg-green-600 hover:bg-green-700 btn-admin-success' : 'bg-orange-500 hover:bg-orange-600 btn-admin-warning'} w-full px-4 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all duration-300`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {isAdminLoggedIn ? t('header.admin_panel') : t('header.admin')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;