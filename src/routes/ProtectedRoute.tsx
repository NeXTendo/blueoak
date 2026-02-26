import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/lib/constants'
import PageSkeleton from '@/components/skeletons/PageSkeleton'

interface Props { children: React.ReactNode }

export default function ProtectedRoute({ children }: Props) {
  const { session, isInitialized } = useAuthStore()
  const location = useLocation()

  if (!isInitialized) return <PageSkeleton />
  if (!session) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  return <>{children}</>
}
