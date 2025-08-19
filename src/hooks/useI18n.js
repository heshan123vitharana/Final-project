import { useTranslation } from 'react-i18next';

/**
 * Custom hook for translations with enhanced functionality
 * Provides shortcuts and commonly used translation patterns
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  // Get current language info
  const currentLanguage = i18n.language;
  const isRTL = i18n.dir() === 'rtl';

  // Common translation functions
  const tWithFallback = (key, fallback = '') => {
    const translation = t(key);
    return translation === key ? fallback : translation;
  };

  // Format number based on locale
  const formatNumber = (number, options = {}) => {
    try {
      return new Intl.NumberFormat(currentLanguage, options).format(number);
    } catch (error) {
      console.warn('Number formatting error:', error);
      return number.toString();
    }
  };

  // Format date based on locale
  const formatDate = (date, options = {}) => {
    try {
      return new Intl.DateTimeFormat(currentLanguage, options).format(new Date(date));
    } catch (error) {
      console.warn('Date formatting error:', error);
      return date.toString();
    }
  };

  // Format currency based on locale
  const formatCurrency = (amount, currency = 'LKR') => {
    try {
      return new Intl.NumberFormat(currentLanguage, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      console.warn('Currency formatting error:', error);
      return `${currency} ${amount}`;
    }
  };

  // Pluralization helper
  const tPlural = (key, count, options = {}) => {
    return t(key, { count, ...options });
  };

  // Change language
  const changeLanguage = async (lng) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem('preferredLanguage', lng);
      
      // Update document attributes
      document.documentElement.lang = lng;
      document.documentElement.dir = i18n.dir();
      
      return true;
    } catch (error) {
      console.error('Language change failed:', error);
      return false;
    }
  };

  // Get available languages
  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
      { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', flag: '🇱🇰' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇱🇰' }
    ];
  };

  return {
    t,
    i18n,
    currentLanguage,
    isRTL,
    tWithFallback,
    formatNumber,
    formatDate,
    formatCurrency,
    tPlural,
    changeLanguage,
    getAvailableLanguages
  };
};

export default useI18n;
