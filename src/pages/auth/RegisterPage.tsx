import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import AuthLayout from '@/components/auth/AuthLayout'

export default function RegisterPage() {
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
      navigate(ROUTES.VERIFY_EMAIL, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed. Please try again.')
    }
  }

  return (
    <AuthLayout 
      title="Join BlueOak"
      footerLink={{
        text: "Already established?",
        label: "Log in",
        href: ROUTES.LOGIN
      }}
    >
      <div className="space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Professional Role Select */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Identity Profile</label>
            <div className="grid grid-cols-2 gap-2 h-16 rounded-2xl bg-secondary/30 p-2">
              {(['buyer', 'seller'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setValue('user_type', role)}
                  className={cn(
                    'rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
                    userType === role 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' 
                      : 'text-muted-foreground/40 hover:text-primary hover:bg-secondary/50'
                  )}
                >
                  {role === 'buyer' ? 'Buyer' : 'Seller'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Full Name</label>
            <input 
              {...register('full_name')} 
              type="text" 
              autoComplete="name"
              className={cn(
                'w-full h-16 bg-secondary/30 rounded-2xl px-6 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/20 focus:bg-background focus:ring-2 focus:ring-primary focus:shadow-premium',
                errors.full_name && 'ring-2 ring-destructive bg-destructive/5'
              )}
              placeholder="Full Legal Name" 
            />
            {errors.full_name && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Credentials</label>
            <input 
              {...register('email')} 
              type="email" 
              autoComplete="email"
              className={cn(
                'w-full h-16 bg-secondary/30 rounded-2xl px-6 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/20 focus:bg-background focus:ring-2 focus:ring-primary focus:shadow-premium',
                errors.email && 'ring-2 ring-destructive bg-destructive/5'
              )}
              placeholder="Email Address" 
            />
            {errors.email && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-primary">Security</label>
            <input 
              {...register('password')} 
              type="password" 
              autoComplete="new-password"
              className={cn(
                'w-full h-16 bg-secondary/30 rounded-2xl px-6 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/20 focus:bg-background focus:ring-2 focus:ring-primary focus:shadow-premium',
                errors.password && 'ring-2 ring-destructive bg-destructive/5'
              )}
              placeholder="Access Key (Min. 8 char)" 
            />
            {errors.password && <p className="text-[10px] font-bold text-destructive uppercase tracking-widest">{errors.password.message}</p>}
          </div>

          {error && <div className="text-[10px] font-bold text-destructive uppercase tracking-widest bg-destructive/10 p-4 rounded-xl text-center">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center h-16 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-premium transition-all disabled:opacity-40 active:scale-98"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Establish Profile'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
