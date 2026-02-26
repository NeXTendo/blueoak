import { Heart, Bed, Bath, Maximize, MapPin, CheckCircle2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    currency: string
    location: string
    beds: number
    baths: number
    sqm: number
    image: string
    type: string
    listingType: 'sale' | 'rent' | 'short_term' | 'auction'
    isVerified?: boolean
    isFeatured?: boolean
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="group relative flex flex-col bg-background overflow-hidden transition-all duration-500 hover:-translate-y-1">
      {/* Media Section */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-card group-hover:shadow-premium transition-all duration-500">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Quality Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {property.isFeatured && (
            <div className="bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full shadow-lg">
              Featured
            </div>
          )}
          <div className={cn(
            "text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md",
            property.listingType === 'sale' ? "bg-white text-black" : "bg-black/80 text-white"
          )}>
            {property.listingType === 'sale' ? 'Portfolio' : property.listingType}
          </div>
        </div>

        <button 
          title="Save to favorites"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <Heart size={16} strokeWidth={2.5} />
        </button>

        {/* Overlay info - subtle price overlay */}
        <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 text-white flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <span className="text-lg font-black tracking-tighter">
            {formatPrice(property.price, property.currency)}
          </span>
          <ArrowRight size={18} />
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-6 pb-2 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 pr-4">
            <h3 className="text-xl font-black uppercase tracking-tight leading-[1.1] text-primary">
              {property.title}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground/60 text-[10px] font-black uppercase tracking-widest">
              <MapPin size={10} strokeWidth={3} />
              <span>{property.location}</span>
            </div>
          </div>
          {property.isVerified && (
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/5 text-primary">
              <CheckCircle2 size={12} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Price & Features */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-black tracking-tighter text-primary">
            {formatPrice(property.price, property.currency)}
            {property.listingType === 'rent' && <span className="text-xs font-bold text-muted-foreground lowercase"> /mo</span>}
          </span>
          
          <div className="flex items-center gap-4 text-muted-foreground/40 font-black text-[10px]">
             <div className="flex items-center gap-1">
               <Bed size={12} strokeWidth={2.5} />
               <span>{property.beds}</span>
             </div>
             <div className="flex items-center gap-1">
               <Bath size={12} strokeWidth={2.5} />
               <span>{property.baths}</span>
             </div>
             <div className="flex items-center gap-1">
               <Maximize size={12} strokeWidth={2.5} />
               <span>{property.sqm}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
