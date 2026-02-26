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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-sm">
      <nav className="flex h-16 items-center justify-around px-2 rounded-full border border-white/20 bg-background/70 backdrop-blur-2xl shadow-premium ring-1 ring-black/5 dark:ring-white/10">
        {navItems.map(({ to, icon: Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center h-12 w-12 rounded-full transition-all duration-300 touch-target',
                isActive
                  ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                  : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon strokeWidth={isActive ? 2.5 : 1.5} className="h-5 w-5" />
                {badge && unreadCount > 0 && (
                  <span className={cn(
                    "absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-background",
                    isActive ? "bg-primary-foreground" : "bg-primary animate-pulse"
                  )} />
                )}
                {isActive && (
                  <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-foreground opacity-50" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

