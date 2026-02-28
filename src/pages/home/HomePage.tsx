import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import PropertyCarousel from '@/components/property/PropertyCarousel'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import Container from '@/components/layout/Container'
import { Loader2, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2000&auto=format&fit=crop'

export default function HomePage() {
  const { data: homeData, isLoading } = useQuery({
    queryKey: ['home-data'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_homepage_data')
      if (error) throw error
      return data as any
    },
    staleTime: 1000 * 60 * 5,
  })

  // Auto-scrolling hero logic
  const heroProperties = homeData?.featured && homeData.featured.length > 0 
    ? homeData.featured 
    : [{ cover_image_url: DEFAULT_HERO }]
    
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)

  useEffect(() => {
    if (heroProperties.length <= 1) return
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroProperties.length)
    }, 6000) // Change image every 6 seconds
    return () => clearInterval(timer)
  }, [heroProperties.length])

  const sections = [
    { title: 'New to Market', properties: homeData?.new_listings || [], linkTo: '/search?sort=newest' },
    { title: 'Premier Lands · Lusaka', properties: homeData?.lands_lusaka || [], linkTo: '/search?type=Land&location=Lusaka' },
    { title: 'Featured Collections', properties: homeData?.featured || [], linkTo: '/search?featured=true' },
    { title: 'Modern Apartments · Nairobi', properties: homeData?.apartments_nairobi || [], linkTo: '/search?type=Apartment&location=Nairobi' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Cinematic Hero ───────────────────────────────────────── */}
      <section className="relative w-full h-[85vh] md:h-[80vh] flex items-end overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem] shadow-2xl">
        {/* Animated Hero Background */}
        <AnimatePresence initial={false}>
          <motion.img
            key={currentHeroIndex}
            src={heroProperties[currentHeroIndex]?.cover_image_url || DEFAULT_HERO}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Luxury property showcase"
          />
        </AnimatePresence>

        {/* Dark scrim: bottom half heavy, top transparent */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent pointer-events-none" />

        {/* Hero content */}
        <Container className="relative z-10 pb-16 md:pb-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-[hsl(var(--gold))]" />
              <span className="text-[hsl(var(--gold))] text-[10px] font-semibold uppercase tracking-[0.25em]">
                Global Luxury Real Estate
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-white text-4xl md:text-5xl lg:text-7xl font-light leading-[1.05] tracking-tight mb-6 drop-shadow-lg">
              Find extraordinary
              <br />
              <span className="italic text-white/90">properties</span>
              <br />
              across borders.
            </h1>

            {/* Sub */}
            <p className="text-white/60 text-base md:text-lg font-light mb-10 max-w-lg leading-relaxed">
              Exclusive residential, commercial, and land investments — curated for discerning buyers.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={ROUTES.SEARCH}
                className="je-btn-gold text-sm px-8 py-4 shadow-gold-glow"
              >
                Explore Properties
                <ArrowRight size={15} />
              </Link>
              <Link
                to={ROUTES.ADD_PROPERTY}
                className="flex items-center gap-2 px-8 py-4 border border-white/30 text-white/80 rounded-sm text-sm font-medium hover:bg-white/10 transition-colors"
              >
                List with Us
              </Link>
            </div>
          </div>
        </Container>

        {/* Bottom stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 hidden md:block">
          <Container>
            <div className="flex items-center divide-x divide-white/10 py-5">
              {[
                { value: '2,400+', label: 'Active Listings' },
                { value: '18', label: 'Countries' },
                { value: '$4.2B+', label: 'Assets Indexed' },
                { value: '12,000+', label: 'Verified Buyers' },
              ].map(({ value, label }) => (
                <div key={label} className="flex-1 flex flex-col items-center px-4">
                  <span className="font-serif text-white text-xl font-medium">{value}</span>
                  <span className="text-white/40 text-[10px] uppercase tracking-[0.15em] mt-0.5 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* ── Discovery Sections ───────────────────────────────────── */}
      <div className="bg-background">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="py-14 md:py-20">
            <Container className="flex flex-col gap-16 md:gap-24">
              
              {/* Inject the novel Categories Section */}
              <FeaturedCategories />

              {sections.map((section, idx) =>
                section.properties.length > 0 ? (
                  <PropertyCarousel
                    key={idx}
                    title={section.title}
                    properties={section.properties}
                    linkTo={section.linkTo}
                  />
                ) : null
              )}

              {/* CTA Banner */}
              <section className="relative overflow-hidden rounded-sm bg-charcoal text-white py-16 md:py-24 px-8 md:px-16">
                {/* Gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-[hsl(var(--gold)/0.4)]" />

                <div className="max-w-2xl relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-px bg-[hsl(var(--gold))]" />
                    <span className="text-[hsl(var(--gold))] text-[10px] font-semibold uppercase tracking-[0.25em]">List Your Asset</span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight mb-5">
                    Reach qualified buyers
                    <br />
                    <span className="italic text-white/50">across the globe.</span>
                  </h2>
                  <p className="text-white/50 text-base mb-10 leading-relaxed max-w-lg">
                    Access our global network of verified buyers and investors. Professional marketing, zero hassle.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to={ROUTES.ADD_PROPERTY} className="je-btn-gold px-8 py-4 text-sm shadow-gold-glow">
                      Start Listing
                      <ArrowRight size={15} />
                    </Link>
                    <Link to={ROUTES.SEARCH} className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white/60 rounded-sm text-sm font-medium hover:text-white hover:border-white/40 transition-colors">
                      Browse Listings
                    </Link>
                  </div>
                </div>

                {/* Decorative gold element */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-10">
                  <div className="w-48 h-48 rounded-full border border-[hsl(var(--gold))]" />
                  <div className="absolute w-32 h-32 rounded-full border border-[hsl(var(--gold))]" />
                </div>
              </section>
            </Container>
          </div>
        )}
      </div>
    </div>
  )
}
