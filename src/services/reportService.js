import { supabase } from './supabaseClient'
import { donorService } from './donorService'
import { inventoryService } from './inventoryService'

export const reportService = {
  // Fetch all donations history
  getDonations: async () => {
    if (!supabase) return []
    // Fetch donations with nested donor names
    const { data, error } = await supabase
      .from('donations')
      .select(`
        id,
        donor_id,
        camp_id,
        units_donated,
        donation_date,
        verified_by,
        remarks,
        created_at,
        donors (
          full_name,
          blood_group
        ),
        blood_camps (
          camp_name
        )
      `)
      .order('donation_date', { ascending: false })

    if (error) throw error
    return data.map(d => ({
      id: d.id,
      donorId: d.donor_id,
      donorName: d.donors?.full_name || 'Unknown Donor',
      donationDate: d.donation_date,
      bloodGroup: d.donors?.blood_group || 'O+',
      bloodUnits: d.units_donated,
      campName: d.blood_camps?.camp_name || 'Direct Donation',
      verifiedBy: d.verified_by
    }))
  },

  // Log new donation (updates last_donation_date and inventory automatically)
  addDonation: async (donation, actorId, actorName, actorRole) => {
    if (!supabase) throw new Error('Supabase client is not configured.')

    const dbDonation = {
      donor_id: donation.donorId,
      camp_id: donation.campId || null,
      units_donated: Number(donation.bloodUnits || 1),
      donation_date: donation.donationDate,
      verified_by: actorId,
      remarks: donation.remarks || ''
    }

    const { data, error } = await supabase
      .from('donations')
      .insert([dbDonation])
      .select()

    if (error) throw error
    const newDonation = data[0]

    // Sync donor last donation date
    await supabase
      .from('donors')
      .update({ last_donation_date: donation.donationDate })
      .eq('id', donation.donorId)

    // Add units to inventory
    await inventoryService.adjustInventory(
      donation.bloodGroup,
      Number(donation.bloodUnits || 1),
      'add'
    )

    // Add Audit Log
    await reportService.addAuditLog(
      actorId,
      'Logged Donation',
      `Logged ${donation.bloodUnits} units of ${donation.bloodGroup} from donor ID ${donation.donorId}`
    )

    return newDonation;
  },

  // Fetch audit logs sorted by created_at desc
  getAuditLogs: async () => {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('audit_logs')
      .select(`
        id,
        user_id,
        action,
        entity_type,
        entity_id,
        description,
        created_at,
        profiles (
          full_name,
          role
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(log => ({
      id: log.id,
      actor: log.profiles?.full_name || 'System / Auto',
      role: log.profiles?.role 
        ? log.profiles.role.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
        : 'Coordinator',
      action: log.action,
      details: log.description,
      timestamp: log.created_at
    }))
  },

  // Write new audit log entry
  addAuditLog: async (userId, action, description, entityType = 'general', entityId = null) => {
    if (!supabase) return
    const { error } = await supabase
      .from('audit_logs')
      .insert([{
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        description
      }])
    
    if (error) console.error('Failed to write audit log:', error)
  },

  // Export full DB backup as JSON
  exportBackup: async () => {
    if (!supabase) throw new Error('Supabase client is not configured.')

    const [
      { data: donors },
      { data: camps },
      { data: donations },
      { data: requests },
      { data: members },
      { data: inventory },
      { data: logs }
    ] = await Promise.all([
      supabase.from('donors').select('*'),
      supabase.from('blood_camps').select('*'),
      supabase.from('donations').select('*'),
      supabase.from('blood_requests').select('*'),
      supabase.from('members').select('*'),
      supabase.from('blood_inventory').select('*'),
      supabase.from('audit_logs').select('*')
    ])

    const backupData = {
      exportedAt: new Date().toISOString(),
      donors,
      camps,
      donations,
      requests,
      members,
      inventory,
      logs
    }

    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `blood_bank_supabase_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
