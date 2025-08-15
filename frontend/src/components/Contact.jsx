import { useState } from 'react'

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
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setSubmitStatus(''), 3000)
    }, 1200)
  }

  const inputClassName =
    'w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-paddy-green/20 rounded-2xl focus:ring-4 focus:ring-paddy-green/20 focus:border-paddy-green transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-soft hover:shadow-elevation'

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 overflow-hidden py-24">
      {/* Background overlays copied to match Features section */}
      <div className="absolute inset-0">
        {/* Clean gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-emerald-50/30"></div>
        {/* Subtle geometric blurred shapes */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-100/20 to-green-100/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-green-100/15 to-teal-100/10 rounded-full blur-3xl"></div>
        {/* Professional grid lines */}
        <div className="absolute inset-0 opacity-[0.01]">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-glow animate-pulse-glow">
            <span>We’re here to help</span>
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 professional-title enhanced-text-display">
            Contact Our Expert Team
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto professional-description">
            Support for farmers, mill owners, and customers across Sri Lanka. Reach out for product info, collection centers, pricing, or registration help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Info column */}
          <div className="space-y-6 animate-slide-in-left">
            <div className="glass-effect p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center">
                <div className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-3 shadow-glow">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Head Office
              </h3>

              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Paddy Marketing Board</p>
                    <p>No. 123, Colombo 07, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28l1.5 4.5-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26L20 14.72V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <a className="hover:text-emerald-600" href="tel:+94112345678">+94 11 234 5678</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a className="hover:text-emerald-600" href="mailto:info@pmbsrilanka.lk">info@pmbsrilanka.lk</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Working Hours</p>
                    <p>Mon - Fri: 8:00 AM - 5:00 PM</p>
                    <p>Sat: 8:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-effect p-6 rounded-3xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200">
              <h4 className="text-lg font-bold text-red-700 mb-3 flex items-center">
                <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center mr-3 shadow-glow">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.66 1.73-2.5L13.73 4c-.77-.83-1.97-.83-2.73 0L3.34 16.5c-.77.84.19 2.5 1.73 2.5z" />
                  </svg>
                </div>
                Emergency Support
              </h4>
              <p className="text-red-600 mb-2">Urgent assistance for supply issues:</p>
              <a href="tel:+941912" className="text-red-700 font-semibold hover:text-red-800">Hotline 1919</a>
            </div>

            <div className="glass-effect p-6 rounded-3xl">
              <h4 className="text-lg font-bold text-emerald-700 mb-4 text-center">Find Our Location</h4>
              <div className="relative rounded-2xl overflow-hidden border border-gray-200">
                <iframe
                  title="Paddy Marketing Board Head Office Map"
                  src="https://www.google.com/maps?q=Paddy+Marketing+Board%2C+Colombo+07%2C+Sri+Lanka&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-72 md:h-80"
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <a
                  href="https://www.google.com/maps?q=Paddy+Marketing+Board%2C+Colombo+07%2C+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-enhanced px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  Open in Google Maps
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Paddy+Marketing+Board%2C+Colombo+07%2C+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="animate-slide-in-right">
            <div className="glass-effect p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center">
                <div className="w-11 h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-3 shadow-glow">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                    <input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className={inputClassName} placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className={inputClassName} placeholder="your.email@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className={inputClassName} placeholder="+94 XX XXXXXXX" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                    <select id="subject" name="subject" required value={formData.subject} onChange={handleInputChange} className={inputClassName}>
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

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                  <textarea id="message" name="message" rows="6" required value={formData.message} onChange={handleInputChange} className={inputClassName + ' resize-none'} placeholder="Write your message here..." />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 text-white font-semibold py-3 rounded-2xl shadow-lg bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>

                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-bounce-in">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-emerald-800 font-semibold">Message sent successfully!</p>
                        <p className="text-emerald-600 text-sm">We’ll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact