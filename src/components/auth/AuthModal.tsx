import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, X } from 'lucide-react'
import { ROUTES, APP_NAME } from '@/lib/constants'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  initialTab?: 'login' | 'register'
}

export default function AuthModal({ open, onClose, initialTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-[95vw] max-w-md bg-background border border-border p-0 overflow-hidden rounded-2xl shadow-premium">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))]">{APP_NAME}</p>
            <h2 className="font-serif text-2xl font-medium mt-1">
              {tab === 'login' ? 'Welcome back' : 'Join BlueOak'}
            </h2>
          </div>
          <button
            title="Close"
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex mx-8 mt-6 border-b border-border/50">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 pb-3 text-[11px] font-bold uppercase tracking-widest transition-all",
                tab === t
                  ? "border-b-2 border-[hsl(var(--gold))] text-foreground"
                  : "text-muted-foreground/50 hover:text-muted-foreground"
              )}
            >
              {t === 'login' ? 'Log In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="px-8 pb-8 pt-6 overflow-y-auto max-h-[75vh]">
          {tab === 'login' ? (
            <LoginForm onSuccess={onClose} onSwitchTab={() => setTab('register')} />
          ) : (
            <RegisterForm onSuccess={onClose} onSwitchTab={() => setTab('login')} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Login Form ──────────────────────────────────────────────────────────────
function LoginForm({ onSuccess, onSwitchTab }: { onSuccess: () => void; onSwitchTab: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('blueoak-remember-me') === 'true')
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: localStorage.getItem('blueoak-saved-email') || ''
    }
  })

  async function onSubmit(data: LoginFormData) {
    try {
      setError(null)
      if (rememberMe) {
        localStorage.setItem('blueoak-saved-email', data.email)
        localStorage.setItem('blueoak-remember-me', 'true')
      } else {
        localStorage.removeItem('blueoak-saved-email')
        localStorage.setItem('blueoak-remember-me', 'false')
      }
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: data.email, 
        password: data.password 
      })
      if (authError) { setError(authError.message); return }
      if (authData.session) {
        useAuthStore.getState().setSession(authData.session)
        try {
          const { data: profile } = await supabase
            .from('profiles').select('*').eq('id', authData.session.user.id).single()
          if (profile) useAuthStore.getState().setProfile(profile)
        } catch { /* ignore */ }
      }
      onSuccess()
      navigate(from, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed. Please try again.')
    }
  }

  async function handleGoogle() {
    try { await loginWithGoogle() }
    catch (e) { setError(e instanceof Error ? e.message : 'Google login failed.') }
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-3 h-12 rounded-xl border border-border bg-secondary/30 text-[11px] font-bold uppercase tracking-widest transition-all hover:border-[hsl(var(--gold))] hover:bg-secondary/50"
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
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
        <div className="relative flex justify-center"><span className="bg-background px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">or</span></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Email</label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className={cn(
              'w-full h-12 bg-secondary/30 rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/30 focus:bg-background focus:ring-2 focus:ring-[hsl(var(--gold))]',
              errors.email && 'ring-2 ring-destructive bg-destructive/5'
            )}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-[10px] font-bold text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={cn(
                'w-full h-12 bg-secondary/30 rounded-xl px-4 pr-12 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/30 focus:bg-background focus:ring-2 focus:ring-[hsl(var(--gold))]',
                errors.password && 'ring-2 ring-destructive bg-destructive/5'
              )}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && <p className="text-[10px] font-bold text-destructive">{errors.password.message}</p>}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pb-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={cn(
              "h-4 w-4 rounded border border-border flex items-center justify-center transition-all",
              rememberMe ? "bg-[hsl(var(--gold))] border-[hsl(var(--gold))]" : "bg-secondary/30 group-hover:border-[hsl(var(--gold)/50)]"
            )}>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              {rememberMe && <div className="h-2 w-2 bg-black rounded-[0.5px]" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors select-none">Remember Me</span>
          </label>
          <button 
            type="button" 
            onClick={() => navigate(ROUTES.FORGOT_PASSWORD)} 
            className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--gold))] hover:underline"
          >
            Forgot?
          </button>
        </div>

        {error && (
          <div className="text-[11px] font-medium text-destructive bg-destructive/10 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center h-12 bg-[hsl(var(--gold))] text-black rounded-xl text-[11px] font-black uppercase tracking-widest shadow-gold-glow hover:brightness-105 transition-all disabled:opacity-40"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Log In'}
        </button>
      </form>

      <p className="text-center text-[11px] text-muted-foreground">
        Don't have an account?{' '}
        <button onClick={onSwitchTab} className="text-[hsl(var(--gold))] font-semibold hover:underline">
          Create one
        </button>
      </p>
    </div>
  )
}

// ─── Register Form ───────────────────────────────────────────────────────────
function RegisterForm({ onSuccess, onSwitchTab }: { onSuccess: () => void; onSwitchTab: () => void }) {
  const navigate = useNavigate()
  const { register: registerAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { user_type: 'buyer' },
  })

  const userType = watch('user_type')

  async function onSubmit(data: RegisterFormData) {
    try {
      setError(null)
      await registerAuth(data)
      onSuccess()
      navigate(ROUTES.VERIFY_EMAIL, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">I am a</label>
          <div className="grid grid-cols-2 gap-2 h-12 rounded-xl bg-secondary/30 p-1.5">
            {(['buyer', 'seller'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue('user_type', role)}
                className={cn(
                  'rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all',
                  userType === role
                    ? 'bg-[hsl(var(--gold))] text-black shadow'
                    : 'text-muted-foreground/50 hover:text-foreground'
                )}
              >
                {role === 'buyer' ? 'Buyer' : 'Seller'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Full Name</label>
          <input 
            {...register('full_name')} 
            type="text" 
            autoComplete="name"
            className={cn(
              'w-full h-12 bg-secondary/30 rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/30 focus:bg-background focus:ring-2 focus:ring-[hsl(var(--gold))]',
              errors.full_name && 'ring-2 ring-destructive bg-destructive/5'
            )}
            placeholder="Your full name"
          />
          {errors.full_name && <p className="text-[10px] font-bold text-destructive">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Email</label>
          <input 
            {...register('email')} 
            type="email" 
            autoComplete="email"
            className={cn(
              'w-full h-12 bg-secondary/30 rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/30 focus:bg-background focus:ring-2 focus:ring-[hsl(var(--gold))]',
              errors.email && 'ring-2 ring-destructive bg-destructive/5'
            )}
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-[10px] font-bold text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">Password</label>
          <input 
            {...register('password')} 
            type="password" 
            autoComplete="new-password"
            className={cn(
              'w-full h-12 bg-secondary/30 rounded-xl px-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/30 focus:bg-background focus:ring-2 focus:ring-[hsl(var(--gold))]',
              errors.password && 'ring-2 ring-destructive bg-destructive/5'
            )}
            placeholder="Min. 8 characters"
          />
          {errors.password && <p className="text-[10px] font-bold text-destructive">{errors.password.message}</p>}
        </div>

        {error && (
          <div className="text-[11px] font-medium text-destructive bg-destructive/10 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center h-12 bg-[hsl(var(--gold))] text-black rounded-xl text-[11px] font-black uppercase tracking-widest shadow-gold-glow hover:brightness-105 transition-all disabled:opacity-40"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-[11px] text-muted-foreground">
        Already have an account?{' '}
        <button onClick={onSwitchTab} className="text-[hsl(var(--gold))] font-semibold hover:underline">
          Log in
        </button>
      </p>
    </div>
  )
}
