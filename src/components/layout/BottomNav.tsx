import { NavLink } from 'react-router-dom'
import {
  Home,
  Search,
  Heart,
  MessageCircle,
  User,
  LogIn,
  LayoutDashboard,
  Building2,
  Users,
  AlertTriangle,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useRole } from '@/hooks/useRole'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const LABELS: Record<string, string> = {
  [ROUTES.HOME]: 'Home',
  [ROUTES.SEARCH]: 'Search',
  [ROUTES.SAVED]: 'Saved',
  [ROUTES.MESSAGES]: 'Messages',
  [ROUTES.PROFILE]: 'Profile',
  [ROUTES.LOGIN]: 'Sign In',
  [ROUTES.ADMIN]: 'Dashboard',
  [ROUTES.ADMIN_PROPERTIES]: 'Listings',
  [ROUTES.ADMIN_USERS]: 'Users',
  [ROUTES.ADMIN_REPORTS]: 'Reports',
  [ROUTES.PLATFORM_SETTINGS]: 'Settings',
}

export default function BottomNav() {
  const session = useAuthStore((s) => s.session)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const { isAdmin } = useRole()

  const getNavItems = () => {
    if (!session) {
      return [
        { to: ROUTES.HOME, icon: Home },
        { to: ROUTES.SEARCH, icon: Search },
        { to: ROUTES.LOGIN, icon: LogIn, badge: false },
      ]
    }
    if (isAdmin) {
      return [
        { to: ROUTES.ADMIN, icon: LayoutDashboard },
        { to: ROUTES.ADMIN_PROPERTIES, icon: Building2 },
        { to: ROUTES.ADMIN_USERS, icon: Users },
        { to: ROUTES.ADMIN_REPORTS, icon: AlertTriangle, badge: true },
        { to: ROUTES.PLATFORM_SETTINGS, icon: Settings },
      ]
    }
    return [
      { to: ROUTES.HOME, icon: Home },
      { to: ROUTES.SEARCH, icon: Search },
      { to: ROUTES.SAVED, icon: Heart },
      { to: ROUTES.MESSAGES, icon: MessageCircle, badge: true },
      { to: ROUTES.PROFILE, icon: User },
    ]
  }

  const navItems = getNavItems()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)] shadow-bottom-nav">
      <nav className="flex h-[3.75rem] items-center justify-around max-w-lg mx-auto px-1">
        {navItems.map(({ to, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200 touch-target',
                isActive ? 'text-[hsl(var(--gold))]' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  strokeWidth={isActive ? 2 : 1.75}
                  className={cn("h-5 w-5 transition-transform duration-200", isActive && "scale-110")}
                />
                <span className={cn(
                  "text-[9px] font-medium uppercase tracking-[0.1em] transition-all duration-200",
                  isActive ? "text-[hsl(var(--gold))] opacity-100" : "opacity-50"
                )}>
                  {LABELS[to] || ''}
                </span>

                {badge && unreadCount > 0 && (
                  <span className="absolute top-2.5 right-[calc(50%-12px)] h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))]" />
                )}

                {/* Active indicator — gold underline */}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[hsl(var(--gold))] opacity-80" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
