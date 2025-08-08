import { useState } from 'react';
import PageTitle from './PageTitle';

const Contact = () => {
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
    <section id="contact" className="relative min-h-screen bg-white overflow-hidden py-24">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/50"></div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23059669' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative container mx-auto px-4 max-w-7xl">
        {/* Page Title Component */}
        <PageTitle 
          subtitle="Get In Touch"
          title="Contact Our Expert Team"
          description="We're here to support farmers, mill owners, and customers with professional assistance and comprehensive agricultural services across Sri Lanka."
          className="bg-gradient-to-br from-emerald-500/5 via-green-500/3 to-teal-500/5 mb-8"
          titleClassName="professional-title enhanced-text-display responsive-title-text"
          subtitleClassName="professional-subtitle responsive-subtitle-text"
          descriptionClassName="professional-description enhanced-text-display responsive-description-text"
        />
        
        {/* Service Tags */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/20">
            <span className="text-emerald-700 font-medium text-sm">🌾 Farmer Support</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-400/20">
            <span className="text-blue-700 font-medium text-sm">🏭 Mill Registration</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/10 backdrop-blur-sm rounded-full border border-purple-400/20">
            <span className="text-purple-700 font-medium text-sm">💼 Business Inquiries</span>
          </div>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-10 rounded-3xl mb-12 shadow-2xl">
            <div className="flex items-center">
              <svg className="w-12 h-12 mr-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-3xl font-bold mb-2">Message Sent Successfully!</h3>
                <p className="text-xl opacity-90">Thank you for contacting us. We'll get back to you within 24 hours.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-12">
            {/* Main Office */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20">
              <div className="flex items-center mb-8">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mr-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Head Office</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-emerald-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xl font-semibold text-gray-800 mb-2">Address</p>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      No. 123, Paddy Marketing Board Building<br />
                      Colombo 07, Sri Lanka
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-emerald-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-xl font-semibold text-gray-800 mb-2">Phone</p>
                    <p className="text-xl text-gray-600">+94 11 234 5678</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-8 h-8 text-emerald-600 mr-4 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-xl font-semibold text-gray-800 mb-2">Email</p>
                    <p className="text-xl text-gray-600">info@pmbsrilanka.lk</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-12 shadow-xl border border-red-100">
              <div className="flex items-center mb-8">
                <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mr-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold text-red-700">Emergency Support</h3>
              </div>
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-red-600 w-32">24/7 Hotline:</span>
                  <span className="text-2xl text-red-700 font-semibold">1919</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-red-600 w-32">Mobile:</span>
                  <span className="text-2xl text-red-700 font-semibold">+94 77 123 4567</span>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-xl border border-white/20">
              <div className="flex items-center mb-8">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Office Hours</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-700">Monday - Friday</span>
                  <span className="text-xl text-gray-600">8:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-700">Saturday</span>
                  <span className="text-xl text-gray-600">8:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-700">Sunday</span>
                  <span className="text-xl text-red-600 font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/30">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Send Us a Message
                  </span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Fill out the form below and our team will get back to you as soon as possible. We value your feedback and inquiries.
                </p>
              </div>

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
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 bg-white/90 backdrop-blur-sm hover:border-gray-300 text-xl"
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
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Send Professional Message</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact