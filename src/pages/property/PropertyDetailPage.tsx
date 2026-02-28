import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Heart, 
  Share2, 
  ChevronLeft, 
  Bed, 
  Bath, 
  Maximize, 
  ShieldCheck,
  MapPin,
  MessageSquare,
  Loader2,
  Droplets,
  Sun,
  Zap,
  Home,
  Waves,
  Building2,
  Sparkles,
  History,
  Compass,
  ArrowRight,
  Landmark,
  Calculator
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { useProperty, useFeaturedProperties } from '@/hooks/useProperties'
import { useFormatPrice } from '@/hooks/useFormatPrice'
import { ROUTES } from '@/lib/constants'

export default function PropertyDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const { data: property, isLoading, error } = useProperty(slug || '')
  const { data: featured } = useFeaturedProperties()
  const { format } = useFormatPrice()

  const galleryImages = useMemo(() => {
    const images: string[] = []
    if (property?.cover_image_url) images.push(property.cover_image_url)
    if (property?.media && Array.isArray(property.media)) {
      property.media.forEach((m: any) => {
        if (m.url && !images.includes(m.url)) images.push(m.url)
      })
    }
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000')
    }
    return images
  }, [property])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-6">
           <div className="relative">
            <Loader2 className="w-12 h-12 animate-spin text-foreground" />
             <div className="absolute inset-0 bg-foreground blur-2xl opacity-10" />
           </div>
           <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/60 animate-pulse">Establishing Secure Connection...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 text-center px-4">
        <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/20">
           <Building2 size={40} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-black">Record Not Found</h2>
          <p className="text-sm font-medium text-muted-foreground">The requested asset is currently unavailable in our global repository.</p>
        </div>
        <Button onClick={() => navigate(ROUTES.SEARCH)} className="bg-black text-white hover:bg-zinc-800 px-10 h-14 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Return to Market</Button>
      </div>
    )
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const seller = property?.profiles

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* ── Chapter 1: The Gallery (Cinematic Mosaic) ────────────────── */}
      <section className="relative pt-8">
        <Container className="px-4">
           {/* Navigation Context */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-black transition-all"
            >
              <div className="h-10 w-10 rounded-none border border-border flex items-center justify-center group-hover:bg-secondary transition-all">
                <ChevronLeft size={16} />
              </div>
              Establish Retreat
            </button>
            <div className="flex gap-3">
               <button 
                 onClick={async () => {
                   if (navigator.share) {
                     try {
                       await navigator.share({
                         title: property.title || 'Property Detail',
                         text: property.description || '',
                         url: window.location.href,
                       });
                     } catch (err) {
                       console.log('Share failed:', err);
                     }
                   } else {
                     navigator.clipboard.writeText(window.location.href);
                     alert('Collection URL copied to clipboard');
                   }
                 }}
                 className="h-12 w-12 rounded-none border border-border flex items-center justify-center text-muted-foreground hover:text-black hover:bg-secondary transition-all shadow-sm"
                 title="Share Portfolio Asset"
               >
                  <Share2 size={18} strokeWidth={1.5} />
               </button>
               <button 
                 onClick={() => setIsSaved(!isSaved)}
                 className="h-12 x-12 px-6 rounded-none border border-border flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-black hover:bg-secondary transition-all shadow-sm"
               >
                  <Heart size={18} strokeWidth={1.5} className={cn(isSaved && "fill-black text-black")} />
                  {isSaved ? 'Archived' : 'Archive'}
               </button>
            </div>
          </div>
        </Container>

        <Container className="md:px-4">
          {/* Mosaic Grid — JamesEdition Style (Desktop Only) */}
          <div className="hidden md:grid grid-cols-12 grid-rows-2 gap-3 h-[600px] rounded-none overflow-hidden relative group">
            <div 
              className="col-span-8 row-span-2 relative overflow-hidden cursor-zoom-in"
              onClick={() => { setActiveIndex(0); setShowLightbox(true); }}
            >
               <div className="absolute inset-0 bg-black/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <img src={galleryImages[0]} className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-105" alt="Hero Perspective" />
            </div>
            <div 
              className="col-span-4 row-span-1 relative overflow-hidden cursor-zoom-in"
              onClick={() => { setActiveIndex(1); setShowLightbox(true); }}
            >
               <img src={galleryImages[1] || galleryImages[0]} className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-105" alt="Alt View 1" />
            </div>
            <div 
              className="col-span-2 row-span-1 relative overflow-hidden cursor-zoom-in"
              onClick={() => { setActiveIndex(2); setShowLightbox(true); }}
            >
               <img src={galleryImages[2] || galleryImages[0]} className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-105" alt="Alt View 2" />
            </div>
            <div 
              className="col-span-2 row-span-1 relative overflow-hidden group/btn cursor-pointer"
              onClick={() => { setActiveIndex(3); setShowLightbox(true); }}
            >
               <img src={galleryImages[3] || galleryImages[0]} className="w-full h-full object-cover transition-transform duration-1000 md:group-hover:scale-105" alt="Alt View 3" />
               <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px] transition-all group-hover:bg-black/40">
                  <span className="text-2xl font-black">{galleryImages.length}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-white/70">View Portfolio</span>
               </div>
            </div>
          </div>

        </Container>

        {/* Mobile Gallery: Immersive Edge-to-Edge */}
        <div className="md:hidden w-full relative overflow-hidden bg-black">
           <div 
             onScroll={handleScroll}
             className="overflow-x-auto snap-x snap-mandatory no-scrollbar whitespace-nowrap"
           >
              {galleryImages.map((src, idx) => (
                 <div 
                   key={idx} 
                   className="inline-block w-full snap-center align-top relative"
                   onClick={() => { setActiveIndex(idx); setShowLightbox(true); }}
                 >
                    <img 
                      src={src} 
                      className="w-full h-auto min-h-[300px] object-contain block" 
                      alt={`Perspective ${idx + 1}`} 
                    />
                 </div>
              ))}
           </div>
           
           {/* Overlays (Counter & Maximize) */}
           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-black/60 text-white text-[10px] font-black px-6 py-2 rounded-none border border-white/10 uppercase tracking-[0.2em] backdrop-blur-md">
                 {activeIndex + 1} / {galleryImages.length}
              </div>
           </div>
           
           <div className="absolute top-4 right-4 h-10 w-10 bg-black/40 rounded-none flex items-center justify-center text-white backdrop-blur-md pointer-events-none">
              <Maximize size={16} />
           </div>
        </div>
      </section>

      {/* ── Main Layout (Content + Sticky Sidebar) ─────────────────── */}
      <main className="pt-16 pb-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-24 px-4">
            
            <div className="space-y-16">
              {/* ── Chapter 2: Essential Intelligence ───────────────── */}
               <section className="space-y-8">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-white bg-black px-5 py-2.5 rounded-none border border-white/10 shadow-xl">
                          {property.listing_type || 'Exclusivity'}
                        </span>
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2">
                          <MapPin size={12} />
                          {property.city}, {property.country}
                        </span>
                     </div>
                     <h1 className="font-serif text-4xl md:text-6xl font-black tracking-tighter text-black leading-[0.9] uppercase">
                       {property.title}
                     </h1>
                    <div className="flex items-center gap-2 text-black/40">
                        <ShieldCheck size={18} />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Institutional Verification Authorized</span>
                    </div>

                 {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-border/40">
                     {[
                       { icon: Bed, val: property.bedrooms, label: 'Residences', suffix: 'Beds' },
                       { icon: Bath, val: property.bathrooms, label: 'Sanctuary', suffix: 'Baths' },
                       { icon: Maximize, val: property.floor_area, label: 'Architecture', suffix: 'm²' },
                       { icon: Compass, val: 'North', label: 'Orientation', suffix: 'Facing' },
                     ].map((stat, i) => (
                       <div key={i} className="space-y-3 group">
                         <div className="h-12 w-12 rounded-none bg-secondary/30 flex items-center justify-center text-muted-foreground/30 group-hover:text-black group-hover:bg-secondary transition-all">
                            <stat.icon size={20} strokeWidth={1.5} />
                         </div>
                        <div className="space-y-0.5">
                           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">{stat.label}</p>
                           <p className="text-xl font-black uppercase tracking-tighter text-black">{stat.val} <span className="text-[11px] text-muted-foreground/60 font-medium normal-case">{stat.suffix}</span></p>
                        </div>
                      </div>
                    ))}
                 </div>
              </section>

              {/* ── Chapter 3: Architectural Narrative ─────────────── */}
               <section className="space-y-6">
                  <div className="flex items-center gap-4">
                     <History size={16} className="text-black" />
                     <h2 className="text-sm font-black uppercase tracking-[0.5em] text-black">Architectural Perspective</h2>
                  </div>
                 <div className="relative">
                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-black/20 via-border/20 to-transparent" />
                    <p className="text-xl md:text-2xl text-black font-medium leading-[1.7] indent-12 first-letter:text-5xl first-letter:font-black first-letter:text-black first-letter:mr-3 first-letter:float-left">
                       {property.description || "The architectural record for this asset is currently being finalized. This sanctuary represents a convergence of modern geometry and timeless environmental integration, established to provide an unparalleled market standard."}
                    </p>
                 </div>
              </section>

              {/* ── Chapter 4: Amenities & Lifestyle ───────────────── */}
               <section className="space-y-8">
                  <div className="flex items-center gap-4">
                     <Sparkles size={16} className="text-black" />
                     <h2 className="text-sm font-black uppercase tracking-[0.5em] text-black">Living Elements</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     {/* Interior Focus */}
                     <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 text-black">
                           <Home size={14} className="text-black" />
                           Interior Specifications
                        </h3>
                       <div className="grid grid-cols-1 gap-6">
                          {property.amenities?.slice(0, 5).map((feat: string, i: number) => (
                             <div key={i} className="flex items-center gap-5 group">
                                <div className="h-2 w-2 rounded-full bg-black/20 group-hover:bg-black transition-all" />
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-black transition-all">{feat}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Exterior & Wellness */}
                    <div className="space-y-8">
                       <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 text-black">
                          <Waves size={14} className="text-black" />
                          Exterior Environments
                       </h3>
                       <div className="grid grid-cols-1 gap-6">
                          {property.amenities?.slice(5, 10).map((feat: string, i: number) => (
                             <div key={i} className="flex items-center gap-5 group">
                                <div className="h-2 w-2 rounded-full bg-black/20 group-hover:bg-black transition-all" />
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-black transition-all">{feat}</span>
                             </div>
                          ))}
                          {(!property.amenities || property.amenities.length < 5) && (
                             <p className="text-xs text-muted-foreground/40 font-medium uppercase tracking-widest">Additional amenities pending records finalisation.</p>
                          )}
                       </div>
                    </div>
                 </div>
              </section>

              {/* ── Chapter 5: Institutional Infrastructure ─────────── */}
               <section className="space-y-8">
                  <div className="flex items-center gap-4">
                     <Zap size={16} className="text-black" />
                     <h2 className="text-sm font-black uppercase tracking-[0.5em] text-black">System Infrastructure</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Water Systems */}
                     <div className="p-10 bg-secondary/20 rounded-none border border-border/40 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-black/5 rounded-none translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                        <div className="h-16 w-16 rounded-none bg-background flex items-center justify-center text-blue-600 shadow-sm border border-border">
                           <Droplets size={28} />
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Water Intelligence</h4>
                           <p className="text-2xl font-black uppercase tracking-tighter text-black">
                              {property.has_borehole ? 'Borehole Integrated' : 'Municipal Connection'}
                           </p>
                           <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                              Automated filtration and pressure balancing established for continuous resource flow.
                           </p>
                        </div>
                     </div>

                     {/* Power Intelligence */}
                     <div className="p-10 bg-black text-white rounded-none space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-none translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
                        <div className="h-16 w-16 rounded-none bg-white/5 flex items-center justify-center text-white">
                           <Sun size={28} />
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-xs font-black uppercase tracking-widest text-white/30">Energy Resilience</h4>
                           <p className="text-2xl font-black uppercase tracking-tighter text-white">
                              {property.has_solar ? 'Solar Powered Grid' : property.has_generator ? 'Backup Generation' : 'Grid Integrated'}
                           </p>
                           <p className="text-xs font-medium text-white/40 leading-relaxed">
                              High-efficiency PV modules and storage modules providing off-grid architectural autonomy.
                           </p>
                        </div>
                     </div>
                  </div>
               </section>

              {/* ── Chapter 6: Location Intelligence ────────────────── */}
               <section className="space-y-8">
                  <div className="flex items-center gap-4">
                     <Compass size={16} className="text-black" />
                     <h2 className="text-sm font-black uppercase tracking-[0.5em] text-black">Global Coordinates</h2>
                  </div>
                  
                  <div className="space-y-8">
                     <div className="aspect-[21/9] w-full bg-secondary/10 rounded-none border-2 border-border/40 relative overflow-hidden group shadow-inner">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-[2s] opacity-40 group-hover:opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-transparent" />
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                            <div className="p-5 rounded-none bg-white border border-border shadow-2xl">
                               <MapPin size={32} className="text-black" />
                            </div>
                            <div className="space-y-1">
                               <h4 className="text-5xl font-black uppercase tracking-tighter text-black">{property.suburb || property.city}</h4>
                               <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60">{property.city}, {property.country}</p>
                            </div>
                            <Button variant="outline" className="h-14 px-10 rounded-none bg-white/50 backdrop-blur-md text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all border-black/10">
                               Establish Navigation
                            </Button>
                        </div>
                     </div>
                  </div>
               </section>
            </div>

            {/* ── STICKY SIDEBAR (Inquiry VAULT) ──────────────────────── */}
            <aside className="relative">
              <div className="sticky top-32 space-y-6">
                {/* Main Action Card */}
                <div className="bg-background border border-border/60 rounded-none p-10 shadow-premium space-y-10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-none -translate-y-4 translate-x-4 transition-transform group-hover:scale-110" />
                   
                   <div className="space-y-4 relative z-10">
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/60">Market Evaluation</p>
                      <div className="space-y-1">
                         <h3 className="text-5xl font-black tracking-tighter uppercase leading-none text-black">
                            {format(property)}
                         </h3>
                         {property.listing_type === 'rent' && <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Institutional Lease / Monthly</p>}
                         {property.listing_type === 'short_term' && <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Luxury Residency / Nightly</p>}
                      </div>
                   </div>

                   <div className="space-y-4 relative z-10">
                      <Button className="w-full h-20 rounded-none bg-black text-white hover:bg-zinc-800 transition-all font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 group/btn">
                         Initiate Inquiry
                         <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                      </Button>
                      <Button variant="outline" className="w-full h-16 rounded-none border-border bg-transparent hover:bg-secondary text-xs font-black uppercase tracking-widest transition-all">
                         Schedule Private Viewing
                      </Button>
                   </div>

                   <div className="pt-6 border-t border-border/40 space-y-6 relative z-10">
                      <p className="text-sm font-black uppercase tracking-[0.3em] text-center text-muted-foreground/60">Presented by Authorized Custodian</p>
                      <div className="flex items-center gap-6">
                         <Avatar className="h-16 w-16 ring-1 ring-border shadow-xl rounded-none">
                            <AvatarImage src={seller?.avatar_url || ''} />
                            <AvatarFallback className="font-black text-xl bg-secondary text-black uppercase rounded-none">{(seller?.full_name || 'S').charAt(0)}</AvatarFallback>
                         </Avatar>
                         <div className="space-y-1">
                            <h4 className="text-sm font-black uppercase tracking-tighter truncate max-w-[150px]">{seller?.full_name || 'Verified Curator'}</h4>
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-500">
                               <ShieldCheck size={12} strokeWidth={3} />
                               Verified Participant
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Sub-Actions */}
                <div className="grid grid-cols-1 gap-4">
                   <div className="p-6 bg-secondary/20 rounded-none border border-border/40 flex items-center gap-5 group cursor-pointer hover:border-black transition-all shadow-sm">
                      <div className="h-12 w-12 rounded-none bg-background flex items-center justify-center text-muted-foreground/40 group-hover:text-black transition-all shadow-sm">
                         <Calculator size={20} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Financial Discovery</p>
                         <p className="text-xs font-black uppercase tracking-widest group-hover:text-black transition-all text-black">Mortgage Evaluation</p>
                      </div>
                   </div>

                   <Link to={ROUTES.SEARCH} className="p-6 bg-background rounded-none border border-border/40 flex items-center gap-5 group cursor-pointer hover:border-black transition-all shadow-sm">
                      <div className="h-12 w-12 rounded-none bg-secondary/50 flex items-center justify-center text-muted-foreground/40 group-hover:text-black transition-all">
                         <Landmark size={20} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Market Expansion</p>
                         <p className="text-xs font-black uppercase tracking-widest group-hover:text-black transition-all text-black">Similar Portfolio Assets</p>
                      </div>
                   </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* ── CHAPTER 9: RELATED DISCOVERIES ────────────────────────── */}
          {featured && featured.length > 0 && (
            <section className="mt-24 border-t border-border/40 pt-24 space-y-12">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3 text-black">
                        <Landmark size={14} />
                        <span className="text-xs font-black uppercase tracking-widest opacity-60">Curated Selection</span>
                     </div>
                     <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">Related Perspective</h2>
                  </div>
                  <Link 
                    to={ROUTES.SEARCH}
                    className="text-xs font-black uppercase tracking-[0.3em] text-black border-b-2 border-black/10 pb-1 hover:border-black transition-all mb-2"
                  >
                    Establish Global Search
                  </Link>
               </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-4">
                {featured.filter(f => f.id !== property.id).slice(0, 4).map((p) => (
                  <PropertyCard key={p.id} property={p as any} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>

      {/* ── MOBILE STICKY ACQUISITION BAR ───────────────────────────── */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/40 p-6 z-40 animate-in slide-in-from-bottom duration-700">
        <Container>
          <div className="flex items-center justify-between gap-8">
            <div className="flex flex-col">
               <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Acquisition Value</span>
               <span className="text-2xl font-black tracking-tighter uppercase text-black">{format(property)}</span>
            </div>
            <Button className="h-16 px-10 rounded-none font-black uppercase tracking-widest text-xs shadow-2xl bg-black text-white hover:bg-zinc-800 transition-all flex-1 md:flex-none">
              <MessageSquare size={16} className="mr-3" />
              Inquire
            </Button>
          </div>
        </Container>
      </div>

      {/* ── FULLSCREEN LIGHTBOX ─────────────────────────────────────── */}
      {showLightbox && (
         <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
            <button 
              onClick={() => setShowLightbox(false)}
              aria-label="Close Lightbox"
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-all h-12 w-12 flex items-center justify-center rounded-none bg-white/5 border border-white/10"
            >
               <ChevronLeft size={24} className="rotate-90" />
            </button>
            
            <div className="relative w-full max-w-7xl aspect-[16/9] flex items-center justify-center">
               <img 
                 src={galleryImages[activeIndex]} 
                 className="w-full h-full object-contain animate-in zoom-in-110 duration-700" 
                 alt={`Enlarged Perspective ${activeIndex}`} 
               />
               
               {/* Lightbox Controls */}
               <button 
                 onClick={() => setActiveIndex((activeIndex - 1 + galleryImages.length) % galleryImages.length)}
                 aria-label="Previous Image"
                 className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-16 bg-white/5 border border-white/10 rounded-none flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md hidden md:flex"
               >
                  <ChevronLeft size={32} />
               </button>
               <button 
                 onClick={() => setActiveIndex((activeIndex + 1) % galleryImages.length)}
                 aria-label="Next Image"
                 className="absolute right-0 top-1/2 -translate-y-1/2 h-16 w-16 bg-white/5 border border-white/10 rounded-none flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md hidden md:flex"
               >
                  <ChevronLeft size={32} className="rotate-180" />
               </button>
            </div>

            <div className="mt-12 flex flex-col items-center gap-6">
               <div className="flex gap-3 overflow-x-auto max-w-full no-scrollbar px-4">
                  {galleryImages.map((src, idx) => (
                     <button
                       key={idx}
                       onClick={() => setActiveIndex(idx)}
                       className={cn(
                         "relative h-20 w-32 flex-shrink-0 rounded-none overflow-hidden border-2 transition-all",
                         activeIndex === idx ? "border-white scale-105" : "border-transparent opacity-40 hover:opacity-100"
                       )}
                     >
                        <img src={src} className="h-full w-full object-cover" alt={`Thumb ${idx}`} />
                     </button>
                  ))}
               </div>
               <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">{activeIndex + 1} / {galleryImages.length} ── PORTFOLIO PERSPECTIVE</p>
            </div>
         </div>
      )}
    </div>
  )
}
