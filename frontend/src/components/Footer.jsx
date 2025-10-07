const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800/20 via-transparent to-slate-800/30"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-gray-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-slate-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      {/* Professional Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Enhanced Company Info */}
          <div className="space-y-4">
            <img src="/paddy-marketing-board-logo.png" alt="Paddy Marketing Board" className="h-16" />
            <p className="text-gray-300 text-sm leading-relaxed pt-2">
              Ensuring food security and supporting Sri Lankan farmers through quality rice distribution 
              and sustainable agricultural practices since 1971 with excellence and innovation.
            </p>
          </div>

          {/* Professional Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.102m-.758 4.899L7.172 7.172" />
              </svg>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Paddy Procurement
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Storage Services
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Farmer Registration
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Price Information
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Quality Standards
              </a></li>
            </ul>
          </div>

          {/* Professional Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Our Services
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Quality Assurance
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Mill Registration
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Distribution Network
              </a></li>
              <li><a href="#" className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Farmer Training
              </a></li>
            </ul>
          </div>

          {/* Professional Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Information
            </h4>
            <div className="space-y-4">
              <a 
                href="https://maps.google.com/?q=Paddy+Marketing+Board,+Ministry+of+Agriculture,+Colombo+07,+Sri+Lanka" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start space-x-4 p-2 rounded-lg hover:bg-emerald-500/10 transition-colors duration-200 group"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors duration-200">
                  <svg className="w-5 h-5 text-emerald-300 group-hover:text-emerald-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="group-hover:text-emerald-100 transition-colors duration-200">
                  <p className="text-gray-300 text-sm font-medium">Paddy Marketing Board</p>
                  <p className="text-gray-400 text-sm">Ministry of Agriculture</p>
                  <p className="text-gray-400 text-sm">Colombo 07, Sri Lanka</p>
                  <p className="text-emerald-300 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">Click to view on Google Maps</p>
                </div>
              </a>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">+94 11 234 5678</p>
                  <p className="text-gray-400 text-xs">24/7 Hotline</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">info@pmb.gov.lk</p>
                  <p className="text-gray-400 text-xs">Official Email</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Newsletter Section */}
        <div className="border-t border-gray-700/50 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-2xl font-bold text-emerald-300 mb-3 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Stay Connected
              </h4>
              <p className="text-gray-300 leading-relaxed">Subscribe to our newsletter for the latest updates on rice varieties, agricultural news, and government policies affecting farmers.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all duration-300 backdrop-blur-sm"
              />
              <button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-[1.02]">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Bottom Footer */}
      <div className="border-t border-gray-700/50 relative">
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              © 2024 Paddy Marketing Board Sri Lanka. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-emerald-300 text-sm transition-colors duration-200 hover:underline">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-emerald-300 text-sm transition-colors duration-200 hover:underline">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-emerald-300 text-sm transition-colors duration-200 hover:underline">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
