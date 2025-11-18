import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MillLogin = ({ onLoginSuccess, onGoToSignUp, onExit, onGoToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting', {
        duration: 4000,
        icon: '⚠️'
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const url = 'http://localhost:5000/api/auth/login';
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success('🎉 Login successful! Welcome back!', {
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: 'bold'
          }
        });
        if (result.role === 'admin') {
          sessionStorage.setItem('adminData', JSON.stringify(result));
          navigate('/admin/dashboard');
        } else if (result.role === 'mill') {
          onLoginSuccess(result);
        }
      } else {
        const result = await response.json();
        // Enhanced error messages
        if (result.message.includes('Invalid credentials') || result.message.includes('password')) {
          toast.error('❌ Invalid email or password. Please try again.', {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff'
            }
          });
        } else if (result.message.includes('not found')) {
          toast.error('❌ No account found with this email address.', {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff'
            }
          });
        } else {
          toast.error('❌ ' + result.message || 'Login failed. Please try again.', {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff'
            }
          });
        }
      }
    } catch (_error) {
      toast.error('🔌 Unable to connect to server. Please try again.', {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-6 font-inter"
           style={{
             backgroundImage: `linear-gradient(to bottom right, rgba(248, 250, 252, 0.4), rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.4)), url('/bg-1.jpg')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat'
           }}>

        <div className="relative w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100/50">
          <div className="flex flex-col justify-center p-6 lg:p-8 bg-white">
            {/* Header with Back Button */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1"></path></svg>
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-gray-900 tracking-tight">Mill Services Portal</h1>
                    <p className="text-xs text-gray-500 font-medium">Secure access for registered partners</p>
                  </div>
                </div>

                {/* Back to Home Button */}
                <button
                  type="button"
                  onClick={onExit}
                  className="flex items-center space-x-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200 hover:border-emerald-300 px-3.5 py-1.5 rounded-lg shadow-sm transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="tracking-wide">Home</span>
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Welcome Back</h2>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Sign in to continue to your mill dashboard.
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-2" onSubmit={handleSubmit}>
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
                  className={`w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 font-medium tracking-wide text-sm ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
                  }`}
                  placeholder="yourname@gmail.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
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
                    className={`w-full px-3 py-1.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 font-medium tracking-wide text-sm ${
                      errors.password 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
                    }`}
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right pt-1">
                <button
                  type="button"
                  onClick={onGoToForgotPassword}
                  className="text-xs text-green-600 hover:text-green-500 font-medium transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-1.5 px-4 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 tracking-wide text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-semibold">Signing in...</span>
                    </>
                  ) : (
                    <span className="font-bold tracking-wide">Sign in</span>
                  )}
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-3 space-y-2 pb-2">
              <p className="text-xs text-gray-600">
                Don't have a mill account? {' '}
                <button
                  type="button"
                  onClick={onGoToSignUp}
                  className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-200 tracking-wide"
                >
                  Create your account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default MillLogin;
