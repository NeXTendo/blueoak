import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { COUNTRIES } from '@/lib/constants'
import { motion } from 'framer-motion'

interface StepLocationProps {
  data: any
  updateData: (newData: any) => void
}

export default function StepLocation({ data, updateData }: StepLocationProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Country</Label>
          <Select 
            value={data.country} 
            onValueChange={(v) => updateData({ country: v })}
          >
            <SelectTrigger className="h-14 rounded-xl border-2 bg-secondary/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Province / State</Label>
          <Input 
            placeholder="Ex: Lusaka Province" 
            className="h-14 rounded-xl border-2 bg-secondary/10"
            value={data.province || ''}
            onChange={(e) => updateData({ province: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">City / Town</Label>
          <Input 
            placeholder="Ex: Lusaka" 
            className="h-14 rounded-xl border-2 bg-secondary/10"
            value={data.city || ''}
            onChange={(e) => updateData({ city: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Suburb / Neighbourhood</Label>
          <Input 
            placeholder="Ex: Leopards Hill" 
            className="h-14 rounded-xl border-2 bg-secondary/10"
            value={data.suburb || ''}
            onChange={(e) => updateData({ suburb: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Street Address</Label>
        <Input 
          placeholder="Ex: 123 BlueOak Drive" 
          className="h-14 rounded-xl border-2 bg-secondary/10"
          value={data.street_address || ''}
          onChange={(e) => updateData({ street_address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Zoning</Label>
          <Input 
            placeholder="Ex: R1" 
            className="h-12 rounded-xl border-2 bg-secondary/10"
            value={data.zoning || ''}
            onChange={(e) => updateData({ zoning: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Plot / Erf Number</Label>
          <Input 
            placeholder="Ex: 50/123/A" 
            className="h-12 rounded-xl border-2 bg-secondary/10"
            value={data.erf_number || ''}
            onChange={(e) => updateData({ erf_number: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Estate / Building</Label>
          <Input 
            placeholder="Ex: BlueOak Gated Estate" 
            className="h-12 rounded-xl border-2 bg-secondary/10"
            value={data.estate_name || ''}
            onChange={(e) => updateData({ estate_name: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest">Address Visibility</Label>
        <Select 
          value={data.display_address_option || 'full'} 
          onValueChange={(v) => updateData({ display_address_option: v })}
        >
          <SelectTrigger className="h-12 rounded-xl border-2 bg-secondary/10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Show Full Address</SelectItem>
            <SelectItem value="suburb">Show Suburb Only</SelectItem>
            <SelectItem value="city">Show City Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  )
}
