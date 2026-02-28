import { useState, useEffect } from 'react'
import {
  Menu,
  Search,
  HelpCircle,
  Building2,
  UserPlus,
  MapPin,
  Calendar,
  Home,
  X,
  LayoutDashboard,
  Users,
  AlertTriangle,
  Settings,
  ShieldCheck
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { ROUTES, APP_NAME, PROPERTY_TYPES } from '@/lib/constants'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from './Container'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'

export function TopHeader() {
  const { profile, session } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const { isAdmin } = useRole()
  const [isScrolled, setIsScrolled] = useState(false)
  const isHomePage = location.pathname === ROUTES.HOME

  const [activeSearch, setActiveSearch] = useState<'location' | 'when' | 'type' | null>(null)
  const [filters, setFilters] = useState({ location: '', when: '', type: '' })

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const SUGGESTED_LOCATIONS = [
    { name: 'Lusaka, Zambia', sub: 'The Capital City' },
    { name: 'Johannesburg, RSA', sub: 'Sandton & Surroundings' },
    { name: 'Nairobi, Kenya', sub: 'Westlands & Kilimani' },
    { name: 'Cape Town, RSA', sub: 'Atlantic Seaboard' },
  ]

  // Mobile Header
  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border pt-[env(safe-area-inset-top)]">
        <Container className="py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="shrink-0">
              <span className="font-serif text-xl font-medium tracking-tight text-foreground">
                {APP_NAME}
              </span>
            </Link>

            {/* Search Box */}
            <button
              onClick={() => setActiveSearch('location')}
              className="flex-1 flex items-center gap-2.5 bg-secondary/30 border border-border/50 px-3.5 py-2.5 rounded-sm text-left transition-colors hover:border-[hsl(var(--gold))]"
            >
              <Search size={14} className="text-muted-foreground shrink-0" />
              <span className="text-[13px] font-medium text-foreground/70 truncate">
                {filters.location || 'Search locations...'}
              </span>
            </button>

            {/* Avatar */}
            <button onClick={() => navigate(session ? (isAdmin ? ROUTES.ADMIN : ROUTES.PROFILE) : ROUTES.LOGIN)} className="shrink-0 transition-transform active:scale-95">
              <Avatar className="h-8 w-8 ring-1 ring-border/50 rounded-sm">
                <AvatarImage src={profile?.avatar_url || undefined} className="rounded-sm object-cover" />
                <AvatarFallback className="bg-secondary text-foreground text-[11px] font-semibold rounded-sm">
                  {profile?.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </Container>
        <SearchDialog
          activeSearch={activeSearch}
          setActiveSearch={setActiveSearch}
          filters={filters}
          setFilters={setFilters}
          suggestedLocations={SUGGESTED_LOCATIONS}
        />
      </header>
    )
  }

  // Desktop Header
  return (
    <header
      className={cn(
        "hidden md:flex flex-col fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        isScrolled || !isHomePage
          ? "bg-background/98 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <Container className="h-18 flex items-center justify-between py-5">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link to={ROUTES.HOME} className="group">
            <span className={cn(
              "font-serif text-2xl font-medium tracking-tight transition-colors duration-300",
              isScrolled || !isHomePage ? "text-foreground" : "text-white"
            )}>
              {APP_NAME}
            </span>
          </Link>
        </div>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { label: 'Buy', to: `${ROUTES.SEARCH}?lt=sale` },
            { label: 'Rent', to: `${ROUTES.SEARCH}?lt=rent` },
            { label: 'New Developments', to: `${ROUTES.SEARCH}?sort=newest` },
          ].map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[hsl(var(--gold))] after:transition-all hover:after:w-full",
                isScrolled || !isHomePage ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Scrolled search pill (homepage only) */}
        <div className={cn(
          "absolute left-1/2 -translate-x-1/2 transition-all duration-400",
          isHomePage && isScrolled ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-1"
        )}>
          <button
            onClick={() => setActiveSearch('location')}
            className="flex items-center gap-3 bg-background border border-border shadow-card px-4 py-2 rounded-full hover:shadow-card-hover transition-shadow text-sm"
          >
            <Search size={14} className="text-muted-foreground" />
            <span className="text-foreground/60 font-medium">{filters.location || 'Search properties...'}</span>
            <div className="w-px h-4 bg-border mx-1" />
            <span className="text-[hsl(var(--gold))] font-semibold text-xs uppercase tracking-wide">Search</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-5">
          {isAdmin ? (
            <Link
              to={ROUTES.ADMIN}
              className={cn(
                "hidden lg:flex items-center gap-1.5 text-sm font-medium transition-colors",
                isScrolled || !isHomePage ? "text-foreground/70 hover:text-gold" : "text-white/80 hover:text-white"
              )}
            >
              <ShieldCheck size={15} />
              Admin
            </Link>
          ) : (
            <Link
              to={ROUTES.ADD_PROPERTY}
              className={cn(
                "hidden lg:block text-sm font-medium transition-colors",
                isScrolled || !isHomePage ? "text-foreground/70 hover:text-gold" : "text-white/80 hover:text-white"
              )}
            >
              List Property
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-full border transition-all duration-200",
                isScrolled || !isHomePage
                  ? "border-border bg-background hover:shadow-card text-foreground"
                  : "border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
              )}>
                <Menu size={16} />
                <Avatar className="h-7 w-7">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className={cn(
                    "text-[10px] font-semibold",
                    isScrolled || !isHomePage ? "bg-secondary text-foreground" : "bg-white/20 text-white"
                  )}>
                    {profile?.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-premium border-border">
              {session ? (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate(isAdmin ? ROUTES.ADMIN : ROUTES.PROFILE)}
                    className="p-3 rounded-lg cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm">{profile?.full_name}</span>
                        {isAdmin && <ShieldCheck size={12} className="text-[hsl(var(--gold))]" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{isAdmin ? 'Administrator' : 'View profile'}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate(ROUTES.LOGIN)} className="p-3 rounded-lg font-semibold text-sm cursor-pointer">
                    Log in
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(ROUTES.REGISTER)} className="p-3 rounded-lg text-sm cursor-pointer text-muted-foreground">
                    Create account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              {isAdmin ? (
                <>
                  {[
                    { icon: LayoutDashboard, label: 'Dashboard', to: ROUTES.ADMIN },
                    { icon: Building2, label: 'Properties', to: ROUTES.ADMIN_PROPERTIES },
                    { icon: Users, label: 'Users', to: ROUTES.ADMIN_USERS },
                    { icon: AlertTriangle, label: 'Reports', to: ROUTES.ADMIN_REPORTS },
                    { icon: Settings, label: 'Settings', to: ROUTES.PLATFORM_SETTINGS },
                  ].map(({ icon: Icon, label, to }) => (
                    <DropdownMenuItem key={label} onClick={() => navigate(to)} className="p-3 rounded-lg cursor-pointer flex items-center gap-3">
                      <Icon size={15} className="text-muted-foreground" />
                      <span className="text-sm text-foreground/80">{label}</span>
                    </DropdownMenuItem>
                  ))}
                </>
              ) : (
                <>
                  <DropdownMenuItem className="p-3 rounded-lg cursor-pointer flex items-center gap-3">
                    <HelpCircle size={15} className="text-muted-foreground" />
                    <span className="text-sm text-foreground/80">Help</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(ROUTES.ADD_PROPERTY)} className="p-3 rounded-lg cursor-pointer flex items-center gap-3">
                    <Building2 size={15} className="text-muted-foreground" />
                    <span className="text-sm text-foreground/80">List a property</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 rounded-lg cursor-pointer flex items-center gap-3">
                    <UserPlus size={15} className="text-muted-foreground" />
                    <span className="text-sm text-foreground/80">Refer a seller</span>
                  </DropdownMenuItem>
                </>
              )}

              {session && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="p-3 rounded-lg cursor-pointer text-destructive text-sm font-medium">
                    Sign out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Container>

      {/* Expanded desktop search bar — only on homepage, before scroll */}
      <div className={cn(
        "overflow-hidden transition-all duration-500",
        isHomePage && !isScrolled ? "max-h-24 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <div className="pb-6 flex justify-center">
          <button
            onClick={() => setActiveSearch('location')}
            className="flex items-center bg-white/10 backdrop-blur-md border border-white/25 shadow-lg rounded-full px-2 py-2 transition-all hover:bg-white/20 w-[85%] max-w-2xl"
          >
            <div className="flex-1 flex flex-col items-start px-6 text-left border-r border-white/20">
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-0.5">Location</span>
              <span className="text-sm font-medium text-white/80 truncate w-full">{filters.location || 'Anywhere'}</span>
            </div>
            <div className="flex-1 flex flex-col items-start px-6 text-left border-r border-white/20">
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-0.5">Timeline</span>
              <span className="text-sm font-medium text-white/80 truncate w-full">{filters.when || 'Any time'}</span>
            </div>
            <div className="flex-1 flex flex-col items-start px-6 text-left">
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-0.5">Property Type</span>
              <span className="text-sm font-medium text-white/80 truncate w-full">{filters.type || 'All types'}</span>
            </div>
            <div className="h-10 w-10 bg-[hsl(var(--gold))] text-white rounded-full flex items-center justify-center shrink-0 ml-3 shadow-gold-glow">
              <Search size={16} strokeWidth={2.5} />
            </div>
          </button>
        </div>
      </div>

      <SearchDialog
        activeSearch={activeSearch}
        setActiveSearch={setActiveSearch}
        filters={filters}
        setFilters={setFilters}
        suggestedLocations={SUGGESTED_LOCATIONS}
      />
    </header>
  )
}

function SearchDialog({ activeSearch, setActiveSearch, filters, setFilters, suggestedLocations }: any) {
  return (
    <Dialog open={activeSearch !== null} onOpenChange={(open) => !open && setActiveSearch(null)}>
      <DialogContent className="w-[95vw] max-w-xl bg-background border border-border p-0 overflow-hidden rounded-2xl shadow-premium flex flex-col max-h-[85vh]">
        <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <DialogTitle className="font-serif text-2xl font-medium">
              {activeSearch === 'location' && 'Where are you looking?'}
              {activeSearch === 'when' && 'Your timeline'}
              {activeSearch === 'type' && 'Property category'}
            </DialogTitle>
            <DialogClose className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors shrink-0">
              <X size={15} />
            </DialogClose>
          </div>

          {activeSearch === 'location' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedLocations.map((loc: any) => (
                  <button
                    key={loc.name}
                    onClick={() => { setFilters({ ...filters, location: loc.name }); setActiveSearch('when') }}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border bg-secondary/30 hover:border-[hsl(var(--gold)/0.5)] hover:bg-[hsl(var(--gold)/0.06)] text-left transition-all group"
                  >
                    <div className="h-9 w-9 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                      <MapPin size={14} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-[hsl(var(--gold))] transition-colors">{loc.name}</p>
                      <p className="text-xs text-muted-foreground">{loc.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input
                  type="text"
                  placeholder="Type a city or region..."
                  className="w-full h-12 bg-secondary/50 rounded-lg pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 ring-[hsl(var(--gold)/0.4)] border border-border transition-all"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveSearch('when')}
                />
              </div>
            </div>
          )}

          {activeSearch === 'when' && (
            <div className="grid grid-cols-2 gap-3">
              {['Immediate', '3 Months', '6 Months', 'Flexible'].map((time) => (
                <button
                  key={time}
                  onClick={() => { setFilters({ ...filters, when: time }); setActiveSearch('type') }}
                  className="flex flex-col items-center justify-center p-6 rounded-lg border border-border bg-secondary/30 hover:border-[hsl(var(--gold)/0.5)] hover:bg-[hsl(var(--gold)/0.06)] transition-all gap-2"
                >
                  <Calendar size={18} className="text-muted-foreground" />
                  <span className="font-medium text-sm">{time}</span>
                </button>
              ))}
            </div>
          )}

          {activeSearch === 'type' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => { setFilters({ ...filters, type: type.label }); setActiveSearch(null) }}
                  className="flex flex-col items-center justify-center p-5 rounded-lg border border-border bg-secondary/30 hover:border-[hsl(var(--gold)/0.5)] hover:bg-[hsl(var(--gold)/0.06)] transition-all gap-2 group"
                >
                  <div className="h-9 w-9 rounded-full bg-background border border-border flex items-center justify-center group-hover:border-[hsl(var(--gold)/0.5)]">
                    <Home size={14} className="text-muted-foreground" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/70">{type.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border mt-auto">
            <button
              onClick={() => setFilters({ location: '', when: '', type: '' })}
              className="flex-1 h-11 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors text-foreground/70"
            >
              Clear
            </button>
            <button
              onClick={() => setActiveSearch(null)}
              className="flex-1 h-11 bg-[hsl(var(--gold))] text-white rounded-lg text-sm font-medium hover:brightness-105 transition-all shadow-gold-glow"
            >
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
