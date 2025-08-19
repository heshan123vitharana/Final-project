import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Language configuration - simplified without flags
  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      direction: 'ltr'
    },
    {
      code: 'si',
      name: 'Sinhala',
      nativeName: 'සිංහල',
      direction: 'ltr'
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      direction: 'ltr'
    }
  ];

  // Get current language info
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Handle language change
  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      
      // Update document direction if needed
      const selectedLang = languages.find(lang => lang.code === languageCode);
      if (selectedLang) {
        document.documentElement.dir = selectedLang.direction;
        document.documentElement.lang = languageCode;
      }
      
      setIsOpen(false);
      
      // Store preference in localStorage
      localStorage.setItem('i18nextLng', languageCode);
      
      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  // Set initial document attributes
  useEffect(() => {
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group"
        aria-label={`Current language: ${currentLanguage.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Language Name */}
        <span className="hidden sm:block text-sm font-medium">
          {currentLanguage.nativeName}
        </span>
        
        {/* Language Code (mobile) */}
        <span className="text-sm font-medium sm:hidden uppercase">
          {currentLanguage.code}
        </span>
        
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-60 overflow-y-auto">
          {/* Language Options */}
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                currentLanguage.code === language.code
                  ? 'bg-paddy-green/10 text-paddy-green'
                  : 'text-gray-700'
              }`}
              aria-current={currentLanguage.code === language.code ? 'true' : 'false'}
            >
              {/* Language Info */}
              <div className="flex-1">
                <div className="font-medium text-sm">{language.nativeName}</div>
                <div className="text-xs text-gray-500">{language.name}</div>
              </div>
              
              {/* Current Language Indicator */}
              {currentLanguage.code === language.code && (
                <svg className="w-4 h-4 text-paddy-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;