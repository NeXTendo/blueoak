import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, MessageCircle, User, LogIn } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function BottomNav() {
  const session = useAuthStore((s) => s.session)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  // Guest nav: Home, Search, Sign In
  // Auth nav: Home, Search, Saved, Messages, Profile
  const navItems = session
    ? [
        { to: ROUTES.HOME,     icon: Home,          badge: false },
        { to: ROUTES.SEARCH,   icon: Search,        badge: false },
        { to: ROUTES.SAVED,    icon: Heart,         badge: false },
        { to: ROUTES.MESSAGES, icon: MessageCircle, badge: true },
        { to: ROUTES.PROFILE,  icon: User,          badge: false },
      ]
    : [
        { to: ROUTES.HOME,   icon: Home,   badge: false },
        { to: ROUTES.SEARCH, icon: Search, badge: false },
        { to: ROUTES.LOGIN,  icon: LogIn,  badge: false },
      ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border pb-[env(safe-area-inset-bottom)]">
      <nav className="flex h-16 items-center justify-around px-2 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center h-full w-20 transition-all duration-300 touch-target',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon strokeWidth={isActive ? 2.5 : 2} className="h-6 w-6" />
                {badge && unreadCount > 0 && (
                  <span className="absolute top-3 right-6 h-2 w-2 rounded-full border-2 border-background bg-primary" />
                )}
                {isActive && (
                   <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

