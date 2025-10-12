import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  placeholder = 'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&w=736&auto=format&fit=crop',
  lazy = true,
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(lazy ? null : src);
  const [imageRef, setImageRef] = useState();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy) return;

    let observer;

    if (imageRef && src) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );

      observer.observe(imageRef);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src, lazy]);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
    onLoad();
  };

  const handleError = () => {
    setError(true);
    setImageSrc(placeholder);
    onError();
  };

  const handleRef = (node) => {
    imgRef.current = node;
    setImageRef(node);
  };

  // Show placeholder while loading or if lazy loading hasn't started
  if (lazy && !imageSrc) {
    return (
      <div
        ref={handleRef}
        className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        {...props}
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Loading overlay */}
      {!loaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${className}`}>
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      <img
        ref={lazy ? handleRef : imgRef}
        src={imageSrc || src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        {...props}
      />

      {/* Error state */}
      {error && (
        <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
          Failed to load
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
