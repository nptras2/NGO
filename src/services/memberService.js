import { supabase } from './supabaseClient'

export const memberService = {
  // Fetch all NGO staff/cabinet members
  getMembers: async () => {
    if (!supabase) return []
    
    let response = await supabase
      .from('members')
      .select('id, name, designation, blood_group, phone, years_of_service, photo_url, status, display_order, email')
      .order('display_order', { ascending: true })

    if (response.error) {
      console.warn("Failed to fetch with 'email' column, retrying without 'email':", response.error)
      response = await supabase
        .from('members')
        .select('id, name, designation, blood_group, phone, years_of_service, photo_url, status, display_order')
        .order('display_order', { ascending: true })
    }

    if (response.error) throw response.error
    return response.data.map(m => ({
      id: m.id,
      fullName: m.name,
      post: m.designation,
      bloodGroup: m.blood_group,
      phone: m.phone,
      yearsOfService: m.years_of_service,
      photo: m.photo_url,
      status: m.status === 'active' ? 'Active' : 'Inactive',
      displayOrder: m.display_order,
      email: m.email || ''
    }))
  },

  // Add new cabinet member
  addMember: async (member) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const dbMember = {
      name: member.fullName,
      designation: member.post,
      email: member.email || null,
      blood_group: member.bloodGroup,
      phone: member.phone || null,
      years_of_service: member.yearsOfService || 0,
      photo_url: member.photo || null,
      status: member.status === 'Active' ? 'active' : 'inactive',
      display_order: member.displayOrder || 0
    }

    let response = await supabase
      .from('members')
      .insert([dbMember])
      .select()

    if (response.error && (response.error.message.includes('email') || response.error.code === '42703')) {
      console.warn("Retrying member insert without 'email' column:", response.error)
      const { email, ...trimmedMember } = dbMember
      response = await supabase
        .from('members')
        .insert([trimmedMember])
        .select()
    }

    if (response.error) throw response.error
    return response.data[0]
  },

  createMember: async (member) => {
    return memberService.addMember(member)
  },

  // Update member details
  updateMember: async (id, member) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const dbMember = {
      name: member.fullName,
      designation: member.post,
      email: member.email || null,
      blood_group: member.bloodGroup,
      phone: member.phone,
      years_of_service: member.yearsOfService,
      photo_url: member.photo,
      status: member.status === 'Active' ? 'active' : 'inactive',
      display_order: member.displayOrder
    }

    let response = await supabase
      .from('members')
      .update(dbMember)
      .eq('id', id)
      .select()

    if (response.error && (response.error.message.includes('email') || response.error.code === '42703')) {
      console.warn("Retrying member update without 'email' column:", response.error)
      const { email, ...trimmedMember } = dbMember
      response = await supabase
        .from('members')
        .update(trimmedMember)
        .eq('id', id)
        .select()
    }

    if (response.error) throw response.error
    return response.data[0]
  },

  // Remove member
  deleteMember: async (id) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  // Upload member headshot photo
  uploadPhoto: async (memberId, file) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const fileExt = file.name.split('.').pop()
    const filePath = `${memberId}/${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('members')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('members').getPublicUrl(filePath)
    return data.publicUrl
  }
}
