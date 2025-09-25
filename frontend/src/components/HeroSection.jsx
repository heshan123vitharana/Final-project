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
  // (Removed local date/time state – handled by Header)
  
  /**
   * Configuration for background images and their associated content
   * Each slide contains clean styling and professional content
   */
  const backgroundImages = [
    {
      image: "bg-1.jpg",
      gradient: "from-purple-600/60 to-pink-600/60",
      title: "Premium Quality",
      mainTitle: "PREMIUM",
      mainSubtitle: "SRI LANKAN RICE",
      subtitle: "From fertile fields to your table",
      description: "50+ years of trusted quality rice production by Sri Lanka's Paddy Marketing Board.",
      accent: "text-pink-200"
    },
    {
      image: "bg-2.jpg",
      gradient: "from-amber-600/60 to-orange-600/60",
      title: "Quality Assured",
      mainTitle: "CERTIFIED",
      mainSubtitle: "EXCELLENCE",
      subtitle: "Government-tested quality standards",
      description: "Every grain certified for nutrition, health and family satisfaction.",
      accent: "text-amber-200"
    },
    {
      image: "bg-3.jpg",
      gradient: "from-emerald-600/60 to-green-600/60",
      title: "Sustainable Farming",
      mainTitle: "ECO-FRIENDLY",
      mainSubtitle: "AGRICULTURE",
      subtitle: "Protecting our agricultural heritage",
      description: "Sustainable farming practices ensuring environmental protection and future productivity.",
      accent: "text-emerald-200"
    },
    {
      image: "bg-4.jpg",
      gradient: "from-green-600/60 to-emerald-600/60",
      title: "Farmer Support",
      mainTitle: "EMPOWERING",
      mainSubtitle: "FARMERS",
      subtitle: "Fair prices, guaranteed support",
      description: "Supporting 1.8 million farming families with guaranteed minimum prices nationwide.",
      accent: "text-green-200"
    },
    {
      image: "bg-5.jpg",
      gradient: "from-yellow-600/60 to-red-600/60",
      title: "Nationwide Service",
      mainTitle: "ISLAND-WIDE",
      mainSubtitle: "NETWORK",
      subtitle: "Serving all 25 districts",
      description: "Comprehensive distribution ensuring fresh, quality rice reaches every corner of Sri Lanka.",
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

  // (Removed local date/time updater – global header handles real-time clock)

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

  // (Removed date/time formatting util – not needed locally)

  return (
    <section className="relative h-[100svh] flex items-center overflow-hidden overscroll-none bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
  {/* Top bar removed (handled globally in Header) */}
      
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
    </section>
  );

  // (Removed renderDateTimeTopBar – unified top bar is in Header)

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
      <div className="container mx-auto px-6 relative z-10 h-full flex items-start pt-6 sm:pt-8 md:pt-16 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 w-full min-h-full">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left lg:pr-8 flex flex-col justify-center">
            <h2 className="text-[2.5rem] md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-md animate-slide-up">
              {currentSlide.mainTitle}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-lime-200">{currentSlide.mainSubtitle}</span>
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mt-4 leading-relaxed animate-fade-in-delayed">
              {currentSlide.subtitle}
            </p>
            <p className="text-base md:text-lg lg:text-xl text-white/85 mt-3 leading-relaxed animate-fade-in max-w-2xl">
              {currentSlide.description}
            </p>
          </div>
          
          {/* Right side - Farmer illustration */}
          <div className="relative flex items-end justify-center lg:justify-end h-full overflow-hidden">
            <div className="relative w-full h-full flex items-end justify-center">
              <img 
                src="/farmer.png" 
                alt="Sri Lankan Farmer" 
                className="relative z-10 w-full h-full max-w-[28rem] max-h-[36rem] md:max-w-[34rem] md:max-h-[42rem] lg:max-w-[40rem] lg:max-h-[48rem] xl:max-w-[46rem] xl:max-h-[54rem] 2xl:max-w-[52rem] 2xl:max-h-[60rem] object-contain object-bottom"
                style={{
                  objectPosition: 'bottom center'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              {/* Fallback placeholder when image is not found */}
              <div className="relative z-10 w-full h-full max-w-[28rem] max-h-[36rem] md:max-w-[34rem] md:max-h-[42rem] lg:max-w-[40rem] lg:max-h-[48rem] xl:max-w-[46rem] xl:max-h-[54rem] 2xl:max-w-[52rem] 2xl:max-h-[60rem] bg-gradient-to-br from-emerald-400/30 to-green-600/30 rounded-2xl backdrop-blur-sm border border-white/20 hidden items-center justify-center text-center p-8">
                <div>
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <p className="text-white/80 text-sm">Add farmer.png to public folder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
};

export default HeroSection;
