import { Star, ShieldCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
  author: {
    name: string
    avatar?: string
    isVerified?: boolean
    role?: string
  }
  rating: number
  content: string
  date: string
  className?: string
}

export default function ReviewCard({ 
  author, 
  rating, 
  content, 
  date, 
  className 
}: ReviewCardProps) {
  return (
    <div className={cn(
      "p-8 bg-background border border-secondary rounded-[2rem] space-y-6 hover:border-primary/20 transition-all group",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-4 ring-secondary/50">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black uppercase tracking-tight">{author.name}</h4>
              {author.isVerified && <ShieldCheck size={12} className="text-primary" />}
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">
              {author.role || 'Verified Member'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              className={cn(
                "transition-colors",
                i < rating ? "text-primary fill-primary" : "text-secondary fill-secondary"
              )} 
            />
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-4 -left-2 text-4xl text-primary/5 font-serif pointer-events-none">"</div>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed italic relative z-10">
          {content}
        </p>
      </div>

      <div className="pt-4 border-t border-secondary/50 flex justify-between items-center">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
          Historical Record
        </span>
        <span className="text-[10px] font-bold text-muted-foreground/60">{date}</span>
      </div>
    </div>
  )
}
