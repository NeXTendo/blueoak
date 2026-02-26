import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background p-8 shadow-card text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <Mail className="h-8 w-8 text-brand-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Verify your email</h2>
        <p className="text-sm text-muted-foreground mb-6">
          We've sent a verification link to your email address. Click the link to activate your account.
        </p>
        <p className="text-xs text-muted-foreground">
          Didn't receive it?{' '}
          <button className="text-primary hover:underline">Resend email</button>
        </p>
        <div className="mt-6 border-t pt-6">
          <Link to={ROUTES.LOGIN} className="text-sm text-primary hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
