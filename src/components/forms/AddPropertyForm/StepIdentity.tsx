import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { PROPERTY_TYPES, LISTING_TYPES, LANGUAGES } from '@/lib/constants'
import { motion } from 'framer-motion'

interface StepIdentityProps {
  data: any
  updateData: (newData: any) => void
}

export default function StepIdentity({ data, updateData }: StepIdentityProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Listing Title</Label>
          <Input 
            placeholder="Ex: Modern 3-Bedroom Villa in Leopards Hill" 
            className="h-14 rounded-xl border-2 bg-secondary/10"
            value={data.title || ''}
            onChange={(e) => updateData({ title: e.target.value })}
          />
          <p className="text-[10px] text-muted-foreground italic font-medium">Max 120 characters. Auto-suggested based on type + location.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Listing Type</Label>
            <Select 
              value={data.listing_type} 
              onValueChange={(v) => updateData({ listing_type: v })}
            >
              <SelectTrigger className="h-14 rounded-xl border-2 bg-secondary/10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {LISTING_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Property Category</Label>
            <Select 
              value={data.property_type} 
              onValueChange={(v) => updateData({ property_type: v })}
            >
              <SelectTrigger className="h-14 rounded-xl border-2 bg-secondary/10">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Available From</Label>
            <Input 
              type="date"
              className="h-14 rounded-xl border-2 bg-secondary/10"
              value={data.available_from_date || ''}
              onChange={(e) => updateData({ available_from_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Listing Language</Label>
            <Select 
              value={data.language || 'en'} 
              onValueChange={(v) => updateData({ language: v })}
            >
              <SelectTrigger className="h-14 rounded-xl border-2 bg-secondary/10">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(l => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
