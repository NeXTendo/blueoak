import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Compass, Key, ArrowRight, X } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const slides = [
  {
    Icon: Home,
    title: 'Curated Excellence',
    description: 'Access the most exclusive real estate listings across the continent. Refined for the discerning investor.',
    accent: 'from-amber-900/20 to-transparent',
  },
  {
    Icon: Compass,
    title: 'Precision Search',
    description: 'Advanced geospatial filtering and neighbourhood analytics to pinpoint your next acquisition.',
    accent: 'from-stone-800/20 to-transparent',
  },
  {
    Icon: Key,
    title: 'Seamless Access',
    description: 'Direct connections to premium sellers and verified agents. The key to your next chapter.',
    accent: 'from-yellow-900/20 to-transparent',
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  function finish() {
    localStorage.setItem('blueoak-onboarded', 'true')
    navigate(ROUTES.HOME, { replace: true })
    // trigger soft prompt on home after a moment
  }

  const slide = slides[step]

  return (
    <>
      {/* ───── Mobile Layout ───── */}
      <MobileOnboarding step={step} slide={slide} slides={slides} onNext={() => setStep(s => s + 1)} onFinish={finish} />

      {/* ───── Desktop Layout (modal-style) ───── */}
      <DesktopOnboarding step={step} slide={slide} slides={slides} onNext={() => setStep(s => s + 1)} onFinish={finish} />
    </>
  )
}

// ── Mobile Onboarding ─────────────────────────────────────────────────────────
function MobileOnboarding({ step, slide, slides, onNext, onFinish }: SlideProps) {
  return (
    <div className="md:hidden flex min-h-[100dvh] flex-col bg-background text-foreground">
      {/* Status bar area */}
      <div className="flex justify-between items-center px-6 pt-12 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[hsl(var(--gold))]" />
          <span className="text-[10px] font-black uppercase tracking-[0.35em] opacity-40">BlueOak</span>
        </div>
        <button onClick={onFinish} className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8">
        {/* Icon */}
        <div className="relative" key={`mob-icon-${step}`}>
          <div className="absolute -inset-10 bg-[hsl(var(--gold)/0.08)] rounded-full blur-3xl" />
          <div className="relative z-10 h-20 w-20 rounded-[2rem] bg-secondary/50 border border-border/50 flex items-center justify-center">
            <slide.Icon strokeWidth={1.5} className="h-8 w-8 text-[hsl(var(--gold))]" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-500" key={`mob-text-${step}`}>
          <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight text-foreground">
            {slide.title}
          </h2>
          <p className="text-base font-medium leading-relaxed text-muted-foreground">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="px-6 pb-10 space-y-5">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div key={i} className={cn(
              "h-1 rounded-full transition-all duration-500",
              i === step ? "w-8 bg-[hsl(var(--gold))]" : "w-2 bg-border"
            )} />
          ))}
        </div>

        {step < slides.length - 1 ? (
          <button
            onClick={onNext}
            className="group flex items-center justify-between w-full h-14 px-6 bg-foreground text-background rounded-2xl font-semibold text-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <span>Continue</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={onFinish}
            className="flex items-center justify-center w-full h-14 bg-[hsl(var(--gold))] text-black rounded-2xl font-bold text-sm hover:brightness-105 transition-all active:scale-[0.98] shadow-gold-glow"
          >
            Enter BlueOak
          </button>
        )}
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
          Est. 2024 · Zambia
        </p>
      </div>
    </div>
  )
}

// ── Desktop Onboarding (modal over blurred homepage preview) ─────────────────
function DesktopOnboarding({ step, slide, slides, onNext, onFinish }: SlideProps) {
  return (
    <div className="hidden md:flex min-h-screen bg-[#0a0a0a] items-center justify-center p-8">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[hsl(var(--gold)/0.04)] rounded-full blur-[120px]" />
      </div>

      {/* Modal card */}
      <div className="relative w-full max-w-4xl bg-background/95 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-2xl overflow-hidden flex min-h-[560px]">
        
        {/* Left panel — decorative */}
        <div className="w-2/5 bg-gradient-to-b from-[#1a1510] to-[#0d0d0d] flex flex-col justify-between p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,_#fff_1px,_transparent_1px)] bg-[length:28px_28px]" />
          
          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="h-2 w-2 rounded-full bg-[hsl(var(--gold))]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">BlueOak</span>
            </div>
          </div>

          {/* Step list */}
          <div className="relative z-10 space-y-5">
            {slides.map((s, i) => (
              <div key={i} className={cn(
                "flex items-center gap-4 transition-all duration-500",
                i === step ? "opacity-100" : i < step ? "opacity-40" : "opacity-20"
              )}>
                <div className={cn(
                  "h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 text-[10px] font-bold",
                  i === step
                    ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))] text-black"
                    : i < step
                    ? "border-white/30 bg-white/10 text-white/50"
                    : "border-white/10 text-white/20"
                )}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  i === step ? "text-white" : "text-white/30"
                )}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Est. 2024 · Zambia</p>
          </div>
        </div>

        {/* Right panel — content */}
        <div className="flex-1 flex flex-col p-12 relative">
          {/* Close / Skip */}
          <button
            title="Skip"
            onClick={onFinish}
            className="absolute top-6 right-6 h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground"
          >
            <X size={14} />
          </button>

          {/* Icon + content */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div className="relative" key={`desk-icon-${step}`}>
              <div className="absolute -inset-6 bg-[hsl(var(--gold)/0.06)] rounded-full blur-2xl" />
              <div className="relative z-10 h-16 w-16 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center">
                <slide.Icon strokeWidth={1.5} className="h-7 w-7 text-[hsl(var(--gold))]" />
              </div>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500" key={`desk-text-${step}`}>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-px bg-[hsl(var(--gold))]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--gold))]">
                  Step {step + 1} of {slides.length}
                </span>
              </div>
              <h2 className="font-serif text-4xl font-medium leading-tight tracking-tight">
                {slide.title}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
                {slide.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-border/40">
            <button
              onClick={onFinish}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Skip for now
            </button>

            {step < slides.length - 1 ? (
              <button
                onClick={onNext}
                className="group flex items-center gap-3 px-6 h-12 bg-foreground text-background rounded-xl font-semibold text-sm hover:opacity-90 transition-all"
              >
                Next
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={onFinish}
                className="flex items-center gap-3 px-6 h-12 bg-[hsl(var(--gold))] text-black rounded-xl font-bold text-sm hover:brightness-105 transition-all shadow-gold-glow"
              >
                Enter BlueOak
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface SlideProps {
  step: number
  slide: typeof slides[0]
  slides: typeof slides
  onNext: () => void
  onFinish: () => void
}
