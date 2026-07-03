import React, { useEffect, useState } from 'react'
import { db } from '../../services/db'
import { useAuth } from '../../context/AuthContext'
import { Plus, Edit2, Trash2, ShieldAlert, UserPlus, Info, CheckCircle, Clock } from 'lucide-react'
import { PUNJAB_DISTRICTS, PUNJAB_LOCATIONS } from '../../constants/punjabLocations'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'

export const DonorsManagement = () => {
  const { user, permissions } = useAuth()
  const queryClient = useQueryClient()
  
  // Toast notifications state
  const [toast, setToast] = useState(null)
  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  // Fetch donors via React Query
  const { data: donors = [], isLoading: loading } = useQuery({
    queryKey: ['donors'],
    queryFn: db.getDonors
  })
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDonor, setEditingDonor] = useState(null)
  
  // Form fields
  const [fullName, setFullName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('Male')
  const [bloodGroup, setBloodGroup] = useState('O+')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [lastDonationDate, setLastDonationDate] = useState('')
  const [medicalNotes, setMedicalNotes] = useState('')
  const [campName, setCampName] = useState('')

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')

  const handleOpenAddModal = () => {
    setEditingDonor(null)
    setFullName('')
    setAge('')
    setGender('Male')
    setBloodGroup('O+')
    setPhone('')
    setEmail('')
    setAddress('')
    setCity('')
    setDistrict('')
    setLastDonationDate('')
    setMedicalNotes('')
    setCampName('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (donor) => {
    setEditingDonor(donor)
    setFullName(donor.fullName)
    setAge(donor.age)
    setGender(donor.gender)
    setBloodGroup(donor.bloodGroup)
    setPhone(donor.phone)
    setEmail(donor.email || '')
    setAddress(donor.address || '')
    setCity(donor.city)
    setDistrict(donor.district)
    setLastDonationDate(donor.lastDonationDate || '')
    setMedicalNotes(donor.medicalNotes || '')
    setCampName(donor.campName || '')
    setModalOpen(true)
  }

  // Mutations
  const saveDonorMutation = useMutation({
    mutationFn: async (donorPayload) => {
      if (editingDonor) {
        return await db.updateDonor(editingDonor.id, donorPayload, user)
      } else {
        return await db.createDonor(donorPayload, user)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] })
      showToast('success', editingDonor ? 'Donor profile updated successfully.' : 'Donor profile registered successfully.')
      setModalOpen(false)
    },
    onError: (error) => {
      console.error("Full Supabase Error:", error)
      let displayError = 'Failed to save donor profile.'
      if (error?.message) {
        if (error.message.includes('unique constraint') || error.message.includes('already exists')) {
          displayError = 'Email already exists.'
        } else if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
          displayError = 'Failed to connect to database.'
        } else if (error.message.includes('violates row-level security') || error.code === '42501') {
          displayError = 'Permission denied.'
        } else {
          displayError = error.message
        }
      }
      showToast('error', displayError)
    }
  })

  const deleteDonorMutation = useMutation({
    mutationFn: async (id) => {
      return await db.deleteDonor(id, user)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donors'] })
      showToast('success', 'Donor profile deleted successfully.')
    },
    onError: (error) => {
      console.error("Full Supabase Error:", error)
      showToast('error', error.message || 'Permission denied.')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Choose random profile avatar
    const randomIdx = Math.floor(Math.random() * 4) + 1
    const malePhotos = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=faces'
    ]
    const femalePhotos = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces'
    ]
    const photoUrl = gender === 'Male' ? malePhotos[randomIdx - 1] : femalePhotos[randomIdx - 1]

    const donorPayload = {
      fullName,
      age: Number(age),
      gender,
      bloodGroup,
      phone,
      email,
      address,
      city,
      district,
      lastDonationDate: lastDonationDate || null,
      medicalNotes,
      campName,
      status: 'Active',
      photo: editingDonor?.photo || photoUrl
    }

    saveDonorMutation.mutate(donorPayload)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this donor profile?')) {
      deleteDonorMutation.mutate(id)
    }
  }

  // Filter donor list
  const filteredDonors = donors.filter(d => {
    const matchSearch = d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        d.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchGroup = selectedGroup ? d.bloodGroup === selectedGroup : true
    return matchSearch && matchGroup
  })

  // Permission guards
  const userCanAdd = permissions.canAddDonors()
  const userCanEdit = permissions.canEditDonors()
  const userCanDelete = ['Admin', 'President'].includes(user?.post) // Secretary / Volunteer cannot delete

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider">Donors Management</h2>
          <span className="text-xs text-text-secondary font-light">Add, edit, or delete registered donor files.</span>
        </div>

        {/* Add Donor Trigger */}
        <button
          onClick={handleOpenAddModal}
          disabled={!userCanAdd}
          className={`px-5 py-2.5 bg-primary-red hover:bg-dark-red text-pure-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow transition-all ${
            !userCanAdd ? 'opacity-40 cursor-not-allowed hover:bg-primary-red' : 'cursor-pointer'
          }`}
        >
          <UserPlus size={14} />
          Add New Donor
        </button>
      </div>

      {/* RBAC Notice if restricted */}
      {!userCanEdit && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
          <ShieldAlert size={16} />
          <span>Your current role (<strong>{user?.post}</strong>) only allows viewing and registering new donors. Modification privileges are restricted.</span>
        </div>
      )}

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search donors by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-10 px-3.5 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-all"
        />

        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="h-10 px-3.5 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-all sm:w-44"
        >
          <option value="">All Blood Groups</option>
          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => (
            <option key={grp} value={grp}>{grp}</option>
          ))}
        </select>
      </div>

      {/* Table grid */}
      {loading ? (
        <div className="h-44 flex items-center justify-center text-xs text-text-secondary">Loading database records...</div>
      ) : filteredDonors.length === 0 ? (
        <div className="border border-dashed border-border-color/60 rounded-2xl p-10 text-center bg-bg-secondary/15">
          <Info size={36} className="text-text-secondary mx-auto mb-2.5" />
          <h4 className="font-bold text-sm">No matching donors in database.</h4>
        </div>
      ) : (
        <div className="border border-border-color/30 rounded-xl overflow-hidden bg-bg-primary shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg-secondary/40 border-b border-border-color/30 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                <th className="py-3 px-5">Donor Details</th>
                <th className="py-3 px-5">Blood Group</th>
                <th className="py-3 px-5">Contact</th>
                <th className="py-3 px-5">District/City</th>
                <th className="py-3 px-5">Last Donation</th>
                <th className="py-3 px-5">Eligibility</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color/15 text-xs">
              {filteredDonors.map((donor) => (
                <tr key={donor.id} className="hover:bg-bg-secondary/10 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <img src={donor.photo} alt="" className="w-8 h-8 rounded-full object-cover border" />
                      <div>
                        <h4 className="font-bold text-text-primary">{donor.fullName}</h4>
                        <span className="text-[10px] text-text-secondary font-light">{donor.age} yrs • {donor.gender}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className="inline-flex w-7 h-7 rounded bg-primary-red/10 border border-primary-red/25 items-center justify-center text-primary-red font-bold">
                      {donor.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono font-light text-text-secondary">
                    {donor.phone}
                  </td>
                  <td className="py-3 px-5 font-light text-text-secondary">
                    {donor.district}, {donor.city}
                  </td>
                  <td className="py-3 px-5 font-mono font-light text-text-secondary">
                    {donor.lastDonationDate || 'Never'}
                  </td>
                  <td className="py-3 px-5">
                    {donor.eligible ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold text-green-600 bg-green-500/10 border border-green-500/20">
                        <CheckCircle size={10} /> Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/20">
                        <Clock size={10} /> Cooldown ({donor.daysRemaining}d)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleOpenEditModal(donor)}
                        disabled={!userCanEdit}
                        className={`p-1.5 border rounded hover:text-primary-red hover:border-primary-red transition-all ${
                          !userCanEdit ? 'opacity-35 cursor-not-allowed hover:border-border-color' : ''
                        }`}
                        title="Edit Donor Profile"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(donor.id)}
                        disabled={!userCanDelete}
                        className={`p-1.5 border rounded hover:text-primary-red hover:border-primary-red transition-all ${
                          !userCanDelete ? 'opacity-35 cursor-not-allowed hover:border-border-color' : ''
                        }`}
                        title="Delete Donor Profile"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-xl bg-bg-primary border border-border-color/40 rounded-xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-base font-bold uppercase tracking-wider border-b pb-3">
              {editingDonor ? 'Edit Donor File' : 'Register New Donor'}
            </h3>

            {/* Field: Name, Age, Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyan Sen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Age (Years)</label>
                <input
                  type="number"
                  required
                  min="18"
                  max="65"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Field: Blood Group, Phone, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => (
                    <option key={grp} value={grp}>{grp}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98451 23456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Field: Address, City, District */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">District Area</label>
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
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Full Address</label>
                <input
                  type="text"
                  required
                  placeholder="House/Street info"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Field: Last Donation Date, Registered Camp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Last Donation Date</label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Associated Camp Name</label>
                <input
                  type="text"
                  placeholder="e.g. Noida Metro Donation Camp"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Field: Medical Notes */}
            <div className="space-y-1">
              <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Medical Records/Notes</label>
              <textarea
                rows="3"
                placeholder="Allergies, chronic conditions, hemoglobin history..."
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                className="w-full p-2.5 rounded border border-border-color bg-bg-primary text-xs focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3">
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
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-green-500/10 border-green-500/30 text-green-500' 
                : 'bg-primary-red/10 border-primary-red/30 text-primary-red'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={16} className="text-green-500" /> : <ShieldAlert size={16} />}
            <span className="text-xs font-bold uppercase tracking-wider">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
export default DonorsManagement
