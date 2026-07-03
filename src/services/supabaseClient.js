import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Export the supabase client. If keys are missing, it will return null, 
// and the db.js layer will transparently fall back to the Local Storage Database.
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project-id.supabase.co'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
