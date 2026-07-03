import { supabase } from './supabaseClient'

export const authService = {
  // Sign in using email and password
  signIn: async (email, password) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign out
  signOut: async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Reset password for recovery email
  resetPasswordForEmail: async (email) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    return data
  },

  // Update password (used during password reset flow)
  updatePassword: async (newPassword) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const { data, error } = await supabase.auth.update({
      password: newPassword
    })
    if (error) throw error
    return data
  },

  // Fetch active user profile details
  fetchUserProfile: async (userId) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return data
  },

  // Update user avatar
  uploadAvatar: async (userId, file) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    
    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', userId)

    if (updateError) throw updateError
    return data.publicUrl
  }
}
