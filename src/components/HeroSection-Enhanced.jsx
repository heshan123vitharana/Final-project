import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Background images data with enhanced styling
  const backgroundImages = [
    {
      gradient: "from-fresh-green via-paddy-green to-green-800",
      pattern: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%)",
      title: "Premium Rice Varieties",
      subtitle: "Quality that speaks for itself"
    },
    {
      gradient: "from-rice-gold via-yellow-500 to-yellow-700",
      pattern: "linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)",
      title: "Golden Quality Guarantee",
      subtitle: "Certified excellence in every grain"
    },
    {
      gradient: "from-paddy-green via-green-700 to-green-900",
      pattern: "radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%), conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.05), transparent, rgba(255,255,255,0.05))",
      title: "Sustainable Farming",
      subtitle: "Environment-friendly practices"
    },
    {
      gradient: "from-earth-brown via-yellow-600 to-orange-700",
      pattern: "conic-gradient(from 45deg, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.1)), radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)",
      title: "Farm to Table Excellence",
      subtitle: "Direct from Sri Lankan farmers"
    }
  ];

  // Auto-rotate images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden rice-pattern">
      {/* Enhanced Animated Background Images */}
      {backgroundImages.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-gradient-to-br ${bg.gradient} transition-all duration-2000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: bg.pattern,
            backgroundSize: '60px 60px, 40px 40px, 80px 80px',
            backgroundPosition: '0 0, 30px 30px, 15px 45px'
          }}
        />
      ))}

      {/* Enhanced Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>

      {/* Floating Rice Grain Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Rice Grains */}
        <div className="absolute top-20 left-16 w-6 h-14 bg-white/20 rounded-full animate-float-slow transform rotate-12 backdrop-blur-sm"></div>
        <div className="absolute top-32 left-32 w-4 h-10 bg-white/15 rounded-full animate-float transform -rotate-45 backdrop-blur-sm"></div>
        <div className="absolute top-48 left-20 w-5 h-12 bg-white/25 rounded-full animate-float-delayed transform rotate-30 backdrop-blur-sm"></div>
        
        <div className="absolute top-24 right-20 w-6 h-14 bg-white/20 rounded-full animate-float transform -rotate-12 backdrop-blur-sm"></div>
        <div className="absolute top-40 right-32 w-4 h-10 bg-white/15 rounded-full animate-float-delayed transform rotate-45 backdrop-blur-sm"></div>
        <div className="absolute top-56 right-16 w-5 h-12 bg-white/25 rounded-full animate-float-slow transform -rotate-30 backdrop-blur-sm"></div>

        {/* Animated Wheat Stems */}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Dynamic Title */}
            <div className="space-y-4 animate-slide-in-left">
              <div className="text-sm font-medium opacity-80 tracking-wider uppercase">
                Government of Sri Lanka
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block text-gradient-gold animate-bounce-in">Paddy</span>
                <span className="block animate-fade-in-delayed">Marketing</span>
                <span className="block text-gradient-gold animate-fade-in-up">Board</span>
              </h1>
              <div className="text-xl lg:text-2xl opacity-90 animate-fade-in-delayed">
                {backgroundImages[currentImageIndex].subtitle}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6 animate-slide-up-delayed">
              <p className="text-lg lg:text-xl leading-relaxed opacity-90">
                Ensuring quality rice production and fair distribution across Sri Lanka. 
                Supporting farmers while delivering premium rice varieties to every household.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="enhanced-card px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
                  <span className="text-sm font-medium">🌾 Premium Quality</span>
                </div>
                <div className="enhanced-card px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
                  <span className="text-sm font-medium">🚚 Island-wide Delivery</span>
                </div>
                <div className="enhanced-card px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
                  <span className="text-sm font-medium">👨‍🌾 Farmer Support</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <button className="btn-primary-enhanced px-8 py-4 rounded-xl font-semibold text-lg shadow-elevation hover:shadow-glow transition-all duration-300">
                Find Collection Centers
              </button>
              <button className="btn-secondary-enhanced px-8 py-4 rounded-xl font-semibold text-lg shadow-elevation hover:shadow-glow-gold transition-all duration-300">
                View Services
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 animate-slide-up">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient-gold">250+</div>
                <div className="text-sm opacity-80 mt-1">Collection Centers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient-gold">50K+</div>
                <div className="text-sm opacity-80 mt-1">Registered Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-gradient-gold">99.9%</div>
                <div className="text-sm opacity-80 mt-1">Quality Assurance</div>
              </div>
            </div>
          </div>

          {/* Right Content - Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in-right">
            <div className="enhanced-card p-6 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-300 animate-bounce-in">
              <div className="w-12 h-12 bg-gradient-to-br from-rice-gold to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-glow-gold">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Collection Centers</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Find your nearest collection center for easy paddy submission and quality assessment.
              </p>
            </div>

            <div className="enhanced-card p-6 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-paddy-green to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-glow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quality Guarantee</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Government-certified quality standards ensuring the best rice for Sri Lankan families.
              </p>
            </div>

            <div className="enhanced-card p-6 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Round-the-clock assistance for farmers and customers via hotline and online support.
              </p>
            </div>

            <div className="enhanced-card p-6 rounded-2xl bg-white/10 backdrop-blur-md hover:bg-white/15 transition-all duration-300 animate-bounce-in" style={{animationDelay: '0.6s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fast Processing</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Quick paddy processing and payment systems to support farmer cash flow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white shadow-glow' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 text-white animate-bounce z-20">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
