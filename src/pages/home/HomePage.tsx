import { MOCK_PROPERTIES } from '@/lib/mock-data'
import PropertyCarousel from '@/components/property/PropertyCarousel'
import Container from '@/components/layout/Container'

export default function HomePage() {
  // Mock filtering logic for the 7 sections
  const sections = [
    {
      title: "Premier Lands in Lusaka",
      properties: MOCK_PROPERTIES.filter(p => p.type.toLowerCase().includes('land') && p.location.toLowerCase().includes('lusaka')),
      linkTo: "/search?type=Land&location=Lusaka"
    },
    {
      title: "Homes Available in Woodlands",
      properties: MOCK_PROPERTIES.filter(p => p.location.toLowerCase().includes('woodlands')),
      linkTo: "/search?location=Woodlands"
    },
    {
      title: "New Listings this Week",
      properties: MOCK_PROPERTIES.slice(0, 8),
      linkTo: "/search?sort=newest"
    },
    {
      title: "Top Rated Offices for Business",
      properties: MOCK_PROPERTIES.filter(p => p.type.toLowerCase().includes('office')),
      linkTo: "/search?type=Office"
    },
    {
      title: "Luxury Villas in Cape Town",
      properties: MOCK_PROPERTIES.filter(p => p.type.toLowerCase().includes('villa') && p.location.toLowerCase().includes('cape town')),
      linkTo: "/search?type=Villa&location=Cape Town"
    },
    {
      title: "Available since last month in Lusaka",
      properties: MOCK_PROPERTIES.filter(p => p.location.toLowerCase().includes('lusaka')).slice(2, 10),
      linkTo: "/search?location=Lusaka"
    },
    {
      title: "Modern Apartments in Nairobi",
      properties: MOCK_PROPERTIES.filter(p => p.type.toLowerCase().includes('apartment') && p.location.toLowerCase().includes('nairobi')),
      linkTo: "/search?type=Apartment&location=Nairobi"
    }
  ]

  return (
    <div className="flex flex-col min-h-screen pt-[calc(5.5rem+env(safe-area-inset-top))] md:pt-44 overflow-x-hidden">
      {/* Discovery Sections */}
      <div className="py-8 md:py-12">
        <Container className="flex flex-col gap-10 md:gap-12">
          {sections.map((section, idx) => (
            <PropertyCarousel 
              key={idx}
              title={section.title}
              properties={section.properties}
              linkTo={section.linkTo}
            />
          ))}

          {/* Dynamic Dark CTA Banner */}
          <section className="mt-8 py-16 md:py-24 bg-primary text-primary-foreground relative overflow-hidden rounded-[2rem] shadow-premium">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-bl-[20rem] -translate-y-24 translate-x-24 blur-3xl opacity-50" />
            <div className="max-w-4xl space-y-8 px-6 relative z-10 text-center mx-auto">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                  List your property <br />
                  <span className="opacity-40 font-medium">Reach high-intent investors.</span>
                </h2>
                <p className="text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto font-medium leading-relaxed">
                  Experience the pinnacle of real estate marketing with direct access to a global network of qualified buyers.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button className="h-14 px-10 bg-white text-black rounded-xl font-bold text-[15px] hover:shadow-2xl transition-all active:scale-95 shadow-xl">
                  Start Listing
                </button>
                <button className="h-14 px-10 border border-white/20 text-white rounded-xl font-semibold text-[15px] hover:bg-white/5 transition-all">
                  Learn more
                </button>
              </div>
            </div>
          </section>

          {/* Sub-hero Section at Bottom (Airbnb style footer distinction) */}
          <section className="mt-12 py-12 md:py-20 border-t border-secondary/20 relative overflow-hidden">
            {/* Subtle Brand Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-32 -translate-x-32" />
            
            <div className="relative z-10 text-center space-y-4">
               <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Discover your next <span className="text-primary">BlueOak</span> asset.</h2>
               <p className="text-muted-foreground max-w-2xl mx-auto font-medium">Access a curated selection of premier real estate, lands, and commercial properties across Africa's growing hubs.</p>
            </div>
          </section>
        </Container>
      </div>
    </div>
  )
}
