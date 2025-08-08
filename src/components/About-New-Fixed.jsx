import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const About = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Close modal on ESC key press and handle body scroll
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('keydown', handleEsc, false);
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isModalOpen]);

  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden py-24 rice-pattern">
      {/* Professional Hero-style Background with Enhanced Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/50 via-green-500/30 to-teal-600/40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20"></div>
      
      {/* Floating Decorative Elements - matching hero section */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-16 w-6 h-14 bg-white/20 rounded-full animate-float-slow transform rotate-12 backdrop-blur-sm"></div>
        <div className="absolute top-32 right-24 w-8 h-16 bg-emerald-300/20 rounded-full animate-float transform -rotate-6 backdrop-blur-sm"></div>
        <div className="absolute bottom-32 left-32 w-4 h-10 bg-green-200/25 rounded-full animate-float-reverse transform rotate-45 backdrop-blur-sm"></div>
        <div className="absolute bottom-40 right-16 w-5 h-12 bg-white/15 rounded-full animate-float-slow transform -rotate-12 backdrop-blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Enhanced Hero-style Header with Professional Design */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-6 py-3 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-400/30 mb-6 animate-slide-up">
                <span className="text-emerald-200 font-semibold text-lg tracking-wide">🌾 Trusted Since 1975</span>
              </div>
              
              <h2 className="text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-slide-up">
                <span className="block bg-gradient-to-r from-emerald-200 via-green-100 to-emerald-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Why Choose
                </span>
                <span className="block text-white drop-shadow-2xl mt-2 animate-slide-up-delayed">
                  PMB Sri Lanka?
                </span>
              </h2>
              
              <p className="text-2xl lg:text-3xl text-emerald-100 leading-relaxed font-light animate-slide-up-delayed">
                Your trusted partner in rice marketing for over 50 years, supporting farmers and feeding the nation with excellence.
              </p>
            </div>

            {/* Professional Benefits Cards - enhanced styling */}
            <div className="space-y-6 animate-slide-up-delayed">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Government Guaranteed Quality</h3>
                  <p className="text-emerald-100 text-lg leading-relaxed">Official certification and quality assurance backed by government standards for every grain of rice.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl animate-float-slow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Island-wide Network</h3>
                  <p className="text-emerald-100 text-lg leading-relaxed">Comprehensive coverage across all 25 districts with 250+ collection centers for convenient access to our services.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl animate-float-reverse">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Fair Price Guarantee</h3>
                  <p className="text-emerald-100 text-lg leading-relaxed">Guaranteed minimum support prices ensuring farmers receive fair compensation for their hard work and quality produce.</p>
                </div>
              </div>
            </div>

            {/* Professional CTA Button - enhanced design */}
            <div className="pt-6">
              <button
                onClick={openModal}
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-500 shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] animate-slide-up-delayed"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                
                <span className="relative z-10 flex items-center gap-3">
                  <span>Discover Our Excellence</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right Side - Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Stats Card 1 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-white mb-2">1M+</h4>
                <p className="text-emerald-200">Farmers Served</p>
              </div>
            </div>

            {/* Stats Card 2 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-white mb-2">25</h4>
                <p className="text-emerald-200">Districts Covered</p>
              </div>
            </div>

            {/* Stats Card 3 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-white mb-2">50+</h4>
                <p className="text-emerald-200">Years Experience</p>
              </div>
            </div>

            {/* Stats Card 4 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold text-white mb-2">100%</h4>
                <p className="text-emerald-200">Quality Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Team & Gallery */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div 
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8 rounded-t-3xl">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="text-center">
                    <h3 className="text-4xl font-bold mb-2">Paddy Marketing Board Sri Lanka</h3>
                    <p className="text-emerald-100 text-lg">Meet Our Team & Explore Our Journey</p>
                  </div>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="p-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100">
                  {/* Leadership Team Section */}
                  <div className="mb-12">
                    <h4 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Leadership Team</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Team Member 1 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Mr. K.A. Silva</h5>
                        <p className="text-emerald-600 font-semibold mb-3">Chairman</p>
                        <p className="text-gray-600 text-sm">Leading PMB's strategic vision for sustainable rice marketing and farmer empowerment across Sri Lanka.</p>
                      </div>

                      {/* Team Member 2 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Dr. S.M. Perera</h5>
                        <p className="text-emerald-600 font-semibold mb-3">General Manager</p>
                        <p className="text-gray-600 text-sm">Overseeing operations and ensuring quality standards in rice procurement and distribution nationwide.</p>
                      </div>

                      {/* Team Member 3 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Mrs. R.D. Fernando</h5>
                        <p className="text-emerald-600 font-semibold mb-3">Director of Operations</p>
                        <p className="text-gray-600 text-sm">Managing collection centers and coordinating with farmers for efficient rice procurement processes.</p>
                      </div>

                      {/* Team Member 4 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Mr. A.L. Jayasinghe</h5>
                        <p className="text-emerald-600 font-semibold mb-3">Quality Assurance Manager</p>
                        <p className="text-gray-600 text-sm">Ensuring the highest quality standards in rice processing and maintaining food safety protocols.</p>
                      </div>

                      {/* Team Member 5 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Ms. N.K. Rathnayake</h5>
                        <p className="text-emerald-600 font-semibold mb-3">Technology Director</p>
                        <p className="text-gray-600 text-sm">Leading digital transformation initiatives and modern rice marketing platform development.</p>
                      </div>

                      {/* Team Member 6 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-2">Mr. P.B. Wijeratne</h5>
                        <p className="text-emerald-600 font-semibold mb-3">Farmer Relations Manager</p>
                        <p className="text-gray-600 text-sm">Building strong relationships with farming communities and supporting agricultural development programs.</p>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div>
                    <h4 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Journey Gallery</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Gallery Item 1 */}
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="aspect-video bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-sm font-medium">Rice Collection Centers</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm">Modern collection centers across all 25 districts</p>
                        </div>
                      </div>

                      {/* Gallery Item 2 */}
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="aspect-video bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            <p className="text-sm font-medium">Farmer Partnerships</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm">Supporting over 1 million farmers nationwide</p>
                        </div>
                      </div>

                      {/* Gallery Item 3 */}
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm font-medium">Quality Assurance</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm">Rigorous quality control processes</p>
                        </div>
                      </div>

                      {/* Gallery Item 4 */}
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="aspect-video bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                            </svg>
                            <p className="text-sm font-medium">Technology Innovation</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm">Digital platforms for modern rice marketing</p>
                        </div>
                      </div>

                      {/* Gallery Item 5 */}
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="aspect-video bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-sm font-medium">Community Impact</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm">Building stronger farming communities</p>
                        </div>
                      </div>

                      {/* Gallery Item 6 */}
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="aspect-video bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm font-medium">Sustainable Future</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <p className="text-white p-4 text-sm">Commitment to sustainable agriculture</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mt-12 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 text-center">
                    <h5 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch with Our Team</h5>
                    <p className="text-gray-600 mb-6">Ready to learn more about our services or partner with us? Our dedicated team is here to help.</p>
                    <button
                      onClick={closeModal}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Contact Our Team
                    </button>
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
