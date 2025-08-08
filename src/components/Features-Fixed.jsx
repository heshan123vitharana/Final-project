const Features = () => {
  const features = [
    {
      icon: "🏆",
      title: "Quality Assurance", 
      description: "Premium quality rice varieties meeting international standards",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: "🌾",
      title: "Direct from Farmers",
      description: "Supporting local farmers through fair trade practices",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: "🚛",
      title: "Island-wide Distribution",
      description: "Efficient delivery network covering all provinces",
      gradient: "from-teal-500 to-emerald-600"
    },
    {
      icon: "💰",
      title: "Best Prices",
      description: "Competitive pricing ensuring value for money",
      gradient: "from-emerald-600 to-green-700"
    },
    {
      icon: "🏪",
      title: "Collection Centers",
      description: "Over 200 collection centers nationwide",
      gradient: "from-green-600 to-teal-700"
    },
    {
      icon: "📱",
      title: "Digital Services",
      description: "Modern technology for seamless operations",
      gradient: "from-teal-600 to-emerald-700"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 relative overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/5 via-transparent to-green-600/10"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-300/20 rounded-full animate-float"></div>
      <div className="absolute top-1/4 right-10 w-16 h-16 bg-green-300/20 rounded-full animate-float-slow"></div>
      <div className="absolute bottom-1/4 left-20 w-24 h-24 bg-teal-300/20 rounded-full animate-float"></div>
      <div className="absolute bottom-10 right-20 w-18 h-18 bg-emerald-400/20 rounded-full animate-float-slow"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Professional Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm rounded-full px-6 py-2 border border-emerald-200/50 mb-6">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-emerald-700 font-semibold text-sm">🏆 Premium Services</span>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Excellence in Every 
            <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              Grain of Rice
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive range of services designed to support farmers, 
            ensure quality, and deliver the finest rice across Sri Lanka with innovation and excellence.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-[1.02] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Enhanced Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Enhanced Hover Effects */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-16 -translate-y-16"></div>
            </div>
          ))}
        </div>

        {/* Professional CTA Section */}
        <div className="text-center animate-slide-up">
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* CTA Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full transform -translate-x-32 translate-y-32"></div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-white mb-6">
                Ready to Experience Excellence?
              </h3>
              <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of satisfied customers who trust PMB for their rice needs. 
                Quality, reliability, and service that exceeds expectations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] relative overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6 0L19 19H7" />
                    </svg>
                    Get Started Today
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </button>
                <button className="group border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-300 transform hover:scale-[1.02]">
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Learn More
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
