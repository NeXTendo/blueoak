import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AMENITIES } from '@/lib/constants'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StepAmenitiesProps {
  data: any
  updateData: (newData: any) => void
}

export default function StepAmenities({ data, updateData }: StepAmenitiesProps) {
  const toggleAmenity = (value: string) => {
    const current = data.amenities || []
    if (current.includes(value)) {
      updateData({ amenities: current.filter((a: string) => a !== value) })
    } else {
      updateData({ amenities: [...current, value] })
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12"
    >
      {Object.entries(AMENITIES).map(([category, items]) => (
        <div key={category} className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 flex items-center gap-3">
            {category.replace('_', ' ')}
            <div className="h-[1px] flex-1 bg-secondary/30" />
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item: any) => {
              const isActive = (data.amenities || []).includes(item.value)
              
              return (
                <div 
                  key={item.value} 
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer group",
                    isActive 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-secondary/10 border-transparent hover:border-secondary"
                  )}
                  onClick={() => toggleAmenity(item.value)}
                >
                  <Checkbox 
                    id={item.value} 
                    checked={isActive}
                    onCheckedChange={() => toggleAmenity(item.value)}
                    className="h-5 w-5 rounded-md border-2"
                  />
                  <Label 
                    htmlFor={item.value} 
                    className="text-[10px] font-bold uppercase tracking-tight leading-none cursor-pointer group-hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Label>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
