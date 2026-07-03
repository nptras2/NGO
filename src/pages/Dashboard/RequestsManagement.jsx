import React, { useEffect, useState } from 'react'
import { db } from '../../services/db'
import { useAuth } from '../../context/AuthContext'
import { Check, X, ShieldAlert, Phone, Send, Info, Hospital, AlertCircle, AlertOctagon, HelpCircle } from 'lucide-react'

export const RequestsManagement = () => {
  const { user, permissions } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    const data = await db.getRequests()
    setRequests(data)
    setLoading(false)
  }

  const handleStatusChange = async (id, newStatus) => {
    const confirmation = window.confirm(`Are you sure you want to set this request to ${newStatus}?`)
    if (!confirmation) return

    try {
      await db.updateRequestStatus(id, newStatus, user)
      fetchRequests()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error updating status')
    }
  }

  const userCanTriage = permissions.canProcessRequests()

  const getUrgencyIcon = (urg) => {
    switch (urg) {
      case 'Critical': return <AlertOctagon size={14} className="text-primary-red animate-pulse" />
      case 'Urgent': return <AlertCircle size={14} className="text-amber-600" />
      default: return <HelpCircle size={14} className="text-text-secondary" />
    }
  }

  const getUrgencyClass = (urg) => {
    switch (urg) {
      case 'Critical': return 'text-primary-red bg-primary-red/10 border-primary-red/20 font-black'
      case 'Urgent': return 'text-amber-600 bg-amber-500/10 border-amber-500/20 font-bold'
      default: return 'text-text-secondary bg-bg-secondary border-border-color/30 font-medium'
    }
  }

  const getStatusClass = (stat) => {
    switch (stat) {
      case 'Approved': return 'text-green-600 bg-green-500/10 border-green-500/20'
      case 'Rejected': return 'text-primary-red bg-primary-red/10 border-primary-red/20'
      default: return 'text-amber-600 bg-amber-500/10 border-amber-500/20'
    }
  }

  return (
    <div className="space-y-6 select-none">
      
      {/* Header bar */}
      <div className="border-b pb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider">Emergency Requests Triage Queue</h2>
        <span className="text-xs text-text-secondary font-light">Monitor hospital filings, review urgency levels, approve matches and auto-deduct blood counts.</span>
      </div>

      {/* RBAC restricts edit */}
      {!userCanTriage && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-xl p-3.5 text-xs flex items-center gap-2.5">
          <ShieldAlert size={16} />
          <span>Your current role (<strong>{user?.post}</strong>) is restricted from approving or rejecting emergency blood requests. Contact NGO Secretary or Admin.</span>
        </div>
      )}

      {/* Roster table */}
      {loading ? (
        <div className="text-xs text-text-secondary text-center py-10">Fetching incoming filings...</div>
      ) : requests.length === 0 ? (
        <div className="border border-dashed border-border-color/60 rounded-2xl p-10 text-center bg-bg-secondary/15">
          <Info size={36} className="text-text-secondary mx-auto mb-2.5" />
          <h4 className="font-bold text-sm">No requests filed.</h4>
        </div>
      ) : (
        <div className="border border-border-color/30 rounded-xl overflow-hidden bg-bg-primary shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-bg-secondary/40 border-b border-border-color/30 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                <th className="py-3 px-5">Patient Name</th>
                <th className="py-3 px-5">Required Group</th>
                <th className="py-3 px-5">Units Needed</th>
                <th className="py-3 px-5">Urgency</th>
                <th className="py-3 px-5">Hospital Venue</th>
                <th className="py-3 px-5">Target Date</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color/15 text-xs">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-bg-secondary/10 transition-colors">
                  <td className="py-3 px-5">
                    <div>
                      <h4 className="font-bold text-text-primary">{req.patientName}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-text-secondary mt-0.5">
                        <Phone size={10} />
                        <a href={`tel:${req.phone}`} className="hover:underline">{req.phone}</a>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className="inline-flex w-7 h-7 rounded bg-primary-red/10 border border-primary-red/25 items-center justify-center text-primary-red font-bold">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-bold font-mono">
                    {req.unitsRequired} Pints
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] border ${getUrgencyClass(req.urgency)}`}>
                      {getUrgencyIcon(req.urgency)}
                      {req.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-text-secondary max-w-[200px] truncate">
                    <div className="flex items-center gap-1 font-light">
                      <Hospital size={11} className="text-primary-red shrink-0" />
                      <span className="truncate" title={req.hospitalName}>{req.hospitalName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-mono text-text-secondary font-light">
                    {req.requiredDate}
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusClass(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            disabled={!userCanTriage}
                            onClick={() => handleStatusChange(req.id, 'Approved')}
                            className={`p-1.5 border border-green-200 bg-green-500/10 text-green-600 rounded hover:bg-green-600 hover:text-pure-white hover:border-transparent transition-all ${
                              !userCanTriage ? 'opacity-35 cursor-not-allowed hover:bg-green-500/10 hover:text-green-600' : ''
                            }`}
                            title="Approve & Deduct Stock"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            disabled={!userCanTriage}
                            onClick={() => handleStatusChange(req.id, 'Rejected')}
                            className={`p-1.5 border border-red-200 bg-red-500/10 text-primary-red rounded hover:bg-primary-red hover:text-pure-white hover:border-transparent transition-all ${
                              !userCanTriage ? 'opacity-35 cursor-not-allowed hover:bg-red-500/10 hover:text-primary-red' : ''
                            }`}
                            title="Reject Request"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-text-secondary font-light italic">Triage completed</span>
                      )}
                      
                      {/* WhatsApp helper for dispatching details */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `🚨 *BLOOD DISPATCH INSTRUCTIONS* 🚨\n\n` +
                          `• Patient: ${req.patientName}\n` +
                          `• Required Group: ${req.bloodGroup}\n` +
                          `• Location: ${req.hospitalName}\n` +
                          `• Contact: ${req.phone}\n` +
                          `• Status: Approved/Awaiting Dispatch`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 border rounded hover:text-green-600 hover:border-green-600 transition-colors"
                        title="Broadcast Dispatch Details on WhatsApp"
                      >
                        <Send size={12} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}
export default RequestsManagement
