import { memo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MapPin, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { useFormatPrice } from '@/hooks/useFormatPrice'
import { useSavedProperties } from '@/hooks/useSavedProperties'

interface PropertyCardProps {
  property: any
  className?: string
}

const PropertyCard = memo(function PropertyCard({ property, className }: PropertyCardProps) {
  const navigate = useNavigate()
  const { format } = useFormatPrice()
  const { isSaved, toggleSave } = useSavedProperties()

  const title = property.title || 'Property Listing'
  const location = [property.suburb, property.city].filter(Boolean).join(', ') || property.location || 'Unknown'
  const beds = property.bedrooms || property.beds || 0
  const baths = property.bathrooms || property.baths || 0
  const sqm = property.floor_area || property.sqm || 0
  const isVerified = property.seller_verified || property.isVerified
  const isFeatured = property.is_featured || property.isFeatured
  const listingType = property.listing_type || property.listingType || 'sale'

  // Image handling
  let images = property.media?.map((m: any) => m.url) || [];
  if (images.length === 0 && property.images?.length > 0) images = property.images;
  if (images.length === 0 && property.cover_image_url) images = [property.cover_image_url];
  if (images.length === 0 && property.image) images = [property.image];
  if (images.length === 0) images = ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'];
  const displayImages = images.slice(0, 5);

  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      if (width > 0) setActiveIndex(Math.round(scrollLeft / width));
    }
  }

  const scrollAction = (direction: 'left' | 'right', e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }

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
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden bg-black group/gallery">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {displayImages.map((img: string, idx: number) => (
            <div key={idx} className="relative w-full h-full shrink-0 snap-center">
               <img
                 src={img}
                 alt={`${title} - image ${idx + 1}`}
                 loading="lazy"
                 className="w-full h-full object-cover object-center sm:object-cover transition-transform duration-700 ease-out md:group-hover/gallery:scale-105"
               />
               {/* Cinematic scrim — bottom up. Attach to each image so it translates with them or keep static below. */}
            </div>
          ))}
        </div>

        {/* Global Cinematic scrim */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

        {/* Gallery Navigation Desktop & Touch Zones */}
        {displayImages.length > 1 && (
          <>

            <button
               aria-label="Previous image"
               onClick={(e) => scrollAction('left', e)}
               className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 transition-opacity duration-200 z-30 hover:bg-black/80",
                  "md:group-hover/gallery:opacity-100 hidden md:flex",
                  activeIndex === 0 && "invisible" // Hide left arrow if at start
               )}
            >
               <ChevronLeft size={16} />
            </button>
            <button
               aria-label="Next image"
               onClick={(e) => scrollAction('right', e)}
               className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 transition-opacity duration-200 z-30 hover:bg-black/80",
                  "md:group-hover/gallery:opacity-100 hidden md:flex",
                  activeIndex === displayImages.length - 1 && "invisible" // Hide right arrow if at end
               )}
            >
               <ChevronRight size={16} />
            </button>
            
            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
               {displayImages.map((_: any, idx: number) => (
                  <div 
                     key={idx} 
                     className={cn(
                        "h-1.5 rounded-full transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.5)]",
                        idx === activeIndex 
                           ? "w-4 bg-white" 
                           : "w-1.5 bg-white/60"
                     )} 
                  />
               ))}
            </div>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
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
            toggleSave(property.id)
          }}
          title={isSaved(property.id) ? "Remove from saved" : "Save"}
          aria-label={isSaved(property.id) ? "Remove from saved" : "Save"}
          className={cn(
            "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center z-20",
            "bg-black/20 backdrop-blur-md border border-white/20",
            "transition-all duration-200 hover:bg-black/40",
            isSaved(property.id) ? "text-[hsl(var(--gold))]" : "text-white"
          )}
        >
          <Heart size={14} className={cn(isSaved(property.id) && "fill-[hsl(var(--gold))]")} />
        </button>

        {/* Price — on the image, bottom left */}
        <div className="absolute bottom-0 left-0 p-3 sm:p-4 pointer-events-none z-20">
          <div className="flex flex-col">
            <p className="font-black text-white/70 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mb-0.5 sm:mb-1 drop-shadow-md">
              {listingType === 'rent' ? 'Per Month' : listingType === 'short_term' ? 'Per Night' : 'Asking Price'}
            </p>
            <div className="flex items-center gap-1.5 sm:gap-2">
               <p className="font-black text-white text-lg sm:text-xl md:text-2xl tracking-tighter uppercase drop-shadow-lg leading-none">
                 {format(property, listingType === 'short_term')}
               </p>
               {isVerified && (
                 <ShieldCheck className="text-[hsl(var(--gold))] h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 drop-shadow-md" />
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[hsl(var(--gold))] shrink-0" />
          <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none line-clamp-1">
            {location}
          </span>
        </div>
        <h3 className="font-serif font-medium text-black text-base sm:text-lg md:text-[22px] leading-snug tracking-tight line-clamp-2 mb-2 sm:mb-3 group-hover:text-[hsl(var(--gold))] transition-colors duration-300">
          {title}
        </h3>

        <div className="mt-auto">
           {(beds > 0 || baths > 0 || sqm > 0) && (
             <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 border-t border-border/40 pt-3 sm:pt-4 mt-1 sm:mt-2">
               {beds > 0 && (
                 <div className="flex flex-col gap-0.5">
                   <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Beds</span>
                   <span className="text-xs sm:text-sm font-black text-black">{beds}</span>
                 </div>
               )}
               {baths > 0 && (
                 <div className="flex flex-col gap-0.5">
                   <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Baths</span>
                   <span className="text-xs sm:text-sm font-black text-black">{baths}</span>
                 </div>
               )}
               {sqm > 0 && (
                 <div className="flex flex-col gap-0.5">
                   <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Area</span>
                   <span className="text-xs sm:text-sm font-black text-black">{sqm} m²</span>
                 </div>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  )
})

export default PropertyCard
