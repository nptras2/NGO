import React, { useEffect, useState } from 'react'
import { db } from '../services/db'
import { TableSkeleton } from '../components/SkeletonLoader'
import { Search, Eye, Phone, MapPin, Grid, List, ChevronLeft, ChevronRight, UserCheck, Calendar, Info, Clock, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const DonorDirectory = () => {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('card') // 'card' or 'table'
  
  // Search and Pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Details drawer modal
  const [selectedDonor, setSelectedDonor] = useState(null)

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

  // Filter donor list
  const filteredDonors = donors.filter(d => {
    const matchSearch = d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        d.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        d.district.toLowerCase().includes(searchTerm.toLowerCase())
    const matchGroup = selectedGroup ? d.bloodGroup === selectedGroup : true
    return matchSearch && matchGroup
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage)
  const paginatedDonors = filteredDonors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    setCurrentPage(1) // Reset page on filter change
  }, [searchTerm, selectedGroup])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Title */}
      <div className="border-b pb-8 mb-8">
        <h1 className="text-3xl font-extrabold tracking-wide uppercase flex items-center gap-2">
          <UserCheck size={28} className="text-primary-red" />
          Donor Directory Network
        </h1>
        <p className="text-text-secondary text-sm font-light mt-2 max-w-xl">
          Search the complete network of registered medical donors. Toggle between table and grid structures for analytical reviews.
        </p>
      </div>

      {/* Control panel: search, blood filters, grid/list toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-bg-secondary/30 p-4 border rounded-xl mb-8">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-text-secondary" size={16} />
            <input
              type="text"
              placeholder="Search by name, city, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-all"
            />
          </div>

          {/* Group Filter */}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border-color bg-bg-primary text-sm focus:outline-none focus:border-primary-red transition-all shrink-0 sm:w-44"
          >
            <option value="">All Blood Groups</option>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => (
              <option key={grp} value={grp}>{grp}</option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 border-l pl-0 md:pl-4 border-border-color/30">
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-lg transition-all border ${
              viewMode === 'card' 
                ? 'bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal border-transparent' 
                : 'border-border-color text-text-secondary hover:bg-bg-secondary'
            }`}
            title="Card Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all border ${
              viewMode === 'table' 
                ? 'bg-charcoal dark:bg-pure-white text-pure-white dark:text-charcoal border-transparent' 
                : 'border-border-color text-text-secondary hover:bg-bg-secondary'
            }`}
            title="Table Rows view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Main Donor List */}
      {loading ? (
        <TableSkeleton rows={itemsPerPage} />
      ) : filteredDonors.length === 0 ? (
        <div className="border border-dashed border-border-color/60 rounded-2xl p-12 text-center bg-bg-secondary/10">
          <Info size={48} className="text-text-secondary mx-auto mb-4 stroke-[1.2]" />
          <h4 className="font-bold text-lg mb-1">No Donors Found</h4>
          <p className="text-text-secondary text-sm font-light max-w-sm mx-auto">
            We couldn't find any donors matching your criteria. Try adjusting your search query.
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'card' ? (
            /* 1. Card Grid Layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedDonors.map((donor) => (
                <div 
                  key={donor.id}
                  className="border border-border-color/20 rounded-xl p-5 bg-bg-primary shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4 items-start">
                    <img 
                      src={donor.photo} 
                      alt={donor.fullName}
                      className="w-12 h-12 rounded-full object-cover border shadow-sm shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base leading-tight truncate">{donor.fullName}</h4>
                      <p className="text-xs text-text-secondary font-light mt-0.5">{donor.age} yrs • {donor.gender}</p>
                      <p className="text-[11px] text-text-secondary mt-1.5 flex items-center gap-1 font-light">
                        <MapPin size={11} className="text-primary-red shrink-0" />
                        {donor.district}, {donor.city}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary-red/10 border border-primary-red/20 rounded-xl flex items-center justify-center text-primary-red font-black text-sm shrink-0">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t pt-3">
                    {donor.eligible ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">
                        <CheckCircle size={12} />
                        Eligible
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <Clock size={12} />
                        Cooldown ({donor.daysRemaining}d)
                      </span>
                    )}
                    
                    <button
                      onClick={() => setSelectedDonor(donor)}
                      className="text-xs text-primary-red font-bold hover:underline flex items-center gap-1 uppercase tracking-wider"
                    >
                      <Eye size={12} />
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 2. Table Row Layout */
            <div className="border border-border-color/30 rounded-xl overflow-hidden shadow-sm bg-bg-primary overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-bg-secondary/40 border-b border-border-color/30 text-xs font-bold uppercase tracking-wider text-text-secondary">
                    <th className="py-4 px-6">Donor Details</th>
                    <th className="py-4 px-6">Blood Group</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Last Donation</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/20 text-sm">
                  {paginatedDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-bg-secondary/10 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={donor.photo} 
                            alt={donor.fullName}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div>
                            <h4 className="font-bold text-text-primary">{donor.fullName}</h4>
                            <span className="text-xs text-text-secondary font-light">{donor.age} yrs • {donor.gender}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex w-8 h-8 rounded-lg bg-primary-red/10 border border-primary-red/25 items-center justify-center text-primary-red font-bold text-xs">
                          {donor.bloodGroup}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-light text-text-secondary text-xs">
                        {donor.district}, {donor.city}
                      </td>
                      <td className="py-4 px-6 font-mono text-xs">
                        {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-4 px-6">
                        {donor.eligible ? (
                          <span className="text-[11px] font-bold text-green-600 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                            Eligible
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            Cooldown ({donor.daysRemaining}d)
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedDonor(donor)}
                            className="p-1.5 border hover:border-primary-red hover:text-primary-red rounded transition-colors text-text-secondary"
                            title="Inspect Profile"
                          >
                            <Eye size={14} />
                          </button>
                          <a
                            href={`tel:${donor.phone}`}
                            className="p-1.5 border hover:border-green-600 hover:text-green-600 rounded transition-colors text-text-secondary"
                            title="Call Donor"
                          >
                            <Phone size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controllers */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border-color/30 pt-6 mt-8">
              <span className="text-xs text-text-secondary font-light">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDonors.length)} of {filteredDonors.length} donors
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-lg hover:bg-bg-secondary transition-all disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-semibold">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-lg hover:bg-bg-secondary transition-all disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Inspector Details Drawer Modal */}
      <AnimatePresence>
        {selectedDonor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDonor(null)}
              className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative w-full max-w-md bg-bg-primary border border-border-color/40 rounded-2xl p-6 shadow-2xl z-10"
            >
              <div className="flex flex-col items-center text-center space-y-4 pt-4">
                {/* Photo */}
                <div className="relative">
                  <img 
                    src={selectedDonor.photo} 
                    alt={selectedDonor.fullName}
                    className="w-24 h-24 rounded-full object-cover border-[3px] border-primary-red/20 shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-primary-red border-2 border-pure-white dark:border-charcoal rounded-full flex items-center justify-center text-pure-white font-black text-sm shadow">
                    {selectedDonor.bloodGroup}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold">{selectedDonor.fullName}</h3>
                  <p className="text-xs text-text-secondary font-light">
                    {selectedDonor.gender} • {selectedDonor.age} Years Old
                  </p>
                </div>

                {/* Eligibility status */}
                <div className="w-full flex items-center justify-center pt-2">
                  {selectedDonor.eligible ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                      <CheckCircle size={14} />
                      Eligible & Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                      <Clock size={14} />
                      Cooldown Cooldown ({selectedDonor.daysRemaining} days remaining)
                    </span>
                  )}
                </div>

                {/* Contact grid */}
                <div className="w-full border-t border-b border-border-color/20 py-4 grid grid-cols-2 gap-4 text-xs font-light text-text-secondary text-left">
                  <div>
                    <span className="block font-bold text-[10px] uppercase tracking-wider text-text-secondary">Address</span>
                    <span className="text-text-primary mt-0.5 block">{selectedDonor.address}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-[10px] uppercase tracking-wider text-text-secondary">City / Dist</span>
                    <span className="text-text-primary mt-0.5 block">{selectedDonor.district}, {selectedDonor.city}</span>
                  </div>
                  <div>
                    <span className="block font-bold text-[10px] uppercase tracking-wider text-text-secondary">Last Donation</span>
                    <span className="text-text-primary mt-0.5 block font-mono">
                      {selectedDonor.lastDonationDate ? new Date(selectedDonor.lastDonationDate).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div>
                    <span className="block font-bold text-[10px] uppercase tracking-wider text-text-secondary">Past Camp</span>
                    <span className="text-text-primary mt-0.5 block truncate">{selectedDonor.campName || 'N/A'}</span>
                  </div>
                </div>

                {/* Medical Notes */}
                {selectedDonor.medicalNotes && (
                  <div className="w-full bg-bg-secondary/30 p-3.5 rounded-lg border text-left text-xs font-light space-y-1">
                    <span className="block font-bold text-[9px] uppercase tracking-widest text-text-secondary">Medical Notes</span>
                    <p className="text-text-primary">{selectedDonor.medicalNotes}</p>
                  </div>
                )}

                {/* Main Action buttons */}
                <div className="w-full flex gap-3 pt-2">
                  <a
                    href={`tel:${selectedDonor.phone}`}
                    className="flex-1 py-2.5 bg-primary-red hover:bg-dark-red text-pure-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow"
                  >
                    <Phone size={14} />
                    Call Contact
                  </a>
                  <button
                    onClick={() => setSelectedDonor(null)}
                    className="flex-1 py-2.5 border border-border-color hover:bg-bg-secondary text-text-primary text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
export default DonorDirectory
