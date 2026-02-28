import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Building2, 
  MapPin, 
  LucideIcon, 
  ChevronRight, 
  ChevronLeft, 
  Check,
  Tag,
  Bed,
  Settings,
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

// Modular Steps
import StepIdentity from '@/components/forms/AddPropertyForm/StepIdentity'
import StepFinancials from '@/components/forms/AddPropertyForm/StepFinancials'
import StepLocation from '@/components/forms/AddPropertyForm/StepLocation'
import StepSpecifications from '@/components/forms/AddPropertyForm/StepSpecifications'
import StepAmenities from '@/components/forms/AddPropertyForm/StepAmenities'
import StepMedia from '@/components/forms/AddPropertyForm/StepMedia'
import StepReview from '@/components/forms/AddPropertyForm/StepReview'

type Step = {
  id: number
  title: string
  icon: LucideIcon
}

const STEPS: Step[] = [
  { id: 1, title: 'Identity', icon: Building2 },
  { id: 2, title: 'Financials', icon: Tag },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Specs', icon: Settings },
  { id: 5, title: 'Amenities', icon: Bed },
  { id: 6, title: 'Media', icon: ImageIcon },
  { id: 7, title: 'Review', icon: ShieldCheck },
]

export default function AddPropertyPage() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<any>({
    listing_type: 'sale',
    property_type: 'house',
    floor_area: '',
    currency: 'ZMW',
    price_zmw: '',
    price_usd: '',
    price_zar: '',
    price_kes: '',
    price_bwp: '',
    price_ngn: '',
    price_ghs: '',
    price_eur: '',
    price_gbp: '',
    monthly_rent: '',
    amenities: [],
    tags: [],
    status: 'pending',
    negotiable: false,
    pet_friendly: false,
    borehole: false,
    solar_power: false,
    generator: false,
    staff_quarters: false,
    address_private: false,
  })

  const updateData = (newData: any) => {
    setFormData((prev: any) => {
      const next = { ...prev, ...newData }
      // Auto-calculate price per sqft if possible
      if ((newData.asking_price || newData.floor_area) && next.asking_price && next.floor_area) {
        next.price_per_sqft = next.asking_price / next.floor_area
      }
      return next
    })
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleFinalSubmit = async () => {
    console.log('[AddPropertyPage] handleFinalSubmit initiated');
    if (!userId) {
      console.error('[AddPropertyPage] Submission blocked: User is not logged in.');
      toast.error('You must be logged in to list a property')
      return
    }

    try {
      setIsSubmitting(true)
      console.log('[AddPropertyPage] Preparing data payload...');
      
      const { media, documents, ...propertyData } = formData
      
      console.log('[AddPropertyPage] Calling create_property_listing RPC...');
      console.log('Payload:', { propertyData, media, documents });

      const { error } = await supabase.rpc('create_property_listing', {
        p_property_data: {
          ...propertyData,
          slug: (formData.title || 'untitled').toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Math.random().toString(36).substring(7),
          reference: 'BOA-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        },
        p_media: media || [],
        p_documents: documents || []
      } as any)

      console.log('[AddPropertyPage] RPC response received. Error:', error);

      if (error) throw error
      
      console.log('[AddPropertyPage] Submission successful.');
      toast.success('Property listing initiated for verification!')
      // Redirect to the property detail or my listings
      navigate(ROUTES.MESSAGES) // Or wherever appropriate, maybe /my-listings if it exists
    } catch (error: any) {
      console.error('[AddPropertyPage] Caught exception during submission:', error)
      toast.error(error.message || 'Failed to submit property. Please verify your data.')
    } finally {
      setIsSubmitting(false)
      console.log('[AddPropertyPage] handleFinalSubmit concluded.');
    }
  }

  const renderStep = () => {
    switch(currentStep) {
      case 1: return <StepIdentity data={formData} updateData={updateData} />
      case 2: return <StepFinancials data={formData} updateData={updateData} />
      case 3: return <StepLocation data={formData} updateData={updateData} />
      case 4: return <StepSpecifications data={formData} updateData={updateData} />
      case 5: return <StepAmenities data={formData} updateData={updateData} />
      case 6: return <StepMedia data={formData} updateData={updateData} />
      case 7: return <StepReview data={formData} />
      default: return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 md:pb-32">
      <header className="border-b border-secondary/50 py-10 md:py-16 bg-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 opacity-20 pointer-events-none" />
        <Container>
          <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-4">
                 <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary">Protocol Listing Agent</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-balance">Initialize Asset Index</h1>
              <p className="text-muted-foreground font-medium italic text-base md:text-lg">Scale your portfolio across the global BlueOak repository.</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-between relative pt-8 px-4">
              <div className="absolute top-[3.5rem] left-0 w-full h-0.5 bg-secondary/30 -translate-y-1/2 z-0 hidden sm:block" />
              <div 
                className="absolute top-[3.5rem] left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-700 ease-out hidden sm:block" 
                style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
              />
              
              {STEPS.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 md:gap-4">
                    <div className={cn(
                      "h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center border-2 md:border-4 transition-all duration-500",
                      isActive ? "bg-primary border-primary text-primary-foreground scale-110 shadow-[0_0_20px_rgba(var(--primary),0.3)]" : 
                      isCompleted ? "bg-primary border-primary text-primary-foreground" : 
                      "bg-background border-secondary text-muted-foreground/30"
                    )}>
                      {isCompleted ? <Check size={18} className="md:size-6" strokeWidth={3} /> : <Icon size={18} className="md:size-6" />}
                    </div>
                    <span className={cn(
                      "text-[7px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-colors hidden sm:block",
                      isActive ? "text-primary" : "text-muted-foreground/40"
                    )}>{step.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Container>
      </header>

      <main className="-mt-8 md:-mt-12 relative z-20">
        <Container>
          <div className="max-w-4xl mx-auto bg-background border border-secondary/50 md:border-2 rounded-[2rem] md:rounded-[4rem] p-6 md:p-16 shadow-premium relative backdrop-blur-xl">
             <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  {renderStep()}
                </motion.div>
             </AnimatePresence>

              <div className="flex flex-col sm:flex-row justify-between pt-8 md:pt-16 items-center gap-6 border-t border-secondary/30 mt-8 md:mt-16">
                <Button 
                  disabled={currentStep === 1 || isSubmitting}
                  variant="ghost" 
                  onClick={prevStep} 
                  className="h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs gap-4 hover:bg-secondary/20 transition-all disabled:opacity-0 w-full sm:w-auto"
                >
                   <ChevronLeft size={18} />
                   Revert Step
                </Button>

                {currentStep < STEPS.length ? (
                   <Button 
                     disabled={currentStep === 6 && formData._hasActiveUploads}
                     onClick={nextStep} 
                     className="h-12 md:h-16 px-8 md:px-12 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs gap-4 shadow-xl md:shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                   >
                      {currentStep === 6 && formData._hasActiveUploads ? 'Awaiting Uploads...' : `Proceed: ${STEPS[currentStep].title}`}
                      <ChevronRight size={18} />
                   </Button>
                ) : (
                   <Button 
                     disabled={isSubmitting}
                     onClick={handleFinalSubmit} 
                     className="h-14 md:h-20 px-10 md:px-16 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-xl md:shadow-2xl shadow-primary/30 flex-1 sm:ml-12 bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] w-full"
                   >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                           <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Syncing Repository...
                        </div>
                      ) : 'Confirm Global Listing'}
                   </Button>
                )}
             </div>
          </div>
        </Container>
      </main>
    </div>
  )
}
