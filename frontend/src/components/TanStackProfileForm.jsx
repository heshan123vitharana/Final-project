import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { useFormValidation } from '../hooks/useFormValidation'

/**
 * TanStackProfileForm Component
 * 
 * Enhanced profile form using TanStack Form with comprehensive validations
 * and real-time feedback for mill owner profile management.
 */
const TanStackProfileForm = ({ initialData = {}, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData.profilePicture || null)
  
  const { validators, commonValidations } = useFormValidation()

  // Initialize TanStack Form with validation
  const form = useForm({
    defaultValues: {
      first_name: initialData.first_name || '',
      last_name: initialData.last_name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      nic_number: initialData.nic_number || '',
      business_name: initialData.business_name || '',
      business_type: initialData.business_type || '',
      business_registration_number: initialData.business_registration_number || '',
      mill_capacity: initialData.mill_capacity || '',
      address: initialData.address || '',
      city: initialData.city || '',
      district: initialData.district || '',
      mill_address: initialData.mill_address || '',
      mill_city: initialData.mill_city || '',
      mill_district: initialData.mill_district || '',
      website: initialData.website || '',
      established_year: initialData.established_year || '',
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)
      try {
        const formData = new FormData()
        
        // Add all form fields
        Object.keys(value).forEach(key => {
          if (value[key]) {
            formData.append(key, value[key])
          }
        })
        
        // Add profile image if selected
        if (profileImage) {
          formData.append('profile_picture', profileImage)
        }
        
        await onSave(formData)
      } catch (error) {
        console.error('Profile save failed:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  // Handle profile image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Custom field component with enhanced styling
  const FormField = ({ field, label, type = "text", placeholder = "", required = true, options = null, description = null }) => (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-semibold text-gray-700 tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {description && (
          <div className="group relative ml-2">
            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {description}
            </div>
          </div>
        )}
      </label>
      
      {type === "select" && options ? (
        <select
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200 font-medium ${
            field.state.meta.errors.length > 0
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : 'border-gray-200 focus:ring-green-500 focus:border-transparent hover:border-gray-300'
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
          className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 font-medium resize-none ${
            field.state.meta.errors.length > 0
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : 'border-gray-200 focus:ring-green-500 focus:border-transparent hover:border-gray-300'
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
          className={`w-full px-3 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 font-medium ${
            field.state.meta.errors.length > 0
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : 'border-gray-200 focus:ring-green-500 focus:border-transparent hover:border-gray-300'
          }`}
        />
      )}
      
      {field.state.meta.errors.length > 0 && (
        <div className="flex items-start space-x-1 text-red-600 text-xs mt-1">
          <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium leading-tight">{field.state.meta.errors[0]}</span>
        </div>
      )}
    </div>
  )

  // Business types and districts for Sri Lanka
  const businessTypes = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'private_limited', label: 'Private Limited Company' },
    { value: 'public_limited', label: 'Public Limited Company' },
    { value: 'cooperative', label: 'Cooperative Society' }
  ]

  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mill Owner Profile</h2>
        <p className="text-gray-600">Update your profile information and business details</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-8"
      >
        {/* Profile Picture Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
          <div className="flex items-center space-x-6">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="profile-picture"
                className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                Choose Picture
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="first_name"
              validators={{
                onChange: validators.required('First name'),
                onBlur: validators.required('First name'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="First Name"
                  placeholder="Enter your first name"
                />
              )}
            />

            <form.Field
              name="last_name"
              validators={{
                onChange: validators.required('Last name'),
                onBlur: validators.required('Last name'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Last Name"
                  placeholder="Enter your last name"
                />
              )}
            />

            <form.Field
              name="email"
              validators={{
                onChange: commonValidations.emailRequired(),
                onBlur: commonValidations.emailRequired(),
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
              name="phone"
              validators={{
                onChange: commonValidations.phoneRequired(),
                onBlur: commonValidations.phoneRequired(),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Phone Number"
                  placeholder="0771234567"
                />
              )}
            />

            <form.Field
              name="nic_number"
              validators={{
                onChange: commonValidations.nicRequired(),
                onBlur: commonValidations.nicRequired(),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="NIC Number"
                  placeholder="921234567V or 199212345678"
                />
              )}
            />
          </div>

          <div className="mt-4">
            <form.Field
              name="address"
              validators={{
                onChange: validators.required('Address'),
                onBlur: validators.required('Address'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Address"
                  type="textarea"
                  placeholder="Enter your complete address"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <form.Field
              name="city"
              validators={{
                onChange: validators.required('City'),
                onBlur: validators.required('City'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="City"
                  placeholder="Enter your city"
                />
              )}
            />

            <form.Field
              name="district"
              validators={{
                onChange: validators.required('District'),
                onBlur: validators.required('District'),
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
        </div>

        {/* Business Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="business_name"
              validators={{
                onChange: validators.required('Business name'),
                onBlur: validators.required('Business name'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Business Name"
                  placeholder="Enter your business name"
                />
              )}
            />

            <form.Field
              name="business_type"
              validators={{
                onChange: validators.required('Business type'),
                onBlur: validators.required('Business type'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Business Type"
                  type="select"
                  options={businessTypes}
                />
              )}
            />

            <form.Field
              name="business_registration_number"
              validators={{
                onChange: validators.businessRegistration(),
                onBlur: validators.businessRegistration(),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Business Registration Number"
                  placeholder="Enter BR number"
                />
              )}
            />

            <form.Field
              name="mill_capacity"
              validators={{
                onChange: commonValidations.positiveNumber('Mill capacity'),
                onBlur: commonValidations.positiveNumber('Mill capacity'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Mill Capacity"
                  type="number"
                  placeholder="Capacity in tons"
                  description="Maximum processing capacity in tons per day"
                />
              )}
            />

            <form.Field
              name="established_year"
              validators={{
                onChange: validators.number(1900, new Date().getFullYear(), 'Established year'),
                onBlur: validators.number(1900, new Date().getFullYear(), 'Established year'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Established Year"
                  type="number"
                  placeholder="e.g., 2010"
                />
              )}
            />

            <form.Field
              name="website"
              validators={{
                onChange: validators.url(),
                onBlur: validators.url(),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Website"
                  placeholder="https://your-website.com"
                  required={false}
                />
              )}
            />
          </div>
        </div>

        {/* Mill Location */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mill Location</h3>
          <div className="space-y-4">
            <form.Field
              name="mill_address"
              validators={{
                onChange: validators.required('Mill address'),
                onBlur: validators.required('Mill address'),
              }}
              children={(field) => (
                <FormField
                  field={field}
                  label="Mill Address"
                  type="textarea"
                  placeholder="Enter complete mill address"
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field
                name="mill_city"
                validators={{
                  onChange: validators.required('Mill city'),
                  onBlur: validators.required('Mill city'),
                }}
                children={(field) => (
                  <FormField
                    field={field}
                    label="Mill City"
                    placeholder="Enter mill city"
                  />
                )}
              />

              <form.Field
                name="mill_district"
                validators={{
                  onChange: validators.required('Mill district'),
                  onBlur: validators.required('Mill district'),
                }}
                children={(field) => (
                  <FormField
                    field={field}
                    label="Mill District"
                    type="select"
                    options={districts}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmittingForm]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting || isSubmittingForm}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
              >
                {(isSubmitting || isSubmittingForm) ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            )}
          />
        </div>
      </form>
    </div>
  )
}

export default TanStackProfileForm
