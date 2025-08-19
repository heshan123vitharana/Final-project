import { useTranslation } from 'react-i18n';
import { useState, useEffect } from 'react';
import PageTitle from './PageTitle';

const About = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    farmers: 0,
    years: 0,
    districts: 0,
    mills: 0
  });

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('about');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Animated counters
  useEffect(() => {
    if (isVisible) {
      const targets = { farmers: 1000000, years: 50, districts: 25, mills: 150 };
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;

      Object.keys(targets).forEach(key => {
        const target = targets[key];
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
        }, stepDuration);
      });
    }
  }, [isVisible]);

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
        {/* Page Title Component */}
        <PageTitle 
          subtitle="About Paddy Marketing Board"
          title="Transforming Sri Lanka's Rice Industry"
          description="For over five decades, we've been the backbone of Sri Lanka's rice ecosystem, connecting farmers to markets and ensuring food security for our nation."
          className="bg-gradient-to-br from-emerald-500/5 via-green-500/3 to-teal-500/5 mb-8"
          titleClassName="professional-title enhanced-text-display responsive-title-text"
          subtitleClassName="professional-subtitle responsive-subtitle-text"
          descriptionClassName="professional-description enhanced-text-display responsive-description-text"
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          {/* Left: Story & Mission */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">Our Story</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Established in 1971, the Paddy Marketing Board has evolved from a simple rice procurement agency 
                into Sri Lanka's most comprehensive agricultural platform. We've modernized traditional farming 
                practices while preserving the cultural heritage of rice cultivation.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we leverage cutting-edge technology and decades of expertise to create sustainable 
                value chains that benefit every stakeholder in the rice ecosystem.
              </p>
            </div>

            {/* Mission Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Farmer Empowerment</h4>
                  <p className="text-gray-600">Providing direct market access, fair pricing, and modern agricultural support to over 1 million farmers across Sri Lanka.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h4>
                  <p className="text-gray-600">Implementing rigorous quality control standards and certifications to ensure the highest grade rice products.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Innovation Leadership</h4>
                  <p className="text-gray-600">Pioneering digital solutions and sustainable practices that modernize Sri Lanka's agricultural sector.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <button className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <span>Explore Our Impact</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Interactive Statistics */}
          <div className="relative">
            {/* Main Stats Container */}
            <div className="grid grid-cols-2 gap-6">
              {/* Farmers Stat */}
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {counters.farmers.toLocaleString()}+
                </div>
                <div className="text-emerald-600 font-semibold mb-1">Farmers Supported</div>
                <div className="text-gray-500 text-sm">Across all districts</div>
              </div>

              {/* Years Stat */}
              <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{counters.years}+</div>
                <div className="text-blue-600 font-semibold mb-1">Years of Excellence</div>
                <div className="text-gray-500 text-sm">Since 1971</div>
              </div>

              {/* Districts Stat */}
              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{counters.districts}</div>
                <div className="text-purple-600 font-semibold mb-1">Districts Served</div>
                <div className="text-gray-500 text-sm">Island-wide coverage</div>
              </div>

              {/* Mills Stat */}
              <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{counters.mills}+</div>
                <div className="text-orange-600 font-semibold mb-1">Partner Mills</div>
                <div className="text-gray-500 text-sm">Processing facilities</div>
              </div>
            </div>

            {/* Floating Central Element */}
            <div className="absolute -top-8 -right-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-6 shadow-2xl transform rotate-3 hover:rotate-6 transition-all duration-500">
              <div className="text-center text-white">
                <div className="text-2xl font-bold">🌾</div>
                <div className="text-sm font-semibold mt-2">Sri Lanka's<br/>Rice Leader</div>
              </div>
            </div>
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
              Ready to Join Our Mission?
            </h3>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Whether you're a farmer, mill owner, or consumer, discover how PMB can support your rice-related needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Become a Partner
              </button>
              <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:text-emerald-600 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;