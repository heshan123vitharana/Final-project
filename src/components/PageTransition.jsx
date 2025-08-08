import { useState, useEffect } from 'react';

/**
 * PageTransition Component
 * 
 * Provides professional page transitions with multiple animation effects
 * Supports fade, slide, and scale transitions with smooth animations
 */
const PageTransition = ({ 
  children, 
  isVisible = true, 
  transitionType = 'fade',
  duration = 500,
  delay = 0 
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setAnimationClass(getEnterAnimation(transitionType));
      }, 10 + delay);
      
      return () => clearTimeout(timer);
    } else {
      setAnimationClass(getExitAnimation(transitionType));
      // Hide component after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, transitionType, duration, delay]);

  const getEnterAnimation = (type) => {
    switch (type) {
      case 'slideLeft':
        return 'animate-slide-in-left';
      case 'slideRight':
        return 'animate-slide-in-right';
      case 'slideUp':
        return 'animate-slide-in-up';
      case 'slideDown':
        return 'animate-slide-in-down';
      case 'scale':
        return 'animate-scale-in';
      case 'fadeScale':
        return 'animate-fade-scale-in';
      case 'blur':
        return 'animate-blur-in';
      default:
        return 'animate-fade-in';
    }
  };

  const getExitAnimation = (type) => {
    switch (type) {
      case 'slideLeft':
        return 'animate-slide-out-left';
      case 'slideRight':
        return 'animate-slide-out-right';
      case 'slideUp':
        return 'animate-slide-out-up';
      case 'slideDown':
        return 'animate-slide-out-down';
      case 'scale':
        return 'animate-scale-out';
      case 'fadeScale':
        return 'animate-fade-scale-out';
      case 'blur':
        return 'animate-blur-out';
      default:
        return 'animate-fade-out';
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`transition-all duration-${duration} ease-out ${animationClass}`}
      style={{ 
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

/**
 * Page Router Component with Professional Transitions
 * 
 * Manages page transitions between different sections of the website
 * Provides smooth animations when switching between pages
 */
export const PageRouter = ({ currentPage, children, transitionType = 'fade' }) => {
  const [displayPage, setDisplayPage] = useState(currentPage);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (currentPage !== displayPage) {
      setIsTransitioning(true);
      
      // Start exit animation
      const exitTimer = setTimeout(() => {
        setDisplayPage(currentPage);
        
        // Start enter animation
        const enterTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
        
        return () => clearTimeout(enterTimer);
      }, 300);
      
      return () => clearTimeout(exitTimer);
    }
  }, [currentPage, displayPage]);

  return (
    <div className="relative overflow-hidden">
      {/* Loading overlay during transition */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-green-600 font-semibold">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Page content with transition */}
      <PageTransition 
        isVisible={!isTransitioning} 
        transitionType={transitionType}
        duration={300}
      >
        {children}
      </PageTransition>
    </div>
  );
};

/**
 * Section Transition Component
 * 
 * For smooth transitions between sections within a page
 */
export const SectionTransition = ({ 
  children, 
  trigger = true, 
  direction = 'up',
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, delay]);

  const getTransitionClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'left':
          return 'transform translate-x-[-100px] opacity-0';
        case 'right':
          return 'transform translate-x-[100px] opacity-0';
        case 'down':
          return 'transform translate-y-[-50px] opacity-0';
        default:
          return 'transform translate-y-[50px] opacity-0';
      }
    }
    return 'transform translate-x-0 translate-y-0 opacity-100';
  };

  return (
    <div 
      className={`transition-all duration-700 ease-out ${getTransitionClass()}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
