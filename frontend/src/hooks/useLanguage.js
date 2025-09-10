
import { useState } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    orders: 'Orders',
    inventory: 'Inventory',
    collections: 'Collections',
    analytics: 'Analytics',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    welcome: 'Welcome to Rice Mill Management',
    totalRevenue: 'Total Revenue',
    paddyProcessed: 'Paddy Processed',
    activeContracts: 'Active Contracts',
    completedOrders: 'Completed Orders',
    liveMarketPrices: 'Live Market Prices',
    nearbyCollectionCenters: 'Nearby Collection Centers',
    recentOrders: 'Recent Orders',
    quickActions: 'Quick Actions',
    newOrder: 'New Order',
    viewInventory: 'View Inventory',
    downloadReport: 'Download Report',
    manageContracts: 'Manage Contracts',
    riceVarieties: {
      kekulu: 'Kekulu',
      samba: 'Samba',
      nadu: 'Nadu',
      basmati: 'Basmati'
    },
    locations: {
      ratnapura: 'Ratnapura',
      embilipitiya: 'Embilipitiya',
      balangoda: 'Balangoda',
      matara: 'Matara',
      galle: 'Galle'
    },
    status: {
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed',
      processing: 'Processing',
      delivered: 'Delivered'
    }
  },
  si: {
    dashboard: 'ඩැෂ්බෝඩ්',
    orders: 'ඇණවුම්',
    inventory: 'ගබඩාව',
    collections: 'එකතු කිරීම්',
    analytics: 'විශ්ලේෂණ',
    settings: 'සැකසුම්',
    profile: 'පැතිකඩ',
    logout: 'ඉවත් වන්න',
    welcome: 'සහල් මෝල් කළමනාකරණයට සාදරයෙන් පිළිගනිමු',
    totalRevenue: 'මුළු ආදායම',
    paddyProcessed: 'සැකසූ වී',
    activeContracts: 'ක්‍රියාකාරී ගිණුම්',
    completedOrders: 'සම්පූර්ණ ඇණවුම්',
    liveMarketPrices: 'සජීව වෙළඳපල මිල',
    nearbyCollectionCenters: 'ආසන්න එකතු කිරීමේ මධ්‍යස්ථාන',
    recentOrders: 'මෑත ඇණවුම්',
    quickActions: 'ඉක්මන් ක්‍රියාමාර්ග',
    newOrder: 'නව ඇණවුම',
    viewInventory: 'ගබඩාව බලන්න',
    downloadReport: 'වාර්තාව බාගන්න',
    manageContracts: 'ගිණුම් කළමනාකරණය',
    riceVarieties: {
      kekulu: 'කැකුළු',
      samba: 'සම්බා',
      nadu: 'නාදු',
      basmati: 'බාස්මතී'
    },
    locations: {
      ratnapura: 'රත්නපුර',
      embilipitiya: 'එම්බිලිපිටිය',
      balangoda: 'බලංගොඩ',
      matara: 'මාතර',
      galle: 'ගාල්ල'
    },
    status: {
      active: 'ක්‍රියාකාරී',
      pending: 'බලාපොරොත්තු',
      completed: 'සම්පූර්ණ',
      processing: 'සැකසෙමින්',
      delivered: 'බෙදාහරින ලද'
    }
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    orders: 'ஆர்டர்கள்',
    inventory: 'சரக்குகள்',
    collections: 'சேகரிப்புகள்',
    analytics: 'பகுப்பாய்வு',
    settings: 'அமைப்புகள்',
    profile: 'சுயவிவரம்',
    logout: 'வெளியேறு',
    welcome: 'அரிசி ஆலை நிர்வாகத்திற்கு வரவேற்கிறோம்',
    totalRevenue: 'மொத்த வருவாய்',
    paddyProcessed: 'செயலாக்கப்பட்ட நெல்',
    activeContracts: 'செயலில் உள்ள ஒப்பந்தங்கள்',
    completedOrders: 'முடிக்கப்பட்ட ஆர்டர்கள்',
    liveMarketPrices: 'நேரடி சந்தை விலைகள்',
    nearbyCollectionCenters: 'அருகிலுள்ள சேகரிப்பு மையங்கள்',
    recentOrders: 'சமீபத்திய ஆர்டர்கள்',
    quickActions: 'விரைவு நடவடிக்கைகள்',
    newOrder: 'புதிய ஆர்டர்',
    viewInventory: 'சரக்குகளைப் பார்க்க',
    downloadReport: 'அறிக்கையைப் பதிவிறக்க',
    manageContracts: 'ஒப்பந்தங்களை நிர்வகிக்க',
    riceVarieties: {
      kekulu: 'கேகுலு',
      samba: 'சம்பா',
      nadu: 'நாடு',
      basmati: 'பாஸ்மதி'
    },
    locations: {
      ratnapura: 'ரத்னபுர',
      embilipitiya: 'எம்பிலிபிட்டியா',
      balangoda: 'பலங்கொட',
      matara: 'மாத்தறை',
      galle: 'காலி'
    },
    status: {
      active: 'செயலில்',
      pending: 'நிலுவையில்',
      completed: 'முடிக்கப்பட்டது',
      processing: 'செயலாக்கம்',
      delivered: 'வழங்கப்பட்டது'
    }
  }
};

const useLanguage = () => {
  const [language, setLanguage] = useState('en');
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  return { language, setLanguage, t };
};

export default useLanguage;
