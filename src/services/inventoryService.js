import { supabase } from './supabaseClient'

export const inventoryService = {
  // Fetch blood stock levels
  getInventory: async () => {
    if (!supabase) return {}
    const { data, error } = await supabase
      .from('blood_inventory')
      .select('*')
      .order('blood_group', { ascending: true })

    if (error) throw error
    
    // Map array to object format {"A+": 24, "A-": 5, ...}
    const inventoryMap = {}
    data.forEach(item => {
      inventoryMap[item.blood_group] = item.available_units
    })
    return inventoryMap
  },

  // Adjust stock units on approval or donation
  adjustInventory: async (bloodGroup, units, action) => {
    if (!supabase) throw new Error('Supabase client is not configured.')
    const change = Number(units)

    // Fetch current units
    const { data: currentRecord, error: fetchError } = await supabase
      .from('blood_inventory')
      .select('available_units')
      .eq('blood_group', bloodGroup)
      .single()

    if (fetchError) throw fetchError
    const current = currentRecord.available_units || 0
    const nextValue = action === 'add' ? current + change : Math.max(0, current - change)

    // Update
    const { data, error: updateError } = await supabase
      .from('blood_inventory')
      .update({ 
        available_units: nextValue,
        last_updated: new Date().toISOString()
      })
      .eq('blood_group', bloodGroup)
      .select()

    if (updateError) throw updateError
    return data[0]
  }
}
