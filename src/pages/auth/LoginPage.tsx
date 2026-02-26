import { useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/lib/constants'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import AuthLayout from '@/components/auth/AuthLayout'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { loginWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugLog, setDebugLog] = useState<string[]>([])
  const logRef = useRef<string[]>([])

  const addLog = (msg: string) => {
    const entry = `[${new Date().toLocaleTimeString()}] ${msg}`
    logRef.current = [...logRef.current, entry]
    setDebugLog([...logRef.current])
    console.log(entry)
  }

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    try {
      setError(null)
      addLog(`Step 1: Calling Supabase signInWithPassword for ${data.email}...`)
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: data.email, 
        password: data.password 
      })
      
      if (authError) {
        addLog(`ERROR at Step 1: ${authError.message}`)
        setError(authError.message)
        return
      }
      
      addLog(`Step 2: Auth succeeded! Session: ${!!authData.session}, User: ${authData.session?.user?.id?.slice(0, 8)}...`)
      
      if (authData.session) {
        // Set session in store
        addLog(`Step 3: Setting session in store...`)
        useAuthStore.getState().setSession(authData.session)
        
        // Try to fetch profile (non-blocking — skip if fails)
        addLog(`Step 4: Fetching profile...`)
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.session.user.id)
            .single()
          
          if (profileError) {
            addLog(`WARNING at Step 4: Profile fetch failed: ${profileError.message} — continuing without profile`)
          } else {
            addLog(`Step 4: Profile fetched: ${(profile as any)?.full_name}`)
            useAuthStore.getState().setProfile(profile)
          }
        } catch (profileErr: any) {
          addLog(`WARNING at Step 4: ${profileErr?.message} — continuing without profile`)
        }
      }
      
      addLog(`Step 5: Navigating to ${from}`)
      navigate(from, { replace: true })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Login failed. Please try again.'
      addLog(`FATAL ERROR: ${msg}`)
      setError(msg)
    }
  }

  async function handleGoogle() {
    try { await loginWithGoogle() }
    catch (e) { setError(e instanceof Error ? e.message : 'Google login failed.') }
  }

  return (
    <AuthLayout 
      title={t('auth.login')}
      footerLink={{
        text: t('auth.noAccount'),
        label: t('auth.register'),
        href: ROUTES.REGISTER
      }}
    >
      <div className="space-y-8">
        {/* Google Access */}
        <button
          type="button"
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 h-16 rounded-2xl border-2 border-secondary bg-background text-[10px] font-black uppercase tracking-widest transition-all hover:border-black active:scale-95"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" fillOpacity="0.8"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" fillOpacity="0.6"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" fillOpacity="0.4"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-secondary" /></div>
          <div className="relative flex justify-center"><span className="bg-background px-4 text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">{t('common.or')}</span></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">{t('auth.email')}</label>
            </div>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              className={cn(
                'w-full h-16 bg-secondary/30 rounded-2xl px-6 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/20 focus:bg-background focus:ring-2 focus:ring-primary focus:shadow-premium',
                errors.email && 'ring-2 ring-destructive bg-destructive/5'
              )}
              placeholder="identity@example.com"
            />
            {errors.email && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-primary">{t('auth.password')}</label>
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors">
                Recovery
              </Link>
            </div>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className={cn(
                  'w-full h-16 bg-secondary/30 rounded-2xl px-6 pr-14 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/20 focus:bg-background focus:ring-2 focus:ring-primary focus:shadow-premium',
                  errors.password && 'ring-2 ring-destructive bg-destructive/5'
                )}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="text-[10px] font-bold text-destructive uppercase tracking-widest bg-destructive/10 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center h-16 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-premium transition-all disabled:opacity-40 active:scale-98"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : t('auth.login')}
          </button>
        </form>

        {/* Debug Log Panel */}
        {debugLog.length > 0 && (
          <div className="mt-4 p-3 bg-black/5 dark:bg-white/5 rounded-xl max-h-32 overflow-auto">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">Debug Log</p>
            {debugLog.map((log, i) => (
              <p key={i} className={cn(
                "text-[10px] font-mono",
                log.includes('ERROR') ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
