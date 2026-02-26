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
  Calendar,
  ShieldCheck,
  Star,
  ArrowRight
} from 'lucide-react'

import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
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
    "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070"
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* Cinematic Media Section */}
      <section className="relative px-4 pt-8">
        <Container>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[3rem] shadow-premium group">
            <Carousel className="w-full h-full">
              <CarouselContent className="h-full">
                {galleryImages.map((src, index) => (
                  <CarouselItem key={index} className="h-full">
                    <img 
                      src={src} 
                      alt={`View ${index}`} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <CarouselPrevious className="relative left-0 pointer-events-auto h-14 w-14 border-none bg-white/20 backdrop-blur-2xl text-white hover:bg-white hover:text-black transition-all shadow-2xl" />
                <CarouselNext className="relative right-0 pointer-events-auto h-14 w-14 border-none bg-white/20 backdrop-blur-2xl text-white hover:bg-white hover:text-black transition-all shadow-2xl" />
              </div>
            </Carousel>
            
            {/* Top Badge Overlay */}
            <div className="absolute top-8 left-8 flex gap-3 pointer-events-none">
              <div className="bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.4em] px-6 py-2.5 rounded-full shadow-2xl">
                Featured Asset
              </div>
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em] px-6 py-2.5 rounded-full shadow-2xl">
                Verified
              </div>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => navigate(-1)}
              title="Return to search results"
              aria-label="Back to results"
              className="absolute top-8 right-8 h-12 w-12 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          </div>
        </Container>
      </section>

      <main className="pt-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20 px-4">
            
            {/* Asset Intelligence */}
            <div className="space-y-20">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] w-8 bg-primary/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">
                      {property.location}
                    </span>
                  </div>
                  <h1 className="text-6xl font-black uppercase tracking-tighter text-primary leading-[0.9]">
                    {property.title}
                  </h1>
                </div>

                <div className="flex items-end justify-between border-t border-secondary pt-12">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Portfolio Valuation</span>
                    <div className="text-5xl font-black tracking-tighter text-primary">
                      {formatPrice(property.price, property.currency)}
                      {property.listingType === 'rent' && <span className="text-lg font-bold text-muted-foreground">/mo</span>}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      title="Share this strategic asset"
                      aria-label="Share listing"
                      className="h-14 w-14 rounded-full border-2 border-secondary flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all"
                    >
                      <Share2 size={20} strokeWidth={2} />
                    </button>
                    <button 
                      onClick={() => setIsSaved(!isSaved)}
                      title={isSaved ? "Remove from collection" : "Add to collection"}
                      aria-label={isSaved ? "Unsave asset" : "Save asset"}
                      className={cn(
                        "h-14 w-14 rounded-full border-2 flex items-center justify-center transition-all",
                        isSaved ? "bg-primary border-primary text-white" : "border-secondary text-muted-foreground hover:border-black"
                      )}
                    >
                      <Heart size={20} strokeWidth={2} className={cn(isSaved && "fill-white")} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-4 gap-4 p-8 bg-secondary/20 rounded-[2.5rem] border border-secondary">
                {[
                  { icon: Bed, value: property.beds, label: 'Suites' },
                  { icon: Bath, value: property.baths, label: 'Bathrooms' },
                  { icon: Maximize, value: property.sqm, label: 'Living Sqm' },
                  { icon: Star, value: 'Premium', label: 'Listing' },
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 space-y-2 text-center">
                    <spec.icon size={20} strokeWidth={2.5} className="text-muted-foreground/40" />
                    <div className="text-xl font-black tracking-tight">{spec.value}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">{spec.label}</div>
                  </div>
                ))}
              </div>

              {/* Narrative Content */}
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black uppercase tracking-tight">The Narrative</h3>
                  <div className="prose prose-stark max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                      This exceptional {property.type.replace('_', ' ')} represents a convergence of architectural vision and uncompromising luxury. 
                      Located in the most sought-after quarter of {property.location.split(',')[0]}, the residence offers an unparalleled living experience 
                      defined by vast open spaces and meticulous attention to detail.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed font-medium pt-4">
                      Every element has been curated to serve both function and aesthetic excellence. From the cinematic views that frame the horizon 
                      to the bespoke interior appointments, this asset is designed for those who demand excellence in every facet of their environment.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight">Key Inclusions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {['Automated Smart Systems', 'Private Wellness Wing', 'Professional Kitchen', 'Bespoke Lighting Design', 'High-Security Perimeter', 'Electric Charging Points'].map((f) => (
                      <div key={f} className="flex items-center gap-4 group">
                        <div className="h-6 w-6 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <CheckCircle2 size={12} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Concierge Sidebar */}
            <aside>
              <div className="sticky top-12 space-y-10">
                <div className="p-10 bg-background border-2 border-secondary rounded-[3rem] shadow-premium space-y-12 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-bl-[5rem] -translate-y-4 translate-x-4" />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-20 w-20 ring-4 ring-secondary/50">
                        <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974" />
                        <AvatarFallback>BO</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Portfolio Advisor</div>
                        <h4 className="text-xl font-black uppercase tracking-tight">Johnathan Oak</h4>
                        <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">
                          <ShieldCheck size={10} className="text-primary" />
                          Certified Exclusive Agent
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <button className="flex w-full items-center justify-center h-16 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-premium transition-all active:scale-98">
                      Secure Enquiry
                    </button>
                    <button className="flex w-full items-center justify-center h-16 bg-secondary/50 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary transition-all">
                      Request Private Tour
                    </button>
                  </div>

                  <div className="space-y-4 pt-4 relative z-10 border-t border-secondary">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <Calendar size={14} />
                      Next available: Tomorrow, 10:00 AM
                    </div>
                  </div>
                </div>

                <div className="py-8 px-10 bg-primary rounded-[3rem] space-y-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-foreground/40 italic">Global Program</div>
                  <h4 className="text-2xl font-black uppercase tracking-tight text-white leading-tight">Investment <br />Intelligence.</h4>
                  <p className="text-xs font-medium text-white/50 leading-relaxed">
                    Access exclusive market data and ROI projections for this asset subclass.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* Similar Portfolios */}
          <section className="mt-32 space-y-12">
            <div className="flex items-end justify-between px-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Curated</span>
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter text-primary">
                  Similar Assets
                </h2>
              </div>
              <button className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-colors">
                View Full Category
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
              {MOCK_PROPERTIES.slice(0, 4).map((p) => (
                <PropertyCard key={p.id} property={p as any} />
              ))}
            </div>
          </section>
        </Container>
      </main>
    </div>
  )
}
