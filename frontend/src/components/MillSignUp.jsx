import { useState, useEffect } from 'react'
// Import validation utilities
import { validateFormWithToast, handleApiError, handleNetworkError, handleRegistrationSuccess } from '../utils/validation';

const MillSignUp = ({ onSignUpSuccess, onBackToLogin, onExit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '+94',
    businessName: '',
    businessType: 'private',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Slideshow images
  const slides = [
    "/src/assets/mill-slide-1.png",
    "/src/assets/mill-slide-2.png", 
    "/src/assets/mill-slide-3.png"
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Special handling for phone number to maintain +94 prefix
    if (name === 'phoneNumber') {
      // Ensure the value always starts with +94
      let phoneValue = value
      if (!phoneValue.startsWith('+94')) {
        phoneValue = '+94' + phoneValue.replace(/^\+?94?/, '')
      }
      setFormData(prev => ({
        ...prev,
        [name]: phoneValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form with toast notifications
    const { isValid } = validateFormWithToast(formData, [
      'firstName', 
      'lastName', 
      'phoneNumber', 
      'businessName', 
      'businessType', 
      'email', 
      'password', 
      'confirmPassword'
    ]);
    
    if (!isValid) {
      return;
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          business_name: formData.businessName,
          business_type: formData.businessType,
          phone: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });
      const result = await response.json();
      
      if (response.ok) {
        handleRegistrationSuccess();
        onSignUpSuccess(result.user);
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
          <div className="grid lg:grid-cols-3 h-full">
            
            {/* Left Section - Personal & Business Info */}
            <div className="flex flex-col justify-center p-6 lg:p-8 bg-white order-2 lg:order-1">
              {/* Header with Back Button */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md mr-2">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-base font-bold text-gray-900 tracking-tight">Mill Portal</h1>
                      <p className="text-xs text-gray-500 font-medium">Registration</p>
                    </div>
                  </div>
                  
                  {/* Back to Home Button */}
                  <button
                    type="button"
                    onClick={onExit}
                    className="text-gray-500 hover:text-green-600 transition-colors flex items-center space-x-1 text-xs font-medium bg-gray-50 hover:bg-green-50 px-2 py-1 rounded-lg border border-gray-200 hover:border-green-200"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-semibold tracking-wide">Home</span>
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Personal Information</h2>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Enter your personal and business details
                </p>
              </div>

              {/* Personal Info Fields */}
              <form className="space-y-3" onSubmit={handleSubmit}>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label htmlFor="firstName" className="block text-xs font-semibold text-gray-700 tracking-wide">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="lastName" className="block text-xs font-semibold text-gray-700 tracking-wide">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                      placeholder="Last name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 tracking-wide">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                    placeholder="yourname@gmail.com"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="phoneNumber" className="block text-xs font-semibold text-gray-700 tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                    placeholder="+94xxxxxxxxx"
                  />
                </div>

                {/* Business Name */}
                <div className="space-y-1">
                  <label htmlFor="businessName" className="block text-xs font-semibold text-gray-700 tracking-wide">
                    Business Name *
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                    placeholder="Your business name"
                  />
                </div>

                {/* Business Type */}
                <div className="space-y-1">
                  <label htmlFor="businessType" className="block text-xs font-semibold text-gray-700 tracking-wide">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                  >
                    <option value="private">Private</option>
                    <option value="government">Government</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Middle Section - Password & Actions */}
            <div className="flex flex-col justify-center p-6 lg:p-8 bg-gray-50 order-3 lg:order-2">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Security</h2>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Set up your account password
                </p>
              </div>

              {/* Password Fields */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-xs font-semibold text-gray-700 tracking-wide">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 tracking-wide">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 tracking-wide text-sm mt-6"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-semibold">Creating Account...</span>
                  </>
                ) : (
                  <span className="font-bold tracking-wide">Sign up</span>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-600">
                  Already have an account? {' '}
                  <button
                    type="button"
                    onClick={onBackToLogin}
                    className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-200 tracking-wide"
                  >
                    Sign in 
                  </button>
                </p>
              </div>
            </div>

            {/* Right Section - Icon Slideshow */}
            <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 order-1 lg:order-3 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-500/5 to-green-700/10"></div>
              
              {/* Slideshow Container */}
              <div className="relative h-full flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Current Slide - Icon Only */}
                  <div className="relative w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out transform">
                    {/* PNG Image - Small Icon Style */}
                    <div className="transform transition-all duration-1000 hover:scale-105">
                      <img 
                        src={slides[currentSlide]} 
                        alt={`Mill Slide ${currentSlide + 1}`}
                        className="w-60 h-60 object-contain opacity-95"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Pattern Overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23065f46' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MillSignUp
