import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  Plus,
  ArrowRight,
  Clock,
  Eye,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Container from '@/components/layout/Container'
import { Progress } from '@/components/ui/progress'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import StatsCard from '@/components/dashboard/StatsCard'

const STATS = [
  {
    title: 'Total Revenue',
    value: '$1.2M',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
    description: 'Projected value of active listings'
  },
  {
    title: 'Total Listings',
    value: '24',
    change: '+2',
    trend: 'up',
    icon: Building2,
    description: '8 properties pending verification'
  },
  {
    title: 'Total Viewings',
    value: '156',
    change: '-4.2%',
    trend: 'down',
    icon: Users,
    description: 'Unique engagement sessions'
  },
  {
    title: 'Avg. Conversion',
    value: '8.4%',
    change: '+1.2%',
    trend: 'up',
    icon: BarChart3,
    description: 'Inquiry to viewing ratio'
  }
]

const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'inquiry',
    title: 'New Message',
    description: 'Samantha M. inquired about Modern Villa in Roma.',
    time: '2 hours ago',
    icon: MessageSquare,
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    id: '2',
    type: 'viewing',
    title: 'Viewing Scheduled',
    description: 'Virtual tour confirmed for Office Complex - Rhodes Park.',
    time: '5 hours ago',
    icon: Clock,
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    id: '3',
    type: 'system',
    title: 'Property Verified',
    description: 'Luxury Townhouse has been approved for public listing.',
    time: 'Yesterday',
    icon: Eye,
    color: 'bg-green-500/10 text-green-500'
  }
]

export default function SellerDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-border/50 py-12 bg-secondary/10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Command Center</h1>
              <p className="text-muted-foreground font-medium italic">Strategic overview of your real estate portfolio.</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild size="lg" className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                <Link to={ROUTES.ADD_PROPERTY}>
                  <Plus className="mr-2 h-5 w-5" />
                  Initiate Listing
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <StatsCard 
                key={stat.title}
                label={stat.title}
                value={stat.value}
                icon={stat.icon}
                trend={{
                  value: parseFloat(stat.change.replace(/[+%]/g, '')),
                  isUp: stat.trend === 'up',
                  label: stat.description
                }}
                variant={i === 0 ? 'primary' : 'default'}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Quick Actions & Progress */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Active Reach</h2>
                  <Button variant="ghost" className="font-black uppercase tracking-widest text-[10px] gap-2">
                    In-depth Analytics
                    <ArrowRight size={14} />
                  </Button>
                </div>
                
                <Card className="rounded-[2.5rem] border border-secondary/50 shadow-premium p-8 space-y-10">
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">Portfolio Visibility</span>
                            <span className="text-primary">84%</span>
                         </div>
                         <Progress value={84} className="h-3 rounded-full bg-secondary/30" />
                      </div>
                      <div className="space-y-3">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">Verification Completion</span>
                            <span className="text-primary">62%</span>
                         </div>
                         <Progress value={62} className="h-3 rounded-full bg-secondary/30" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 rounded-[1.5rem] border-2 flex flex-col items-start p-6 group hover:border-primary transition-all">
                         <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Manage Assets</span>
                         <span className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">My Listings</span>
                      </Button>
                      <Button variant="outline" className="h-20 rounded-[1.5rem] border-2 flex flex-col items-start p-6 group hover:border-primary transition-all">
                         <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">View Schedule</span>
                         <span className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">Upcoming sessions</span>
                      </Button>
                   </div>
                </Card>
              </div>
            </div>

            {/* Activity Log */}
            <div className="space-y-6">
               <h2 className="text-2xl font-black uppercase tracking-tight">Activity Log</h2>
               <div className="space-y-4">
                  {RECENT_ACTIVITY.map((activity) => (
                    <div key={activity.id} className="flex gap-4 p-5 rounded-[1.5rem] border border-secondary/50 bg-background hover:border-primary/30 transition-all duration-300">
                       <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", activity.color)}>
                          <activity.icon size={20} />
                       </div>
                       <div className="space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                             <h4 className="text-sm font-black uppercase tracking-tight truncate">{activity.title}</h4>
                             <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground shrink-0">{activity.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug font-medium">{activity.description}</p>
                       </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full h-12 rounded-xl border-2 font-black uppercase tracking-widest text-[10px]">
                     Full Protocol Export
                  </Button>
               </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
