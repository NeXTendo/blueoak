import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, Bed, Bath, Maximize, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { useFormatPrice } from '@/hooks/useFormatPrice'

interface PropertyCardProps {
  property: any
  className?: string
}

const PropertyCard = memo(function PropertyCard({ property, className }: PropertyCardProps) {
  const navigate = useNavigate()
  const { format } = useFormatPrice()

  const title = property.title || 'Property Listing'
  const location = [property.suburb, property.city].filter(Boolean).join(', ') || property.location || 'Unknown'
  const beds = property.bedrooms || property.beds || 0
  const baths = property.bathrooms || property.baths || 0
  const sqm = property.floor_area || property.sqm || 0
  const imageUrl = property.cover_image_url || property.media?.[0]?.url || property.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'
  const isVerified = property.seller_verified || property.isVerified
  const isFeatured = property.is_featured || property.isFeatured
  const listingType = property.listing_type || property.listingType || 'sale'

  const listingLabel: Record<string, string> = {
    sale: 'For Sale',
    rent: 'To Let',
    short_term: 'Short Term',
    lease: 'Lease',
    auction: 'Auction',
  }

  return (
    <div
      onClick={() => navigate(ROUTES.PROPERTY_DETAIL.replace(':slug', property.slug))}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-none bg-card border border-border",
        "transition-all duration-300 ease-out",
        "md:hover:shadow-card-hover md:hover:-translate-y-1",
        className
      )}
    >
      {/* Cinematic Image with Overlay */}
      <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-secondary">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out md:group-hover:scale-105"
        />

        {/* Cinematic scrim — bottom up */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={cn(
            "je-badge text-white",
            listingType === 'sale' ? "bg-charcoal/80 backdrop-blur-sm" :
            listingType === 'auction' ? "bg-red-900/80 backdrop-blur-sm" :
            "bg-[hsl(var(--gold)/0.9)] backdrop-blur-sm"
          )}>
            {listingLabel[listingType] || listingType}
          </span>
          {isFeatured && (
            <span className="je-badge bg-[hsl(var(--gold))] text-white">
              Featured
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => { 
            e.stopPropagation();
            // Add full save logic here later
          }}
          title={property.is_saved ? "Remove from saved" : "Save"}
          aria-label={property.is_saved ? "Remove from saved" : "Save"}
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center",
            "bg-black/20 backdrop-blur-md border border-white/20",
            "transition-all duration-200 hover:bg-black/40",
            property.is_saved ? "text-[hsl(var(--gold))]" : "text-white"
          )}
        >
          <Heart size={14} className={cn(property.is_saved && "fill-[hsl(var(--gold))]")} />
        </button>

        {/* Price — on the image, bottom left */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-serif text-white/80 text-[10px] uppercase tracking-[0.12em] mb-1 drop-shadow-md">
                {listingType === 'rent' ? 'Per Month' : listingType === 'short_term' ? 'Per Night' : 'Asking Price'}
              </p>
              <p className="font-sans text-white text-lg md:text-xl font-semibold tracking-tight drop-shadow-lg">
                {format(property, listingType === 'short_term')}
              </p>
            </div>
            {isVerified && (
              <ShieldCheck className="text-[hsl(var(--gold))] h-5 w-5 shrink-0 mb-0.5 drop-shadow-md" />
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-start gap-1 mb-2">
          <MapPin className="h-3 w-3 text-[hsl(var(--gold))] mt-0.5 shrink-0" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.15em] leading-none">
            {location}
          </span>
        </div>
        <h3 className="font-serif text-foreground text-lg leading-[1.3] line-clamp-2 mb-4 group-hover:text-[hsl(var(--gold))] transition-colors duration-200">
          {title}
        </h3>

        {(beds > 0 || baths > 0 || sqm > 0) && (
          <div className="flex items-center gap-4 border-t border-border/50 pt-4">
            {beds > 0 && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Bed className="h-3.5 w-3.5 opacity-70" />
                <span className="text-xs font-medium">{beds}</span>
              </div>
            )}
            {baths > 0 && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Bath className="h-3.5 w-3.5 opacity-70" />
                <span className="text-xs font-medium">{baths}</span>
              </div>
            )}
            {sqm > 0 && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Maximize className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{sqm} m²</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

export default PropertyCard
