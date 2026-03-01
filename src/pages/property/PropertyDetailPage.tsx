import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronDown,
  Maximize, 
  MapPin,
  MessageSquare,
  Loader2,
  ArrowRight,
  Landmark,
  Calculator,
  LayoutGrid,
  Play,
  Box,
  User,
  Video,
  Calendar,
  Building2,
  Waves,
  Wifi,
  Wind,
  Zap,
  CheckCircle2,
  Trees,
  CloudRain,
  Sun,
  Flame,
  Dumbbell,
  Car,
  Fence,
  Utensils,
  Monitor,
  Navigation,
  Lock,
  Bell,
  ShieldCheck,
  Edit,
  Eye,
} from 'lucide-react'
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { useProperty, useFeaturedProperties } from '@/hooks/useProperties'
import { useFormatPrice } from '@/hooks/useFormatPrice'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { ROUTES } from '@/lib/constants'
import { toast } from 'sonner'
import { useSavedProperties } from '@/hooks/useSavedProperties'

export default function PropertyDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { userId } = useAuth()
  const { isSaved, toggleSave } = useSavedProperties()
  const [showLightbox, setShowLightbox] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [buyerPreviewMode, setBuyerPreviewMode] = useState(false)
  const [isEnquiring, setIsEnquiring] = useState(false)

  const { data: property, isLoading, error } = useProperty(slug || '')
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const isOwner = !!(userId && property && property.seller_id === userId)
  const showSellerView = isOwner && !buyerPreviewMode
  
  // Enquire: find or create a conversation then navigate to it
  const handleEnquire = async () => {
    if (!userId) {
      navigate(ROUTES.LOGIN)
      return
    }
    if (!property) return
    setIsEnquiring(true)
    try {
      // Check for existing conversation
      const { data: existing } = await (supabase
        .from('conversations') as any)
        .select('id')
        .eq('buyer_id', userId)
        .eq('seller_id', property.seller_id)
        .eq('property_id', property.id)
        .maybeSingle()

      if (existing) {
        navigate(`/messages/${existing.id}`)
        return
      }

      // Create new conversation
      const { data: newConv, error } = await (supabase
        .from('conversations') as any)
        .insert({
          buyer_id: userId,
          seller_id: property.seller_id,
          property_id: property.id,
        })
        .select('id')
        .single()

      if (error) throw error
      navigate(`/messages/${(newConv as any).id}`)
    } catch (err) {
      console.error('Enquire failed:', err)
      toast.error('Could not start a conversation. Please try again.')
    } finally {
      setIsEnquiring(false)
    }
  }

  // ── Amenity Icon Logic ──────────────────────────────────────────
  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase()
    if (a.includes('pool')) return <Waves size={14} className="text-black" />
    if (a.includes('wifi') || a.includes('internet')) return <Wifi size={14} className="text-black" />
    if (a.includes('garden') || a.includes('trees')) return <Trees size={14} className="text-black" />
    if (a.includes('solar') || a.includes('sun')) return <Sun size={14} className="text-black" />
    if (a.includes('borehole') || a.includes('water')) return <CloudRain size={14} className="text-black" />
    if (a.includes('security') || a.includes('guard')) return <ShieldCheck size={14} className="text-black" />
    if (a.includes('gym')) return <Dumbbell size={14} className="text-black" />
    if (a.includes('air con') || a.includes('ac')) return <Wind size={14} className="text-black" />
    if (a.includes('parking') || a.includes('garage')) return <Car size={14} className="text-black" />
    if (a.includes('fence')) return <Fence size={14} className="text-black" />
    if (a.includes('kitchen') || a.includes('utensils')) return <Utensils size={14} className="text-black" />
    if (a.includes('cctv') || a.includes('camera')) return <Video size={14} className="text-black" />
    if (a.includes('cinema') || a.includes('theater')) return <Monitor size={14} className="text-black" />
    if (a.includes('generator') || a.includes('power')) return <Zap size={14} className="text-black" />
    if (a.includes('fire') || a.includes('boma')) return <Flame size={14} className="text-black" />
    if (a.includes('alarm')) return <Bell size={14} className="text-black" />
    if (a.includes('intercom')) return <Navigation size={14} className="text-black" />
    if (a.includes('biometric') || a.includes('access')) return <Lock size={14} className="text-black" />
    
    return <CheckCircle2 size={14} className="text-black" />
  }

  const { data: featured } = useFeaturedProperties()
  const { format: formatPriceHelper, getRawValue, formatBig } = useFormatPrice()

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
                 onClick={() => property && toggleSave(property.id)}
                 className="h-12 px-6 rounded-none border border-border flex items-center gap-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-black hover:bg-secondary transition-all shadow-sm"
               >
                  <Heart size={18} strokeWidth={1.5} className={cn(property && isSaved(property.id) && "fill-black text-black")} />
                  {property && isSaved(property.id) ? 'Saved' : 'Save'}
               </button>
            </div>
          </div>
        </Container>

        <Container>
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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 lg:gap-24">
            
            <div className="space-y-16">
              {/* ── JamesEdition Header: Core Intelligence ───────────────── */}
              <section className="space-y-6">
                 {/* Price & Title Area */}
                  <div className="space-y-4">
                     <p className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">
                       {formatPriceHelper(property)}
                     </p>
                     <h1 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none max-w-4xl">
                       {property.title}
                     </h1>
                  </div>

                 {/* Core Stats Bar: Architectural Grid */}
                 <div className="flex flex-wrap items-center border-y border-border/40 py-6 gap-x-12 gap-y-6">
                    {[
                      { label: 'Beds', val: property.bedrooms },
                      { label: 'Baths', val: property.bathrooms },
                      { label: 'Sqm', val: property.floor_area?.toLocaleString() },
                      { label: 'Lot Size', val: property.lot_area ? `${property.lot_area} Ha` : '—' },
                      { label: 'MLS#', val: property.id.slice(0, 8).toUpperCase() }
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col gap-2">
                         <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                           {stat.label}
                         </span>
                         <span className="text-lg md:text-xl font-black text-black uppercase tracking-tighter">
                           {stat.val || '—'}
                         </span>
                      </div>
                    ))}
                 </div>

                 {/* Media Navigation & Verification */}
                 <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                    <div className="flex items-center gap-8">
                       {[
                         { label: 'Floor Plan', icon: LayoutGrid },
                         { label: 'Video', icon: Play },
                         { label: 'Virtual Tour', icon: Box },
                         { label: 'Street View', icon: MapPin }
                       ].map((link, i) => (
                         <button key={i} className="flex items-center gap-2 group cursor-pointer">
                            <link.icon size={14} className="text-muted-foreground group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-black transition-colors">
                              {link.label}
                            </span>
                         </button>
                       ))}
                    </div>

                    <div className="flex items-center gap-2 text-black/20">
                        <ShieldCheck size={14} />
        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Institutional Verification</span>
                    </div>
                 </div>
              </section>

               {/* ── Chapter 3: Architectural Narrative ─────────────── */}
                <section className="space-y-12 pb-16 border-b border-border/40">
                   <div className="space-y-12">
                      <h2 className="text-lg md:text-xl font-black uppercase tracking-[0.3em] text-black border-l-4 border-black pl-6">
                         About the Property
                      </h2>
                      <div className="prose prose-zinc max-w-none">
                         <p className="text-xl md:text-2xl font-medium text-black leading-[1.7] tracking-tight whitespace-pre-wrap">
                            {property.description}
                         </p>
                      </div>
                   </div>
                   
                   {/* Technical Specifications — Accordion for length control */}
                   <Accordion type="single" collapsible className="w-full pt-12 mt-12 border-t border-border/20">
                      <AccordionItem value="technical-specs" className="border-none">
                         <AccordionTrigger className="hover:no-underline p-0 pb-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60">Technical Specifications</h3>
                         </AccordionTrigger>
                         <AccordionContent className="pt-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                               {[
                                 { label: 'Property Type', val: property.property_type || 'Estate' },
                                 { label: 'Year Built', val: property.year_built || '—' },
                                 { label: 'Price / Sqm', val: property.floor_area ? formatBig(Math.round(getRawValue(property) / property.floor_area)) : '—' },
                                 { label: 'Garages', val: property.garages !== null ? property.garages : '—' },
                                 { label: 'Parking', val: property.parking !== null ? property.parking : '—' },
                                 { label: 'Lot Size', val: property.lot_area ? `${property.lot_area} Ha` : '—' }
                               ].map((spec, i) => (
                                 <div key={i} className="space-y-1.5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                       {spec.label}
                                    </p>
                                    <p className="text-base font-black text-black uppercase tracking-tighter">
                                       {spec.val}
                                    </p>
                                 </div>
                               ))}
                            </div>
                         </AccordionContent>
                      </AccordionItem>
                   </Accordion>
                </section>

               {/* ── Chapter 4: Amenities & Lifestyle (JamesEdition Grid) ──── */}
                <section className="space-y-12 pt-4">
                   <h2 className="text-lg md:text-xl font-black uppercase tracking-[0.3em] text-black border-l-4 border-black pl-6">
                      Features & Amenities
                   </h2>
                   
                   <Collapsible
                      open={showAllAmenities}
                      onOpenChange={setShowAllAmenities}
                      className="space-y-8"
                   >
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-12">
                         {property.amenities?.slice(0, 6)?.map((feat: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 group">
                               <div className="shrink-0">{getAmenityIcon(feat)}</div>
                               <span className="text-xs font-black uppercase tracking-widest text-black">
                                  {feat}
                               </span>
                            </div>
                         ))}
                         {(!property.amenities || property.amenities.length === 0) && (
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Inventory currently being catalogued.</p>
                         )}
                      </div>

                      <CollapsibleContent>
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-12 pt-8">
                            {property.amenities?.slice(6)?.map((feat: string, i: number) => (
                               <div key={i + 6} className="flex items-center gap-4 group">
                                  <div className="shrink-0">{getAmenityIcon(feat)}</div>
                                  <span className="text-xs font-black uppercase tracking-widest text-black">
                                     {feat}
                                  </span>
                               </div>
                            ))}
                         </div>
                      </CollapsibleContent>

                      {property.amenities && property.amenities.length > 6 && (
                         <CollapsibleTrigger asChild>
                            <Button 
                               variant="ghost" 
                               className="p-0 h-auto text-[10px] font-black uppercase tracking-[0.3em] text-black hover:bg-transparent flex items-center gap-2"
                            >
                               {showAllAmenities ? 'Collapse' : `Show All (${property.amenities.length})`}
                               <ChevronDown className={cn("transition-transform duration-300", showAllAmenities && "rotate-180")} size={12} />
                            </Button>
                         </CollapsibleTrigger>
                      )}
                   </Collapsible>
                </section>

               {/* ── Chapter 5: Property Composition ─────────────────── */}
                <section className="space-y-12 py-16 border-t border-border/40">
                   <Accordion type="single" collapsible defaultValue="genealogy" className="w-full">
                      <AccordionItem value="genealogy" className="border-none">
                         <AccordionTrigger className="hover:no-underline p-0">
                            <h2 className="text-lg md:text-xl font-black uppercase tracking-[0.3em] text-black border-l-4 border-black pl-6">
                               Property Genealogy
                            </h2>
                         </AccordionTrigger>
                         <AccordionContent className="pt-12">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                               {[
                                 { label: 'Furnishing', val: property.furnishing || '—' },
                                 { label: 'Condition', val: property.condition || '—' },
                                 { label: 'Erf Number', val: property.erf_number || '—' },
                                 { label: 'Last Updated', val: new Date(property.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                                 { label: 'First Listed', val: new Date(property.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                                 { label: 'Status', val: property.status?.toUpperCase() || 'ACTIVE' }
                               ].map((comp, i) => (
                                  <div key={i} className="space-y-1.5">
                                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                                        {comp.label}
                                     </p>
                                     <p className="text-base font-black text-black uppercase tracking-tighter">
                                        {comp.val}
                                     </p>
                                  </div>
                               ))}
                            </div>
                         </AccordionContent>
                      </AccordionItem>
                   </Accordion>
                </section>

              {/* ── Chapter 6: Agent & Office Context ────────────────── */}
               <section className="space-y-12 py-16 border-y border-border/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                     {/* Agent Branding */}
                     <div className="space-y-10">
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-[0.3em] text-black border-l-4 border-black pl-6">
                           Listed by
                        </h2>
                        <div className="flex items-start gap-10">
                           <Avatar className="h-40 w-40 rounded-none border border-border shadow-premium shrink-0">
                              <AvatarImage src={seller?.avatar_url || ''} />
                              <AvatarFallback className="font-black text-4xl bg-secondary text-black uppercase rounded-none">
                                {(seller?.full_name || 'S').charAt(0)}
                              </AvatarFallback>
                           </Avatar>
                           <div className="space-y-6">
                              <div className="space-y-2">
                                 <h3 className="text-3xl font-black uppercase tracking-tighter text-black leading-none">
                                    {seller?.full_name || 'Verified Curator'}
                                 </h3>
                                 <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                    {seller?.city ? `${seller.city}, ${seller.country}` : property.city + ', ' + property.country}
                                 </p>
                              </div>
                              <div className="flex flex-wrap gap-x-12 gap-y-4">
                                 <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Listings</span>
                                    <span className="text-lg font-black text-black">{seller?.listing_count || 0}</span>
                                 </div>
                                 <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Experience</span>
                                    <span className="text-lg font-black text-black">
                                       {seller?.created_at ? `${new Date().getFullYear() - new Date(seller.created_at).getFullYear()} Years` : 'Verified'}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Book Home Tour Suite */}
                     <div className="space-y-8 bg-secondary/20 p-10 border border-border/40">
                        <div className="space-y-2">
                           <h3 className="text-sm font-black uppercase tracking-widest text-black">Book Home Tour</h3>
                           <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
                              Choose a date and whether you'd like a virtual or in-person tour with the agent.
                           </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                           <Button variant="outline" className="h-14 rounded-none border-black/10 bg-white text-[10px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 hover:bg-black hover:text-white transition-all">
                              <User size={14} />
                              In-person
                           </Button>
                           <Button variant="outline" className="h-14 rounded-none border-black/10 bg-white text-[10px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 hover:bg-black hover:text-white transition-all">
                              <Video size={14} />
                              Virtual
                           </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white border border-border shadow-sm">
                           <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-black" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-black">1 March</span>
                           </div>
                           <ChevronDown size={14} className="text-muted-foreground" />
                        </div>

                        <Button className="w-full h-14 rounded-none bg-black text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest shadow-xl">
                           Schedule Private Viewing
                        </Button>
                     </div>
                  </div>


               </section>

             </div> {/* ── End left content column ── */}

             {/* ── STICKY SIDEBAR — Seller View ─────────────────────── */}
             {showSellerView ? (
               <aside className="relative">
                 <div className="sticky top-32 space-y-6">
                   {/* Owner Banner */}
                   <div className="bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/30 p-6 space-y-4">
                     <div className="flex items-center gap-2">
                       <ShieldCheck size={14} className="text-[hsl(var(--gold))]" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Your Listing</span>
                     </div>
                     <p className="text-xs font-medium text-muted-foreground">You're viewing your own property. Buyers see the enquiry form here.</p>
                     <Button
                       onClick={() => setBuyerPreviewMode(true)}
                       variant="outline"
                       className="w-full h-10 rounded-none border-[hsl(var(--gold))]/40 text-[10px] font-black uppercase tracking-widest hover:border-[hsl(var(--gold))] hover:text-[hsl(var(--gold))] transition-all"
                     >
                       <Eye size={14} className="mr-2" />
                       View as Buyer
                     </Button>
                   </div>

                   {/* Price Card */}
                   <div className="bg-background border border-border/60 p-8 shadow-premium space-y-6">
                     <div className="space-y-1">
                       <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/60">Listed at</p>
                       <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-black">{formatPriceHelper(property)}</h3>
                       {property.listing_type === 'rent' && <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Per Month</p>}
                     </div>
                     <div className="space-y-3">
                       <Link
                         to={ROUTES.EDIT_PROPERTY.replace(':id', property.id)}
                         className="w-full h-14 bg-black text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all"
                       >
                         <Edit size={16} />
                         Edit This Listing
                       </Link>
                       <Button
                         variant="outline"
                         className="w-full h-12 rounded-none border-border text-xs font-black uppercase tracking-widest transition-all"
                         onClick={() => setBuyerPreviewMode(true)}
                       >
                         <Eye size={14} className="mr-2" />
                         Preview as Buyer
                       </Button>
                     </div>
                   </div>

                   {/* Quick Stats */}
                   <div className="bg-background border border-border/60 p-8 shadow-sm space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Quick Stats</p>
                     <div className="grid grid-cols-2 gap-4">
                       {[
                         { label: 'Views', val: property.view_count ?? 0, icon: Eye },
                         { label: 'Enquiries', val: 0, icon: MessageSquare },
                       ].map((s) => (
                         <div key={s.label} className="space-y-1">
                           <s.icon size={12} className="text-muted-foreground/40" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{s.label}</p>
                           <p className="text-xl font-black text-black">{s.val}</p>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
               </aside>
             ) : (
             <aside className="relative">
              <div className="sticky top-32 space-y-6">
                {/* Main Action Card */}
                <div className="bg-background border border-border/60 rounded-none p-10 shadow-premium space-y-10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-none -translate-y-4 translate-x-4 transition-transform group-hover:scale-110" />
                   
                   <div className="space-y-4 relative z-10">
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/60">Market Evaluation</p>
                      <div className="space-y-1">
                         <h3 className="text-5xl font-black tracking-tighter uppercase leading-none text-black">
                            {formatPriceHelper(property)}
                         </h3>
                         {property.listing_type === 'rent' && <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Institutional Lease / Monthly</p>}
                         {property.listing_type === 'short_term' && <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">Luxury Residency / Nightly</p>}
                      </div>
                   </div>

                   <div className="space-y-4 relative z-10">
                       <Button onClick={handleEnquire} disabled={isEnquiring} className="w-full h-20 rounded-none bg-black text-white hover:bg-zinc-800 transition-all font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 group/btn">
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
             )}
          </div>

          {/* ── CHAPTER 9: RELATED DISCOVERIES ────────────────────────── */}
          <div className="mt-32 space-y-32 border-t border-border/40 pt-24">
             {/* Similar Properties */}
             {featured && featured.length > 0 && (
               <section className="space-y-12">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-black">
                           <Landmark size={14} />
                           <span className="text-xs font-black uppercase tracking-widest opacity-60">Curated Context</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black">Similar Properties Nearby</h2>
                     </div>
                  </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                   {featured?.filter(f => f.id !== property.id).slice(0, 4).map((p) => (
                     <PropertyCard key={p.id} property={p as any} />
                   ))}
                 </div>
               </section>
             )}

             {/* New Listings in Location */}
             <section className="space-y-12">
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tighter text-black mb-12">New Listings in {property.city}</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                      {featured && featured.filter(f => f.city === property.city && f.id !== property.id).slice(0, 4).map((p) => (
                        <PropertyCard key={p.id} property={p as any} />
                      ))}
                      {/* Fallback if no city matches */}
                      {featured && featured.filter(f => f.city === property.city && f.id !== property.id).length === 0 && (
                         featured.slice(4, 8).map((p) => (
                           <PropertyCard key={p.id} property={p as any} />
                         ))
                      )}
                   </div>
                </div>
             </section>

             {/* SEO Links & Exploration */}
             <section className="bg-black text-white p-12 md:p-20 space-y-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                   <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Property Types</h4>
                       <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-white/60">
                          <li>
                             <Link to="/search?city=Lusaka&property_type=house&listing_type=sale" className="hover:text-white transition-colors">
                                Houses for sale in Lusaka
                             </Link>
                          </li>
                          <li>
                             <Link to="/search?city=Lusaka&property_type=penthouse&listing_type=sale" className="hover:text-white transition-colors">
                                Penthouses for sale in Lusaka
                             </Link>
                          </li>
                          <li>
                             <Link to="/search?city=Lusaka&q=estate&listing_type=sale" className="hover:text-white transition-colors">
                                Estates for sale in Lusaka
                             </Link>
                          </li>
                       </ul>
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Popular Searches</h4>
                       <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-white/60">
                          <li>
                             <Link to="/search?city=Lusaka&q=pool" className="hover:text-white transition-colors">
                                Properties with Pool in Lusaka
                             </Link>
                          </li>
                          <li>
                             <Link to="/search?q=investment&country=ZM" className="hover:text-white transition-colors">
                                Investment Properties in ZM
                             </Link>
                          </li>
                          <li>
                             <Link to="/search?property_type=student_accom&country=ZM" className="hover:text-white transition-colors">
                                Boarding houses in ZM
                             </Link>
                          </li>
                       </ul>
                   </div>
                   <div className="space-y-8 bg-white/5 p-8 border border-white/10">
                      <div className="space-y-2">
                         <h4 className="text-xs font-black uppercase tracking-widest text-white">Get Luxury Trends</h4>
                         <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Top luxury picks delivered to your inbox each week.</p>
                      </div>
                      <div className="flex gap-2">
                         <input type="email" placeholder="Your email address" className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-white transition-all" />
                         <Button className="rounded-none bg-white text-black hover:bg-zinc-200 px-6 font-black text-[10px] uppercase tracking-widest">Join</Button>
                      </div>
                   </div>
                </div>
             </section>
          </div>
        </Container>
      </main>

      {/* ── MOBILE STICKY ACQUISITION BAR ───────────────────────────── */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/40 p-4 z-40 animate-in slide-in-from-bottom duration-700">
        <Container>
          {showSellerView ? (
            <div className="flex items-center gap-3">
              <Link
                to={ROUTES.EDIT_PROPERTY.replace(':id', property.id)}
                className="flex-1 h-14 bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-zinc-800"
              >
                <Edit size={16} />
                Edit Listing
              </Link>
              <Button
                variant="outline"
                className="h-14 px-5 rounded-none font-black uppercase tracking-widest text-xs border-border"
                onClick={() => setBuyerPreviewMode(true)}
              >
                <Eye size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-8">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60">Acquisition Value</span>
                 <span className="text-2xl font-black tracking-tighter uppercase text-black">{formatPriceHelper(property)}</span>
              </div>
              <Button onClick={handleEnquire} disabled={isEnquiring} className="h-16 px-10 rounded-none font-black uppercase tracking-widest text-xs shadow-2xl bg-black text-white hover:bg-zinc-800 transition-all flex-1 md:flex-none">
                {isEnquiring ? <Loader2 size={16} className="animate-spin mr-2" /> : <MessageSquare size={16} className="mr-3" />}
                Inquire
              </Button>
            </div>
          )}
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
