import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PROPERTY_TYPES } from '@/lib/constants'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  const featuredProperties = MOCK_PROPERTIES.filter(p => p.isFeatured)
  const recentProperties = MOCK_PROPERTIES.slice(0, 8)

  return (
    <div className="flex flex-col gap-16 pb-32 overflow-x-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center bg-black overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-background z-10" />
          <img 
            src="https://images.unsplash.com/photo-1600607687940-c52af054399b?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero"
            className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60"
          />
        </div>

        <Container className="relative z-20 w-full">
          <div className="max-w-4xl space-y-12 animate-fade-in px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-white/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60">
                  Established Excellence
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-[0.85]">
                Luxury <br />
                <span className="text-white/40 italic">Redefined.</span>
              </h1>
            </div>

            <div className="relative group max-w-2xl transform transition-all hover:scale-[1.01]">
              <div className="absolute -inset-1 bg-white/10 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full overflow-hidden p-2">
                <Input 
                  placeholder="Search exclusive portfolios..."
                  className="h-16 pl-8 bg-transparent border-none text-white placeholder:text-white/40 text-lg font-medium ring-0 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="h-14 px-10 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all flex items-center gap-2 group/btn">
                  Explore
                  <Search size={14} className="group-hover/btn:scale-125 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-10 items-center">
              {[
                { label: 'Verified Listing', value: '1.2k+' },
                { label: 'Premium Agents', value: '450+' },
                { label: 'Sold Value', value: '$850M' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-xl font-black text-white">{stat.value}</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Discovery Categories */}
      <section className="-mt-24 relative z-30">
        <Container>
          <div className="flex flex-wrap justify-center gap-4 p-4 bg-background/50 backdrop-blur-3xl rounded-[3rem] border border-border/10 shadow-premium">
            <button className="h-12 px-8 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
              All Assets
            </button>
            {PROPERTY_TYPES.map((type) => (
              <button 
                key={type.value}
                className="h-12 px-8 bg-secondary/30 hover:bg-secondary text-muted-foreground hover:text-primary rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
              >
                {type.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured Collection */}
      <section className="space-y-12">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Premier</span>
              </div>
              <h2 className="text-5xl font-black uppercase tracking-tighter text-primary">
                The Portfolio
              </h2>
            </div>
            <button className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-colors">
              Explore All Collection
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12 px-4 pb-12">
            {featuredProperties.slice(0, 3).map((property) => (
              <PropertyCard key={property.id} property={property as any} />
            ))}
          </div>
        </Container>
      </section>

      {/* Dark Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <Container>
          <div className="max-w-4xl space-y-12 px-4 relative z-10">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary-foreground/40 italic">
                Strategic Reach
              </span>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
                List Your <br />
                <span className="text-primary-foreground/20 italic">Global Legacy.</span>
              </h2>
            </div>
            <p className="text-xl text-primary-foreground/60 max-w-xl font-medium leading-relaxed">
              Experience the pinnacle of real estate marketing. High-intent buyers and unparalleled exposure.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button className="h-16 px-12 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all active:scale-98">
                Request Onboarding
              </button>
              <button className="h-16 px-12 border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all">
                The Program
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Market Discovery */}
      <section className="space-y-12">
        <Container>
          <div className="space-y-4 px-4">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-primary">
              Market Discovery
            </h2>
            <p className="text-sm font-medium text-muted-foreground max-w-md">
              The latest additions to our exclusive network.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 mt-12 px-4">
            {recentProperties.map((property) => (
              <PropertyCard key={property.id} property={property as any} />
            ))}
          </div>
          <div className="mt-20 flex justify-center px-4">
            <button className="w-full max-w-sm h-16 border-2 border-secondary rounded-2xl font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:border-primary hover:text-primary transition-all">
              Discover Full Inventory
            </button>
          </div>
        </Container>
      </section>
    </div>
  )
}
