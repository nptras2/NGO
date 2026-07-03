import { memberService } from './memberService'
import { donorService } from './donorService'
import { campService } from './campService'
import { inventoryService } from './inventoryService'
import { requestService } from './requestService'
import { reportService } from './reportService'
import { supabase } from './supabaseClient'

// Helper to determine if we are in local sandbox mode
const isSandbox = (actor) => {
  return !supabase || !actor || actor.id === 'sandbox_id' || String(actor.id).startsWith('sandbox_');
}

// LocalStorage helpers
const getLocalData = (key, defaultVal = []) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultVal
  } catch {
    return defaultVal
  }
}

const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const generateUUID = () => {
  try {
    return crypto.randomUUID()
  } catch {
    return 'local-' + Math.random().toString(36).substring(2, 15)
  }
}

export const db = {
  // DONORS
  getDonors: async () => {
    let sbDonors = []
    if (supabase) {
      try {
        sbDonors = await donorService.getDonors()
      } catch (err) {
        console.warn("Failed to fetch donors from Supabase, using local:", err)
      }
    }
    const localDonors = getLocalData('ngo_local_donors')
    return [...localDonors, ...sbDonors]
  },

  addDonor: async (donor, actor) => {
    if (isSandbox(actor)) {
      const newId = generateUUID()
      const DAYS_REQUIRED = 90
      const eligibleAfter = donor.lastDonationDate 
        ? new Date(new Date(donor.lastDonationDate).getTime() + (DAYS_REQUIRED * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        : null
      
      const newDonor = {
        id: newId,
        fullName: donor.fullName,
        fatherName: donor.fatherName || '',
        gender: donor.gender,
        dateOfBirth: donor.dateOfBirth || '',
        age: Number(donor.age),
        bloodGroup: donor.bloodGroup,
        phone: donor.phone,
        email: donor.email || '',
        address: donor.address || '',
        district: donor.district,
        city: donor.city,
        pincode: donor.pincode || '',
        lastDonationDate: donor.lastDonationDate || null,
        eligibleAfterDate: eligibleAfter,
        availabilityStatus: (donor.status === 'Inactive' || (donor.lastDonationDate && (new Date(eligibleAfter) > new Date()))) ? 'not_available' : 'available',
        medicalNotes: donor.medicalNotes || '',
        photo: donor.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        status: donor.status || 'Active',
        createdBy: actor?.id || 'sandbox_id'
      }

      const currentList = getLocalData('ngo_local_donors')
      setLocalData('ngo_local_donors', [newDonor, ...currentList])
      await db.addAuditLog(actor, 'Added Donor', `Added donor ${donor.fullName} (Local Sandbox)`, 'donor', newId)
      return newDonor
    }

    const res = await donorService.addDonor(donor, actor?.id)
    await db.addAuditLog(actor, 'Added Donor', `Added donor ${donor.fullName} (${donor.bloodGroup})`, 'donor', res.id)
    return res
  },

  createDonor: async (donor, actor) => {
    return await db.addDonor(donor, actor)
  },

  updateDonor: async (id, donor, actor) => {
    if (isSandbox(actor) || String(id).startsWith('local-')) {
      const currentList = getLocalData('ngo_local_donors')
      const updated = currentList.map(d => {
        if (d.id === id) {
          const eligibleAfter = donor.lastDonationDate 
            ? new Date(new Date(donor.lastDonationDate).getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
            : null
          return {
            ...d,
            ...donor,
            eligibleAfterDate: eligibleAfter,
            availabilityStatus: (donor.status === 'Inactive' || (donor.lastDonationDate && (new Date(eligibleAfter) > new Date()))) ? 'not_available' : 'available',
          }
        }
        return d
      })
      setLocalData('ngo_local_donors', updated)
      await db.addAuditLog(actor, 'Updated Donor', `Updated details for ${donor.fullName} (Local Sandbox)`, 'donor', id)
      return updated.find(d => d.id === id)
    }

    const res = await donorService.updateDonor(id, donor)
    await db.addAuditLog(actor, 'Updated Donor', `Updated details for ${donor.fullName}`, 'donor', id)
    return res
  },

  deleteDonor: async (id, actor) => {
    if (isSandbox(actor) || String(id).startsWith('local-')) {
      const currentList = getLocalData('ngo_local_donors')
      const filtered = currentList.filter(d => d.id !== id)
      setLocalData('ngo_local_donors', filtered)
      await db.addAuditLog(actor, 'Deleted Donor', `Deleted donor (Local Sandbox)`, 'donor', id)
      return true
    }

    const res = await donorService.deleteDonor(id)
    await db.addAuditLog(actor, 'Deleted Donor', `Deleted donor with ID ${id}`, 'donor', id)
    return res
  },

  // DONATIONS HISTORY
  getDonations: async () => {
    let sbDonations = []
    if (supabase) {
      try {
        sbDonations = await reportService.getDonations()
      } catch (err) {
        console.warn("Failed to fetch donations from Supabase, using local:", err)
      }
    }
    const localDonations = getLocalData('ngo_local_donations')
    return [...localDonations, ...sbDonations]
  },

  addDonation: async (donation, actor) => {
    if (isSandbox(actor)) {
      const newId = generateUUID()
      const newDonation = {
        id: newId,
        donorId: donation.donorId,
        donorName: donation.donorName || 'Local Donor',
        donationDate: donation.donationDate,
        bloodGroup: donation.bloodGroup,
        bloodUnits: Number(donation.bloodUnits || 1),
        campName: donation.campName || 'Direct Donation',
        verifiedBy: actor?.fullName || 'Sandbox Operator'
      }

      const currentList = getLocalData('ngo_local_donations')
      setLocalData('ngo_local_donations', [newDonation, ...currentList])

      // Adjust local inventory
      await db.adjustInventory(donation.bloodGroup, Number(donation.bloodUnits || 1), 'add', actor)

      // Add Audit Log
      await db.addAuditLog(actor, 'Logged Donation', `Logged ${donation.bloodUnits} units of ${donation.bloodGroup} (Local Sandbox)`)
      return newDonation
    }

    return await reportService.addDonation(donation, actor?.id, actor?.fullName, actor?.post)
  },

  // CAMPS
  getCamps: async () => {
    let sbCamps = []
    if (supabase) {
      try {
        sbCamps = await campService.getCamps()
      } catch (err) {
        console.warn("Failed to fetch camps from Supabase, using local:", err)
      }
    }
    const localCamps = getLocalData('ngo_local_camps')
    return [...localCamps, ...sbCamps]
  },

  addCamp: async (camp, actor) => {
    if (isSandbox(actor)) {
      const newId = generateUUID()
      const newCamp = {
        id: newId,
        campName: camp.campName,
        organizer: camp.organizer,
        venue: camp.venue,
        district: camp.district,
        city: camp.city,
        date: camp.date,
        description: camp.description || '',
        totalDonors: Number(camp.totalDonors || 0),
        unitsCollected: Number(camp.unitsCollected || 0),
        photo: camp.photo || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
        status: camp.status || 'Upcoming'
      }

      const currentList = getLocalData('ngo_local_camps')
      setLocalData('ngo_local_camps', [newCamp, ...currentList])
      await db.addAuditLog(actor, 'Created Camp', `Created Camp: ${camp.campName} (Local Sandbox)`, 'camp', newId)
      return newCamp
    }

    const res = await campService.addCamp(camp)
    await db.addAuditLog(actor, 'Created Camp', `Created Camp: ${camp.campName}`, 'camp', res.id)
    return res
  },

  createCamp: async (camp, actor) => {
    return await db.addCamp(camp, actor)
  },

  updateCamp: async (id, camp, actor) => {
    if (isSandbox(actor) || String(id).startsWith('local-')) {
      const currentList = getLocalData('ngo_local_camps')
      const updated = currentList.map(c => {
        if (c.id === id) {
          return { ...c, ...camp }
        }
        return c
      })
      setLocalData('ngo_local_camps', updated)
      await db.addAuditLog(actor, 'Updated Camp', `Updated Camp: ${camp.campName} (Local Sandbox)`, 'camp', id)
      return updated.find(c => c.id === id)
    }

    const res = await campService.updateCamp(id, camp)
    await db.addAuditLog(actor, 'Updated Camp', `Updated Camp: ${camp.campName}`, 'camp', id)
    return res
  },

  deleteCamp: async (id, actor) => {
    if (isSandbox(actor) || String(id).startsWith('local-')) {
      const currentList = getLocalData('ngo_local_camps')
      const filtered = currentList.filter(c => c.id !== id)
      setLocalData('ngo_local_camps', filtered)
      await db.addAuditLog(actor, 'Deleted Camp', `Deleted Camp (Local Sandbox)`, 'camp', id)
      return true
    }

    const res = await campService.deleteCamp(id)
    await db.addAuditLog(actor, 'Deleted Camp', `Deleted Camp with ID ${id}`, 'camp', id)
    return res
  },

  // EMERGENCY REQUESTS
  getRequests: async () => {
    let sbRequests = []
    if (supabase) {
      try {
        sbRequests = await requestService.getRequests()
      } catch (err) {
        console.warn("Failed to fetch requests, using local:", err)
      }
    }
    const localRequests = getLocalData('ngo_local_requests')
    return [...localRequests, ...sbRequests]
  },

  addRequest: async (request) => {
    if (!supabase) {
      const newId = generateUUID()
      const newRequest = {
        id: newId,
        patient_name: request.patientName,
        hospital_name: request.hospitalName,
        blood_group: request.bloodGroup,
        units_required: Number(request.unitsRequired),
        urgency: request.urgency,
        phone: request.phone,
        district: request.district,
        city: request.city,
        required_date: request.requiredDate,
        status: 'Pending',
        created_at: new Date().toISOString()
      }
      const currentList = getLocalData('ngo_local_requests')
      setLocalData('ngo_local_requests', [newRequest, ...currentList])
      return newRequest
    }

    return await requestService.addRequest(request)
  },

  updateRequestStatus: async (id, status, actor) => {
    if (isSandbox(actor) || String(id).startsWith('local-')) {
      const currentList = getLocalData('ngo_local_requests')
      const updated = currentList.map(r => {
        if (r.id === id) {
          return { ...r, status }
        }
        return r
      })
      setLocalData('ngo_local_requests', updated)
      const matched = updated.find(r => r.id === id)
      await db.addAuditLog(actor, 'Updated Request Status', `Set Request for ${matched?.patient_name || id} to ${status} (Local Sandbox)`, 'request', id)
      return matched
    }

    const res = await requestService.updateRequestStatus(id, status)
    await db.addAuditLog(actor, 'Updated Request Status', `Set Request for ${res.patient_name || id} to ${status}`, 'request', id)
    return res
  },

  // MEMBERS
  getMembers: async () => {
    let sbMembers = []
    if (supabase) {
      try {
        sbMembers = await memberService.getMembers()
      } catch (err) {
        console.warn("Failed to fetch members from Supabase, using local fallback:", err)
      }
    }
    const localMembers = getLocalData('ngo_local_members')
    return [...localMembers, ...sbMembers]
  },

  addMember: async (member, actor) => {
    if (isSandbox(actor)) {
      const newId = generateUUID()
      const newMember = {
        id: newId,
        fullName: member.fullName,
        post: member.post,
        bloodGroup: member.bloodGroup,
        yearsOfService: Number(member.yearsOfService || 0),
        status: member.status || 'Active',
        email: member.email || '',
        photo: member.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      }

      const currentList = getLocalData('ngo_local_members')
      setLocalData('ngo_local_members', [newMember, ...currentList])
      await db.addAuditLog(actor, 'Added Member', `Added Staff Member ${member.fullName} as ${member.post} (Local Sandbox)`, 'member', newId)
      return newMember
    }

    const res = await memberService.addMember(member)
    await db.addAuditLog(actor, 'Added Member', `Added Staff Member ${member.fullName} as ${member.post}`, 'member', res.id)
    return res
  },

  createMember: async (member, actor) => {
    return await db.addMember(member, actor)
  },

  updateMember: async (id, member, actor) => {
    if (isSandbox(actor) || String(id).startsWith('local-')) {
      const currentList = getLocalData('ngo_local_members')
      const updated = currentList.map(m => {
        if (m.id === id) {
          return { ...m, ...member }
        }
        return m
      })
      setLocalData('ngo_local_members', updated)
      await db.addAuditLog(actor, 'Updated Member', `Updated details for Staff ${member.fullName} (Local Sandbox)`, 'member', id)
      return updated.find(m => m.id === id)
    }

    const res = await memberService.updateMember(id, member)
    await db.addAuditLog(actor, 'Updated Member', `Updated details for Staff ${member.fullName}`, 'member', id)
    return res
  },

  deleteMember: async (id, actor) => {
    if (isSandbox(actor) || String(id).startsWith('local-')) {
      const currentList = getLocalData('ngo_local_members')
      const filtered = currentList.filter(m => m.id !== id)
      setLocalData('ngo_local_members', filtered)
      await db.addAuditLog(actor, 'Deleted Member', `Removed Staff Member (Local Sandbox)`, 'member', id)
      return true
    }

    const res = await memberService.deleteMember(id)
    await db.addAuditLog(actor, 'Deleted Member', `Removed Staff Member with ID ${id}`, 'member', id)
    return res
  },

  // BLOOD INVENTORY
  getInventory: async () => {
    let sbInventory = []
    if (supabase) {
      try {
        sbInventory = await inventoryService.getInventory()
      } catch (err) {
        console.warn("Failed to fetch inventory, using local:", err)
      }
    }
    // Merge or fallback
    if (sbInventory.length > 0) return sbInventory
    return getLocalData('ngo_local_inventory', [
      { bloodGroup: 'A+', availableUnits: 24, minimumRequiredUnits: 8 },
      { bloodGroup: 'A-', availableUnits: 5, minimumRequiredUnits: 8 },
      { bloodGroup: 'B+', availableUnits: 32, minimumRequiredUnits: 8 },
      { bloodGroup: 'B-', availableUnits: 4, minimumRequiredUnits: 8 },
      { bloodGroup: 'AB+', availableUnits: 12, minimumRequiredUnits: 8 },
      { bloodGroup: 'AB-', availableUnits: 2, minimumRequiredUnits: 8 },
      { bloodGroup: 'O+', availableUnits: 45, minimumRequiredUnits: 8 },
      { bloodGroup: 'O-', availableUnits: 3, minimumRequiredUnits: 8 }
    ])
  },

  adjustInventory: async (bloodGroup, units, action, actor) => {
    if (isSandbox(actor)) {
      const currentInv = await db.getInventory()
      const updated = currentInv.map(item => {
        if (item.bloodGroup === bloodGroup) {
          const cur = Number(item.availableUnits)
          const diff = Number(units)
          const nextVal = action === 'add' ? cur + diff : Math.max(0, cur - diff)
          return { ...item, availableUnits: nextVal }
        }
        return item
      })
      setLocalData('ngo_local_inventory', updated)
      await db.addAuditLog(actor, 'Adjusted Inventory', `Adjusted ${bloodGroup} units (${action === 'add' ? '+' : '-'}${units}) (Local Sandbox)`, 'inventory')
      return updated.find(item => item.bloodGroup === bloodGroup)
    }

    const res = await inventoryService.adjustInventory(bloodGroup, units, action)
    await db.addAuditLog(actor, 'Adjusted Inventory', `Adjusted ${bloodGroup} units (${action === 'add' ? '+' : '-'}${units})`, 'inventory')
    return res
  },

  // AUDIT LOGS
  getAuditLogs: async () => {
    let sbLogs = []
    if (supabase) {
      try {
        sbLogs = await reportService.getAuditLogs()
      } catch (err) {
        console.warn("Failed to fetch audit logs, using local:", err)
      }
    }
    const localLogs = getLocalData('ngo_local_audit_logs')
    return [...localLogs, ...sbLogs]
  },

  addAuditLog: async (actor, action, description, entityType = 'general', entityId = null) => {
    const actorId = actor?.id || 'sandbox_id'
    const actorName = actor?.fullName || 'Sandbox Operator'
    const actorRole = actor?.post || 'Coordinator'

    if (isSandbox(actor)) {
      const newLog = {
        id: generateUUID(),
        actor: actorName,
        role: actorRole,
        action,
        details: description,
        timestamp: new Date().toISOString()
      }
      const currentLogs = getLocalData('ngo_local_audit_logs')
      setLocalData('ngo_local_audit_logs', [newLog, ...currentLogs])
      return
    }

    await reportService.addAuditLog(actorId, action, description, entityType, entityId)
  },

  exportBackup: async () => {
    if (supabase) {
      try {
        await reportService.exportBackup()
        return
      } catch (err) {
        console.warn("Supabase backup failed, falling back to local file export:", err)
      }
    }

    const backupData = {
      exportedAt: new Date().toISOString(),
      donors: getLocalData('ngo_local_donors'),
      camps: getLocalData('ngo_local_camps'),
      donations: getLocalData('ngo_local_donations'),
      requests: getLocalData('ngo_local_requests'),
      members: getLocalData('ngo_local_members'),
      inventory: await db.getInventory(),
      logs: getLocalData('ngo_local_audit_logs')
    }

    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `blood_bank_local_sandbox_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
};
