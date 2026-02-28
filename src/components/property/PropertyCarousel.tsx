import { useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertyCard from './PropertyCard'

interface PropertyCarouselProps {
  title: string
  properties: any[]
  linkTo: string
}

export default function PropertyCarousel({ title, properties, linkTo }: PropertyCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8,
        behavior: 'smooth'
      })
    }
  }

  const displayProperties = properties.slice(0, 7)

  return (
    <section className="flex flex-col gap-5">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-5 h-px bg-[hsl(var(--gold))]" />
          <h2 className="font-serif text-xl md:text-2xl font-medium text-foreground tracking-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop arrow nav */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              title="Scroll left"
              className="h-8 w-8 rounded-full border border-border bg-background flex items-center justify-center hover:border-[hsl(var(--gold)/0.5)] hover:text-[hsl(var(--gold))] transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => scroll('right')}
              title="Scroll right"
              className="h-8 w-8 rounded-full border border-border bg-background flex items-center justify-center hover:border-[hsl(var(--gold)/0.5)] hover:text-[hsl(var(--gold))] transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <Link
            to={linkTo}
            className="flex items-center gap-1.5 text-[hsl(var(--gold))] text-xs font-semibold uppercase tracking-[0.12em] hover:opacity-70 transition-opacity"
          >
            View all
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Scroll row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x snap-mandatory [scrollbar-width:none]"
      >
        {displayProperties.map((property) => (
          <div key={property.id} className="min-w-[280px] w-[280px] md:min-w-[340px] md:w-[340px] snap-start">
            <PropertyCard property={property} />
          </div>
        ))}

        {/* See More Card */}
        <Link
          to={linkTo}
          className="min-w-[280px] w-[280px] md:min-w-[340px] md:w-[340px] aspect-[4/3] md:aspect-[3/2] rounded-sm border border-dashed border-border hover:border-[hsl(var(--gold)/0.5)] hover:bg-[hsl(var(--gold)/0.04)] transition-all flex flex-col items-center justify-center gap-4 p-6 text-center group snap-start"
        >
          <div className="h-11 w-11 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-[hsl(var(--gold)/0.5)] group-hover:text-[hsl(var(--gold))] transition-all">
            <ArrowRight size={18} />
          </div>
          <div>
            <p className="font-serif text-base font-medium text-foreground group-hover:text-[hsl(var(--gold))] transition-colors">See All</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">Browse full collection</p>
          </div>
        </Link>
      </div>
    </section>
  )
}
