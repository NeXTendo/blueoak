import { motion } from 'framer-motion'

const LOGOS = [
  { 
    name: 'Bloomberg', 
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 md:h-8 fill-current">
        <path d="M4 18h2v-8h3V8H4v10zm6-10v10h2v-8h3V8h-5zm7 0v10h2v-8h3V8h-5z"/>
      </svg>
    )
  },
  { 
    name: 'Forbes', 
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 md:h-8 fill-current">
        <path d="M2 18h2V8H2v10zm3-10v10h2v-8h2V8H5zm5 0v10h2v-10h-2zm3 0v10h5v-2h-3v-2h3v-2h-3V10h3V8h-5z"/>
      </svg>
    ) 
  },
  { 
    name: 'FT', 
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 md:h-8 fill-current">
        <path d="M4 18h6v-2H6v-3h3v-2H6V10h4V8H4v10zm7-10v2h2v8h2v-8h2V8h-6z"/>
      </svg>
    ) 
  },
  { 
    name: 'JamesEdition', 
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 md:h-8 fill-current font-serif font-bold italic">
         <text x="0" y="20">JE</text>
      </svg>
    ) 
  },
  { 
    name: 'WSJ', 
    svg: (
      <svg viewBox="0 0 24 24" className="h-6 md:h-8 fill-current">
        <path d="M2 8l2 8 2-8 2 8 2-8h2L9 18H7L5 10 3 18H1L2 8z"/>
      </svg>
    ) 
  }
]

export default function TrustedRibbon() {
  return (
    <section className="w-full bg-secondary/10 py-4 md:py-6 border-y border-border/20 overflow-hidden">
      <div className="container mx-auto px-4 mb-3 md:mb-4 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-foreground/40">
          Recognized Authority
        </p>
      </div>
      
      <div className="relative flex overflow-hidden">
        <motion.div 
          className="flex items-center gap-16 md:gap-32 whitespace-nowrap min-w-full px-4"
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...LOGOS, ...LOGOS, ...LOGOS].map((item, idx) => (
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
