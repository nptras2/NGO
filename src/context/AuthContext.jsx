import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext()

// Predefined demo accounts for playground fallbacks
const demoUsers = [
  {
    email: 'admin@lifesaver.org',
    fullName: 'Dr. Manoj Prabhakar',
    post: 'Admin',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=faces'
  },
  {
    email: 'president@lifesaver.org',
    fullName: 'Dr. Manoj Prabhakar',
    post: 'President',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=faces'
  },
  {
    email: 'secretary@lifesaver.org',
    fullName: 'Suhasini Mehta',
    post: 'Secretary',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces'
  },
  {
    email: 'dataentry@lifesaver.org',
    fullName: 'Rahul Bose',
    post: 'Data Entry Operator',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
  },
  {
    email: 'volunteer@lifesaver.org',
    fullName: 'Ananya Deshpande',
    post: 'Volunteer',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop&crop=faces'
  }
]

const mapRoleToPost = (role) => {
  const mapping = {
    'super_admin': 'Admin',
    'admin': 'Admin',
    'president': 'President',
    'secretary': 'Secretary',
    'volunteer': 'Volunteer',
    'data_entry': 'Data Entry Operator'
  };
  return mapping[role] || 'Volunteer';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen to Auth State Changes in Supabase
  useEffect(() => {
    if (!supabase) {
      // Fallback to local sandbox user if Supabase is not configured
      const saved = localStorage.getItem('ngo_blood_bank_user')
      setUser(saved ? JSON.parse(saved) : demoUsers[0])
      setLoading(false)
      return
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await fetchAndSetUserProfile(session.user)
        } else {
          // Check if there is a custom playground user stored
          const saved = localStorage.getItem('ngo_blood_bank_user')
          if (saved) {
            setUser(JSON.parse(saved))
          }
        }
      } catch (err) {
        console.error('Error fetching initial auth session:', err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true)
      if (session) {
        await fetchAndSetUserProfile(session.user)
      } else {
        setUser(null)
        localStorage.removeItem('ngo_blood_bank_user')
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchAndSetUserProfile = async (authUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()
      
      if (error) throw error
      
      const sessionUser = {
        id: authUser.id,
        email: authUser.email,
        fullName: profile.full_name,
        post: mapRoleToPost(profile.role),
        photo: profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
        district: profile.district,
        city: profile.city,
        rawRole: profile.role
      }
      setUser(sessionUser)
      localStorage.setItem('ngo_blood_bank_user', JSON.stringify(sessionUser))
    } catch (err) {
      console.error('Error loading user profile:', err)
      // Fallback details if profile is not fully seeded yet
      setUser({
        id: authUser.id,
        email: authUser.email,
        fullName: 'NGO Member',
        post: 'Volunteer',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
      })
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    if (!supabase) {
      // Sandbox fallback login
      const found = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (found) {
        setUser(found)
        localStorage.setItem('ngo_blood_bank_user', JSON.stringify(found))
        setLoading(false)
        return found
      }
      setLoading(false)
      throw new Error('Invalid credentials in demo database.')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      setLoading(false)
      throw error
    }
    await fetchAndSetUserProfile(data.user)
    setLoading(false)
  }

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    localStorage.removeItem('ngo_blood_bank_user')
  }

  const switchDemoRole = (roleName) => {
    const matched = demoUsers.find(u => u.post === roleName)
    if (matched) {
      const switchedUser = { ...matched, id: user?.id || 'sandbox_id' }
      setUser(switchedUser)
      localStorage.setItem('ngo_blood_bank_user', JSON.stringify(switchedUser))
    } else {
      const customUser = {
        id: user?.id || 'sandbox_id',
        email: `${roleName.toLowerCase().replace(/\s+/g, '')}@lifesaver.org`,
        fullName: `Demo ${roleName}`,
        post: roleName,
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces'
      }
      setUser(customUser)
      localStorage.setItem('ngo_blood_bank_user', JSON.stringify(customUser))
    }
  }

  // RBAC Permission check helpers
  const canManageMembers = () => ['Admin', 'President'].includes(user?.post)
  const canManageCamps = () => ['Admin', 'President', 'Secretary'].includes(user?.post)
  const canViewReports = () => ['Admin', 'President', 'Secretary'].includes(user?.post)
  const canBackupDatabase = () => ['Admin', 'President'].includes(user?.post)
  const canAdjustInventory = () => ['Admin', 'President', 'Secretary'].includes(user?.post)
  const canProcessRequests = () => ['Admin', 'President', 'Secretary'].includes(user?.post)
  const canEditDonors = () => ['Admin', 'President', 'Secretary', 'Data Entry Operator'].includes(user?.post)
  const canAddDonors = () => ['Admin', 'President', 'Secretary', 'Data Entry Operator', 'Volunteer'].includes(user?.post)

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      switchDemoRole, 
      demoUsers,
      permissions: {
        canManageMembers,
        canManageCamps,
        canViewReports,
        canBackupDatabase,
        canAdjustInventory,
        canProcessRequests,
        canEditDonors,
        canAddDonors
      }
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
