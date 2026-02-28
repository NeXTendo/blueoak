import { useState } from 'react'
import { 
  AlertTriangle, 
  MessageSquare, 
  ShieldAlert, 
  ChevronRight, 
  Flag,
  User,
  Building2,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import EmptyState from '@/components/common/EmptyState'
import { useAdminReports } from '@/hooks/useAdmin'

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState('open')
  const { data: reports, isLoading } = useAdminReports(activeTab)

  const stats = [
    { label: 'Unresolved', value: reports?.filter((r: any) => r.status === 'open').length || 0, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Investigating', value: reports?.filter((r: any) => r.status === 'under_review').length || 0, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Resolved (All)', value: reports?.filter((r: any) => r.status === 'resolved').length || 0, color: 'text-green-500', bg: 'bg-green-500/10' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

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
              {stats.map((stat) => (
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
              {['open', 'under_review', 'resolved', 'all'].map((tab) => (
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
              {reports && reports.length > 0 ? (
                reports.map((report: any) => (
                  <Card key={report.id} className="rounded-[2.5rem] border border-secondary/50 shadow-premium overflow-hidden hover:border-primary/30 transition-all duration-300">
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Identity Section */}
                        <div className="lg:col-span-1 space-y-4">
                          <div className="flex items-center justify-between">
                              <Badge variant="outline" className="rounded-lg font-black text-[9px] uppercase tracking-widest px-2 py-0">
                                {report.id.substring(0, 8)}
                              </Badge>
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                                {new Date(report.created_at).toLocaleDateString()}
                              </span>
                          </div>
                          <div className="space-y-1">
                              <h3 className="text-lg font-black tracking-tight">{report.report_type}</h3>
                              <div className={cn("flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-blue-500")}>
                                <AlertTriangle size={12} />
                                System Integrity
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
                                    <span className="text-xs font-bold">{report.reporter?.full_name || 'Anonymous'}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Target Protocol</p>
                                <div className="flex items-center gap-2">
                                    <Building2 size={14} className="text-primary/40" />
                                    <span className="text-xs font-bold truncate">{report.property?.title || report.reported?.full_name || 'System Event'}</span>
                                </div>
                              </div>
                          </div>
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                              "{report.reason}"
                          </p>
                        </div>

                        {/* Control Section */}
                        <div className="lg:col-span-1 flex flex-col justify-end gap-3">
                          <div className="flex items-center gap-2 mb-auto">
                              <Badge className={cn("rounded-full font-black text-[8px] uppercase tracking-widest px-3 py-0.5 border-none", 
                                report.status === 'resolved' ? "bg-green-500/10 text-green-500" :
                                report.status === 'under_review' ? "bg-amber-500/10 text-amber-500" :
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
