import { useState, useEffect } from 'react';
import PageTitle from './PageTitle';
import Card from './ui/Card';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Modern Gallery Content Data
  const galleryItems = [
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

  const getColorClasses = (color) => {
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
    <section id="features" className="relative min-h-screen gov-section-bg overflow-hidden py-24">
      {/* Very Light Background Elements */}
      <div className="absolute inset-0">
        {/* Ultra light gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-white/80 to-emerald-50/15"></div>
        
        {/* Very subtle floating elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gray-100/5 rounded-full blur-3xl animate-pulse delay-2000" style={{ animationDuration: '8s' }}></div>
        
        {/* Almost invisible grid pattern */}
        <div className="absolute inset-0 opacity-[0.008]">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.05) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Government Excellence Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
            Services & Excellence
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Discover our commitment to serving Sri Lankan farmers and citizens through professional government 
            services, quality assurance, and agricultural excellence backed by decades of expertise.
          </p>
        </div>

        {/* Modern Masonry Gallery Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {galleryItems.map((item, index) => {
            const colors = getColorClasses(item.color);
            const isLarge = index % 4 === 0; // Make every 4th item larger
            
            return (
              <div
                key={index}
                className={`gov-card group relative break-inside-avoid mb-8 overflow-hidden cursor-pointer hover:-translate-y-3 ${
                  isLarge ? 'lg:col-span-2' : ''
                }`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Image Container with Overlay */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500`}></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${colors.accent} ${colors.textLight} shadow-lg`}>
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className={`text-xs font-semibold ${colors.text}`}>
                        {item.stats}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 md:p-8">
                  {/* Subtitle */}
                  <p className={`text-sm font-medium ${colors.text} mb-2 tracking-wide uppercase`}>
                    {item.subtitle}
                  </p>
                  
                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                    {item.description}
                  </p>
                  
                  {/* Action Area */}
                  <div className="flex items-center justify-between">
                    <button className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${colors.bg} text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg`}>
                      <span>Explore</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    
                    {/* Type Indicator */}
                    <div className={`w-3 h-3 rounded-full ${colors.accent} animate-pulse`}></div>
                  </div>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-5 transition-all duration-500 pointer-events-none`}></div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;
