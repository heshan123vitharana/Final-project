import React, { useState, useEffect } from "react";
// Import your PNG images
import slideshow1 from '../assets/admin-login-slide-1.png';
import slideshow2 from '../assets/admin-login-slide-2.png';
import slideshow3 from '../assets/admin-login-slide-3.png';
// Import validation utilities
import { validateFormWithToast, handleApiError, handleNetworkError, handleLoginSuccess } from '../utils/validation';

const AdminLogin = ({ onBackToHome }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Slideshow content with imported SVG images
  const slides = [
    {
      title: "Paddy Marketing Board",
      subtitle: "Empowering Sri Lankan Farmers",
      description: "Supporting rice cultivation and ensuring food security across the nation through innovative agricultural solutions.",
      gradient: "from-green-400 to-emerald-600",
      image: slideshow1
    },
    {
      title: "Quality Rice Products",
      subtitle: "From Farm to Table",
      description: "Ensuring the highest quality standards in rice processing and distribution throughout Sri Lanka.",
      gradient: "from-amber-400 to-orange-600",
      image: slideshow2
    },
    {
      title: "Digital Innovation",
      subtitle: "Modern Agriculture Management",
      description: "Leveraging technology to streamline operations and improve efficiency in paddy marketing and distribution.",
      gradient: "from-blue-400 to-indigo-600",
      image: slideshow3
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form with toast notifications
    const { isValid } = validateFormWithToast(formData, ['email', 'password']);
    
    if (!isValid) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
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
        handleLoginSuccess('Admin');
        // Handle successful login (redirect, store token, etc.)
        // You can add your success logic here
      } else {
        handleApiError(null, result);
      }
    } catch (error) {
      handleNetworkError();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-6 font-inter" 
         style={{
           backgroundImage: `linear-gradient(to bottom right, rgba(248, 250, 252, 0.4), rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.4)), url('/bg-1.jpg')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      <div className="relative w-full max-w-4xl mx-auto h-[450px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid lg:grid-cols-2 h-full">
          
          {/* Left Section - Login Form */}
          <div className="flex flex-col justify-center p-6 lg:p-8 bg-white order-2 lg:order-1">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 tracking-tight">PMB Admin</h1>
                    <p className="text-xs text-gray-500 font-medium">Administrative Portal</p>
                  </div>
                </div>
                
                {/* Back to Home Button - Header Position */}
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="text-gray-500 hover:text-green-600 transition-colors flex items-center space-x-1.5 text-sm font-medium bg-gray-50 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-green-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-semibold tracking-wide">Back to Home</span>
                </button>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Welcome to PMB</h2>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Sign in to access your administrative dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="yourname@gmail.com"
                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="********"
                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide"
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

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 tracking-wide"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-semibold">Signing In...</span>
                  </>
                ) : (
                  <span className="font-bold tracking-wide">Login</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Section - Slideshow */}
          <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 order-1 lg:order-2 relative overflow-hidden">
            {/* Slideshow Container - Full Size */}
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
  );
};

export default AdminLogin;
