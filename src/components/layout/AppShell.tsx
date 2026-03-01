import { useEffect, ReactNode } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useRole } from '@/hooks/useRole'
import { TopHeader } from './TopHeader'
import BottomNav from './BottomNav'
import Footer from './Footer'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Pages that should NOT show navigation
const NO_NAV_ROUTES = [
  ROUTES.SPLASH, ROUTES.ONBOARDING, ROUTES.LOGIN,
  ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD, ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_EMAIL,
]

export default function AppShell({ children }: { children?: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { isAdmin } = useRole()

  // Fix: Layout shifts and already-scrolled pages
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Redirect admins away from standard pages
  const { session } = useAuthStore()
  useEffect(() => {
    const standardPages = [
      ROUTES.HOME,
      ROUTES.SEARCH,
      ROUTES.SAVED,
      ROUTES.MESSAGES,
      ROUTES.PROFILE,
      ROUTES.MAP
    ]
    
    // Only redirect if fully authed and loaded
    if (session && isAdmin && standardPages.includes(location.pathname as any)) {
      navigate(ROUTES.ADMIN, { replace: true })
    }
  }, [isAdmin, session, location.pathname, navigate])

  // Page types and visibility logic
  const isConversationPage = location.pathname.startsWith('/messages/') && location.pathname !== '/messages'
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin')
  const isHomePage = location.pathname === ROUTES.HOME
  
  const showNav = !NO_NAV_ROUTES.includes(location.pathname as typeof ROUTES.SPLASH) && !isConversationPage
  const isViewportPage = isConversationPage || location.pathname === ROUTES.MAP

  return (
    <div className="flex h-dvh bg-background selection:bg-primary/20 selection:text-foreground overflow-hidden">
      <div className={cn(
        "flex-1 min-w-0 flex flex-col h-full",
        showNav && isMobile ? 'pb-[calc(3.75rem+env(safe-area-inset-bottom,0px))]' : ''
      )}>
        {showNav && !isAdminPage && (!isMobile || isHomePage) && <TopHeader />}

        <div className={cn(
          "flex-1 relative",
          !isViewportPage && "overflow-y-auto overscroll-none"
        )}>
          {children || <Outlet />}
          {showNav && !isAdminPage && !isMobile && !isViewportPage && <Footer />}
        </div>
      </div>

      {showNav && isMobile && <BottomNav />}
    </div>
  )
}
