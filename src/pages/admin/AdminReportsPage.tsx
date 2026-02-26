import { useState } from 'react'
import { 
  AlertTriangle, 
  MessageSquare, 
  ShieldAlert, 
  ChevronRight, 
  Flag,
  User,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import EmptyState from '@/components/common/EmptyState'

const MOCK_REPORTS = [
  { 
    id: 'REP-742', 
    type: 'Inaccurate Listing', 
    severity: 'medium', 
    reporter: 'John Tembo', 
    target: 'Modern Villa - Roma',
    status: 'open',
    time: '4 hours ago',
    description: "The property photos don't match the current state. The swimming pool is non-functional."
  },
  { 
    id: 'REP-743', 
    type: 'User Misconduct', 
    severity: 'high', 
    reporter: 'Sarah Chanda', 
    target: 'Kelvin Phiri (Agent)',
    status: 'investigating',
    time: '6 hours ago',
    description: 'Agent requested off-platform payment to bypass system fees.'
  },
  { 
    id: 'REP-744', 
    type: 'Technical Issue', 
    severity: 'low', 
    reporter: 'Samantha M.', 
    target: 'Add Property Protocol',
    status: 'resolved',
    time: 'Yesterday',
    description: 'Unable to upload media files in HEIC format.'
  }
]

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState('open')

  const filteredReports = MOCK_REPORTS.filter(r => 
    activeTab === 'all' || r.status === activeTab
  )

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="border-b border-border/50 py-12 bg-primary/5">
        <Container>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Incident Log</h1>
              <p className="text-muted-foreground font-medium italic">Resolution protocols for platform violations and disputes.</p>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] gap-2">
                  <ShieldAlert size={16} />
                  Security Audit
               </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container className="space-y-12">
           {/* Report Stats */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Unresolved', value: '7', color: 'text-red-500', bg: 'bg-red-500/10' },
                { label: 'Investigating', value: '4', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Resolved (24h)', value: '12', color: 'text-green-500', bg: 'bg-green-500/10' }
              ].map((stat) => (
                <div key={stat.label} className="p-8 rounded-[2.5rem] border border-secondary/50 shadow-premium flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{stat.label}</p>
                      <h3 className="text-3xl font-black tracking-tighter">{stat.value}</h3>
                   </div>
                   <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                      <Flag className={cn("h-6 w-6", stat.color)} />
                   </div>
                </div>
              ))}
           </div>

           {/* Filters */}
           <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['open', 'investigating', 'resolved', 'all'].map((tab) => (
                <Button 
                  key={tab}
                  variant={activeTab === tab ? 'default' : 'outline'}
                  className={cn("h-10 px-6 rounded-full font-black text-[10px] uppercase tracking-widest border-2", 
                    activeTab === tab ? "shadow-lg shadow-primary/20" : "border-border/50"
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
           </div>

           {/* Report Cards */}
           <div className="space-y-4">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <Card key={report.id} className="rounded-[2.5rem] border border-secondary/50 shadow-premium overflow-hidden hover:border-primary/30 transition-all duration-300">
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Identity Section */}
                        <div className="lg:col-span-1 space-y-4">
                          <div className="flex items-center justify-between">
                              <Badge variant="outline" className="rounded-lg font-black text-[9px] uppercase tracking-widest px-2 py-0">
                                {report.id}
                              </Badge>
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{report.time}</span>
                          </div>
                          <div className="space-y-1">
                              <h3 className="text-lg font-black tracking-tight">{report.type}</h3>
                              <div className={cn("flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest", 
                                report.severity === 'high' ? "text-red-500" :
                                report.severity === 'medium' ? "text-amber-500" :
                                "text-blue-500"
                              )}>
                                <AlertTriangle size={12} />
                                {report.severity} Priority
                              </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="lg:col-span-2 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Reporter</p>
                                <div className="flex items-center gap-2">
                                    <User size={14} className="text-primary/40" />
                                    <span className="text-xs font-bold">{report.reporter}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Target Protocol</p>
                                <div className="flex items-center gap-2">
                                    <Building2 size={14} className="text-primary/40" />
                                    <span className="text-xs font-bold truncate">{report.target}</span>
                                </div>
                              </div>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                              "{report.description}"
                          </p>
                        </div>

                        {/* Control Section */}
                        <div className="lg:col-span-1 flex flex-col justify-end gap-3">
                          <div className="flex items-center gap-2 mb-auto">
                              <Badge className={cn("rounded-full font-black text-[8px] uppercase tracking-widest px-3 py-0.5 border-none", 
                                report.status === 'resolved' ? "bg-green-500/10 text-green-500" :
                                report.status === 'investigating' ? "bg-amber-500/10 text-amber-500" :
                                "bg-red-500/10 text-red-500"
                              )}>
                                {report.status}
                              </Badge>
                          </div>
                          <div className="flex gap-2">
                              <Button variant="outline" className="flex-1 h-12 rounded-xl border-2 font-black uppercase tracking-widest text-[9px] gap-2">
                                <MessageSquare size={14} />
                                Contact
                              </Button>
                              <Button className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20">
                                Resolve
                                <ChevronRight size={14} />
                              </Button>
                          </div>
                        </div>
                    </div>
                  </Card>
                ))
              ) : (
                <EmptyState 
                  title="Optimal Integrity"
                  description="No incidents currently require attention. System health is normal."
                  icon="✅"
                />
              )}
           </div>
        </Container>
      </main>
    </div>
  )
}
