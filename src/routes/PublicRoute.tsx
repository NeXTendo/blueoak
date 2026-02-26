import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/lib/constants'

interface Props { children: React.ReactNode }

export default function PublicRoute({ children }: Props) {
  const { session, isInitialized } = useAuthStore()
  if (isInitialized && session) return <Navigate to={ROUTES.HOME} replace />
  return <>{children}</>
}
