import { supabase } from './supabaseClient'
import { inventoryService } from './inventoryService'

export const requestService = {
  // Fetch all requests sorted by created_at desc
  getRequests: async () => {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(r => ({
      id: r.id,
      patientName: r.patient_name,
      hospitalName: r.hospital_name,
      bloodGroup: r.blood_group,
      unitsRequired: r.units_required,
      urgency: r.urgency.charAt(0).toUpperCase() + r.urgency.slice(1), // camelCase status uppercase 'Normal', 'Urgent', 'Critical'
      attendantName: r.attendant_name,
      phone: r.phone,
      district: r.district,
      city: r.city,
      requiredDate: r.required_date,
      notes: r.notes,
      status: r.status.charAt(0).toUpperCase() + r.status.slice(1), // uppercase first 'Pending', 'Approved', 'Fulfilled', 'Cancelled'
      createdAt: r.created_at
    }))
  },

  // Public blood request submission
  addRequest: async (req) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const dbReq = {
      patient_name: req.patientName,
      hospital_name: req.hospitalName,
      blood_group: req.bloodGroup,
      units_required: req.unitsRequired,
      urgency: req.urgency.toLowerCase(),
      attendant_name: req.attendantName,
      phone: req.phone,
      district: req.district,
      city: req.city,
      required_date: req.requiredDate,
      notes: req.notes,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('blood_requests')
      .insert([dbReq])
      .select()

    if (error) throw error
    return data[0]
  },

  // Update request status (e.g. Approve, Fulfill, Cancel)
  updateRequestStatus: async (id, status) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const dbStatus = status.toLowerCase()

    const { data, error } = await supabase
      .from('blood_requests')
      .update({ status: dbStatus })
      .eq('id', id)
      .select()

    if (error) throw error
    const updatedReq = data[0]

    // If approved, deduct units from inventory
    if (dbStatus === 'approved') {
      await inventoryService.adjustInventory(
        updatedReq.blood_group, 
        updatedReq.units_required, 
        'deduct'
      )
    }
    return updatedReq
  }
}
