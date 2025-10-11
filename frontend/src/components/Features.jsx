import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  // Removed unused state variables: activeFeature, setActiveFeature, hoveredFeature, setHoveredFeature

  // Fetch services and excellence data from API
  const fetchServicesData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/services-excellence');

      if (!response.ok) {
        throw new Error('Failed to fetch services data');
      }

      const data = await response.json();
      // Filter for active items only
      const activeServices = (data.data || []).filter(item => item.is_active || item.isActive);
      setServicesData(activeServices);
    } catch (error) {
      console.error('Error fetching services data:', error);
      toast.error('Failed to load services data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsVisible(true);
    fetchServicesData();
  }, []);

  // Icon mapping based on service type or icon field
  const getServiceIcon = (service) => {
    const iconType = service.icon || service.type || 'default';

    // If it's an emoji, return it directly
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    if (emojiRegex.test(iconType)) {
      return <span className="text-2xl">{iconType}</span>;
    }

    const iconMap = {
      // Agricultural Services
      'farming': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.8 7.8L20 8L16 12L17.6 19.2L12 16L6.4 19.2L8 12L4 8L10.2 7.8L12 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 16L8 20L12 20L16 20L12 16Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'agriculture': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C10.5 4 9 7.5 9 12C9 16.5 10.5 20 12 22C13.5 20 15 16.5 15 12C15 7.5 13.5 4 12 2Z" stroke="#22C55E" strokeWidth="2"/>
          <path d="M3 12H8M16 12H21M12 3V8M12 16V21" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'rice': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L8 6L12 10L16 6L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 10V22M8 14L12 18L16 14M6 18L12 22L18 18" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'paddy': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14 8L20 6L16 12L22 14L16 16L20 18L14 16L12 22L10 16L4 18L8 16L2 14L8 12L4 6L10 8L12 2Z" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),

      // Quality & Standards
      'quality': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="#2563EB" strokeWidth="2"/>
        </svg>
      ),
      'standards': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21S3 16.97 3 12S7.03 3 12 3S21 7.03 21 12Z" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'certification': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20M16 13L18 15L22 11" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'testing': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11L12 14L20 6M21 12C21 16.97 16.97 21 12 21S3 16.97 3 12S7.03 3 12 3" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 8L17 12L15 10" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),

      // Government Services
      'service': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5 20.5 21 20 21H4C3.5 21 3 20.5 3 20V9Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'government': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 21V5C5 4.45 5.45 4 6 4H18C18.55 4 19 4.45 19 5V21L12 17L5 21Z" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 8H15M9 12H15" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'public': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21M20 8V21C20 21.55 19.55 22 19 22H5C4.45 22 4 21.55 4 21V8L12 2L20 8Z" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="11" r="2" stroke="#0F766E" strokeWidth="2"/>
        </svg>
      ),

      // Technology & Innovation
      'technology': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7V4C4 3.45 4.45 3 5 3H19C19.55 3 20 3.45 20 4V7M4 7C2.9 7 2 7.9 2 9V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V9C22 7.9 21.1 7 20 7M4 7H20" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="13" r="2" stroke="#7C2D12" strokeWidth="2"/>
        </svg>
      ),
      'digital': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#6366F1" strokeWidth="2"/>
          <path d="M8 21L16 21M12 17L12 21" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 8L10 11L17 7" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'innovation': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12L11 14L15 10M12 2L13.09 8.26L19 9L14 14L15.18 20L12 16.77L8.82 20L10 14L5 9L10.91 8.26L12 2Z" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),

      // Excellence & Awards
      'excellence': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" fill="#F59E0B" fillOpacity="0.2"/>
        </svg>
      ),
      'achievement': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 2L18 9L21.5 6L18 20H6L2.5 6L6 9Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 7V13M9 10L15 10" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'award': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="6" stroke="#D97706" strokeWidth="2"/>
          <path d="M15.8 11.8L19 22L12 19L5 22L8.2 11.8" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="8" r="2" fill="#D97706" fillOpacity="0.3"/>
        </svg>
      ),

      // Support & Analytics
      'support': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15C21 15.5 20.8 16 20.5 16.5L18.5 18.5C18 19 17.5 19.2 17 19.2C16.5 19.2 16 19 15.5 18.5L13.5 16.5C13 16 12.8 15.5 12.8 15C12.8 14.5 13 14 13.5 13.5L15.5 11.5C16 11 16.5 10.8 17 10.8C17.5 10.8 18 11 18.5 11.5L20.5 13.5C21 14 21.2 14.5 21.2 15H21Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2"/>
          <path d="M9.09 9C9.33 8.47 9.76 8 10.17 7.76C10.58 7.52 11.28 7.5 12 7.5S13.42 7.52 13.83 7.76C14.24 8 14.67 8.47 14.91 9" stroke="#10B981" strokeWidth="2"/>
        </svg>
      ),
      'analytics': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3V21H21" stroke="#7F22FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 16L12 8L16 12L21 4" stroke="#7F22FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7" cy="16" r="2" stroke="#7F22FE" strokeWidth="2"/>
          <circle cx="12" cy="8" r="2" stroke="#7F22FE" strokeWidth="2"/>
          <circle cx="16" cy="12" r="2" stroke="#7F22FE" strokeWidth="2"/>
        </svg>
      ),
      'reports': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#F54900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="#F54900" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'monitoring': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="#0891B2" strokeWidth="2"/>
          <path d="M12 1L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 1Z" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),

      // Sustainability & Environment
      'sustainability': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L8 8L2 12L8 16L12 22L16 16L22 12L16 8L12 2Z" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="4" stroke="#14B8A6" strokeWidth="2"/>
          <path d="M10 10L14 14M14 10L10 14" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'environment': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 8C17 10.76 14.76 13 12 13S7 10.76 7 8C7 5.24 9.24 3 12 3S17 5.24 17 8Z" stroke="#059669" strokeWidth="2"/>
          <path d="M12 13V21M8 17L12 21L16 17" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18C6 15 12 15 15 18C18 21 21 21 21 21" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'organic': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8 6 8 14 12 22C16 14 16 6 12 2Z" stroke="#16A34A" strokeWidth="2"/>
          <path d="M8 12C6 8 6 4 8 2C10 4 10 8 8 12Z" stroke="#16A34A" strokeWidth="2"/>
          <path d="M16 12C18 8 18 4 16 2C14 4 14 8 16 12Z" stroke="#16A34A" strokeWidth="2"/>
        </svg>
      ),

      // Security & Legal
      'security': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22S8 18 8 13V6L12 4L16 6V13C16 18 12 22 12 22Z" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="#00A63E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'compliance': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="#DC2626" strokeWidth="2"/>
          <path d="M9 10L11 12L15 8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 20V22H17V20" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),

      // Default fallback
      'default': (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2"/>
          <path d="M9 12L11 14L15 10" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };

    return iconMap[iconType.toLowerCase()] || iconMap['default'];
  };

  // This variable is no longer needed for the accordion-style animation
  // const selectedService = selectedId && servicesData.find(s => (s.id || s.title) === selectedId);

  // Get background color for service cards
  const UNUSED_getServiceBgColor = (service) => {
    const colors = [
      'bg-violet-100', 'bg-green-100', 'bg-orange-100',
      'bg-blue-100', 'bg-emerald-100', 'bg-teal-100'
    ];
    const index = service.id ? service.id % colors.length : 0;
    return colors[index];
  };

  // Modern Gallery Content Data
  const UNUSED_galleryItems = [
    {
      type: "leadership",
      title: "Visionary Leadership",
      subtitle: "Guiding Sri Lanka's Rice Revolution",
      description: "Our experienced leadership team combines decades of agricultural expertise with modern innovation to drive sustainable growth in Sri Lanka's rice industry.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop&crop=faces",
      stats: "50+ Years Combined Experience",
      color: "emerald",
      category: "Leadership"
    },
    {
      type: "art",
      title: "Heritage & Culture",
      subtitle: "Celebrating Rice Farming Traditions",
      description: "Honoring the rich cultural heritage of Sri Lankan rice farming through traditional practices merged with contemporary agricultural science.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop",
      stats: "2000+ Years of Tradition",
      color: "amber",
      category: "Heritage"
    },
    {
      type: "innovation",
      title: "Digital Transformation",
      subtitle: "Technology Meets Agriculture",
      description: "Revolutionary digital solutions transforming how we manage, process, and distribute rice across the island nation.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
      stats: "100% Digital Platform",
      color: "blue",
      category: "Innovation"
    },
    {
      type: "community",
      title: "Farmer Community",
      subtitle: "Empowering Agricultural Excellence",
      description: "Building strong relationships with farming communities to ensure sustainable livelihoods and premium quality rice production.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop",
      stats: "10,000+ Active Farmers",
      color: "green",
      category: "Community"
    },
    {
      type: "sustainability",
      title: "Sustainable Practices",
      subtitle: "Environmental Stewardship",
      description: "Implementing eco-friendly farming methods and sustainable practices to protect our environment for future generations.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop",
      stats: "Carbon Neutral by 2030",
      color: "teal",
      category: "Sustainability"
    },
    {
      type: "quality",
      title: "Premium Quality",
      subtitle: "Excellence in Every Grain",
      description: "Rigorous quality control processes ensuring every grain meets international standards for nutrition and taste.",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop",
      stats: "99.9% Quality Assurance",
      color: "purple",
      category: "Quality"
    }
  ];

  const UNUSED_getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        bgLight: 'from-emerald-50 to-emerald-100',
        text: 'text-emerald-600',
        textLight: 'text-emerald-50',
        border: 'border-emerald-200',
        accent: 'bg-emerald-500'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        bgLight: 'from-green-50 to-green-100',
        text: 'text-green-600',
        textLight: 'text-green-50',
        border: 'border-green-200',
        accent: 'bg-green-500'
      },
      teal: {
        bg: 'from-teal-500 to-teal-600',
        bgLight: 'from-teal-50 to-teal-100',
        text: 'text-teal-600',
        textLight: 'text-teal-50',
        border: 'border-teal-200',
        accent: 'bg-teal-500'
      },
      blue: {
        bg: 'from-blue-500 to-blue-600',
        bgLight: 'from-blue-50 to-blue-100',
        text: 'text-blue-600',
        textLight: 'text-blue-50',
        border: 'border-blue-200',
        accent: 'bg-blue-500'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        bgLight: 'from-purple-50 to-purple-100',
        text: 'text-purple-600',
        textLight: 'text-purple-50',
        border: 'border-purple-200',
        accent: 'bg-purple-500'
      },
      amber: {
        bg: 'from-amber-500 to-amber-600',
        bgLight: 'from-amber-50 to-amber-100',
        text: 'text-amber-600',
        textLight: 'text-amber-50',
        border: 'border-amber-200',
        accent: 'bg-amber-500'
      }
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
      <section id="features" className="relative min-h-screen overflow-hidden bg-white">
      {/* Clean White Background with Subtle Elements */}
      <div className="absolute inset-0 bg-white">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating subtle elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-emerald-100/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-16 w-48 h-48 bg-amber-100/30 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
            Services & <span className="text-emerald-600 font-semibold">Excellence</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed font-normal mt-4 max-w-2xl mx-auto">
            Discover our commitment to quality, innovation, and support for Sri Lanka's agricultural sector.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
              Explore All Services
            </button>
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="px-6 py-3 bg-transparent border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Overview
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="mt-12">
          {loading ? (
            <div className="flex justify-center items-center p-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {servicesData.length === 0 ? (
                <div className="text-center py-6 text-gray-600 bg-gray-50 rounded-lg">
                  <p>No services available at the moment.</p>
                </div>
              ) : (
                servicesData.slice(0, 4).map((service, index) => {
                  const cardId = service.id || service.title;
                  const isSelected = selectedId === cardId;

                  return (
                    <Motion.div 
                      key={cardId} 
                      layout
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onClick={() => setSelectedId(isSelected ? null : cardId)}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 group cursor-pointer overflow-hidden"
                    >
                      <Motion.div layout="position" className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-5 flex-grow">
                          {/* Numbered Icon */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center rounded-full border-2 border-white ring-2 ring-gray-100 group-hover:ring-emerald-200 transition-all duration-300">
                              {getServiceIcon(service)}
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white">
                              {String(index + 1).padStart(2, '0')}
                            </div>
                          </div>

                          {/* Title and Description */}
                          <div className="flex-grow">
                            <h3 className="text-lg font-bold text-gray-800">{service.title}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                          </div>
                        </div>

                        {/* Category Tag */}
                        <div className="flex-shrink-0 ml-4">
                          <div className="bg-emerald-100 border border-emerald-200 rounded-lg px-4 py-2 text-center">
                            <div className="text-xs text-emerald-700 font-medium uppercase tracking-wider">Category</div>
                            <div className="text-emerald-800 font-semibold text-sm capitalize">{service.type || 'General'}</div>
                          </div>
                        </div>
                      </Motion.div>

                      <AnimatePresence>
                        {isSelected && (
                          <Motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.4, ease: "easeInOut" } }}
                            exit={{ opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
                            className="px-6 pb-6"
                          >
                            <div className="border-t border-gray-200 pt-4">
                              <p className="text-gray-700 leading-relaxed mb-4">{service.description}</p>
                              
                              {service.features && service.features.length > 0 && (
                                <div>
                                  <h4 className="text-md font-semibold text-emerald-800 mb-3">Key Features</h4>
                                  <ul className="space-y-2">
                                    {service.features.map((feature, idx) => (
                                      <li key={idx} className="flex items-center gap-3 text-gray-600">
                                        <div className="w-5 h-5 flex-shrink-0 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </Motion.div>
                        )}
                      </AnimatePresence>
                    </Motion.div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isVideoModalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <Motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-black rounded-lg shadow-2xl overflow-hidden w-full max-w-3xl relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
              <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/BTbW6nSHEUw?autoplay=1&rel=0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm hover:bg-white text-gray-900 rounded-full w-9 h-9 flex items-center justify-center text-3xl font-light leading-none transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close video"
              >
                &times;
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* The modal is no longer needed for this animation style */}
      </section>
    </>
  );
};

export default Features;
