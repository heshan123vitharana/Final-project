const AboutEnhanced = () => {
  return (
    <div className="min-h-screen gradient-bg-primary relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 w-40 h-40 bg-rice-gold/10 rounded-full animate-float-slow"></div>
        <div className="absolute top-64 right-24 w-32 h-32 bg-paddy-green/10 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-48 left-1/3 w-48 h-48 bg-fresh-green/10 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-32 right-1/4 w-36 h-36 bg-rice-gold/15 rounded-full animate-float-fast"></div>
      </div>

      {/* Rice Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="rice-pattern-bg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-paddy-green to-fresh-green text-white px-8 py-3 rounded-full text-lg font-semibold shadow-glow animate-pulse-glow">
              About Our Organization
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text-primary animate-bounce-in">
            Paddy Marketing Board
          </h2>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            Established in 1971, the Paddy Marketing Board of Sri Lanka has been the cornerstone of 
            food security and agricultural development in our nation for over five decades.
          </p>

          <div className="flex justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-paddy-green rounded-full mr-2"></div>
              <span>Est. 1971</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-rice-gold rounded-full mr-2"></div>
              <span>50+ Years Experience</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-fresh-green rounded-full mr-2"></div>
              <span>National Coverage</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div className="enhanced-card glass-effect p-8 rounded-3xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-paddy-green to-fresh-green rounded-2xl flex items-center justify-center mr-6 shadow-glow">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold gradient-text-primary">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                To ensure food security through sustainable rice production, fair pricing mechanisms, 
                and comprehensive support to farmers while maintaining the highest quality standards 
                for consumers across Sri Lanka.
              </p>
            </div>

            <div className="enhanced-card glass-effect p-8 rounded-3xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-rice-gold to-yellow-500 rounded-2xl flex items-center justify-center mr-6 shadow-glow-gold">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold gradient-text-secondary">Our Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                To be the leading institution in paddy and rice sector development, fostering innovation, 
                sustainability, and prosperity for farming communities while ensuring national food security.
              </p>
            </div>
          </div>

          {/* Right Content - Statistics */}
          <div className="animate-slide-in-right">
            <div className="enhanced-card glass-effect p-8 rounded-3xl mb-8">
              <h3 className="text-3xl font-bold text-paddy-green mb-8 text-center">Key Achievements</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-r from-paddy-green/10 to-fresh-green/10 rounded-2xl">
                  <div className="text-4xl font-bold text-paddy-green mb-2 animate-pulse-glow">50+</div>
                  <div className="text-gray-600 font-medium">Years of Service</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-rice-gold/10 to-yellow-500/10 rounded-2xl">
                  <div className="text-4xl font-bold text-rice-gold mb-2 animate-pulse-glow">500K+</div>
                  <div className="text-gray-600 font-medium">Farmers Supported</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl">
                  <div className="text-4xl font-bold text-blue-600 mb-2 animate-pulse-glow">25</div>
                  <div className="text-gray-600 font-medium">Districts Covered</div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-2xl">
                  <div className="text-4xl font-bold text-green-600 mb-2 animate-pulse-glow">2M+</div>
                  <div className="text-gray-600 font-medium">Metric Tons</div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="enhanced-card glass-effect p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-paddy-green mb-6 text-center">Core Values</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-white/50 rounded-xl">
                  <div className="w-10 h-10 bg-paddy-green/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-paddy-green font-bold">Q</span>
                  </div>
                  <span className="text-gray-700 font-semibold">Quality Assurance</span>
                </div>
                
                <div className="flex items-center p-4 bg-white/50 rounded-xl">
                  <div className="w-10 h-10 bg-rice-gold/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-rice-gold font-bold">I</span>
                  </div>
                  <span className="text-gray-700 font-semibold">Integrity & Transparency</span>
                </div>
                
                <div className="flex items-center p-4 bg-white/50 rounded-xl">
                  <div className="w-10 h-10 bg-fresh-green/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-fresh-green font-bold">S</span>
                  </div>
                  <span className="text-gray-700 font-semibold">Sustainability</span>
                </div>
                
                <div className="flex items-center p-4 bg-white/50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-500 font-bold">F</span>
                  </div>
                  <span className="text-gray-700 font-semibold">Farmer First Approach</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 animate-fade-in">
          <div className="enhanced-card glass-effect p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-paddy-green to-fresh-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:shadow-glow-strong">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-paddy-green mb-4">Fair Pricing</h4>
            <p className="text-gray-600">
              Ensuring fair and transparent pricing mechanisms that benefit both farmers and consumers.
            </p>
          </div>

          <div className="enhanced-card glass-effect p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-rice-gold to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-gold group-hover:shadow-glow-strong">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-rice-gold mb-4">Quality Control</h4>
            <p className="text-gray-600">
              Maintaining the highest standards of quality through rigorous testing and certification processes.
            </p>
          </div>

          <div className="enhanced-card glass-effect p-8 rounded-3xl text-center group hover:scale-105 transition-all duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:shadow-glow-strong">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-blue-600 mb-4">Farmer Support</h4>
            <p className="text-gray-600">
              Comprehensive support programs including training, financial assistance, and technical guidance.
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="enhanced-card glass-effect p-12 rounded-3xl animate-fade-in">
          <h3 className="text-3xl font-bold text-center text-paddy-green mb-12">Our Journey</h3>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-paddy-green to-rice-gold rounded-full"></div>
            
            <div className="space-y-12">
              {/* 1971 */}
              <div className="flex items-center relative">
                <div className="w-1/2 pr-8 text-right">
                  <div className="enhanced-card glass-effect p-6 rounded-2xl">
                    <h4 className="text-xl font-bold text-paddy-green mb-2">1971</h4>
                    <p className="text-gray-600">Establishment of the Paddy Marketing Board under the Ministry of Agriculture</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-paddy-green rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* 1980s */}
              <div className="flex items-center relative">
                <div className="w-1/2 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-rice-gold rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-1/2 pl-8">
                  <div className="enhanced-card glass-effect p-6 rounded-2xl">
                    <h4 className="text-xl font-bold text-rice-gold mb-2">1980s</h4>
                    <p className="text-gray-600">Expansion of collection centers and introduction of modern rice milling facilities</p>
                  </div>
                </div>
              </div>

              {/* 2000s */}
              <div className="flex items-center relative">
                <div className="w-1/2 pr-8 text-right">
                  <div className="enhanced-card glass-effect p-6 rounded-2xl">
                    <h4 className="text-xl font-bold text-fresh-green mb-2">2000s</h4>
                    <p className="text-gray-600">Digital transformation and implementation of quality assurance programs</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-fresh-green rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Present */}
              <div className="flex items-center relative">
                <div className="w-1/2 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className="w-1/2 pl-8">
                  <div className="enhanced-card glass-effect p-6 rounded-2xl">
                    <h4 className="text-xl font-bold text-blue-600 mb-2">Today</h4>
                    <p className="text-gray-600">Leading Sri Lanka's rice sector with sustainable practices and modern technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutEnhanced
