import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES, APP_NAME } from '@/lib/constants'

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="animate-fade-in flex flex-col items-center gap-12">
        {/* Minimal Logo Mark */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-1000" />
          <svg viewBox="0 0 48 48" className="h-16 w-16 text-primary relative z-10" fill="none">
            <path d="M24 4L42 16V32L24 44L6 32V16L24 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M24 4V44M6 16L42 32M42 16L6 32" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
            <circle cx="24" cy="24" r="4" fill="currentColor" />
          </svg>
        </div>
        
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase text-primary">
            {APP_NAME}
          </h1>
          <p className="text-xs font-bold tracking-[0.5em] uppercase text-muted-foreground/60 transition-all">
            Luxury Real Estate
          </p>
        </div>
      </div>

      {/* Premium subtle loader */}
      <div className="absolute bottom-20 w-48 h-[2px] bg-secondary overflow-hidden rounded-full">
        <div className="h-full bg-primary animate-[slide-in-right_2.5s_ease-in-out_infinite] w-24" />
      </div>
    </div>
  )
}
