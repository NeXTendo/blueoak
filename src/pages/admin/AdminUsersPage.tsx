import { useState } from 'react'
import { 
  Search, 
  UserPlus, 
  Shield, 
  MapPin,
  Trash2,
  MoreHorizontal,
  XCircle,
  Loader2,
  CheckCircle2
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
import { useAdminUsers, useAdminActions } from '@/hooks/useAdmin'
import { useRole } from '@/hooks/useRole'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const { data: users, isLoading } = useAdminUsers(roleFilter)
  const { toggleVerification, toggleBan, updateRole } = useAdminActions()
  const { isSuperAdmin } = useRole()

  const filteredUsers = users?.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">User Registry</h1>
              <p className="text-xs md:text-sm text-muted-foreground font-medium italic">Identity management and authority distribution.</p>
            </div>
            <Button size="lg" className="rounded-xl md:rounded-2xl px-6 md:px-8 h-10 md:h-14 font-black uppercase tracking-widest text-[10px] md:text-xs shadow-xl shadow-primary/20">
              <UserPlus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
              Provision
            </Button>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container className="space-y-8">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
              <Input 
                placeholder="Search identity..." 
                className="pl-12 h-11 md:h-12 bg-secondary/30 border-none rounded-xl md:rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
               {['all', 'buyer', 'seller', 'agent', 'admin', 'super_admin'].map((role) => (
                 <Button 
                   key={role}
                   variant={roleFilter === role ? 'default' : 'outline'}
                   className={cn("h-10 px-6 rounded-full font-black text-[10px] uppercase tracking-widest border-2", 
                     roleFilter === role ? "shadow-lg shadow-primary/20" : "border-border/50"
                   )}
                   onClick={() => setRoleFilter(role)}
                 >
                   {role}
                 </Button>
               ))}
            </div>
          </div>

          {/* User List Table (Mobile Optimized Cards) */}
          <div className="grid grid-cols-1 gap-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.id} className="group p-4 md:p-6 bg-background border border-secondary/50 rounded-2xl md:rounded-[2.5rem] hover:border-primary/30 transition-all duration-300 shadow-premium flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                    {/* Profile Info */}
                    <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0 w-full">
                        <Avatar className="h-12 w-12 md:h-16 md:w-16 border-2 border-background shadow-lg">
                          <AvatarImage src={user.avatar_url || ''} />
                          <AvatarFallback className="font-bold">{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3">
                              <h3 className="text-base md:text-xl font-black tracking-tight truncate">{user.full_name}</h3>
                              <Badge className={cn("rounded-full font-black text-[8px] uppercase tracking-widest px-2 py-0.5 md:px-3 md:py-0 border-none", 
                                user.is_banned ? "bg-red-500/10 text-red-500" :
                                user.is_verified ? "bg-green-500/10 text-green-500" :
                                "bg-amber-500/10 text-amber-500"
                              )}>
                                {user.is_banned ? 'Banned' : user.is_verified ? 'Verified' : 'Unverified'}
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
                              {user.user_type}
                          </Badge>
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Joined Protocol</p>
                          <div className="flex items-center gap-1.5 justify-center">
                              <MapPin size={12} className="text-primary/40" />
                              <span className="text-xs font-black tracking-tighter">
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
                          </div>
                        </div>
                    </div>

                    {/* Actions */}
                     <div className="flex items-center gap-2 w-full md:w-auto justify-end md:justify-start border-t md:border-none pt-4 md:pt-0">
                        <Button variant="outline" className="h-10 md:h-12 px-4 md:px-6 rounded-lg md:rounded-2xl border-2 font-black uppercase tracking-widest text-[8px] md:text-[10px] group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
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
                              <DropdownMenuItem 
                                className="rounded-xl font-bold py-3 text-green-500"
                                onClick={() => toggleVerification.mutate({ userId: user.id, status: !user.is_verified })}
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" /> 
                                {user.is_verified ? 'Revoke Verification' : 'Verify Identity'}
                              </DropdownMenuItem>
                              
                              {isSuperAdmin && (
                                <DropdownMenuItem 
                                  className="rounded-xl font-bold py-3"
                                  onClick={() => {
                                    const role = window.prompt('Specify new role (buyer, seller, agent, admin):')
                                    if (role) updateRole.mutate({ userId: user.id, role })
                                  }}
                                >
                                  <Shield className="mr-2 h-4 w-4" /> Elevate Authority
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem 
                                className="rounded-xl font-bold py-3 text-amber-500"
                                onClick={() => toggleBan.mutate({ userId: user.id, status: !user.is_banned })}
                              >
                                <XCircle className="mr-2 h-4 w-4" /> 
                                {user.is_banned ? 'Restore Access' : 'Revoke Access'}
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
