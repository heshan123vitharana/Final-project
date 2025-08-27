import { useState, useEffect } from 'react';
import { getHeaderHeight, scrollIntoViewWithOffset, smoothScrollTo } from '../utils/scroll';

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

  return (
    <section className="relative h-[100svh] flex items-center overflow-hidden overscroll-none">
      {/* Background Image Carousel */}
      {renderBackgroundImages()}
      
      {/* Overlay for better text readability */}
      {renderOverlay()}
      
      {/* Decorative floating elements */}
      {renderFloatingDecorations()}
      
      {/* Main content area */}
      {renderMainContent()}
      
      {/* Navigation dots */}
      {renderNavigationDots()}
      
      {/* Scroll indicator */}
      {renderScrollIndicator()}
    </section>
  );

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
   * Renders the overlay for improved text contrast
   * @returns {JSX.Element} Overlay element
   */
  function renderOverlay() {
    return null; // Overlays are now handled in background images for better performance
  }

  /**
   * Renders floating rice grain and wheat decorations
   * @returns {JSX.Element} Decorative elements
   */
  function renderFloatingDecorations() {
    return null; // Remove busy floating decorations for a calm, professional look
  }

  /**
   * Renders the main content area with dynamic text
   * @returns {JSX.Element} Main content section
   */
  function renderMainContent() {
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
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center md:items-start">
              <button 
                onClick={() => {
                  // Add click feedback
                  console.log('Explore Services button clicked');
                  
                  // Navigate to platform features section (About page)
                  const aboutSection = document.getElementById('platform-features-section');
                  if (aboutSection) {
                    console.log('About section found, scrolling...');
                    const headerHeight = getHeaderHeight(80);
                    scrollIntoViewWithOffset(aboutSection, headerHeight);
                  } else {
                    console.log('About section not found, trying alternative...');
                    // Try alternative section ID
                    const altSection = document.getElementById('about');
                    if (altSection) {
                      const headerHeight = getHeaderHeight(80);
                      scrollIntoViewWithOffset(altSection, headerHeight);
                    } else {
                      // Scroll to approximate position
                      smoothScrollTo(window.innerHeight * 1.2);
                    }
                  }
                }}
                  className="group relative overflow-hidden text-white px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2.5 min-w-[180px] bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md">
                <div className="relative z-10 p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                  <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="relative z-10">Explore Services</span>
                <svg className="w-4 h-4 relative z-10 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {/* Secondary CTA - Collection Centers scroll */}
              <button
                onClick={() => {
                  console.log('Collection Centers button clicked');
                  const el = document.getElementById('collection-centers');
                  if (el) {
                    console.log('Collection Centers section found, scrolling...');
                    const headerHeight = getHeaderHeight(80);
                    scrollIntoViewWithOffset(el, headerHeight);
                  } else {
                    console.log('Collection Centers section not found');
                    // Scroll to approximate position if section not found
                    smoothScrollTo(window.innerHeight * 2);
                  }
                }}
                  className="group relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2.5 min-w-[180px] border border-white/30 text-white bg-white/10 hover:bg-white/15"
              >
                <div className="relative z-10 p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-all duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="relative z-10">Collection Centers</span>
                <svg className="w-4 h-4 relative z-10 opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
        </div>
      </div>
    );
  }

  /**
   * Renders navigation dots for manual slide control
   * @returns {JSX.Element} Navigation dots
   */
  function renderNavigationDots() {
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
   * Renders the scroll indicator
   * @returns {JSX.Element} Scroll indicator
   */
  function renderScrollIndicator() {
    return (
      <div className="absolute bottom-8 right-8 text-white animate-bounce z-20 scroll-indicator">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    );
  }
};

export default HeroSection;
