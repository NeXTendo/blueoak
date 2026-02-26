import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isUp: boolean
    label?: string
  }
  className?: string
  variant?: 'default' | 'primary' | 'secondary'
}

export default function StatsCard({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  className,
  variant = 'default' 
}: StatsCardProps) {
  return (
    <div className={cn(
      "p-8 rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden",
      variant === 'default' && "bg-background border-secondary hover:border-primary/20 hover:shadow-premium",
      variant === 'primary' && "bg-primary border-primary text-primary-foreground shadow-2xl shadow-primary/20",
      variant === 'secondary' && "bg-secondary/30 border-secondary hover:border-primary/20",
      className
    )}>
      {/* Sparkle effect on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -translate-y-4 translate-x-4 transition-transform group-hover:scale-110 group-hover:bg-primary/10" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center border-2 transition-colors",
            variant === 'default' && "bg-secondary/30 border-secondary group-hover:border-primary group-hover:text-primary",
            variant === 'primary' && "bg-white/10 border-white/20 text-white",
            variant === 'secondary' && "bg-background border-secondary group-hover:border-primary"
          )}>
            <Icon size={20} />
          </div>
          
          <div className="space-y-1">
            <p className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              variant === 'primary' ? "text-primary-foreground/60" : "text-muted-foreground"
            )}>
              {label}
            </p>
            <h3 className="text-3xl font-black tracking-tighter tabular-nums leading-none">
              {value}
            </h3>
          </div>
        </div>

        {trend && (
          <div className={cn(
            "flex flex-col items-end gap-1 px-3 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest",
            trend.isUp 
              ? (variant === 'primary' ? "bg-white/20 border-white/20 text-white" : "bg-green-500/10 border-green-500/20 text-green-500")
              : (variant === 'primary' ? "bg-white/20 border-white/20 text-white" : "bg-red-500/10 border-red-500/20 text-red-500")
          )}>
            <div className="flex items-center gap-1">
              {trend.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {trend.value}%
            </div>
            {trend.label && <span className="text-[8px] opacity-60">{trend.label}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
