import { useState } from 'react'
import TanStackMillLogin from './TanStackMillLogin'
import TanStackMillRegistration from './TanStackMillRegistration'
import TanStackProfileForm from './TanStackProfileForm'

/**
 * TanStackFormDemo Component
 * 
 * Demonstration component showcasing all TanStack Form implementations
 * with real-time inline validation features.
 */
const TanStackFormDemo = () => {
  const [currentDemo, setCurrentDemo] = useState('login')
  const [userData] = useState({
    ownerName: 'John Doe',
    email: 'john@example.com',
    contactNumber: '0771234567'
  })

  const demos = [
    { id: 'login', name: 'Login Form', description: 'Email & password validation with real-time feedback' },
    { id: 'registration', name: 'Registration Form', description: 'Multi-step form with comprehensive validation' },
    { id: 'profile', name: 'Profile Form', description: 'Advanced profile form with file upload and complex validation' }
  ]

  const handleLoginSuccess = (user) => {
    console.log('Login successful:', user)
    alert('Login successful! Check console for details.')
  }

  const handleRegistrationComplete = (data) => {
    console.log('Registration completed:', data)
    alert('Registration completed! Check console for details.')
  }

  const handleProfileSave = async (formData) => {
    console.log('Profile save:', formData)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Profile saved successfully!')
  }

  const renderCurrentDemo = () => {
    switch (currentDemo) {
      case 'login':
        return (
          <TanStackMillLogin
            onLoginSuccess={handleLoginSuccess}
            onGoToSignUp={() => setCurrentDemo('registration')}
            onExit={() => alert('Back to home')}
          />
        )
      
      case 'registration':
        return (
          <TanStackMillRegistration
            userData={userData}
            onRegistrationComplete={handleRegistrationComplete}
            onBack={() => setCurrentDemo('login')}
          />
        )
      
      case 'profile':
        return (
          <TanStackProfileForm
            initialData={userData}
            onSave={handleProfileSave}
            onCancel={() => alert('Profile editing cancelled')}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TanStack Form Demo</h1>
              <p className="text-sm text-gray-600">Showcasing real-time validation with TanStack Form</p>
            </div>
            
            <div className="flex space-x-2">
              {demos.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => setCurrentDemo(demo.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentDemo === demo.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Description */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800 font-medium">
              {demos.find(demo => demo.id === currentDemo)?.description}
            </p>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="relative">
        {currentDemo === 'profile' ? (
          <div className="py-8">
            {renderCurrentDemo()}
          </div>
        ) : (
          renderCurrentDemo()
        )}
      </div>

      {/* Features Showcase */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">TanStack Form Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-green-800">Real-time Validation</h3>
              </div>
              <p className="text-green-700 text-sm">
                Instant feedback on field changes and blur events with visual error indicators.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-blue-800">Custom Validators</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Reusable validation functions for email, phone, NIC, and business registration numbers.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-purple-800">Multi-step Forms</h3>
              </div>
              <p className="text-purple-700 text-sm">
                Progressive validation with step-by-step form completion and navigation controls.
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-orange-800">File Upload</h3>
              </div>
              <p className="text-orange-700 text-sm">
                Image upload with preview, file size validation, and type checking.
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-red-800">Error Handling</h3>
              </div>
              <p className="text-red-700 text-sm">
                Comprehensive error messages with visual indicators and user-friendly feedback.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold text-indigo-800">Sri Lankan Specific</h3>
              </div>
              <p className="text-indigo-700 text-sm">
                NIC validation, phone number formats, and district selections tailored for Sri Lanka.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TanStackFormDemo