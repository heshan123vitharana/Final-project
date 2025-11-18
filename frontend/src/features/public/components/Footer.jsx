import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Link2, Building, ChevronRight, Newspaper, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubscribing(true);

    try {
      const response = await fetch('http://localhost:5000/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 ' + data.message);
        setEmail(''); // Clear input
      } else {
        toast.error(data.message || 'Subscription failed');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setSubscribing(false);
    }
  };

  const quickLinks = [
    { name: 'Paddy Procurement', href: '/services/procurement' },
    { name: 'Storage Services', href: '/services/storage' },
    { name: 'Farmer Registration', href: '/register/farmer' },
    { name: 'Price Information', href: '/market/prices' },
    { name: 'Quality Standards', href: '/about/quality' },
  ];

  const ourServices = [
    { name: 'Quality Assurance', href: '/services/quality-assurance' },
    { name: 'Mill Registration', href: '/register/mill' },
    { name: 'Distribution Network', href: '/services/distribution' },
    { name: 'Farmer Training', href: '/services/training' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  ];

  const handleLogoClick = (event) => {
    event.preventDefault();

    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigate('/');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800/20 via-transparent to-slate-800/30"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-900/50 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-sky-900/50 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      
      {/* Professional Main Footer */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Enhanced Company Info */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <Link to="/" aria-label="Go to home" onClick={handleLogoClick}>
              <img
                src="/paddy-marketing-board-logo.png"
                alt="Paddy Marketing Board"
                className="h-20 w-auto max-w-[240px] object-contain mb-4"
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ensuring food security and supporting Sri Lankan farmers through quality rice distribution 
              and sustainable agricultural practices since 1971 with excellence and innovation.
            </p>
            <div className="pt-4">
              <h5 className="text-md font-semibold text-emerald-300 mb-3">Connect with Us</h5>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-emerald-400 transform hover:scale-110 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Our Services
            </h4>
            <ul className="space-y-3">
              {ourServices.map((service) => (
                <li key={service.name}>
                  <Link to={service.href} className="text-gray-300 hover:text-emerald-300 transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-2 group">
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-emerald-300 flex items-center gap-2">
              <Phone className="w-5 h-5" />
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
                  <MapPin className="w-5 h-5 text-emerald-300 group-hover:text-emerald-200" />
                </div>
                <div className="group-hover:text-emerald-100 transition-colors duration-200">
                  <p className="text-gray-300 text-sm font-medium">Paddy Marketing Board</p>
                  <p className="text-gray-400 text-sm">Ministry of Agriculture</p>
                  <p className="text-gray-400 text-sm">Colombo 07, Sri Lanka</p>
                  <p className="text-emerald-300 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">View on Google Maps</p>
                </div>
              </a>
              
              <div className="flex items-center space-x-4 p-2">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">+94 11 234 5678</p>
                  <p className="text-gray-400 text-xs">24/7 Hotline</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-2">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-emerald-300" />
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
                <Newspaper className="w-6 h-6" />
                Stay Connected
              </h4>
              <p className="text-gray-300 leading-relaxed">Subscribe to our newsletter for the latest updates on rice varieties, agricultural news, and government policies affecting farmers.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribing}
                className="flex-1 px-4 py-3 bg-gray-800/50 text-white rounded-xl border border-gray-600/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={subscribing}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Professional Bottom Footer */}
      <div className="border-t border-gray-700/50 relative bg-black/20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Paddy Marketing Board Sri Lanka. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-emerald-300 text-sm transition-colors duration-200 hover:underline">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-emerald-300 text-sm transition-colors duration-200 hover:underline">Terms of Service</Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-emerald-300 text-sm transition-colors duration-200 hover:underline">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
