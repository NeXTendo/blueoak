import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Compass, Key, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const slides = [
  {
    Icon: Home,
    title: 'Curated Excellence',
    description: 'Access the most exclusive real estate listings across the continent. Refined for the discerning investor.',
  },
  {
    Icon: Compass,
    title: 'Precision Search',
    description: 'Advanced geospatial filtering and neighborhood analytics to pinpoint your next acquisition.',
  },
  {
    Icon: Key,
    title: 'Seamless Access',
    description: 'Direct connections to premium sellers and verified agents. The key to your next chapter.',
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  function finish() {
    localStorage.setItem('blueoak-onboarded', 'true')
    navigate(ROUTES.REGISTER, { replace: true })
  }

  const slide = slides[step]

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-all duration-700">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-8">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">BlueOak Premium</span>
        </div>
        <button 
          onClick={finish} 
          className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 text-center">
        <div className="relative mb-16">
          <div className="absolute -inset-8 bg-primary/5 rounded-full blur-3xl" />
          <slide.Icon 
            strokeWidth={1.5} 
            className="h-20 w-20 text-primary relative z-10 animate-fade-in" 
            key={`icon-${step}`}
          />
        </div>

        <div className="space-y-6 max-w-sm animate-fade-in" key={`content-${step}`}>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none text-primary">
            {slide.title}
          </h2>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground/80">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-10 space-y-10">
        <div className="flex justify-center gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-[2px] rounded-full transition-all duration-500",
                i === step ? "w-12 bg-primary" : "w-4 bg-secondary"
              )}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {step < slides.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="group flex items-center justify-between w-full h-16 px-8 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-premium transition-all active:scale-[0.98]"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex items-center justify-center w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-premium transition-all active:scale-[0.98]"
            >
              Enter BlueOak
            </button>
          )}
          
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              EST. 2024 • ZAMBIA
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
