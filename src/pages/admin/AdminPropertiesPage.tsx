import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  Star,
  ExternalLink,
  Edit,
  Trash2,
  Lock,
  Building2
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
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

export default function AdminPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const properties = MOCK_PROPERTIES.map((p, i) => ({
    ...p,
    modStatus: i % 4 === 0 ? 'verified' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'flagged' : 'featured',
    owner: i % 2 === 0 ? 'Samantha M.' : 'Kelvin Phiri'
  }))

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="border-b border-border/50 py-12 bg-primary/5">
        <Container>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Global Asset List</h1>
              <p className="text-muted-foreground font-medium italic">Moderation and lifecycle management of platform assets.</p>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] gap-2">
                  <Lock size={16} />
                  Freeze All
               </Button>
               <Button size="lg" className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                  <Star className="mr-2 h-5 w-5" />
                  Featured Queue
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <Input 
                placeholder="Search assets by title, owner, or location..." 
                className="pl-12 h-14 bg-secondary/30 border-none rounded-[1.5rem] font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" className="h-14 px-6 rounded-[1.5rem] border-2 font-black uppercase tracking-widest text-[10px] gap-2">
                  <Filter size={16} />
                  Protocols
               </Button>
            </div>
          </div>

          {/* Properties List */}
          <div className="grid grid-cols-1 gap-4">
             {filteredProperties.map((p) => (
                <div key={p.id} className="group p-5 bg-background border border-secondary/50 rounded-[2.5rem] hover:border-primary/30 transition-all duration-300 shadow-premium flex flex-col md:flex-row items-center gap-8">
                   {/* Thumbnail & Identity */}
                   <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="h-24 w-40 rounded-2xl overflow-hidden shrink-0 border border-border/50">
                         <img src={p.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.title} />
                      </div>
                      <div className="space-y-1 min-w-0">
                         <div className="flex items-center gap-3">
                            <Badge className={cn("rounded-full font-black text-[8px] uppercase tracking-widest px-3 py-0 border-none", 
                               p.modStatus === 'verified' ? "bg-green-500/10 text-green-500" :
                               p.modStatus === 'featured' ? "bg-primary/10 text-primary" :
                               p.modStatus === 'pending' ? "bg-amber-500/10 text-amber-500" :
                               "bg-red-500/10 text-red-500"
                            )}>
                               {p.modStatus}
                            </Badge>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.type}</span>
                         </div>
                         <h3 className="text-xl font-black tracking-tight truncate">{p.title}</h3>
                         <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground italic">
                            <Building2 size={12} className="text-primary/40" />
                            <span>Owner: {p.owner}</span>
                            <span>•</span>
                            <span>{p.location}</span>
                         </div>
                      </div>
                   </div>

                   {/* Quick Metrics */}
                   <div className="items-center gap-12 px-8 border-x border-border/50 hidden lg:flex">
                      <div className="text-center">
                         <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Market Value</p>
                         <p className="text-sm font-black tracking-tighter text-primary">{p.price}</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Listed Under</p>
                         <Badge variant="secondary" className="rounded-lg font-black text-[9px] uppercase tracking-widest px-2">
                            {p.listingType}
                         </Badge>
                      </div>
                   </div>

                   {/* Administrative Controls */}
                   <div className="flex items-center gap-2">
                       <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-2" asChild>
                          <Link to={`${ROUTES.PROPERTY_DETAIL}/slug`}>
                             <ExternalLink size={18} />
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
                            <DropdownMenuItem className="rounded-xl font-bold py-3 text-green-500">
                               <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Asset
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 text-primary">
                               <Star className="mr-2 h-4 w-4" /> Feature Listing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl font-bold py-3 text-amber-500">
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
