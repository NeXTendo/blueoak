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
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  // Ensure we show at most 7 real cards, plus a "See More" card if there are more
  const displayProperties = properties.slice(0, 7)

  return (
    <section className="group/carousel flex flex-col gap-4">
      <div className="flex items-end justify-between px-0">
        <Link 
          to={linkTo}
          className="flex items-center gap-2.5 group/title"
        >
          <h2 className="text-[16px] md:text-[18px] font-medium tracking-tight text-foreground group-hover/title:text-primary transition-colors">
            {title}
          </h2>
          <div className="h-5 w-5 rounded-full bg-secondary/30 flex items-center justify-center group-hover/title:bg-primary group-hover/title:text-white transition-all">
            <ArrowRight size={12} />
          </div>
        </Link>

        {/* Desktop Nav Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            title="Scroll left"
            className="h-8 w-8 rounded-full border border-secondary bg-background flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => scroll('right')}
            title="Scroll right"
            className="h-8 w-8 rounded-full border border-secondary bg-background flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-2.5 pb-4 no-scrollbar snap-x snap-mandatory"
      >
        {displayProperties.map((property) => (
          <div key={property.id} className="min-w-[170px] w-[170px] md:min-w-[220px] md:w-[220px] snap-start">
            <PropertyCard property={property} />
          </div>
        ))}

        {/* "See More" Card */}
        <Link 
          to={linkTo}
          className="min-w-[200px] w-[200px] md:min-w-[220px] md:w-[220px] aspect-[4/4.5] rounded-xl border-2 border-dashed border-secondary hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 p-6 text-center group/more snap-start"
        >
          <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover/more:bg-primary group-hover/more:text-white transition-all">
            <ArrowRight size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-bold text-[15px]">See more</span>
            <span className="text-[12px] text-muted-foreground font-medium">Explore all assets in this category</span>
          </div>
        </Link>
      </div>
    </section>
  )
}
