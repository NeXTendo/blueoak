import { useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/useIsMobile'
import BottomNav from './BottomNav'
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

import Footer from './Footer'

export default function AppShell({ children }: Props) {
  const location = useLocation()
  const isMobile = useIsMobile()

  // Show nav on all pages except auth/onboarding pages (guests included)
  const showNav = !NO_NAV_ROUTES.includes(location.pathname as typeof ROUTES.SPLASH)
  
  // Show header and footer only on homepage
  const isHomePage = location.pathname === ROUTES.HOME

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Main content */}
      <main className={cn(
        "flex-1 min-w-0 flex flex-col",
        showNav && isMobile ? 'pb-16' : ''
      )}>
        {isHomePage && showNav && <TopHeader />}
        
        <div className="flex-1 relative">
          {children}
        </div>

        {isHomePage && showNav && <Footer />}
      </main>

      {/* Mobile bottom nav */}
      {showNav && isMobile && <BottomNav />}
    </div>
  )
}

