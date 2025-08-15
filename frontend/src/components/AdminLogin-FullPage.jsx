import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminLogin = ({ isOpen, onClose, onLogin }) => {
  const { t } = useTranslation();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    adminId: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: '',
    firstName: '',
    lastName: ''
  });

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

    if (!formData.adminId) {
      newErrors.adminId = t('auth.required_field');
    }

    if (!formData.password) {
      newErrors.password = t('auth.required_field');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.password_min_length');
    }

    if (!isSignIn) {
      if (!formData.email) {
        newErrors.email = t('auth.required_field');
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = t('auth.email_invalid');
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.required_field');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.passwords_not_match');
      }

      if (!formData.firstName) {
        newErrors.firstName = t('auth.required_field');
      }

      if (!formData.lastName) {
        newErrors.lastName = t('auth.required_field');
      }

      if (!formData.employeeId) {
        newErrors.employeeId = t('auth.required_field');
      }

      if (!formData.department) {
        newErrors.department = t('auth.required_field');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isSignIn) {
        // Admin sign in validation
        if (formData.adminId === 'admin001' && formData.password === 'paddy2024') {
          // Create admin session data
          const adminData = {
            id: Date.now(),
            adminId: formData.adminId,
            firstName: 'Admin',
            lastName: 'User',
            department: 'Administration',
            employeeId: 'EMP001',
            isAdmin: true,
            loginTime: new Date().toISOString()
          };

          // Store in sessionStorage
          sessionStorage.setItem('adminData', JSON.stringify(adminData));
          
          onLogin?.(true);
          onClose?.();
        } else {
          setErrors({ general: t('auth.invalid_credentials') });
        }
      } else {
        // Create admin account
        const adminData = {
          id: Date.now(),
          adminId: formData.adminId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          department: formData.department,
          employeeId: formData.employeeId,
          isAdmin: true,
          isNewAdmin: true,
          registrationTime: new Date().toISOString()
        };

        // Store in sessionStorage
        sessionStorage.setItem('adminData', JSON.stringify(adminData));
        
        onLogin?.(true);
        onClose?.();
      }
    } catch {
      setErrors({ general: t('auth.something_went_wrong') });
    } finally {
      setIsLoading(false);
    }
  };

  const departments = [
    'Administration',
    'Marketing', 
    'Quality Control',
    'Storage & Logistics',
    'Finance',
    'Human Resources',
    'IT Support'
  ];

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Welcome Section */}
        <div className="text-center lg:text-left text-white space-y-6">
          {/* Exit Button */}
          <div className="flex justify-start">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">{t('auth.exit')}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 backdrop-blur-sm">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              {t('auth.admin_portal')} <br />
              <span className="text-orange-200">{t('auth.paddy_marketing_board')}</span>
            </h1>
            
            <p className="text-xl text-orange-100 max-w-md mx-auto lg:mx-0">
              {isSignIn ? t('auth.admin_signin_subtitle') : t('auth.admin_signup_subtitle')}
            </p>
          </div>
          
          {/* Features List */}
          <div className="space-y-3 max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-orange-100">{t('auth.admin_feature_1')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span className="text-orange-100">{t('auth.admin_feature_2')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-orange-100">{t('auth.admin_feature_3')}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Tab Header */}
            <div className="flex">
              <button
                onClick={() => setIsSignIn(true)}
                className={`flex-1 py-6 text-center font-semibold text-lg transition-all duration-300 ${
                  isSignIn
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t('auth.sign_in')}
                </div>
              </button>
              
              <button
                onClick={() => setIsSignIn(false)}
                className={`flex-1 py-6 text-center font-semibold text-lg transition-all duration-300 ${
                  !isSignIn
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {t('auth.sign_up')}
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
                {/* Admin ID Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t('auth.admin_id')} *
                  </label>
                  <input
                    type="text"
                    name="adminId"
                    value={formData.adminId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                    placeholder={t('auth.admin_id_placeholder')}
                    required
                  />
                  {errors.adminId && <p className="mt-1 text-sm text-red-600">{errors.adminId}</p>}
                </div>

                {/* Email Field (Sign Up only) */}
                {!isSignIn && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">{t('auth.email')} *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                      placeholder={t('auth.email_placeholder')}
                      required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                )}

                {/* First Name and Last Name (Sign Up only) */}
                {!isSignIn && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">{t('auth.first_name')} *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                        placeholder={t('auth.first_name_placeholder')}
                        required
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">{t('auth.last_name')} *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                        placeholder={t('auth.last_name_placeholder')}
                        required
                      />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>
                )}

                {/* Employee ID and Department (Sign Up only) */}
                {!isSignIn && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">{t('auth.employee_id')} *</label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                        placeholder={t('auth.employee_id_placeholder')}
                        required
                      />
                      {errors.employeeId && <p className="mt-1 text-sm text-red-600">{errors.employeeId}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">{t('auth.department')} *</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                        required
                      >
                        <option value="">{t('auth.select_department')}</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">{t('auth.password')} *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                      placeholder={t('auth.password_placeholder')}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {!isSignIn && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">{t('auth.confirm_password')} *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300"
                        placeholder={t('auth.confirm_password_placeholder')}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{isSignIn ? t('auth.signing_in') : t('auth.creating_account')}</span>
                    </div>
                  ) : (
                    <span>{isSignIn ? t('auth.sign_in_to_admin_portal') : t('auth.create_admin_account')}</span>
                  )}
                </button>

                {/* Demo Credentials for Sign In */}
                {isSignIn && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-amber-800 text-sm font-semibold mb-1">{t('auth.demo_credentials')}:</p>
                        <p className="text-amber-700 text-sm">
                          <span className="font-mono">admin001</span> / <span className="font-mono">paddy2024</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
