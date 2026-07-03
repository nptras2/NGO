import React, { useEffect, useState } from 'react'
import { db } from '../../services/db'
import { useAuth } from '../../context/AuthContext'
import { Plus, Edit2, Trash2, ShieldAlert, Calendar, MapPin, Users, Droplets, Info } from 'lucide-react'
import { PUNJAB_DISTRICTS, PUNJAB_LOCATIONS } from '../../constants/punjabLocations'

export const CampsManagement = () => {
  const { user, permissions } = useAuth()
  const [camps, setCamps] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCamp, setEditingCamp] = useState(null)
  
  // Form fields
  const [campName, setCampName] = useState('')
  const [date, setDate] = useState('')
  const [venue, setVenue] = useState('')
  const [organizer, setOrganizer] = useState('')
  const [status, setStatus] = useState('Upcoming')
  const [totalDonors, setTotalDonors] = useState(0)
  const [unitsCollected, setUnitsCollected] = useState(0)
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    fetchCamps()
  }, [])

  const fetchCamps = async () => {
    setLoading(true)
    const data = await db.getCamps()
    setCamps(data)
    setLoading(false)
  }

  const handleOpenAddModal = () => {
    setEditingCamp(null)
    setCampName('')
    setDate('')
    setVenue('')
    setOrganizer('')
    setStatus('Upcoming')
    setTotalDonors(0)
    setUnitsCollected(0)
    setDistrict('')
    setCity('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (camp) => {
    setEditingCamp(camp)
    setCampName(camp.campName)
    setDate(camp.date)
    setVenue(camp.venue)
    setOrganizer(camp.organizer)
    setStatus(camp.status)
    setTotalDonors(camp.totalDonors || 0)
    setUnitsCollected(camp.unitsCollected || 0)
    setDistrict(camp.district || '')
    setCity(camp.city || '')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!district || !city) {
      alert('Please select a district and city in Punjab.')
      return
    }
    
    // Choose random medical illustration photo if not editing
    const defaultPhoto = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=400&fit=crop'
    const campPayload = {
      campName,
      date,
      venue,
      organizer,
      status,
      district,
      city,
      totalDonors: Number(totalDonors),
      unitsCollected: Number(unitsCollected),
      photo: editingCamp?.photo || defaultPhoto
    }

    try {
      if (editingCamp) {
        await db.updateCamp(editingCamp.id, campPayload, user)
      } else {
        await db.addCamp(campPayload, user)
      }
      setModalOpen(false)
      fetchCamps()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this camp?')) {
      try {
        await db.deleteCamp(id, user)
        fetchCamps()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const userCanManage = permissions.canManageCamps()

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider">NGO Blood Camps Management</h2>
          <span className="text-xs text-text-secondary font-light">Schedule future campaigns, edit venues, and record turnout metrics.</span>
        </div>

        <button
          onClick={handleOpenAddModal}
          disabled={!userCanManage}
          className={`px-5 py-2.5 bg-primary-red hover:bg-dark-red text-pure-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow transition-all ${
            !userCanManage ? 'opacity-40 cursor-not-allowed hover:bg-primary-red' : 'cursor-pointer'
          }`}
        >
          <Plus size={14} />
          Create Upcoming Camp
        </button>
      </div>

      {/* RBAC restricts view */}
      {!userCanManage && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
          <ShieldAlert size={16} />
          <span>Your current role (<strong>{user?.post}</strong>) is restricted from updating blood donation campaigns. Contact NGO Board Executives for edits.</span>
        </div>
      )}

      {/* Grid listing */}
      {loading ? (
        <div className="text-xs text-text-secondary text-center py-10">Fetching camps records...</div>
      ) : camps.length === 0 ? (
        <div className="border border-dashed border-border-color/60 rounded-2xl p-10 text-center bg-bg-secondary/15">
          <Info size={36} className="text-text-secondary mx-auto mb-2.5" />
          <h4 className="font-bold text-sm">No camps found.</h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {camps.map((camp) => (
            <div 
              key={camp.id}
              className="border border-border-color/20 rounded-xl overflow-hidden bg-bg-primary shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="p-5 space-y-4">
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                    camp.status === 'Upcoming'
                      ? 'text-primary-red bg-primary-red/10 border-primary-red/20'
                      : 'text-text-secondary bg-bg-secondary border-border-color/30'
                  }`}>
                    {camp.status}
                  </span>
                  
                  <span className="text-[10px] text-text-secondary font-mono">
                    ID: {camp.id}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-base leading-snug line-clamp-1">{camp.campName}</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary font-light">
                    <p className="flex items-center gap-1.5 truncate">
                      <Calendar size={13} className="text-primary-red shrink-0" />
                      {new Date(camp.date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin size={13} className="text-primary-red shrink-0" />
                      {camp.venue}
                    </p>
                  </div>

                  <p className="text-[11px] text-text-secondary font-light pt-1">
                    Organizer: <strong>{camp.organizer}</strong>
                  </p>
                </div>

                {/* Turnout stats if completed */}
                {camp.status === 'Completed' && (
                  <div className="bg-bg-secondary/40 p-3 rounded-lg border flex justify-around text-xs text-text-secondary">
                    <div className="text-center">
                      <span className="flex items-center gap-1 font-bold text-text-primary">
                        <Users size={12} className="text-primary-red" /> {camp.totalDonors}
                      </span>
                      <span className="text-[10px] font-light">Donors RSVP</span>
                    </div>
                    <div className="w-[1px] bg-border-color/30" />
                    <div className="text-center">
                      <span className="flex items-center gap-1 font-bold text-text-primary">
                        <Droplets size={12} className="text-primary-red" /> {camp.unitsCollected}
                      </span>
                      <span className="text-[10px] font-light">Pints Collected</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="border-t border-border-color/15 px-5 py-3 flex justify-end gap-3 bg-bg-secondary/10">
                <button
                  disabled={!userCanManage}
                  onClick={() => handleOpenEditModal(camp)}
                  className={`px-3 py-1.5 border hover:border-primary-red hover:text-primary-red text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${
                    !userCanManage ? 'opacity-35 cursor-not-allowed hover:border-border-color' : ''
                  }`}
                >
                  <Edit2 size={10} /> Update Camp
                </button>
                <button
                  disabled={!userCanManage}
                  onClick={() => handleDelete(camp.id)}
                  className={`px-3 py-1.5 border hover:border-primary-red hover:text-primary-red text-[10px] font-bold uppercase tracking-wider rounded-md flex items-center gap-1 transition-all ${
                    !userCanManage ? 'opacity-35 cursor-not-allowed hover:border-border-color' : ''
                  }`}
                >
                  <Trash2 size={10} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRUD Camp Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-bg-primary border border-border-color/40 rounded-xl p-5 shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2">
              {editingCamp ? 'Update Camp Details' : 'Create Donation Camp'}
            </h3>

            {/* Camp Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Camp Campaign Name</label>
              <input
                type="text"
                required
                placeholder="e.g. LifeSaver Noida Corporate Camp"
                value={campName}
                onChange={(e) => setCampName(e.target.value)}
                className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
              />
            </div>

            {/* Date & Venue */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Event Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Organizer</label>
                <input
                  type="text"
                  required
                  placeholder="NGO Team Name"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Venue Address */}
            <div className="space-y-1">
              <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Venue Location Details (Building/Street)</label>
              <input
                type="text"
                required
                placeholder="e.g. Civil Lines Club Hall"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
              />
            </div>

            {/* District & City Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">District</label>
                <select
                  required
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value)
                    setCity('')
                  }}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none"
                >
                  <option value="">Select District</option>
                  {PUNJAB_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">City</label>
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!district}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-text-primary text-xs focus:outline-none disabled:opacity-50"
                >
                  <option value="">Select City</option>
                  {district && PUNJAB_LOCATIONS[district]?.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Option */}
            <div className="grid grid-cols-3 gap-2 space-y-1">
              <div className="col-span-3">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Camp Status</label>
              </div>
              {['Upcoming', 'Completed'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    status === st
                      ? 'bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal border-transparent'
                      : 'border-border-color hover:bg-bg-secondary text-text-secondary'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Donors & Units Turnout (Conditional if Completed) */}
            {status === 'Completed' && (
              <div className="grid grid-cols-2 gap-4 bg-bg-secondary/25 p-3 rounded-lg border">
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Total Donors Turnout</label>
                  <input
                    type="number"
                    min="0"
                    value={totalDonors}
                    onChange={(e) => setTotalDonors(e.target.value)}
                    className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Blood Pints Collected</label>
                  <input
                    type="number"
                    min="0"
                    value={unitsCollected}
                    onChange={(e) => setUnitsCollected(e.target.value)}
                    className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2 border border-border-color hover:bg-bg-secondary text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-primary-red hover:bg-dark-red text-pure-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow"
              >
                Save Camp
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
export default CampsManagement
