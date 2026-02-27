import { NavLink, Link } from 'react-router-dom'
import { Home, Search, Heart, MessageCircle, User, LayoutDashboard, Settings, Building2, LogIn } from 'lucide-react'
import { useRole } from '@/hooks/useRole'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { ROUTES, APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function DesktopSidebar() {
  const { isAdmin, isSeller } = useRole()
  const session = useAuthStore((s) => s.session)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  const renderNav = (items: any[]) => items.map(({ to, icon: Icon, label, badge }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-4 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all duration-300',
          isActive
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon strokeWidth={isActive ? 2.5 : 2} className="h-5 w-5" />
          <span className="flex-1">{label}</span>
          {badge ? (
            <span className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full text-[11px] font-bold",
              isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
            )}>
              {badge > 99 ? '99+' : badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  ))

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-background z-40 flex flex-col p-6 space-y-8 border-r border-secondary/30">
      {/* Top Left Title */}
      <div className="flex items-center pt-2 pb-6 px-4">
        <span className="text-[20px] font-bold tracking-tight text-primary">
          {APP_NAME}
        </span>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 space-y-10">
        {/* Public browsing — always visible */}
        <div className="space-y-1">
          <div className="px-4 pb-3 text-[12px] font-bold text-muted-foreground/40">
            Explorer
          </div>
          {renderNav([
            { to: ROUTES.HOME,   icon: Home,   label: 'Portfolio' },
            { to: ROUTES.SEARCH, icon: Search, label: 'Discovery' },
          ])}
        </div>

        {/* Auth-required items — only when logged in */}
        {session && (
          <div className="space-y-1">
            <div className="px-4 pb-3 text-[12px] font-bold text-muted-foreground/40">
              Personal
            </div>
            {renderNav([
              { to: ROUTES.SAVED,    icon: Heart,         label: 'Collection' },
              { to: ROUTES.MESSAGES, icon: MessageCircle, label: 'Concierge', badge: unreadCount },
              { to: ROUTES.PROFILE,  icon: User,          label: 'Identity' },
            ])}
          </div>
        )}

        {session && isSeller && (
          <div className="space-y-1">
            <div className="px-4 pb-3 text-[12px] font-bold text-muted-foreground/40">
              Management
            </div>
            {renderNav([
              { to: ROUTES.SELLER_DASHBOARD, icon: LayoutDashboard, label: 'Performance' },
              { to: ROUTES.SELLER_LISTINGS,  icon: Building2,       label: 'Inventory' },
              { to: ROUTES.SELLER_ANALYTICS, icon: Settings,        label: 'Settings' },
            ])}
          </div>
        )}

        {session && isAdmin && (
          <div className="space-y-1 border-t pt-8 border-secondary/30">
            <div className="px-4 pb-3 text-[12px] font-bold text-muted-foreground/40">
              Operations
            </div>
            {renderNav([
              { to: ROUTES.ADMIN,       icon: LayoutDashboard, label: 'Control' },
              { to: ROUTES.ADMIN_USERS, icon: User,            label: 'Users' },
            ])}
          </div>
        )}
      </nav>

      {/* Footer — Sign In CTA for guests, or Premium label for logged in */}
      <div className="px-4 py-6 border-t border-secondary/30">
        {session ? (
          <p className="text-[12px] font-medium text-muted-foreground/30">
            Premium Access Enabled
          </p>
        ) : (
          <div className="space-y-3">
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center justify-center gap-2.5 w-full h-12 bg-primary text-primary-foreground rounded-xl text-[14px] font-bold transition-all hover:opacity-90 active:scale-95"
            >
              <LogIn size={16} />
              Sign In
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="flex items-center justify-center w-full h-11 border border-secondary/60 rounded-xl text-[14px] font-bold text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>

    </aside>
  )
}
