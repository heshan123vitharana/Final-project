import React from 'react'
import { useForm } from '@tanstack/react-form'
import { useFormValidation } from '../hooks/useFormValidation'

/**
 * Simple demo component showing international-only phone validation
 * for registration forms
 */
const InternationalPhoneDemo = () => {
  const { validators } = useFormValidation()

  const form = useForm({
    defaultValues: {
      phone: '',
    },
    onSubmit: async (values) => {
      console.log('Form submitted with:', values)
      alert(`✅ Registration successful with phone: ${values.phone}`)
    },
  })

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Form</h2>
        <p className="text-sm text-gray-600">Phone number must be in international format (+94XXXXXXXXX)</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-4"
      >
        <form.Field
          name="phone"
          validators={{
            onChange: validators.phoneSriLankaInternational(),
            onBlur: validators.phoneSriLankaInternational(),
          }}
          children={(field) => (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Phone Number *
              </label>
              <input
                type="text"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="+94771234567"
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : field.state.value && field.state.meta.errors.length === 0
                    ? 'border-green-300 focus:ring-green-500 bg-green-50'
                    : 'border-gray-200 focus:ring-blue-500'
                }`}
              />
              
              {field.state.meta.errors.length > 0 && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{field.state.meta.errors[0]}</span>
                </div>
              )}

              {field.state.value && field.state.meta.errors.length === 0 && (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Valid international format!</span>
                </div>
              )}
            </div>
          )}
        />

        <button
          type="submit"
          disabled={!form.state.canSubmit}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            form.state.canSubmit
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Register
        </button>
      </form>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 text-sm mb-1">Required Format:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Must start with +94</li>
          <li>• Followed by exactly 9 digits</li>
          <li>• Total: 12 characters (+94XXXXXXXXX)</li>
          <li>• Valid prefixes: 70, 71, 72, 74, 75, 76, 77, 78</li>
        </ul>
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="font-semibold text-gray-700 text-sm">Test Examples:</h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <code className="text-green-600">+94771234567</code>
            <span className="text-green-600">✅ Valid</span>
          </div>
          <div className="flex justify-between">
            <code className="text-red-600">0771234567</code>
            <span className="text-red-600">❌ Local format not allowed</span>
          </div>
          <div className="flex justify-between">
            <code className="text-red-600">+9477123456</code>
            <span className="text-red-600">❌ Too short</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternationalPhoneDemo