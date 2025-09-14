import React from 'react';

const ProfileCompletenessBar = ({ 
  completeness = 0, 
  fieldStatus = null, 
  missingFields = [], 
  showDetails = true,
  size = 'large',
  showActions = false,
  onCompleteProfile = null
}) => {
  // Color scheme based on completion percentage
  const getColorScheme = (percentage) => {
    if (percentage === 100) return 'bg-green-500 border-green-200';
    if (percentage >= 80) return 'bg-yellow-500 border-yellow-200';
    if (percentage >= 50) return 'bg-orange-500 border-orange-200';
    return 'bg-red-500 border-red-200';
  };

  // Background color for the bar
  const getBackgroundColor = (percentage) => {
    if (percentage === 100) return 'bg-green-50';
    if (percentage >= 80) return 'bg-yellow-50';
    if (percentage >= 50) return 'bg-orange-50';
    return 'bg-red-50';
  };

  // Size variants
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className="w-full">
      {/* Header with percentage */}
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-semibold text-gray-700 ${textSizeClasses[size]}`}>
          Profile Completeness
        </h3>
        <span className={`font-bold ${textSizeClasses[size]} ${completeness === 100 ? 'text-green-600' : 'text-gray-600'}`}>
          {completeness}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className={`w-full ${getBackgroundColor(completeness)} rounded-full border ${sizeClasses[size]} mb-3`}>
        <div
          className={`${getColorScheme(completeness)} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${completeness}%` }}
        ></div>
      </div>

      {/* Detailed Field Status */}
      {showDetails && fieldStatus && (
        <div className="space-y-3">
          {/* Personal Information (50%) */}
          <div>
            <h4 className={`font-medium text-gray-600 mb-2 ${textSizeClasses[size]} flex items-center gap-2`}>
              Personal Information
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {fieldStatus.personalCompleteness || 0}% (50% weight)
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.firstName ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.firstName ? 'text-green-700' : 'text-gray-500'}`}>
                  First Name
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.lastName ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.lastName ? 'text-green-700' : 'text-gray-500'}`}>
                  Last Name
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.nic ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.nic ? 'text-green-700' : 'text-gray-500'}`}>
                  NIC
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.email ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.email ? 'text-green-700' : 'text-gray-500'}`}>
                  Email
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.phone ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.phone ? 'text-green-700' : 'text-gray-500'}`}>
                  Phone
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.address ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.address ? 'text-green-700' : 'text-gray-500'}`}>
                  Address
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.city ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.city ? 'text-green-700' : 'text-gray-500'}`}>
                  City
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.district ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.district ? 'text-green-700' : 'text-gray-500'}`}>
                  District
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.personalInfo?.postalCode ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.personalInfo?.postalCode ? 'text-green-700' : 'text-gray-500'}`}>
                  Postal Code
                </span>
              </div>
            </div>
          </div>

          {/* Business Information (50%) */}
          <div>
            <h4 className={`font-medium text-gray-600 mb-2 ${textSizeClasses[size]} flex items-center gap-2`}>
              Business Information
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {fieldStatus.businessCompleteness || 0}% (50% weight)
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.businessInfo?.businessName ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.businessInfo?.businessName ? 'text-green-700' : 'text-gray-500'}`}>
                  Business Name
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.businessInfo?.businessType ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.businessInfo?.businessType ? 'text-green-700' : 'text-gray-500'}`}>
                  Business Type
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.businessInfo?.millCapacity ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.businessInfo?.millCapacity ? 'text-green-700' : 'text-gray-500'}`}>
                  Mill Capacity
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.businessInfo?.millLocation ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.businessInfo?.millLocation ? 'text-green-700' : 'text-gray-500'}`}>
                  Mill Location
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${fieldStatus.businessInfo?.registrationDate ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={`${textSizeClasses[size]} ${fieldStatus.businessInfo?.registrationDate ? 'text-green-700' : 'text-gray-500'}`}>
                  Registration Date
                </span>
              </div>
            </div>
          </div>


          {/* Progress Summary */}
          <div className={`mt-3 p-3 rounded-lg ${getBackgroundColor(completeness)} border`}>
            <div className="flex justify-between items-center">
              <span className={`font-medium ${textSizeClasses[size]}`}>
                Progress: {fieldStatus.completedCount}/{fieldStatus.totalCount} fields completed
              </span>
              {completeness === 100 ? (
                <span className="text-green-600 font-bold">✅ Complete!</span>
              ) : (
                <span className="text-gray-600">{missingFields.length} remaining</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Missing Fields (Simple List) */}
      {!showDetails && missingFields.length > 0 && (
        <div className="mt-2">
          <p className={`text-gray-600 ${textSizeClasses[size]} mb-1`}>Missing fields:</p>
          <div className="flex flex-wrap gap-1">
            {missingFields.map((field, index) => (
              <span 
                key={index}
                className={`inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs`}
              >
                {field}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Complete Profile Button */}
      {showActions && completeness < 100 && onCompleteProfile && (
        <div className="mt-4">
          <button
            onClick={onCompleteProfile}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Complete Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCompletenessBar;