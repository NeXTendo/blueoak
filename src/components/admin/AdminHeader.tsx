import { Link, useLocation } from 'react-router-dom'
import { 
  LogOut, 
  LayoutDashboard, 
  Building2, 
  Users, 
  AlertTriangle, 
  Settings,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES, APP_NAME } from '@/lib/constants'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Dashboard', to: ROUTES.ADMIN, icon: LayoutDashboard },
  { label: 'Properties', to: ROUTES.ADMIN_PROPERTIES, icon: Building2 },
  { label: 'Users', to: ROUTES.ADMIN_USERS, icon: Users },
  { label: 'Reports', to: ROUTES.ADMIN_REPORTS, icon: AlertTriangle },
  { label: 'Settings', to: ROUTES.PLATFORM_SETTINGS, icon: Settings },
]

export default function AdminHeader() {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <header className="bg-background border-b border-border sticky top-0 z-30">
      <Container>
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
              <ChevronLeft size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="font-serif text-xl font-medium tracking-tight text-foreground transition-colors">
                {APP_NAME} <span className="text-[hsl(var(--gold))] font-sans font-bold text-xs uppercase ml-1 tracking-widest">Admin</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <Button
                    key={item.to}
                    variant="ghost"
                    asChild
                    className={cn(
                      "h-9 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
                      isActive 
                        ? "bg-secondary text-foreground" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <Link to={item.to}>
                      <item.icon size={14} className="mr-2" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logout()}
              className="h-9 px-3 md:px-4 rounded-full border-border hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all font-bold uppercase tracking-widest text-[10px] gap-2"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}
