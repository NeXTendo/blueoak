import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/lib/constants'

interface Props {
  children: React.ReactNode
  roles: string[]
}

export default function RoleRoute({ children, roles }: Props) {
  const profile = useAuthStore((s) => s.profile)
  if (!profile || !roles.includes(profile.user_type)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }
  return <>{children}</>
}
