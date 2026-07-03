import { supabase } from './supabaseClient'

const DAYS_REQUIRED_BETWEEN_DONATIONS = 90

// Helper: Calculate donor eligibility
export const checkEligibility = (lastDonationDate) => {
  if (!lastDonationDate) return { eligible: true, daysRemaining: 0 }
  
  const today = new Date()
  const lastDonation = new Date(lastDonationDate)
  const diffTime = today.getTime() - lastDonation.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays >= DAYS_REQUIRED_BETWEEN_DONATIONS) {
    return { eligible: true, daysRemaining: 0 }
  } else {
    return { eligible: false, daysRemaining: DAYS_REQUIRED_BETWEEN_DONATIONS - diffDays }
  }
}

export const donorService = {
  // Fetch all donors
  getDonors: async () => {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('full_name', { ascending: true })
    
    if (error) throw error
    return data.map(d => {
      const eligibility = checkEligibility(d.last_donation_date)
      return {
        id: d.id,
        fullName: d.full_name,
        fatherName: d.father_name,
        gender: d.gender,
        dateOfBirth: d.date_of_birth,
        age: d.age,
        bloodGroup: d.blood_group,
        phone: d.phone,
        email: d.email,
        address: d.address,
        district: d.district,
        city: d.city,
        pincode: d.pincode,
        lastDonationDate: d.last_donation_date,
        eligibleAfterDate: d.eligible_after_date,
        status: d.availability_status === 'available' ? 'Active' : 'Inactive',
        availabilityStatus: d.availability_status,
        medicalNotes: d.medical_notes,
        campId: d.camp_id,
        photo: d.photo_url,
        createdBy: d.created_by,
        eligible: eligibility.eligible,
        daysRemaining: eligibility.daysRemaining
      }
    })
  },

  // Add new donor
  addDonor: async (donor, actorId) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    
    // Map camelCase to snake_case for PostgreSQL
    const eligibleAfter = donor.lastDonationDate 
      ? new Date(new Date(donor.lastDonationDate).getTime() + (DAYS_REQUIRED_BETWEEN_DONATIONS * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      : null

    const eligibility = checkEligibility(donor.lastDonationDate)
    const calculatedAvailability = (donor.status === 'Inactive' || !eligibility.eligible) ? 'not_available' : 'available'

    const dbDonor = {
      full_name: donor.fullName,
      father_name: donor.fatherName,
      gender: donor.gender,
      date_of_birth: donor.dateOfBirth,
      age: donor.age,
      blood_group: donor.bloodGroup,
      phone: donor.phone,
      email: donor.email,
      address: donor.address,
      district: donor.district,
      city: donor.city,
      pincode: donor.pincode,
      last_donation_date: donor.lastDonationDate || null,
      eligible_after_date: eligibleAfter,
      availability_status: calculatedAvailability,
      medical_notes: donor.medicalNotes,
      photo_url: donor.photo || null,
      created_by: actorId
    }

    const { data, error } = await supabase
      .from('donors')
      .insert([dbDonor])
      .select()

    if (error) throw error
    return data[0]
  },

  createDonor: async (donor, actorId) => {
    return donorService.addDonor(donor, actorId)
  },

  // Update donor details
  updateDonor: async (id, donor) => {
    if (!supabase) throw new Error('Supabase client is not configured.')

    const eligibleAfter = donor.lastDonationDate 
      ? new Date(new Date(donor.lastDonationDate).getTime() + (DAYS_REQUIRED_BETWEEN_DONATIONS * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      : null

    const eligibility = checkEligibility(donor.lastDonationDate)
    const calculatedAvailability = (donor.status === 'Inactive' || !eligibility.eligible) ? 'not_available' : 'available'

    const dbDonor = {
      full_name: donor.fullName,
      father_name: donor.fatherName,
      gender: donor.gender,
      date_of_birth: donor.dateOfBirth,
      age: donor.age,
      blood_group: donor.bloodGroup,
      phone: donor.phone,
      email: donor.email,
      address: donor.address,
      district: donor.district,
      city: donor.city,
      pincode: donor.pincode,
      last_donation_date: donor.lastDonationDate || null,
      eligible_after_date: eligibleAfter,
      availability_status: calculatedAvailability,
      medical_notes: donor.medicalNotes,
      photo_url: donor.photo || null
    }

    const { data, error } = await supabase
      .from('donors')
      .update(dbDonor)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete donor
  deleteDonor: async (id) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const { error } = await supabase
      .from('donors')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Upload donor identification/photo
  uploadPhoto: async (donorId, file) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const fileExt = file.name.split('.').pop()
    const filePath = `${donorId}/${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('donors')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('donors').getPublicUrl(filePath)
    return data.publicUrl
  }
}
