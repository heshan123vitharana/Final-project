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

        {/* Professional Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Main Content Card */}
          <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/10"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <h3 className="professional-title text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="professional-description text-gray-600 mb-6 leading-relaxed">
                To ensure food security and support Sri Lankan farmers through efficient rice marketing, 
                quality assurance, and sustainable agricultural practices that benefit both producers and consumers.
              </p>

              <h4 className="professional-subtitle text-lg font-bold text-gray-900 mb-4">Key Services</h4>
              <div className="space-y-3">
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

          {/* Vision & Values Card */}
          <div className="group bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/10"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              
              <h3 className="professional-title text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="professional-description text-gray-600 mb-6 leading-relaxed">
                To be the leading agricultural marketing institution in South Asia, driving innovation 
                in rice production and distribution while ensuring sustainable food systems.
              </p>

              <h4 className="professional-subtitle text-lg font-bold text-gray-900 mb-4">Core Values</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Integrity in all our operations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Excellence in service delivery</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="professional-description text-gray-600 text-sm">Innovation for sustainable growth</p>
                </div>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full -mb-16 -mr-16"></div>
            </div>
          </div>
        </div>

        {/* Professional CTA Section */}
        <div className="text-center">
          <button 
            onClick={openModal}
            className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <span className="flex items-center space-x-3">
              <span>Learn More About PMB</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Enhanced Modal with AI-Generated Images */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl mx-auto my-8 relative">

            {/* Ultra-Modern Modal Content with Professional Background */}
            <div className="bg-white rounded-3xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200/20 relative">
            
            {/* Modern Exit Button Positioned ON the Container */}
            <div className="absolute top-6 right-6 z-50">
              <button
                onClick={closeModal}
                className="group bg-white/90 hover:bg-red-50 border border-gray-300 hover:border-red-400 text-gray-600 hover:text-red-600 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-200/30 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
              
              {/* Clean Professional Header - No Green Bar */}
              <div className="bg-white border-b border-gray-100 px-12 py-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-md border border-gray-200">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Paddy Marketing Board</h3>
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <div className="h-px w-8 bg-gray-300"></div>
                    <p className="text-gray-600 text-sm tracking-wider uppercase font-medium">Sri Lanka</p>
                    <div className="h-px w-8 bg-gray-300"></div>
                  </div>
                  <div className="inline-flex items-center px-3 py-1 bg-slate-50 rounded-full border border-gray-200">
                    <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-slate-600 font-medium text-sm">Established 1952</span>
                  </div>
                </div>
              </div>

              {/* Professional Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                <div className="p-10 space-y-12 bg-gradient-to-b from-gray-50/50 to-white">
                  
                  {/* Professional Executive Summary */}
                  <div className="text-center max-w-4xl mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    
                    <h4 className="text-3xl font-bold text-gray-900 mb-6">About Our Organization</h4>
                    
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
                      <p className="text-gray-700 text-lg leading-relaxed">
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

                  {/* Gallery Section with AI-Generated Images */}
                  <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100">
                    <div className="text-center mb-10">
                      <h4 className="text-3xl font-bold text-gray-900 mb-4">PMB Gallery</h4>
                      <div className="w-20 h-1 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600 max-w-2xl mx-auto">Explore our facilities, operations, and the impact we've made across Sri Lanka</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Gallery Item 1 - Rice Fields */}
                      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <img 
                          src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop&crop=center"
                          alt="Lush green rice fields in Sri Lanka"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <p className="text-sm font-bold drop-shadow-lg">Rice Fields</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Item 2 - Processing Facilities */}
                      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <img 
                          src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&crop=center"
                          alt="Modern rice processing facility with advanced machinery"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <p className="text-sm font-bold drop-shadow-lg">Processing</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Item 3 - Storage Warehouses */}
                      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <img 
                          src="https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=400&h=400&fit=crop&crop=center"
                          alt="Large agricultural storage warehouse with grain silos"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-sm font-bold drop-shadow-lg">Storage</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Item 4 - Distribution Centers */}
                      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <img 
                          src="https://images.unsplash.com/photo-1566228015553-4545bbfce4d4?w=400&h=400&fit=crop&crop=center"
                          alt="Distribution center with trucks loading rice products"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="text-sm font-bold drop-shadow-lg">Distribution</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Item 5 - Quality Control Laboratory */}
                      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <img 
                          src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=400&fit=crop&crop=center"
                          alt="Modern laboratory for rice quality testing and analysis"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 004.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <p className="text-sm font-bold drop-shadow-lg">Quality Control</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Item 6 - Farmer Training Programs */}
                      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <img 
                          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&crop=center"
                          alt="Agricultural experts training farmers on modern rice cultivation techniques"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                            <p className="text-sm font-bold drop-shadow-lg">Farmer Training</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Item 7 - Modern Technology */}
                      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <img 
                          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=center"
                          alt="Digital technology and AI systems in agricultural monitoring"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-bold drop-shadow-lg">Technology</p>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Item 8 - Sustainability & Innovation */}
                      <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <img 
                          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop&crop=center"
                          alt="Sustainable farming practices and green agricultural innovations"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <p className="text-sm font-bold drop-shadow-lg">Sustainability</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-8">
                      <button className="inline-flex items-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-300 hover:shadow-md group">
                        <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Full Gallery
                      </button>
                    </div>
                  </div>

                  {/* Professional History Timeline */}
                  <div className="bg-white rounded-2xl p-10 shadow-lg border border-gray-100">
                    <div className="text-center mb-10">
                      <h4 className="text-3xl font-bold text-gray-900 mb-4">Our Journey Through Time</h4>
                      <div className="w-20 h-1 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600 max-w-2xl mx-auto">Seven decades of serving Sri Lanka's agricultural community</p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full"></div>
                      
                      <div className="space-y-10">
                        <div className="flex items-center space-x-8 group">
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                            <span className="text-white font-bold text-sm">1952</span>
                          </div>
                          <div className="flex-1 bg-emerald-50 rounded-2xl p-6 shadow-md border border-emerald-100">
                            <h6 className="font-bold text-emerald-700 text-lg mb-2">Foundation Era</h6>
                            <p className="text-gray-700 text-sm leading-relaxed">Establishment of the Paddy Marketing Board to support Sri Lankan farmers and ensure national rice security during the post-independence period.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8 group">
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                            <span className="text-white font-bold text-sm">1980s</span>
                          </div>
                          <div className="flex-1 bg-blue-50 rounded-2xl p-6 shadow-md border border-blue-100">
                            <h6 className="font-bold text-blue-700 text-lg mb-2">National Expansion</h6>
                            <p className="text-gray-700 text-sm leading-relaxed">Nationwide expansion with collection centers established across all 25 districts, revolutionizing rice distribution throughout Sri Lanka.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8 group">
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                            <span className="text-white font-bold text-sm">2000s</span>
                          </div>
                          <div className="flex-1 bg-amber-50 rounded-2xl p-6 shadow-md border border-amber-100">
                            <h6 className="font-bold text-amber-700 text-lg mb-2">Modernization Phase</h6>
                            <p className="text-gray-700 text-sm leading-relaxed">Introduction of modern processing facilities, quality assurance systems, and advanced agricultural technologies.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-8 group">
                          <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                            <span className="text-white font-bold text-sm">Today</span>
                          </div>
                          <div className="flex-1 bg-slate-50 rounded-2xl p-6 shadow-md border border-slate-100">
                            <h6 className="font-bold text-slate-700 text-lg mb-2">Digital Innovation</h6>
                            <p className="text-gray-700 text-sm leading-relaxed">Leading digital transformation in agricultural marketing with cutting-edge technology solutions and sustainable practices.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modern Contact Section */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/50 to-transparent"></div>
                    
                    <div className="relative z-10 p-10 text-center text-white">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mx-auto mb-6 flex items-center justify-center border border-white/30">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      
                      <h4 className="text-2xl font-bold mb-4">Connect With Us</h4>
                      <p className="text-white/90 mb-6 max-w-md mx-auto">Ready to learn more about our services or explore partnership opportunities?</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-white font-medium text-sm">+94 11 234 5678</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4 text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-white font-medium text-sm">info@pmb.gov.lk</span>
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
