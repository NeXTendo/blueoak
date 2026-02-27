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
  Star,
  MapPin,
  MessageSquare,
  Info
} from 'lucide-react'

import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
} from '@/components/ui/carousel'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'

export default function PropertyDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)

  const property = useMemo(() => {
    return MOCK_PROPERTIES.find(p => p.id === slug) || MOCK_PROPERTIES[0]
  }, [slug])

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const galleryImages = [
    property.image,
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    "https://images.unsplash.com/photo-1600607687940-4e525cb35797?q=80&w=2070",
    "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974"
  ]

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
              <span className="flex items-center gap-1 underline decoration-2 cursor-pointer">{property.location}</span>
              <span className="flex items-center gap-1">•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-primary" />
                Verified
              </span>
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
            <div className="relative overflow-hidden">
              <img src={galleryImages[1]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer" alt="Interior 1" />
            </div>
            <div className="relative overflow-hidden group-hover:block">
              <img src={galleryImages[2]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer" alt="Interior 2" />
            </div>
            <div className="relative overflow-hidden">
              <img src={galleryImages[3]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer" alt="View" />
            </div>
            <div className="relative overflow-hidden">
              <img src={galleryImages[4]} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer" alt="Interior 3" />
            </div>
            <button className="absolute bottom-6 right-6 px-4 py-2 bg-white text-black border border-black text-sm font-semibold rounded-lg shadow-md hover:bg-neutral-100 transition-colors">
              Show all photos
            </button>
          </div>

          {/* Mobile Carousel Layout */}
          <div className="md:hidden relative aspect-[4/3] w-full overflow-hidden rounded-xl">
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {galleryImages.map((src, index) => (
                  <CarouselItem key={index} className="h-full">
                    <img src={src} className="w-full h-full object-cover" alt={`View ${index}`} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                1 / {galleryImages.length}
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
                  <h2 className="text-2xl font-bold">Hosted by Johnathan Oak</h2>
                  <p className="text-muted-foreground font-medium">8 years of excellence • Professional Advisor</p>
                </div>
                <Avatar className="h-14 w-14">
                  <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974" />
                  <AvatarFallback>JO</AvatarFallback>
                </Avatar>
              </div>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-4 py-2">
                {[
                  { icon: Bed, value: property.beds, label: 'bedrooms' },
                  { icon: Bath, value: property.baths, label: 'bathrooms' },
                  { icon: Maximize, value: property.sqm, label: 'sqm area' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <stat.icon size={22} className="text-foreground" strokeWidth={1.5} />
                    <div className="font-semibold text-lg">{stat.value}</div>
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
                    <p className="text-muted-foreground leading-relaxed font-medium mt-2">
                      This exceptional {property.type.replace('_', ' ')} represents a convergence of architectural vision and uncompromising luxury. 
                      Located in the most sought-after quarter of {property.location.split(',')[0]}, the residence offers an unparalleled living experience 
                      defined by vast open spaces and meticulous attention to detail.
                    </p>
                    <button 
                      aria-label="Show more description"
                      className="mt-4 font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      Show more
                      <ChevronLeft className="rotate-180" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-secondary w-full" />

              {/* Inclusions */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold">What this place offers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Automated Smart Systems', icon: CheckCircle2 },
                    { label: 'Private Wellness Wing', icon: CheckCircle2 },
                    { label: 'Professional Kitchen', icon: CheckCircle2 },
                    { label: 'Bespoke Lighting Design', icon: CheckCircle2 },
                    { label: 'High-Security Perimeter', icon: CheckCircle2 },
                    { label: 'Electric Charging Points', icon: CheckCircle2 }
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-muted-foreground">
                      <feat.icon size={20} className="text-primary/60" />
                      <span className="font-medium">{feat.label}</span>
                    </div>
                  ))}
                </div>
                <button className="px-6 py-3 border border-black rounded-xl font-bold hover:bg-secondary transition-colors">
                  Show all amenities
                </button>
              </div>

              <div className="h-[1px] bg-secondary w-full" />

              {/* Location Mock */}
              <div className="space-y-6 pb-12">
                <h3 className="text-xl font-bold">Location</h3>
                <div className="aspect-video w-full bg-secondary/50 rounded-2xl border flex flex-col items-center justify-center text-muted-foreground gap-3 overflow-hidden group">
                  <div className="h-full w-full bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3 border">
                      <MapPin className="text-primary" />
                      <div className="font-bold text-foreground">{property.location}</div>
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
                      {formatPrice(property.price, property.currency)}
                      {property.listingType === 'rent' && <span className="text-base font-normal text-muted-foreground"> / month</span>}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <Star size={14} className="fill-foreground" />
                      4.92 • <span className="underline text-muted-foreground">12 reviews</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 border rounded-xl overflow-hidden">
                    <button className="flex flex-col items-start p-3 border-b hover:bg-neutral-50 text-left transition-colors">
                      <span className="text-[10px] font-bold uppercase">Date Range</span>
                      <span className="text-sm font-medium">Select dates</span>
                    </button>
                    <button className="flex flex-col items-start p-3 hover:bg-neutral-50 text-left transition-colors">
                      <span className="text-[10px] font-bold uppercase">Enquiries</span>
                      <span className="text-sm font-medium">1 Buyer</span>
                    </button>
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
                    You won't be charged yet
                  </p>

                  <div className="space-y-3 pt-4 font-medium text-sm">
                    <div className="flex justify-between">
                      <span className="underline">Professional fee</span>
                      <span>{formatPrice(property.price * 0.015, property.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="underline">Documentation</span>
                      <span>{formatPrice(property.price * 0.005, property.currency)}</span>
                    </div>
                    <div className="h-[1px] bg-secondary pt-2" />
                    <div className="flex justify-between font-bold text-base pt-2">
                      <span>Total</span>
                      <span>{formatPrice(property.price * 1.02, property.currency)}</span>
                    </div>
                  </div>
                </div>

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

          {/* Similar Listings */}
          <section className="mt-24 border-t pt-24 space-y-10">
            <h2 className="text-2xl font-bold px-4">Discover similar listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
              {MOCK_PROPERTIES.slice(0, 4).map((p) => (
                <PropertyCard key={p.id} property={p as any} />
              ))}
            </div>
            <div className="flex justify-center pt-8">
              <button className="px-8 py-3 bg-secondary/50 hover:bg-secondary rounded-xl font-bold transition-colors">
                Show more in {property.location.split(',')[0]}
              </button>
            </div>
          </section>
        </Container>
      </main>
    </div>
  )
}
