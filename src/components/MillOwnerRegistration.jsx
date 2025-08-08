import { useState } from 'react';

/**
 * MillOwnerRegistration Component
 * 
 * Comprehensive registration form for mill owners to apply for licenses
 * through the Paddy Marketing Board.
 * 
 * Features:
 * - Multi-step registration process
 * - Document upload functionality
 * - Form validation and error handling
 * - License type selection
 * - Business information collection
 * - Contact and location details
 */
const MillOwnerRegistration = ({ userData, onRegistrationComplete, onBack }) => {
  // Form state management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information (pre-filled from userData)
    ownerName: userData?.ownerName || '',
    nicNumber: userData?.nicNumber || '',
    contactNumber: userData?.contactNumber || '',
    email: userData?.email || '',
    address: userData?.address || '',
    
    // Business Information (pre-filled from userData)
    millName: userData?.millName || '',
    businessRegistrationNumber: userData?.businessRegistrationNumber || '',
    licenseType: '',
    millCapacity: '',
    establishedDate: '',
    businessAddress: userData?.businessAddress || '',
    district: userData?.district || '',
    province: userData?.province || '',
    
    // Technical Information
    millType: '',
    processingCapacity: '',
    storageCapacity: '',
    qualityStandards: [],
    
    // Documents
    documents: {
      nicCopy: null,
      businessRegistration: null,
      landOwnership: null,
      buildingPlans: null,
      environmentalClearance: null
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // License types available
  const licenseTypes = [
    { value: 'rice_mill', label: 'Rice Mill License' },
    { value: 'paddy_processing', label: 'Paddy Processing License' },
    { value: 'wholesale_distribution', label: 'Wholesale Distribution License' },
    { value: 'storage_facility', label: 'Storage Facility License' }
  ];

  // Sri Lankan districts
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  // Mill types
  const millTypes = [
    { value: 'traditional', label: 'Traditional Mill' },
    { value: 'modern', label: 'Modern Mill' },
    { value: 'semi_automatic', label: 'Semi-Automatic Mill' },
    { value: 'fully_automatic', label: 'Fully Automatic Mill' }
  ];

  // Quality standards
  const qualityStandards = [
    'ISO 9001', 'HACCP', 'SLS Standards', 'Organic Certification', 'Fair Trade'
  ];

  /**
   * Handles input field changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'qualityStandards') {
        setFormData(prev => ({
          ...prev,
          qualityStandards: checked 
            ? [...prev.qualityStandards, value]
            : prev.qualityStandards.filter(std => std !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handles file upload for documents
   * @param {Event} e - File input change event
   * @param {string} documentType - Type of document being uploaded
   */
  const handleFileUpload = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [documentType]: file
        }
      }));
    }
  };

  /**
   * Validates the current step
   * @param {number} step - Step number to validate
   * @returns {boolean} - Whether the step is valid
   */
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.ownerName) newErrors.ownerName = 'Owner name is required';
        if (!formData.nicNumber) newErrors.nicNumber = 'NIC number is required';
        if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        if (!formData.address) newErrors.address = 'Address is required';
        break;

      case 2: // Business Information
        if (!formData.millName) newErrors.millName = 'Mill name is required';
        if (!formData.businessRegistrationNumber) {
          newErrors.businessRegistrationNumber = 'Business registration number is required';
        }
        if (!formData.licenseType) newErrors.licenseType = 'License type is required';
        if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
        if (!formData.district) newErrors.district = 'District is required';
        break;

      case 3: // Technical Information
        if (!formData.millType) newErrors.millType = 'Mill type is required';
        if (!formData.processingCapacity) {
          newErrors.processingCapacity = 'Processing capacity is required';
        }
        if (!formData.storageCapacity) {
          newErrors.storageCapacity = 'Storage capacity is required';
        }
        break;

      case 4: // Documents
        if (!formData.documents.nicCopy) newErrors.nicCopy = 'NIC copy is required';
        if (!formData.documents.businessRegistration) {
          newErrors.businessRegistration = 'Business registration is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async () => {
    if (validateStep(4)) {
      setIsSubmitting(true);
      
      try {
        // Here you would typically send the data to your backend
        // For now, we'll simulate a successful submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Save registration status
        localStorage.setItem('pmb_registration_status', 'completed');
        localStorage.setItem('pmb_registration_data', JSON.stringify(formData));
        
        alert('PMB Registration submitted successfully! You will receive a confirmation email shortly.');
        
        // Call the completion callback
        if (onRegistrationComplete) {
          onRegistrationComplete(formData);
        }
        
      } catch (error) {
        console.error('Registration error:', error);
        alert('Error submitting registration. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  /**
   * Renders step indicator
   * @returns {JSX.Element} Step indicator component
   */
  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Personal Info", icon: "👤" },
      { number: 2, title: "Business Details", icon: "🏢" },
      { number: 3, title: "Technical Info", icon: "⚙️" },
      { number: 4, title: "Documents", icon: "📄" }
    ];

    return (
      <div className="flex justify-between items-center mb-8 px-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step.number
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg'
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              {currentStep > step.number ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-lg">{step.icon}</span>
              )}
              
              {/* Animated ring for current step */}
              {currentStep === step.number && (
                <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping"></div>
              )}
            </div>

            {/* Step Title */}
            <div className="ml-3 hidden sm:block">
              <div className={`font-semibold ${currentStep >= step.number ? 'text-green-600' : 'text-gray-400'}`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500">Step {step.number}</div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  /**
   * Renders personal information step
   * @returns {JSX.Element} Personal information form
   */
  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h3>
        <p className="text-gray-600">Please provide your personal details for the registration</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Owner Name *
          </label>
          <div className="relative group">
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-300"
              placeholder="Enter your full name"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-green-500">👤</span>
            </div>
          </div>
          {errors.ownerName && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.ownerName}
            </div>
          )}
        </div>

        {/* NIC Number */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            NIC Number *
          </label>
          <div className="relative group">
            <input
              type="text"
              name="nicNumber"
              value={formData.nicNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-300"
              placeholder="Enter your NIC number"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-green-500">🆔</span>
            </div>
          </div>
          {errors.nicNumber && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.nicNumber}
            </div>
          )}
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Contact Number *
          </label>
          <div className="relative group">
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-300"
              placeholder="Enter your contact number"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-green-500">📞</span>
            </div>
          </div>
          {errors.contactNumber && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.contactNumber}
            </div>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Email Address *
          </label>
          <div className="relative group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-300"
              placeholder="Enter your email address"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-green-500">✉️</span>
            </div>
          </div>
          {errors.email && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.email}
            </div>
          )}
        </div>
      </div>

      {/* Address - Full Width */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Address *
        </label>
        <div className="relative group">
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-300 resize-none"
            placeholder="Enter your complete address"
          />
          <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-green-500">🏠</span>
          </div>
        </div>
        {errors.address && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.address}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl max-w-5xl mx-auto shadow-2xl border border-emerald-200/50">
          {/* Enhanced Header with Gradient */}
          <div className="relative bg-gradient-to-r from-emerald-600/90 via-green-600/85 to-teal-600/90 backdrop-blur-sm p-8 text-white overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16 animate-pulse delay-300"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full -translate-y-12 animate-pulse delay-500"></div>
            </div>
            
            {/* Back Button */}
            <button
              onClick={onBack}
              className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group flex items-center gap-2"
              aria-label="Go back to dashboard"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
            
            {/* Header Content */}
            <div className="relative z-10 flex items-center gap-6 mt-4">
              {/* Professional Icon */}
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-6 0h-6m2 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" />
                </svg>
              </div>
              
              {/* Title and Description */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-green-100 bg-clip-text">
                  PMB License Registration
                </h1>
                <p className="text-green-100 text-lg">
                  Apply for your Paddy Marketing Board license and join Sri Lanka's premier rice mill network
                </p>
              </div>
              
              {/* Status Badge */}
              <div className="hidden lg:flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Processing Application</span>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-8">
            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Form Content */}
            <div className="bg-gray-50 rounded-2xl p-8 min-h-[500px]">
              {currentStep === 1 && renderPersonalInfoStep()}
              {/* Add other steps here... */}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentStep === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:-translate-y-1'
                }`}
              >
                Previous
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={() => {
                    if (validateStep(currentStep)) {
                      setCurrentStep(prev => prev + 1);
                    }
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Need Help?</h4>
                  <p className="text-blue-700 text-sm">
                    If you have any questions about the registration process, please contact our support team at 
                    <span className="font-semibold"> support@pmb.lk</span> or call 
                    <span className="font-semibold"> +94 11 234 5678</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MillOwnerRegistration;
