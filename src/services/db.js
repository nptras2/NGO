import { donorService, checkEligibility } from './donorService'
import { campService } from './campService'
import { inventoryService } from './inventoryService'
import { requestService } from './requestService'
import { memberService } from './memberService'
import { reportService } from './reportService'

export { checkEligibility };

export const db = {
  // DONORS
  getDonors: donorService.getDonors,
  addDonor: async (donor, actor) => {
    const res = await donorService.addDonor(donor, actor?.id)
    await reportService.addAuditLog(actor?.id, 'Added Donor', `Added donor ${donor.fullName} (${donor.bloodGroup})`, 'donor', res.id)
    return res
  },
  createDonor: async (donor, actor) => {
    return await db.addDonor(donor, actor)
  },
  updateDonor: async (id, donor, actor) => {
    const res = await donorService.updateDonor(id, donor)
    await reportService.addAuditLog(actor?.id, 'Updated Donor', `Updated details for ${donor.fullName}`, 'donor', id)
    return res
  },
  deleteDonor: async (id, actor) => {
    const res = await donorService.deleteDonor(id)
    await reportService.addAuditLog(actor?.id, 'Deleted Donor', `Deleted donor with ID ${id}`, 'donor', id)
    return res
  },

  // DONATIONS HISTORY
  getDonations: reportService.getDonations,
  addDonation: async (donation, actor) => {
    return await reportService.addDonation(donation, actor?.id, actor?.fullName, actor?.post)
  },

  // CAMPS
  getCamps: campService.getCamps,
  addCamp: async (camp, actor) => {
    const res = await campService.addCamp(camp)
    await reportService.addAuditLog(actor?.id, 'Created Camp', `Created Camp: ${camp.campName}`, 'camp', res.id)
    return res
  },
  createCamp: async (camp, actor) => {
    return await db.addCamp(camp, actor)
  },
  updateCamp: async (id, camp, actor) => {
    const res = await campService.updateCamp(id, camp)
    await reportService.addAuditLog(actor?.id, 'Updated Camp', `Updated Camp: ${camp.campName}`, 'camp', id)
    return res
  },
  deleteCamp: async (id, actor) => {
    const res = await campService.deleteCamp(id)
    await reportService.addAuditLog(actor?.id, 'Deleted Camp', `Deleted Camp with ID ${id}`, 'camp', id)
    return res
  },

  // EMERGENCY REQUESTS
  getRequests: requestService.getRequests,
  addRequest: requestService.addRequest,
  updateRequestStatus: async (id, status, actor) => {
    const res = await requestService.updateRequestStatus(id, status)
    await reportService.addAuditLog(actor?.id, 'Updated Request Status', `Set Request for ${res.patient_name || id} to ${status}`, 'request', id)
    return res
  },

  // MEMBERS
  getMembers: memberService.getMembers,
  addMember: async (member, actor) => {
    const res = await memberService.addMember(member)
    await reportService.addAuditLog(actor?.id, 'Added Member', `Added Staff Member ${member.fullName} as ${member.post}`, 'member', res.id)
    return res
  },
  createMember: async (member, actor) => {
    return await db.addMember(member, actor)
  },
  updateMember: async (id, member, actor) => {
    const res = await memberService.updateMember(id, member)
    await reportService.addAuditLog(actor?.id, 'Updated Member', `Updated details for Staff ${member.fullName}`, 'member', id)
    return res
  },
  deleteMember: async (id, actor) => {
    const res = await memberService.deleteMember(id)
    await reportService.addAuditLog(actor?.id, 'Deleted Member', `Removed Staff Member with ID ${id}`, 'member', id)
    return res
  },

  // BLOOD INVENTORY
  getInventory: inventoryService.getInventory,
  adjustInventory: async (bloodGroup, units, action, actor) => {
    const res = await inventoryService.adjustInventory(bloodGroup, units, action)
    await reportService.addAuditLog(actor?.id, 'Adjusted Inventory', `Adjusted ${bloodGroup} units (${action === 'add' ? '+' : '-'}${units})`, 'inventory')
    return res
  },

  // AUDIT LOGS
  getAuditLogs: reportService.getAuditLogs,
  addAuditLog: reportService.addAuditLog,
  exportBackup: reportService.exportBackup
};
