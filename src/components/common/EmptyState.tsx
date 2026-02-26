import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon | string
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in zoom-in duration-500",
      className
    )}>
      <div className="h-24 w-24 rounded-[2rem] bg-secondary/50 flex items-center justify-center text-4xl shadow-inner">
        {Icon ? (
          typeof Icon === 'string' ? Icon : <Icon size={40} className="text-primary/40" />
        ) : '🔍'}
      </div>
      <div className="space-y-2 max-w-sm">
        <h3 className="text-2xl font-black tracking-tight uppercase">{title}</h3>
        <p className="text-muted-foreground font-medium italic leading-relaxed">{description}</p>
      </div>
      {action && (
        <Button 
          onClick={action.onClick}
          variant="outline"
          className="rounded-xl px-8 h-12 border-2 font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
