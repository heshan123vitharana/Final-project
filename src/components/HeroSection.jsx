import { useState, useEffect } from 'react';
// Import removed - unused utilities

/**
 * HeroSection Component
 * 
 * A dynamic hero section with rotating background images, animated content,
 * and call-to-action buttons for the Paddy Marketing Board website.
 * 
 * Features:
 * - Auto-rotating background images with smooth transitions
 * - Sri Lankan rice and farming focused content
 * - Interactive navigation buttons
 * - Manual slide control with dots
 * - Responsive design optimized for all devices
 */
const HeroSection = () => {
  // State to track the currently active background image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // State for current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  /**
   * Configuration for background images and their associated content
   * Each slide contains clean styling and professional content
   */
  const backgroundImages = [
    {
      image: "bg-1.jpg",
      gradient: "from-purple-600/60 to-pink-600/60",
      title: "Premium Sri Lankan Rice",
      mainTitle: "PREMIUM",
      mainSubtitle: "QUALITY RICE",
      subtitle: "From our fertile fields to your table",
      description: "Experience the finest quality rice, carefully selected and processed by the Paddy Marketing Board of Sri Lanka for over 50 years.",
      accent: "text-pink-200"
    },
    {
      image: "bg-2.jpg",
      gradient: "from-amber-600/60 to-orange-600/60",
      title: "Quality Assurance",
      mainTitle: "TRUSTED",
      mainSubtitle: "EXCELLENCE",
      subtitle: "Certified quality, batch by batch",
      description: "Every grain meets our strict quality standards. Government-tested and certified rice varieties for your family's nutrition and health.",
      accent: "text-amber-200"
    },
    {
      image: "bg-3.jpg",
      gradient: "from-emerald-600/60 to-green-600/60",
      title: "Sustainable Farming",
      mainTitle: "ECO-FRIENDLY",
      mainSubtitle: "CULTIVATION",
      subtitle: "Protecting Sri Lanka's agricultural heritage",
      description: "Supporting sustainable farming practices across the island, ensuring environmental protection while maintaining high productivity for future generations.",
      accent: "text-emerald-200"
    },
    {
      image: "bg-4.jpg",
      gradient: "from-blue-600/60 to-indigo-600/60",
      title: "Supporting Farmers",
      mainTitle: "FARMER",
      mainSubtitle: "EMPOWERMENT",
      subtitle: "Fair prices, guaranteed procurement",
      description: "Directly supporting over 1.8 million farming families across Sri Lanka with guaranteed minimum prices and reliable procurement services.",
      accent: "text-blue-200"
    },
    {
      image: "bg-5.jpg",
      gradient: "from-yellow-600/60 to-red-600/60",
      title: "Island-wide Network",
      mainTitle: "NATIONWIDE",
      mainSubtitle: "DISTRIBUTION",
      subtitle: "Serving all 25 districts of Sri Lanka",
      description: "Comprehensive distribution network ensuring fresh, quality rice reaches every corner of the island through our extensive collection centers and retail outlets.",
      accent: "text-yellow-200"
    }
  ];

  /**
   * Auto-rotation effect with different transition effects for each background image
   * Changes the active slide every 5 seconds with varied transition styles
   */
  useEffect(() => {
    const ROTATION_INTERVAL = 8000; // slower rotation for a calmer feel
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % backgroundImages.length;
        
        // Add different transition effects based on the image being transitioned to
        const transitionEffects = [
          'slide-right',    // For bg-1.jpg - Premium Quality
          'fade-zoom',      // For bg-2.jpg - Quality Assurance  
          'slide-up',       // For bg-3.jpg - Sustainable Farming
          'rotate-fade',    // For bg-4.jpg - Farm to Table
          'slide-left'      // For bg-5.jpg - Island-wide Distribution
        ];
        
        // Trigger custom transition effect
        document.documentElement.style.setProperty('--hero-transition-effect', transitionEffects[nextIndex]);
        
        return nextIndex;
      });
    }, ROTATION_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  /**
   * Real-time date and time update effect
   * Updates every second to show current date and time
   */
  useEffect(() => {
    const dateTimeInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(dateTimeInterval);
  }, []);

  /**
   * Handles manual navigation to specific slide
   * @param {number} index - The index of the slide to navigate to
   */
  const handleSlideNavigation = (index) => {
    setCurrentImageIndex(index);
  };

  /**
   * Gets the current slide data for dynamic content rendering
   * @returns {Object} Current slide configuration
   */
  const currentSlide = backgroundImages[currentImageIndex];

  /**
   * Formats the current date and time for display
   * @returns {Object} Formatted date and time information
   */
  const getFormattedDateTime = () => {
    const options = {
      timeZone: 'Asia/Colombo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };

    const sriLankanTime = currentDateTime.toLocaleString('en-US', options);
    const parts = sriLankanTime.split(', ');
    
    return {
      weekday: parts[0],
      date: parts[1],
      time: parts[2],
      year: currentDateTime.getFullYear(),
      month: currentDateTime.toLocaleString('en-US', { month: 'long', timeZone: 'Asia/Colombo' }),
      day: currentDateTime.getDate()
    };
  };

  return (
    <section className="relative h-[100svh] flex items-center overflow-hidden overscroll-none bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Date and Time Top Bar */}
      {renderDateTimeTopBar()}
      
      {/* Background Image Carousel */}
      {renderBackgroundImages()}
      
      {/* Professional Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-blue-900/10 z-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-20" />
      
      {/* Modern Decorative Elements */}
      {renderModernDecorations()}
      
      {/* Enhanced Main Content */}
      {renderEnhancedMainContent()}
      
      {/* Professional Navigation Dots */}
      {renderProfessionalNavigationDots()}
      
      {/* Modern Scroll Indicator */}
      {renderModernScrollIndicator()}
    </section>
  );

  /**
   * Renders the date and time top bar
   * @returns {JSX.Element} Date time top bar element
   */
  function renderDateTimeTopBar() {
    const { weekday, time, year, month, day } = getFormattedDateTime();
    
    console.log('🔧 Rendering DateTime Top Bar:', { weekday, month, day, year, time });
    
    return (
      <div className="absolute top-0 left-0 right-0 z-[999] bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-md border-b-2 border-emerald-400/30 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-white">
            {/* Left side - Weekday and Date */}
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">
                <span className="text-emerald-400 font-bold text-base">{weekday}</span>
                <span className="mx-2 text-white/60">•</span>
                <span className="text-white/95 font-medium">{month} {day}, {year}</span>
              </div>
              <div className="hidden sm:flex items-center text-xs text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-full">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Today
              </div>
            </div>
            
            {/* Center - Government Official Text */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-600/50 border border-blue-400/50 shadow-md">
                {/* Sri Lankan Flag */}
                <div className="w-6 h-4 relative rounded-sm overflow-hidden shadow-sm border border-yellow-400/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600"></div>
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-green-600 to-green-700"></div>
                  <div className="absolute left-1.5 top-0.5 w-3 h-2.5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-sm flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-white">
                  An Official Website of the Government of Sri Lanka
                </span>
              </div>
            </div>
            
            {/* Right side - Current Time */}
            <div className="flex items-center space-x-3">
              <div className="text-base font-mono font-bold text-white bg-slate-700/80 px-4 py-2 rounded-lg border-2 border-emerald-400/40 shadow-lg">
                {time}
              </div>
              <div className="hidden lg:flex items-center text-xs text-emerald-300">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse mr-2 shadow-lg shadow-emerald-400/50"></div>
                <span className="font-medium">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders the rotating background images with clean, professional transitions
   * @returns {JSX.Element} Background image elements
   */
  function renderBackgroundImages() {
  return backgroundImages.map((bg, index) => {
      const isActive = index === currentImageIndex;
      
      return (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            isActive 
              ? 'opacity-100 scale-100 z-10' 
              : 'opacity-0 scale-105 z-0'
          }`}
          style={{
            backgroundImage: `url(/${bg.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
      {/* Subtle dark overlays for professional contrast */}
      <div className="absolute inset-0 bg-black/15 md:bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      {/* Stronger bottom gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
        </div>
      );
    });
  }



  /**
   * Renders modern decorative elements
   */
  function renderModernDecorations() {
    return null;
  }

  /**
   * Renders enhanced main content with modern design
   */
  function renderEnhancedMainContent() {
    return (
  <div className="container mx-auto px-6 relative z-10 h-full flex items-center md:items-start justify-center md:justify-start pt-6 sm:pt-8 md:pt-24 lg:pt-32 xl:pt-36">
        <div className="max-w-4xl w-full text-center md:text-left mx-auto md:mx-0">
          <div className="inline-flex items-center rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-semibold text-emerald-100 ring-1 ring-emerald-300/40 shadow-sm mb-3 animate-fade-in">
            {currentSlide.title}
          </div>
          <h2 className="text-[2.75rem] md:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-md animate-slide-up">
            {currentSlide.mainTitle}
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-lime-200">{currentSlide.mainSubtitle}</span>
          </h2>
          <p className="text-lg md:text-2xl text-white/90 mt-4 leading-relaxed animate-fade-in-delayed">
            {currentSlide.subtitle}
          </p>
          <p className="text-base md:text-xl text-white/85 mt-3 leading-relaxed animate-fade-in">
            {currentSlide.description}
          </p>
        </div>
      </div>
    );
  }

  /**
   * Renders navigation dots for manual slide control
   * @returns {JSX.Element} Navigation dots
   */
  function _UNUSED_renderNavigationDots() {
    return (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideNavigation(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-emerald-600 scale-110' 
                : 'bg-emerald-300/60 hover:bg-emerald-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    );
  }

  /**
   * Renders professional navigation dots for manual slide control
   */
  function renderProfessionalNavigationDots() {
    return (
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideNavigation(index)}
            className={`group relative w-3 h-3 transition-all duration-300 ${
              index === currentImageIndex 
                ? 'scale-110' 
                : 'hover:scale-105'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`w-full h-full rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-white shadow-lg ring-2 ring-white/50'
                : 'bg-white/40 hover:bg-white/60'
            }`} />
            {index === currentImageIndex && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 opacity-80 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    );
  }

  /**
   * Renders modern scroll indicator
   */
  function renderModernScrollIndicator() {
    return (
      <div className="absolute bottom-8 right-8 z-30">
        <div className="group cursor-pointer animate-bounce">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
};

export default HeroSection;
