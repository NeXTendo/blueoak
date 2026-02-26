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
import { CURRENCIES } from '@/lib/constants'
import { motion } from 'framer-motion'

interface StepFinancialsProps {
  data: any
  updateData: (newData: any) => void
}

export default function StepFinancials({ data, updateData }: StepFinancialsProps) {
  const isSale = data.listing_type === 'sale'
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-widest">Currency</Label>
          <Select 
            value={data.currency} 
            onValueChange={(v) => updateData({ currency: v })}
          >
            <SelectTrigger className="h-14 rounded-xl border-2 bg-secondary/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(c => (
                <SelectItem key={c.code} value={c.code}>{c.code} ({c.symbol})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(isSale || isAuction) && (
          <div className="md:col-span-2 space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Asking Price</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="h-14 rounded-xl border-2 bg-secondary/10 font-bold"
              value={data.asking_price || ''}
              onChange={(e) => updateData({ asking_price: parseFloat(e.target.value) })}
            />
          </div>
        )}

        {(isRent || isLease) && (
          <div className="md:col-span-2 space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Monthly Rent</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="h-14 rounded-xl border-2 bg-secondary/10 font-bold"
              value={data.monthly_rent || ''}
              onChange={(e) => updateData({ monthly_rent: parseFloat(e.target.value) })}
            />
          </div>
        )}

        {isShortTerm && (
          <div className="md:col-span-2 space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest">Nightly Rate (Base)</Label>
            <Input 
              type="number" 
              placeholder="0.00" 
              className="h-14 rounded-xl border-2 bg-secondary/10 font-bold"
              value={data.nightly_rate || ''}
              onChange={(e) => updateData({ nightly_rate: parseFloat(e.target.value) })}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-3 p-4 bg-secondary/10 rounded-xl border-2 border-transparent hover:border-primary/20 transition-all">
          <Checkbox 
            id="negotiable" 
            checked={data.price_negotiable}
            onCheckedChange={(checked) => updateData({ price_negotiable: !!checked })}
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
            value={data.levy_fee || ''}
            onChange={(e) => updateData({ levy_fee: parseFloat(e.target.value) })}
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
