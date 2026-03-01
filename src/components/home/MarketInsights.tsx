import { ArrowRight, Clock } from 'lucide-react'

const ARTICLES = [
  {
    title: 'The Rise of Smart Cities in Africa',
    excerpt: 'How technological integration is redefining luxury living in Nairobi and Lagos, creating more sustainable and connected urban ecosystems.',
    category: 'Innovation',
    date: 'March 1, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Off-Plan Property: A Strategic Guide',
    excerpt: 'Navigating the risks and rewards of investing in pre-construction projects in high-growth emerging markets.',
    category: 'Investing',
    date: 'Feb 26, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Legal Essentials for Foreign Buyers',
    excerpt: 'Key considerations for international investors acquiring land and residential property across the continent.',
    category: 'Legal',
    date: 'Feb 14, 2026',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
  },
]

export default function MarketInsights() {
  return (
    <section className="py-12 md:py-16">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight mb-3">
            Market Insights
          </h2>
          <p className="text-muted-foreground font-medium max-w-xl">
            Stay ahead with the latest analysis, legal guides, and investment strategies from BlueOak's network of real estate specialists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ARTICLES.map((article, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6 bg-secondary/30">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-widest text-black rounded-sm shadow-sm">
                  {article.category}
                </span>
              </div>
            </div>

            <h3 className="font-serif text-2xl font-medium mb-3 leading-tight transition-colors group-hover:text-[hsl(var(--gold))]">
              {article.title}
            </h3>
            <p className="text-muted-foreground/80 text-sm leading-relaxed mb-6 line-clamp-3">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between py-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                   {article.date}
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock size={12} />
                  {article.readTime}
                </span>
              </div>
              <div className="text-[hsl(var(--gold))] opacity-0 translate-x-4 transition-all duration-300 md:group-hover:opacity-100 md:group-hover:translate-x-0">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 md:mt-16 flex justify-center">
        <button className="je-btn-ghost px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all">
          Explore All Insights
        </button>
      </div>
    </section>
  )
}
