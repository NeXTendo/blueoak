import { Bell, Search, Command } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useUnreadCount } from '@/hooks/useNotifications'
import { ROUTES } from '@/lib/constants'

export function TopHeader() {
  const profile = useAuthStore((s) => s.profile)
  const unread = useUnreadCount()

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-secondary bg-background/80 backdrop-blur-2xl px-8 sticky top-0 z-40">
      {/* Left: Branding/Command Status */}
      <div className="flex items-center gap-6">
        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-premium group cursor-pointer hover:rotate-6 transition-transform">
          <Command size={20} className="text-primary-foreground group-hover:scale-110 transition-transform" />
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary leading-none">BlueOak</span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 italic">Asset Intelligence v1.0.4</span>
        </div>
        <div id="header-breadcrumb" className="ml-4" />
      </div>

      {/* Right: Actions Cabinet */}
      <div className="flex items-center gap-3">
        {/* Intelligence Search */}
        <Link
          to={ROUTES.SEARCH}
          title="Search Intelligence Matrix"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/30 text-muted-foreground transition-all hover:bg-secondary hover:text-primary active:scale-90"
          aria-label="Search"
        >
          <Search size={20} />
        </Link>

        {/* Global Notification Hub */}
        <Link
          to={ROUTES.PROFILE}
          title="Security & Alerts"
          className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/30 text-muted-foreground transition-all hover:bg-secondary hover:text-primary active:scale-90"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {unread > 0 && (
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background animate-pulse" />
          )}
        </Link>

        <div className="w-[1px] h-6 bg-secondary mx-2 md:block hidden" />

        {/* Identity Token */}
        {profile && (
          <Link 
            to={ROUTES.PROFILE} 
            title="Profile Identity"
            className="flex items-center gap-4 pl-2 group"
          >
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{profile.full_name}</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Authorized</span>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-[10px] font-black uppercase tracking-widest text-primary-foreground shadow-premium transition-all group-hover:scale-105 active:scale-95 group-hover:rotate-3">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover rounded-2xl" />
              ) : (
                profile.full_name.charAt(0).toUpperCase()
              )}
            </div>
          </Link>
        )}
      </div>
    </header>
  )
}
