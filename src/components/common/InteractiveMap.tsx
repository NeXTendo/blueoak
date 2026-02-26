import { Map as MapIcon, Maximize2, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InteractiveMapProps {
  className?: string
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    id: string
    position: [number, number]
    label: string
    price?: string
  }>
}

export default function InteractiveMap({ className, markers = [] }: InteractiveMapProps) {
  return (
    <div className={cn(
      "relative h-full w-full bg-secondary/30 overflow-hidden group",
      className
    )}>
      {/* High-Fidelity Map Background Placeholder */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066" 
          alt="Intelligence Grid Map" 
          className="w-full h-full object-cover grayscale opacity-40 transition-transform duration-[10s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/20" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-10 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Dynamic Markers Placeholder */}
      <div className="relative z-20 h-full w-full">
        {markers.map((marker, i) => (
            <div 
              key={marker.id}
              className={cn(
                "absolute animate-bounce-slow",
                i === 0 ? "top-[20%] left-[15%]" : 
                i === 1 ? "top-[35%] left-[40%]" : 
                "top-[50%] left-[65%]"
              )}
            >
            <div className="relative group/pin">
              <div className="h-10 px-4 bg-primary text-white rounded-full flex items-center justify-center font-black text-[10px] uppercase tracking-widest shadow-2xl border-2 border-white cursor-pointer hover:scale-110 hover:bg-black transition-all">
                {marker.price || marker.label}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4 bg-primary/40" />
            </div>
          </div>
        ))}
      </div>

      {/* Map Controls Overlay */}
      <div className="absolute bottom-8 right-8 z-30 flex flex-col gap-2">
        <Button size="icon" variant="secondary" className="h-12 w-12 rounded-2xl border-2 shadow-xl hover:bg-primary hover:text-white transition-all">
          <Maximize2 size={18} />
        </Button>
        <Button size="icon" variant="secondary" className="h-12 w-12 rounded-2xl border-2 shadow-xl hover:bg-primary hover:text-white transition-all">
          <Navigation size={18} />
        </Button>
      </div>

      {/* Status Overlay */}
      <div className="absolute top-8 left-8 z-30 p-4 bg-background/80 backdrop-blur-xl rounded-2xl border border-secondary shadow-xl flex items-center gap-4">
        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Live Intelligence Feed Active
        </span>
      </div>

      {/* Non-Functional CTA for Demo */}
      <div className="absolute inset-0 z-40 bg-black/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
        <div className="p-8 bg-background/90 backdrop-blur-2xl rounded-3xl border-2 border-primary/20 shadow-premium text-center scale-90 hover:scale-100 transition-transform">
          <MapIcon size={32} className="mx-auto text-primary mb-4" />
          <h4 className="text-xl font-black uppercase tracking-tight">Interactive Layer</h4>
          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">API handshaking in progress</p>
        </div>
      </div>
    </div>
  )
}
