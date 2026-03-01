import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { 
  LayoutGrid, 
  Map as MapIcon, 
  SlidersHorizontal,
  Search as SearchIcon,
  Loader2,
  Star
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { PROPERTY_TYPES, LISTING_TYPES } from '@/lib/constants'
import { useProperties } from '@/hooks/useProperties'
import { usePropertyStore } from '@/stores/propertyStore'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import InteractiveMap from '@/components/common/InteractiveMap'
import EmptyState from '@/components/common/EmptyState'
import { useFormatPrice } from '@/hooks/useFormatPrice'

export default function SearchPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { formatBig } = useFormatPrice()
  const { 
    filters, setFilters, 
    searchQuery, setSearchQuery, 
    sortBy, setSortBy,
    viewMode, setViewMode,
    resetFilters
  } = usePropertyStore()

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading
  } = useProperties()

  // ── Apply URL search params on mount ────────────────────────────────────
  useEffect(() => {
    const city = searchParams.get('city')
    const country = searchParams.get('country')
    const propertyType = searchParams.get('property_type')
    const listingType = searchParams.get('listing_type')
    const sort = searchParams.get('sort')
    const query = searchParams.get('q')
    const isFeatured = searchParams.get('is_featured') === 'true'

    if (query) setSearchQuery(query)
    if (sort === 'newest') setSortBy('newest')

    const incoming: Record<string, any> = {}
    if (city) incoming.city = city
    if (country) incoming.country = country
    if (propertyType) incoming.property_type = propertyType
    if (listingType) incoming.listing_type = listingType
    if (isFeatured) incoming.is_featured = true

    if (Object.keys(incoming).length > 0) {
      setFilters(incoming)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Flatten the pages of properties
  const properties = data?.pages.flat() || []
  const totalCount = (properties[0] as any)?.total_count || 0

  // Separate featured vs regular
  const featuredProps = properties.filter((p: any) => p.is_featured || p.status === 'featured').slice(0, 10)
  const regularProps = properties.filter((p: any) => !featuredProps.includes(p))

  // Active filter contextual label
  const activeListingLabel = (() => {
    const lt = filters.listing_type
    if (lt === 'sale') return 'For Sale'
    if (lt === 'rent') return 'For Rent'
    return null
  })()

  // Set initial filters from URL params

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Search & Filter Header — sticky, sits below the fixed top nav */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50 pt-[calc(env(safe-area-inset-top,0px)+1rem)] py-5">
        <Container className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[hsl(var(--gold))] transition-colors" size={18} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(e.currentTarget.value)}
                placeholder={t('search.placeholder', 'Search cities, suburbs or property types...')}
                className="pl-12 h-12 bg-transparent border-border/50 rounded-sm focus-visible:border-[hsl(var(--gold))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--gold))] transition-all font-medium text-[15px] shadow-sm"
              />
            </div>
            
            <div className="flex items-center bg-secondary/10 border border-border/50 rounded-sm p-1 shrink-0">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className={cn("h-10 w-10 rounded-sm transition-all text-muted-foreground hover:text-foreground", viewMode === 'grid' && "bg-background shadow-sm text-foreground")}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={18} />
              </Button>
              <Button 
                variant={viewMode === 'map' ? 'secondary' : 'ghost'} 
                size="icon" 
                className={cn("h-10 w-10 rounded-sm transition-all text-muted-foreground hover:text-foreground", viewMode === 'map' && "bg-background shadow-sm text-foreground")}
                onClick={() => setViewMode('map')}
              >
                <MapIcon size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <Select 
              value={filters.listing_type || 'all'} 
              onValueChange={(val) => setFilters({ listing_type: val === 'all' ? undefined : val as any })}
            >
              <SelectTrigger className="w-fit h-10 gap-2 rounded-sm border-border/50 bg-transparent px-4 font-medium text-[13px] hover:border-[hsl(var(--gold))] transition-colors">
                <SelectValue placeholder="Listing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listings</SelectItem>
                {LISTING_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.property_type || 'all'} 
              onValueChange={(val) => setFilters({ property_type: val === 'all' ? undefined : val })}
            >
              <SelectTrigger className="w-fit h-10 gap-2 rounded-sm border-border/50 bg-transparent px-4 font-medium text-[13px] hover:border-[hsl(var(--gold))] transition-colors">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {PROPERTY_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 px-4 rounded-sm border-border/50 bg-transparent font-medium text-[13px] gap-2 hover:text-[hsl(var(--gold))] hover:border-[hsl(var(--gold))] transition-all">
                  <SlidersHorizontal size={14} />
                  Filters
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-border/50">
                  <SheetTitle className="font-serif text-3xl font-light">Refine Search</SheetTitle>
                  <SheetDescription>Adjust filters to find exactly what you're looking for.</SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="flex-1 px-6">
                  <div className="py-6 space-y-8">
                    {/* Price Range */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold">Price Range</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="min-price" className="text-xs font-bold text-muted-foreground uppercase">Min Price</Label>
                          <Input 
                            id="min-price" 
                            type="number"
                            placeholder="0" 
                            value={filters.min_price || ''}
                            onChange={(e) => setFilters({ min_price: e.target.value ? parseInt(e.target.value) : undefined })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max-price" className="text-xs font-bold text-muted-foreground uppercase">Max Price</Label>
                          <Input 
                            id="max-price" 
                            type="number"
                            placeholder="Any" 
                            value={filters.max_price || ''}
                            onChange={(e) => setFilters({ max_price: e.target.value ? parseInt(e.target.value) : undefined })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Beds */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold">Minimum Bedrooms</Label>
                      <div className="flex flex-wrap gap-2">
                        {[0, 1, 2, 3, 4, 5].map((n) => (
                          <Button 
                            key={n} 
                            variant={filters.min_beds === n ? 'default' : 'outline'} 
                            className="h-10 px-4 rounded-xl border-2 font-bold transition-all"
                            onClick={() => setFilters({ min_beds: n || undefined })}
                          >
                            {n === 0 ? 'Any' : `${n}+`}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Technical Specs */}
                    <div className="space-y-6">
                      <Label className="text-base font-bold">Technical Specifications</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 group cursor-pointer">
                          <Checkbox 
                            id="borehole-filter" 
                            checked={filters.has_borehole}
                            onCheckedChange={(checked) => setFilters({ has_borehole: !!checked })}
                            className="h-5 w-5 rounded-md border-2" 
                          />
                          <label htmlFor="borehole-filter" className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors">
                            Borehole
                          </label>
                        </div>
                        <div className="flex items-center space-x-3 group cursor-pointer">
                          <Checkbox 
                            id="staff-filter" 
                            checked={filters.has_staff_quarters}
                            onCheckedChange={(checked) => setFilters({ has_staff_quarters: !!checked })}
                            className="h-5 w-5 rounded-md border-2" 
                          />
                          <label htmlFor="staff-filter" className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors">
                            Staff Quarters
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min Solar Capacity (kW)</Label>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={filters.min_solar_capacity || ''}
                            onChange={(e) => setFilters({ min_solar_capacity: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="h-10 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min Generator (kVA)</Label>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={filters.min_generator_capacity || ''}
                            onChange={(e) => setFilters({ min_generator_capacity: e.target.value ? parseFloat(e.target.value) : undefined })}
                            className="h-10 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <SheetFooter className="p-6 border-t border-border/50 bg-secondary/20">
                  <div className="flex items-center justify-between w-full gap-4">
                    <Button 
                      variant="ghost" 
                      className="font-bold underline text-muted-foreground"
                      onClick={() => resetFilters()}
                    >
                      Reset All
                    </Button>
                    <SheetClose asChild>
                      <Button className="flex-1 h-12 rounded-xl font-bold text-lg shadow-lg">
                        Apply Filters
                      </Button>
                    </SheetClose>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
              <SelectTrigger className="w-fit h-10 gap-2 rounded-sm border-border/50 bg-transparent px-4 font-medium text-[13px] hover:border-[hsl(var(--gold))] transition-colors">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="most_popular">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Container>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-[hsl(var(--gold))]" />
            <p className="font-medium animate-pulse font-serif text-lg">Finding your perfect property...</p>
          </div>
        ) : viewMode === 'grid' ? (
          <ScrollArea className="h-full" onScroll={(e) => {
            const element = e.currentTarget
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage()
            }
          }}>
            <Container className="py-4 md:pt-10 md:pb-12 space-y-8 md:space-y-12">
              {/* Results summary — compact */}
              <div className="flex items-center justify-between -mb-4">
                <p className="text-sm text-muted-foreground">
                  {totalCount > 0 ? (
                    <><span className="text-foreground font-semibold">{totalCount.toLocaleString()}</span> results found</>
                  ) : isLoading ? 'Searching...' : 'No results'}
                  {(filters as any).city && (
                    <span className="ml-1">in <span className="text-[hsl(var(--gold))] font-medium">{(filters as any).city}</span></span>
                  )}
                </p>
              </div>

              {properties.length > 0 ? (
                <>
                  {/* Featured/Promoted Listings */}
                  {featuredProps.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <span className="w-4 h-px bg-[hsl(var(--gold))]" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">Premium Collection</span>
                            <Star size={10} className="text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" />
                          </div>
                          <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">Featured Properties</h3>
                        </div>
                      </div>
                      <Carousel 
                         opts={{ align: "start", dragFree: true }} 
                         className="w-full relative group/carousel"
                      >
                         <CarouselContent className="-ml-4">
                           {featuredProps.map((property: any) => (
                             <CarouselItem key={property.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                               <FeaturedPropertyCard property={property} />
                             </CarouselItem>
                           ))}
                         </CarouselContent>
                         <div className="hidden md:block opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 border-white/20 bg-black/40 text-white hover:bg-black/80 hover:text-[hsl(var(--gold))] shadow-lg backdrop-blur-md" />
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 border-white/20 bg-black/40 text-white hover:bg-black/80 hover:text-[hsl(var(--gold))] shadow-lg backdrop-blur-md" />
                         </div>
                      </Carousel>
                      <div className="py-2 md:py-4">
                        <Separator className="opacity-40" />
                      </div>
                    </div>
                  )}

                  {/* Regular Listings Grid */}
                  <div className="space-y-6">
                    {featuredProps.length > 0 && (
                      <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">
                        {activeListingLabel ? `All ${activeListingLabel}` : 'All Properties'}
                      </h3>
                    )}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-10">
                      {(featuredProps.length > 0 ? regularProps : properties).map((property: any) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <EmptyState 
                  title="No results found"
                  description="We couldn't find any properties matching your current filters. Try adjusting your search."
                  action={{
                    label: "Clear all filters",
                    onClick: () => { setSearchQuery(''); resetFilters(); }
                  }}
                />
              )}

              {/* Pagination / Load More */}
              {hasNextPage && (
                <div className="flex justify-center pt-8 pb-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="group border-[hsl(var(--gold))] text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))] hover:text-black w-full max-w-sm rounded-[1.5rem] h-12 font-semibold tracking-wide transition-all"
                  >
                    {isFetchingNextPage ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading more...
                      </span>
                    ) : (
                      'Load More Results'
                    )}
                  </Button>
                </div>
              )}

              {/* End of results indicator */}
              {!hasNextPage && properties.length > 0 && (
                <div className="flex justify-center py-8">
                  <p className="text-muted-foreground text-sm font-medium">You've reached the end of the results.</p>
                </div>
              )}
              
              {/* --- Engaging Footer Sections (hidden when search/filters active) --- */}
              {!searchQuery && !filters.listing_type && !filters.property_type && !(filters as any).city && (
              <div className="pt-16 md:pt-24 space-y-16 md:space-y-24">
                
                {/* 1. Top Locations / Popular Destinations */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl font-medium tracking-tight">Popular Destinations</h3>
                      <p className="text-muted-foreground mt-2 text-sm md:text-base">Explore premium real estate in top locations.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Lusaka', count: '142 Properties', img: 'https://images.unsplash.com/photo-1577983084364-bb14b087a329?q=80&w=600&auto=format&fit=crop' },
                      { name: 'Kitwe', count: '56 Properties', img: 'https://images.unsplash.com/photo-1623861537217-19ad06c8b053?q=80&w=600&auto=format&fit=crop' },
                      { name: 'Ndola', count: '48 Properties', img: 'https://images.unsplash.com/photo-1549463959-1e35a11dfb47?q=80&w=600&auto=format&fit=crop' },
                      { name: 'Livingstone', count: '24 Properties', img: 'https://images.unsplash.com/photo-1520626337972-0050eecc2bd2?q=80&w=600&auto=format&fit=crop' },
                    ].map((loc, idx) => (
                      <button 
                         key={idx}
                         onClick={() => { setSearchQuery(''); setFilters({ city: loc.name }); }}
                         className="group relative h-48 md:h-64 rounded-xl overflow-hidden text-left focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gold))] ring-offset-2"
                      >
                        <img 
                          src={loc.img} 
                          alt={loc.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                           <h4 className="text-white font-serif text-lg sm:text-xl font-medium drop-shadow-md">{loc.name}</h4>
                           <p className="text-white/70 text-xs sm:text-sm font-semibold tracking-wide drop-shadow-md mt-0.5">{loc.count}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* 2. Property Alerts CTA */}
                <section className="relative rounded-2xl overflow-hidden bg-secondary border border-border/50 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                  <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,hsl(var(--gold))_1px,transparent_1px)] bg-[length:24px_24px]" />
                  <div className="relative z-10 max-w-xl">
                    <h3 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-4 group-hover:text-[hsl(var(--gold))] transition-colors">
                      Don't miss out on your dream property.
                    </h3>
                    <p className="text-muted-foreground text-lg mb-0">
                      Set up instant alerts and be the first to know when new properties matching your exact criteria hit the market.
                    </p>
                  </div>
                  <div className="relative z-10 w-full md:w-auto shrink-0 flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="h-14 px-8 rounded-full text-base shadow-gold-glow">
                      Create Alert
                    </Button>
                  </div>
                </section>

              </div>
              )}

              <div className="h-20" />
            </Container>
          </ScrollArea>
        ) : (
          <InteractiveMap 
            markers={properties.slice(0, 50).map((p: any) => ({
              id: p.id,
              label: p.title,
              position: [p.latitude || 0, p.longitude || 0],
              price: formatBig(p.price_zmw || p.asking_price || 0)
            }))}
          />
        )}
      </main>
    </div>
  )
}

/** Large featured card — mirrors James Edition's big editorial cards */
function FeaturedPropertyCard({ property }: { property: any }) {
  const { formatBig } = useFormatPrice()
  const img = property.cover_image_url 
    || property.images?.[0] 
    || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2000'

  return (
    <Link to={ROUTES.PROPERTY_DETAIL.replace(':slug', property.slug)} className="group block">
      <div className="relative h-[380px] md:h-[440px] rounded-md overflow-hidden bg-charcoal">
        {/* Image */}
        <img
          src={img}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-contain sm:object-cover bg-black/5 transition-transform duration-700 md:group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[hsl(var(--gold))] text-black px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider shadow-gold-glow">
          <Star size={9} className="fill-black" />
          Featured
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 space-y-2">
          <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md">
            {property.property_type}{property.city ? ` · ${property.city}` : ''}
          </p>
          <h3 className="font-serif text-white text-2xl sm:text-3xl font-medium leading-[1.15] drop-shadow-md line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center justify-between pt-2">
            <span className="text-white text-xl sm:text-2xl font-black tracking-tighter uppercase drop-shadow-lg">
              {formatBig(property.price_zmw || property.asking_price || 0)}
            </span>
            {property.bedrooms != null && (
              <span className="text-white/70 text-sm font-semibold tracking-wide drop-shadow-md">
                {property.bedrooms} Bed{property.bathrooms != null ? ` · ${property.bathrooms} Bath` : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
