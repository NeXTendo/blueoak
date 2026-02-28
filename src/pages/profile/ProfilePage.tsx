import { useState } from 'react'
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
  Loader2
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserProperties, useSavedProperties } from '@/hooks/useProperties'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('listings')

  const { data: myProperties = [], isLoading: isLoadingMy } = useUserProperties()
  const { data: savedProperties = [], isLoading: isLoadingSaved } = useSavedProperties()

  const userStats = [
    { label: 'Portfolio Assets', value: myProperties.length.toString(), icon: Package },
    { label: 'Saved Assets', value: savedProperties.length.toString(), icon: Heart },
    { label: 'Reputation', value: 'New', icon: ShieldCheck },
  ]

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* Cinematic Identity Header */}
      <section className="relative h-[30vh] md:h-[40vh] bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      <Container className="-mt-32 relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16">
          
          {/* Identity Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {/* Identity Card */}
            <div className="bg-background border-2 border-secondary rounded-[3rem] p-10 shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-bl-[5rem] -translate-y-4 translate-x-4 transition-transform group-hover:scale-110" />
              
              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="relative">
                  <Avatar className="h-32 w-32 ring-8 ring-secondary/50 shadow-2xl">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-4xl font-black bg-secondary text-primary uppercase">
                      {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Link 
                    to={ROUTES.EDIT_PROFILE} 
                    title="Edit Identity"
                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl border-4 border-background hover:scale-110 transition-transform"
                  >
                    <Edit3 size={16} />
                  </Link>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{profile?.full_name || profile?.username || 'Anonymous User'}</h1>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 px-4 py-1.5 bg-secondary/50 rounded-full">
                      {profile?.user_type || 'User'}
                    </span>
                    {profile?.is_verified && (
                      <div className="flex items-center gap-1 text-primary">
                        <ShieldCheck size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 w-full border-y border-secondary py-8">
                  {userStats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <div className="text-lg font-black tracking-tighter">{stat.value}</div>
                      <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="w-full space-y-4 pt-2">
                  {[
                    { icon: Mail, value: profile?.email || 'No identity record' },
                    { icon: MapPin, value: profile?.city || 'Location unset' },
                    { icon: Calendar, value: 'Established ' + (profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear()) },
                  ].map((info, i) => (
                    <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <info.icon size={14} className="text-primary/40 shrink-0" />
                      <span className="truncate">{info.value}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full pt-6 flex gap-3">
                  <button 
                    onClick={() => navigate(ROUTES.SETTINGS)}
                    title="System Configuration"
                    className="flex-1 h-16 bg-secondary/50 text-primary rounded-2xl flex items-center justify-center hover:bg-secondary transition-all"
                  >
                    <Settings size={20} />
                  </button>
                  <button 
                    onClick={handleLogout}
                    title="Terminate Session"
                    className="h-16 w-16 bg-destructive/5 text-destructive rounded-2xl flex items-center justify-center hover:bg-destructive hover:text-white transition-all"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Program CTA */}
            {profile?.user_type !== 'agent' && (
              <div className="p-10 bg-primary rounded-[3rem] space-y-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-foreground/40 italic">Exclusive Program</div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">Elevate to <br />Asset Manager.</h3>
                <p className="text-xs font-medium text-white/50 leading-relaxed">
                  Unlock professional listing infrastructure and global market reach.
                </p>
                <button 
                  title="Apply for elevation"
                  className="w-full h-14 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-foreground transition-all flex items-center justify-center gap-2"
                >
                  Apply for Elevation
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.aside>

          {/* Asset Management Area */}
          <div className="space-y-16">
            <div className="flex flex-wrap items-center gap-12 border-b border-secondary">
              {['listings', 'saved', 'intelligence'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.45em] py-6 border-b-2 transition-all relative",
                    activeTab === tab 
                      ? "text-primary border-primary" 
                      : "text-muted-foreground/40 border-transparent hover:text-primary/60"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'listings' && (
                  <div className="space-y-10">
                    <div className="flex items-end justify-between gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Active Management</span>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Your Active Assets</h2>
                      </div>
                      <Link 
                        to={ROUTES.ADD_PROPERTY} 
                        className="h-14 px-8 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-premium transition-all shrink-0"
                      >
                        Initiate Listing
                      </Link>
                    </div>

                    {isLoadingMy ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                      </div>
                    ) : myProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {myProperties.map((p) => (
                          <PropertyCard key={p.id} property={p as any} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 md:py-32 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-secondary flex flex-col items-center justify-center text-center space-y-6">
                        <div className="space-y-2">
                          <h4 className="text-xl font-black uppercase tracking-tight">Zero Active Assets</h4>
                          <p className="text-xs font-medium text-muted-foreground italic">Initiate your portfolio strategy today.</p>
                        </div>
                        <Link 
                          to={ROUTES.ADD_PROPERTY}
                          className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1"
                        >
                          Create Project Record
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'saved' && (
                  <div className="space-y-10">
                    <div className="flex items-end justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Interest Stack</span>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Monitored Assets</h2>
                      </div>
                      <button className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-colors">
                        View Intelligence Report
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    {isLoadingSaved ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                      </div>
                    ) : savedProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {savedProperties.map((p) => (
                          <PropertyCard key={p.id} property={p as any} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 md:py-32 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-secondary flex flex-col items-center justify-center text-center space-y-6">
                        <div className="space-y-2">
                          <h4 className="text-xl font-black uppercase tracking-tight">No Saved Assets</h4>
                          <p className="text-xs font-medium text-muted-foreground italic">Explore properties to build your stack.</p>
                        </div>
                        <Link 
                          to={ROUTES.SEARCH}
                          className="text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-1"
                        >
                          Explore Market
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'intelligence' && (
                  <div className="space-y-12">
                     <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Biographical Records</span>
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Identity Narrative</h2>
                    </div>
                    
                    <div className="prose prose-stark max-w-none">
                      <p className="text-lg text-muted-foreground leading-relaxed font-medium italic">
                        {profile?.bio || "No narrative established for this identity. Define your real estate objectives to enhance market visibility."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                      {[
                        { title: 'Identity Type', items: [profile?.user_type || 'User'] },
                        { title: 'Verified Status', items: [profile?.is_verified ? 'Verified Citizen' : 'Pending Verification'] },
                      ].map((section, i) => (
                        <div key={i} className="p-8 bg-secondary/20 rounded-3xl border border-secondary space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">{section.title}</h4>
                          <div className="flex flex-wrap gap-2">
                            {section.items.map(tag => (
                              <span key={tag} className="text-[8px] font-black uppercase tracking-[0.3em] bg-white text-black px-3 py-1.5 rounded-full shadow-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </div>
  )
}