import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Droplet, Heart, ShieldCheck, Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export const Footer = () => {
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Hide footer inside the Admin Dashboard
  const isAdminPage = location.pathname.startsWith('/admin')
  if (isAdminPage) return null

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-var-surface text-var-txt-primary border-t border-var-border transition-all duration-300 pt-16 pb-24 md:pb-12 relative shadow-[0_-8px_30px_-5px_rgba(229,57,53,0.04)]">
      {/* Subtle top border glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary-red/50 to-transparent shadow-[0_0_12px_#E53935]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Logo & Mission (Col: 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-red/10 rounded-full flex items-center justify-center text-primary-red">
                <Droplet size={18} fill="currentColor" />
              </div>
              <span className="font-bold tracking-widest text-base uppercase">
                LIFESAVER<span className="text-primary-red">NGO</span>
              </span>
            </div>
            <p className="text-xs text-var-txt-secondary font-light leading-relaxed">
              We are a registered non-profit medical coordinating alliance committed to organizing safe field camps and verified donor networks.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-var-txt-secondary bg-var-border/20 p-2.5 rounded-lg border border-var-border/40 w-fit">
              <ShieldCheck size={14} className="text-green-600 dark:text-green-400" />
              <span>Certified ISO 9001 Guidelines</span>
            </div>
          </div>

          {/* Quick Links (Col: 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold tracking-wider uppercase mb-5">Quick Links</h3>
            <ul className="space-y-3 text-xs text-var-txt-secondary">
              <li>
                <Link to="/" className="hover:text-primary-red transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/find-blood" className="hover:text-primary-red transition-colors">Find Blood</Link>
              </li>
              <li>
                <Link to="/directory" className="hover:text-primary-red transition-colors">Donor Directory</Link>
              </li>
              <li>
                <Link to="/camps" className="hover:text-primary-red transition-colors">Donation Camps</Link>
              </li>
            </ul>
          </div>

          {/* Emergency Contact (Col: 3) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold tracking-wider uppercase mb-5">Emergency Help</h3>
            <ul className="space-y-3.5 text-xs text-var-txt-secondary font-light">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-primary-red shrink-0 mt-0.5" />
                <span>Sector 62, Noida, UP, 201301</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-primary-red shrink-0" />
                <a href="tel:+919876543210" className="hover:text-primary-red transition-colors font-bold">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-primary-red shrink-0" />
                <a href="mailto:emergency@lifesaverngo.org" className="hover:text-primary-red transition-colors">emergency@lifesaverngo.org</a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Socials (Col: 3) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="space-y-2">
              <h3 className="text-xs font-bold tracking-wider uppercase">Stay Updated</h3>
              <p className="text-[11px] text-var-txt-secondary font-light leading-relaxed">
                Join our newsletter list to receive notices on upcoming camps.
              </p>
            </div>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-lg border border-var-border bg-var-bg text-xs focus:outline-none focus:border-primary-red transition-colors text-var-txt-primary"
                />
                <button
                  type="submit"
                  className="h-9 w-9 bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal hover:bg-primary-red hover:dark:bg-primary-red hover:dark:text-pure-white rounded-lg flex items-center justify-center transition-all cursor-pointer border border-transparent"
                  aria-label="Subscribe"
                >
                  <Send size={13} />
                </button>
              </form>
            ) : (
              <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                ✓ Subscribed to newsletter
              </p>
            )}

            {/* Social Handles */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-var-txt-secondary uppercase tracking-widest block">Connect With Us</span>
              <div className="flex items-center gap-3 text-var-txt-secondary">
                <a href="#" className="hover:text-primary-red transition-colors" aria-label="Facebook"><Facebook size={16} /></a>
                <a href="#" className="hover:text-primary-red transition-colors" aria-label="Twitter"><Twitter size={16} /></a>
                <a href="#" className="hover:text-primary-red transition-colors" aria-label="Instagram"><Instagram size={16} /></a>
                <a href="#" className="hover:text-primary-red transition-colors" aria-label="LinkedIn"><Linkedin size={16} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-var-border pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-var-txt-secondary">
          <p>© {new Date().getFullYear()} LifeSaver NGO Network. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-var-txt-primary transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-var-txt-primary transition-colors">Terms of Service</Link>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              Made with <Heart size={10} className="text-primary-red animate-pulse" fill="currentColor" /> for medical support.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
