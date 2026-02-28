import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import PropertyCarousel from '@/components/property/PropertyCarousel'
import FeaturedCategories from '@/components/home/FeaturedCategories'
import Container from '@/components/layout/Container'
import { Loader2, ArrowRight, X } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { useCurrencyStore } from '@/stores/currencyStore'
import { useFormatPrice } from '@/hooks/useFormatPrice'
import AuthModal from '@/components/auth/AuthModal'

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2000&auto=format&fit=crop'

export default function HomePage() {
  const { session } = useAuthStore()
  const [showSignupPrompt, setShowSignupPrompt] = useState(false)
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: 'login' | 'register' }>({ open: false, tab: 'register' })

  // Show soft signup prompt to guests (12-minute throttle)
  useEffect(() => {
    if (session) return
    
    const lastPrompt = localStorage.getItem('blueoak-last-auth-prompt')
    const now = Date.now()
    if (lastPrompt && now - parseInt(lastPrompt) < 12 * 60 * 1000) return

    const justOnboarded = localStorage.getItem('blueoak-onboarded') === 'true'
    const delay = justOnboarded ? 1500 : 4000
    
    const t = setTimeout(() => {
      setShowSignupPrompt(true)
      // Mark as shown this session/period
      localStorage.setItem('blueoak-last-auth-prompt', Date.now().toString())
    }, delay)
    
    return () => clearTimeout(t)
  }, [session])

  const { currency: globalCurrency } = useCurrencyStore()
  const { formatBig } = useFormatPrice()

  const { data: homeData, isLoading: propsLoading } = useQuery({
    queryKey: ['home-data'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_homepage_data')
      if (error) throw error
      return data as any
    },
    staleTime: 1000 * 60 * 5,
  })

  // Fetch live platform stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['platform-stats', globalCurrency],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc('get_platform_stats', { p_currency: globalCurrency })
      if (error) throw error
      return data as { active_listings: number; countries: number; assets_value: number; verified_buyers: number }
    },
    staleTime: 1000 * 60 * 5, // 5 mins
  })

  // Auto-scrolling hero logic
  const heroProperties = (homeData?.featured && homeData.featured.length > 0)
    ? homeData.featured.slice(0, 5)
    : (homeData?.new_listings && homeData.new_listings.length > 0)
      ? homeData.new_listings.slice(0, 5)
      : [{ cover_image_url: DEFAULT_HERO, title: 'Global Portfolio', city: 'Various', country: 'Worldwide', property_type: 'Featured Collection' }]
    
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
    { title: 'Featured Collections', properties: homeData?.featured || [], linkTo: '/search?is_featured=true' },
    { title: 'Modern Apartments · Nairobi', properties: homeData?.apartments_nairobi || [], linkTo: '/search?type=Apartment&location=Nairobi' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Cinematic Hero ───────────────────────────────────────── */}
      <section className="relative w-full h-[75vh] md:h-[70vh] flex items-end overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem] shadow-2xl">
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

        {/* Dark scrim: heavy bottom for text, dark top for nav legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-transparent pointer-events-none" />

        {/* Hero content */}
        <Container className="relative z-10 pb-16 md:pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 w-full">
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-[hsl(var(--gold))]" />
                <span className="text-[hsl(var(--gold))] text-[10px] font-semibold uppercase tracking-[0.25em]">
                  {heroProperties[currentHeroIndex]?.property_type || 'Featured Collection'}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tighter mb-8 drop-shadow-2xl">
                Discover Extraordinary Properties Across Borders.
              </h1>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={heroProperties[currentHeroIndex]?.id ? `${ROUTES.PROPERTY_DETAIL}/${heroProperties[currentHeroIndex].id}` : ROUTES.SEARCH}
                  className="je-btn-gold text-sm px-8 py-4 shadow-gold-glow"
                >
                  View Property
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

            {/* Progress Bar Shuffler */}
            <div className="flex flex-col items-end gap-4 shrink-0 pb-2">
              {/* Dynamic Property Info Above Bars */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentHeroIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-right"
                >
                  <p className="text-white font-serif text-lg md:text-xl font-medium tracking-tight">
                    {heroProperties[currentHeroIndex]?.title}
                  </p>
                  <p className="text-[hsl(var(--gold))] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                    {heroProperties[currentHeroIndex]?.city} • {heroProperties[currentHeroIndex]?.country}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2">
                {heroProperties.map((_: any, i: number) => (
                  <div 
                    key={i} 
                    className="relative h-1 w-8 md:w-16 bg-white/20 rounded-full overflow-hidden cursor-pointer"
                    onClick={() => setCurrentHeroIndex(i)}
                  >
                    {i === currentHeroIndex && (
                      <motion.div 
                        className="absolute inset-y-0 left-0 bg-[hsl(var(--gold))]"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        key={`progress-${currentHeroIndex}`}
                        transition={{ duration: 6, ease: "linear" }}
                      />
                    )}
                    {i < currentHeroIndex && (
                      <div className="absolute inset-y-0 left-0 w-full bg-white/60" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>

      {/* Bottom stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 hidden md:block">
          <Container>
            <div className="flex items-center divide-x divide-white/10 py-5">
              {[
                { 
                  value: statsLoading ? '...' : `${statsData?.active_listings?.toLocaleString() || 0}+`, 
                  label: 'Active Listings' 
                },
                { 
                  value: statsLoading ? '...' : `${statsData?.countries || 0}`, 
                  label: 'Countries' 
                },
                { 
                  value: statsLoading ? '...' : formatBig(statsData?.assets_value || 0, globalCurrency), 
                  label: 'Assets Indexed' 
                },
                { 
                  value: statsLoading ? '...' : `${statsData?.verified_buyers?.toLocaleString() || 0}+`, 
                  label: 'Verified Buyers' 
                },
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
        {propsLoading ? (
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

      {/* ── Soft Signup Prompt (guests only) ─────────────────────────────── */}
      <AnimatePresence>
        {showSignupPrompt && !session && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-[5.5rem] md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-50 md:w-[420px]"
          >
            <div className="bg-background border border-border/60 rounded-2xl shadow-premium px-5 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-sm font-medium leading-tight">Join BlueOak</p>
                <p className="text-xs text-muted-foreground mt-0.5">Save properties, get alerts, and unlock full access.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => { setAuthModal({ open: true, tab: 'register' }); setShowSignupPrompt(false) }}
                  className="px-4 py-2 bg-[hsl(var(--gold))] text-black rounded-lg text-xs font-bold hover:brightness-105 transition-all shadow-gold-glow"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => { setAuthModal({ open: true, tab: 'login' }); setShowSignupPrompt(false) }}
                  className="px-4 py-2 border border-border rounded-lg text-xs font-medium hover:bg-secondary transition-colors"
                >
                  Log In
                </button>
                <button
                  title="Dismiss"
                  onClick={() => setShowSignupPrompt(false)}
                  className="h-7 w-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        open={authModal.open}
        onClose={() => setAuthModal(m => ({ ...m, open: false }))}
        initialTab={authModal.tab}
      />
    </div>
  )
}
