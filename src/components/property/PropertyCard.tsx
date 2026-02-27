import { Heart, Bed, Bath, Maximize, MapPin, CheckCircle2 } from 'lucide-react'
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
    <div className="group flex flex-col bg-background transition-all duration-300 min-w-0">
      {/* Media Section */}
      <div className="relative aspect-[4/4] overflow-hidden rounded-xl bg-secondary/10">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {property.isFeatured && (
            <div className="bg-white/95 backdrop-blur-md text-black text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
              Featured
            </div>
          )}
          <div className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm backdrop-blur-md",
            property.listingType === 'sale' ? "bg-primary text-primary-foreground" : "bg-white/90 text-black"
          )}>
            {property.listingType === 'sale' ? 'Sale' : (property.listingType.charAt(0).toUpperCase() + property.listingType.slice(1))}
          </div>
        </div>

        <button 
          title="Save to favorites"
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <Heart size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* Content Section */}
      <div className="py-2 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-1">
          <h3 className="text-[12px] font-medium text-foreground line-clamp-1">
            {property.title}
          </h3>
          {property.isVerified && (
            <CheckCircle2 size={11} className="text-primary shrink-0 mt-0.5" strokeWidth={3} />
          )}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground/60 text-[10px] font-medium leading-none">
          <MapPin size={9} strokeWidth={2} className="shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground/40 text-[9px] font-bold mt-0.5">
           <div className="flex items-center gap-1">
             <Bed size={10} strokeWidth={2.5} />
             <span>{property.beds}</span>
           </div>
           <div className="flex items-center gap-1">
             <Bath size={10} strokeWidth={2.5} />
             <span>{property.baths}</span>
           </div>
           <div className="flex items-center gap-1">
             <Maximize size={10} strokeWidth={2.5} />
             <span>{property.sqm}m²</span>
           </div>
        </div>

        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-[13px] font-semibold text-foreground">
            {formatPrice(property.price, property.currency)}
          </span>
          {property.listingType === 'rent' && <span className="text-[9px] font-medium text-muted-foreground">/mo</span>}
        </div>
      </div>
    </div>
  )
}
