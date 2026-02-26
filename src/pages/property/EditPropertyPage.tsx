import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Building2, 
  MapPin, 
  LucideIcon, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Tag,
  Bed,
  Bath,
  Maximize2,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { PROPERTY_TYPES, LISTING_TYPES, ROUTES } from '@/lib/constants'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

type Step = {
  id: number
  title: string
  icon: LucideIcon
}

const STEPS: Step[] = [
  { id: 1, title: 'Basics', icon: Building2 },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Features', icon: Bed },
  { id: 4, title: 'Pricing', icon: Tag },
  { id: 5, title: 'Review', icon: Check },
]

export default function EditPropertyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState<any>({
    listing_type: 'sale',
    property_type: 'house',
    currency: 'USD',
    amenities: [],
  })

  useEffect(() => {
    async function fetchProperty() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id || '')
          .single()

        if (error) throw error
        
        const property = data as any
        // Security check: ensure user owns this property
        if (property.seller_id !== userId) {
           toast.error('Unauthorized access to this asset record.')
           navigate(ROUTES.HOME)
           return
        }

        setFormData(property)
      } catch (error) {
        console.error('Error fetching property:', error)
        toast.error('Failed to load asset record')
      } finally {
        setIsLoading(false)
      }
    }

    if (id && userId) fetchProperty()
  }, [id, userId, navigate])

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true)
      const { error } = await supabase
        .from('properties')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id || '')

      if (error) throw error
      
      toast.success('Asset repository updated successfully!')
      navigate(`${ROUTES.PROPERTY_DETAIL}/${formData.slug}`)
    } catch (error) {
      console.error('Error updating property:', error)
      toast.error('Failed to update asset. Protocol error.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
         <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground animate-pulse">Syncing Repository Data...</p>
         </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="border-b border-secondary/50 py-12 bg-secondary/5">
        <Container>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-2 text-center text-primary">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Modify Asset Matrix</h1>
              <p className="text-muted-foreground font-medium italic">Updating record <span className="text-primary font-bold">#{formData.reference}</span> in global registry.</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-between relative pt-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -translate-y-1/2 z-0" />
              {STEPS.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500",
                      isActive ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg" : 
                      isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                      "bg-background border-secondary text-muted-foreground"
                    )}>
                      {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                    </div>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground/40"
                    )}>{step.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </header>

      <main className="py-16">
        <Container>
          <div className="max-w-3xl mx-auto bg-background border border-secondary rounded-[3rem] p-12 shadow-premium relative">
             <AnimatePresence mode="wait">
               {currentStep === 1 && (
                 <motion.div 
                   key="step1"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Asset Title</Label>
                         <Input 
                           placeholder="Ex: Modern 3-Bedroom Villa in Leopards Hill" 
                           className="h-14 rounded-xl border-2 bg-secondary/10 font-bold"
                           value={formData.title}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}
                         />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Listing Type</Label>
                            <Select 
                              value={formData.listing_type} 
                              onValueChange={(v) => setFormData({...formData, listing_type: v})}
                            >
                               <SelectTrigger className="h-14 rounded-xl border-2 bg-secondary/10 font-bold">
                                  <SelectValue />
                               </SelectTrigger>
                               <SelectContent>
                                  {LISTING_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                               </SelectContent>
                            </Select>
                         </div>
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Asset Category</Label>
                            <Select 
                              value={formData.property_type} 
                              onValueChange={(v) => setFormData({...formData, property_type: v})}
                            >
                               <SelectTrigger className="h-14 rounded-xl border-2 bg-secondary/10 font-bold">
                                  <SelectValue />
                               </SelectTrigger>
                               <SelectContent>
                                  {PROPERTY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                               </SelectContent>
                            </Select>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Narrative Archive</Label>
                         <Textarea 
                            placeholder="Detail the unique attributes..." 
                            className="min-h-[200px] rounded-2xl border-2 bg-secondary/10 p-6 font-medium"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                         />
                      </div>
                   </div>

                   <div className="flex justify-end pt-6">
                      <Button onClick={nextStep} className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                         Next: Geospatial
                         <ChevronRight size={16} />
                      </Button>
                   </div>
                 </motion.div>
               )}

               {currentStep === 2 && (
                 <motion.div 
                   key="step2"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Republic / Region</Label>
                             <Input 
                                placeholder="Zambia" 
                                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold"
                                value={formData.country}
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">City / Zone</Label>
                             <Input 
                                placeholder="Lusaka" 
                                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                             />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Geospatial Address</Label>
                          <Input 
                             placeholder="Ex: Plot 123, Leopards Hill Road" 
                             className="h-14 rounded-xl border-2 bg-secondary/10 font-bold"
                             value={formData.address}
                             onChange={(e) => setFormData({...formData, address: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="flex justify-between pt-6">
                       <Button variant="secondary" onClick={prevStep} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                          <ChevronLeft size={16} />
                          Previous
                       </Button>
                       <Button onClick={nextStep} className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                          Next: Core Vectors
                          <ChevronRight size={16} />
                       </Button>
                    </div>
                 </motion.div>
               )}

               {currentStep === 3 && (
                 <motion.div 
                   key="step3"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                    <div className="space-y-8">
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          <div className="space-y-2 text-primary">
                             <div className="flex items-center gap-2 mb-1">
                                <Bed size={14} />
                                <Label className="text-[10px] font-black uppercase tracking-widest">Bedrooms</Label>
                             </div>
                             <Input 
                               type="number" 
                               className="h-14 rounded-xl border-2 bg-secondary/10 font-black text-lg"
                               value={formData.bedrooms}
                               onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                             />
                          </div>
                          <div className="space-y-2 text-primary">
                             <div className="flex items-center gap-2 mb-1">
                                <Bath size={14} />
                                <Label className="text-[10px] font-black uppercase tracking-widest">Bathrooms</Label>
                             </div>
                             <Input 
                               type="number" 
                               className="h-14 rounded-xl border-2 bg-secondary/10 font-black text-lg"
                               value={formData.bathrooms}
                               onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                             />
                          </div>
                          <div className="space-y-2 text-primary">
                             <div className="flex items-center gap-2 mb-1">
                                <Maximize2 size={14} />
                                <Label className="text-[10px] font-black uppercase tracking-widest">Square Meters</Label>
                             </div>
                             <Input 
                               type="number" 
                               className="h-14 rounded-xl border-2 bg-secondary/10 font-black text-lg"
                               value={formData.floor_area}
                               onChange={(e) => setFormData({...formData, floor_area: parseInt(e.target.value)})}
                             />
                          </div>
                       </div>

                       <Separator />

                       <div className="space-y-4">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Asset Amenities</Label>
                          <div className="grid grid-cols-2 gap-4">
                             {['Borehole', 'Solar Power', 'Swimming Pool', 'Security Guard', 'Pet Friendly', 'Fibre Installed'].map((amenity) => (
                               <div key={amenity} className="flex items-center space-x-3 group cursor-pointer bg-secondary/10 p-4 rounded-xl border-2 border-transparent transition-all hover:border-primary/20">
                                 <Checkbox 
                                   id={amenity} 
                                   checked={formData.amenities?.includes(amenity)}
                                   className="h-5 w-5 rounded-md border-2" 
                                   onCheckedChange={(checked) => {
                                      const current = formData.amenities || []
                                      if (checked) setFormData({...formData, amenities: [...current, amenity]})
                                      else setFormData({...formData, amenities: current.filter((a: string) => a !== amenity)})
                                   }}
                                 />
                                 <label htmlFor={amenity} className="text-xs font-bold leading-none cursor-pointer uppercase tracking-tight text-foreground/70">
                                   {amenity}
                                 </label>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="flex justify-between pt-6">
                       <Button variant="secondary" onClick={prevStep} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                          <ChevronLeft size={16} />
                          Previous
                       </Button>
                       <Button onClick={nextStep} className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                          Next: Valuation
                          <ChevronRight size={16} />
                       </Button>
                    </div>
                 </motion.div>
               )}

               {currentStep === 4 && (
                 <motion.div 
                   key="step4"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                 >
                    <div className="space-y-8 text-center pb-4 text-primary">
                       <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-3xl">💹</div>
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black tracking-tight uppercase">Valuation Adjustment</h3>
                          <p className="text-muted-foreground text-sm font-medium italic">Adjust the market valuation and liquidity terms.</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="grid grid-cols-[120px_1fr] gap-6">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Currency</Label>
                             <Select value={formData.currency} onValueChange={(v) => setFormData({...formData, currency: v})}>
                                <SelectTrigger className="h-14 rounded-xl border-2 bg-secondary/10 font-bold">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="USD">USD</SelectItem>
                                   <SelectItem value="ZMW">ZMW</SelectItem>
                                   <SelectItem value="ZAR">ZAR</SelectItem>
                                   <SelectItem value="KES">KES</SelectItem>
                                   <SelectItem value="NGN">NGN</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Asking Price</Label>
                             <Input 
                                type="number" 
                                placeholder="0.00" 
                                className="h-14 rounded-xl border-2 bg-secondary/10 font-bold text-xl text-primary"
                                value={formData.asking_price}
                                onChange={(e) => setFormData({...formData, asking_price: parseFloat(e.target.value)})}
                             />
                          </div>
                       </div>

                       <div className="flex items-center space-x-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                          <Checkbox 
                             id="negotiable" 
                             checked={formData.negotiable}
                             onCheckedChange={(checked) => setFormData({...formData, negotiable: !!checked})}
                          />
                          <Label htmlFor="negotiable" className="text-sm font-bold cursor-pointer text-primary">Price Negotiable Protocol Enabled</Label>
                       </div>
                    </div>

                    <div className="flex justify-between pt-6">
                       <Button variant="secondary" onClick={prevStep} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                          <ChevronLeft size={16} />
                          Previous
                       </Button>
                       <Button onClick={nextStep} className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                          Next: Review Changes
                          <ChevronRight size={16} />
                       </Button>
                    </div>
                 </motion.div>
               )}

               {currentStep === 5 && (
                 <motion.div 
                   key="step5"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-10"
                 >
                    <div className="space-y-8">
                       <div className="text-center space-y-2">
                          <h3 className="text-2xl font-black tracking-tight uppercase text-primary">Protocol Confirmation</h3>
                          <p className="text-muted-foreground text-sm font-medium italic">Verify adjustments before committing to the global registry.</p>
                       </div>

                       <div className="space-y-4 p-8 bg-secondary/10 rounded-[2rem] border-2 border-secondary/50">
                          <div className="flex justify-between items-center text-sm">
                             <span className="font-black uppercase tracking-widest text-muted-foreground/40 text-[10px]">Asset Record</span>
                             <span className="font-bold">#{formData.reference}</span>
                          </div>
                          <Separator className="bg-secondary/50" />
                          <div className="flex justify-between items-center text-sm">
                             <span className="font-black uppercase tracking-widest text-muted-foreground/40 text-[10px]">Updated Valuation</span>
                             <span className="font-bold text-primary">{formData.currency} {formData.asking_price?.toLocaleString()}</span>
                          </div>
                          <Separator className="bg-secondary/50" />
                          <div className="flex justify-between items-center text-sm">
                             <span className="font-black uppercase tracking-widest text-muted-foreground/40 text-[10px]">Title Archive</span>
                             <span className="font-bold">{formData.title}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex justify-between pt-6">
                       <Button variant="secondary" onClick={prevStep} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                          <ChevronLeft size={16} />
                          Previous
                       </Button>
                       <Button 
                         disabled={isSubmitting}
                         onClick={handleUpdate} 
                         className="h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 flex-1 ml-4"
                       >
                          {isSubmitting ? 'Updating Repository...' : 'Commit Matrix Adjustments'}
                       </Button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </Container>
      </main>
    </div>
  )
}
