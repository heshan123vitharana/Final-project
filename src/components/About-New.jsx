import React, { useState, useEffect } from 'react';

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to open image in modal
  const openImageModal = (image, index) => {
    console.log('Opening image modal:', image, index);
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  // Function to close modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Function to navigate to next image
  const nextImage = () => {
    const newIndex = (currentImageIndex + 1) % galleryImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  // Function to navigate to previous image
  const prevImage = () => {
    const newIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  // Function to toggle full gallery view
  const toggleFullGallery = () => {
    setShowFullGallery(!showFullGallery);
  };

  // Add keyboard support and body scroll lock for modal
  useEffect(() => {
    if (!selectedImage) return;

    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          closeImageModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore body scrolling when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, currentImageIndex]);

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Apple-style Leadership Section */}
        <div className="relative">
          {/* Clean Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
              Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Meet the people who guide Sri Lanka's agricultural future with vision, expertise, and commitment to excellence.
            </p>
          </div>

          {/* Apple-style Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {positions.map((pos, idx) => (
              <div key={idx} className="group text-center">
                {/* Clean Profile Image */}
                <div className="mb-8">
                  <div className="relative mx-auto w-48 h-48 mb-6">
                    <img 
                      src={pos.image} 
                      alt={pos.name} 
                      className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                </div>
                
                {/* Minimal Content */}
                <div>
                  <h3 className="text-2xl font-light text-gray-900 mb-2">
                    {pos.name}
                  </h3>
                  <div className="text-lg text-gray-500 mb-4 font-light">
                    {pos.title}
                  </div>
                  <p className="text-gray-600 leading-relaxed text-base font-light max-w-xs mx-auto">
                    {pos.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Modern Featured Section */}
        <div className="relative mt-32">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
              Featured Showcase
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Discover our carefully curated collection of premium agricultural resources and innovative solutions
            </p>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(showFullGallery ? galleryImages : galleryImages.slice(0, 4)).map((img, idx) => (
              <div key={idx} className="group relative">
                {/* Card Container */}
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={img.src} 
                      alt={img.alt} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    
                    {/* Premium Badge */}
                    {img.badge && (
                      <div className="absolute top-4 left-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                          <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                            {img.premium && <span className="text-amber-500">★</span>}
                            {img.badge}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <button 
                        onClick={() => openImageModal(img, idx)}
                        className="bg-white/95 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {img.alt.charAt(0).toUpperCase() + img.alt.slice(1)}
                      </h3>
                      
                      {/* Quality Indicator */}
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500 font-medium">Premium</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      High-quality agricultural resource showcasing our commitment to excellence
                    </p>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button className="text-blue-600 hover:text-blue-700 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{idx + 1} of {galleryImages.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <button 
              onClick={toggleFullGallery}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <span>{showFullGallery ? 'Show Less' : 'Explore Full Gallery'}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Simple Image Modal for Testing */}
      {selectedImage && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeImageModal}
        >
          {/* Close Button */}
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white text-2xl z-10"
          >
            ×
          </button>

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[90vh]">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />
            <div className="text-white text-center mt-4">
              <h3>{selectedImage.alt}</h3>
              <p>Image {currentImageIndex + 1} of {galleryImages.length}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
