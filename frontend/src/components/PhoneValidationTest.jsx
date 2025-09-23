import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { useFormValidation } from '../hooks/useFormValidation'

/**
 * PhoneValidationTest Component
 * 
 * Test component to validate Sri Lankan phone number formats
 */
const PhoneValidationTest = () => {
  const [testResults, setTestResults] = useState([])
  const [internationalTestResults, setInternationalTestResults] = useState([])
  const { validators } = useFormValidation()

  // Test cases for Sri Lankan phone numbers
  const testCases = [
    // Valid cases
    { number: '0771234567', expected: 'valid', description: 'Valid local format' },
    { number: '0711234567', expected: 'valid', description: 'Valid Dialog number' },
    { number: '0721234567', expected: 'valid', description: 'Valid Mobitel number' },
    { number: '0741234567', expected: 'valid', description: 'Valid Airtel number' },
    { number: '0751234567', expected: 'valid', description: 'Valid Hutch number' },
    { number: '+94771234567', expected: 'valid', description: 'Valid international format' },
    { number: '+94711234567', expected: 'valid', description: 'Valid international Dialog' },
    { number: '077 123 4567', expected: 'valid', description: 'Valid with spaces' },
    { number: '077-123-4567', expected: 'valid', description: 'Valid with dashes' },
    { number: '(077) 123-4567', expected: 'valid', description: 'Valid with brackets' },
    
    // Invalid cases
    { number: '0791234567', expected: 'invalid', description: 'Invalid prefix 079' },
    { number: '0731234567', expected: 'invalid', description: 'Invalid prefix 073' },
    { number: '077123456', expected: 'invalid', description: 'Too short (9 digits)' },
    { number: '07712345678', expected: 'invalid', description: 'Too long (11 digits)' },
    { number: '+947712345678', expected: 'invalid', description: 'Too long international' },
    { number: '+9477123456', expected: 'invalid', description: 'Too short international' },
    { number: '1771234567', expected: 'invalid', description: 'Wrong starting digit' },
    { number: '+95771234567', expected: 'invalid', description: 'Wrong country code' },
    { number: '077abc4567', expected: 'invalid', description: 'Contains letters' },
    { number: '', expected: 'invalid', description: 'Empty number' },
  ]

  // Test cases for international-only validator
  const internationalTestCases = [
    // Valid cases for international-only
    { number: '+94771234567', expected: 'valid', description: 'Valid international format' },
    { number: '+94711234567', expected: 'valid', description: 'Valid international Dialog' },
    { number: '+94721234567', expected: 'valid', description: 'Valid international Mobitel' },
    { number: '+94751234567', expected: 'valid', description: 'Valid international Hutch' },
    { number: '+94781234567', expected: 'valid', description: 'Valid international Airtel' },
    { number: '+94 77 123 4567', expected: 'valid', description: 'Valid with spaces' },
    
    // Invalid cases for international-only
    { number: '0771234567', expected: 'invalid', description: 'Local format (not allowed)' },
    { number: '771234567', expected: 'invalid', description: 'Without country code' },
    { number: '+94791234567', expected: 'invalid', description: 'Invalid prefix 079' },
    { number: '+9477123456', expected: 'invalid', description: 'Too short (11 chars)' },
    { number: '+947712345678', expected: 'invalid', description: 'Too long (13 chars)' },
    { number: '+95771234567', expected: 'invalid', description: 'Wrong country code' },
    { number: '+94abc1234567', expected: 'invalid', description: 'Contains letters' },
    { number: '', expected: 'invalid', description: 'Empty number' },
  ]

  // Run all test cases
  const runTests = () => {
    const results = testCases.map(testCase => {
      const validator = validators.phoneSriLanka()
      const error = validator(testCase.number)
      const isValid = error === undefined
      const passed = (isValid && testCase.expected === 'valid') || (!isValid && testCase.expected === 'invalid')
      
      return {
        ...testCase,
        isValid,
        error,
        passed,
      }
    })
    setTestResults(results)
  }

  // Run international-only test cases
  const runInternationalTests = () => {
    const results = internationalTestCases.map(testCase => {
      const validator = validators.phoneSriLankaInternational()
      const error = validator(testCase.number)
      const isValid = error === undefined
      const passed = (isValid && testCase.expected === 'valid') || (!isValid && testCase.expected === 'invalid')
      
      return {
        ...testCase,
        isValid,
        error,
        passed,
      }
    })
    setInternationalTestResults(results)
  }

  // Initialize form for testing
  // eslint-disable-next-line no-unused-vars
  const form = useForm({
    defaultValues: {
      phone: '',
      phoneInternational: '',
    },
  })

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sri Lankan Phone Number Validation Test</h2>
        <p className="text-gray-600">Test and validate Sri Lankan mobile number formats</p>
      </div>

      {/* Interactive Test */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Test</h3>
        
        <form.Field
          name="phone"
          validators={{
            onChange: validators.phoneSriLanka(),
            onBlur: validators.phoneSriLanka(),
          }}
          children={(field) => (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Test Phone Number
              </label>
              <input
                type="text"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a Sri Lankan phone number"
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : field.state.value && field.state.meta.errors.length === 0
                    ? 'border-green-300 focus:ring-green-500 bg-green-50'
                    : 'border-gray-200 focus:ring-blue-500'
                }`}
              />
              
              {field.state.meta.errors.length > 0 ? (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{field.state.meta.errors[0]}</span>
                </div>
              ) : field.state.value ? (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Valid Sri Lankan mobile number!</span>
                </div>
              ) : null}
            </div>
          )}
        />
      </div>

      {/* International-Only Interactive Test */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-blue-900">International Format Only Test</h3>
          <p className="text-sm text-blue-700 mt-1">Test the validator used in registration forms (only accepts +94XXXXXXXXX)</p>
        </div>
        
        <form.Field
          name="phoneInternational"
          validators={{
            onChange: validators.phoneSriLankaInternational(),
            onBlur: validators.phoneSriLankaInternational(),
          }}
          children={(field) => (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-800">
                Test International Phone Number
              </label>
              <input
                type="text"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter phone number (+94XXXXXXXXX only)"
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  field.state.meta.errors.length > 0
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : field.state.value && field.state.meta.errors.length === 0
                    ? 'border-green-300 focus:ring-green-500 bg-green-50'
                    : 'border-blue-200 focus:ring-blue-500'
                }`}
              />
              
              {field.state.meta.errors.length > 0 ? (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{field.state.meta.errors[0]}</span>
                </div>
              ) : field.state.value ? (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Valid international format!</span>
                </div>
              ) : null}
            </div>
          )}
        />
      </div>

      {/* Validation Rules */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Sri Lankan Mobile Number Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Valid Formats:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Local: 0XXXXXXXXX (10 digits)</li>
              <li>• International: +94XXXXXXXXX (12 chars)</li>
              <li>• Without prefix: XXXXXXXXX (9 digits)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Valid Prefixes:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• 070, 071, 072 (Dialog)</li>
              <li>• 074, 075 (Mobitel)</li>
              <li>• 076, 077, 078 (Hutch/Airtel)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Automated Tests */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Automated Test Cases</h3>
          <button
            onClick={runTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Run All Tests
          </button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-4">
              <span>Test Results: {testResults.filter(r => r.passed).length}/{testResults.length} passed</span>
              <span className={testResults.every(r => r.passed) ? 'text-green-600' : 'text-red-600'}>
                {testResults.every(r => r.passed) ? 'All Tests Passed ✅' : 'Some Tests Failed ❌'}
              </span>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.passed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {result.number || '(empty)'}
                      </code>
                      <span className="text-sm text-gray-600">- {result.description}</span>
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.expected === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Expected: {result.expected}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* International-Only Validator Tests */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">International Format Only Tests</h3>
            <p className="text-sm text-blue-700 mt-1">Tests for registration forms that only accept +94XXXXXXXXX format</p>
          </div>
          <button
            onClick={runInternationalTests}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Run International Tests
          </button>
        </div>

        {internationalTestResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-4">
              <span>Test Results: {internationalTestResults.filter(r => r.passed).length}/{internationalTestResults.length} passed</span>
              <span className={internationalTestResults.every(r => r.passed) ? 'text-green-600' : 'text-red-600'}>
                {internationalTestResults.every(r => r.passed) ? 'All Tests Passed ✅' : 'Some Tests Failed ❌'}
              </span>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {internationalTestResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.passed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {result.number || '(empty)'}
                      </code>
                      <span className="text-sm text-gray-600">- {result.description}</span>
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-600 mt-1">{result.error}</div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.expected === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Expected: {result.expected}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhoneValidationTest