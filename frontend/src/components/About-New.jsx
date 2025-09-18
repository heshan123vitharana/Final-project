import React, { useState, useEffect, useCallback } from 'react';

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
  const nextImage = useCallback(() => {
    const newIndex = (currentImageIndex + 1) % galleryImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  }, [currentImageIndex]);

  // Function to navigate to previous image
  const prevImage = useCallback(() => {
    const newIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  }, [currentImageIndex]);

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
  }, [selectedImage, currentImageIndex, nextImage, prevImage]);

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
        {/* Modern Gallery Section */}
        <div className="relative mt-32">
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

            * {
              font-family: 'Poppins', sans-serif;
            }
          `}</style>
          <h1 className="text-3xl font-semibold text-center mx-auto">Our Latest Creations</h1>
          <p className="text-sm text-slate-500 text-center mt-2 max-w-lg mx-auto">A visual collection of our most recent works - each piece crafted with intention, emotion, and style.</p>
          <div className="flex flex-wrap items-center justify-center mt-12 gap-4 max-w-5xl mx-auto">
            <div className="relative group rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=736&auto=format&fit=crop" alt="image" className="size-56 object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h1 className="text-xl font-medium">Image Title</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/70">
                  Show More
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&w=798&auto=format&fit=crop" alt="image" className="size-56 object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h1 className="text-xl font-medium">Image Title</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/70">
                  Show More
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=687&auto=format&fit=crop" alt="image" className="size-56 object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h1 className="text-xl font-medium">Image Title</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/70">
                  Show More
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&w=862&auto=format&fit=crop" alt="image" className="size-56 object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h1 className="text-xl font-medium">Image Title</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/70">
                  Show More
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&w=687&auto=format&fit=crop" alt="image" className="size-56 object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h1 className="text-xl font-medium">Image Title</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/70">
                  Show More
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&w=703&auto=format&fit=crop" alt="image" className="size-56 object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h1 className="text-xl font-medium">Image Title</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/70">
                  Show More
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=736&auto=format&fit=crop" alt="image" className="size-56 object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h1 className="text-xl font-medium">Image Title</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/70">
                  Show More
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative group rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&w=798&auto=format&fit=crop" alt="image" className="size-56 object-cover object-top" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h1 className="text-xl font-medium">Image Title</h1>
                <a href="#" className="flex items-center gap-1 text-sm text-white/70">
                  Show More
                  <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.125 1.625H11.375V4.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.41602 7.58333L11.3743 1.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.75 7.04167V10.2917C9.75 10.579 9.63586 10.8545 9.4327 11.0577C9.22953 11.2609 8.95398 11.375 8.66667 11.375H2.70833C2.42102 11.375 2.14547 11.2609 1.9423 11.0577C1.73914 10.8545 1.625 10.579 1.625 10.2917V4.33333C1.625 4.04602 1.73914 3.77047 1.9423 3.5673C2.14547 3.36414 2.42102 3.25 2.70833 3.25H5.95833" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Image Modal for Testing */}
      {selectedImage && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 z-[9999] flex items-center justify-center"
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
