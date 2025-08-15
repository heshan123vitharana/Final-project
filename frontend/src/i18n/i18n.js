import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import siTranslations from './locales/si.json';
import taTranslations from './locales/ta.json';

// Configuration for i18next
const resources = {
  en: {
    translation: enTranslations
  },
  si: {
    translation: siTranslations
  },
  ta: {
    translation: taTranslations
  }
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    
    // Default language
    fallbackLng: 'en',
    
    // Debug mode (set to false in production)
    debug: true,
    
    // Language detection options
    detection: {
      // Order of detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Keys for localStorage
      lookupLocalStorage: 'i18nextLng',
      
      // Cache user language
      caches: ['localStorage'],
    },
    
    // Interpolation options
    interpolation: {
      // React already escapes by default
      escapeValue: false,
    },
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Key separator
    keySeparator: '.',
    
    // Nested key separator
    nsSeparator: ':',
    
    // React options
    react: {
      // Set to true if you want to use React Suspense
      useSuspense: false,
    },
  });

export default i18n;
