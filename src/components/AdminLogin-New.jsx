import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminLogin = ({ onClose }) => {
  const { t } = useTranslation();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  
  const [formData, setFormData] = useState({
    adminId: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    department: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isSignIn) {
        // Admin sign in validation
        if (formData.adminId === 'admin001' && formData.password === 'paddy2024') {
          alert(t('auth.adminLoginSuccess'));
          onClose?.();
        } else {
          setError(t('auth.invalidCredentials'));
        }
      } else {
        // Admin sign up validation
        if (!formData.adminId || !formData.email || !formData.password || !formData.confirmPassword || !formData.employeeId || !formData.department) {
          setError(t('auth.fillAllFields'));
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          setError(t('auth.passwordMismatch'));
          return;
        }
        
        if (formData.password.length < 6) {
          setError(t('auth.passwordTooShort'));
          return;
        }

        alert(t('auth.adminRegisterSuccess'));
        setIsSignIn(true);
        setFormData({
          adminId: '',
          email: '',
          password: '',
          confirmPassword: '',
          employeeId: '',
          department: ''
        });
      }
    } catch {
      setError(t('auth.somethingWentWrong'));
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 group z-20"
          >
            <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('auth.adminPortal')}</h2>
            <p className="text-orange-100 text-sm">{t('auth.paddyMarketingBoard')}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex relative">
          <div className={`absolute bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 ${isSignIn ? 'left-0 w-1/2' : 'left-1/2 w-1/2'}`}></div>
          
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-4 text-center font-semibold transition-all duration-300 transform hover:scale-105 ${
              isSignIn 
                ? 'text-orange-600 bg-orange-50/50' 
                : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50/30'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {t('auth.signIn')}
            </div>
          </button>
          
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-4 text-center font-semibold transition-all duration-300 transform hover:scale-105 ${
              !isSignIn 
                ? 'text-orange-600 bg-orange-50/50' 
                : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50/30'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              {t('auth.signUp')}
            </div>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin ID Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t('auth.adminId')} *
              </label>
              <div className="relative group">
                <input
                  type="text"
                  name="adminId"
                  value={formData.adminId}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('adminId')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 ${
                    focusedField === 'adminId' 
                      ? 'border-orange-500 shadow-lg transform scale-[1.02]' 
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                  placeholder={t('auth.adminIdPlaceholder')}
                  required
                />
                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                  focusedField === 'adminId' ? 'text-orange-500 scale-110' : 'text-gray-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email Field (Sign Up only) */}
            {!isSignIn && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{t('auth.email')} *</label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 ${
                      focusedField === 'email' 
                        ? 'border-orange-500 shadow-lg transform scale-[1.02]' 
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                  />
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'email' ? 'text-orange-500 scale-110' : 'text-gray-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{t('auth.password')} *</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 ${
                    focusedField === 'password' 
                      ? 'border-orange-500 shadow-lg transform scale-[1.02]' 
                      : 'border-gray-300 hover:border-orange-400'
                  }`}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                    focusedField === 'password' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
                  }`}
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
            </div>

            {/* Confirm Password (Sign Up only) */}
            {!isSignIn && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{t('auth.confirmPassword')} *</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 ${
                      focusedField === 'confirmPassword' 
                        ? 'border-orange-500 shadow-lg transform scale-[1.02]' 
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                      focusedField === 'confirmPassword' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
                    }`}
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
              </div>
            )}

            {/* Employee ID Field (Sign Up only) */}
            {!isSignIn && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{t('auth.employeeId')} *</label>
                <div className="relative group">
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('employeeId')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 ${
                      focusedField === 'employeeId' 
                        ? 'border-orange-500 shadow-lg transform scale-[1.02]' 
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                    placeholder={t('auth.employeeIdPlaceholder')}
                    required
                  />
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'employeeId' ? 'text-orange-500 scale-110' : 'text-gray-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Department Field (Sign Up only) */}
            {!isSignIn && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">{t('auth.department')} *</label>
                <div className="relative group">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('department')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 ${
                      focusedField === 'department' 
                        ? 'border-orange-500 shadow-lg transform scale-[1.02]' 
                        : 'border-gray-300 hover:border-orange-400'
                    }`}
                    required
                  >
                    <option value="">{t('auth.selectDepartment')}</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    focusedField === 'department' ? 'text-orange-500 scale-110' : 'text-gray-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-orange-500/30 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 hover:shadow-lg active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isSignIn ? t('auth.signingIn') : t('auth.creatingAccount')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSignIn ? "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"} />
                  </svg>
                  <span>{isSignIn ? t('auth.accessAdminPortal') : t('auth.createAdminAccount')}</span>
                </div>
              )}
            </button>

            {/* Demo Credentials for Sign In */}
            {isSignIn && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-amber-800 text-xs font-semibold mb-1">{t('auth.demoCredentials')}:</p>
                    <p className="text-amber-700 text-xs">
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
  );
};

export default AdminLogin;
