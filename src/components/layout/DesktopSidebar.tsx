import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, MessageCircle, User, LayoutDashboard, Settings, Building2 } from 'lucide-react'
import { useRole } from '@/hooks/useRole'
import { useNotificationStore } from '@/stores/notificationStore'
import { ROUTES, APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function DesktopSidebar() {
  const { isAdmin, isSeller } = useRole()
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  const renderNav = (items: any[]) => items.map(({ to, icon: Icon, label, badge }) => (
    <NavLink
      key={to}
      to={to}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300',
          isActive
            ? 'bg-primary text-primary-foreground shadow-premium'
            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon strokeWidth={isActive ? 2.5 : 1.5} className="h-4 w-4" />
          <span className="flex-1">{label}</span>
          {badge ? (
            <span className={cn(
              "flex h-5 min-w-5 items-center justify-center rounded-full text-[10px] font-black",
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
    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-background z-40 flex flex-col p-6 space-y-8">
      {/* Premium Logo */}
      <div className="flex items-center gap-3 px-4 py-2">
        <div className="h-3 w-3 rounded-full bg-primary" />
        <span className="text-xl font-black uppercase tracking-widest text-primary">
          {APP_NAME}
        </span>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 space-y-10">
        <div className="space-y-1">
          <div className="px-4 pb-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
            Explorer
          </div>
          {renderNav([
            { to: ROUTES.HOME,     icon: Home,          label: 'Portfolio' },
            { to: ROUTES.SEARCH,   icon: Search,        label: 'Discovery' },
            { to: ROUTES.SAVED,    icon: Heart,         label: 'Collection' },
            { to: ROUTES.MESSAGES, icon: MessageCircle, label: 'Concierge', badge: unreadCount },
            { to: ROUTES.PROFILE,  icon: User,          label: 'Identity' },
          ])}
        </div>

        {isSeller && (
          <div className="space-y-1">
            <div className="px-4 pb-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
              Management
            </div>
            {renderNav([
              { to: ROUTES.SELLER_DASHBOARD, icon: LayoutDashboard, label: 'Performance' },
              { to: ROUTES.SELLER_LISTINGS,  icon: Building2,       label: 'Inventory' },
              { to: ROUTES.SELLER_ANALYTICS, icon: Settings,        label: 'Settings' },
            ])}
          </div>
        )}

        {isAdmin && (
          <div className="space-y-1 border-t pt-8 border-secondary/50">
            <div className="px-4 pb-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
              Operations
            </div>
            {renderNav([
              { to: ROUTES.ADMIN,            icon: LayoutDashboard, label: 'Control' },
              { to: ROUTES.ADMIN_USERS,      icon: User,            label: 'Users' },
            ])}
          </div>
        )}
      </nav>

      {/* Footer info */}
      <div className="px-4 py-6 border-t border-secondary/50">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/20 italic">
          Premium Access
        </p>
      </div>
    </aside>
  )
}
