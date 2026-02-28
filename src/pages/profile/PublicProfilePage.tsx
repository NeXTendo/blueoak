import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  Building2, 
  Star,
  Calendar,
  ArrowRight,
  Loader2,
  Award,
  Quote
} from 'lucide-react'
import { usePublicProfile, usePublicProperties, usePublicReviews } from '@/hooks/useProperties'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings')

  const { data: profile, isLoading: isLoadingProfile } = usePublicProfile(username || '')
  const { data: properties = [], isLoading: isLoadingProps } = usePublicProperties(profile?.id || '')
  const { data: reviews = [], isLoading: isLoadingReviews } = usePublicReviews(profile?.id || '')

  const stats = useMemo(() => [
    { label: 'Market Assets', value: properties.length, icon: Building2 },
    { label: 'Vouched Rate', value: reviews.length > 0 ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1) : '5.0', icon: Star },
    { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).getFullYear() : '2024', icon: Calendar },
  ], [properties.length, reviews, profile?.created_at])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Identity Link Copied', {
      description: 'The public profile URL has been saved to your clipboard.',
    })
  }

  if (isLoadingProfile) return <ProfileLoading />
  if (!profile) return <ProfileNotFound />

  return (
    <div className="flex flex-col min-h-screen bg-background pb-40">
      {/* Cinematic Identity Cover */}
      <section className="relative h-[30vh] md:h-[45vh] bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-60">
           {profile.cover_url ? (
             <img src={profile.cover_url} alt="" className="w-full h-full object-cover grayscale-[0.2]" />
           ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        
        <div className="absolute top-10 right-10 z-20 flex gap-4">
           <Button 
            variant="secondary" 
            size="icon" 
            onClick={handleShare}
            title="Share Identity"
            className="h-14 w-14 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all shadow-2xl"
           >
              <Share2 size={20} />
           </Button>
        </div>

        {/* Floating Accents */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--gold)/0.05)] rounded-full blur-[150px] -translate-y-1/2" />
      </section>

      <Container className="-mt-32 relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 lg:gap-20">
          
          {/* Physical Identity Column */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            {/* Identity Token */}
            <div className="bg-background border border-border/60 rounded-[3rem] p-10 shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[hsl(var(--gold)/0.03)] rounded-bl-[8rem] -translate-y-6 translate-x-6" />
              
              <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-[hsl(var(--gold))] rounded-full blur-2xl opacity-10" />
                  <Avatar className="h-40 w-40 ring-1 ring-border shadow-2xl relative z-10">
                    <AvatarImage src={profile.avatar_url || ""} className="object-cover" />
                    <AvatarFallback className="text-5xl font-black bg-secondary text-[hsl(var(--gold))] uppercase">
                      {profile.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-4 w-full">
                  <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">{profile.full_name || 'Anonymous Participant'}</h1>
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center justify-center gap-1.5">
                       Verified Market Presence
                       <ShieldCheck size={12} className="text-emerald-500" />
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[hsl(var(--gold))] px-5 py-2 bg-secondary/40 rounded-full border border-border/20">
                      {profile.user_type || 'Buyer'}
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-6 pt-4 text-left border-t border-border/40 mt-4">
                  <div className="space-y-1">
                     <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 italic">Biographical Records</p>
                     <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                        {profile.bio || "No public identity narrative established. This participant maintains a discreet market presence."}
                     </p>
                  </div>
                </div>

                <div className="w-full pt-8 flex flex-col gap-4">
                  <Button 
                    className="h-16 rounded-2xl bg-black text-white hover:bg-[hsl(var(--gold))] hover:text-black transition-all gap-3 group shadow-xl"
                    onClick={() => navigate(ROUTES.MESSAGES + `?user=${profile.id}`)}
                  >
                    <MessageSquare size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Enact Communication</span>
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-14 rounded-xl border-border/60 text-[9px] font-black uppercase tracking-widest hover:border-[hsl(var(--gold))] hover:bg-secondary/20 transition-all">
                       Email
                    </Button>
                    <Button variant="outline" className="h-14 rounded-xl border-border/60 text-[9px] font-black uppercase tracking-widest hover:border-[hsl(var(--gold))] hover:bg-secondary/20 transition-all">
                       Phone
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Stats */}
            <div className="grid grid-cols-1 gap-6">
               {stats.map((stat, i) => (
                 <div key={i} className="p-8 bg-secondary/10 border border-border/40 rounded-[2rem] flex items-center justify-between group hover:bg-secondary/20 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="h-12 w-12 rounded-xl bg-background border border-border/60 flex items-center justify-center text-muted-foreground/40 group-hover:text-[hsl(var(--gold))] transition-all shadow-sm">
                          <stat.icon size={20} />
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">{stat.label}</p>
                          <p className="text-lg font-black uppercase tracking-tighter">{stat.value}</p>
                       </div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground/20 group-hover:translate-x-1 group-hover:text-[hsl(var(--gold))] transition-all" />
                 </div>
               ))}
            </div>
          </motion.aside>

          {/* Market Activity Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16"
          >
            {/* Tab Navigation */}
            <div className="flex items-center gap-12 md:gap-20 border-b border-border/40 overflow-x-auto no-scrollbar">
              {['listings', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.45em] py-8 border-b-2 transition-all relative whitespace-nowrap",
                    activeTab === tab 
                      ? "text-foreground border-foreground" 
                      : "text-muted-foreground/30 border-transparent hover:text-foreground/60"
                  )}
                >
                  {tab === 'listings' ? 'Active Assets' : 'Vouched Testimony'}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTabUnderlinePublic" 
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
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <Building2 size={14} className="text-[hsl(var(--gold))]" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Current Portfolio</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Market Presence</h2>
                    </div>

                    {isLoadingProps ? (
                      <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--gold))]" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Syncing Records...</p>
                      </div>
                    ) : properties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {properties.map((p) => (
                          <PropertyCard key={p.id} property={p as any} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 md:py-40 bg-secondary/10 rounded-[4rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/20">
                           <Building2 size={40} />
                        </div>
                        <div className="space-y-3 max-w-sm">
                          <h4 className="text-2xl font-black uppercase tracking-tight">Archives Empty</h4>
                          <p className="text-xs font-medium text-muted-foreground/60 leading-relaxed italic">No active assets are currently registered to this participant's identity.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-12">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <Star size={14} className="text-[hsl(var(--gold))]" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Participant Trust</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Vouched Status</h2>
                    </div>

                    {isLoadingReviews ? (
                      <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <Loader2 className="h-12 w-12 animate-spin text-[hsl(var(--gold))]" />
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Verifying Testimony...</p>
                      </div>
                    ) : reviews.length > 0 ? (
                      <div className="grid grid-cols-1 gap-10">
                        {reviews.map((review: any) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            key={review.id} 
                            className="bg-background border border-border/60 rounded-[3rem] p-10 md:p-14 space-y-8 relative group hover:border-[hsl(var(--gold))] transition-all"
                          >
                            <Quote className="absolute top-10 right-10 h-16 w-16 text-secondary/40 group-hover:text-[hsl(var(--gold)/0.1)] transition-all" />
                            
                            <div className="flex items-center gap-6">
                              <Avatar className="h-16 w-16 border-2 border-background shadow-xl">
                                <AvatarImage src={review.profiles?.avatar_url} />
                                <AvatarFallback className="font-black">{(review.profiles?.full_name || 'U').charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-lg font-black uppercase tracking-tight">{review.profiles?.full_name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      size={12} 
                                      className={cn(i < review.rating ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" : "text-muted-foreground/20")} 
                                    />
                                  ))}
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 ml-2 italic">Institutional Review</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed italic relative z-10">
                              "{review.comment}"
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-border/40">
                               <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Logged {new Date(review.created_at).toLocaleDateString()}</span>
                               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Verified Narrative</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 md:py-40 bg-secondary/10 rounded-[4rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/20">
                           <Award size={40} />
                        </div>
                        <div className="space-y-3 max-w-sm">
                          <h4 className="text-2xl font-black uppercase tracking-tight">Pure Reputation</h4>
                          <p className="text-xs font-medium text-muted-foreground/60 leading-relaxed italic">This participant has no recorded testimonials. This typically indicates a clinical market presence.</p>
                        </div>
                      </div>
                    )}
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

function ProfileLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-20 items-center justify-center space-y-8">
       <div className="relative">
          <Loader2 className="h-20 w-20 animate-spin text-[hsl(var(--gold))]" />
          <div className="absolute inset-0 bg-[hsl(var(--gold))] blur-[60px] opacity-20" />
       </div>
       <p className="text-[12px] font-black uppercase tracking-[1em] text-muted-foreground/40 animate-pulse ml-4">Decrypting Identity...</p>
    </div>
  )
}

function ProfileNotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center text-center p-10">
       <div className="space-y-6 max-w-lg">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-muted-foreground/10 select-none">Void Access</h1>
          <div className="space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-tight">Identity Record Missing</h2>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">The requested market participant does not exist in our institutional repository. Verify the identity link and return to market discovery.</p>
          </div>
          <Link 
            to={ROUTES.SEARCH}
            className="inline-flex h-16 px-12 bg-black text-white rounded-2xl items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-[hsl(var(--gold))] hover:text-black transition-all shadow-2xl"
          >
            Return to Discovery
          </Link>
       </div>
    </div>
  )
}
