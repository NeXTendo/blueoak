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
import { motion } from 'framer-motion'

interface StepFinancialsProps {
  data: any
  updateData: (newData: any) => void
}

export default function StepFinancials({ data, updateData }: StepFinancialsProps) {
  const isAuction = data.listing_type === 'auction'
  const isRent = data.listing_type === 'rent'
  const isShortTerm = data.listing_type === 'short_term'
  const isLease = data.listing_type === 'lease'

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-[12px] font-black uppercase tracking-widest text-primary">Core Valuation (Required)</Label>
          <p className="text-[10px] text-muted-foreground font-medium italic">
            To ensure precise analytics and eliminate conversion errors, please provide the {isRent || isLease ? 'monthly rent' : isShortTerm ? 'nightly rate' : 'asking price'} explicitly in all supported currencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ZMW (Zambian Kwacha)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">ZK</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-12"
                value={data.price_zmw || ''}
                onChange={(e) => updateData({ price_zmw: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">USD (US Dollar)</Label>
            <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-10"
                value={data.price_usd || ''}
                onChange={(e) => updateData({ price_usd: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ZAR (South African Rand)</Label>
            <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">R</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-10"
                value={data.price_zar || ''}
                onChange={(e) => updateData({ price_zar: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">KES (Kenyan Shilling)</Label>
            <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/80 text-xs">KSh</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-12"
                value={data.price_kes || ''}
                onChange={(e) => updateData({ price_kes: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">BWP (Botswana Pula)</Label>
            <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">P</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-10"
                value={data.price_bwp || ''}
                onChange={(e) => updateData({ price_bwp: parseFloat(e.target.value) })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">NGN (Nigerian Naira)</Label>
            <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/80 text-xs">₦</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-10"
                value={data.price_ngn || ''}
                onChange={(e) => updateData({ price_ngn: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GHS (Ghanaian Cedi)</Label>
            <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/80 text-xs">GH₵</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-12"
                value={data.price_ghs || ''}
                onChange={(e) => updateData({ price_ghs: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">EUR (Euro)</Label>
            <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/80 text-xs">€</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-10"
                value={data.price_eur || ''}
                onChange={(e) => updateData({ price_eur: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">GBP (British Pound)</Label>
            <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/80 text-xs">£</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold pl-10"
                value={data.price_gbp || ''}
                onChange={(e) => updateData({ price_gbp: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-3 p-4 bg-secondary/10 rounded-xl border-2 border-transparent hover:border-primary/20 transition-all">
          <Checkbox 
            id="negotiable" 
            checked={data.negotiable}
            onCheckedChange={(checked) => updateData({ negotiable: !!checked })}
          />
          <Label htmlFor="negotiable" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">Negotiable</Label>
        </div>
        
        <div className="space-y-2 flex-1 min-w-[200px]">
          <Label className="text-[10px] font-black uppercase tracking-widest">Price Display</Label>
          <Select 
            value={data.price_display_option || 'show'} 
            onValueChange={(v) => updateData({ price_display_option: v })}
          >
            <SelectTrigger className="h-10 rounded-lg border-2 bg-secondary/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="show">Show Price</SelectItem>
              <SelectItem value="contact">Contact for Price</SelectItem>
              <SelectItem value="on_application">On Application</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Conditional Detailed Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isRent && (
          <>
            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest">Security Deposit (Months)</Label>
               <Input 
                  type="number" 
                  step="0.5" 
                  className="h-12 rounded-xl border-2 bg-secondary/10"
                  value={data.deposit || ''}
                  onChange={(e) => updateData({ deposit: parseFloat(e.target.value) })}
               />
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest">Annual Escalation %</Label>
               <Input 
                  type="number" 
                  className="h-12 rounded-xl border-2 bg-secondary/10"
                  value={data.annual_escalation_pct || ''}
                  onChange={(e) => updateData({ annual_escalation_pct: parseFloat(e.target.value) })}
               />
            </div>
          </>
        )}

        {isShortTerm && (
          <>
            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest">Weekend Rate</Label>
               <Input 
                  type="number" 
                  className="h-12 rounded-xl border-2 bg-secondary/10"
                  value={data.weekend_rate || ''}
                  onChange={(e) => updateData({ weekend_rate: parseFloat(e.target.value) })}
               />
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest">Cleaning Fee</Label>
               <Input 
                  type="number" 
                  className="h-12 rounded-xl border-2 bg-secondary/10"
                  value={data.cleaning_fee || ''}
                  onChange={(e) => updateData({ cleaning_fee: parseFloat(e.target.value) })}
               />
            </div>
          </>
        )}

        {isAuction && (
          <>
            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest">Reserve Price (Hidden)</Label>
               <Input 
                  type="number" 
                  className="h-12 rounded-xl border-2 bg-secondary/10 font-bold border-primary/20"
                  value={data.reserve_price || ''}
                  onChange={(e) => updateData({ reserve_price: parseFloat(e.target.value) })}
               />
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest">Bid Increment</Label>
               <Input 
                  type="number" 
                  className="h-12 rounded-xl border-2 bg-secondary/10"
                  value={data.bid_increment || ''}
                  onChange={(e) => updateData({ bid_increment: parseFloat(e.target.value) })}
               />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Monthly Levy / HOA</Label>
          <Input 
            type="number" 
            className="h-12 rounded-xl border-2 bg-secondary/10"
            value={data.levy || ''}
            onChange={(e) => updateData({ levy: parseFloat(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Rates & Taxes (Approx)</Label>
          <Input 
            type="number" 
            className="h-12 rounded-xl border-2 bg-secondary/10"
            value={data.rates_taxes || ''}
            onChange={(e) => updateData({ rates_taxes: parseFloat(e.target.value) })}
          />
        </div>
      </div>
    </motion.div>
  )
}
