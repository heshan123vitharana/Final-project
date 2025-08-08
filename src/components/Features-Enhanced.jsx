const FeaturesEnhanced = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Island-wide Procurement",
      description: "Fair price procurement services reaching farmers across all 25 districts of Sri Lanka with transparent pricing.",
      color: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Premium Quality Rice",
      description: "Directly sourced from certified farmers with strict quality control measures and laboratory testing.",
      color: "from-paddy-green to-fresh-green",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: "Government Guaranteed",
      description: "Official government body ensuring fair prices, authentic products, and consumer protection.",
      color: "from-rice-gold to-yellow-500",
      bgGradient: "from-yellow-50 to-yellow-100"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Supporting Local Farmers",
      description: "Every purchase directly supports Sri Lankan farmers and rural communities with fair compensation.",
      color: "from-earth-brown to-amber-700",
      bgGradient: "from-amber-50 to-amber-100"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Quality Assurance",
      description: "Every batch tested for purity, moisture content, and nutritional value in certified laboratories.",
      color: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Easy Online Ordering",
      description: "Simple and secure online platform with multiple payment options and doorstep delivery.",
      color: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100"
    }
  ];

  return (
    <div className="min-h-screen gradient-bg-secondary relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-24 left-12 w-32 h-32 bg-paddy-green/10 rounded-full animate-float-slow"></div>
        <div className="absolute top-48 right-16 w-24 h-24 bg-rice-gold/10 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-fresh-green/10 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-24 right-1/3 w-28 h-28 bg-rice-gold/15 rounded-full animate-float-fast"></div>
      </div>

      {/* Grain Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grain-pattern-bg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-paddy-green to-fresh-green text-white px-8 py-3 rounded-full text-lg font-semibold shadow-glow animate-pulse-glow">
              Our Features & Services
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 gradient-text-primary animate-bounce-in">
            Why Choose Us
          </h2>
          
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Discover the comprehensive services and features that make us Sri Lanka's most trusted rice marketing board.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`enhanced-card glass-effect p-8 rounded-3xl group hover:scale-105 transition-all duration-500 animate-slide-in-up`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Icon Container */}
              <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:shadow-glow-strong transition-all duration-300 group-hover:scale-110`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-paddy-green transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover Effect Background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}></div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="enhanced-card glass-effect p-12 rounded-3xl mb-16 animate-fade-in">
          <h3 className="text-3xl font-bold text-center text-paddy-green mb-12">
            Our Impact in Numbers
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-paddy-green mb-2 animate-pulse-glow">
                500K+
              </div>
              <div className="text-gray-600 font-semibold">Farmers Served</div>
              <div className="w-12 h-1 bg-gradient-to-r from-paddy-green to-fresh-green mx-auto mt-2"></div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-rice-gold mb-2 animate-pulse-glow">
                2.5M+
              </div>
              <div className="text-gray-600 font-semibold">Metric Tons</div>
              <div className="w-12 h-1 bg-gradient-to-r from-rice-gold to-yellow-500 mx-auto mt-2"></div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2 animate-pulse-glow">
                150+
              </div>
              <div className="text-gray-600 font-semibold">Collection Centers</div>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mt-2"></div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2 animate-pulse-glow">
                99.9%
              </div>
              <div className="text-gray-600 font-semibold">Quality Rate</div>
              <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-green-600 mx-auto mt-2"></div>
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="enhanced-card glass-effect p-12 rounded-3xl animate-fade-in">
          <h3 className="text-3xl font-bold text-center text-paddy-green mb-12">
            Our Process
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Collection",
                description: "Farmers bring paddy to our collection centers",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "Quality Check",
                description: "Rigorous testing for moisture and purity",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Processing",
                description: "Modern milling and packaging facilities",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )
              },
              {
                step: "04",
                title: "Distribution",
                description: "Nationwide distribution to consumers",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )
              }
            ].map((process, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-paddy-green to-fresh-green rounded-2xl flex items-center justify-center mx-auto shadow-glow group-hover:shadow-glow-strong transition-all duration-300 group-hover:scale-110">
                    <div className="text-white">
                      {process.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-rice-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {process.step}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-paddy-green transition-colors">
                  {process.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesEnhanced;
