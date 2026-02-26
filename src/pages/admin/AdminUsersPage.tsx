import { useState } from 'react'
import { 
  Search, 
  Filter, 
  UserPlus, 
  Shield, 
  Mail, 
  MapPin,
  Trash2,
  MoreHorizontal,
  XCircle
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import EmptyState from '@/components/common/EmptyState'

const MOCK_USERS = [
  { id: '1', name: 'Samantha M.', email: 'samantha@example.com', role: 'seller', status: 'verified', joined: '2026-01-15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974' },
  { id: '2', name: 'Kelvin Phiri', email: 'kelvin.p@example.com', role: 'agent', status: 'pending', joined: '2026-02-01', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974' },
  { id: '3', name: 'John Tembo', email: 'jt@example.com', role: 'buyer', status: 'verified', joined: '2025-11-20', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070' },
  { id: '4', name: 'Sarah Chanda', email: 'sarah.c@example.com', role: 'seller', status: 'banned', joined: '2026-01-05', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070' },
  { id: '5', name: 'Moses Zulu', email: 'moses@example.com', role: 'agent', status: 'verified', joined: '2026-02-10', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974' }
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="border-b border-border/50 py-12 bg-primary/5">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter">User Registry</h1>
              <p className="text-muted-foreground font-medium italic">Identity management and authority distribution.</p>
            </div>
            <Button size="lg" className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
              <UserPlus className="mr-2 h-5 w-5" />
              Provision User
            </Button>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container className="space-y-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <Input 
                placeholder="Search by name or email..." 
                className="pl-12 h-12 bg-secondary/30 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" className="h-12 px-6 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] gap-2">
                  <Filter size={16} />
                  Filters
               </Button>
               <Button variant="outline" className="h-12 px-6 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] gap-2">
                  <Mail size={16} />
                  Bulk Dispatch
               </Button>
            </div>
          </div>

          {/* User List Table (Mobile Optimized Cards) */}
          <div className="grid grid-cols-1 gap-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.id} className="group p-6 bg-background border border-secondary/50 rounded-[2.5rem] hover:border-primary/30 transition-all duration-300 shadow-premium flex flex-col md:flex-row items-center gap-8">
                    {/* Profile Info */}
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="font-bold">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-3">
                              <h3 className="text-xl font-black tracking-tight truncate">{user.name}</h3>
                              <Badge className={cn("rounded-full font-black text-[8px] uppercase tracking-widest px-3 py-0 border-none", 
                                user.status === 'verified' ? "bg-green-500/10 text-green-500" :
                                user.status === 'pending' ? "bg-amber-500/10 text-amber-500" :
                                "bg-red-500/10 text-red-500"
                              )}>
                                {user.status}
                              </Badge>
                          </div>
                          <p className="text-sm font-bold text-muted-foreground italic truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="items-center gap-12 px-8 border-x border-border/50 hidden lg:flex">
                        <div className="text-center space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Authority</p>
                          <Badge variant="secondary" className="rounded-lg font-black text-[10px] uppercase tracking-widest px-3">
                              {user.role}
                          </Badge>
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Joined Protocol</p>
                          <div className="flex items-center gap-1.5 justify-center">
                              <MapPin size={12} className="text-primary/40" />
                              <span className="text-xs font-black tracking-tighter">{user.joined}</span>
                          </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-12 px-6 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                          View Identity
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl">
                                <MoreHorizontal size={20} />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-2 shadow-xl">
                              <DropdownMenuLabel className="font-black text-[10px] uppercase tracking-widest px-3 py-2 text-muted-foreground">Admin Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="rounded-xl font-bold py-3">
                                <Shield className="mr-2 h-4 w-4" /> Elevate Authority
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl font-bold py-3 text-amber-500">
                                <XCircle className="mr-2 h-4 w-4" /> Revoke Access
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="rounded-xl font-bold py-3 text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Purge Record
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState 
                  title="No users found"
                  description="System registry is clear. Try adjusting your search query."
                  action={{
                    label: "Reset Search",
                    onClick: () => setSearchQuery('')
                  }}
                />
              )}
          </div>
        </Container>
      </main>
    </div>
  )
}
