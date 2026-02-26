import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen-dvh flex-col items-center justify-center bg-gradient-to-b from-brand-navy to-brand-blue px-4 py-8">
      {/* Logo */}
      <Link to={ROUTES.SPLASH} className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-brand-navy text-lg">
          B
        </div>
        <span className="text-2xl font-bold text-white">BlueOak</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl">
        <Outlet />
      </div>

      <p className="mt-6 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} BlueOak. All rights reserved.
      </p>
    </div>
  )
}
