import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('blueoak-onboarded')
    const timer = setTimeout(() => {
      navigate(hasOnboarded ? ROUTES.HOME : ROUTES.ONBOARDING, { replace: true })
    }, 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-64 h-64">
        <DotLottieReact
          src="https://lottie.host/77b449e0-7c11-49ef-9014-b43e4dcb8ea8/7raqFEi1k1.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  )
}
