import { useState, useEffect } from 'react'
import { Menu, Search, HelpCircle, Building2, UserPlus, Gift, MapPin, Calendar, Home, X } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useAuth } from '@/hooks/useAuth'
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
  const [isScrolled, setIsScrolled] = useState(false)
  const isHomePage = location.pathname === ROUTES.HOME

  const [activeSearch, setActiveSearch] = useState<'location' | 'when' | 'type' | null>(null)
  const [filters, setFilters] = useState({
    location: '',
    when: '',
    type: ''
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

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

  // Mobile Header (Search Only)
  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b min-h-[4.5rem] h-auto pt-[env(safe-area-inset-top)] flex items-center shadow-sm overflow-hidden">
        <Container className="w-full py-2.5">
          <button 
            onClick={() => setActiveSearch('location')}
            className="flex items-center gap-3.5 w-full bg-background border border-border shadow-md p-2.5 px-4 rounded-full active:scale-[0.98] transition-all"
          >
            <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <Search size={16} className="text-primary" />
            </div>
            <div className="flex-1 flex items-center gap-2 divide-x divide-border overflow-hidden">
              <span className="text-[13px] font-semibold text-foreground leading-none whitespace-nowrap">Where to?</span>
              <span className="text-[11px] font-medium text-muted-foreground pl-2 truncate">Anywhere • Anytime</span>
            </div>
          </button>
        </Container>
        <SearchDialog activeSearch={activeSearch} setActiveSearch={setActiveSearch} filters={filters} setFilters={setFilters} suggestedLocations={SUGGESTED_LOCATIONS} />
      </header>
    )
  }

  // Desktop Header (Logo + Menu + Responsive Search)
  return (
    <header 
      className={cn(
        "hidden md:flex flex-col fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden",
        isHomePage && !isScrolled ? "h-44 shadow-none pt-4" : "h-20 shadow-sm"
      )}
    >
      <Container className="h-20 flex items-center justify-between shrink-0">
        {/* Left: Brand Identity */}
        <div className="flex-1 flex items-center justify-start">
          <Link to={ROUTES.HOME} className="flex items-center gap-2 group shrink-0">
            <span className="text-xl md:text-2xl font-semibold tracking-tight text-primary group-hover:opacity-80 transition-opacity">
              {APP_NAME}
            </span>
          </Link>
        </div>

        {/* Collapsed Search Pill (Visible when scrolled) */}
        <div className={cn(
          "flex-1 max-w-md mx-auto transition-all duration-300 transform",
          isScrolled || !isHomePage ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        )}>
           <button 
             onClick={() => setActiveSearch('location')}
             className="w-full flex items-center justify-between gap-4 px-4 py-2 border border-secondary rounded-full hover:shadow-md transition-shadow bg-background text-[13px] font-medium"
           >
              <div className="flex items-center gap-3 divide-x divide-border text-left">
                <span className="text-foreground shrink-0 px-2">{filters.location || "Anywhere"}</span>
                <span className="text-foreground/60 px-3 shrink-0">{filters.when || "Any time"}</span>
                <span className="text-muted-foreground px-3 truncate">{filters.type || "Add type"}</span>
              </div>
              <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0">
                <Search size={14} strokeWidth={3} />
              </div>
           </button>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <Link 
            to={ROUTES.ADD_PROPERTY} 
            className="hidden lg:block text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            List your property
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-2 border rounded-full hover:shadow-md transition-all active:scale-95 bg-background">
                <Menu size={18} className="ml-1 text-muted-foreground" />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-2 rounded-2xl shadow-premium border-secondary/20">
              {session ? (
                <>
                  <DropdownMenuItem onClick={() => navigate(ROUTES.PROFILE)} className="p-3 rounded-xl cursor-pointer">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[14px]">{profile?.full_name}</span>
                      <span className="text-[11px] text-muted-foreground">Manage Account</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => navigate(ROUTES.LOGIN)} className="p-3 rounded-xl font-semibold text-[14px] cursor-pointer">
                    Log in
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(ROUTES.REGISTER)} className="p-3 rounded-xl text-[14px] cursor-pointer">
                    Sign up
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                </>
              )}

              <DropdownMenuItem className="p-3 rounded-xl cursor-pointer flex items-center gap-3">
                <HelpCircle size={18} className="text-muted-foreground" />
                <span className="text-[14px] font-medium text-foreground/80">Help Center</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate(ROUTES.ADD_PROPERTY)} className="p-3 rounded-xl cursor-pointer flex flex-col items-start gap-1">
                <div className="flex items-center gap-3">
                  <Building2 size={18} className="text-muted-foreground" />
                  <span className="text-[14px] font-medium text-foreground/80">List your property/land</span>
                </div>
                <span className="text-[11px] text-muted-foreground pl-7">It's easy to start and reach many people.</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-3 rounded-xl cursor-pointer flex items-center gap-3">
                <UserPlus size={18} className="text-muted-foreground" />
                <span className="text-[14px] font-medium text-foreground/80">Refer a landlord/seller</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate(ROUTES.SEARCH)} className="p-3 rounded-xl cursor-pointer flex items-center gap-3">
                <Search size={18} className="text-muted-foreground" />
                <span className="text-[14px] font-medium text-foreground/80">Find your next home</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-3 rounded-xl cursor-pointer opacity-50 flex items-center gap-3">
                <Gift size={18} className="text-muted-foreground" />
                <span className="text-[14px] font-medium text-foreground/80">Gift cards (coming soon)</span>
              </DropdownMenuItem>

              {session && (
                <>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => logout()} className="p-3 rounded-xl cursor-pointer text-destructive font-semibold text-[14px]">
                    Log out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Container>

      {/* Desktop Expanded Search Bar (Visible when NOT scrolled on HomePage) */}
      <div className={cn(
        "h-24 flex items-start justify-center transition-all duration-300 overflow-hidden shrink-0",
        !isScrolled && isHomePage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-12 pointer-events-none"
      )}>
        <button 
          onClick={() => setActiveSearch('location')}
          className="flex items-center bg-background border border-secondary shadow-lg rounded-full px-2 py-1.5 transition-all hover:shadow-xl w-[90%] max-w-2xl"
        >
          <div className="flex-1 flex flex-col items-start px-8 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Location</span>
            <span className="text-sm font-semibold text-foreground/70 truncate w-full">{filters.location || "Anywhere"}</span>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1 flex flex-col items-start px-8 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">When</span>
            <span className="text-sm font-semibold text-foreground/70 truncate w-full">{filters.when || "Any time"}</span>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex-1 flex flex-col items-start px-8 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Type</span>
            <span className="text-sm font-semibold text-foreground/70 truncate w-full">{filters.type || "All types"}</span>
          </div>
          <div className="h-12 w-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0 ml-2 shadow-premium">
            <Search size={22} strokeWidth={3} />
          </div>
        </button>
      </div>

      <SearchDialog activeSearch={activeSearch} setActiveSearch={setActiveSearch} filters={filters} setFilters={setFilters} suggestedLocations={SUGGESTED_LOCATIONS} />
    </header>
  )
}

function SearchDialog({ activeSearch, setActiveSearch, filters, setFilters, suggestedLocations }: any) {
  return (
    <Dialog open={activeSearch !== null} onOpenChange={(open) => !open && setActiveSearch(null)}>
      <DialogContent className="w-[95vw] max-w-2xl bg-background/95 backdrop-blur-3xl border-secondary/20 p-0 overflow-hidden rounded-3xl md:rounded-[2rem] shadow-premium flex flex-col max-h-[85vh] mt-[env(safe-area-inset-top)] mb-[env(safe-area-inset-bottom)]">
        <div className="p-5 md:p-8 flex flex-col gap-6 md:gap-8 overflow-y-auto custom-scrollbar flex-1">
          <div className="flex items-center justify-between border-b pb-4 md:pb-6 shrink-0">
            <DialogTitle className="text-lg md:text-2xl font-bold tracking-tight leading-tight pr-4">
              {activeSearch === 'location' && "Where would you like to explore?"}
              {activeSearch === 'when' && "Choose your timeline"}
              {activeSearch === 'type' && "What style of asset?"}
            </DialogTitle>
            <DialogClose className="h-8 w-8 md:h-10 md:w-10 rounded-full border flex items-center justify-center hover:bg-secondary transition-colors shrink-0">
              <X size={16} className="md:w-[18px] md:h-[18px]" />
            </DialogClose>
          </div>

          {/* Location Selector */}
          {activeSearch === 'location' && (
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {suggestedLocations.map((loc: any) => (
                  <button 
                    key={loc.name}
                    onClick={() => {
                      setFilters({...filters, location: loc.name})
                      setActiveSearch('when')
                    }}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-2xl border bg-secondary/20 hover:bg-secondary hover:border-primary/20 text-left transition-all group"
                  >
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-background border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin size={18} className="md:w-5 md:h-5 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px] md:text-[15px] group-hover:text-primary transition-colors truncate">{loc.name}</span>
                      <span className="text-[11px] md:text-xs text-muted-foreground font-medium truncate">{loc.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="h-[1px] bg-secondary" />
              <div className="space-y-3 md:space-y-4">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground/40">Custom Search</span>
                <div className="relative">
                  <MapPin className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input 
                    type="text" 
                    placeholder="Enter city or region..."
                    className="w-full h-12 md:h-14 bg-secondary/30 rounded-xl pl-10 md:pl-14 pr-4 md:pr-6 text-sm md:text-base font-semibold outline-none focus:ring-2 ring-primary/20 border-none transition-all"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveSearch('when')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* When Selector */}
          {activeSearch === 'when' && (
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {['Immediate Acquisition', 'Within 3 Months', 'Within 6 Months', 'Strategic Hold'].map((time) => (
                  <button 
                    key={time}
                    onClick={() => {
                      setFilters({...filters, when: time})
                      setActiveSearch('type')
                    }}
                    className="flex flex-col items-center justify-center p-4 md:p-8 rounded-2xl border bg-secondary/20 hover:bg-secondary hover:border-primary/20 transition-all gap-2 md:gap-3 text-center"
                  >
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-background flex items-center justify-center md:mb-1">
                      <Calendar size={18} className="md:w-[22px] md:h-[22px] text-primary/60" />
                    </div>
                    <span className="font-bold text-[13px] md:text-[15px] leading-tight">{time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Type Selector */}
          {activeSearch === 'type' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {PROPERTY_TYPES.map((type) => (
                <button 
                  key={type.value}
                  onClick={() => {
                    setFilters({...filters, type: type.label})
                    setActiveSearch(null)
                  }}
                  className="flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border bg-secondary/20 hover:bg-secondary hover:border-primary/20 transition-all text-center gap-2 md:gap-3 group"
                >
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <Home size={16} className="md:w-[18px] md:h-[18px]" />
                  </div>
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-tight leading-tight">{type.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 md:gap-4 pt-4 md:pt-4 border-t border-secondary/30 shrink-0 mt-auto">
            <button 
              onClick={() => setFilters({location: '', when: '', type: ''})}
              className="flex-1 h-12 md:h-14 border rounded-xl font-bold text-xs md:text-sm hover:bg-secondary transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={() => setActiveSearch(null)}
              className="flex-1 h-12 md:h-14 bg-primary text-primary-foreground rounded-xl font-bold text-xs md:text-sm hover:opacity-90 transition-all shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
