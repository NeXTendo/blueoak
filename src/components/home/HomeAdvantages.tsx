import { ShieldCheck, Globe, UserCheck } from 'lucide-react'

const ADVANTAGES = [
  {
    icon: ShieldCheck,
    title: 'Verified Properties',
    description: 'Every listing on BlueOak undergoes a rigorous verification process to ensure authenticity and legal compliance, protecting your investment.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting extraordinary assets with a worldwide network of qualified buyers across Africa, Europe, and beyond.',
  },
  {
    icon: UserCheck,
    title: 'Expert Guidance',
    description: 'Our ecosystem includes top-tier partner agencies and legal advisors who provide professional support at every step of your transaction.',
  },
]

export default function HomeAdvantages() {
  return (
    <section className="py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
        {ADVANTAGES.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center group">
            <div className="mb-6 p-4 rounded-2xl bg-secondary/30 text-[hsl(var(--gold))] transition-all duration-300 group-hover:bg-[hsl(var(--gold))] group-hover:text-black group-hover:shadow-gold-glow">
              <item.icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl font-medium mb-4 tracking-tight">
              {item.title}
            </h3>
            <p className="text-muted-foreground/80 leading-relaxed text-sm max-w-[280px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
