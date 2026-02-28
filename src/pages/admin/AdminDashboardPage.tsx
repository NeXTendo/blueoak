import { 
  Users, 
  Building2, 
  AlertTriangle, 
  TrendingUp,
  ArrowUpRight,
  Activity,
  FileText,
  UserCheck,
  Loader2,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Container from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useAdminStats } from '@/hooks/useAdmin'

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats()

  const ADMIN_STATS = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Active Assets',
      value: stats?.active_properties || 0,
      icon: Building2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Open Reports',
      value: stats?.open_reports || 0,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Revenue',
      value: new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(stats?.total_revenue || 0),
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ]

  const SYSTEM_HEALTH = [
    { label: 'Cloud Database', status: 'stable', value: 99.9 },
    { label: 'Auth Protocols', status: 'stable', value: 99.7 },
    { label: 'Media Storage', status: 'stable', value: 98.4 },
    { label: 'Email Dispatch', status: 'warning', value: 85.2 }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border/50 py-6 md:py-12 bg-primary/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-none font-black text-[9px] uppercase tracking-widest px-3">Overwatch</Badge>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">System v2.4.0</span>
               </div>
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Global Oversight</h1>
              <p className="text-muted-foreground font-medium italic">Administrative control protocols and system metrics.</p>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-6 md:py-12">
        <Container className="space-y-6 md:space-y-12">
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {ADMIN_STATS.map((stat) => (
              <Card key={stat.title} className="rounded-[1.5rem] md:rounded-[2.5rem] border border-secondary/50 shadow-premium overflow-hidden hover:border-primary/30 transition-all duration-500">
                <CardContent className="p-6 md:p-8 space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-4 rounded-2xl", stat.bgColor)}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.title}</p>
                    <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             {/* System Health Panel */}
             <div className="space-y-4 md:space-y-6">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                   <Activity className="text-primary" size={24} />
                   System Health
                </h2>
                <Card className="rounded-[2rem] md:rounded-[3rem] border border-secondary/50 p-6 md:p-10 space-y-6 md:space-y-8 shadow-premium">
                   {SYSTEM_HEALTH.map((item) => (
                     <div key={item.label} className="space-y-3">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className="text-muted-foreground">{item.label}</span>
                           <span className={cn(item.status === 'stable' ? "text-green-500" : "text-amber-500")}>
                              {item.value}%
                           </span>
                        </div>
                        <Progress value={item.value} className="h-2 rounded-full bg-secondary/30" />
                     </div>
                   ))}
                   <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-black uppercase tracking-widest text-[10px] mt-4">
                      Protocol Log
                   </Button>
                </Card>
             </div>

             {/* Recent Administrative Queue */}
             <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black uppercase tracking-tight">Active Queue Highlights</h2>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[10px]">Registry</Button>
                      <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[10px]">Assets</Button>
                      <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[10px]">Reports</Button>
                   </div>
                </div>
                
                <Card className="rounded-[3rem] border border-secondary/50 shadow-premium overflow-hidden">
                   <div className="divide-y divide-border/50">
                      {[
                        { primary: 'Property Approval', secondary: `${stats?.pending_properties || 0} listings awaiting manual review and validation`, time: 'Action Required', icon: UserCheck, color: 'text-amber-500' },
                        { primary: 'Security Incident', secondary: `${stats?.open_reports || 0} policy violations reported via platform oversight`, time: 'Priority', icon: AlertTriangle, color: 'text-red-500' },
                        { primary: 'Financial Sync', secondary: 'Automated platform revenue and subscription integrity check', time: 'Healthy', icon: FileText, color: 'text-blue-500' },
                        { primary: 'User Expansion', secondary: `${stats?.total_users || 0} unique identities currently registered on platform`, time: 'Growth', icon: TrendingUp, color: 'text-green-500' }
                      ].map((item, i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-secondary/10 transition-colors group cursor-pointer">
                           <div className="flex items-center gap-4 min-w-0">
                              <div className={cn("p-3 rounded-xl bg-background border border-border/50 group-hover:border-primary/30 transition-all", item.color)}>
                                 <item.icon size={20} />
                              </div>
                              <div className="min-w-0">
                                 <h4 className="text-sm font-black uppercase tracking-tight truncate">{item.primary}</h4>
                                 <p className="text-xs text-muted-foreground font-medium truncate">{item.secondary}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 shrink-0 px-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{item.time}</span>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                                 <ArrowUpRight size={18} />
                               </Button>
                           </div>
                        </div>
                      ))}
                   </div>
                </Card>
             </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
