import { useAuthStore } from '@/stores/authStore'
import PageSkeleton from '@/components/skeletons/PageSkeleton'
import AuthModal from '@/components/auth/AuthModal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

interface Props { children: React.ReactNode }

export default function ProtectedRoute({ children }: Props) {
  const { session, isInitialized } = useAuthStore()
  const [showAuth, setShowAuth] = useState(true)
  const navigate = useNavigate()

  if (!isInitialized) return <PageSkeleton />
  if (!session) {
    return (
      <>
        <AuthModal
          open={showAuth}
          onClose={() => {
            setShowAuth(false)
            navigate(ROUTES.HOME)
          }}
          initialTab="login"
        />
      </>
    )
  }
  return <>{children}</>
}
