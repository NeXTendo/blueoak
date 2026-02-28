import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { queryClient } from '@/lib/queryClient'
import { ROUTES } from '@/lib/constants'
import type { LoginFormData, RegisterFormData } from '@/lib/validations'

export function useAuth() {
  const session = useAuthStore((s) => s.session)
  const profile = useAuthStore((s) => s.profile)
  const isLoading = useAuthStore((s) => s.isLoading)
  const setSession = useAuthStore((s) => s.setSession)
  const setProfile = useAuthStore((s) => s.setProfile)
  const setLoading = useAuthStore((s) => s.setLoading)
  const setInitialized = useAuthStore((s) => s.setInitialized)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()

  async function login({ email, password }: LoginFormData) {
    console.log('[useAuth] signInWithPassword starting...')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('[useAuth] signInWithPassword error:', error.message)
      throw error
    }
    console.log('[useAuth] signInWithPassword succeeded, session:', !!data.session)
    
    // Sync store immediately to prevent redirect race conditions
    setSession(data.session)
    if (data.session) {
      try {
        console.log('[useAuth] Fetching profile for:', data.session.user.id)
        await fetchProfile(data.session.user.id)
        console.log('[useAuth] Profile fetched successfully')
      } catch (err) {
        console.error('[useAuth] Failed to pre-fetch profile during login:', err)
      }
    }
    return data
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home` },
    })
    if (error) throw error
  }

  async function register({ full_name, email, password, user_type }: RegisterFormData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, user_type } },
    })
    if (error) throw error
    
    // If auto-confirm is on in Supabase, we might get a session immediately
    if (data.session) {
      setSession(data.session)
      try {
        await fetchProfile(data.session.user.id)
      } catch (err) {
        console.error('Failed to pre-fetch profile during register:', err)
      }
    }
    return data
  }

  async function logout() {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Supabase signOut failed, clearing local state anyway:', err)
    } finally {
      queryClient.clear()
      clearAuth()
      navigate(ROUTES.LOGIN)
    }
  }

  async function forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
    })
    if (error) throw error
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (error) throw error
    setProfile(data)
    return data
  }

  async function updateProfile(updates: Partial<any>) {
    if (!userId) throw new Error('Not authenticated')
    setLoading(true)
    try {
      const { data, error } = await (supabase
        .from('profiles') as any)
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      setProfile(data as any)
      return data
    } finally {
      setLoading(false)
    }
  }

  const isAuthenticated = !!session
  const userId          = session?.user?.id
  const userType        = profile?.user_type

  return {
    session, profile, isLoading, isAuthenticated, userId, userType,
    login, loginWithGoogle, register, logout, forgotPassword, updatePassword,
    fetchProfile, updateProfile, setLoading, setSession, setInitialized,
  }
}

export function useAuthInit() {
  const setSession = useAuthStore((s) => s.setSession)
  const setProfile = useAuthStore((s) => s.setProfile)
  const setInitialized = useAuthStore((s) => s.setInitialized)

  useEffect(() => {
    let mounted = true

    // Safety timeout: If auth takes more than 5s, mark as initialized anyway
    // to prevent the app from being stuck on a global spinner.
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timed out. Proceeding...');
        setInitialized(true);
      }
    }, 5000);

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(session)

        if (session) {
          try {
            const { data } = await supabase.from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (mounted && data) setProfile(data)
          } catch (profileErr) {
            console.error('Failed to fetch profile during init:', profileErr)
          }
        }
        
        if (mounted) {
          clearTimeout(timeout)
          setInitialized(true)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          clearTimeout(timeout)
          setInitialized(true)
        }
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        if (newSession) {
          const { data } = await supabase.from('profiles').select('*').eq('id', newSession.user.id).single()
          setProfile(data)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setSession, setProfile, setInitialized])
}
