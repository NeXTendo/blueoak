import { useState } from 'react'
import { 
  Loader2,
  Star,
  Search,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { useAdminProperties, useAdminActions } from '@/hooks/useAdmin'
import AdminHeader from '@/components/admin/AdminHeader'
import EmptyState from '@/components/common/EmptyState'

export default function AdminPropertiesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: properties, isLoading } = useAdminProperties(statusFilter)
  const { 
    approveProperty, 
    rejectProperty, 
    featureProperty, 
    deleteProperty 
  } = useAdminActions()

  const filteredProperties = properties?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleFeature = (id: string, current: boolean) => {
    featureProperty.mutate({ id, status: !current })
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this property? This action cannot be undone.')) {
      deleteProperty.mutate(id)
    }
  }

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

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[hsl(var(--gold)/0.1)]">
      <AdminHeader />
      
      <main className="flex-1 py-10">
        <Container className="space-y-8">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif font-medium tracking-tight">Assets Repository</h1>
              <p className="text-sm text-muted-foreground font-medium">Manage, moderate, and feature global property listings.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full font-bold uppercase tracking-widest text-[10px] h-10 px-6">
                Export Data
              </Button>
              <Button className="rounded-full bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold))]/90 font-bold uppercase tracking-widest text-[10px] h-10 px-6">
                New Listing
              </Button>
            </div>
          </section>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-secondary/20 p-4 rounded-2xl border border-border/40">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto">
              {['all', 'pending', 'active', 'rejected'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'secondary' : 'ghost'}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "rounded-full h-9 px-5 text-[10px] font-bold uppercase tracking-widest transition-all",
                    statusFilter === status && "bg-white shadow-sm text-foreground"
                  )}
                >
                  {status}
                </Button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, title or city..."
                className="pl-10 h-10 bg-white border-border/60 rounded-full text-xs font-medium focus-visible:ring-[hsl(var(--gold))]/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Properties Table */}
          <div className="border border-border/60 rounded-2xl overflow-hidden bg-white shadow-sm">
            {filteredProperties.length > 0 ? (
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest pl-6">Property</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Type</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Pricing</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Seller</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.map((p) => (
                    <TableRow key={p.id} className="group transition-colors border-border/40">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-20 rounded-lg overflow-hidden shrink-0 border border-border/40 relative">
                            <img src={p.cover_image_url || '/placeholder.png'} className="h-full w-full object-cover" alt={p.title} />
                            {p.is_featured && (
                              <div className="absolute top-1 right-1 bg-[hsl(var(--gold))] p-0.5 rounded-full ring-2 ring-white">
                                <Star size={8} className="text-white fill-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-serif font-medium text-sm truncate group-hover:text-[hsl(var(--gold))] transition-colors">{p.title}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider truncate font-medium">{p.city}, {p.country}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-md font-bold text-[9px] uppercase tracking-widest border-border/60 whitespace-nowrap">
                          {p.property_type.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold tracking-tight">
                            {p.asking_price?.toLocaleString() || p.monthly_rent?.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{p.currency} {p.monthly_rent ? '/ month' : ''}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold whitespace-nowrap">
                          {p.seller?.full_name || 'System'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full transition-all",
                            p.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" :
                            p.status === 'pending' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" :
                            "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                          )} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {p.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-border shadow-premium">
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 text-muted-foreground">Listing Agent</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="p-2 rounded-lg cursor-pointer">
                              <Link to={`${ROUTES.PROPERTY_DETAIL}/${p.slug}`}>
                                <Eye size={14} className="mr-2 text-muted-foreground" />
                                <span className="text-xs font-medium">View Public</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`${ROUTES.EDIT_PROPERTY}/${p.id}`)} className="p-2 rounded-lg cursor-pointer">
                              <Edit size={14} className="mr-2 text-muted-foreground" />
                              <span className="text-xs font-medium">Edit Details</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 text-muted-foreground">Moderation</DropdownMenuLabel>
                            
                            {p.status === 'pending' && (
                              <DropdownMenuItem 
                                onClick={() => approveProperty.mutate(p.id)}
                                className="p-2 rounded-lg cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50"
                              >
                                <CheckCircle2 size={14} className="mr-2" />
                                <span className="text-xs font-bold">Approve Listing</span>
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem 
                              onClick={() => handleFeature(p.id, p.is_featured)}
                              className={cn(
                                "p-2 rounded-lg cursor-pointer",
                                p.is_featured ? "text-amber-600 focus:text-amber-600" : "text-foreground"
                              )}
                            >
                              <Star size={14} className={cn("mr-2", p.is_featured && "fill-amber-600")} />
                              <span className="text-xs font-bold">{p.is_featured ? 'Remove Featured' : 'Mark Featured'}</span>
                            </DropdownMenuItem>

                            {p.status !== 'rejected' && (
                              <DropdownMenuItem 
                                onClick={() => {
                                  const reason = window.prompt('Specify reason for rejection:')
                                  if (reason) rejectProperty.mutate({ id: p.id, reason })
                                }}
                                className="p-2 rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <XCircle size={14} className="mr-2" />
                                <span className="text-xs font-bold">Reject Listing</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDelete(p.id)}
                              className="p-2 rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                            >
                              <Trash2 size={14} className="mr-2" />
                              <span className="text-xs font-bold">Delete Permanent</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-20 bg-white">
                <EmptyState 
                  title="No assets matching criteria"
                  description="Adjust your search parameters or check your active filters to locate the desired listing."
                  action={{
                    label: "Clear All Filters",
                    onClick: () => { setSearchQuery(''); setStatusFilter('all'); }
                  }}
                />
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  )
}
