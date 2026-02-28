import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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

interface Props { children: React.ReactNode }

export default function AppShell({ children }: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { isAdmin } = useRole()

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

  // Show nav on all pages except auth/onboarding pages and conversation views
  const isConversationPage = location.pathname.startsWith('/messages/') && location.pathname !== '/messages'
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/super-admin')
  const showNav = !NO_NAV_ROUTES.includes(location.pathname as typeof ROUTES.SPLASH) && !isConversationPage
  
  // Show header and footer only on homepage
  const isHomePage = location.pathname === ROUTES.HOME

  return (
    <div className="flex min-h-screen bg-background selection:bg-[hsl(var(--gold)/0.2)] selection:text-foreground">
      <main className={cn(
        "flex-1 min-w-0 flex flex-col",
        showNav && isMobile ? 'pb-[3.75rem]' : ''
      )}>
        {showNav && !isAdminPage && (!isMobile || isHomePage) && <TopHeader />}

        <div className="flex-1 relative">
          {children}
        </div>

        {showNav && !isAdminPage && !isMobile && <Footer />}
      </main>

      {showNav && isMobile && <BottomNav />}
    </div>
  )
}
