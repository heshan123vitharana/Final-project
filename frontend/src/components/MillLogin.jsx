import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { validateFormWithToast, handleApiError } from '../utils/validation';
import { motion } from 'framer-motion';

const MillLogin = ({ onLoginSuccess, onGoToSignUp, onExit, onGoToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid } = validateFormWithToast(formData, ['email', 'password']);
    if (!isValid) {
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
        toast.success('Login successful!');
        if (result.role === 'admin') {
          sessionStorage.setItem('adminData', JSON.stringify(result));
          navigate('/admin/dashboard');
        } else if (result.role === 'mill') {
          onLoginSuccess(result);
        }
      } else {
        const result = await response.json();
        handleApiError(null, result);
      }
    } catch (error) {
      handleApiError(error, null);
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
                    <h1 className="text-base font-bold text-gray-900 tracking-tight">Unified Login</h1>
                    <p className="text-xs text-gray-500 font-medium">Admin & Mill Access</p>
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

              <h2 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Welcome Back</h2>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Sign in to access your dashboard.
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
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
                  placeholder="yourname@gmail.com"
                />
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
                    className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium tracking-wide text-sm"
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
                      <span className="font-semibold">Signing In...</span>
                    </>
                  ) : (
                    <span className="font-bold tracking-wide">Sign In</span>
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
