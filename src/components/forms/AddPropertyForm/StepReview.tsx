import { Separator } from '@/components/ui/separator'
import { motion } from 'framer-motion'
import { Check, AlertCircle } from 'lucide-react'

interface StepReviewProps {
  data: any
}

export default function StepReview({ data }: StepReviewProps) {
  const getListingTypeLabel = () => {
    switch(data.listing_type) {
      case 'sale': return 'For Sale'
      case 'rent': return 'To Rent'
      case 'short_term': return 'Short-term'
      case 'lease': return 'Commercial Lease'
      case 'auction': return 'Auction'
      default: return data.listing_type
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      <div className="text-center space-y-2">
         <h3 className="text-2xl font-black tracking-tight uppercase">Protocol Finalization</h3>
         <p className="text-muted-foreground text-sm font-medium italic">Validate the asset records before global indexing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <div className="p-8 bg-secondary/10 rounded-[2.5rem] border-2 border-secondary/50 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Check size={80} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Core Summary</h4>
              
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground/50">Asset Title</span>
                    <span className="text-xs font-bold">{data.title}</span>
                 </div>
                 <Separator className="bg-secondary/40" />
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground/50">Category</span>
                    <span className="text-xs font-bold uppercase">{data.property_type}</span>
                 </div>
                 <Separator className="bg-secondary/40" />
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground/50">Operation</span>
                    <span className="text-xs font-bold text-primary uppercase">{getListingTypeLabel()}</span>
                 </div>
                 <Separator className="bg-secondary/40" />
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground/50">Valuation</span>
                    <span className="text-sm font-black text-primary">{data.currency} {data.asking_price || data.monthly_rent || data.nightly_rate || '0'}</span>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-orange-500/5 border-2 border-orange-500/10 rounded-2xl flex gap-4">
              <AlertCircle className="text-orange-600 shrink-0" size={20} />
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Verification Required</p>
                 <p className="text-[10px] font-medium text-orange-700/70 leading-relaxed italic">
                    Asset records will undergo administrative audit before being broadcast across the BlueOak network.
                 </p>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="p-8 bg-background border-2 border-secondary rounded-[2.5rem] space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Physical DNA</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Configuration</p>
                    <p className="text-xs font-bold">{data.bedrooms || 0} Beds | {data.bathrooms || 0} Baths</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Interior Space</p>
                    <p className="text-xs font-bold">{data.floor_area || 0} SQM</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Infrastructure</p>
                    <p className="text-xs font-bold uppercase text-[10px]">
                       {[
                         data.borehole && 'Borehole',
                         data.solar_power && 'Solar',
                         data.generator && 'Backup'
                       ].filter(Boolean).join(' • ') || 'Standard Utilities'}
                    </p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Identity</p>
                    <p className="text-xs font-bold uppercase text-[10px]">{data.city}, {data.country}</p>
                 </div>
              </div>

              <Separator />

              <div className="space-y-3">
                 <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Feature Index</p>
                 <div className="flex flex-wrap gap-2">
                    {data.amenities?.slice(0, 6).map((a: string) => (
                      <span key={a} className="px-3 py-1 bg-secondary/10 rounded-full text-[8px] font-bold uppercase tracking-widest border border-secondary/50">
                        {a.replace('_', ' ')}
                      </span>
                    ))}
                    {data.amenities?.length > 6 && (
                       <span className="text-[8px] font-bold text-muted-foreground italic">+{data.amenities.length - 6} more</span>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  )
}
