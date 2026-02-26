import { useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useAuthStore } from '@/stores/authStore'
import BottomNav from './BottomNav'
import DesktopSidebar from './DesktopSidebar'
import { TopHeader } from './TopHeader'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Pages that should NOT show navigation
const NO_NAV_ROUTES = [
  ROUTES.SPLASH, ROUTES.ONBOARDING, ROUTES.LOGIN,
  ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_EMAIL,
]

interface Props { children: React.ReactNode }

export default function AppShell({ children }: Props) {
  const location = useLocation()
  const isMobile = useIsMobile()
  const session  = useAuthStore((s) => s.session)

  const showNav = session && !NO_NAV_ROUTES.includes(location.pathname as typeof ROUTES.SPLASH)

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Desktop sidebar */}
      {showNav && !isMobile && <DesktopSidebar />}

      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-500 min-w-0 flex flex-col",
        showNav && !isMobile ? 'pl-72' : '',
        showNav && isMobile ? 'pb-32' : ''
      )}>
        {showNav && !isMobile && <TopHeader />}
        
        <div className="flex-1 relative overflow-auto">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      {showNav && isMobile && <BottomNav />}
    </div>
  )
}
