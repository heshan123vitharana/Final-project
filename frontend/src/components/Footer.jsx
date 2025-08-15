const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 text-white overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-600/5 via-transparent to-green-600/10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>
      
      {/* Professional Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Enhanced Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">PMB</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Paddy Marketing Board</h3>
                <p className="text-sm text-emerald-300">Sri Lanka</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ensuring food security and supporting Sri Lankan farmers through quality rice distribution 
              and sustainable agricultural practices since 1971 with excellence and innovation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group text-gray-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="group text-gray-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="group text-gray-400 hover:text-emerald-400 transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 group-hover:drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.120.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
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
