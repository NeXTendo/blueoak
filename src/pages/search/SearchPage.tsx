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
import { PROPERTY_TYPES, LISTING_TYPES } from '@/lib/constants'
import { useProperties } from '@/hooks/useProperties'
import { usePropertyStore } from '@/stores/propertyStore'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import InteractiveMap from '@/components/common/InteractiveMap'
import EmptyState from '@/components/common/EmptyState'

export default function SearchPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
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
    const propertyType = searchParams.get('property_type')
    const listingType = searchParams.get('listing_type')
    const sort = searchParams.get('sort')
    const query = searchParams.get('q')
    const isFeatured = searchParams.get('is_featured') === 'true'

    if (query) setSearchQuery(query)
    if (sort === 'newest') setSortBy('newest')

    const incoming: Record<string, any> = {}
    if (city) incoming.city = city
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
  const featuredProps = properties.filter((p: any) => p.is_featured || p.status === 'featured').slice(0, 2)
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
    <div className="flex flex-col min-h-screen bg-background pt-[calc(48px+env(safe-area-inset-top,0px))] md:pt-[72px]">
      {/* Search & Filter Header — sticky, sits below the fixed top nav */}
      <header className="sticky top-[calc(48px+env(safe-area-inset-top,0px))] md:top-[72px] z-30 bg-background/98 backdrop-blur-xl border-b border-border/40 py-2.5 md:py-4">
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
            <Container className="py-6 md:pt-20 md:pb-12 space-y-8 md:space-y-12">
              {/* Results summary */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-light tracking-tight">
                    {activeListingLabel ? (
                      <>Properties <span className="italic text-foreground/60">{activeListingLabel}</span></>
                    ) : filters.property_type ? (
                      <>{PROPERTY_TYPES.find(t => t.value === filters.property_type)?.label || filters.property_type}<span className="text-foreground/60"> Properties</span></>
                    ) : (
                      'All Properties'
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {totalCount > 0 ? (
                      <><span className="text-foreground font-semibold">{totalCount.toLocaleString()}</span> results found</>
                    ) : isLoading ? 'Searching...' : 'No results'}
                    {(filters as any).city && (
                      <span className="ml-1">in <span className="text-[hsl(var(--gold))] font-medium">{(filters as any).city}</span></span>
                    )}
                  </p>
                </div>
              </div>

              {properties.length > 0 ? (
                <>
                  {/* Featured/Promoted Listings — Large editorial cards at top */}
                  {featuredProps.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-4 h-px bg-[hsl(var(--gold))]" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">Featured</span>
                        <Star size={10} className="text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {featuredProps.map((property: any) => (
                          <FeaturedPropertyCard key={property.id} property={property} />
                        ))}
                      </div>
                      <Separator className="!my-8 opacity-40" />
                    </div>
                  )}

                  {/* Regular Listings Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {(featuredProps.length > 0 ? regularProps : properties).map((property: any) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
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

              {isFetchingNextPage && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--gold))]" />
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
              price: p.asking_price?.toString() || p.monthly_rent?.toString() || 'Contact'
            }))}
          />
        )}
      </main>
    </div>
  )
}

/** Large featured card — mirrors James Edition's big editorial cards */
function FeaturedPropertyCard({ property }: { property: any }) {
  const img = property.cover_image_url 
    || property.images?.[0] 
    || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2000'

  const price = property.asking_price || property.monthly_rent || property.price
  const formattedPrice = price
    ? price >= 1_000_000
      ? `$${(price / 1_000_000).toFixed(1)}M`
      : `$${price.toLocaleString()}`
    : 'Price on Request'

  return (
    <Link to={`${ROUTES.PROPERTY_DETAIL}/${property.id}`} className="group block">
      <div className="relative h-[380px] md:h-[440px] rounded-md overflow-hidden bg-charcoal">
        {/* Image */}
        <img
          src={img}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[hsl(var(--gold))] text-black px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider shadow-gold-glow">
          <Star size={9} className="fill-black" />
          Featured
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 space-y-1.5">
          <p className="text-white/60 text-xs font-medium uppercase tracking-widest">
            {property.property_type}{property.city ? ` · ${property.city}` : ''}
          </p>
          <h3 className="font-serif text-white text-2xl font-medium leading-tight">
            {property.title}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[hsl(var(--gold))] font-semibold text-xl tracking-tight">
              {formattedPrice}
            </span>
            {property.bedrooms != null && (
              <span className="text-white/50 text-sm">
                {property.bedrooms} bed{property.bathrooms != null ? ` · ${property.bathrooms} bath` : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
