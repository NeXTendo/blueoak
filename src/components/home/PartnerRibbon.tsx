import { motion } from 'framer-motion'

const PARTNER_LOGOS = [
  { 
    name: 'Pam Golding', 
    svg: (
      <svg viewBox="0 0 120 40" className="h-6 md:h-8 fill-current">
        <text x="0" y="30" className="font-serif font-bold text-xl uppercase tracking-tighter">Pam Golding</text>
      </svg>
    )
  },
  { 
    name: 'Knight Frank', 
    svg: (
      <svg viewBox="0 0 120 40" className="h-6 md:h-8 fill-current">
        <text x="0" y="30" className="font-serif font-bold text-xl uppercase tracking-tighter">Knight Frank</text>
      </svg>
    )
  },
  { 
    name: 'HassConsult', 
    svg: (
      <svg viewBox="0 0 120 40" className="h-6 md:h-8 fill-current">
        <text x="0" y="30" className="font-serif font-bold text-xl uppercase tracking-tighter">HassConsult</text>
      </svg>
    )
  },
  { 
    name: 'Sothebys', 
    svg: (
      <svg viewBox="0 0 120 40" className="h-6 md:h-8 fill-current">
        <text x="0" y="30" className="font-serif font-bold text-xl uppercase tracking-tighter">Sotheby's</text>
      </svg>
    )
  },
  { 
    name: 'Savills', 
    svg: (
      <svg viewBox="0 0 120 40" className="h-6 md:h-8 fill-current">
        <text x="0" y="30" className="font-serif font-bold text-xl uppercase tracking-tighter">Savills</text>
      </svg>
    )
  },
  { 
    name: 'RE/MAX', 
    svg: (
      <svg viewBox="0 0 120 40" className="h-6 md:h-8 fill-current">
        <text x="0" y="30" className="font-serif font-bold text-xl uppercase tracking-tighter">RE/MAX</text>
      </svg>
    )
  }
]

export default function PartnerRibbon() {
  return (
    <section className="w-full bg-secondary/10 py-4 md:py-6 border-y border-border/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-3 md:mb-4 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/40">
          Global Elite Partners
        </p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div 
          className="flex items-center gap-16 md:gap-32 whitespace-nowrap min-w-full px-4"
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((item, idx) => (
            <div 
              key={idx} 
              className="text-foreground/70 hover:text-foreground transition-colors cursor-default select-none"
              title={item.name}
            >
              {item.svg}
            </div>
          ))}
        </motion.div>
        
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </section>
  )
}
