import {
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
  Download,
  Info,
  ChevronRight,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Container from '@/components/layout/Container'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

export default function SellerAnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="border-b border-border/50 py-12 bg-secondary/10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Performance Intelligence</h1>
              <p className="text-muted-foreground font-medium italic">Behavioral analytics and conversion protocols.</p>
            </div>
            <div className="flex items-center gap-3">
               <Select defaultValue="30d">
                  <SelectTrigger className="h-12 w-44 rounded-xl border-2 font-bold bg-background">
                    <Calendar className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                  </SelectContent>
               </Select>
               <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-2">
                  <Download size={18} />
               </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container className="space-y-12">
          {/* Top Level Intelligence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="rounded-[2.5rem] border-2 border-primary/10 bg-primary/5 p-8 flex flex-col justify-between shadow-premium">
                <div className="space-y-4">
                   <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center">
                      <TrendingUp size={24} />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Strategic Growth</h3>
                      <p className="text-3xl font-black tracking-tighter">+24.8%</p>
                   </div>
                </div>
                <p className="mt-6 text-xs font-bold text-muted-foreground leading-relaxed">
                   Overall visibility increase across the Roman and Rhodes Park districts.
                </p>
             </Card>

             <Card className="rounded-[2.5rem] border-2 border-secondary/50 p-8 flex flex-col justify-between shadow-premium">
                <div className="space-y-4">
                   <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center">
                      <Target size={24} />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Lead Precision</h3>
                      <p className="text-3xl font-black tracking-tighter">12.4%</p>
                   </div>
                </div>
                <p className="mt-6 text-xs font-bold text-muted-foreground leading-relaxed">
                   High-fidelity conversion rate from asset view to viewing protocol initiation.
                </p>
             </Card>

             <Card className="rounded-[2.5rem] border-2 border-secondary/50 p-8 flex flex-col justify-between shadow-premium">
                <div className="space-y-4">
                   <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center">
                      <Users size={24} />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Total Impressions</h3>
                      <p className="text-3xl font-black tracking-tighter">4.2k</p>
                   </div>
                </div>
                <p className="mt-6 text-xs font-bold text-muted-foreground leading-relaxed">
                   Unique identity tokens interacting with your asset portfolio.
                </p>
             </Card>
          </div>

          <Separator className="bg-border/50" />

          {/* Visual Data Layer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black uppercase tracking-tight">Engagement Flow</h2>
                   <Badge variant="secondary" className="rounded-full font-black text-[9px] uppercase tracking-widest px-3">Live Feed</Badge>
                </div>
                <Card className="rounded-[3rem] border-2 border-secondary/50 p-10 h-[400px] flex items-center justify-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   
                   {/* Visual Placeholder for a complex Chart Component */}
                   <div className="flex items-end gap-3 w-full h-full max-h-[200px] relative z-10 px-4">
                      {[40, 70, 45, 90, 65, 80, 55, 75, 50, 85].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-primary/20 rounded-t-xl hover:bg-primary transition-all duration-500 cursor-pointer relative group/bar"
                          style={{ height: `${h}%` }}
                        >
                           <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white px-2 py-1 rounded text-[10px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity">
                              {h}%
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   <div className="absolute bottom-8 left-10 flex items-center gap-2">
                      <BarChart3 className="text-primary" size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Portfolio Interaction Matrix</span>
                   </div>
                </Card>
             </div>

             <div className="space-y-6">
                <h2 className="text-2xl font-black uppercase tracking-tight">Asset Efficiency</h2>
                <div className="space-y-4">
                   {[
                     { name: 'Modern Villa - Roma', efficiency: 92, status: 'Optimal' },
                     { name: 'Office Complex - CBD', efficiency: 74, status: 'Monitoring' },
                     { name: 'Industrial Hub - Kafue', efficiency: 48, status: 'Attention Required' }
                   ].map((asset) => (
                     <div key={asset.name} className="p-6 rounded-[2rem] border border-secondary/50 bg-background hover:border-primary/30 transition-all duration-300 space-y-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-sm font-black uppercase tracking-tight">{asset.name}</h4>
                           <Badge variant="outline" className={cn("rounded-full font-black text-[8px] uppercase tracking-widest px-2 py-0 border-none", 
                              asset.efficiency > 80 ? "bg-green-500/10 text-green-500" :
                              asset.efficiency > 50 ? "bg-amber-500/10 text-amber-500" :
                              "bg-red-500/10 text-red-500"
                           )}>
                              {asset.status}
                           </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="flex-1 h-3 bg-secondary/30 rounded-full overflow-hidden">
                              <div 
                                 className={cn("h-full rounded-full transition-all duration-1000", 
                                    asset.efficiency > 80 ? "bg-green-500" :
                                    asset.efficiency > 50 ? "bg-amber-500" :
                                    "bg-red-500"
                                 )}
                                 style={{ width: `${asset.efficiency}%` }}
                              />
                           </div>
                           <span className="text-xs font-black tracking-tighter w-8">{asset.efficiency}%</span>
                        </div>
                        <div className="flex justify-end">
                           <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest gap-1">
                              Strategy Optimization
                              <ChevronRight size={12} />
                           </Button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Intelligence Brief */}
          <Card className="rounded-[3rem] border border-secondary/50 p-12 bg-secondary/5 space-y-8 shadow-premium">
             <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                   <Info size={20} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Intelligence Protocol Brief</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm font-medium text-muted-foreground leading-relaxed">
                <p>
                   Engagement focus has shifted towards mixed-use commercial space in the metropolitan core. Current portfolio shows a 15% under-utilization in residential lead engagement. Strategy recommendation: Optimize digital alias metadata for higher fidelity search placement.
                </p>
                <p>
                   Conversion metrics indicate high drop-off during the viewing schedule protocol. Recommended action: Implement simplified viewing confirmations and automated session reminders to maintain lead momentum.
                </p>
             </div>
          </Card>
        </Container>
      </main>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
