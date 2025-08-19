import React from 'react';

const positions = [
  {
    title: 'Chairman',
    name: 'Mr. S. Perera',
    description: 'Leads the Paddy Marketing Board, oversees strategic direction and ensures quality standards.',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=256&h=256',
  },
  {
    title: 'General Manager',
    name: 'Ms. R. Silva',
    description: 'Manages daily operations, logistics, and staff coordination for all collection centers.',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256',
  },
  {
    title: 'Finance Officer',
    name: 'Mr. D. Fernando',
    description: 'Handles financial planning, budgeting, and payment processing for farmers and mill owners.',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=facearea&w=256&h=256',
  },
  {
    title: 'Quality Control Manager',
    name: 'Ms. T. Jayasinghe',
    description: 'Ensures paddy quality, supervises laboratory testing, and maintains compliance.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=256&h=256',
  },
  {
    title: 'IT Administrator',
    name: 'Mr. K. Wickramasinghe',
    description: 'Maintains the digital platform, data security, and technical support for users.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&w=256&h=256',
  },
  {
    title: 'Operations Manager',
    name: 'Ms. N. Gunawardena',
    description: 'Coordinates logistics, supply chain, and field operations for the board.',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=256&h=256',
  },
];

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    alt: 'Green field',
    badge: 'HD',
    premium: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    alt: 'Meeting',
  },
  {
    src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    alt: 'Meeting',
  },
  {
    src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    alt: 'Green field',
    badge: 'HD',
    premium: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    alt: 'Student',
  },
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    alt: 'Flowers',
  },
  {
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    alt: 'Flowers',
  },
  {
    src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    alt: 'Student',
  },
];

export default function AboutNew() {
  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-green-100 min-h-[60vh]">
      <div className="max-w-5xl mx-auto px-4">
        {/* Platform Features Section First */}
        <div id="platform-features-section">
          <h2 className="text-4xl font-bold text-center mb-2 text-green-900">Platform Features</h2>
          <p className="text-center text-lg text-green-700 mb-8">Explore the key features of our platform</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {[{
              title: 'Real-Time Paddy Prices',
              description: 'Get up-to-date market prices for paddy across all districts, with trend indicators and export options.',
              icon: '📈',
            }, {
              title: 'Collection Centers Map',
              description: 'Find the nearest collection centers with contact info, location, and services offered.',
              icon: '🗺️',
            }, {
              title: 'Mill Owner Registration',
              description: 'Register your mill, manage your profile, and access exclusive features for verified owners.',
              icon: '🏭',
            }, {
              title: 'Multilingual Support',
              description: 'Switch between Sinhala, Tamil, and English for a seamless experience.',
              icon: '🌐',
            }, {
              title: 'Secure Admin Login',
              description: 'Admins can securely log in to manage data and monitor platform activity.',
              icon: '🔒',
            }, {
              title: 'Advanced Analytics',
              description: 'Gain insights with powerful analytics and reporting tools.',
              icon: '📊',
            }].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center transition-transform duration-300 hover:scale-105 border border-green-200">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-green-800 mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-center px-4 mb-6">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Leadership Section Second */}
        <div className="py-8 px-2 rounded-xl mb-12" style={{background: 'linear-gradient(90deg, #f0fdf4 0%, #e0f7fa 100%)'}}>
          <h2 className="text-5xl font-extrabold text-center mb-2 text-green-800 tracking-tight">Leadership</h2>
          <p className="text-center text-base text-green-700 mb-8">Discover the dedicated team behind the Paddy Marketing Board</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {positions.map((pos, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center transition-transform duration-300 hover:scale-105 border border-green-200">
                <img src={pos.image} alt={pos.name} className="w-24 h-24 rounded-full mt-6 mb-4 object-cover border-4 border-green-300 shadow" />
                <h3 className="text-xl font-bold text-green-800 mb-1">{pos.title}</h3>
                <p className="text-green-700 font-medium mb-2">{pos.name}</p>
                <p className="text-gray-600 text-center px-4 mb-6">{pos.description}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Gallery Section */}
        <h2 className="text-4xl font-bold text-center mb-2 text-green-900">Featured</h2>
        <p className="text-center text-lg text-green-700 mb-8">Explore our top-quality featured resources, chosen by us</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden shadow-lg group">
              <img src={img.src} alt={img.alt} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
              {img.badge && (
                <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded font-semibold flex items-center gap-1">
                  ▶ {img.badge}
                  {img.premium && <span className="ml-1 text-yellow-400">★</span>}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
