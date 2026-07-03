import { supabase } from './supabaseClient'

export const campService = {
  // Fetch all camps
  getCamps: async () => {
    if (!supabase) return []
    const { data, error } = await supabase
      .from('blood_camps')
      .select('*')
      .order('camp_date', { ascending: false })

    if (error) throw error
    return data.map(c => ({
      id: c.id,
      campName: c.camp_name,
      organizer: c.organizer,
      venue: c.venue,
      district: c.district,
      city: c.city,
      date: c.camp_date,
      description: c.description,
      totalDonors: c.total_donors,
      unitsCollected: c.units_collected,
      photo: c.banner_image,
      status: c.status.charAt(0).toUpperCase() + c.status.slice(1) // uppercase first char: 'Upcoming', 'Completed', 'Cancelled'
    }))
  },

  // Add new camp
  addCamp: async (camp) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const dbCamp = {
      camp_name: camp.campName,
      organizer: camp.organizer,
      venue: camp.venue,
      district: camp.district,
      city: camp.city,
      camp_date: camp.date,
      description: camp.description,
      banner_image: camp.photo || null,
      status: camp.status ? camp.status.toLowerCase() : 'upcoming'
    }

    const { data, error } = await supabase
      .from('blood_camps')
      .insert([dbCamp])
      .select()

    if (error) throw error
    return data[0]
  },

  // Update camp details
  updateCamp: async (id, camp) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const dbCamp = {
      camp_name: camp.campName,
      organizer: camp.organizer,
      venue: camp.venue,
      district: camp.district,
      city: camp.city,
      camp_date: camp.date,
      description: camp.description,
      banner_image: camp.photo,
      status: camp.status ? camp.status.toLowerCase() : 'upcoming',
      total_donors: camp.totalDonors,
      units_collected: camp.unitsCollected
    }

    const { data, error } = await supabase
      .from('blood_camps')
      .update(dbCamp)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  // Delete camp
  deleteCamp: async (id) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const { error } = await supabase
      .from('blood_camps')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Upload camp banner image
  uploadBanner: async (campId, file) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const fileExt = file.name.split('.').pop()
    const filePath = `${campId}/${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('camps')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('camps').getPublicUrl(filePath)
    return data.publicUrl
  }
}
