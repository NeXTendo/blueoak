import { useState } from 'react'
import { 
  AlertTriangle, 
  MessageSquare, 
  ShieldAlert, 
  ChevronRight, 
  Flag,
  User,
  Building2,
  Loader2,
  Clock,
  MoreVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import EmptyState from '@/components/common/EmptyState'
import { useAdminReports } from '@/hooks/useAdmin'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState('open')
  const { data: reports, isLoading } = useAdminReports(activeTab)

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

  const stats = [
    { label: 'Unresolved', count: reports?.filter((r: any) => r.status === 'open').length || 0, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Investigating', count: reports?.filter((r: any) => r.status === 'under_review').length || 0, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Resolved', count: reports?.filter((r: any) => r.status === 'resolved').length || 0, color: 'text-green-600', bg: 'bg-green-50' }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[hsl(var(--gold)/0.1)]">
      <AdminHeader />
      
      <main className="flex-1 py-10">
        <Container className="space-y-8">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif font-medium tracking-tight">Incident Oversight</h1>
              <p className="text-sm text-muted-foreground font-medium">Resolution protocols for platform violations and commercial disputes.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full font-bold uppercase tracking-widest text-[10px] h-10 px-6 gap-2">
                <ShieldAlert size={14} />
                Global Audit
              </Button>
            </div>
          </section>

          {/* Report Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/60 shadow-sm rounded-xl overflow-hidden group">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                    <h3 className="text-3xl font-serif font-medium tracking-tight">{stat.count}</h3>
                  </div>
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110 duration-300", stat.bg)}>
                    <Flag className={cn("h-5 w-5", stat.color)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters & Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 bg-secondary/20 p-1.5 rounded-full border border-border/40 w-fit">
              {['open', 'under_review', 'resolved', 'all'].map((tab) => (
                <Button 
                  key={tab}
                  variant={activeTab === tab ? 'secondary' : 'ghost'}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "rounded-full h-9 px-6 text-[10px] font-bold uppercase tracking-widest transition-all",
                    activeTab === tab && "bg-white shadow-sm text-foreground"
                  )}
                >
                  {tab}
                </Button>
              ))}
            </div>

            <div className="grid gap-4">
              {reports && reports.length > 0 ? (
                reports.map((report: any) => (
                  <Card key={report.id} className="border-border/60 shadow-sm rounded-2xl overflow-hidden hover:border-[hsl(var(--gold))]/40 transition-all duration-300 bg-white group">
                    <CardContent className="p-0">
                      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* ID & Type */}
                        <div className="lg:col-span-3 space-y-4">
                          <div className="flex items-center justify-between lg:justify-start lg:gap-3">
                            <Badge variant="outline" className="rounded-md font-bold text-[8px] uppercase tracking-widest border-border/60 px-2">
                              REF: {report.id.slice(0, 8)}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                              <Clock size={12} className="text-[hsl(var(--gold))]/60" />
                              {new Date(report.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-serif font-medium group-hover:text-[hsl(var(--gold))] transition-colors capitalize">
                              {report.report_type.replace(/_/g, ' ')}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-red-600">
                              <AlertTriangle size={12} />
                              Priority Alert
                            </div>
                          </div>
                        </div>

                        {/* Involved Parties */}
                        <div className="lg:col-span-6 space-y-4 lg:border-x lg:border-border/40 lg:px-8">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 italic">Reporter</p>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                  <User size={12} className="text-muted-foreground" />
                                </div>
                                <span className="text-xs font-bold">{report.reporter?.full_name || 'Anonymous'}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 italic">Strategic Target</p>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                                  <Building2 size={12} className="text-muted-foreground" />
                                </div>
                                <span className="text-xs font-bold truncate">
                                  {report.property?.title || report.reported?.full_name || 'System Event'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="relative pl-4 border-l-2 border-[hsl(var(--gold))]/20 py-1">
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic line-clamp-2">
                              "{report.reason}"
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-3 flex flex-col md:flex-row lg:flex-col gap-3">
                          <div className="flex items-center justify-end gap-2 mb-auto lg:hidden">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-xs font-bold uppercase">Resolve</DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-bold uppercase">Investigate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="hidden lg:flex items-center justify-end mb-4">
                            <Badge className={cn(
                              "rounded-full font-bold text-[8px] uppercase tracking-widest px-3 py-1 shadow-none",
                              report.status === 'resolved' ? "bg-green-50 text-green-600" :
                              report.status === 'under_review' ? "bg-amber-50 text-amber-600" :
                              "bg-red-50 text-red-600"
                            )}>
                              {report.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 w-full">
                            <Button variant="outline" className="flex-1 h-10 rounded-lg font-bold uppercase tracking-widest text-[9px] gap-2 border-border/60 hover:bg-secondary transition-all">
                              <MessageSquare size={14} />
                              Contact
                            </Button>
                            <Button className="flex-1 h-10 rounded-lg bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold))]/90 font-bold uppercase tracking-widest text-[9px] gap-2 shadow-sm transition-all group/btn">
                              Resolve
                              <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-border/60 shadow-sm rounded-[2rem] bg-white py-20">
                  <EmptyState 
                    title="Optimal System Integrity"
                    description="No pending incidents require administrative intervention at this time."
                    icon="🛡️"
                  />
                </Card>
              )}
            </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
