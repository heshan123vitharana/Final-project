import { useState } from 'react';
import PageTitle from './PageTitle';
import Card from './ui/Card';

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  // (Animations handled globally by SectionTransition)

  const features = [
    {
      icon: (
        <svg
   className="w-8 h-8"
   fill="none"
   stroke="currentColor"
   viewBox="0 0 24 24"
   xmlns="http://www.w3.org/2000/svg"
   >
   <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
   ></path>
   </svg>
      ),
      title: "Quality Assurance", 
      description: "Premium quality rice varieties meeting international standards with rigorous testing and certification processes",
      stats: "99.9% Quality Rate",
      color: "emerald"
    },
    {
      icon: (
        <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                ></path>
              </svg>
      ),
      title: "Direct from Farmers",
      description: "Supporting local farmers through fair trade practices and sustainable agricultural development programs",
      stats: "1M+ Farmers",
      color: "green"
    },
    {
      icon: (
        <svg
   className="w-8 h-8"
   fill="none"
   stroke="currentColor"
   viewBox="0 0 24 24"
   xmlns="http://www.w3.org/2000/svg"
   >
   <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
   ></path>
   <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
   ></path>
   </svg>
      ),
      title: "Island-wide Network",
      description: "Efficient delivery network covering all 25 districts with advanced logistics and tracking systems",
      stats: "25 Districts",
      color: "teal"
    },
    {
      icon: (
        <svg
   className="w-8 h-8"
   fill="none"
   stroke="currentColor"
   viewBox="0 0 24 24"
   xmlns="http://www.w3.org/2000/svg"
   >
   <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
   ></path>
   </svg>
      ),
      title: "Competitive Pricing",
      description: "Fair and transparent pricing model ensuring value for money while supporting farmer livelihoods",
      stats: "Best Value",
      color: "blue"
    },
    {
      icon: (
        <svg
   className="w-8 h-8"
   fill="none"
   stroke="currentColor"
   viewBox="0 0 24 24"
   xmlns="http://www.w3.org/2000/svg"
   >
   <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
   ></path>
   </svg>
      ),
      title: "Modern Facilities",
      description: "State-of-the-art collection centers and processing facilities equipped with latest technology",
      stats: "200+ Centers",
      color: "purple"
    },
    {
      icon: (
        <svg
   className="w-8 h-8"
   fill="none"
   stroke="currentColor"
   viewBox="0 0 24 24"
   xmlns="http://www.w3.org/2000/svg"
   >
   <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
   ></path>
   </svg>
      ),
      title: "Digital Innovation",
      description: "Cutting-edge technology solutions including mobile apps, IoT sensors, and blockchain traceability",
      stats: "100% Digital",
      color: "indigo"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        border: 'border-emerald-200',
        text: 'text-emerald-600',
        hover: 'hover:border-emerald-300'
      },
      green: {
        bg: 'from-green-500 to-green-600',
        border: 'border-green-200',
        text: 'text-green-600',
        hover: 'hover:border-green-300'
      },
      teal: {
        bg: 'from-teal-500 to-teal-600',
        border: 'border-teal-200',
        text: 'text-teal-600',
        hover: 'hover:border-teal-300'
      },
      blue: {
        bg: 'from-blue-500 to-blue-600',
        border: 'border-blue-200',
        text: 'text-blue-600',
        hover: 'hover:border-blue-300'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        border: 'border-purple-200',
        text: 'text-purple-600',
        hover: 'hover:border-purple-300'
      },
      indigo: {
        bg: 'from-indigo-500 to-indigo-600',
        border: 'border-indigo-200',
        text: 'text-indigo-600',
        hover: 'hover:border-indigo-300'
      }
    };
    return colorMap[color] || colorMap.emerald;
  };

  return (
    <section id="features" className="relative bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 py-24">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        {/* Clean gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30"></div>
        
        {/* Subtle geometric shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-100/20 to-green-100/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-green-100/15 to-teal-100/10 rounded-full blur-3xl"></div>
        
        {/* Professional grid lines */}
        <div className="absolute inset-0 opacity-[0.01]">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
      </div>

  <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Page Title Component */}
        <PageTitle 
          subtitle="Our Core Services"
          title="Excellence in Every Service We Provide"
          description="Discover our comprehensive ecosystem of services designed to transform Sri Lanka's rice industry through innovation, quality, and sustainable practices."
          className="bg-gradient-to-br from-emerald-500/5 via-green-500/3 to-teal-500/5 mb-8"
          titleClassName="professional-title enhanced-text-display responsive-title-text"
          subtitleClassName="professional-subtitle responsive-subtitle-text"
          descriptionClassName="professional-description enhanced-text-display responsive-description-text"
        />

        {/* Interactive Features Showcase */}
        <div className="grid lg:grid-cols-3 gap-12 items-start mb-20">
          {/* Features List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Service Categories</h3>
            {features.map((feature, index) => {
              const colors = getColorClasses(feature.color);
              return (
                <div
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? `bg-green-600 text-white shadow-lg`
                      : `bg-white hover:bg-gray-50`
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      activeFeature === index
                        ? `bg-white text-green-600`
                        : `bg-gray-100 text-gray-600`
                    } transition-all duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        activeFeature === index ? 'text-white' : 'text-gray-900'
                      } transition-colors duration-300`}>
                        {feature.title}
                      </h4>
                      <div className={`text-sm  mt-1 ${
            activeFeature === index ? 'text-gray-200' : 'text-gray-500'
           }`}>{feature.stats}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Feature Display */}
          <div className="lg:col-span-2">
            <Card className="bg-white rounded-3xl p-8 shadow-xl border-gray-100">
              <div className="flex items-center gap-6 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${getColorClasses(features[activeFeature].color).bg} text-white shadow-lg`}>
                  {features[activeFeature].icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {features[activeFeature].title}
                  </h3>
                </div>
              </div>

              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getColorClasses(features[activeFeature].color).text} bg-green-100`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {features[activeFeature].stats}
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-8">
                {features[activeFeature].description}
              </p>

              {/* Feature Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Reliability</span>
                      <p className="text-sm text-gray-600">Consistent service delivery</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Innovation</span>
                      <p className="text-sm text-gray-600">Latest technology integration</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">24/7 Support</span>
                      <p className="text-sm text-gray-600">Round-the-clock assistance</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Quality</span>
                      <p className="text-sm text-gray-600">Premium standards guaranteed</p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="relative px-12 py-16 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Experience World-Class Rice Services
            </h3>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join our platform and discover why we're Sri Lanka's most trusted rice marketing board. 
              Quality, innovation, and service excellence in every interaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-white text-emerald-600 font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  Get Started Today
                </span>
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:text-emerald-600 transition-all duration-300">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learn More
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
