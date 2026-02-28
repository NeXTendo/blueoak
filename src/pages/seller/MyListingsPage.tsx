import { useState } from 'react'
import { 
  Plus, 
  MoreVertical, 
  Search, 
  Filter, 
  ExternalLink, 
  Edit3, 
  Trash2,
  Eye,
  MessageCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import Container from '@/components/layout/Container'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'

export default function MyListingsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const listings = [
    { id: '1', title: 'Luxury Villa', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop', type: 'House', location: 'Lusaka', price: '$1,200,000' },
    { id: '2', title: 'Modern Apartment', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop', type: 'Apartment', location: 'Nairobi', price: '$450,000' }
  ].map((p: any, i: number) => ({
    ...p,
    status: i % 3 === 0 ? 'published' : i % 3 === 1 ? 'pending' : 'draft',
    views: Math.floor(Math.random() * 500) + 100,
    inquiries: Math.floor(Math.random() * 20) + 5
  }))

  const filteredListings = listings.filter((l: any) => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || l.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="border-b border-border/50 py-12 bg-secondary/10">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter">My Listings</h1>
              <p className="text-muted-foreground font-medium italic">Manage and optimize your property portfolio.</p>
            </div>
            <Button asChild size="lg" className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
              <Link to={ROUTES.ADD_PROPERTY}>
                <Plus className="mr-2 h-5 w-5" />
                New Listing
              </Link>
            </Button>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container className="space-y-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
              <TabsList className="bg-secondary/30 p-1 rounded-xl h-11">
                <TabsTrigger value="all" className="rounded-lg px-6 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-background">All Assets</TabsTrigger>
                <TabsTrigger value="published" className="rounded-lg px-6 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-background">Published</TabsTrigger>
                <TabsTrigger value="pending" className="rounded-lg px-6 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-background">Pending</TabsTrigger>
                <TabsTrigger value="draft" className="rounded-lg px-6 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-background">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Filter by title..." 
                  className="pl-10 h-11 bg-secondary/30 border-none rounded-xl font-medium" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2">
                <Filter size={18} />
              </Button>
            </div>
          </div>

          {/* Listings List */}
          <div className="space-y-4">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing: any) => (
                <div key={listing.id} className="group p-4 bg-background border border-secondary/50 rounded-[2rem] hover:border-primary/30 transition-all duration-300 shadow-premium flex flex-col md:flex-row items-center gap-6">
                  {/* Image */}
                  <div className="h-28 w-44 rounded-2xl overflow-hidden shrink-0 border border-border/50">
                    <img src={listing.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={listing.title} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3">
                       <Badge className={cn("rounded-full font-black text-[9px] uppercase tracking-widest py-0.5 px-3", 
                          listing.status === 'published' ? "bg-green-500/10 text-green-600 border-none" :
                          listing.status === 'pending' ? "bg-amber-500/10 text-amber-600 border-none" :
                          "bg-secondary/50 text-muted-foreground border-none"
                       )}>
                          {listing.status}
                       </Badge>
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{listing.type}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight truncate">{listing.title}</h3>
                    <p className="text-xs font-bold text-muted-foreground/60 flex items-center gap-1.5">
                       <span className="text-primary font-black">{listing.price}</span>
                       • {listing.location}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="items-center gap-8 px-6 border-x border-border/50 hidden lg:flex">
                     <div className="text-center">
                        <div className="flex items-center gap-1.5 justify-center text-primary">
                           <Eye size={14} />
                           <span className="text-sm font-black tracking-tighter">{listing.views}</span>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Engagements</p>
                     </div>
                     <div className="text-center">
                        <div className="flex items-center gap-1.5 justify-center text-primary">
                           <MessageCircle size={14} />
                           <span className="text-sm font-black tracking-tighter">{listing.inquiries}</span>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Inquiries</p>
                     </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-2 hover:bg-primary/5 hover:text-primary transition-all" asChild>
                       <Link to={`${ROUTES.PROPERTY_DETAIL}/slug`}>
                          <ExternalLink size={18} />
                       </Link>
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-2 hover:bg-primary/5 hover:text-primary transition-all" asChild>
                       <Link to={`${ROUTES.EDIT_PROPERTY}/${listing.id}`}>
                          <Edit3 size={18} />
                       </Link>
                    </Button>
                    <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl">
                             <MoreVertical size={18} />
                          </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-2 shadow-xl">
                          <DropdownMenuItem className="rounded-xl font-bold py-3">
                             <Eye className="mr-2 h-4 w-4" /> View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-bold py-3 text-amber-500">
                             <AlertCircle className="mr-2 h-4 w-4" /> Report Issue
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="rounded-xl font-bold py-3 text-destructive">
                             <Trash2 className="mr-2 h-4 w-4" /> Delete Asset
                          </DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                 <div className="h-24 w-24 rounded-[2rem] bg-secondary/50 flex items-center justify-center text-5xl">🏘️</div>
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight">No assets found</h3>
                    <p className="text-muted-foreground font-medium max-w-sm">Adjust your filters or initiate a new listing to populate your portfolio.</p>
                 </div>
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
