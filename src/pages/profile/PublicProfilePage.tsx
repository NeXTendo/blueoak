import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, 
  Mail, 
  MessageSquare, 
  Share2, 
  Verified, 
  Building2, 
  Users, 
  Star 
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { ROUTES } from '@/lib/constants'
import type { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState(MOCK_PROPERTIES.slice(0, 4)) // Mock properties for now

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        // In a real app, we'd fetch by username. For now, we'll try to find a profile.
        // If username is actually an ID (common in early impl), use that.
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.eq.${username},id.eq.${username}`)
          .single()

        if (error) throw error
        setProfile(data)
        
        // Fetch properties for this seller
        const { data: propsData } = await supabase
          .from('properties')
          .select('*')
          .eq('seller_id', (data as Profile).id)
          .limit(10)
        
        if (propsData && propsData.length > 0) {
          setProperties(propsData as any)
        }
      } catch (error) {
        console.error('Error fetching public profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (username) getProfile()
  }, [username])

  if (loading) return <ProfileSkeleton />
  if (!profile) return <ProfileNotFound />

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* Dynamic Cover Section */}
      <section className="relative h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-background/20 z-10" />
        <img 
          src={profile.cover_url || "https://images.unsplash.com/photo-1626178732047-3965d83653d1?q=80&w=2070"} 
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-6 right-8 z-20 flex gap-2">
           <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all">
              <Share2 size={18} />
           </Button>
        </div>
      </section>

      <Container className="-mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Identity Token */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-8 bg-background border border-secondary/50 rounded-[2.5rem] shadow-premium space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl scale-110">
                  <AvatarImage src={profile.avatar_url || ''} />
                  <AvatarFallback className="text-4xl font-black">{profile.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight">{profile.full_name}</h1>
                    {profile.is_verified && <Verified className="text-primary h-5 w-5" />}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">
                    {profile.user_type} • Authorized Member
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 py-2">
                 <div className="text-center">
                    <div className="text-lg font-black tracking-tight">{profile.listing_count || properties.length}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Listings</div>
                 </div>
                 <Separator orientation="vertical" className="h-8 bg-secondary" />
                 <div className="text-center">
                    <div className="text-lg font-black tracking-tight">{profile.rating || '4.9'}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Rating</div>
                 </div>
                 <Separator orientation="vertical" className="h-8 bg-secondary" />
                 <div className="text-center">
                    <div className="text-lg font-black tracking-tight">34</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Reviews</div>
                 </div>
              </div>

              <div className="space-y-3 pt-4">
                 <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 gap-3 group">
                    <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                    Secure Message
                 </Button>
                 <Button variant="secondary" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                    <Mail size={16} />
                    Direct Inquiry
                 </Button>
              </div>
            </div>

            {/* Quick Stats Cabinet */}
            <div className="p-8 bg-secondary/20 rounded-[2.5rem] space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Authorized Credentials</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm">
                        <MapPin size={18} />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Primary Location</p>
                        <p className="text-xs font-bold">{profile.city || 'Lusaka'}, {profile.country || 'Zambia'}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm">
                        <Building2 size={18} />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Active Managed</p>
                        <p className="text-xs font-bold">{profile.listing_count || 12} Assets in Portfolio</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm">
                        <Users size={18} />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Client Network</p>
                        <p className="text-xs font-bold">850+ Verified connections</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Portfolio & Intelligence */}
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
               <h2 className="text-3xl font-black uppercase tracking-tight text-primary">Biographical Data</h2>
               <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl text-lg">
                  {profile.bio || "No biographical information has been provided for this profile identity. This member is currently transitioning to our premium tier access."}
               </p>
            </div>

            <Separator className="bg-secondary/50" />

            {/* Managed Assets Grid */}
            <div className="space-y-10">
               <div className="flex items-end justify-between">
                  <div className="space-y-2">
                     <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Portfolio</span>
                     </div>
                     <h2 className="text-4xl font-black uppercase tracking-tight">Active Listings</h2>
                  </div>
                  <Button variant="link" className="font-black text-[10px] uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all">
                     View All Discovery
                  </Button>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property as any} />
                  ))}
               </div>
               
               {properties.length === 0 && (
                 <div className="py-20 text-center bg-secondary/10 rounded-[2.5rem] border-2 border-dashed border-secondary">
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">No active listings found in this repository.</p>
                 </div>
               )}
            </div>

            {/* Testimonials Hub */}
            <div className="space-y-10">
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                     <div className="h-1 w-1 rounded-full bg-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reputation</span>
                  </div>
                  <h2 className="text-4xl font-black uppercase tracking-tight">Vouched Testimony</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: 'Michael C.', rating: 5, text: 'Exceptional service and deep market intelligence. Truly a premium experience.' },
                    { name: 'Elena R.', rating: 5, text: 'The verification process gave me total peace of mind. Highly professional.' }
                  ].map((review, i) => (
                    <div key={i} className="p-8 bg-secondary/10 rounded-3xl space-y-4 border border-border/5">
                       <div className="flex gap-1">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} className="fill-primary text-primary" />)}
                       </div>
                       <p className="text-sm font-medium text-foreground/80 italic">"{review.text}"</p>
                       <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{review.name} • Verified Transaction</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <Container className="py-20 space-y-12">
      <div className="h-80 w-full bg-secondary/20 rounded-[2.5rem] animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <Skeleton className="h-[600px] rounded-[2.5rem]" />
        <div className="lg:col-span-2 space-y-12">
          <Skeleton className="h-40 rounded-[2.5rem]" />
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
        </div>
      </div>
    </Container>
  )
}

function ProfileNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
       <div className="text-6xl">🕵️‍♂️</div>
       <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight">Identity Not Found</h2>
          <p className="text-muted-foreground font-medium">The profile identity you are searching for does not exist in our global registry.</p>
       </div>
       <Button asChild className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
          <Link to={ROUTES.HOME}>Return to Intelligence Hub</Link>
       </Button>
    </div>
  )
}
