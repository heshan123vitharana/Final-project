import { useState, useEffect } from 'react';
import PageTitle from './PageTitle';

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Close modal on ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEsc, false);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
    };
  }, [isModalOpen]);

  return (
    <section id="about" className="relative min-h-screen bg-white overflow-hidden py-24">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/50"></div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        {/* Professional Page Title */}
        <PageTitle 
          subtitle="About PMB Sri Lanka"
          title="Paddy Marketing Board of Sri Lanka"
          description="Serving the nation since 1952, we are Sri Lanka's premier rice marketing institution committed to ensuring food security, supporting farmers, and delivering quality rice to every household across the island."
          className="bg-gradient-to-br from-emerald-500/5 via-green-500/3 to-teal-500/5 mb-16"
          titleClassName="professional-title enhanced-text-display responsive-title-text"
          subtitleClassName="professional-subtitle responsive-subtitle-text"
          descriptionClassName="professional-description enhanced-text-display responsive-description-text"
        />

        {/* Service Tags */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/20">
            <span className="text-emerald-700 font-medium text-sm">🌾 Since 1952</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-400/20">
            <span className="text-blue-700 font-medium text-sm">🏭 500+ Centers</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/10 backdrop-blur-sm rounded-full border border-purple-400/20">
            <span className="text-purple-700 font-medium text-sm">👥 1M+ Farmers</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-orange-500/10 backdrop-blur-sm rounded-full border border-orange-400/20">
            <span className="text-orange-700 font-medium text-sm">🇱🇰 25 Districts</span>
          </div>
        </div>

        {/* Professional Vision & Mission Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Vision Card - Professional Style */}
          <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/10"></div>
            
            <div className="relative p-10">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="professional-title text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              
              {/* Quote */}
              <blockquote className="text-lg font-semibold text-emerald-700 mb-6 italic border-l-4 border-emerald-500 pl-4">
                "To be Sri Lanka's premier rice marketing institution, ensuring food security and prosperity for all."
              </blockquote>
              
              {/* Key Points */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Leading sustainable rice production and distribution</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Empowering farmers with technology and fair pricing</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Quality rice for every Sri Lankan household</p>
                </div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -mb-16 -mr-16"></div>
            </div>
          </div>
          
          {/* Mission Card - Professional Style */}
          <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10"></div>
            
            <div className="relative p-10">
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Title */}
              <h3 className="professional-title text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              
              {/* Quote */}
              <blockquote className="text-lg font-semibold text-blue-700 mb-6 italic border-l-4 border-blue-500 pl-4">
                "Connecting farmers to markets while ensuring sustainable agriculture for Sri Lanka's future."
              </blockquote>
              
              {/* Key Points */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Guaranteed market access for all registered farmers</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Strategic rice reserves for national food security</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Sustainable farming practices and innovation</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Quality rice products delivered nationwide</p>
                </div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full -mb-16 -mr-16"></div>
            </div>
          </div>
        </div>

        {/* Professional CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-3xl p-8 border border-emerald-200/30">
            <h3 className="professional-title text-2xl font-bold text-gray-900 mb-4">Learn More About Our Journey</h3>
            <p className="professional-description text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover our comprehensive history, meet our leadership team, explore our facilities, and understand how we're shaping Sri Lanka's agricultural future.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-emerald-500/30"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Explore Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Ultra-Modern Modal with Professional Styling */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-slate-900/60 to-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl mx-auto my-8 relative">
            
            {/* Modern Exit Button with Professional Design */}
            <div className="absolute -top-4 -right-4 z-70">
              <button
                onClick={closeModal}
                className="group bg-white hover:bg-red-50 border-2 border-gray-200 hover:border-red-300 text-gray-600 hover:text-red-600 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-red-200/50 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <svg className="w-8 h-8 group-hover:rotate-180 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Ultra-Modern Modal Content */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden border border-white/20" style={{ backdropFilter: 'blur(20px)' }}>
              
              {/* Modern Header with Glassmorphism Effect */}
              <div className="relative bg-gradient-to-r from-emerald-500/90 to-green-600/90 backdrop-blur-xl rounded-t-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '60px 60px'
                }}></div>
                
                <div className="relative z-10 p-12 text-center text-white">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl border border-white/30">
                    <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="professional-title text-5xl font-bold mb-3 drop-shadow-lg">Paddy Marketing Board</h3>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <div className="h-px w-16 bg-white/40"></div>
                    <p className="professional-subtitle text-white/90 text-xl tracking-widest uppercase">Sri Lanka</p>
                    <div className="h-px w-16 bg-white/40"></div>
                  </div>
                  <div className="inline-flex items-center px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <svg className="w-5 h-5 mr-2 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-emerald-100 font-semibold">Established 1952</span>
                  </div>
                </div>
              </div>

              {/* Modern Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
                <div className="p-10 space-y-16 bg-gradient-to-b from-white to-slate-50/30">
                  
                  {/* Modern Executive Summary */}
                  <div className="text-center max-w-5xl mx-auto">
                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl border-4 border-white">
                      <svg className="w-14 h-14 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    
                    <h4 className="professional-title text-4xl font-bold text-gray-900 mb-8 leading-tight">About Our Organization</h4>
                    
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100/50 shadow-xl backdrop-blur-sm mb-10">
                      <p className="professional-description text-gray-700 text-xl leading-relaxed">
                        The Paddy Marketing Board (PMB) has been Sri Lanka's cornerstone institution for rice and paddy marketing for over seven decades. 
                        Established in 1952, we have continuously evolved to meet the changing needs of farmers, consumers, and the national economy. 
                        Our comprehensive network spans all 25 districts of Sri Lanka, ensuring that quality rice reaches every corner of the island nation.
                      </p>
                    </div>
                    
                    {/* Modern Statistics Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="group bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h5 className="text-3xl font-bold text-emerald-700 mb-2">1952</h5>
                        <p className="professional-description text-gray-600 font-medium">Established</p>
                      </div>
                      
                      <div className="group bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h5 className="text-3xl font-bold text-blue-700 mb-2">500+</h5>
                        <p className="professional-description text-gray-600 font-medium">Collection Centers</p>
                      </div>
                      
                      <div className="group bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                        <h5 className="text-3xl font-bold text-purple-700 mb-2">1M+</h5>
                        <p className="professional-description text-gray-600 font-medium">Farmers Served</p>
                      </div>
                    </div>
                  </div>

                  {/* Modern Leadership Team */}
                  <div>
                    <div className="text-center mb-12">
                      <h4 className="professional-title text-4xl font-bold text-gray-900 mb-4">Leadership Team</h4>
                      <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto"></div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      <div className="group bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 hover:-translate-y-3">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                          <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="professional-title text-xl font-bold text-gray-900 mb-2">Mr. K.A. Perera</h5>
                        <p className="text-emerald-600 font-bold text-sm mb-4 uppercase tracking-wide">Chairman & CEO</p>
                        <p className="professional-description text-gray-600 text-sm leading-relaxed">Leading PMB's strategic vision with 25+ years experience in agricultural development</p>
                      </div>
                      
                      <div className="group bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-3">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                          <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="professional-title text-xl font-bold text-gray-900 mb-2">Ms. S.N. Fernando</h5>
                        <p className="text-blue-600 font-bold text-sm mb-4 uppercase tracking-wide">Operations Director</p>
                        <p className="professional-description text-gray-600 text-sm leading-relaxed">Overseeing nationwide operations and distribution networks</p>
                      </div>
                      
                      <div className="group bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 hover:-translate-y-3 md:col-span-2 lg:col-span-1">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                          <svg className="w-12 h-12 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="professional-title text-xl font-bold text-gray-900 mb-2">Dr. R.M. Silva</h5>
                        <p className="text-purple-600 font-bold text-sm mb-4 uppercase tracking-wide">Technical Director</p>
                        <p className="professional-description text-gray-600 text-sm leading-relaxed">Leading quality assurance and technical innovation</p>
                      </div>
                    </div>
                  </div>

                  {/* Ultra-Modern History Timeline */}
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-12 shadow-2xl border border-gray-100">
                    <div className="text-center mb-12">
                      <h4 className="professional-title text-4xl font-bold text-gray-900 mb-4">Our Journey Through Time</h4>
                      <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mx-auto mb-6"></div>
                      <p className="professional-description text-gray-600 text-lg max-w-2xl mx-auto">Seven decades of serving Sri Lanka's agricultural community</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 to-orange-500 rounded-full"></div>
                      
                      <div className="space-y-12">
                        <div className="flex items-center space-x-8 group">
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                            <span className="text-white font-bold text-lg">52</span>
                          </div>
                          <div className="flex-1 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl p-6 shadow-lg border border-emerald-200/50">
                            <h6 className="professional-title font-bold text-emerald-700 text-xl mb-2">Foundation Era</h6>
                            <p className="professional-description text-gray-700 text-sm leading-relaxed">Establishment of the Paddy Marketing Board to support Sri Lankan farmers and ensure national rice security during the post-independence period.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8 group">
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                            <span className="text-white font-bold text-lg">80s</span>
                          </div>
                          <div className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl p-6 shadow-lg border border-blue-200/50">
                            <h6 className="professional-title font-bold text-blue-700 text-xl mb-2">National Expansion</h6>
                            <p className="professional-description text-gray-700 text-sm leading-relaxed">Nationwide expansion with collection centers established across all 25 districts, revolutionizing rice distribution throughout Sri Lanka.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8 group">
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                            <span className="text-white font-bold text-lg">00s</span>
                          </div>
                          <div className="flex-1 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl p-6 shadow-lg border border-purple-200/50">
                            <h6 className="professional-title font-bold text-purple-700 text-xl mb-2">Modernization Phase</h6>
                            <p className="professional-description text-gray-700 text-sm leading-relaxed">Introduction of modern processing facilities, quality assurance systems, and advanced agricultural technologies.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8 group">
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-4 border-white">
                            <span className="text-white font-bold text-lg">Now</span>
                          </div>
                          <div className="flex-1 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-6 shadow-lg border border-orange-200/50">
                            <h6 className="professional-title font-bold text-orange-700 text-xl mb-2">Digital Innovation</h6>
                            <p className="professional-description text-gray-700 text-sm leading-relaxed">Leading digital transformation in agricultural marketing with cutting-edge technology solutions and sustainable practices.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modern Contact Section */}
                  <div className="relative overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/50 to-transparent"></div>
                    <div className="absolute inset-0" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '60px 60px'
                    }}></div>
                    
                    <div className="relative z-10 p-12 text-center text-white">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      
                      <h4 className="professional-title text-3xl font-bold mb-4 drop-shadow-lg">Connect With Us</h4>
                      <p className="professional-description text-white/90 text-lg mb-8 max-w-2xl mx-auto">Ready to learn more about our services or explore partnership opportunities?</p>
                      
                      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300">
                          <div className="flex items-center justify-center space-x-3">
                            <svg className="w-6 h-6 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="professional-description text-white font-semibold">+94 11 234 5678</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300">
                          <div className="flex items-center justify-center space-x-3">
                            <svg className="w-6 h-6 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="professional-description text-white font-semibold">info@pmb.gov.lk</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
