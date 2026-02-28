import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Calendar, 
  Mail, 
  Settings, 
  Edit3, 
  Heart, 
  ShieldCheck,
  Package,
  LogOut,
  ChevronRight,
  ArrowRight,
  Loader2,
  TrendingUp,
  Eye,
  MessageSquare,
  Sparkles,
  Award,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserProperties, useSavedProperties } from '@/hooks/useProperties'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function ProfilePage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('listings')

  const { data: myProperties = [], isLoading: isLoadingMy } = useUserProperties()
  const { data: savedProperties = [], isLoading: isLoadingSaved } = useSavedProperties()

  const userStats = useMemo(() => [
    { label: 'Portfolio Assets', value: myProperties.length.toString(), icon: Package, color: 'text-primary' },
    { label: 'Saved Assets', value: savedProperties.length.toString(), icon: Heart, color: 'text-rose-500' },
    { label: 'Market Reputation', value: profile?.is_verified ? 'Verified' : 'Establishing', icon: ShieldCheck, color: 'text-emerald-500' },
  ], [myProperties.length, savedProperties.length, profile?.is_verified])

  const handleLogout = async () => {
    await logout()
    // navigate(ROUTES.HOME) // logout hook already does this
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-40">
      {/* Cinematic Identity Header */}
      <section className="relative h-[25vh] md:h-[35vh] bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold)/0.2)] to-transparent" />
           <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        
        {/* Floating Accents */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[hsl(var(--gold)/0.1)] rounded-full blur-[120px] -translate-y-1/2" />
      </section>

      <Container className="-mt-32 relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-20">
          
          {/* Identity Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {/* Identity Card */}
            <div className="bg-background border border-border/60 rounded-[3rem] p-10 shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(var(--gold)/0.03)] rounded-bl-[8rem] -translate-y-6 translate-x-6 transition-transform group-hover:scale-110" />
              
              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-[hsl(var(--gold))] rounded-full blur-2xl opacity-10 animate-pulse" />
                  <Avatar className="h-40 w-40 ring-1 ring-border shadow-2xl relative z-10">
                    <AvatarImage src={profile?.avatar_url || ""} className="object-cover" />
                    <AvatarFallback className="text-5xl font-black bg-secondary text-[hsl(var(--gold))] uppercase">
                      {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Link 
                    to={ROUTES.EDIT_PROFILE} 
                    title="Modify Identity"
                    className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-black text-white flex items-center justify-center shadow-xl border-4 border-background hover:scale-110 hover:bg-[hsl(var(--gold))] hover:text-black transition-all z-20"
                  >
                    <Edit3 size={18} />
                  </Link>
                </div>

                <div className="space-y-4 w-full">
                  <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">{profile?.full_name || profile?.username || 'Anonymous User'}</h1>
                    <Link to={`/p/${profile?.username}`} className="text-[10px] font-bold text-muted-foreground/40 hover:text-[hsl(var(--gold))] transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5">
                       blueoak.me/{profile?.username || 'user'}
                       <ExternalLink size={10} />
                    </Link>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[hsl(var(--gold))] px-5 py-2 bg-secondary/40 rounded-full border border-border/20">
                      {profile?.user_type || 'Buyer'}
                    </span>
                    {profile?.is_verified && (
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        <ShieldCheck size={14} strokeWidth={3} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Verified Participant</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Core Metrics */}
                <div className="grid grid-cols-3 gap-8 w-full border-y border-border/40 py-10 my-4">
                  {userStats.map((stat) => (
                    <div key={stat.label} className="space-y-2 group cursor-help" title={stat.label}>
                      <div className={cn("text-2xl font-black tracking-tighter transition-transform group-hover:scale-110", stat.color)}>{stat.value}</div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">{stat.label.split(' ')[0]}</div>
                    </div>
                  ))}
                </div>

                {/* Meta Data */}
                <div className="w-full space-y-6 pt-4 text-left">
                  {[
                    { icon: Mail, value: profile?.email || 'No identity record', label: 'Registered Email' },
                    { icon: MapPin, value: profile?.city || 'Global Location', label: 'Primary Base' },
                    { icon: Calendar, value: 'Established ' + (profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear()), label: 'Member Since' },
                  ].map((info, i) => (
                    <div key={i} className="flex items-center gap-5 group">
                      <div className="h-10 w-10 rounded-xl bg-secondary/30 flex items-center justify-center text-muted-foreground/40 group-hover:text-[hsl(var(--gold))] group-hover:bg-secondary transition-all">
                         <info.icon size={16} />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">{info.label}</p>
                         <p className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[200px]">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full pt-8 flex gap-4">
                  <Button 
                    variant="secondary"
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    className="flex-1 h-16 rounded-2xl bg-secondary/50 text-foreground border border-border hover:bg-secondary hover:border-[hsl(var(--gold))] transition-all gap-3 group"
                  >
                    <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={handleLogout}
                    className="h-16 w-16 rounded-2xl bg-destructive/5 text-destructive border border-destructive/10 hover:bg-destructive hover:text-white transition-all"
                  >
                    <LogOut size={20} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Exclusive Program CTA */}
            {profile?.user_type === 'buyer' && (
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-10 bg-black text-white rounded-[3rem] space-y-6 relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gold)/0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[hsl(var(--gold))] rounded-full blur-[80px] opacity-20" />
                
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[hsl(var(--gold))] italic">Exclusive Program</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-[1.1]">Elevate to <br /><span className="text-[hsl(var(--gold))]">Asset Manager.</span></h3>
                <p className="text-xs font-medium text-white/40 leading-relaxed italic">
                  Gain professional listing infrastructure, institutional verification, and priority market reach.
                </p>
                <button 
                  onClick={() => navigate(ROUTES.ELEVATION)}
                  className="w-full h-14 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[hsl(var(--gold))] transition-all flex items-center justify-center gap-3 shadow-xl group"
                >
                  Initiate Application
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </motion.aside>

          {/* Asset Management Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16"
          >
            {/* Tab Navigation */}
            <div className="flex items-center gap-12 md:gap-20 border-b border-border/40 overflow-x-auto no-scrollbar">
              {['listings', 'saved', 'intelligence'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.45em] py-8 border-b-2 transition-all relative whitespace-nowrap",
                    activeTab === tab 
                      ? "text-foreground border-foreground" 
                      : "text-muted-foreground/30 border-transparent hover:text-foreground/60"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTabUnderline" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(var(--gold))]" 
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'listings' && (
                  <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <TrendingUp size={14} className="text-[hsl(var(--gold))]" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Active Strategy</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Your Assets</h2>
                      </div>
                      <Link 
                        to={ROUTES.ADD_PROPERTY} 
                        className="h-16 px-10 bg-black text-white rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-[hsl(var(--gold))] hover:text-black transition-all shrink-0 hover:-translate-y-1"
                      >
                        New Listing Project
                      </Link>
                    </div>

                    {isLoadingMy ? (
                      <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="relative">
                           <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--gold))]" />
                           <div className="absolute inset-0 bg-[hsl(var(--gold))] blur-2xl opacity-20" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 animate-pulse">Syncing Portfolio...</p>
                      </div>
                    ) : myProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {myProperties.map((p) => (
                          <PropertyCard key={p.id} property={p as any} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 md:py-40 bg-secondary/10 rounded-[4rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center space-y-8 group hover:bg-secondary/20 transition-all">
                        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/20 group-hover:scale-110 group-hover:text-[hsl(var(--gold))] transition-all">
                           <Package size={40} />
                        </div>
                        <div className="space-y-3 max-w-sm">
                          <h4 className="text-2xl font-black uppercase tracking-tight">Portfolio Empty</h4>
                          <p className="text-xs font-medium text-muted-foreground/60 leading-relaxed italic">Your institutional records are currently clear. Initiate your first market listing to establish presence.</p>
                        </div>
                        <Link 
                          to={ROUTES.ADD_PROPERTY}
                          className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))] border-b-2 border-border/60 pb-1 hover:border-[hsl(var(--gold))] transition-all"
                        >
                          Establish Record
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'saved' && (
                  <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <Heart size={14} className="text-rose-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Interest Stack</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Monitored</h2>
                      </div>
                      <Link 
                        to={ROUTES.SEARCH} 
                        className="h-16 px-10 border border-border rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all shrink-0 hover:-translate-y-1 gap-3"
                      >
                        Market Discovery
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    {isLoadingSaved ? (
                      <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--gold))]" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Syncing Stack...</p>
                      </div>
                    ) : savedProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {savedProperties.map((p) => (
                          <PropertyCard key={p.id} property={p as any} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 md:py-40 bg-secondary/10 rounded-[4rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center space-y-8 group hover:bg-secondary/20 transition-all">
                        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/20 group-hover:scale-110 group-hover:text-rose-500 transition-all">
                           <Heart size={40} />
                        </div>
                        <div className="space-y-3 max-w-sm">
                          <h4 className="text-2xl font-black uppercase tracking-tight">No Interest Logged</h4>
                          <p className="text-xs font-medium text-muted-foreground/60 leading-relaxed italic">Track market movement by saving assets that align with your institutional strategy.</p>
                        </div>
                        <Link 
                          to={ROUTES.SEARCH}
                          className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))] border-b-2 border-border/60 pb-1 hover:border-[hsl(var(--gold))] transition-all"
                        >
                          Explore Assets
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'intelligence' && (
                  <div className="space-y-16">
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <Sparkles size={14} className="text-[hsl(var(--gold))]" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Biographical Records</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Narrative</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-16">
                       <div className="space-y-12">
                          <div className="p-10 md:p-14 bg-secondary/20 rounded-[3rem] border border-border/40 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-20 h-20 bg-[hsl(var(--gold)/0.1)] rounded-bl-full" />
                             <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed italic indent-12">
                                {profile?.bio || "Transitioning your profile to our premium tier access. No identity narrative established for this participant. Define your strategic real estate objectives to enhance visibility in our global repository."}
                             </p>
                             <div className="pt-10 flex justify-end">
                                <button 
                                  onClick={() => navigate(ROUTES.EDIT_PROFILE)}
                                  className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--gold))] border-b-2 border-[hsl(var(--gold))] pb-1 hover:pb-2 transition-all"
                                >
                                  Refine Narrative
                                </button>
                             </div>
                          </div>

                          {/* Intelligence Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {[
                               { 
                                 title: 'Identity Verification', 
                                 icon: ShieldCheck, 
                                 value: profile?.is_verified ? 'Authorized Citizen' : 'Pending Verification',
                                 desc: 'Verification status determines your institutional trust rating.',
                                 color: profile?.is_verified ? 'text-emerald-500' : 'text-amber-500'
                               },
                               { 
                                 title: 'Participant Class', 
                                 icon: Award, 
                                 value: (profile?.user_type || 'Buyer').toUpperCase() + ' LVL. 1',
                                 desc: 'Higher classifications unlock advanced market mechanisms.',
                                 color: 'text-[hsl(var(--gold))]'
                               }
                             ].map((card, i) => (
                               <div key={i} className="p-10 bg-background border border-border/60 rounded-[2.5rem] space-y-6 hover:border-[hsl(var(--gold))] transition-all group shadow-sm">
                                  <div className={cn("h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center transition-transform group-hover:scale-110", card.color)}>
                                     <card.icon size={26} />
                                  </div>
                                  <div className="space-y-2">
                                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 underline decoration-[hsl(var(--gold)/0.3)] decoration-4 underline-offset-8">{card.title}</h4>
                                     <div className={cn("text-xl font-black uppercase tracking-tighter pt-4", card.color)}>{card.value}</div>
                                     <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed italic">{card.desc}</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Context Sidebar */}
                       <div className="space-y-10">
                          <div className="p-8 bg-black text-white rounded-[2.5rem] space-y-8">
                             <div className="space-y-1">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--gold))]">System Logs</h4>
                                <p className="text-xl font-black uppercase tracking-tight">Active Analytics</p>
                             </div>
                             
                             <div className="space-y-6">
                                {[
                                  { icon: Eye, label: 'Profile Intelligence', val: '2.4k views' },
                                  { icon: MessageSquare, label: 'Secure Inquiries', val: '12 active' },
                                  { icon: Sparkles, label: 'Match Precision', val: '94.2%' },
                                ].map((log, i) => (
                                  <div key={i} className="flex items-center justify-between group cursor-default">
                                     <div className="flex items-center gap-4">
                                        <log.icon size={16} className="text-white/20 group-hover:text-[hsl(var(--gold))] transition-colors" />
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{log.label}</span>
                                     </div>
                                     <span className="text-[10px] font-black uppercase tracking-widest text-[hsl(var(--gold))]">{log.val}</span>
                                  </div>
                                ))}
                             </div>

                             <div className="pt-4">
                                <button className="w-full h-14 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
                                   Download Archive
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}