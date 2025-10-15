import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'lucide-react';
import { useLatestCreations } from '../hooks/useGallery';
import OptimizedImage from './OptimizedImage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function AboutNew() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [leaders, setLeaders] = useState([]);
  const [leadersLoading, setLeadersLoading] = useState(true);
  const [leadersError, setLeadersError] = useState(null);

  const fetchLeadership = useCallback(async () => {
    try {
      setLeadersLoading(true);
      setLeadersError(null);

      const response = await fetch(`${API_BASE_URL}/api/leadership?is_active=true`);

      if (!response.ok) {
        throw new Error('Failed to fetch leadership team');
      }

      const data = await response.json();
      setLeaders(data.data || []);
    } catch (error) {
      console.error('Error fetching leadership team:', error);
      setLeaders([]);
      setLeadersError(error.message || 'Unable to load leadership team');
    } finally {
      setLeadersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadership();
  }, [fetchLeadership]);

  // Use the custom hook for dynamic gallery data
  const { images: galleryImages, loading: galleryLoading, error: galleryError, hasImages, refresh } = useLatestCreations(8);

  const sortedLeaders = [...leaders].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

  // Function to open image in modal
  const UNUSED_openImageModal = (image, index) => {
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
    if (galleryImages.length === 0) return;
    const newIndex = (currentImageIndex + 1) % galleryImages.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  }, [currentImageIndex, galleryImages]);

  // Function to navigate to previous image
  const prevImage = useCallback(() => {
    if (galleryImages.length === 0) return;
    const newIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  }, [currentImageIndex, galleryImages]);

  // Function to toggle full gallery view
  const UNUSED_toggleFullGallery = () => {
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
    <section id="about" className="py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Apple-style Leadership Section */}
  <div id="leadership" className="relative">
          {/* Clean Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
              Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
              Meet the dedicated professionals leading Sri Lanka's paddy marketing initiatives.
            </p>
            {leadersError && (
              <div className="mt-6 inline-flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
                <span>{leadersError}</span>
                <button
                  onClick={fetchLeadership}
                  className="rounded-lg bg-red-100 px-4 py-2 font-medium text-red-700 transition hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            )}
          </div>

          {/* Apple-style Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            {leadersLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`leader-skeleton-${index}`}
                  className="group text-center animate-pulse">
                  <div className="mb-8">
                    <div className="relative mx-auto w-48 h-48 mb-6 rounded-full bg-gray-200" />
                  </div>
                  <div className="space-y-3">
                    <div className="mx-auto h-6 w-40 rounded-full bg-gray-200" />
                    <div className="mx-auto h-4 w-32 rounded-full bg-gray-200" />
                    <div className="mx-auto h-4 w-52 rounded-full bg-gray-200" />
                  </div>
                </div>
              ))
            ) : sortedLeaders.length > 0 ? (
              sortedLeaders.map((leader) => {
                const imageSrc = leader.image_url ? `${API_BASE_URL}${leader.image_url}` : null;

                return (
                  <div key={`leader-${leader.id}`} className="group text-center">
                    <div className="mb-8">
                      <div className="relative mx-auto mb-6 w-48 h-48 overflow-hidden rounded-full">
                        {imageSrc ? (
                          <OptimizedImage
                            src={imageSrc}
                            alt={leader.name}
                            className="w-full h-full object-cover object-center grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                            <User className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-medium text-gray-900 mb-2">
                        {leader.name}
                      </h3>
                      <div className="text-lg text-gray-500 font-normal">
                        {leader.position}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No leadership members available at the moment.
              </div>
            )}
          </div>
        </div>
        {/* Modern Gallery Section */}
        <div className="relative mt-32">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight tracking-tight text-center mx-auto">
              Our Latest Creations
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-light text-center mt-4 max-w-2xl mx-auto">
              A visual collection showcasing our agricultural excellence across all categories - from mill operations to quality control.
            </p>
            {galleryError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
                <p className="text-red-600 text-sm">Failed to load images: {galleryError}</p>
                <button
                  onClick={refresh}
                  className="mt-2 text-red-700 underline text-sm hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center mt-12 gap-4 max-w-5xl mx-auto">
            {galleryLoading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="relative group rounded-lg overflow-hidden bg-gray-200 animate-pulse">
                  <div className="size-56 bg-gray-300"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4">
                    <div className="h-6 bg-gray-400 rounded mb-2"></div>
                    <div className="h-4 bg-gray-400 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : !hasImages ? (
              // No images fallback
              <div className="text-center py-12 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-2">No images available yet</p>
                <p className="text-sm text-gray-400">Images will appear here as they are uploaded to the gallery.</p>
              </div>
            ) : (
              // Dynamic gallery images
              galleryImages.map((image, index) => (
                <div 
                  key={image.id} 
                  className="relative group rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => {
                    setSelectedImage(image);
                    setCurrentImageIndex(index);
                  }}
                >
                  <OptimizedImage
                    src={image.image_url}
                    alt={image.title || `Gallery image ${index + 1}`}
                    className="size-56 object-cover object-center"
                    lazy={true}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <h3 className="text-lg font-medium mb-1">{image.title || 'Untitled'}</h3>
                    {image.category && (
                      <span className="text-xs text-white/80 mb-2 bg-white/20 px-2 py-1 rounded-full w-fit">
                        {image.category}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
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

          {/* Navigation buttons */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 z-10"
                aria-label="View previous image"
              >
                ‹
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 z-10"
                aria-label="View next image"
              >
                ›
              </button>
            </>
          )}

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} className="max-w-[90vw] max-h-[90vh] bg-white rounded-lg overflow-hidden">
            <img
              src={selectedImage.image_url || selectedImage.src || 'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=736&auto=format&fit=crop'}
              alt={selectedImage.title || selectedImage.alt || 'Gallery image'}
              className="w-full h-auto object-contain max-h-[70vh]"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=736&auto=format&fit=crop';
              }}
            />
            <div className="p-4 bg-white text-gray-800">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{selectedImage.title || selectedImage.alt || 'Untitled'}</h3>
                {selectedImage.category && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {selectedImage.category}
                  </span>
                )}
              </div>
              {selectedImage.description && (
                <p className="text-gray-600 mb-2">{selectedImage.description}</p>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Image {currentImageIndex + 1} of {galleryImages.length}
                </span>
                {selectedImage.created_at && (
                  <span>
                    {new Date(selectedImage.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
