import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Session } from '@supabase/supabase-js'
import type { Profile } from '@/types/user'

interface AuthState {
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isInitialized: boolean
}

interface AuthActions {
  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set) => ({
      session:       null,
      profile:       null,
      isLoading:     false,
      isInitialized: false,

      setSession:     (session)     => set((s) => { s.session = session }),
      setProfile:     (profile)     => set((s) => { s.profile = profile }),
      setLoading:     (loading)     => set((s) => { s.isLoading = loading }),
      setInitialized: (initialized) => set((s) => { s.isInitialized = initialized }),
      clearAuth: () => set((s) => {
        s.session = null
        s.profile = null
        s.isLoading = false
      }),
    })),
    {
      name: 'blueoak-auth-store',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
)
