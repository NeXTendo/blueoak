import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Heart, 
  Share2, 
  ChevronLeft, 
  Bed, 
  Bath, 
  Maximize, 
  CheckCircle2, 
  ShieldCheck,
  MapPin,
  MessageSquare,
  Info,
  Loader2,
  Droplets,
  Sun,
  Zap,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'

import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
} from '@/components/ui/carousel'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { useProperty, useFeaturedProperties } from '@/hooks/useProperties'

export default function PropertyDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)

  const { data: property, isLoading, error } = useProperty(slug || '')
  const { data: featured } = useFeaturedProperties()

  const formatPrice = (price: number | undefined, currency: string | undefined) => {
    if (price === undefined) return 'Contact for Price'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'ZMW',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const galleryImages = useMemo(() => {
    const images: string[] = []
    
    // Add primary cover image
    if (property?.cover_image_url) images.push(property.cover_image_url)
    
    // Add media gallery
    if (property?.media && Array.isArray(property.media)) {
      property.media.forEach((m: any) => {
        if (m.url && !images.includes(m.url)) images.push(m.url)
      })
    }
    
    // Fallback if no images found
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000')
    }
    
    return images
  }, [property])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-xl font-bold">Property not found</p>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    )
  }

  const price = property?.asking_price || property?.monthly_rent || property?.nightly_rate || 0
  const seller = property?.profiles

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* Header Info (Mobile & Desktop) */}
      <section className="pt-8 pb-6 px-4">
        <Container>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <div className="flex gap-2">
                <button 
                  aria-label="Share this property"
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  aria-label={isSaved ? "Remove from saved" : "Save this property"}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <Heart size={18} className={cn(isSaved && "fill-primary text-primary")} />
                </button>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-1 underline decoration-2 cursor-pointer">{property.city}, {property.country}</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-primary" />
                {property.status === 'active' ? 'Verified Listing' : 'Verification Pending'}
              </span>
              {property.has_solar && (
                <>
                  <span className="flex items-center gap-1">•</span>
                  <span className="flex items-center gap-1 text-[hsl(var(--gold))]">
                    <Sun size={14} />
                    Solar Powered
                  </span>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="px-4">
        <Container>
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden relative group">
            <div className="col-span-2 row-span-2 relative overflow-hidden">
              <img src={galleryImages[0]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer" alt="Main View" />
            </div>
            {galleryImages.slice(1, 5).map((src: string, i: number) => (
              <div key={i} className="relative overflow-hidden">
                <img src={src} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer" alt={`Gallery ${i}`} />
              </div>
            ))}
            {galleryImages.length > 5 && (
              <button className="absolute bottom-6 right-6 px-4 py-2 bg-white text-black border border-black text-sm font-semibold rounded-lg shadow-md hover:bg-neutral-100 transition-colors">
                Show all photos
              </button>
            )}
          </div>

          {/* Mobile Carousel Layout */}
          <div className="md:hidden relative aspect-[4/3] w-full overflow-hidden rounded-xl">
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {galleryImages.map((src: string, index: number) => (
                  <CarouselItem key={index} className="h-full">
                    <img src={src} className="w-full h-full object-cover" alt={`View ${index}`} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                {galleryImages.length > 0 ? `1 / ${galleryImages.length}` : 'No Photos'}
              </div>
            </Carousel>
          </div>
        </Container>
      </section>

      {/* Main Content & Sidebar */}
      <main className="pt-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-24 px-4">
            
            {/* Property Details */}
            <div className="space-y-10">
              <div className="flex items-center justify-between pb-8 border-b">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Listed by {seller?.full_name || 'Verified Seller'}</h2>
                  <p className="text-muted-foreground font-medium">Professional Real Estate Advisor • Verified</p>
                </div>
                <Avatar className="h-14 w-14">
                  <AvatarImage src={seller?.avatar_url || ''} />
                  <AvatarFallback>{(seller?.full_name || 'S').substring(0, 1)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-4 py-2">
                {[
                  { icon: Bed, value: property.bedrooms, label: 'bedrooms' },
                  { icon: Bath, value: property.bathrooms, label: 'bathrooms' },
                  { icon: Maximize, value: property.floor_area, label: 'sqm area' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <stat.icon size={22} className="text-foreground" strokeWidth={1.5} />
                    <div className="font-semibold text-lg">{stat.value || '-'}</div>
                    <div className="text-[13px] text-muted-foreground font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="h-[1px] bg-secondary w-full" />

              {/* Narrative */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-xl mt-1">
                    <Info size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">About this property</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium mt-2 whitespace-pre-wrap">
                      {property.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-secondary w-full" />

              {/* Inclusions */}
              {property.amenities?.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">What this place offers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.amenities.map((feat: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-muted-foreground">
                        <CheckCircle2 size={20} className="text-primary/60" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-[1px] bg-secondary w-full" />

              {/* Technical Infrastructure */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Technical Infrastructure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.has_borehole && (
                    <div className="flex items-center gap-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Droplets size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-blue-500/60">Borehole / Well</div>
                        <div className="font-bold">{property.water_tank_capacity ? `${property.water_tank_capacity}L Tank Capacity` : 'Active Connection'}</div>
                      </div>
                    </div>
                  )}
                  {property.has_solar && (
                    <div className="flex items-center gap-4 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                      <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                        <Sun size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-yellow-600/60">Solar Power System</div>
                        <div className="font-bold">{property.solar_capacity ? `${property.solar_capacity}kW Output` : 'Full System'}</div>
                      </div>
                    </div>
                  )}
                  {property.has_generator && (
                    <div className="flex items-center gap-4 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                        <Zap size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-orange-600/60">Backup Generator</div>
                        <div className="font-bold">{property.generator_capacity ? `${property.generator_capacity}kVA Capacity` : 'Active Standby'}</div>
                      </div>
                    </div>
                  )}
                  {property.has_staff_quarters && (
                    <div className="flex items-center gap-4 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                      <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600">
                        <Home size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-black uppercase tracking-widest text-green-600/60">Staff Accomodation</div>
                        <div className="font-bold">Quarters Available</div>
                      </div>
                    </div>
                  )}
                  {!property.has_borehole && !property.has_solar && !property.has_generator && !property.has_staff_quarters && (
                    <div className="col-span-2 text-sm text-muted-foreground italic">
                      No additional technical infrastructure specified.
                    </div>
                  )}
                </div>
              </div>

              <div className="h-[1px] bg-secondary w-full" />

              {/* Location Mock */}
              <div className="space-y-6 pb-12">
                <h3 className="text-xl font-bold">Location</h3>
                <div className="aspect-video w-full bg-secondary/50 rounded-2xl border flex flex-col items-center justify-center text-muted-foreground gap-3 overflow-hidden group">
                  <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-center">
                      <MapPin className="text-primary" />
                      <div className="font-bold text-foreground">{property.suburb ? `${property.suburb}, ` : ''}{property.city}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <aside className="relative">
              <div className="sticky top-28 bottom-12 space-y-6">
                <div className="p-8 bg-background border rounded-3xl shadow-[0_6px_20px_rgba(0,0,0,0.12)] space-y-8">
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">
                      {formatPrice(price, property.currency)}
                      {property.listing_type === 'rent' && <span className="text-base font-normal text-muted-foreground"> / month</span>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <MessageSquare size={18} />
                      Send Enquiry
                    </button>
                    <button className="w-full h-14 bg-secondary text-foreground rounded-xl font-bold hover:bg-secondary/70 transition-colors">
                      Request Private Tour
                    </button>
                  </div>

                  <p className="text-center text-xs text-muted-foreground font-medium">
                    Reference: {property.reference}
                  </p>

<div />                </div>

                <div className="p-6 border rounded-2xl flex items-center gap-4 bg-background">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-[13px] font-medium leading-tight">
                    <span className="font-bold">Peace of mind.</span> This listing is verified by BlueOak compliance.
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Featured Listings */}
          {featured && featured.length > 0 && (
            <section className="mt-24 border-t pt-24 space-y-10">
              <h2 className="text-2xl font-bold px-4">Discover featured listings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                {featured.slice(0, 4).map((p) => (
                  <PropertyCard key={p.id} property={p as any} />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-secondary/50 p-4 z-40 animate-in slide-in-from-bottom duration-500">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xl font-black">{formatPrice(price, property.currency)}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Property Inquiry</span>
            </div>
            <Button className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 bg-primary">
              <MessageSquare size={16} className="mr-2" />
              Enquire
            </Button>
          </div>
        </Container>
      </div>
    </div>
  )
}
