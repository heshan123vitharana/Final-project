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
    { name: t('header.about'), id: 'platform-features-section', icon: 'ℹ️' },
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
        if (sectionId === 'platform-features-section') {
          const section = document.getElementById('platform-features-section');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        // ...existing code...
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
    <header className={`fixed w-full z-40 top-0 transition-all duration-300 border-b ${
      isScrolled ? 'bg-white/85 backdrop-blur-xl border-emerald-100 shadow-[0_10px_30px_-12px_rgba(16,185,129,0.15)]' : 'bg-white/95 backdrop-blur-md border-transparent'
    }`}>
      {/* Enhanced Colorful Top Banner - Reduced Height */}
  <div className={`bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 text-white text-center relative overflow-hidden ${isScrolled ? 'py-1' : 'py-1.5'}`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <p className="text-[11px] font-medium relative z-10">
          <span className="inline-block text-sm">🌾</span> 
          <span className="mx-2">{t('header.serving_farmers')}</span>
          <span className="mx-4">|</span>
          <span className="font-semibold">
            <span className="inline-block text-sm">📞</span> 
            <span className="ml-2">{t('header.hotline')}</span>
          </span>
        </p>
      </div>

    {/* Enhanced Main Header - dynamic padding for shrink */}
  <div className={`container mx-auto px-4 ${isScrolled ? 'py-1.5' : 'py-2.5'}`}>
        <div className="flex items-center justify-between">
          {/* Logo Section - larger PNG with glow highlight; brand on two lines */}
          <div className="flex items-center space-x-2">
      <div className={`relative rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 ring-1 ring-emerald-300/40 shadow-md flex items-center justify-center overflow-hidden ${isScrolled ? 'w-10 h-10 md:w-11 md:h-11' : 'w-11 h-11 md:w-12 md:h-12'}`}>
              <img 
                src={logoP} 
                alt="PMB Logo" 
                className="w-9 h-9 md:w-10 md:h-10 object-contain"
              />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm md:text-base font-bold text-gradient-primary leading-[1.05]">
                <span className="block">Paddy Marketing</span>
                <span className="block">Board</span>
              </h1>
              <p className="text-[10px] md:text-[11px] text-gray-600 leading-none mt-0.5">Ministry of Agriculture - Sri Lanka</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <nav className="flex space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2.5 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-1.5 nav-btn-${item.id} ${
                    currentPage === item.id ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                  <span
                    className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full origin-left transition-transform duration-300 ease-out ${
                      currentPage === item.id ? 'bg-emerald-600 scale-x-100' : 'bg-transparent scale-x-0'
                    }`}
                  />
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
              className="px-3 py-2 rounded-md font-medium text-sm transition-all duration-200 flex items-center gap-2 text-gray-700 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="text-base">🏭</span>
              <span className="text-[11px]">{t('header.register')}</span>
            </button>
            
            {/* Admin Login Button */}
            <button
              onClick={handleAdminClick}
              className={`${isAdminLoggedIn ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'} px-3.5 py-2 rounded-md text-white font-medium flex items-center gap-2 transition-all duration-200`}
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
          <div className="lg:hidden mt-4 py-4 border-t border-emerald-100 space-y-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-md font-medium transition-colors flex items-center gap-3 nav-btn-${item.id} ${
                    currentPage === item.id ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-emerald-50'
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
                className={`${isAdminLoggedIn ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-500 hover:bg-amber-600'} w-full px-4 py-3 rounded-md text-white font-medium flex items-center justify-center gap-2 transition-all duration-200`}
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