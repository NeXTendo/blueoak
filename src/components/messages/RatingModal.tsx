import { useState } from 'react'
import { Star, Loader2, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMessages } from '@/hooks/useMessages'
import { toast } from 'sonner'

interface RatingModalProps {
  open: boolean
  onClose: () => void
  otherUser: {
    id: string
    full_name: string
  }
  propertyId?: string
}

export default function RatingModal({ open, onClose, otherUser, propertyId }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitReview } = useMessages()

  const handleSubmit = async () => {
    if (rating === 0) return
    setIsSubmitting(true)
    try {
      await submitReview({
        reviewed_id: otherUser.id,
        rating,
        comment: comment.trim() || undefined,
        property_id: propertyId
      })
      toast.success('Thank you for your feedback!')
      onClose()
      // Reset state
      setRating(0)
      setComment('')
    } catch (error) {
      console.error('Failed to submit rating:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isSubmitting && onClose()}>
      <DialogContent className="w-[95vw] max-w-sm bg-background border border-border p-0 overflow-hidden rounded-2xl shadow-premium">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--gold))]">Rate Your Experience</p>
              <h2 className="font-serif text-2xl font-medium mt-1 leading-tight">Review {otherUser.full_name}</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              title="Close"
              aria-label="Close"
              className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors shrink-0 -mt-1 -mr-1"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Stars */}
            <div className="flex flex-col items-center gap-4 py-2 border-y border-border/50">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    className="p-1.5 transition-transform active:scale-90"
                    disabled={isSubmitting}
                  >
                    <Star
                      size={28}
                      className={cn(
                        "transition-all duration-300",
                        (hoveredRating || rating) >= star
                          ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))] scale-110 drop-shadow-[0_0_8px_rgba(201,168,76,0.2)]"
                          : "text-muted-foreground/15"
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 transition-all">
                {rating === 0 ? 'Select a rating' : (
                   rating === 5 ? 'Excellent' :
                   rating === 4 ? 'Great' :
                   rating === 3 ? 'Good' :
                   rating === 2 ? 'Fair' : 'Poor'
                )}
              </p>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Your Feedback (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this interaction..."
                disabled={isSubmitting}
                className="w-full min-h-[120px] bg-secondary/30 rounded-xl p-4 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/30 focus:bg-background focus:ring-2 focus:ring-[hsl(var(--gold))] resize-none border border-transparent focus:border-transparent"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="w-full h-12 bg-[hsl(var(--gold))] text-black hover:brightness-110 shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-[11px] rounded-xl transition-all active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
