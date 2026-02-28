import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  Bell, 
  Lock, 
  Languages, 
  Coins, 
  Moon, 
  Sun, 
  Trash2,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  LayoutGrid,
  History,
  AlertCircle,
  X,
  CreditCard,
  FileText
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CURRENCIES, LANGUAGES } from '@/lib/constants'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { profile, updateProfile, updatePassword, hibernateAccount, deleteAccount, session } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'light' | 'dark'>(profile?.dark_mode ? 'dark' : 'light')
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<'hibernate' | 'erase' | null>(null)
  
  // Update theme state when profile loads
  useEffect(() => {
    if (profile) setTheme(profile.dark_mode ? 'dark' : 'light')
  }, [profile])

  const handleUpdateSetting = async (key: string, value: any) => {
    try {
      setIsUpdating(true)
      await updateProfile({ [key]: value })
      toast.success('Strategy Updated', {
        description: `Your ${key.replace(/_/g, ' ')} preferences have been synchronized.`
      })
    } catch (err) {
      toast.error('Synchronization Failure', {
        description: 'Failed to update system parameters. Protocol breach detected.'
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordUpdate = async () => {
    const newPass = prompt('Enter new access key:')
    if (!newPass) return
    try {
      await updatePassword(newPass)
      toast.success('Credential Rotation Complete', {
        description: 'Identity Firewall has been updated with your new access key.'
      })
    } catch (err) {
      toast.error('Security Breach', {
        description: 'Failed to update credentials. Access denied.'
      })
    }
  }

  const sections = [
    {
      id: 'notifications',
      title: 'Alert Protocol',
      desc: 'Market intelligence and communication triggers.',
      icon: Bell,
      items: [
        { 
          id: 'email_notifications', 
          label: 'Email Intelligence', 
          desc: 'Market reports and asset updates.', 
          checked: profile?.email_notifications ?? true 
        },
        { 
          id: 'push_notifications', 
          label: 'Direct Alerts', 
          desc: 'Real-time push notifications.', 
          checked: profile?.push_notifications ?? true 
        },
        { 
          id: 'message_notifications', 
          label: 'Communication Hub', 
          desc: 'Inquiry and message alerts.', 
          checked: profile?.message_notifications ?? true 
        },
      ]
    },
    {
      id: 'security',
      title: 'Security Clearance',
      desc: 'Identity shielding and access management.',
      icon: Lock,
      actions: [
        { 
          label: 'Identity Firewall', 
          desc: 'Rotate your access credentials.', 
          icon: ShieldCheck,
          onClick: handlePasswordUpdate 
        },
        { 
          label: 'Two-Factor Shield', 
          desc: 'Enhanced biometric/token security.', 
          icon: Smartphone,
          status: 'Active',
          onClick: () => toast.info('Advanced security already active.') 
        },
        { 
          label: 'Session Matrix', 
          desc: 'Review 1 active access point.', 
          icon: History,
          onClick: () => toast.info(`Current session: ${session?.user.email} from ${window.location.host}`) 
        },
      ]
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background pb-40">
      {/* Precision Control Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border/40 py-6 md:py-10">
        <Container className="flex items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)} 
              title="Return to Identity"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-all"
            >
              <ChevronLeft size={20} className="md:w-6 md:h-6" />
            </button>
            <div className="space-y-0.5 md:space-y-1">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[hsl(var(--gold))] italic">System Configuration</span>
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">Settings</h1>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-secondary/30 rounded-full border border-border/40">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">System Synchronized</span>
          </div>
        </Container>
      </header>

      <main className="pt-10 md:pt-20">
        <Container className="max-w-4xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-20 md:space-y-32"
          >
            
            {/* Asset Manager Elevation CTA */}
            {profile?.user_type === 'buyer' && (
              <section className="bg-[hsl(var(--gold))] text-black rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-premium relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-bl-[10rem] translate-x-20 -translate-y-20 transition-transform group-hover:scale-110" />
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 items-center">
                    <div className="space-y-4">
                       <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-4 py-1.5 rounded-full">Available Promotion</span>
                       <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight italic">Scale your portfolio. <br />Elevate to Asset Manager.</h2>
                       <p className="text-sm font-medium opacity-70 leading-relaxed max-w-md">
                         Unlock institutional-grade listing tools, professional verification, and priority market placement.
                       </p>
                    </div>
                    <button className="h-16 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                       Apply Now
                    </button>
                  </div>
              </section>
            )}

            {/* Notification & Security Sections */}
            {sections.map((section) => (
              <section key={section.id} className="space-y-8 md:space-y-12">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-[1px] w-8 bg-[hsl(var(--gold))]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">{section.title}</span>
                    </div>
                    <p className="text-xs font-medium text-muted-foreground/60 italic">{section.desc}</p>
                  </div>
                </div>

                <div className="bg-background border border-border/60 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-premium transition-colors hover:border-border">
                  <div className="divide-y divide-border/40">
                    {section.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-8 md:p-12 hover:bg-secondary/10 transition-colors">
                        <div className="space-y-2">
                          <label className="text-lg md:text-xl font-black uppercase tracking-tight block">{item.label}</label>
                          <p className="text-[10px] md:text-xs font-medium text-muted-foreground/40 leading-relaxed">{item.desc}</p>
                        </div>
                        <Switch 
                          checked={item.checked} 
                          onCheckedChange={(val) => handleUpdateSetting(item.id, val)}
                          className="data-[state=checked]:bg-[hsl(var(--gold))] scale-110 md:scale-125" 
                        />
                      </div>
                    ))}
                    {section.actions?.map((action) => (
                      <button 
                        key={action.label} 
                        onClick={action.onClick}
                        title={`Execute ${action.label}`}
                        className="w-full flex items-center justify-between p-8 md:p-12 hover:bg-secondary/30 transition-all text-left group"
                      >
                        <div className="flex items-center gap-6 md:gap-8">
                           <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-[hsl(var(--gold))] group-hover:scale-110 transition-transform">
                              <action.icon size={24} />
                           </div>
                           <div className="space-y-1 md:space-y-2">
                              <div className="text-lg md:text-xl font-black uppercase tracking-tight">{action.label}</div>
                              <p className="text-[10px] md:text-xs font-medium text-muted-foreground/40">{action.desc}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           {action.status && (
                             <span className="hidden md:inline-flex text-[10px] font-black uppercase tracking-widest text-[hsl(var(--gold))] px-4 py-1.5 bg-[hsl(var(--gold)/0.1)] rounded-full">
                                {action.status}
                             </span>
                           )}
                           <ChevronRight size={24} className="text-muted-foreground/40 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            ))}

            {/* Environmental Preferences */}
            <section className="space-y-12">
               <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-[hsl(var(--gold))]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Universal Parameters</span>
               </div>
              <div className="bg-background border border-border/60 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 space-y-12 md:space-y-16 shadow-premium">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Language */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-[hsl(var(--gold))] group-hover:rotate-12 transition-transform">
                        <Languages size={24} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-lg md:text-xl font-black uppercase tracking-tight">Intelligence Dialect</label>
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground/40">System language preference.</p>
                      </div>
                    </div>
                    <Select 
                      defaultValue={profile?.preferred_language || 'en'}
                      onValueChange={(val) => handleUpdateSetting('preferred_language', val)}
                    >
                      <SelectTrigger className="w-32 md:w-40 h-12 md:h-16 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border-2 border-border/40 bg-transparent focus:ring-primary shadow-sm hover:border-[hsl(var(--gold)/50)] transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-2 border-secondary shadow-2xl font-black text-[10px] uppercase tracking-widest">
                        {LANGUAGES.map((lang: any) => (
                          <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-[hsl(var(--gold))] group-hover:rotate-12 transition-transform">
                        <Coins size={24} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-lg md:text-xl font-black uppercase tracking-tight">Economic Unit</label>
                        <p className="text-[10px] md:text-xs font-medium text-muted-foreground/40">Asset valuation currency.</p>
                      </div>
                    </div>
                    <Select 
                       defaultValue={profile?.preferred_currency || 'ZMW'}
                       onValueChange={(val) => handleUpdateSetting('preferred_currency', val)}
                    >
                      <SelectTrigger className="w-32 md:w-40 h-12 md:h-16 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border-2 border-border/40 bg-transparent focus:ring-primary shadow-sm hover:border-[hsl(var(--gold)/50)] transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-2 border-secondary shadow-2xl font-black text-[10px] uppercase tracking-widest">
                        {CURRENCIES.map(curr => (
                          <SelectItem key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="bg-border/40" />

                {/* Theme Toggle */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-[hsl(var(--gold))]">
                      {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                    </div>
                    <div className="space-y-1">
                      <label className="text-lg md:text-xl font-black uppercase tracking-tight">Visual Spectrum</label>
                      <p className="text-[10px] md:text-xs font-medium text-muted-foreground/40 italic">Luminance mode toggle.</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-secondary/20 p-2 rounded-2xl border border-border/40">
                     <button 
                      onClick={() => { setTheme('light'); handleUpdateSetting('dark_mode', false) }}
                      className={cn(
                        "flex-1 md:px-10 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                        theme === 'light' ? "bg-white text-black shadow-lg" : "text-muted-foreground/40 hover:text-primary"
                      )}
                     >
                       Light
                     </button>
                     <button 
                      onClick={() => { setTheme('dark'); handleUpdateSetting('dark_mode', true) }}
                      className={cn(
                        "flex-1 md:px-10 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                        theme === 'dark' ? "bg-black text-white shadow-xl" : "text-muted-foreground/40 hover:text-primary"
                      )}
                     >
                       Dark
                     </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Termination Protocol */}
            <section className="space-y-12 pb-20">
              <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-destructive/40" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-destructive italic">Termination Procedures</span>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 space-y-10 md:space-y-14 shadow-lg shadow-destructive/5">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-destructive">Deactivate Identity</h3>
                      <p className="text-[10px] md:text-xs font-medium italic text-destructive/60 max-w-sm">
                        Transition your records to hibernation. Your portfolio will be hidden from the global market.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowDeleteConfirm('hibernate')}
                      title="Hibernate account"
                      className="px-10 h-14 border border-destructive/30 text-destructive rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all shadow-sm"
                    >
                      Initiate Hibernation
                    </button>
                 </div>
                 <Separator className="bg-destructive/10" />
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-destructive">Erase Identity</h3>
                      <p className="text-[10px] md:text-xs font-medium italic text-destructive/60 max-w-sm">
                        Permanent record elimination. This action is irreversible and requires executive clearance.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowDeleteConfirm('erase')}
                      title="Erase all data"
                      className="px-10 h-14 bg-destructive text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:shadow-destructive/40 transition-all hover:-translate-y-1"
                    >
                      <Trash2 size={16} />
                      Execute Erase
                    </button>
                 </div>
              </div>
            </section>
          </motion.div>
        </Container>
      </main>

      {/* Confirmation Modals */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border border-border w-full max-w-md rounded-[2.5rem] p-10 space-y-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowDeleteConfirm(null)}
                title="Close"
                className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-4 text-center">
                 <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} />
                 </div>
                 <h2 className="text-2xl font-black uppercase tracking-tight">Confirm Action</h2>
                 <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
                   {showDeleteConfirm === 'hibernate' 
                     ? "Are you sure you want to hide your identity? You can reactivate this record at any time."
                     : "This action will permanently eliminate your digital records from the BlueOak ecosystem. This cannot be undone."}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button 
                   onClick={() => setShowDeleteConfirm(null)}
                   className="h-14 bg-secondary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary/70 transition-all"
                 >
                   Abort
                 </button>
                 <button 
                   onClick={() => {
                     if (showDeleteConfirm === 'hibernate') hibernateAccount()
                     else deleteAccount()
                     setShowDeleteConfirm(null)
                   }}
                   className="h-14 bg-destructive text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-destructive/20 hover:brightness-110 transition-all"
                 >
                   Confirm
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Skeleton / Loading State */}
      {isUpdating && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-[hsl(var(--gold))] z-[110] animate-pulse shadow-[0_0_10px_hsl(var(--gold))]" />
      )}
      
      {/* Bottom Identity Tab Bar (Concept) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-3xl border-t border-border/40 pb-[env(safe-area-inset-bottom)] md:hidden">
         <nav className="flex items-center justify-around h-20 max-w-lg mx-auto px-4">
            <button className="flex flex-col items-center gap-1.5 text-[hsl(var(--gold))]">
               <LayoutGrid size={22} strokeWidth={2.5} />
               <span className="text-[8px] font-bold uppercase tracking-widest">Dash</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 text-muted-foreground/40">
               <CreditCard size={22} />
               <span className="text-[8px] font-bold uppercase tracking-widest">Plan</span>
            </button>
            <button className="flex flex-col items-center gap-1.5 text-muted-foreground/40">
               <FileText size={22} />
               <span className="text-[8px] font-bold uppercase tracking-widest">Logs</span>
            </button>
         </nav>
      </div>

    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-[1px] w-full bg-border/20", className)} />
}
