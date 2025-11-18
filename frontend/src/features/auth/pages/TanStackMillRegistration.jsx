import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useFormValidation } from '../hooks/useFormValidation'

/**
 * TanStackMillRegistration Component
 * 
 * Multi-step registration form using TanStack Form for mill owners 
 * with comprehensive inline validation.
 * 
 * Features:
 * - Real-time validation with TanStack Form
 * - Inline error messages with visual feedback
 * - Multi-step form progression with validation gates
 * - Advanced field validation (email, NIC, phone, etc.)
 * - Conditional field requirements
 */
const TanStackMillRegistration = ({ userData, onRegistrationComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Get validation functions
  const { validators } = useFormValidation()

  // Validation functions
  const validateRequired = (value) => {
    if (!value || value.toString().trim() === '') {
      return 'This field is required'
    }
    return undefined
  }

  const validateEmail = (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return undefined
  }

  const validateNIC = (value) => {
    if (!value) return 'NIC number is required'
    // Sri Lankan NIC validation (old format: 9 digits + V, new format: 12 digits)
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/
    if (!nicRegex.test(value)) {
      return 'Please enter a valid NIC number'
    }
    return undefined
  }

  const validateBusinessReg = (value) => {
    if (!value) return 'Business registration number is required'
    // Basic business registration validation
    if (value.length < 5) {
      return 'Business registration number should be at least 5 characters'
    }
    return undefined
  }

  const validateCapacity = (value) => {
    if (!value) return 'This field is required'
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) {
      return 'Please enter a valid positive number'
    }
    return undefined
  }

  // License types and other options
  const licenseTypes = [
    { value: 'rice_mill', label: 'Rice Mill License' },
    { value: 'paddy_processing', label: 'Paddy Processing License' },
    { value: 'wholesale_distribution', label: 'Wholesale Distribution License' },
    { value: 'storage_facility', label: 'Storage Facility License' }
  ]

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ]

  const millTypes = [
    { value: 'traditional', label: 'Traditional Mill' },
    { value: 'modern', label: 'Modern Mill' },
    { value: 'semi_automatic', label: 'Semi-Automatic Mill' },
    { value: 'fully_automatic', label: 'Fully Automatic Mill' }
  ]

  // Initialize TanStack Form
  const form = useForm({
    defaultValues: {
      // Personal Information
      ownerName: userData?.ownerName || '',
      nicNumber: userData?.nicNumber || '',
      contactNumber: userData?.contactNumber || '',
      email: userData?.email || '',
      address: userData?.address || '',
      
      // Business Information
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
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        // Here you would submit the registration data
        console.log('Submitting registration:', value)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        onRegistrationComplete(value)
      } catch (error) {
        console.error('Registration failed:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  // Step validation function
  const validateCurrentStep = () => {
    const fieldsByStep = {
      1: ['ownerName', 'nicNumber', 'contactNumber', 'email', 'address'],
      2: ['millName', 'businessRegistrationNumber', 'licenseType', 'businessAddress', 'district'],
      3: ['millType', 'processingCapacity', 'storageCapacity'],
    }

    const fieldsToValidate = fieldsByStep[currentStep] || []
    let isValid = true

    fieldsToValidate.forEach(fieldName => {
      const field = form.getFieldInfo(fieldName)
      if (field.errorMap.onChange || field.errorMap.onBlur) {
        isValid = false
      }
    })

    return isValid
  }

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Custom field component with error styling
  const FormField = ({ field, label, type = "text", placeholder = "", required = true, options = null, children }) => (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700 tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <>
          {type === "select" && options ? (
            <select
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 font-medium ${
                field.state.meta.errors.length > 0
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                  : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
              }`}
            >
              <option value="">Select {label}</option>
              {options.map(option => (
                <option key={option.value || option} value={option.value || option}>
                  {option.label || option}
                </option>
              ))}
            </select>
          ) : type === "textarea" ? (
            <textarea
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={placeholder}
              rows={3}
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 font-medium resize-none ${
                field.state.meta.errors.length > 0
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                  : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
              }`}
            />
          ) : (
            <input
              type={type}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 font-medium ${
                field.state.meta.errors.length > 0
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                  : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
              }`}
            />
          )}
        </>
      )}
      {field.state.meta.errors.length > 0 && (
        <div className="flex items-center space-x-1 text-red-600 text-xs mt-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{field.state.meta.errors[0]}</span>
        </div>
      )}
    </div>
  )

  // Step 1: Personal Information
  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
      
      <form.Field
        name="ownerName"
        validators={{
          onChange: validateRequired,
          onBlur: validateRequired,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Full Name"
            placeholder="Enter your full name"
          />
        )}
      />

      <form.Field
        name="nicNumber"
        validators={{
          onChange: validateNIC,
          onBlur: validateNIC,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="NIC Number"
            placeholder="e.g., 921234567V or 199212345678"
          />
        )}
      />

      <form.Field
        name="contactNumber"
        validators={{
          onChange: validators.phoneSriLankaInternational(),
          onBlur: validators.phoneSriLankaInternational(),
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Contact Number"
            placeholder="e.g., +94771234567"
          />
        )}
      />

      <form.Field
        name="email"
        validators={{
          onChange: validateEmail,
          onBlur: validateEmail,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
          />
        )}
      />

      <form.Field
        name="address"
        validators={{
          onChange: validateRequired,
          onBlur: validateRequired,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Address"
            type="textarea"
            placeholder="Enter your full address"
          />
        )}
      />
    </div>
  )

  // Step 2: Business Information
  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Business Information</h3>
      
      <form.Field
        name="millName"
        validators={{
          onChange: validateRequired,
          onBlur: validateRequired,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Mill Name"
            placeholder="Enter your mill name"
          />
        )}
      />

      <form.Field
        name="businessRegistrationNumber"
        validators={{
          onChange: validateBusinessReg,
          onBlur: validateBusinessReg,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Business Registration Number"
            placeholder="Enter your BR number"
          />
        )}
      />

      <form.Field
        name="licenseType"
        validators={{
          onChange: validateRequired,
          onBlur: validateRequired,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="License Type"
            type="select"
            options={licenseTypes}
          />
        )}
      />

      <form.Field
        name="businessAddress"
        validators={{
          onChange: validateRequired,
          onBlur: validateRequired,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Business Address"
            type="textarea"
            placeholder="Enter your business address"
          />
        )}
      />

      <form.Field
        name="district"
        validators={{
          onChange: validateRequired,
          onBlur: validateRequired,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="District"
            type="select"
            options={districts}
          />
        )}
      />
    </div>
  )

  // Step 3: Technical Information
  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Information</h3>
      
      <form.Field
        name="millType"
        validators={{
          onChange: validateRequired,
          onBlur: validateRequired,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Mill Type"
            type="select"
            options={millTypes}
          />
        )}
      />

      <form.Field
        name="processingCapacity"
        validators={{
          onChange: validateCapacity,
          onBlur: validateCapacity,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Processing Capacity (kg/hour)"
            type="number"
            placeholder="e.g., 1000"
          />
        )}
      />

      <form.Field
        name="storageCapacity"
        validators={{
          onChange: validateCapacity,
          onBlur: validateCapacity,
        }}
        children={(field) => (
          <FormField
            field={field}
            label="Storage Capacity (tons)"
            type="number"
            placeholder="e.g., 50"
          />
        )}
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-40 min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-6 font-inter">
      <div className="relative w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Mill Registration</h1>
                <p className="text-sm text-gray-500 font-medium">Step {currentStep} of 3</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onBack}
              className="text-gray-500 hover:text-green-600 transition-colors flex items-center space-x-1.5 text-sm font-medium bg-gray-50 hover:bg-green-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-green-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold tracking-wide">Back</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (currentStep === 3) {
              form.handleSubmit()
            }
          }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!validateCurrentStep()}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Next
              </button>
            ) : (
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmittingForm]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting || isSubmittingForm}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
                  >
                    {(isSubmitting || isSubmittingForm) ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Registration</span>
                    )}
                  </button>
                )}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default TanStackMillRegistration
