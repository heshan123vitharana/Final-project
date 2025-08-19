import { useState, useEffect } from 'react';

/**
 * LoadingTransition Component
 * 
 * Professional loading animation for page transitions
 * Provides smooth loading states with agricultural-themed animations
 */
const LoadingTransition = ({ 
  isLoading = false, 
  message = "Loading...", 
  type = "default" 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  const renderLoadingContent = () => {
    switch (type) {
      case 'rice':
        return (
          <div className="flex flex-col items-center gap-6">
            {/* Animated rice grains */}
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-6 bg-rice-gold rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            
            {/* Loading text */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {message}
              </h3>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rice-gold to-yellow-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {Math.round(Math.min(progress, 100))}% Complete
              </p>
            </div>
          </div>
        );

      case 'mill':
        return (
          <div className="flex flex-col items-center gap-6">
            {/* Rotating mill icon */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <svg className="absolute inset-4 w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {message}
              </h3>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-600 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center gap-6">
            {/* Default spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-green-200 rounded-full"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {message}
              </h3>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-200/50">
        {renderLoadingContent()}
      </div>
    </div>
  );
};

/**
 * Page Loader Component
 * 
 * Shows loading state for entire page transitions
 */
export const PageLoader = ({ isLoading, message = "Loading content..." }) => {
  return (
    <LoadingTransition 
      isLoading={isLoading} 
      message={message} 
      type="rice" 
    />
  );
};

/**
 * Modal Loader Component
 * 
 * Shows loading state for modal/popup transitions
 */
export const ModalLoader = ({ isLoading, message = "Processing..." }) => {
  return (
    <LoadingTransition 
      isLoading={isLoading} 
      message={message} 
      type="mill" 
    />
  );
};

export default LoadingTransition;
