import { useState } from 'react'
import { 
  LayoutGrid, 
  Map as MapIcon, 
  ChevronDown, 
  SlidersHorizontal,
  Search as SearchIcon
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
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import InteractiveMap from '@/components/common/InteractiveMap'
import EmptyState from '@/components/common/EmptyState'

export default function SearchPage() {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [listingType, setListingType] = useState('all')
  const [propertyType, setPropertyType] = useState('all')
  const [hasBorehole, setHasBorehole] = useState(false)
  const [hasStaffQuarters, setHasStaffQuarters] = useState(false)
  const [minSolar, setMinSolar] = useState('')
  const [minGenerator, setMinGenerator] = useState('')
  const [minWaterTank, setMinWaterTank] = useState('')

  const filteredProperties = MOCK_PROPERTIES.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesListing = listingType === 'all' || p.listingType === listingType
    const matchesProperty = propertyType === 'all' || p.type === propertyType

    // Technical spec matches (mock data might not have these yet, so we'll be lenient)
    const matchesBorehole = !hasBorehole || (p as any).has_borehole === true
    const matchesStaffQuarters = !hasStaffQuarters || (p as any).has_staff_quarters === true
    const matchesSolar = !minSolar || ((p as any).solar_capacity || 0) >= parseFloat(minSolar)
    const matchesGenerator = !minGenerator || ((p as any).generator_capacity || 0) >= parseFloat(minGenerator)
    const matchesWaterTank = !minWaterTank || ((p as any).water_tank_capacity || 0) >= parseFloat(minWaterTank)

    return matchesSearch && matchesListing && matchesProperty && matchesBorehole && matchesStaffQuarters && matchesSolar && matchesGenerator && matchesWaterTank
  })

  return (
    <div className="flex flex-col h-[calc(100vh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] md:h-screen bg-background">
      {/* Search & Filter Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/40 py-4">
        <Container className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 group">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder', 'Search cities, suburbs or points of interest...')}
                className="pl-12 h-12 bg-secondary/30 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/10 transition-all font-medium text-[15px]"
              />
            </div>
            
            <div className="flex items-center bg-secondary/30 rounded-2xl p-1 shrink-0">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className={cn("h-10 w-10 rounded-xl transition-all", viewMode === 'grid' && "bg-background shadow-sm hover:bg-background")}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid size={18} />
              </Button>
              <Button 
                variant={viewMode === 'map' ? 'secondary' : 'ghost'} 
                size="icon" 
                className={cn("h-10 w-10 rounded-xl transition-all", viewMode === 'map' && "bg-background shadow-sm hover:bg-background")}
                onClick={() => setViewMode('map')}
              >
                <MapIcon size={18} />
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className="w-fit h-10 gap-2 rounded-xl border-border/60 bg-background px-4 font-semibold text-[13px] hover:bg-secondary/20 transition-colors">
                <SelectValue placeholder="Listing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Listings</SelectItem>
                {LISTING_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-fit h-10 gap-2 rounded-xl border-border/60 bg-background px-4 font-semibold text-[13px] hover:bg-secondary/20 transition-colors">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {PROPERTY_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-10 px-4 rounded-xl border-border/60 bg-background font-semibold text-[13px] gap-2 hover:bg-secondary/20">
              Price
              <ChevronDown size={14} className="opacity-50" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-10 px-4 rounded-xl border-primary/20 bg-primary/5 text-primary font-semibold text-[13px] gap-2 hover:bg-primary/10 transition-all">
                  <SlidersHorizontal size={14} />
                  More filters
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-border/50">
                  <SheetTitle className="text-2xl font-black tracking-tight">Advanced Filters</SheetTitle>
                  <SheetDescription>Refine your property search results.</SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="flex-1 px-6">
                  <div className="py-6 space-y-8">
                    {/* Price Range Section */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold">Price Range</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="min-price" className="text-xs font-bold text-muted-foreground uppercase">Min Price</Label>
                          <Input id="min-price" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max-price" className="text-xs font-bold text-muted-foreground uppercase">Max Price</Label>
                          <Input id="max-price" placeholder="Any" />
                        </div>
                      </div>
                    </div>

                    {/* Beds & Baths Section */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold">Bedrooms</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Any', '1+', '2+', '3+', '4+', '5+'].map((n) => (
                          <Button key={n} variant="outline" className="h-10 px-4 rounded-xl border-2 font-bold hover:border-primary hover:text-primary transition-all">
                            {n}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <Separator />

                    {/* Technical Specifications Section */}
                    <div className="space-y-6">
                      <Label className="text-base font-bold">Technical Specifications</Label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 group cursor-pointer">
                          <Checkbox 
                            id="borehole-filter" 
                            checked={hasBorehole}
                            onCheckedChange={(checked) => setHasBorehole(!!checked)}
                            className="h-5 w-5 rounded-md border-2" 
                          />
                          <label htmlFor="borehole-filter" className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors">
                            Borehole
                          </label>
                        </div>
                        <div className="flex items-center space-x-3 group cursor-pointer">
                          <Checkbox 
                            id="staff-filter" 
                            checked={hasStaffQuarters}
                            onCheckedChange={(checked) => setHasStaffQuarters(!!checked)}
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
                            value={minSolar}
                            onChange={(e) => setMinSolar(e.target.value)}
                            className="h-10 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min Generator (kVA)</Label>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={minGenerator}
                            onChange={(e) => setMinGenerator(e.target.value)}
                            className="h-10 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min Water Tank (Litres)</Label>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={minWaterTank}
                            onChange={(e) => setMinWaterTank(e.target.value)}
                            className="h-10 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Amenities Section */}
                    <div className="space-y-4">
                      <Label className="text-base font-bold">Popular Amenities</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Borehole', 'Solar Power', 'Swimming Pool', 'Security Guard', 'Pet Friendly', 'Fibre Installed'].map((amenity) => (
                          <div key={amenity} className="flex items-center space-x-3 group cursor-pointer">
                            <Checkbox id={amenity} className="h-5 w-5 rounded-md border-2" />
                            <label htmlFor={amenity} className="text-sm font-medium leading-none cursor-pointer group-hover:text-primary transition-colors">
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <SheetFooter className="p-6 border-t border-border/50 bg-secondary/20">
                  <div className="flex items-center justify-between w-full gap-4">
                    <Button 
                      variant="ghost" 
                      className="font-bold"
                      onClick={() => {
                        setHasBorehole(false)
                        setHasStaffQuarters(false)
                        setMinSolar('')
                        setMinGenerator('')
                        setMinWaterTank('')
                      }}
                    >
                      Clear All
                    </Button>
                    <SheetClose asChild>
                      <Button className="flex-1 h-12 rounded-xl font-bold text-lg shadow-lg">Show {filteredProperties.length} Results</Button>
                    </SheetClose>
                  </div>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </Container>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {viewMode === 'grid' ? (
          <ScrollArea className="h-full">
            <Container className="py-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-muted-foreground">
                  Showing <span className="text-foreground">{filteredProperties.length}</span> properties
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-muted-foreground">Sort by:</span>
                  <Button variant="ghost" size="sm" className="font-semibold text-[13px] h-8 px-2 hover:bg-secondary/50">Newest first</Button>
                </div>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property as any} />
                  ))}
                </div>
              ) : (
                <EmptyState 
                  title="No results found"
                  description="We couldn't find any properties matching your current filters. Try adjust your search."
                  action={{
                    label: "Clear all filters",
                    onClick: () => { setSearchQuery(''); setListingType('all'); setPropertyType('all'); }
                  }}
                />
              )}
            </Container>
          </ScrollArea>
        ) : (
          <InteractiveMap 
            markers={filteredProperties.slice(0, 3).map(p => ({
              id: p.id,
              label: p.title,
              position: [0, 0], // In a real app these would be real coords
              price: p.price.toString()
            }))}
          />
        )}
      </main>
    </div>
  )
}
