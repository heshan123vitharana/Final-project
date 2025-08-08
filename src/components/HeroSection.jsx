import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * HeroSection Component
 * 
 * A dynamic hero section with rotating background images, animated content,
 * and decorative elements for the Paddy Marketing Board website.
 * 
 * Features:
 * - Auto-rotating background images with smooth transitions
 * - Dynamic content based on current slide
 * - Floating rice grain animations
 * - Navigation dots for manual slide control
 * - Responsive design with mobile-first approach
 */
const HeroSection = () => {
  // State to track the currently active background image
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { t } = useTranslation();
  
  /**
   * Configuration for background images and their associated content
   * Each slide contains clean styling and professional content
   */
  const backgroundImages = [
    {
      image: "bg-1.jpg",
      gradient: "from-purple-600/60 to-pink-600/60",
      title: t('hero.slides.premium.title'),
      mainTitle: t('hero.slides.premium.main_title'),
      mainSubtitle: t('hero.slides.premium.main_subtitle'),
      subtitle: t('hero.slides.premium.subtitle'),
      description: t('hero.slides.premium.description'),
      accent: "text-pink-200"
    },
    {
      image: "bg-2.jpg",
      gradient: "from-amber-600/60 to-orange-600/60",
      title: t('hero.slides.quality.title'),
      mainTitle: t('hero.slides.quality.main_title'),
      mainSubtitle: t('hero.slides.quality.main_subtitle'),
      subtitle: t('hero.slides.quality.subtitle'),
      description: t('hero.slides.quality.description'),
      accent: "text-amber-200"
    },
    {
      image: "bg-3.jpg",
      gradient: "from-emerald-600/60 to-green-600/60",
      title: t('hero.slides.sustainable.title'),
      mainTitle: t('hero.slides.sustainable.main_title'),
      mainSubtitle: t('hero.slides.sustainable.main_subtitle'),
      subtitle: t('hero.slides.sustainable.subtitle'),
      description: t('hero.slides.sustainable.description'),
      accent: "text-emerald-200"
    },
    {
      image: "bg-4.jpg",
      gradient: "from-blue-600/60 to-indigo-600/60",
      title: t('hero.slides.farm_to_table.title'),
      mainTitle: t('hero.slides.farm_to_table.main_title'),
      mainSubtitle: t('hero.slides.farm_to_table.main_subtitle'),
      subtitle: t('hero.slides.farm_to_table.subtitle'),
      description: t('hero.slides.farm_to_table.description'),
      accent: "text-blue-200"
    },
    {
      image: "bg-5.jpg",
      gradient: "from-yellow-600/60 to-red-600/60",
      title: t('hero.slides.distribution.title'),
      mainTitle: t('hero.slides.distribution.main_title'),
      mainSubtitle: t('hero.slides.distribution.main_subtitle'),
      subtitle: t('hero.slides.distribution.subtitle'),
      description: t('hero.slides.distribution.description'),
      accent: "text-yellow-200"
    }
  ];

  /**
   * Auto-rotation effect with different transition effects for each background image
   * Changes the active slide every 5 seconds with varied transition styles
   */
  useEffect(() => {
    const ROTATION_INTERVAL = 5000; // 5 seconds per slide for better viewing
    
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
  }, [backgroundImages.length, t]);

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
    <section className="relative min-h-screen flex items-center overflow-hidden">
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
          {/* Professional overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Subtle gradient overlay for visual depth */}
          <div className={`absolute inset-0 bg-gradient-to-br ${bg.gradient} opacity-30`} />
          
          {/* Bottom gradient for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Subtle vignette effect */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
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
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Left side rice grains */}
        <div className="absolute top-20 left-16 w-6 h-14 bg-white/20 rounded-full animate-float-slow transform rotate-12 backdrop-blur-sm" />
        <div className="absolute top-32 left-32 w-4 h-10 bg-white/15 rounded-full animate-float transform -rotate-45 backdrop-blur-sm" />
        <div className="absolute top-48 left-20 w-5 h-12 bg-white/25 rounded-full animate-float-delayed transform rotate-30 backdrop-blur-sm" />
        
        {/* Right side rice grains */}
        <div className="absolute top-24 right-20 w-6 h-14 bg-white/20 rounded-full animate-float transform -rotate-12 backdrop-blur-sm" />
        <div className="absolute top-40 right-32 w-4 h-10 bg-white/15 rounded-full animate-float-delayed transform rotate-45 backdrop-blur-sm" />
        <div className="absolute top-56 right-16 w-5 h-12 bg-white/25 rounded-full animate-float-slow transform -rotate-30 backdrop-blur-sm" />

        {/* Animated wheat stems for agricultural theme */}
        <div className="absolute top-16 left-1/4 w-40 h-40 animate-float-reverse opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M50,90 Q48,70 50,50 Q52,30 50,10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M45,15 Q50,10 55,15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M45,25 Q50,20 55,25" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M45,35 Q50,30 55,35" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
        
        <div className="absolute bottom-24 right-1/4 w-36 h-36 animate-float opacity-25">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path d="M50,90 Q48,70 50,50 Q52,30 50,10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M45,15 Q50,10 55,15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M45,25 Q50,20 55,25" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M45,35 Q50,30 55,35" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </div>
      </div>
    );
  }

  /**
   * Renders the main content area with dynamic text
   * @returns {JSX.Element} Main content section
   */
  function renderMainContent() {
    return (
      <div className="container mx-auto px-4 relative z-10 h-screen flex items-center justify-center">
        <div className="text-white space-y-6 text-center max-w-4xl mt-16">
          {/* Dynamic title based on current slide */}
          <div className="space-y-3">
            <div className="text-sm font-medium opacity-80 animate-slide-fade-in">
              {currentSlide.title}
            </div>
            <h2 className="text-5xl md:text-6xl font-bold leading-normal animate-slide-up transition-all duration-1000">
              {currentSlide.mainTitle}<br />
              <span className={`${currentSlide.accent} animate-pulse font-extrabold text-gradient-rainbow transition-colors duration-1000`}>
                {currentSlide.mainSubtitle}
              </span>
            </h2>
            <p className="text-xl md:text-2xl font-medium animate-slide-up-delayed bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20 mt-4 transition-all duration-1000">
              {currentSlide.subtitle.toUpperCase()}
            </p>
          </div>
          
          {/* Description and call-to-action */}
          <div className="space-y-6 animate-fade-in-delayed">
            <p className="text-lg opacity-90 transition-all duration-1000 animate-slide-fade-in">
              {currentSlide.description}
            </p>
            
            {/* Modern Action Buttons - Contemporary Design */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Primary CTA - Modern glassmorphism style */}
              <button 
                onClick={() => {
                  // Add click feedback
                  console.log('Explore Services button clicked');
                  
                  // Navigate to "Our Key Services" section in About component
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    // Find the "Our Key Services" section within About
                    const servicesHeading = Array.from(aboutSection.querySelectorAll('h3')).find(
                      h3 => h3.textContent.includes('Our Key Services')
                    );
                    
                    if (servicesHeading) {
                      console.log('Our Key Services section found, scrolling...');
                      const headerHeight = 80;
                      const elementPosition = servicesHeading.offsetTop - headerHeight - 50; // Extra offset for better view
                      
                      window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                      });
                    } else {
                      // Fallback: scroll to about section
                      console.log('Scrolling to About section as fallback');
                      const headerHeight = 80;
                      const elementPosition = aboutSection.offsetTop - headerHeight;
                      window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                      });
                    }
                  } else {
                    console.log('About section not found, scrolling to approximate position');
                    // Fallback: scroll to approximate position
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: 'smooth'
                    });
                  }
                }}
                className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide uppercase transition-all duration-500 hover:bg-white/20 hover:shadow-2xl hover:shadow-rice-gold/20 transform hover:scale-[1.02] w-full sm:w-auto flex items-center justify-center gap-3 min-w-[200px]">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-rice-gold/0 via-rice-gold/10 to-rice-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                {/* Icon with animation */}
                <div className="relative z-10 p-2 bg-rice-gold/20 rounded-full group-hover:bg-rice-gold/30 transition-all duration-300">
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <span className="relative z-10 group-hover:text-rice-gold transition-colors duration-300">{t('hero.explore_services')}</span>
                
                {/* Subtle arrow indicator */}
                <svg className="w-4 h-4 relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Secondary CTA - Modern solid design */}
              <button 
                onClick={() => {
                  console.log('Join as Partner button clicked');
                  
                  // Try multiple approaches to open the modal
                  if (window.openMillRegistration) {
                    console.log('Using global function');
                    window.openMillRegistration();
                  } else {
                    console.log('Dispatching custom event');
                    const event = new CustomEvent('openMillRegistration');
                    window.dispatchEvent(event);
                  }
                }}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold text-sm tracking-wide uppercase transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-green-500/25 transform hover:scale-[1.02] w-full sm:w-auto flex items-center justify-center gap-3 min-w-[200px] border border-transparent hover:border-green-300/30"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                {/* Modern mill icon */}
                <div className="relative z-10 p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-300">
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                    <path d="M8 11h8v2H8v-2zm0 4h8v2H8v-2z" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                </div>
                
                <span className="relative z-10">{t('hero.join_partner')}</span>
                
                {/* Modern plus icon */}
                <div className="relative z-10 w-5 h-5 flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-current absolute"></div>
                  <div className="w-0.5 h-3 bg-current absolute group-hover:rotate-90 transition-transform duration-300"></div>
                </div>
              </button>
            </div>
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideNavigation(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-rice-gold scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-80'
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
