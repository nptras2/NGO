import React, { useEffect, useState } from 'react'
import { db } from '../../services/db'
import { useAuth } from '../../context/AuthContext'
import { Plus, Edit2, Trash2, ShieldAlert, Award, Calendar, CheckCircle2, Info } from 'lucide-react'

export const MembersManagement = () => {
  const { user, permissions } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  
  // Form fields
  const [fullName, setFullName] = useState('')
  const [post, setPost] = useState('Volunteer')
  const [bloodGroup, setBloodGroup] = useState('O+')
  const [yearsOfService, setYearsOfService] = useState(0)
  const [status, setStatus] = useState('Active')
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    setLoading(true)
    const data = await db.getMembers()
    setMembers(data)
    setLoading(false)
  }

  const handleOpenAddModal = () => {
    setEditingMember(null)
    setFullName('')
    setPost('Volunteer')
    setBloodGroup('O+')
    setYearsOfService(0)
    setStatus('Active')
    setEmail('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (mem) => {
    setEditingMember(mem)
    setFullName(mem.fullName)
    setPost(mem.post)
    setBloodGroup(mem.bloodGroup)
    setYearsOfService(mem.yearsOfService || 0)
    setStatus(mem.status)
    setEmail(mem.email)
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const defaultPhoto = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces'
    const memberPayload = {
      fullName,
      post,
      bloodGroup,
      yearsOfService: Number(yearsOfService),
      status,
      email,
      photo: editingMember?.photo || defaultPhoto
    }

    try {
      if (editingMember) {
        await db.updateMember(editingMember.id, memberPayload, user)
      } else {
        await db.addMember(memberPayload, user)
      }
      setModalOpen(false)
      fetchMembers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await db.deleteMember(id, user)
        fetchMembers()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const userCanManage = permissions.canManageMembers()

  return (
    <div className="space-y-6 select-none">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider">NGO Team Members Management</h2>
          <span className="text-xs text-text-secondary font-light">Add volunteers, modify role designations, and configure status settings.</span>
        </div>

        <button
          onClick={handleOpenAddModal}
          disabled={!userCanManage}
          className={`px-5 py-2.5 bg-primary-red hover:bg-dark-red text-pure-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 shadow transition-all ${
            !userCanManage ? 'opacity-40 cursor-not-allowed hover:bg-primary-red' : 'cursor-pointer'
          }`}
        >
          <Plus size={14} />
          Register New Member
        </button>
      </div>

      {/* RBAC restriction banner */}
      {!userCanManage && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
          <ShieldAlert size={16} />
          <span>Your current role (<strong>{user?.post}</strong>) is restricted from updating administrative roster profiles. Contact NGO President for overrides.</span>
        </div>
      )}

      {/* Roster Table Grid */}
      {loading ? (
        <div className="text-xs text-text-secondary text-center py-10">Fetching roster database...</div>
      ) : (
        <div className="border border-border-color/30 rounded-xl overflow-hidden bg-bg-primary shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-bg-secondary/40 border-b border-border-color/30 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                <th className="py-3 px-5">Member Name</th>
                <th className="py-3 px-5">Designation Post</th>
                <th className="py-3 px-5">Blood Group</th>
                <th className="py-3 px-5">Email Address</th>
                <th className="py-3 px-5">Service Record</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color/15 text-xs">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-bg-secondary/10 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <img src={member.photo} alt="" className="w-8 h-8 rounded-full object-cover border" />
                      <h4 className="font-bold text-text-primary">{member.fullName}</h4>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-semibold text-primary-red uppercase tracking-wider">
                    {member.post}
                  </td>
                  <td className="py-3 px-5">
                    <span className="inline-flex w-7 h-7 rounded bg-bg-secondary border items-center justify-center font-bold text-[10px]">
                      {member.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono text-text-secondary font-light select-all">
                    {member.email}
                  </td>
                  <td className="py-3 px-5 font-light text-text-secondary">
                    {member.yearsOfService} Years
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      member.status === 'Active'
                        ? 'text-green-600 bg-green-500/10 border-green-500/20'
                        : 'text-text-secondary bg-bg-secondary border-border-color/30'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => handleOpenEditModal(member)}
                        disabled={!userCanManage}
                        className={`p-1.5 border rounded hover:text-primary-red hover:border-primary-red transition-all ${
                          !userCanManage ? 'opacity-35 cursor-not-allowed hover:border-border-color' : ''
                        }`}
                        title="Edit Member"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        disabled={!userCanManage}
                        className={`p-1.5 border rounded hover:text-primary-red hover:border-primary-red transition-all ${
                          !userCanManage ? 'opacity-35 cursor-not-allowed hover:border-border-color' : ''
                        }`}
                        title="Delete Member"
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

      {/* CRUD Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-sm bg-bg-primary border border-border-color/40 rounded-xl p-5 shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider border-b pb-2">
              {editingMember ? 'Modify Cabinet Member' : 'Register Cabinet Member'}
            </h3>

            {/* Member Name */}
            <div className="space-y-1">
              <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Suhasini Sen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Cabinet Email</label>
              <input
                type="email"
                required
                placeholder="name@lifesaver.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
              />
            </div>

            {/* Designation Post, Blood Group */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Designation Post</label>
                <select
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                >
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Data Entry Operator">Data Entry Operator</option>
                  <option value="Volunteer">Volunteer</option>
                </select>
              </div>
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
            </div>

            {/* Years of Service, Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Years of Service</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={yearsOfService}
                  onChange={(e) => setYearsOfService(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">Active Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-9 px-3 rounded border border-border-color bg-bg-primary text-xs focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

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
                Save Cabinet Member
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}
export default MembersManagement
