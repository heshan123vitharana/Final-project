import { useState } from 'react'
import { validateFormWithToast, handleApiError, showSuccessToast } from '../utils/validation';

const ForgotPassword = ({ onBackToLogin, onExit }) => {
  const [formData, setFormData] = useState({
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form using toast system
    const { isValid } = validateFormWithToast(formData, ['email']);
    if (!isValid) {
      return;
    }

    setIsSubmitting(true)
    try {
      const url = 'http://localhost:5000/api/auth/forgot-password';
      const payload = {
        email: formData.email,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok) {
        setIsEmailSent(true);
        showSuccessToast('Password reset email sent! Check your inbox.');
      } else {
        handleApiError(null, result);
      }
    } catch (error) {
      handleApiError(error, null);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isEmailSent) {
    return (
      <div className="fixed inset-0 z-40 min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-6 font-inter"
           style={{
             backgroundImage: `linear-gradient(to bottom right, rgba(248, 250, 252, 0.4), rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.4)), url('/bg-1.jpg')`,
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundRepeat: 'no-repeat'
           }}>

        <div className="relative w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-600 leading-relaxed">
              We've sent a password reset link to <strong>{formData.email}</strong>
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-green-800 mb-1">What's next?</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Check your email inbox (and spam folder)</li>
                  <li>• Click the reset link in the email</li>
                  <li>• Create your new password</li>
                  <li>• Sign in with your new password</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
            >
              Back to Login
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEmailSent(false);
                setFormData({ email: '' });
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
            >
              Try Different Email
            </button>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={onExit}
              className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-6 font-inter"
         style={{
           backgroundImage: `linear-gradient(to bottom right, rgba(248, 250, 252, 0.4), rgba(255, 255, 255, 0.4), rgba(249, 250, 251, 0.4)), url('/bg-1.jpg')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>

      <div className="relative w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600 leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 font-medium"
              placeholder="yourname@gmail.com"
              autoComplete="email"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-semibold">Sending...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-bold">Send Reset Link</span>
              </>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6 space-y-2">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-green-600 hover:text-green-500 font-semibold transition-colors duration-200"
          >
            ← Back to Login
          </button>

          <div>
            <button
              type="button"
              onClick={onExit}
              className="text-gray-500 hover:text-green-600 transition-colors text-sm font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword