import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { queryClient } from '@/lib/queryClient'
import { ROUTES } from '@/lib/constants'
import type { Profile } from '@/types/user'
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
    console.log(`[useAuth] signInWithPassword starting for ${email}...`)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('[useAuth] signInWithPassword error:', error.message)
        throw error
      }
      console.log('[useAuth] signInWithPassword success. Session ID:', data.session?.user?.id)
      
      setSession(data.session)
      if (data.session) {
        await fetchProfile(data.session.user.id)
      }
      return data
    } catch (err) {
      console.error('[useAuth] Exception in login:', err)
      throw err
    }
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
      navigate(ROUTES.HOME)
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

  async function updateProfile(updates: Partial<Profile>) {
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
      setProfile(data as Profile)
      return data
    } finally {
      setLoading(false)
    }
  }

  async function hibernateAccount() {
    if (!userId) throw new Error('Not authenticated')
    await updateProfile({ status: 'hibernated' })
    await logout()
  }

  async function deleteAccount() {
    if (!userId) throw new Error('Not authenticated')
    // Note: In Supabase, deleting the user in auth.users deletes the profile via cascade
    const { error } = await supabase.auth.admin.deleteUser(userId)
    // If admin method fails (likely for regular users), we can try another way or just clear state
    // But usually we need an edge function for this to be secure.
    // For now, let's at least clear state and navigate away if deleteUser isn't available to client.
    if (error) {
       console.error('Delete account failed (admin needed?):', error.message)
       throw error
    }
    await logout()
  }

  const isAuthenticated = !!session
  const userId          = session?.user?.id
  const userType        = profile?.user_type

  return {
    session, profile, isLoading, isAuthenticated, userId, userType,
    login, loginWithGoogle, register, logout, forgotPassword, updatePassword,
    fetchProfile, updateProfile, setLoading, setSession, setInitialized,
    hibernateAccount, deleteAccount
  }
}

export function useAuthInit() {
  const setSession = useAuthStore((s) => s.setSession)
  const setProfile = useAuthStore((s) => s.setProfile)
  const setInitialized = useAuthStore((s) => s.setInitialized)

  useEffect(() => {
    let mounted = true
    let isDone = false

    const finish = () => {
      if (!isDone && mounted) {
        isDone = true
        setInitialized(true)
      }
    }

    // Safety timeout: Proceed after 3s no matter what
    const timeout = setTimeout(() => {
      if (!isDone) {
        console.warn('[useAuth] Initialization timeout reached. Forcing ready state.')
        finish()
      }
    }, 3000)

    async function handleAuthChange(event: any, session: any) {
      console.log(`[useAuth] Event: ${event}. Session: ${!!session}`)
      
      if (mounted) {
        setSession(session)
        if (session) {
          try {
            const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
            if (mounted && data) setProfile(data)
          } catch (err) {
            console.error('[useAuth] Profile fetch failed:', err)
          }
        } else {
          setProfile(null)
          if (event === 'SIGNED_OUT') {
            useAuthStore.getState().clearAuth()
          }
        }
      }

      // INITIAL_SESSION or any session event satisfies initialization
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
         finish()
      }
    }

    // 1. Set up listener FIRST to catch INITIAL_SESSION
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)

    // 2. Faster, non-blocking initial check
    async function quickCheck() {
      try {
        console.log('[useAuth] init: Quick check start...')
        // We use a small timeout for the direct call
        const { data: { session }, error } = await Promise.race([
          supabase.auth.getSession(),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('getSession timeout')), 2500))
        ])
        
        if (error) {
           console.error('[useAuth] getSession error:', error.message)
           if (error.message.includes('refresh_token_not_found') || error.message.includes('invalid_grant')) {
              console.warn('[useAuth] Invalid token detected. Clearing storage to unblock client.')
              await supabase.auth.signOut({ scope: 'local' })
           }
        }

        if (mounted && session) {
          console.log('[useAuth] quickCheck found session. Forwarding to handleAuthChange.')
          handleAuthChange('INITIAL_SESSION_QUICK', session)
        }
      } catch (err: any) {
        console.warn(`[useAuth] Quick check bypassed/timed out: ${err.message}`)
        // If it timed out, it might be due to a deadlock. 
        // We don't sign out automatically here to avoid losing valid sessions,
        // but the 'finish()' call in finally ensures the app doesn't hang.
      } finally {
        finish()
      }
    }

    quickCheck()

    return () => {
      mounted = false
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [setSession, setProfile, setInitialized])
}
