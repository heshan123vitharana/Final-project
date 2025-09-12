import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PowerIcon, CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Logout page component for Mill Dashboard
const MillLogout = ({ onBackToHome }) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [logoutStep, setLogoutStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoutSteps = [
    'Logging out from server...',
    'Clearing local session data...',
    'Redirecting to home page...'
  ];

  const handleConfirmLogout = async () => {
    setShowConfirmation(false);
    setIsLoggingOut(true);
    
    const performLogout = async () => {
      try {
        // Step 1: Call backend logout API
        setLogoutStep(0);
        const userData = JSON.parse(sessionStorage.getItem('millOwnerData') || '{}');
        const token = userData.token;
        
        if (token) {
          await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Step 2: Clear storage
        setLogoutStep(1);
        localStorage.clear();
        sessionStorage.clear();
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Step 3: Redirect
        setLogoutStep(2);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsComplete(true);
        
        // Call the onBackToHome function to return to main page
        setTimeout(() => {
          if (onBackToHome) {
            onBackToHome();
          }
        }, 1000);
      } catch (error) {
        console.error('Logout error:', error);
        // Even if API call fails, clear storage and redirect
        localStorage.clear();
        sessionStorage.clear();
        setIsComplete(true);
        setTimeout(() => {
          if (onBackToHome) {
            onBackToHome();
          }
        }, 1000);
      }
    };

    performLogout();
  };

  const handleCancelLogout = () => {
    navigate('../home');  // Navigate back to mill home page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ExclamationTriangleIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm Logout
              </h2>
              <p className="text-gray-600">
                Are you sure you want to log out of your mill dashboard?
              </p>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleCancelLogout}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                <XMarkIcon className="h-5 w-5 inline-block mr-2" />
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
              >
                <PowerIcon className="h-5 w-5 inline-block mr-2" />
                Logout
              </button>
            </div>
          </>
        )}

        {/* Logout Progress */}
        {isLoggingOut && !isComplete && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PowerIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Logging Out
              </h2>
              <p className="text-gray-600">
                Please wait while we log you out securely
              </p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4 mb-8">
              {logoutSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index < logoutStep 
                      ? 'bg-emerald-500 shadow-md' 
                      : index === logoutStep 
                        ? 'bg-emerald-400 shadow-md' 
                        : 'bg-gray-200'
                  }`}>
                    {index < logoutStep ? (
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    ) : index === logoutStep ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <span className={`text-sm transition-colors duration-300 ${
                    index <= logoutStep ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Loading Animation */}
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </>
        )}

        {/* Success Message */}
        {isComplete && (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircleIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Logout Complete
              </h2>
              <p className="text-gray-600">
                You have been successfully logged out
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Redirecting to home page...
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MillLogout;