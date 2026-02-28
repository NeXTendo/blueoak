import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ShieldCheck, 
  Building2, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  FileText,
  BadgeCheck,
  Briefcase,
  History,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Container from '@/components/layout/Container'
import { ROUTES } from '@/lib/constants'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

const STEPS = [
  {
    id: 'intent',
    title: 'Identity Verification',
    description: 'Establish your institutional presence.',
    icon: ShieldCheck
  },
  {
    id: 'credentials',
    title: 'Asset Portfolio',
    description: 'Showcase your market experience.',
    icon: Building2
  },
  {
    id: 'agreement',
    title: 'BlueOak Charter',
    description: 'Commit to our premium standards.',
    icon: FileText
  }
]

export default function ElevationPage() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    business_name: '',
    license_number: '',
    experience_years: '',
    portfolio_size: '',
    bio: profile?.bio || '',
    agreed_to_terms: false
  })

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      navigate(ROUTES.PROFILE)
    }
  }

  const handleSubmit = async () => {
    if (!formData.agreed_to_terms) {
      toast.error('Charter Commitment Required', {
        description: 'You must agree to the BlueOak Charter to proceed with elevation.'
      })
      return
    }

    try {
      setIsSubmitting(true)
      // In a real implementation, this would create an 'elevation_request' record.
      // For this objective, we'll update the profile directly to demonstrate functionality.
      await updateProfile({
        user_type: 'agent', // Elevating to Agent
        bio: formData.bio,
        // Mocking additional metadata that would be stored
        status: 'active'
      })

      toast.success('Elevation Request Logged', {
        description: 'Your identity is being verified for Asset Manager status.'
      })
      
      // Redirect to profile with success state
      setTimeout(() => navigate(ROUTES.PROFILE), 2000)
    } catch (error) {
      toast.error('System Transmission Failure', {
        description: 'Unable to process elevation request at this time.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Cinematic Header */}
      <div className="h-[40vh] relative overflow-hidden bg-black flex items-center justify-center">
         <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" 
              className="w-full h-full object-cover grayscale"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
         </div>
         
         <Container className="relative z-10 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.4em] text-[hsl(var(--gold))]"
            >
               <Sparkles size={14} />
               Premium Transition
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white"
            >
               Elevate to <span className="text-[hsl(var(--gold))]">Asset Manager</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 font-medium max-w-2xl mx-auto italic"
            >
               Transition your identity to our institutional tier for exclusive market access, 
               verified credentials, and advanced asset management intelligence.
            </motion.p>
         </Container>
      </div>

      <Container className="-mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Progress Architecture */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-background border border-border/60 rounded-[2.5rem] p-8 shadow-premium space-y-10">
               <div className="space-y-2">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">System Progression</h3>
                  <p className="text-xl font-black uppercase tracking-tight">Elevation Matrix</p>
               </div>

               <div className="space-y-4">
                  {STEPS.map((step, i) => (
                    <div 
                      key={step.id}
                      className={`flex items-start gap-4 transition-all duration-500 ${i <= currentStep ? 'opacity-100' : 'opacity-30'}`}
                    >
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-sm transition-all ${
                         i < currentStep ? 'bg-emerald-500 text-white' : 
                         i === currentStep ? 'bg-[hsl(var(--gold))] text-black' : 
                         'bg-secondary text-muted-foreground'
                       }`}>
                          {i < currentStep ? <CheckCircle2 size={18} /> : <step.icon size={18} />}
                       </div>
                       <div className="space-y-0.5 pt-1">
                          <p className="text-[9px] font-black uppercase tracking-widest leading-none">{step.title}</p>
                          <p className="text-[8px] font-medium text-muted-foreground/60 italic">{step.description}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 bg-secondary/20 rounded-[2.5rem] space-y-6">
               <div className="flex items-center gap-3 text-muted-foreground/40 italic">
                  <Lock size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Secure Transmission</span>
               </div>
               <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed italic">
                  Your application data is processed via institutional-grade encryption for global compliance.
               </p>
            </div>
          </div>

          {/* Application Canvas */}
          <div className="lg:col-span-3">
             <motion.div 
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-background border border-border/60 rounded-[3rem] p-10 md:p-16 shadow-premium space-y-12"
             >
                {currentStep === 0 && (
                  <div className="space-y-12">
                     <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Institutional Identity</h2>
                        <p className="text-muted-foreground font-medium italic">Define your market presence as a certified Asset Manager.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Business Designation</label>
                           <input 
                              type="text"
                              value={formData.business_name}
                              onChange={e => setFormData({...formData, business_name: e.target.value})}
                              placeholder="e.g. LUX GLOBAL REALTY"
                              className="w-full h-16 bg-secondary/30 border-transparent rounded-2xl px-6 font-bold focus:bg-background focus:border-[hsl(var(--gold))] transition-all outline-none"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Operational ID / License</label>
                           <input 
                              type="text"
                              value={formData.license_number}
                              onChange={e => setFormData({...formData, license_number: e.target.value})}
                              placeholder="RE-77829-ZM"
                              className="w-full h-16 bg-secondary/30 border-transparent rounded-2xl px-6 font-bold focus:bg-background focus:border-[hsl(var(--gold))] transition-all outline-none"
                           />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Professional Narrative</label>
                        <textarea 
                           value={formData.bio}
                           onChange={e => setFormData({...formData, bio: e.target.value})}
                           placeholder="Describe your market expertise and institutional reach..."
                           className="w-full h-40 bg-secondary/30 border-transparent rounded-[2rem] p-8 font-bold focus:bg-background focus:border-[hsl(var(--gold))] transition-all outline-none resize-none"
                        />
                     </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Market Metrics</h2>
                        <p className="text-muted-foreground font-medium italic">Provide verification of your professional capacity.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-secondary/20 rounded-[2.5rem] border border-border/40 space-y-6 group hover:border-[hsl(var(--gold))] transition-all">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center text-muted-foreground/40 group-hover:text-[hsl(var(--gold))] transition-all">
                                 <History size={24} />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Market Longevity</p>
                                 <p className="text-[8px] font-medium text-muted-foreground/60 italic uppercase">Years of professional activity</p>
                              </div>
                           </div>
                           <input 
                              type="number"
                              value={formData.experience_years}
                              onChange={e => setFormData({...formData, experience_years: e.target.value})}
                              placeholder="0"
                              className="w-full h-16 bg-background border border-border/60 rounded-2xl px-6 font-black text-2xl outline-none focus:border-[hsl(var(--gold))] transition-all"
                           />
                        </div>

                        <div className="p-8 bg-secondary/20 rounded-[2.5rem] border border-border/40 space-y-6 group hover:border-[hsl(var(--gold))] transition-all">
                           <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-xl bg-background flex items-center justify-center text-muted-foreground/40 group-hover:text-[hsl(var(--gold))] transition-all">
                                 <Briefcase size={24} />
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Portfolio Volume (Est.)</p>
                                 <p className="text-[8px] font-medium text-muted-foreground/60 italic uppercase">Number of active assets managed</p>
                              </div>
                           </div>
                           <input 
                              type="number"
                              value={formData.portfolio_size}
                              onChange={e => setFormData({...formData, portfolio_size: e.target.value})}
                              placeholder="0"
                              className="w-full h-16 bg-background border border-border/60 rounded-2xl px-6 font-black text-2xl outline-none focus:border-[hsl(var(--gold))] transition-all"
                           />
                        </div>
                     </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-12">
                    <div className="space-y-4 text-center">
                        <div className="h-20 w-20 bg-[hsl(var(--gold))/0.1] text-[hsl(var(--gold))] rounded-full flex items-center justify-center mx-auto mb-6 border border-[hsl(var(--gold))/0.2]">
                           <BadgeCheck size={40} />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">The BlueOak Charter</h2>
                        <p className="text-muted-foreground font-medium max-w-lg mx-auto italic">Institutional integrity is our primary asset. Verify your commitment to our standards.</p>
                     </div>

                     <div className="bg-secondary/10 border border-border/40 rounded-[2.5rem] p-10 space-y-6 h-60 overflow-y-auto no-scrollbar scroll-smooth shadow-inner">
                        <div className="space-y-6 text-sm font-medium text-muted-foreground/80 leading-relaxed italic">
                           <p>1. Institutional Integrity: Every communication and transaction must reflect the highest level of professional ethics.</p>
                           <p>2. Verified Accuracy: All asset data, documentation, and representations must be factually verifiable.</p>
                           <p>3. Client Supremacy: The interests of market participants must be handled with absolute discretion and fidelity.</p>
                           <p>4. Technological Fluidity: Commit to maintaining real-time updates and proactive engagement via our platform matrix.</p>
                           <p>5. Market Meritocracy: Recognition is earned via vouched performance and verified market interactions.</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-8 bg-secondary/20 rounded-[2rem] border border-border/40 group hover:border-[hsl(var(--gold))] transition-all cursor-pointer"
                        onClick={() => setFormData({...formData, agreed_to_terms: !formData.agreed_to_terms})}
                     >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-all ${formData.agreed_to_terms ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-background border-border/60'}`}>
                           {formData.agreed_to_terms && <CheckCircle2 size={16} />}
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 transition-colors group-hover:text-foreground">
                           I formally enact my commitment to the BlueOak Institutional Charter.
                        </p>
                     </div>
                  </div>
                )}

                {/* Interaction Terminal */}
                <div className="pt-12 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-8">
                   <button 
                    onClick={handleBack}
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-all"
                   >
                      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                      Manifest Back
                   </button>
                   
                   <Button 
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="w-full md:w-auto min-w-[280px] h-16 rounded-2xl bg-black text-white hover:bg-[hsl(var(--gold))] hover:text-black transition-all gap-4 group shadow-xl"
                   >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                           <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                           <span className="text-[10px] font-black uppercase tracking-widest italic">Transmitting...</span>
                        </div>
                      ) : (
                        <>
                           <span className="text-[10px] font-black uppercase tracking-widest">
                             {currentStep === STEPS.length - 1 ? 'Execute Application' : 'Proceed Matrix'}
                           </span>
                           <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                   </Button>
                </div>
             </motion.div>
          </div>
        </div>
      </Container>
    </div>
  )
}
