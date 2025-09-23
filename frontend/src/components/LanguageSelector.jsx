import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ්' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      localStorage.setItem('preferredLanguage', languageCode);
      document.documentElement.lang = languageCode;
      setIsOpen(false);
    } catch (error) {
      console.error('Language change failed:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors duration-200 bg-white/90 hover:bg-white rounded-full border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-md min-w-[70px]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-bold tracking-wide">
          {currentLanguage.code.toUpperCase()}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between ${
                currentLanguage.code === language.code 
                  ? 'bg-green-50 text-green-600 font-semibold' 
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{language.name}</span>
                <span className="text-xs text-gray-500">{language.nativeName}</span>
              </div>
              {currentLanguage.code === language.code && (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
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
