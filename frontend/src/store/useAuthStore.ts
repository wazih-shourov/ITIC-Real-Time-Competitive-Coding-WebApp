import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  profile: any | null
  isLoading: boolean
  isInitialized: boolean
  setAuth: (session: Session | null, user: User | null) => void
  setProfile: (profile: any) => void
  setLoading: (isLoading: boolean) => void
  setInitialized: (isInitialized: boolean) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isInitialized: true,
  setAuth: (session, user) => set({ session, user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  signOut: () => set({ user: null, session: null, profile: null }),
}))
