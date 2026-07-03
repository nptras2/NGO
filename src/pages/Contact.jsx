import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, ShieldCheck, Heart, Sparkles, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="border-b pb-8 mb-12">
        <h1 className="text-3xl font-extrabold tracking-wide uppercase flex items-center gap-2">
          <Mail size={28} className="text-primary-red" />
          Contact Alliance Hub
        </h1>
        <p className="text-text-secondary text-sm font-light mt-2 max-w-xl">
          Get in touch with our central coordinators for administrative inquiries, corporate blood drives, or volunteer applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Contact Form */}
        <div className="lg:col-span-7 glass-panel p-6 md:p-8 border rounded-2xl bg-bg-primary">
          <h2 className="text-lg font-bold tracking-wide uppercase border-b pb-3 mb-6 flex items-center gap-2">
            <Sparkles size={18} className="text-primary-red" />
            Send Administrative Inquiry
          </h2>

          {!submitted ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyan Sen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Registering a college camp"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Message Description</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Write details of your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-charcoal dark:bg-bg-secondary hover:bg-primary-red hover:dark:bg-primary-red text-pure-white font-bold tracking-wider uppercase text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <Send size={13} />
                Transmit Inquiry
              </button>
            </form>
          ) : (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mx-auto border border-green-500/20">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold">Inquiry Transmitted</h3>
                <p className="text-text-secondary text-xs font-light max-w-sm mx-auto leading-relaxed">
                  Your message has been filed. An NGO cabinet administrator will review your subject line and reply via email within 24 working hours.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 border border-border-color hover:bg-bg-secondary text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Emergency Hotline & Office Info & Map */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Emergency Card */}
          <div className="glass-panel p-6 border rounded-2xl bg-gradient-to-r from-primary-red/10 to-primary-red/5 border-primary-red/20 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary-red flex items-center gap-2">
              <AlertTriangle size={16} />
              Emergency Dispatch Grid
            </h3>
            <p className="text-xs text-text-secondary font-light leading-relaxed">
              If you require immediate blood units for surgeries, accidents, or chemotherapy, contact our dispatch hotlines instantly.
            </p>
            <div className="space-y-2 pt-2 text-sm font-bold">
              <a href="tel:+919876543210" className="flex items-center gap-2 p-3 bg-bg-primary rounded-xl border border-primary-red/10 text-text-primary hover:text-primary-red hover:border-primary-red transition-all">
                <Phone size={16} className="text-primary-red shrink-0" />
                <span>Hotline 1: +91 98765 43210</span>
              </a>
              <a href="tel:+919876543211" className="flex items-center gap-2 p-3 bg-bg-primary rounded-xl border border-primary-red/10 text-text-primary hover:text-primary-red hover:border-primary-red transition-all">
                <Phone size={16} className="text-primary-red shrink-0" />
                <span>Hotline 2: +91 98765 43211</span>
              </a>
            </div>
          </div>

          {/* Directory Contact Info */}
          <div className="glass-panel p-6 border rounded-2xl bg-bg-primary space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary border-b pb-2">Office Directory</h3>
            <ul className="text-xs text-text-secondary space-y-3.5 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-primary-red shrink-0 mt-0.5" />
                <span>LifeSaver HQ, 4th Floor Medical Plaza, Sector 62, Noida, UP, 201301</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="text-primary-red shrink-0" />
                <a href="mailto:info@lifesaverngo.org" className="hover:text-primary-red transition-colors">info@lifesaverngo.org</a>
              </li>
            </ul>
          </div>

          {/* Stylized Visual Map */}
          <div className="h-44 border border-border-color/30 rounded-2xl overflow-hidden bg-bg-secondary/40 relative flex items-center justify-center p-4">
            {/* SVG stylized map representation */}
            <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full text-border-color opacity-30 select-none">
              <path d="M 0 0 L 100 60 M 100 0 L 0 60 M 20 10 L 80 50 M 80 10 L 20 50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
              <circle cx="50" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="30" r="4" fill="#E53935" className="animate-ping" style={{ transformOrigin: 'center' }} />
              <circle cx="50" cy="30" r="2.5" fill="#E53935" />
            </svg>
            <div className="absolute bottom-3 left-3 bg-charcoal text-pure-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider border border-border-color/10">
              Locate Headquarters
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
export default Contact
