import { useState, useEffect } from 'react';

const Header = ({ onNavigate = () => {}, currentPage = 'home' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigationItems = [
    { name: 'HOME', id: 'home', icon: '🏠' },
    { name: 'ABOUT', id: 'about', icon: 'ℹ️' },
    { name: 'COLLECTION CENTERS', id: 'collection-centers', icon: '🏢' },
    { name: 'CONTACT', id: 'contact', icon: '📞' }
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
    onNavigate(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <header className={`fixed w-full z-40 top-0 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-elevation' : 'bg-white shadow-lg'
    }`}>
      {/* Enhanced Top Banner */}
      <div className="gradient-bg-primary text-white text-center py-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 rice-pattern opacity-30"></div>
        <p className="text-sm font-medium relative z-10 animate-fade-in">
          <span className="inline-block animate-float">🌾</span> 
          <span className="mx-2">Serving Farmers Island-wide with Fair Paddy Procurement</span>
          <span className="mx-4">|</span>
          <span className="font-semibold">
            <span className="inline-block animate-pulse-glow">📞</span> 
            <span className="ml-2">Hotline: +94 11 234 5678</span>
          </span>
        </p>
      </div>

      {/* Enhanced Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo Section */}
          <div className="flex items-center space-x-4 animate-slide-in-left">
            <div className="relative">
              <div className="w-12 h-12 gradient-bg-primary rounded-xl flex items-center justify-center shadow-glow transition-transform hover:scale-110">
                <span className="text-2xl animate-float">🌾</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-rice-gold rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary hover:scale-105 transition-transform cursor-pointer" onClick={() => handleNavClick('home')}>
                Paddy Marketing Board
              </h1>
              <p className="text-xs text-gray-600">Ministry of Agriculture - Sri Lanka</p>
            </div>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 animate-slide-in-right">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  currentPage === item.id
                    ? 'gradient-bg-primary text-white shadow-glow transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-paddy-green hover:scale-105'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Enhanced Language Selector & Admin */}
          <div className="hidden lg:flex items-center space-x-4 animate-fade-in-delayed">
            {/* Language Dropdown */}
            <div className="relative">
              <select className="form-input-enhanced bg-gray-50 border-0 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-paddy-green cursor-pointer">
                <option value="en">🇺🇸 English</option>
                <option value="si">🇱🇰 සිංහල</option>
                <option value="ta">🇱🇰 தமிழ்</option>
              </select>
            </div>

            {/* Admin Login Button */}
            <button className="btn-secondary-enhanced px-6 py-2 rounded-xl text-sm font-medium shadow-soft hover:shadow-glow-gold transition-all duration-300 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Admin</span>
            </button>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:scale-110"
          >
            <div className="space-y-1">
              <div className={`w-6 h-0.5 bg-paddy-green transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-paddy-green transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-paddy-green transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Menu */}
        <div className={`lg:hidden mt-4 transition-all duration-300 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="enhanced-card bg-white/95 backdrop-blur-md rounded-2xl shadow-elevation p-6 space-y-4">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === item.id
                    ? 'gradient-bg-primary text-white shadow-glow'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-paddy-green'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
            
            {/* Mobile Language & Admin */}
            <div className="border-t pt-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select className="form-input-enhanced w-full bg-gray-50 border-0 rounded-xl px-4 py-2 text-sm">
                  <option value="en">🇺🇸 English</option>
                  <option value="si">🇱🇰 සිංහල</option>
                  <option value="ta">🇱🇰 தமிழ்</option>
                </select>
              </div>
              <button className="btn-secondary-enhanced w-full px-4 py-3 rounded-xl text-sm font-medium shadow-soft flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Admin Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
