import PageTitle from './PageTitle';

const PaddyServices = () => {
  const services = [
    {
      id: 1,
      name: "Paddy Procurement",
      category: "Farmer Services",
      description: "Direct procurement from farmers at guaranteed minimum prices",
      icon: "🌾",
      gradient: "from-paddy-green to-green-600",
      features: ["Guaranteed Pricing", "Quality Testing", "Immediate Payment"]
    },
    {
      id: 2,
      name: "Storage & Warehousing",
      category: "Infrastructure",
      description: "Modern storage facilities with climate control systems",
      icon: "�",
      gradient: "from-blue-500 to-blue-600",
      features: ["Climate Control", "Quality Preservation", "Secure Storage"]
    },
    {
      id: 3,
      name: "Quality Assurance",
      category: "Testing Services",
      description: "Comprehensive quality testing and certification services",
      icon: "🔬",
      gradient: "from-purple-500 to-purple-600",
      features: ["Laboratory Testing", "Quality Certification", "Standards Compliance"]
    },
    {
      id: 4,
      name: "Market Stabilization",
      category: "Economic Support",
      description: "Price stabilization and market intervention programs",
      icon: "📈",
      gradient: "from-rice-gold to-yellow-600",
      features: ["Price Support", "Market Analysis", "Economic Planning"]
    },
    {
      id: 5,
      name: "Farmer Training",
      category: "Education",
      description: "Agricultural extension and training programs for farmers",
      icon: "�",
      gradient: "from-green-500 to-green-600",
      features: ["Technical Training", "Best Practices", "Sustainable Methods"]
    },
    {
      id: 6,
      name: "Distribution Network",
      category: "Logistics",
      description: "Island-wide distribution and supply chain management",
      icon: "🚚",
      gradient: "from-indigo-500 to-indigo-600",
      features: ["Island-wide Coverage", "Efficient Logistics", "Timely Delivery"]
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Professional Hero-style Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/20 via-transparent to-blue-100/20"></div>
      
      {/* Floating Professional Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-16 w-6 h-14 bg-purple-200/30 rounded-full animate-float-slow transform rotate-12"></div>
        <div className="absolute bottom-32 right-24 w-8 h-16 bg-blue-200/30 rounded-full animate-float transform -rotate-6"></div>
        <div className="absolute top-1/2 left-8 w-4 h-10 bg-indigo-200/25 rounded-full animate-float-reverse transform rotate-45"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Page Title Component */}
        <PageTitle 
          subtitle="Our Services"
          title="Professional Paddy Services"
          description="Comprehensive agricultural services designed to support farmers, mill owners, and the entire rice industry ecosystem with modern technology and expert guidance."
          className="bg-gradient-to-br from-purple-500/5 via-blue-500/3 to-indigo-500/5 mb-8"
          decoratorColor="purple"
          titleClassName="professional-title enhanced-text-display responsive-title-text"
          subtitleClassName="professional-subtitle responsive-subtitle-text"
          descriptionClassName="professional-description enhanced-text-display responsive-description-text"
        />

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-paddy-green to-green-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg">
              All Services
            </button>
            <button className="px-6 py-3 text-gray-600 hover:text-paddy-green font-semibold transition-colors bg-white rounded-full border border-gray-200 hover:border-paddy-green">
              Farmer Services
            </button>
            <button className="px-6 py-3 text-gray-600 hover:text-paddy-green font-semibold transition-colors bg-white rounded-full border border-gray-200 hover:border-paddy-green">
              Infrastructure
            </button>
            <button className="px-6 py-3 text-gray-600 hover:text-paddy-green font-semibold transition-colors bg-white rounded-full border border-gray-200 hover:border-paddy-green">
              Support Programs
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100">
              {/* Service Header */}
              <div className={`h-48 bg-gradient-to-br ${service.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="text-7xl group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {service.icon}
                </div>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white rounded-full"></div>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {service.category}
                </div>
              </div>

              {/* Service Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-paddy-green transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-paddy-green rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More Button */}
                <button className="w-full bg-gradient-to-r from-paddy-green to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-paddy-green to-green-700 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-24 h-24">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                  <path d="M20,50 Q30,20 40,50 T60,50 T80,50" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M25,60 Q35,30 45,60 T65,60 T85,60" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="absolute bottom-8 right-8 w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                  <path d="M20,50 Q30,20 40,50 T60,50 T80,50" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M25,60 Q35,30 45,60 T65,60 T85,60" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-6">Ready to Partner with PMB?</h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of farmers across Sri Lanka who trust us for fair pricing, 
                quality services, and reliable support for their paddy cultivation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-rice-gold hover:bg-yellow-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Register as Farmer
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-paddy-green px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                  View Collection Centers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaddyServices;
