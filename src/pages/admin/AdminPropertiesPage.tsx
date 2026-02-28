import { useState } from 'react'
import { 
  Building2,
  Loader2,
  Lock,
  Star,
  Search,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAdminProperties, useAdminActions } from '@/hooks/useAdmin'
import { PropertyWithSeller } from '@/types/property'

export default function AdminPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: properties, isLoading } = useAdminProperties(statusFilter)
  const { approveProperty, rejectProperty } = useAdminActions()

  const filteredProperties = properties?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="border-b border-border/50 py-6 md:py-12 bg-primary/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">Global Asset List</h1>
              <p className="text-xs md:text-sm text-muted-foreground font-medium italic">Moderation and lifecycle management of platform assets.</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
               <Button variant="outline" className="h-10 md:h-14 px-4 md:px-8 rounded-xl md:rounded-2xl border-2 font-black uppercase tracking-widest text-[8px] md:text-[10px] gap-2">
                  <Lock size={14} />
                  Freeze
               </Button>
               <Button size="lg" className="rounded-xl md:rounded-2xl px-6 md:px-8 h-10 md:h-14 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-primary/20">
                  <Star className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Featured
               </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container className="space-y-8">
           {/* Controls */}
           <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-[32rem] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
              <Input 
                placeholder="Search assets..." 
                className="pl-12 h-12 md:h-14 bg-secondary/30 border-none rounded-xl md:rounded-[1.5rem] font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
               {['all', 'pending', 'active', 'rejected', 'archived'].map((tab) => (
                 <Button 
                   key={tab}
                   variant={statusFilter === tab ? 'default' : 'outline'}
                   className={cn("h-10 px-6 rounded-full font-black text-[10px] uppercase tracking-widest border-2", 
                     statusFilter === tab ? "shadow-lg shadow-primary/20" : "border-border/50"
                   )}
                   onClick={() => setStatusFilter(tab)}
                 >
                   {tab}
                 </Button>
               ))}
            </div>
          </div>

          {/* Properties List */}
           <div className="grid grid-cols-1 gap-4">
             {filteredProperties.map((p) => (
                <div key={p.id} className="group p-4 md:p-5 bg-background border border-secondary/50 rounded-2xl md:rounded-[2.5rem] hover:border-primary/30 transition-all duration-300 shadow-premium flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                   {/* Thumbnail & Identity */}
                   <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0 w-full">
                      <div className="h-16 w-16 md:h-24 md:w-40 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-border/50">
                         <img src={p.cover_image_url || '/placeholder.png'} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.title} />
                      </div>
                      <div className="space-y-1 min-w-0">
                         <div className="flex items-center gap-3">
                            <Badge className={cn("rounded-full font-black text-[8px] uppercase tracking-widest px-3 py-0 border-none", 
                               p.status === 'active' ? "bg-green-500/10 text-green-500" :
                               p.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                               "bg-red-500/10 text-red-500"
                            )}>
                               {p.status}
                            </Badge>
                             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.property_type}</span>
                          </div>
                          <h3 className="text-sm md:text-xl font-black tracking-tight truncate">{p.title}</h3>
                          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-muted-foreground italic">
                            <Building2 size={12} className="text-primary/40" />
                            <span>Owner: {p.seller?.full_name || 'System'}</span>
                            <span>•</span>
                            <span>{p.city}</span>
                         </div>
                      </div>
                   </div>

                   {/* Quick Metrics */}
                   <div className="items-center gap-12 px-8 border-x border-border/50 hidden lg:flex">
                      <div className="text-center">
                         <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Market Value</p>
                         <p className="text-sm font-black tracking-tighter text-primary">{p.asking_price} {p.currency}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Listed Under</p>
                         <Badge variant="secondary" className="rounded-lg font-black text-[9px] uppercase tracking-widest px-2">
                            {p.listing_type}
                         </Badge>
                      </div>
                   </div>

                    {/* Administrative Controls */}
                   <div className="flex items-center gap-2 w-full md:w-auto justify-end md:justify-start border-t md:border-none pt-4 md:pt-0">
                       <Button variant="outline" size="icon" className="h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-2xl border-2" asChild>
                          <Link to={`${ROUTES.PROPERTY_DETAIL}/${p.slug}`}>
                             <ExternalLink size={16} />
                          </Link>
                       </Button>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-2">
                               <MoreVertical size={20} />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-2 shadow-xl">
                            <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest px-3 py-2 text-muted-foreground">Moderation</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="rounded-xl font-bold py-3 text-green-500"
                              onClick={() => approveProperty.mutate(p.id)}
                            >
                               <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Asset
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 text-primary">
                               <Star className="mr-2 h-4 w-4" /> Feature Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl font-bold py-3 text-amber-500"
                              onClick={() => {
                                const reason = window.prompt('Reason for rejection:')
                                if (reason) rejectProperty.mutate({ id: p.id, reason })
                              }}
                            >
                               <AlertCircle className="mr-2 h-4 w-4" /> Flag Violation
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="rounded-xl font-bold py-3">
                               <Edit className="mr-2 h-4 w-4" /> Edit Record
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 text-destructive">
                               <Trash2 className="mr-2 h-4 w-4" /> Purge Asset
                            </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>
             ))}
          </div>
        </Container>
      </main>
    </div>
  )
}
