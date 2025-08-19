<<<<<<< HEAD

import React from 'react';

const AdminLogin = ({ isLoading, errors = {}, formData, handleInputChange, handleSubmit, onBackToHome }) => {

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-emerald-500/90 via-green-600/85 to-teal-700/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Welcome Section */}
        <div className="text-center lg:text-left text-white space-y-6">
          {/* Exit Button */}
          <div className="flex justify-start">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 backdrop-blur-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-normal">
              Admin Portal <br />
              <span className="text-green-200">Paddy Marketing Board</span>
            </h1>
            
            <p className="text-xl text-green-100 max-w-md mx-auto lg:mx-0">
              {'Secure access to administrative dashboard and management tools'}
            </p>
          </div>
          
          {/* Features List */}
          <div className="space-y-3 max-w-md mx-auto lg:mx-0">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-green-100">Comprehensive Dashboard Analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <span className="text-green-100">User & Mill Management System</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-green-100">Quality Control & Monitoring</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            {/* Only login tab header for admin portal */}
            <div className="flex">
              <button
                className="flex-1 py-6 text-center font-semibold text-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg cursor-default"
                disabled
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Admin Login
                </div>
              </button>
            </div>
            {/* Form Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {/* Error Display */}
              {errors.general && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{errors.general}</p>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email *
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                    placeholder="Enter your email address"
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                {/* Email field replaced by Admin ID field in form logic. MFA field removed. */}
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
=======
import { useState, useEffect } from 'react';

const AdminLogin = ({ isOpen, onClose, onLogin }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Smart popup animation
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore scrolling
    };
  }, [isOpen, onClose]);

  // Smart password strength checker
  useEffect(() => {
    if (activeTab === 'signup' && credentials.password) {
      const password = credentials.password;
      let strength = 0;
      
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [credentials.password, activeTab]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Very Weak';
    if (passwordStrength < 50) return 'Weak';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (activeTab === 'signup') {
      if (credentials.password !== credentials.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (credentials.password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
    }

    setTimeout(() => {
      if (activeTab === 'signin') {
        if (credentials.username === 'admin' && credentials.password === 'paddy2024') {
          onLogin(true);
          onClose();
          resetForm();
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        onLogin(true);
        onClose();
        resetForm();
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setError('');
    
    // In production, integrate with actual social login providers
    console.log(`Logging in with ${provider}`);
    
    setTimeout(() => {
      onLogin(true);
      onClose();
      resetForm();
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setCredentials({ username: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setShowPassword(false);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-500 max-h-[85vh] overflow-y-auto border-2 border-gray-200/50 hover:border-green-300/30 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Smart Header with Gradient - Reduced height */}
        <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-6 text-white overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white rounded-full translate-x-10 translate-y-10 animate-pulse delay-300"></div>
          </div>
          
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group"
            aria-label="Close admin login"
          >
            <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Admin Portal</h2>
            <p className="text-green-100 text-sm">Paddy Marketing Board - Sri Lanka</p>
          </div>
        </div>

        {/* Smart Tab Navigation */}
        <div className="flex relative">
          <div className={`absolute bottom-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 ${activeTab === 'signin' ? 'left-0 w-1/2' : 'left-1/2 w-1/2'}`}></div>
          
          <button
            onClick={() => handleTabSwitch('signin')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 relative group ${
              activeTab === 'signin'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="relative z-10">Sign In</span>
            {activeTab === 'signin' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg"></div>
            )}
          </button>
          
          <button
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 relative group ${
              activeTab === 'signup'
                ? 'text-green-600 bg-green-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="relative z-10">Sign Up</span>
            {activeTab === 'signup' && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg"></div>
            )}
          </button>
        </div>

        {/* Smart Form Content - Reduced padding */}
        <div className="p-6 bg-gradient-to-b from-white to-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Smart Username Field */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${focusedField === 'username' ? 'bg-green-500 scale-125' : 'bg-gray-300'}`}></div>
                Username
              </label>
              <div className={`relative group transition-all duration-300 ${focusedField === 'username' ? 'transform scale-[1.02]' : ''}`}>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'username' ? 'text-green-500' : 'text-gray-400'}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-green-500 transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="Enter your username"
                  required
                />
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'username' ? 'opacity-100' : ''}`}></div>
              </div>
            </div>

            {/* Smart Email Field (Signup only) */}
            {activeTab === 'signup' && (
              <div className="space-y-1.5 animate-fade-in">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${focusedField === 'email' ? 'bg-green-500 scale-125' : 'bg-gray-300'}`}></div>
                  Email Address
                </label>
                <div className={`relative group transition-all duration-300 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'email' ? 'text-green-500' : 'text-gray-400'}`}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-green-500 transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                    placeholder="Enter your email"
                    required={activeTab === 'signup'}
                  />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'email' ? 'opacity-100' : ''}`}></div>
                </div>
              </div>
            )}

            {/* Smart Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${focusedField === 'password' ? 'bg-green-500 scale-125' : 'bg-gray-300'}`}></div>
                Password
                {activeTab === 'signup' && passwordStrength > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                    passwordStrength < 50 ? 'bg-red-100 text-red-600' : 
                    passwordStrength < 75 ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-green-100 text-green-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                )}
              </label>
              <div className={`relative group transition-all duration-300 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'password' ? 'text-green-500' : 'text-gray-400'}`}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-green-500 transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600 transition-all duration-200 transform hover:scale-110"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'password' ? 'opacity-100' : ''}`}></div>
              </div>
              
              {/* Smart Password Strength Indicator */}
              {activeTab === 'signup' && credentials.password && (
                <div className="mt-2 animate-fade-in">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Password Strength</span>
                    <span>{passwordStrength}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Smart Confirm Password Field (Signup only) */}
            {activeTab === 'signup' && (
              <div className="space-y-2 animate-fade-in">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${focusedField === 'confirmPassword' ? 'bg-green-500 scale-125' : 'bg-gray-300'}`}></div>
                  Confirm Password
                  {credentials.confirmPassword && (
                    <span className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                      credentials.password === credentials.confirmPassword ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {credentials.password === credentials.confirmPassword ? '✓ Match' : '✗ No Match'}
                    </span>
                  )}
                </label>
                <div className={`relative group transition-all duration-300 ${focusedField === 'confirmPassword' ? 'transform scale-[1.02]' : ''}`}>
                  <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-green-500' : 'text-gray-400'}`}>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={credentials.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-green-500 transition-all duration-300 placeholder-gray-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg"
                    placeholder="Confirm your password"
                    required={activeTab === 'signup'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600 transition-all duration-200 transform hover:scale-110"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 transition-opacity duration-300 pointer-events-none ${focusedField === 'confirmPassword' ? 'opacity-100' : ''}`}></div>
                </div>
              </div>
            )}

            {/* Smart Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">{error}</span>
                </div>
                <button 
                  onClick={() => setError('')}
                  className="flex-shrink-0 p-1 hover:bg-red-200 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Smart Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  <span className="relative z-10">{activeTab === 'signin' ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="relative z-10 text-lg">{activeTab === 'signin' ? 'Sign In to Dashboard' : 'Create Admin Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Smart Divider - Reduced margin */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 bg-gradient-to-r from-gray-50 to-white text-gray-600 font-semibold">Or continue with</span>
            </div>
          </div>

          {/* Smart Social Login Buttons - Reduced padding */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="group relative overflow-hidden flex items-center justify-center p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300 hover:shadow-lg disabled:opacity-50 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              className="group relative overflow-hidden flex items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg disabled:opacity-50 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-6 h-6 text-blue-600 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            <button
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
              className="group relative overflow-hidden flex items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 hover:shadow-lg disabled:opacity-50 transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-6 h-6 text-gray-900 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </button>
          </div>

          {/* Smart Demo Credentials - Reduced padding and margin */}
          {activeTab === 'signin' && (
            <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl shadow-inner animate-fade-in">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-800">Demo Credentials</h4>
                  <p className="text-xs text-amber-600">Use these credentials for testing</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/50 p-2 rounded-lg border border-amber-200">
                  <div className="text-amber-700 font-semibold mb-1">Username</div>
                  <code className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-mono text-xs">admin</code>
                </div>
                <div className="bg-white/50 p-2 rounded-lg border border-amber-200">
                  <div className="text-amber-700 font-semibold mb-1">Password</div>
                  <code className="bg-amber-100 text-amber-800 px-2 py-1 rounded font-mono text-xs">paddy2024</code>
                </div>
              </div>
            </div>
          )}
>>>>>>> 11172fac6621c27fbbff6f642c33a7a2ab704aeb
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
