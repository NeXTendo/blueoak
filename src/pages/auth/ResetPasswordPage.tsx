import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-card">
        <h2 className="text-xl font-bold mb-4">Set new password</h2>
        <p className="text-sm text-muted-foreground mb-4">Enter your new password below.</p>
        {/* TODO: Implement with Supabase updateUser */}
        <Link to={ROUTES.LOGIN} className="text-sm text-primary hover:underline">Back to login</Link>
      </div>
    </div>
  )
}
