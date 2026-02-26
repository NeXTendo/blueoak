import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { forgotPasswordSchema } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const email = watch('email')

  async function onSubmit(data: { email: string }) {
    try { setError(null); await forgotPassword(data.email); setSent(true) }
    catch (e) { setError(e instanceof Error ? e.message : 'Failed to send reset email.') }
  }

  if (sent) return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background p-8 shadow-card text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h2 className="text-xl font-bold mb-2">Check your email</h2>
        <p className="text-sm text-muted-foreground mb-6">We sent a password reset link to <strong>{email}</strong></p>
        <Link to={ROUTES.LOGIN} className="text-sm text-primary hover:underline">Back to login</Link>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send a reset link</p>
        </div>
        <div className="rounded-2xl bg-background p-6 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email address</label>
              <input {...register('email')} type="email"
                className={cn('w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary', errors.email && 'border-destructive')}
                placeholder="you@example.com" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            {error && <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
            <button type="submit" disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Send reset link
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
