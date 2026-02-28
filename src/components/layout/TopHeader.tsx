import { useState, useEffect, useRef } from 'react'
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
  ChevronDown,
  LayoutDashboard,
  Users,
  AlertTriangle,
  Settings,
  ShieldCheck,
  Check
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { useCurrencyStore, CurrencyCode } from '@/stores/currencyStore'
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
import AuthModal from '@/components/auth/AuthModal'

const SUGGESTED_LOCATIONS = [
  { name: 'Lusaka', country: 'Zambia' },
  { name: 'Johannesburg', country: 'South Africa' },
  { name: 'Nairobi', country: 'Kenya' },
  { name: 'Cape Town', country: 'South Africa' },
  { name: 'Harare', country: 'Zimbabwe' },
  { name: 'Gaborone', country: 'Botswana' },
]

const TIMELINE_OPTIONS = ['Immediate', '3 Months', '6 Months', 'Flexible', 'Over a year']

export function TopHeader() {
  const { profile, session } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const { isAdmin } = useRole()
  const [isScrolled, setIsScrolled] = useState(false)
  const isHomePage = location.pathname === ROUTES.HOME
  const { currency: globalCurrency, setCurrency } = useCurrencyStore()

  const handleCurrencyChange = (c: CurrencyCode) => {
    setCurrency(c)
    window.location.reload()
  }

  const [authModal, setAuthModal] = useState<{ open: boolean; tab: 'login' | 'register' }>({ open: false, tab: 'login' })
  const openLogin = () => setAuthModal({ open: true, tab: 'login' })
  const openRegister = () => setAuthModal({ open: true, tab: 'register' })

  const [activeDropdown, setActiveDropdown] = useState<'location' | 'when' | 'type' | null>(null)
  const [filters, setFilters] = useState({ location: '', when: '', type: '' })
  const [locationQuery, setLocationQuery] = useState('')
  const searchBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.location) params.set('city', filters.location)
    if (filters.type) params.set('property_type', filters.type)
    if (filters.when) params.set('when', filters.when)
    setActiveDropdown(null)
    navigate(`${ROUTES.SEARCH}?${params.toString()}`)
  }

  const filteredLocations = SUGGESTED_LOCATIONS.filter(loc =>
    !locationQuery || loc.name.toLowerCase().includes(locationQuery.toLowerCase()) || loc.country.toLowerCase().includes(locationQuery.toLowerCase())
  )

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
              onClick={() => navigate(ROUTES.SEARCH)}
              className="flex-1 flex items-center gap-2.5 bg-secondary/30 border border-border/50 px-3.5 py-2.5 rounded-sm text-left transition-colors hover:border-[hsl(var(--gold))]"
            >
              <Search size={14} className="text-muted-foreground shrink-0" />
              <span className="text-[13px] font-medium text-foreground/70 truncate">
                Search properties...
              </span>
            </button>

            {/* Avatar */}
            <button onClick={() => session ? navigate(isAdmin ? ROUTES.ADMIN : ROUTES.PROFILE) : openLogin()} className="shrink-0 transition-transform active:scale-95">
              <Avatar className="h-8 w-8 ring-1 ring-border/50 rounded-sm">
                <AvatarImage src={profile?.avatar_url || undefined} className="rounded-sm object-cover" />
                <AvatarFallback className="bg-secondary text-foreground text-[11px] font-semibold rounded-sm">
                  {profile?.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            </button>
          </div>
        </Container>
      </header>
    )
  }

  // Desktop Header
  return (
    <header
      className={cn(
        "hidden md:flex flex-col fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        isScrolled || !isHomePage
          ? "bg-background/98 backdrop-blur-xl"
          : "bg-gradient-to-b from-black/50 to-transparent backdrop-blur-none"
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
            { label: 'Buy', to: `${ROUTES.SEARCH}?listing_type=sale` },
            { label: 'Rent', to: `${ROUTES.SEARCH}?listing_type=rent` },
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

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-5">
          {/* Currency Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "hidden lg:flex items-center gap-1.5 text-sm font-bold transition-colors uppercase tracking-widest",
                isScrolled || !isHomePage ? "text-foreground/70 hover:text-[hsl(var(--gold))]" : "text-white/80 hover:text-white"
              )}>
                {globalCurrency}
                <ChevronDown size={12} className="opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 rounded-xl border-border/50">
              {(['ZMW', 'USD', 'ZAR', 'KES', 'BWP', 'NGN', 'GHS', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                <DropdownMenuItem 
                  key={c}
                  onClick={() => handleCurrencyChange(c)}
                  className="font-bold cursor-pointer justify-between"
                >
                  {c}
                  {globalCurrency === c && <Check size={14} className="text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAdmin ? (
            <Link
              to={ROUTES.ADMIN}
              className={cn(
                "hidden lg:flex items-center gap-1.5 text-sm font-medium transition-colors",
                isScrolled || !isHomePage ? "text-foreground/70 hover:text-[hsl(var(--gold))]" : "text-white/80 hover:text-white"
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
                isScrolled || !isHomePage ? "text-foreground/70 hover:text-[hsl(var(--gold))]" : "text-white/80 hover:text-white"
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
                  <DropdownMenuItem onClick={openLogin} className="p-3 rounded-lg font-semibold text-sm cursor-pointer">
                    Log in
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openRegister} className="p-3 rounded-lg text-sm cursor-pointer text-muted-foreground">
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

      {/* Auth Modal */}
      <AuthModal
        open={authModal.open}
        onClose={() => setAuthModal(m => ({ ...m, open: false }))}
        initialTab={authModal.tab}
      />
      <div className={cn(
        "transition-all duration-500",
        isHomePage && !isScrolled
          ? "max-h-24 opacity-100 overflow-visible"
          : "max-h-0 opacity-0 overflow-hidden pointer-events-none"
      )}>
        <div className="pb-6 flex justify-center" ref={searchBarRef}>
          <div className="flex items-stretch bg-white/15 backdrop-blur-md border border-white/30 shadow-lg rounded-full w-[85%] max-w-2xl overflow-visible relative">

            {/* Location Segment */}
            <div className="relative flex-1">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'location' ? null : 'location')}
                className={cn(
                  "w-full flex flex-col items-start px-6 py-3 text-left rounded-l-full transition-colors",
                  activeDropdown === 'location' ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-0.5">Location</span>
                <span className="text-sm font-medium text-white truncate w-full">{filters.location || 'Anywhere'}</span>
              </button>

              {/* Location Dropdown */}
              {activeDropdown === 'location' && (
                <div className="absolute top-[calc(100%+12px)] left-0 w-80 bg-background rounded-2xl shadow-premium border border-border/60 overflow-hidden z-50">
                  <div className="p-4 border-b border-border/50">
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Type a city or region..."
                        className="w-full h-10 bg-secondary/40 rounded-lg pl-9 pr-4 text-sm font-medium outline-none focus:ring-2 ring-[hsl(var(--gold)/0.5)] border border-border"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && locationQuery) {
                            setFilters(f => ({ ...f, location: locationQuery }))
                            setLocationQuery('')
                            setActiveDropdown('when')
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-2">
                    {filteredLocations.map(loc => (
                      <button
                        key={loc.name}
                        onClick={() => {
                          setFilters(f => ({ ...f, location: `${loc.name}, ${loc.country}` }))
                          setLocationQuery('')
                          setActiveDropdown('when')
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 text-left transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <MapPin size={13} className="text-muted-foreground group-hover:text-[hsl(var(--gold))] transition-colors" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{loc.name}</p>
                          <p className="text-xs text-muted-foreground">{loc.country}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {filters.location && (
                    <div className="px-3 pb-3">
                      <button
                        onClick={() => { setFilters(f => ({ ...f, location: '' })); setLocationQuery('') }}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                      >
                        <X size={11} /> Clear location
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-px bg-white/20 my-2 shrink-0" />

            {/* Timeline Segment */}
            <div className="relative flex-1">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'when' ? null : 'when')}
                className={cn(
                  "w-full flex flex-col items-start px-6 py-3 text-left transition-colors",
                  activeDropdown === 'when' ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-0.5">Timeline</span>
                <span className="text-sm font-medium text-white truncate w-full flex items-center gap-1.5">
                  {filters.when || 'Any time'}
                  <ChevronDown size={12} className="text-white/50 mt-0.5" />
                </span>
              </button>

              {/* Timeline Dropdown */}
              {activeDropdown === 'when' && (
                <div className="absolute top-[calc(100%+12px)] left-0 w-56 bg-background rounded-2xl shadow-premium border border-border/60 overflow-hidden z-50">
                  <div className="p-2">
                    {TIMELINE_OPTIONS.map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setFilters(f => ({ ...f, when: option }))
                          setActiveDropdown('type')
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          filters.when === option
                            ? "bg-[hsl(var(--gold)/0.12)] text-[hsl(var(--gold))]"
                            : "hover:bg-secondary/50"
                        )}
                      >
                        <Calendar size={13} className="shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium">{option}</span>
                      </button>
                    ))}
                  </div>
                  {filters.when && (
                    <div className="px-3 pb-3 border-t border-border/40 pt-2">
                      <button
                        onClick={() => setFilters(f => ({ ...f, when: '' }))}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                      >
                        <X size={11} /> Clear
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-px bg-white/20 my-2 shrink-0" />

            {/* Property Type Segment */}
            <div className="relative flex-1">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                className={cn(
                  "w-full flex flex-col items-start px-6 py-3 text-left transition-colors",
                  activeDropdown === 'type' ? "bg-white/20" : "hover:bg-white/10"
                )}
              >
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-0.5">Property Type</span>
                <span className="text-sm font-medium text-white truncate w-full flex items-center gap-1.5">
                  {filters.type || 'All types'}
                  <ChevronDown size={12} className="text-white/50 mt-0.5" />
                </span>
              </button>

              {/* Type Dropdown */}
              {activeDropdown === 'type' && (
                <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-background rounded-2xl shadow-premium border border-border/60 overflow-hidden z-50 max-h-72 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setFilters(f => ({ ...f, type: '' }))
                        setActiveDropdown(null)
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-1",
                        !filters.type ? "bg-[hsl(var(--gold)/0.12)] text-[hsl(var(--gold))]" : "hover:bg-secondary/50"
                      )}
                    >
                      <Home size={13} className="shrink-0 text-muted-foreground" />
                      <span className="text-sm font-medium">All Types</span>
                    </button>
                    {PROPERTY_TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => {
                          setFilters(f => ({ ...f, type: type.value }))
                          setActiveDropdown(null)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          filters.type === type.value
                            ? "bg-[hsl(var(--gold)/0.12)] text-[hsl(var(--gold))]"
                            : "hover:bg-secondary/50"
                        )}
                      >
                        <Home size={13} className="shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              title="Search properties"
              onClick={handleSearch}
              className="h-12 w-12 bg-[hsl(var(--gold))] text-white rounded-full flex items-center justify-center shrink-0 m-1.5 shadow-gold-glow hover:brightness-105 transition-all"
            >
              <Search size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scrolled state: compact search in header */}
      {isScrolled && !isHomePage && (
        <div className="hidden" /> // slot for future use
      )}
    </header>
  )
}
