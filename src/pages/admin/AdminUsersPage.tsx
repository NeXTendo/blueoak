import { useState } from 'react'
import { 
  Users, 
  Search, 
  MoreHorizontal,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Shield,
  Loader2,
  Mail,
  MoreVertical,
  Fingerprint
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { useAdminUsers, useAdminActions } from '@/hooks/useAdmin'
import { useRole } from '@/hooks/useRole'
import AdminHeader from '@/components/admin/AdminHeader'
import EmptyState from '@/components/common/EmptyState'
import { motion } from 'framer-motion'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const { data: users, isLoading } = useAdminUsers(roleFilter)
  const { toggleVerification, toggleBan, updateRole } = useAdminActions()
  const { isSuperAdmin } = useRole()

  const filteredUsers = users?.filter(u => 
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

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

  const handleRoleUpdate = (userId: string) => {
    const role = window.prompt('Specify New Authority Level (buyer, seller, agent, admin, super_admin):')
    if (role && ['buyer', 'seller', 'agent', 'admin', 'super_admin'].includes(role)) {
      updateRole.mutate({ userId, role })
    } else if (role) {
      alert('Invalid role specified.')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[hsl(var(--gold)/0.1)]">
      <AdminHeader />
      
      <main className="flex-1 py-10">
        <Container className="space-y-8">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif font-medium tracking-tight">Identity Registry</h1>
              <p className="text-sm text-muted-foreground font-medium">Manage user authorities, verifications, and platform security flags.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-full font-bold uppercase tracking-widest text-[10px] h-10 px-6">
                Activity Logs
              </Button>
              <Button className="rounded-full bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold))]/90 font-bold uppercase tracking-widest text-[10px] h-10 px-6">
                Manual Provisioning
              </Button>
            </div>
          </section>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-secondary/20 p-4 rounded-2xl border border-border/40">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto">
              {['all', 'buyer', 'seller', 'agent', 'admin'].map((role) => (
                <Button
                  key={role}
                  variant={roleFilter === role ? 'secondary' : 'ghost'}
                  onClick={() => setRoleFilter(role)}
                  className={cn(
                    "rounded-full h-9 px-5 text-[10px] font-bold uppercase tracking-widest transition-all",
                    roleFilter === role && "bg-white shadow-sm text-foreground"
                  )}
                >
                  {role}
                </Button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name or email..."
                className="pl-10 h-10 bg-white border-border/60 rounded-full text-xs font-medium focus-visible:ring-[hsl(var(--gold))]/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-border/60 rounded-2xl overflow-hidden bg-white shadow-sm">
            {filteredUsers.length > 0 ? (
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest pl-6">Identity</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Email Address</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Authority</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Joined</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="group transition-colors border-border/40">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border/40">
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback className="bg-secondary text-[10px] font-bold text-muted-foreground uppercase">
                              {user.full_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-serif font-medium text-sm truncate group-hover:text-[hsl(var(--gold))] transition-colors">
                              {user.full_name}
                            </span>
                            <span className="text-[9px] text-muted-foreground uppercase tracking-wider truncate font-medium">
                              ID: {user.id.slice(0, 8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Mail size={12} className="shrink-0" />
                          <span className="truncate max-w-[150px]">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-md font-bold text-[9px] uppercase tracking-widest border-border/60 whitespace-nowrap bg-secondary/10">
                          {user.user_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                          {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5 flex-wrap">
                          {user.is_verified && (
                            <Badge className="bg-green-50 text-green-600 border-green-100 rounded-md font-bold text-[8px] uppercase tracking-widest gap-1 shadow-none">
                              <ShieldCheck size={10} />
                              Verified
                            </Badge>
                          )}
                          {user.is_banned && (
                            <Badge className="bg-red-50 text-red-600 border-red-100 rounded-md font-bold text-[8px] uppercase tracking-widest gap-1 shadow-none">
                              <ShieldAlert size={10} />
                              Banned
                            </Badge>
                          )}
                          {!user.is_verified && !user.is_banned && (
                            <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Standard</span>
                          )}
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
                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 text-muted-foreground">Oversight</DropdownMenuLabel>
                            
                            <DropdownMenuItem 
                              onClick={() => toggleVerification.mutate({ userId: user.id, status: !user.is_verified })}
                              className={cn(
                                "p-2 rounded-lg cursor-pointer",
                                user.is_verified ? "text-destructive" : "text-green-600 focus:text-green-600 focus:bg-green-50"
                              )}
                            >
                              <UserCheck size={14} className="mr-2" />
                              <span className="text-xs font-bold">{user.is_verified ? 'Revoke Verify' : 'Verify Identity'}</span>
                            </DropdownMenuItem>

                            {isSuperAdmin && (
                              <DropdownMenuItem 
                                onClick={() => handleRoleUpdate(user.id)}
                                className="p-2 rounded-lg cursor-pointer text-[hsl(var(--gold))] focus:text-[hsl(var(--gold))] focus:bg-[hsl(var(--gold)/0.05)]"
                              >
                                <Shield size={14} className="mr-2" />
                                <span className="text-xs font-bold">Elevate Authority</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => toggleBan.mutate({ userId: user.id, status: !user.is_banned })}
                              className={cn(
                                "p-2 rounded-lg cursor-pointer",
                                user.is_banned ? "text-green-600" : "text-red-600 focus:text-red-600 focus:bg-red-50"
                              )}
                            >
                              <UserX size={14} className="mr-2" />
                              <span className="text-xs font-bold">{user.is_banned ? 'Restore Access' : 'Revoke Access (Ban)'}</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-2 rounded-lg cursor-pointer text-muted-foreground flex items-center">
                              <Fingerprint size={14} className="mr-2" />
                              <span className="text-xs font-medium">Audit Identity</span>
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
                  title="No identities matching criteria"
                  description="No registered users found for the current filter parameters."
                  action={{
                    label: "Clear Search",
                    onClick: () => setSearchQuery('')
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
