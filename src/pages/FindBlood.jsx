import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { db } from '../services/db'
import { CardSkeleton } from '../components/SkeletonLoader'
import { Search, Phone, Send, Info, ShieldAlert, Heart, Calendar, Hospital, User, CheckCircle, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PUNJAB_DISTRICTS, PUNJAB_LOCATIONS } from '../constants/punjabLocations'

export const FindBlood = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters state
  const [bloodGroup, setBloodGroup] = useState(searchParams.get('group') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [district, setDistrict] = useState('')
  const [gender, setGender] = useState('')
  const [eligibility, setEligibility] = useState('')

  // Emergency request modal state
  const [requestModalOpen, setRequestModalOpen] = useState(false)
  const [requestTargetDonor, setRequestTargetDonor] = useState(null)
  
  // Emergency request form fields
  const [patientName, setPatientName] = useState('')
  const [hospitalName, setHospitalName] = useState('')
  const [reqBloodGroup, setReqBloodGroup] = useState('')
  const [unitsRequired, setUnitsRequired] = useState(1)
  const [urgency, setUrgency] = useState('Urgent')
  const [phone, setPhone] = useState('')
  const [requiredDate, setRequiredDate] = useState('')
  const [reqDistrict, setReqDistrict] = useState('')
  const [reqCity, setReqCity] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [generatedWhatsAppLink, setGeneratedWhatsAppLink] = useState('')

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    setLoading(true)
    try {
      const data = await db.getDonors()
      setDonors(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  // Sync state with URL params if they change
  useEffect(() => {
    const groupParam = searchParams.get('group')
    const cityParam = searchParams.get('city')
    if (groupParam) setBloodGroup(groupParam)
    if (cityParam) setCity(cityParam)
  }, [searchParams])

  // Filtered Donors list
  const filteredDonors = donors.filter(d => {
    if (bloodGroup && d.bloodGroup !== bloodGroup) return false
    if (city && d.city.toLowerCase() !== city.toLowerCase()) return false
    if (district && !d.district.toLowerCase().includes(district.toLowerCase())) return false
    if (gender && d.gender !== gender) return false
    if (eligibility) {
      if (eligibility === 'Eligible' && !d.eligible) return false
      if (eligibility === 'Not Eligible' && d.eligible) return false
    }
    return true
  })

  // Handle emergency request submission
  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    if (!reqDistrict || !reqCity) {
      alert('Please select a district and city in Punjab.')
      return
    }

    const reqData = {
      patientName,
      hospitalName,
      bloodGroup: reqBloodGroup,
      unitsRequired: Number(unitsRequired),
      urgency,
      phone,
      requiredDate,
      district: reqDistrict,
      city: reqCity
    }

    try {
      await db.addRequest(reqData)
      
      // Construct a premium pre-filled WhatsApp text for broadcasting
      const text = `🚨 *EMERGENCY BLOOD REQUEST* 🚨\n\n` +
                   `• *Patient*: ${patientName}\n` +
                   `• *Blood Group Required*: ${reqBloodGroup}\n` +
                   `• *Units Required*: ${unitsRequired}\n` +
                   `• *Urgency*: ${urgency} 🔴\n` +
                   `• *Hospital*: ${hospitalName}\n` +
                   `• *Location*: ${reqCity}, ${reqDistrict} (Punjab)\n` +
                   `• *Required Date*: ${requiredDate}\n` +
                   `• *Contact Number*: ${phone}\n\n` +
                   `Please share this or contact immediately to save a life. Powered by AZAAD HUMAN RIGHTS ASSOCIATION.`;
      
      const waLink = `https://wa.me/?text=${encodeURIComponent(text)}`
      setGeneratedWhatsAppLink(waLink)
      setSubmitSuccess(true)
      
      // Reset form
      setPatientName('')
      setHospitalName('')
      setPhone('')
      setRequiredDate('')
      setReqDistrict('')
      setReqCity('')
      
      // Refresh donors
      fetchDonors()
    } catch (err) {
      console.error(err)
    }
  }

  // Preset request data if requesting directly from a donor card
  const openDirectRequest = (donor) => {
    setRequestTargetDonor(donor)
    setReqBloodGroup(donor.bloodGroup)
    setSubmitSuccess(false)
    setRequestModalOpen(true)
  }

  const openGeneralRequest = () => {
    setRequestTargetDonor(null)
    setReqBloodGroup(bloodGroup || 'O+')
    setSubmitSuccess(false)
    setRequestModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-8 mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-wide uppercase flex items-center gap-2">
            <Heart className="text-primary-red fill-primary-red" size={28} />
            Find Blood Donors
          </h1>
          <p className="text-text-secondary text-sm font-light mt-2 max-w-xl">
            Filter our database of certified donors. Call them directly or submit an official request to dispatch emergency alerts to nearby members.
          </p>
        </div>
        
        <button
          onClick={openGeneralRequest}
          className="px-6 py-3 bg-primary-red hover:bg-dark-red text-pure-white font-bold tracking-wider uppercase text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <ShieldAlert size={16} />
          Create Emergency Request
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Advanced Filters */}
        <div className="lg:col-span-3 glass-panel p-6 border rounded-xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary-red border-b pb-2 flex items-center gap-1.5">
            <Search size={14} />
            Search Filters
          </h2>

          {/* Blood Group */}
          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary font-bold uppercase tracking-wider">Blood Group</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-all"
            >
              <option value="">Any Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => (
                <option key={grp} value={grp}>{grp}</option>
              ))}
            </select>
          </div>

          {/* District Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary font-bold uppercase tracking-wider">Select District</label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value)
                setCity('')
              }}
              className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-all text-text-primary"
            >
              <option value="">All Districts</option>
              {PUNJAB_DISTRICTS.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          {/* City Selector */}
          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary font-bold uppercase tracking-wider">Select City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!district}
              className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-all disabled:opacity-50 text-text-primary"
            >
              <option value="">All Cities</option>
              {district && PUNJAB_LOCATIONS[district]?.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Eligibility status */}
          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary font-bold uppercase tracking-wider">Availability Status</label>
            <select
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-all"
            >
              <option value="">All Donors</option>
              <option value="Eligible">Eligible (Ready to Donate)</option>
              <option value="Not Eligible">Not Eligible Yet (Cooldown)</option>
            </select>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs text-text-secondary font-bold uppercase tracking-wider">Gender</label>
            <div className="flex gap-2">
              {['All', 'Male', 'Female'].map((gen) => (
                <button
                  key={gen}
                  type="button"
                  onClick={() => setGender(gen === 'All' ? '' : gen)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    (gen === 'All' && !gender) || gender === gen
                      ? 'bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal border-transparent'
                      : 'border-border-color hover:bg-bg-secondary text-text-secondary'
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => {
              setBloodGroup('')
              setCity('')
              setDistrict('')
              setGender('')
              setEligibility('')
              setSearchParams({})
            }}
            className="w-full py-2 border border-dashed border-border-color hover:border-primary-red hover:text-primary-red text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
          >
            Clear Filters
          </button>
        </div>

        {/* Right Side: Donor Results Grid */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
              Search Results ({filteredDonors.length} Donors Found)
            </h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filteredDonors.length === 0 ? (
            // Beautiful Empty State
            <div className="border border-dashed border-border-color/60 rounded-2xl p-12 text-center bg-bg-secondary/10">
              <Info size={48} className="text-text-secondary mx-auto mb-4 stroke-[1.2]" />
              <h4 className="font-bold text-lg mb-1">No Matching Donors</h4>
              <p className="text-text-secondary text-sm font-light max-w-md mx-auto mb-6">
                Try widening your city or blood group parameters. You can also submit an Emergency Request which sends alerts to our offline volunteer teams.
              </p>
              <button
                onClick={openGeneralRequest}
                className="px-6 py-2.5 bg-primary-red hover:bg-dark-red text-pure-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow"
              >
                Submit Emergency Request
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDonors.map((donor) => (
                <div 
                  key={donor.id}
                  className="border border-border-color/30 rounded-xl p-5 bg-bg-primary shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 hover:border-primary-red/20 duration-300"
                >
                  {/* Top donor information */}
                  <div className="flex gap-4 items-start">
                    <img 
                      src={donor.photo} 
                      alt={donor.fullName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-border-color/30 shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base leading-tight truncate">{donor.fullName}</h4>
                      <p className="text-xs text-text-secondary font-light mt-0.5">{donor.age} yrs • {donor.gender}</p>
                      
                      {/* Location Badge */}
                      <p className="text-[11px] text-text-secondary mt-2 leading-relaxed font-light truncate">
                        {donor.district}, {donor.city}
                      </p>
                    </div>
                    {/* Glowing Blood Group Badge */}
                    <div className="w-11 h-11 bg-primary-red/10 dark:bg-primary-red/20 border border-primary-red/20 rounded-xl flex items-center justify-center text-primary-red font-black text-sm shadow-[0_0_8px_rgba(229,57,53,0.1)] shrink-0">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  {/* Dynamic Eligibility Indicator */}
                  <div className="border-t border-b border-border-color/20 py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-text-secondary">
                      <Calendar size={13} className="shrink-0" />
                      <span className="font-light">Last Donated:</span>
                    </div>
                    <span className="font-mono text-text-primary font-medium">
                      {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                    </span>
                  </div>

                  {/* Availability/Eligibility Badge */}
                  <div className="flex items-center gap-2">
                    {donor.eligible ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                        <CheckCircle size={12} />
                        Eligible (Ready)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <Clock size={12} />
                        Not Eligible Yet ({donor.daysRemaining}d left)
                      </span>
                    )}
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex gap-2 pt-2">
                    <a
                      href={`tel:${donor.phone}`}
                      className="flex-1 py-2 border border-border-color hover:border-primary-red hover:text-primary-red rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 bg-bg-secondary/10 transition-colors"
                    >
                      <Phone size={13} />
                      Call
                    </a>
                    
                    <button
                      onClick={() => openDirectRequest(donor)}
                      className="flex-1 py-2 bg-charcoal dark:bg-bg-secondary hover:bg-primary-red hover:dark:bg-primary-red text-pure-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-border-color/10"
                    >
                      <Send size={13} />
                      Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Emergency Request Modal */}
      <AnimatePresence>
        {requestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRequestModalOpen(false)}
              className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-lg bg-bg-primary border border-border-color/40 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden"
            >
              <h2 className="text-xl font-bold tracking-wide uppercase border-b pb-3 text-text-primary flex items-center gap-2">
                <ShieldAlert className="text-primary-red" size={20} />
                Create Emergency Request
              </h2>

              {!submitSuccess ? (
                <form onSubmit={handleRequestSubmit} className="space-y-4 pt-4">
                  {requestTargetDonor && (
                    <div className="bg-primary-red/5 p-3 rounded-lg border border-primary-red/10 text-xs text-text-primary flex items-center gap-2">
                      <User size={14} className="text-primary-red" />
                      <span>Requesting directly from <strong>{requestTargetDonor.fullName}</strong> ({requestTargetDonor.bloodGroup})</span>
                    </div>
                  )}

                  {/* Patient Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                      <User size={11} /> Patient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter patient name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                    />
                  </div>

                  {/* Hospital */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                      <Hospital size={11} /> Hospital Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Max Hospital, Civil Lines"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                    />
                  </div>

                  {/* Hospital Location Dropdowns */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center gap-1">Hospital District</label>
                      <select
                        required
                        value={reqDistrict}
                        onChange={(e) => {
                          setReqDistrict(e.target.value)
                          setReqCity('')
                        }}
                        className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red text-text-primary"
                      >
                        <option value="">Select District</option>
                        {PUNJAB_DISTRICTS.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center gap-1">Hospital City</label>
                      <select
                        required
                        value={reqCity}
                        onChange={(e) => setReqCity(e.target.value)}
                        disabled={!reqDistrict}
                        className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red disabled:opacity-50 text-text-primary"
                      >
                        <option value="">Select City</option>
                        {reqDistrict && PUNJAB_LOCATIONS[reqDistrict]?.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Blood Group */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Required Blood Group</label>
                      <select
                        value={reqBloodGroup}
                        onChange={(e) => setReqBloodGroup(e.target.value)}
                        disabled={!!requestTargetDonor}
                        className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => (
                          <option key={grp} value={grp}>{grp}</option>
                        ))}
                      </select>
                    </div>

                    {/* Units */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Units Needed (Pints)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        required
                        value={unitsRequired}
                        onChange={(e) => setUnitsRequired(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Urgency */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Urgency Level</label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Critical">Critical 🔴</option>
                      </select>
                    </div>

                    {/* Needed Date */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={11} /> Required Date
                      </label>
                      <input
                        type="date"
                        required
                        value={requiredDate}
                        onChange={(e) => setRequiredDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Attender Phone Contact</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRequestModalOpen(false)}
                      className="flex-1 py-2.5 border border-border-color hover:bg-bg-secondary text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-primary-red hover:bg-dark-red text-pure-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              ) : (
                // Success screen inside modal
                <div className="py-6 text-center space-y-5">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mx-auto shadow-sm">
                    <CheckCircle size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Request Lodged Successfully</h3>
                    <p className="text-text-secondary text-xs font-light max-w-sm mx-auto leading-relaxed">
                      Your emergency request has been registered in our central database. Nearby donors matching group <strong>{reqBloodGroup}</strong> have been notified.
                    </p>
                  </div>

                  {/* WhatsApp Action */}
                  <div className="p-4 bg-border-color/15 rounded-xl border space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider">Accelerate with WhatsApp</h4>
                    <p className="text-[11px] text-text-secondary font-light">
                      Click the button below to generate a pre-formatted emergency dispatch text to broadcast on your WhatsApp groups instantly.
                    </p>
                    <a
                      href={generatedWhatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-pure-white text-xs font-bold tracking-wider uppercase rounded-lg shadow transition-colors"
                    >
                      <Send size={12} />
                      WhatsApp Broadcast Link
                    </a>
                  </div>

                  <button
                    onClick={() => setRequestModalOpen(false)}
                    className="w-full py-2 border border-border-color hover:bg-bg-secondary text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
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
export default FindBlood
