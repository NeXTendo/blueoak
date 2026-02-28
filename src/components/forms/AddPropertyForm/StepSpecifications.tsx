import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Bed, Bath, Maximize2, Car, Warehouse, Home, Droplets, Sun, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface StepSpecificationsProps {
  data: any
  updateData: (newData: any) => void
}

export default function StepSpecifications({ data, updateData }: StepSpecificationsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10"
    >
      {/* ── Residential Basics ────────────────────────────────────── */}
      <div className="space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Residential Configuration</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                 <Bed size={14} className="text-primary" />
                 <Label className="text-[10px] font-black uppercase tracking-widest">Bedrooms</Label>
              </div>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.bedrooms || ''}
                onChange={(e) => updateData({ bedrooms: parseInt(e.target.value) })}
              />
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                 <Bath size={14} className="text-primary" />
                 <Label className="text-[10px] font-black uppercase tracking-widest">Bathrooms</Label>
              </div>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.bathrooms || ''}
                onChange={(e) => updateData({ bathrooms: parseInt(e.target.value) })}
              />
           </div>
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Ensuites</Label>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.ensuites || ''}
                onChange={(e) => updateData({ ensuites: parseInt(e.target.value) })}
              />
           </div>
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Toilets</Label>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.toilets || ''}
                onChange={(e) => updateData({ toilets: parseInt(e.target.value) })}
              />
           </div>
        </div>
      </div>

      <Separator />

      {/* ── Space & Area ─────────────────────────────────────────── */}
      <div className="space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Dimensional Data</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                 <Maximize2 size={14} className="text-primary" />
                 <Label className="text-[10px] font-black uppercase tracking-widest">Floor Area (sqm)</Label>
              </div>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.floor_area || ''}
                onChange={(e) => updateData({ floor_area: parseInt(e.target.value) })}
              />
           </div>
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Lot / Stand Size (sqm)</Label>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.lot_area || ''}
                onChange={(e) => updateData({ lot_area: parseInt(e.target.value) })}
              />
           </div>
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Garden Area (sqm)</Label>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.garden_area || ''}
                onChange={(e) => updateData({ garden_area: parseInt(e.target.value) })}
              />
           </div>
        </div>
      </div>

      <Separator />

      {/* ── Parking & Storage ────────────────────────────────────── */}
      <div className="space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Parking & Logistics</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                 <Warehouse size={14} className="text-primary" />
                 <Label className="text-[10px] font-black uppercase tracking-widest">Garages</Label>
              </div>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.garages || ''}
                onChange={(e) => updateData({ garages: parseInt(e.target.value) })}
              />
           </div>
           <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                 <Car size={14} className="text-primary" />
                 <Label className="text-[10px] font-black uppercase tracking-widest">Parking Bays</Label>
              </div>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.parking || ''}
                onChange={(e) => updateData({ parking: parseInt(e.target.value) })}
              />
           </div>
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Carports</Label>
              <Input 
                type="number" 
                className="h-12 rounded-xl border-2 bg-secondary/10"
                value={data.carports || ''}
                onChange={(e) => updateData({ carports: parseInt(e.target.value) })}
              />
           </div>
        </div>
      </div>

      <Separator />

      {/* ── Condition & Structure ────────────────────────────────── */}
      <div className="space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Structure & Condition</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Property Condition</Label>
              <Select 
                value={data.condition || 'excellent'} 
                onValueChange={(v) => updateData({ condition: v })}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 bg-secondary/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Build</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="needs_reno">Needs Renovation</SelectItem>
                </SelectContent>
              </Select>
           </div>
           <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest">Furnishing Status</Label>
              <Select 
                value={data.furnishing || 'unfurnished'} 
                onValueChange={(v) => updateData({ furnishing: v })}
              >
                <SelectTrigger className="h-12 rounded-xl border-2 bg-secondary/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                  <SelectItem value="semi_furnished">Semi-Furnished</SelectItem>
                  <SelectItem value="fully_furnished">Fully Furnished</SelectItem>
                </SelectContent>
              </Select>
           </div>
        </div>
      </div>

      <Separator />

      {/* ── Technical Infrastructure ───────────────────────────── */}
      <div className="space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Critical Infrastructure</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex items-center space-x-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl group transition-all hover:bg-blue-500/10">
             <Droplets className="text-blue-500" size={18} />
             <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="borehole" 
                     checked={data.borehole}
                     onCheckedChange={(checked) => updateData({ borehole: !!checked })}
                   />
                   <Label htmlFor="borehole" className="text-xs font-bold uppercase tracking-tight cursor-pointer">Borehole / Well</Label>
                </div>
                {data.borehole && (
                  <Input 
                    placeholder="Tank Capacity (litres)" 
                    type="number"
                    className="h-10 text-[10px] bg-white/50"
                    value={data.water_tank_capacity || ''}
                    onChange={(e) => updateData({ water_tank_capacity: parseInt(e.target.value) })}
                  />
                )}
             </div>
           </div>

           <div className="flex items-center space-x-3 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl group transition-all hover:bg-yellow-500/10">
             <Sun className="text-yellow-600" size={18} />
             <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="solar" 
                     checked={data.solar_power}
                     onCheckedChange={(checked) => updateData({ solar_power: !!checked })}
                   />
                   <Label htmlFor="solar" className="text-xs font-bold uppercase tracking-tight cursor-pointer">Solar Panel System</Label>
                </div>
                {data.solar_power && (
                  <Input 
                    placeholder="Capacity (kW)" 
                    type="number"
                    className="h-10 text-[10px] bg-white/50"
                    value={data.solar_panel_capacity || ''}
                    onChange={(e) => updateData({ solar_panel_capacity: parseFloat(e.target.value) })}
                  />
                )}
             </div>
           </div>

           <div className="flex items-center space-x-3 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl group transition-all hover:bg-orange-500/10">
             <Zap className="text-orange-600" size={18} />
             <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="generator" 
                     checked={data.generator}
                     onCheckedChange={(checked) => updateData({ generator: !!checked })}
                   />
                   <Label htmlFor="generator" className="text-xs font-bold uppercase tracking-tight cursor-pointer">Generator / Inverter</Label>
                </div>
                {data.generator && (
                  <Input 
                    placeholder="Capacity (kVA)" 
                    type="number"
                    className="h-10 text-[10px] bg-white/50"
                    value={data.generator_capacity || ''}
                    onChange={(e) => updateData({ generator_capacity: parseFloat(e.target.value) })}
                  />
                )}
             </div>
           </div>

           <div className="flex items-center space-x-3 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl group transition-all hover:bg-green-500/10">
             <Home className="text-green-600" size={18} />
             <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                   <Checkbox 
                     id="staff_quarters" 
                     checked={data.staff_quarters}
                     onCheckedChange={(checked) => updateData({ staff_quarters: !!checked })}
                   />
                   <Label htmlFor="staff_quarters" className="text-xs font-bold uppercase tracking-tight cursor-pointer">Staff Quarters</Label>
                </div>
             </div>
           </div>
        </div>
      </div>
    </motion.div>
  )
}
