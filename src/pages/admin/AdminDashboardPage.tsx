import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Activity,
  Calendar,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Container from '@/components/layout/Container'
import { useAdminStats } from '@/hooks/useAdmin'
import AdminHeader from '@/components/admin/AdminHeader'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCurrencyStore } from '@/stores/currencyStore'
import { useFormatPrice } from '@/hooks/useFormatPrice'

export default function AdminDashboardPage() {
  const currency = useCurrencyStore((s) => s.currency)
  const { format } = useFormatPrice()
  const { data: stats, isLoading } = useAdminStats(currency)

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AdminHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--gold))]" />
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Active Assets',
      value: stats?.active_properties || 0,
      icon: Building2,
      trend: '+12%',
      trendUp: true,
      description: 'Live listings on platform'
    },
    {
      title: 'Global Identities',
      value: stats?.total_users || 0,
      icon: Users,
      trend: '+5%',
      trendUp: true,
      description: 'Registered platform users'
    },
    {
      title: 'Total Revenue',
      value: stats?.total_revenue ? format({ asking_price: stats.total_revenue }) : '0',
      icon: TrendingUp,
      trend: '+18%',
      trendUp: true,
      description: 'Gross transactional volume'
    },
    {
      title: 'Incident Log',
      value: stats?.open_reports || 0,
      icon: AlertTriangle,
      trend: '-2%',
      trendUp: false,
      description: 'Awaiting resolution'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[hsl(var(--gold)/0.1)] selection:text-foreground">
      <AdminHeader />
      
      <main className="flex-1 py-10">
        <Container className="space-y-10">
          <header className="flex flex-col gap-1">
            <h1 className="text-3xl font-serif font-medium tracking-tight text-foreground">
              Command Center
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Real-time platform intelligence and health metrics.
            </p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-[hsl(var(--gold)/0.1)] group-hover:text-[hsl(var(--gold))] transition-colors">
                      <stat.icon size={16} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <span className="text-3xl font-serif font-medium tracking-tight">
                        {stat.value}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[10px] font-bold py-0.5 px-1.5 rounded flex items-center gap-1",
                          stat.trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                        )}>
                          {stat.trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                          {stat.trend}
                        </span>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
                          vs last month
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
            {/* System Wellness */}
            <Card className="lg:col-span-2 border border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-serif">System Wellness</CardTitle>
                    <CardDescription className="text-xs font-medium uppercase tracking-widest">Global platform performance indexed</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                    <Activity size={16} className="text-[hsl(var(--gold))]" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        <span>Database Load</span>
                        <span className="text-foreground">24%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-[hsl(var(--gold))] rounded-full w-[24%]" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        <span>CDN Utilization</span>
                        <span className="text-foreground">62%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-[hsl(var(--gold))] rounded-full w-[62%]" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: 'Uptime', val: '99.99%', icon: Activity },
                      { label: 'Latency', val: '42ms', icon: Zap },
                      { label: 'Backups', val: 'Active', icon: Layers },
                      { label: 'Updates', val: 'Stable', icon: Calendar }
                    ].map((m) => (
                      <div key={m.label} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 transition-colors hover:bg-secondary/50 group">
                        <m.icon size={18} className="text-muted-foreground group-hover:text-[hsl(var(--gold))] transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{m.label}</span>
                        <span className="text-sm font-semibold">{m.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="text-lg font-serif">Rapid Response</CardTitle>
                <CardDescription className="text-xs font-medium uppercase tracking-widest">Core administrative triggers</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  <Button className="w-full h-11 rounded-lg bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold))]/90 font-bold uppercase tracking-widest text-[10px] shadow-sm">
                    New Global Listing
                  </Button>
                  <Button variant="outline" className="w-full h-11 rounded-lg border-border font-bold uppercase tracking-widest text-[10px] hover:bg-secondary transition-all">
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full h-11 rounded-lg border-border font-bold uppercase tracking-widest text-[10px] hover:bg-secondary transition-all">
                    System Audit
                  </Button>
                  <Button variant="ghost" className="w-full h-11 rounded-lg text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-[10px]">
                    Configure Toggles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  )
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.75 15.3 3 12 10.25h8L8.7 21 12 13.75H4z" />
    </svg>
  )
}
