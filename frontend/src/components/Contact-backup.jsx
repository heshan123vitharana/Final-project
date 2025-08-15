import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      setTimeout(() => {
        setSubmitStatus('')
      }, 3000)
    }, 2000)
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 py-24 overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-blue-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Professional Header with Hero-style Design */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl mb-8 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="block bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              Get in Touch
            </span>
            <span className="block text-gray-900 mt-2">
              With PMB Sri Lanka
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Ready to connect with Sri Lanka's leading rice marketing authority? We're here to serve farmers, suppliers, and partners nationwide.
          </p>
          
          <div className="flex items-center justify-center mt-8">
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"></div>
            <div className="w-4 h-4 bg-emerald-500 rounded-full mx-6 shadow-lg"></div>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Enhanced Professional Contact Information Cards */}
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-10">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-3xl shadow-xl mr-8">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Contact Information
                </h3>
              </div>
              
              <div className="space-y-10">
                {/* Executive Office Location */}
                <div className="flex items-start space-x-8 group">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Executive Head Office</h4>
                    <p className="text-gray-600 text-xl leading-relaxed mb-2">No. 04, Torrington Avenue, Colombo 07, Sri Lanka</p>
                    <p className="text-base text-emerald-600 font-semibold">Main Administrative Center</p>
                  </div>
                </div>

                {/* Professional Phone Numbers */}
                <div className="flex items-start space-x-8 group">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Direct Contact Lines</h4>
                    <div className="space-y-2">
                      <p className="text-gray-600 text-xl">+94 11 2345678 <span className="text-base text-gray-500">(Main Line)</span></p>
                      <p className="text-gray-600 text-xl">+94 11 2345679 <span className="text-base text-gray-500">(Customer Service)</span></p>
                    </div>
                    <p className="text-base text-blue-600 font-semibold mt-2">Available during business hours</p>
                  </div>
                </div>

                {/* Professional Email */}
                <div className="flex items-start space-x-8 group">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-5 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Official Email Addresses</h4>
                    <div className="space-y-2">
                      <p className="text-gray-600 text-xl">info@pmb.gov.lk <span className="text-base text-gray-500">(General Inquiries)</span></p>
                      <p className="text-gray-600 text-xl">support@pmb.gov.lk <span className="text-base text-gray-500">(Technical Support)</span></p>
                    </div>
                    <p className="text-base text-amber-600 font-semibold mt-2">Response within 24 hours</p>
                  </div>
                </div>

                {/* Professional Office Hours */}
                <div className="flex items-start space-x-8 group">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-5 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Business Hours</h4>
                    <div className="space-y-2">
                      <p className="text-gray-600 text-xl">Monday - Friday: 8:00 AM - 4:30 PM</p>
                      <p className="text-gray-600 text-xl">Saturday: 8:00 AM - 12:00 PM</p>
                      <p className="text-gray-500 text-lg">Sunday: Closed</p>
                    </div>
                    <p className="text-base text-purple-600 font-semibold mt-2">Government working hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Emergency Contacts */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-12 border-2 border-red-100 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-10">
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-5 rounded-3xl shadow-xl mr-8">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="text-4xl font-bold bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">Emergency Support</h4>
              </div>
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div>
                    <span className="text-red-700 font-bold text-2xl">24/7 Emergency Hotline:</span>
                    <p className="text-base text-red-600 mt-2">Critical issues & urgent support</p>
                  </div>
                  <span className="text-4xl font-bold text-red-800 bg-gradient-to-r from-red-100 to-red-50 px-8 py-4 rounded-2xl shadow-lg">1920</span>
                </div>
                <div className="flex justify-between items-center bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div>
                    <span className="text-red-700 font-bold text-2xl">After Hours Support:</span>
                    <p className="text-base text-red-600 mt-2">Non-business hours assistance</p>
                  </div>
                  <span className="text-xl font-bold text-red-800 bg-gradient-to-r from-red-100 to-red-50 px-8 py-4 rounded-2xl shadow-lg">+94 77 1234567</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Professional Contact Form */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center mb-12">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-3xl shadow-xl mr-8">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Send us a Message
              </h3>
            </div>
            
            {submitStatus === 'success' && (
              <div className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-10 shadow-xl">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-5 mr-8 shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-green-800 mb-3">Message Sent Successfully!</h4>
                    <p className="text-green-700 text-xl">Thank you for contacting us. We'll respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group">
                  <label htmlFor="name" className="block text-base font-bold text-gray-800 mb-4 group-focus-within:text-emerald-600 transition-colors duration-200">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:border-gray-300 text-xl"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="group">
                  <label htmlFor="email" className="block text-base font-bold text-gray-800 mb-4 group-focus-within:text-emerald-600 transition-colors duration-200">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:border-gray-300 text-xl"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="group">
                  <label htmlFor="phone" className="block text-base font-bold text-gray-800 mb-4 group-focus-within:text-emerald-600 transition-colors duration-200">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:border-gray-300 text-xl"
                    placeholder="+94 XX XXXXXXX"
                  />
                </div>

                <div className="group">
                  <label htmlFor="subject" className="block text-base font-bold text-gray-800 mb-4 group-focus-within:text-emerald-600 transition-colors duration-200">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:border-gray-300 text-xl"
                    placeholder="Message subject"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-base font-bold text-gray-800 mb-4 group-focus-within:text-emerald-600 transition-colors duration-200">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:border-gray-300 resize-none text-xl"
                  placeholder="Write your message here..."
                />
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-12 rounded-2xl text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-3">
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group">
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-3 group-focus-within:text-emerald-600 transition-colors duration-200">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-300 text-lg"
                    placeholder="+94 77 1234567"
                  />
                </div>

                <div className="group">
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-800 mb-3 group-focus-within:text-emerald-600 transition-colors duration-200">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:border-gray-300 text-lg"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="collection">Collection Centers</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="registration">Mill Registration</option>
                    <option value="support">Technical Support</option>
                    <option value="complaint">Complaint</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-sm font-bold text-gray-800 mb-3 group-focus-within:text-emerald-600 transition-colors duration-200">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 resize-none bg-white/80 backdrop-blur-sm hover:border-gray-300 text-lg"
                  placeholder="Please describe your inquiry in detail..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-5 px-8 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-emerald-800 focus:ring-4 focus:ring-emerald-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 active:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Professional Message
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact