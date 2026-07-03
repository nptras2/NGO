import React, { useEffect, useState } from 'react'
import { db } from '../services/db'
import { MapPin, Calendar, Users, Droplets, CheckCircle, Shield, Image, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PremiumCard } from '../components/PremiumCard'

export const Camps = () => {
  const [camps, setCamps] = useState([])
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' or 'completed'
  
  // Registration modal states
  const [registerCamp, setRegisterCamp] = useState(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [bloodGroup, setBloodGroup] = useState('O+')
  const [registerSuccess, setRegisterSuccess] = useState(false)

  useEffect(() => {
    fetchCamps()
  }, [])

  const fetchCamps = async () => {
    const data = await db.getCamps()
    setCamps(data)
  }

  // Filter camps by tab
  const upcomingCamps = camps.filter(c => c.status === 'Upcoming')
  const completedCamps = camps.filter(c => c.status === 'Completed')

  // Handle register submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    // Simulated API request
    setRegisterSuccess(true)
    setFullName('')
    setPhone('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="border-b pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide uppercase flex items-center gap-2">
            <Calendar size={28} className="text-primary-red" />
            NGO Blood Camps
          </h1>
          <p className="text-text-secondary text-sm font-light mt-2 max-w-xl">
            Join our ongoing donation campaigns. Discover locations, coordinate with local organizers, register to volunteer, or check past turnout analytics.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-bg-secondary/40 p-1 border rounded-xl w-fit self-start md:self-end">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'upcoming' 
                ? 'bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal shadow-sm'
                : 'text-text-secondary hover:bg-bg-secondary'
            }`}
          >
            Upcoming ({upcomingCamps.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'completed' 
                ? 'bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal shadow-sm'
                : 'text-text-secondary hover:bg-bg-secondary'
            }`}
          >
            Completed ({completedCamps.length})
          </button>
        </div>
      </div>

      {/* Main timeline listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Timeline Cards */}
        <div className="lg:col-span-8 space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-[2px] before:bg-border-color/20">
          
          <AnimatePresence mode="wait">
            {activeTab === 'upcoming' ? (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {upcomingCamps.map((camp, idx) => (
                  <div key={camp.id} className="relative pl-10 group">
                    {/* Timeline Node dot */}
                    <div className="absolute left-[9px] top-1.5 w-[16px] h-[16px] bg-bg-primary border-[3px] border-primary-red rounded-full z-10 shadow group-hover:scale-125 transition-transform" />
                    
                    <PremiumCard className="p-0 overflow-hidden flex flex-col md:flex-row bg-var-card border border-var-border/60 hover:border-primary-red/20 shadow-sm" hoverLift={true} borderGlow={true}>
                      {/* Photo */}
                      <div className="md:w-56 h-40 md:h-auto relative bg-dark-gray shrink-0">
                        <img src={camp.photo} alt={camp.campName} className="w-full h-full object-cover opacity-85" />
                      </div>
                      
                      {/* Details */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-red bg-primary-red/10 px-2 py-0.5 rounded">
                            {camp.organizer}
                          </span>
                          <h3 className="text-xl font-bold tracking-wide">{camp.campName}</h3>
                          <div className="text-xs text-text-secondary font-light space-y-1.5 pt-1">
                            <p className="flex items-center gap-1.5">
                              <Calendar size={13} className="text-primary-red shrink-0" />
                              {new Date(camp.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <MapPin size={13} className="text-primary-red shrink-0" />
                              {camp.venue}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setRegisterCamp(camp)
                            setRegisterSuccess(false)
                          }}
                          className="px-5 py-2 bg-charcoal dark:bg-var-surface hover:bg-primary-red hover:dark:bg-primary-red text-pure-white text-xs font-bold tracking-wider uppercase rounded-lg transition-colors border border-var-border/10 w-fit cursor-pointer"
                        >
                          Register to Donate
                        </button>
                      </div>
                    </PremiumCard>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="completed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                {completedCamps.map((camp) => (
                  <div key={camp.id} className="relative pl-10 group">
                    {/* Timeline Node dot */}
                    <div className="absolute left-[9px] top-1.5 w-[16px] h-[16px] bg-bg-primary border-[3px] border-text-secondary rounded-full z-10 shadow" />
                    
                    <PremiumCard className="p-0 overflow-hidden flex flex-col md:flex-row bg-var-card border border-var-border/60 hover:border-primary-red/20 shadow-sm opacity-90" hoverLift={true} borderGlow={true}>
                      {/* Photo */}
                      <div className="md:w-56 h-40 md:h-auto relative bg-dark-gray shrink-0 grayscale">
                        <img src={camp.photo} alt={camp.campName} className="w-full h-full object-cover opacity-70" />
                      </div>
                      
                      {/* Details */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary bg-var-surface px-2 py-0.5 rounded">
                            {camp.organizer}
                          </span>
                          <h3 className="text-lg font-bold tracking-wide">{camp.campName}</h3>
                          <div className="text-xs text-text-secondary font-light space-y-1.5 pt-1">
                            <p className="flex items-center gap-1.5">
                              <Calendar size={13} className="shrink-0" />
                              {new Date(camp.date).toLocaleDateString()}
                            </p>
                            <p className="flex items-center gap-1.5">
                              <MapPin size={13} className="shrink-0" />
                              {camp.venue}
                            </p>
                          </div>
                        </div>

                        {/* Turnout metrics */}
                        <div className="pt-3 border-t border-var-border/40 flex gap-6 text-xs text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Users size={14} className="text-primary-red" />
                            <strong>{camp.totalDonors}</strong> Donors Attended
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplets size={14} className="text-primary-red" />
                            <strong>{camp.unitsCollected}</strong> Units Collected
                          </span>
                        </div>
                      </div>
                    </PremiumCard>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Operational Gallery & Safety Banner */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Gallery Widget */}
          <div className="glass-panel p-5 border rounded-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 border-b pb-2">
              <Image size={15} className="text-primary-red" />
              Campaign Gallery
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="h-24 rounded-lg overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=200&h=200&fit=crop" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300" />
              </div>
              <div className="h-24 rounded-lg overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300" />
              </div>
              <div className="h-24 rounded-lg overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=200&h=200&fit=crop" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300" />
              </div>
              <div className="h-24 rounded-lg overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1538108176447-284442797417?w=200&h=200&fit=crop" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300" />
              </div>
            </div>
            <p className="text-[11px] text-text-secondary font-light text-center">Photos from our active medical camps nationwide.</p>
          </div>

          {/* Safety Guidelines */}
          <div className="glass-panel p-5 border rounded-xl bg-primary-red/5 border-primary-red/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-primary-red/10 text-primary-red">
              <Shield size={15} />
              Donor Checklist
            </h3>
            <ul className="text-xs space-y-3.5 text-text-secondary font-light">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span>Must be between 18 and 65 years old.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span>Body weight must be at least 50 kg (110 lbs).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span>Must have a hemoglobin level of 12.5 g/dl minimum.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span>Must NOT have donated blood within the past 90 days.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Registration popup modal */}
      <AnimatePresence>
        {registerCamp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRegisterCamp(null)}
              className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative w-full max-w-md bg-bg-primary border border-border-color/40 rounded-2xl p-6 shadow-2xl z-10"
            >
              <h2 className="text-xl font-bold tracking-wide uppercase border-b pb-3 flex items-center gap-2">
                <Sparkles size={20} className="text-primary-red" />
                Camp Registration
              </h2>

              {!registerSuccess ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-4">
                  <div className="bg-bg-secondary/40 p-3 rounded-lg border text-xs text-text-secondary space-y-1">
                    <span className="font-bold text-text-primary">Camp Selected:</span>
                    <p className="font-light line-clamp-1">{registerCamp.campName}</p>
                    <p className="font-mono text-[10px]">{registerCamp.venue}</p>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sen"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Contact Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98451 98451"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                    />
                  </div>

                  {/* Blood group */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => (
                        <option key={grp} value={grp}>{grp}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRegisterCamp(null)}
                      className="flex-1 py-2.5 border border-border-color hover:bg-bg-secondary text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-primary-red hover:bg-dark-red text-pure-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Screen */
                <div className="py-6 text-center space-y-5">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mx-auto border border-green-500/20">
                    <CheckCircle size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Booking Confirmed!</h3>
                    <p className="text-text-secondary text-xs font-light max-w-sm mx-auto leading-relaxed">
                      Thank you for volunteering. We have reserved a priority slot for you at the <strong>{registerCamp.campName}</strong>. Please bring a valid ID and remain hydrated.
                    </p>
                  </div>
                  <button
                    onClick={() => setRegisterCamp(null)}
                    className="w-full py-2.5 bg-charcoal dark:bg-bg-secondary hover:bg-primary-red hover:dark:bg-primary-red text-pure-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
export default Camps
