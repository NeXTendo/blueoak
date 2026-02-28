import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

interface CategoryCardProps {
  title: string
  propertyCount: string
  image: string
  link: string
}

function CategoryCard({ title, propertyCount, image, link }: CategoryCardProps) {
  return (
    <Link 
      to={link}
      className="group relative h-[350px] md:h-[450px] overflow-hidden rounded-md bg-charcoal block"
    >
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
      />
      
      {/* Heavy gradient overlay for better text readability and cinematic feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-80" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h3 className="font-serif text-3xl text-white font-medium mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-white/70 overflow-hidden">
          <span className="font-medium tracking-wide uppercase text-xs transform transition-transform duration-500 group-hover:-translate-y-2">
            {propertyCount} Properties
          </span>
          <ArrowRight 
            size={18} 
            className="text-[hsl(var(--gold))] opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-2" 
          />
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedCategories() {
  const { data: counts, isLoading } = useQuery({
    queryKey: ['featured-category-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_feature_category_counts')
      if (error) {
        console.error("Error fetching category counts:", error)
        return { villas: 0, penthouses: 0, student_accommodation: 0, land: 0 }
      }
      return data || { villas: 0, penthouses: 0, student_accommodation: 0, land: 0 }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  })

  const categories: CategoryCardProps[] = [
    {
      title: "Luxury Villas",
      propertyCount: isLoading ? "..." : (counts?.villas || "0"),
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
      link: "/search?property_type=House&min_price=1000000"
    },
    {
      title: "Penthouses",
      propertyCount: isLoading ? "..." : (counts?.penthouses || "0"),
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop",
      link: "/search?property_type=Apartment&min_price=500000"
    },
    {
      title: "Student Living",
      propertyCount: isLoading ? "..." : (counts?.student_accommodation || "0"),
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000&auto=format&fit=crop",
      link: "/search?property_type=Student+Accommodation"
    },
    {
      title: "Prime Land",
      propertyCount: isLoading ? "..." : (counts?.land || "0"),
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop",
      link: "/search?property_type=Land"
    }
  ]

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight mb-3">
            Featured Categories
          </h2>
          <p className="text-muted-foreground font-medium max-w-xl">
            Explore our meticulously curated portfolio by property type to find your perfect lifestyle match.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <CategoryCard key={i} {...cat} />
        ))}
      </div>
    </section>
  )
}
