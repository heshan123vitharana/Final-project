import { useState, useEffect } from 'react'
// Import slideshow images for mill portal
import millSlide1 from '../assets/mill-slide-1.png';
import millSlide2 from '../assets/mill-slide-2.png';
import millSlide3 from '../assets/mill-slide-3.png';
// Import validation utilities
import { validateFormWithToast, handleApiError, handleNetworkError, handleLoginSuccess } from '../utils/validation';

const MillLogin = ({ onLoginSuccess, onGoToSignUp, onExit }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Slideshow content for mill portal
  const slides = [
    {
      title: "Mill Owner Portal",
      subtitle: "Manage Your Rice Mill Operations",
      description: "Access comprehensive tools for inventory management, pricing updates, and business operations in one unified platform.",
      gradient: "from-green-400 to-emerald-600",
      image: millSlide1
    },
    {
      title: "Real-time Paddy Prices",
      subtitle: "Stay Updated with Market Rates",
      description: "Get instant access to current paddy prices and market trends to make informed business decisions.",
      gradient: "from-amber-400 to-orange-600",
      image: millSlide2
    },
    {
      title: "Digital Mill Management",
      subtitle: "Streamline Your Operations",
      description: "Digitize your mill operations with automated stock tracking, quality control, and performance analytics.",
      gradient: "from-blue-400 to-indigo-600",
      image: millSlide3
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form with toast notifications
    const { isValid } = validateFormWithToast(formData, ['email', 'password']);
    
    if (!isValid) {
      return;
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const result = await response.json();
      
      if (response.ok) {
        handleLoginSuccess('Mill Owner');
        const userData = { ...result.user, token: result.token };
        onLoginSuccess(userData);
      } else {
        handleApiError(null, result);
      }
    } catch {
      handleNetworkError();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-6 font-inter"
           style={{
             backgroundImage: `linear-gradient(to bottom right, rgba(248, 250, 252, 0.4), rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.4)), url('/bg-1.jpg')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat'
           }}>
        
        <div className="relative w-full max-w-5xl mx-auto h-[500px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100/50">
          <div className="grid lg:grid-cols-2 h-full">
            
            {/* Left Section - Login Form */}
            <div className="flex flex-col justify-center p-6 lg:p-8 bg-white order-2 lg:order-1">
              {/* Header with Back Button */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-gray-900 tracking-tight">Mill Portal</h1>
                      <p className="text-xs text-gray-500 font-medium">Rice Mill Operations</p>
                    </div>
                  </div>
                  
                  {/* Back to Home Button */}
                  <button
                    type="button"
                    onClick={onExit}
                    className="text-gray-500 hover:text-green-600 transition-colors flex items-center space-x-1.5 text-sm font-medium bg-gray-50 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-green-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-semibold tracking-wide">Back to Home</span>
                  </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Welcome Back</h2>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Sign in to access your mill dashboard and manage operations
                </p>
              </div>

              {/* Login Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 tracking-wide">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide"
                    placeholder="yourname@gmail.com"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 tracking-wide">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 tracking-wide"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-semibold">Signing In...</span>
                    </>
                  ) : (
                    <span className="font-bold tracking-wide">Sign In</span>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center pt-3 space-y-2">
                <p className="text-sm text-gray-600">
                  Don't have an account? {' '}
                  <button
                    type="button"
                    onClick={onGoToSignUp}
                    className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-200 tracking-wide"
                  >
                    Create your account
                  </button>
                </p>
                
                {/* Small Continue with Google Button */}
                <button
                  type="button"
                  className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-1.5 px-3 rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2 text-xs mx-auto"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            </div>

            {/* Right Section - Slideshow */}
            <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 order-1 lg:order-2 relative overflow-hidden">
              {/* Slideshow Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Current Slide - Icon Only */}
                <div className="relative w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out transform">
                  {/* PNG Image - Large and Matching Container */}
                  <div className="transform transition-all duration-1000 hover:scale-105">
                    <img 
                      src={slides[currentSlide].image} 
                      alt={slides[currentSlide].title}
                      className="w-80 h-80 object-contain opacity-95"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MillLogin
