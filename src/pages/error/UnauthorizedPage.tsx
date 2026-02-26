import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="text-6xl mb-4">🔒</div>
      <h1 className="text-2xl font-bold mb-2">Access denied</h1>
      <p className="text-muted-foreground mb-8 max-w-xs">You don't have permission to view this page.</p>
      <Link to={ROUTES.HOME} className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
        Go to Home
      </Link>
    </div>
  )
}
