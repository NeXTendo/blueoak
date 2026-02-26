import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  Bell, 
  Lock, 
  Languages, 
  Coins, 
  Moon, 
  Sun, 
  Trash2,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Switch } from '@/components/ui/switch'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { ROUTES, CURRENCIES, LANGUAGES } from '@/lib/constants'
import Container from '@/components/layout/Container'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const handleUpdatePreference = async (key: string, value: string) => {
    try {
      await updateProfile({ [key]: value })
    } catch (err) {
      console.error(`Failed to update ${key}:`, err)
    }
  }

  const sections = [
    {
      id: 'notifications',
      title: 'Alert Protocol',
      icon: Bell,
      items: [
        { id: 'email_notif', label: 'Email Intelligence', desc: 'Market reports and asset updates.', checked: true },
        { id: 'push_notif', label: 'Direct Alerts', desc: 'Real-time push notifications.', checked: true },
        { id: 'message_notif', label: 'Communication Hub', desc: 'Inquiry and message alerts.', checked: true },
      ]
    },
    {
      id: 'security',
      title: 'Access Control',
      icon: Lock,
      links: [
        { label: 'Identity Firewall', desc: 'Update login credentials.', path: '#' },
        { label: 'Two-Factor Shield', desc: 'Enhanced account security.', path: '#' },
        { label: 'Session Matrix', desc: 'Review active access points.', path: '#' },
      ]
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* High-Contrast Control Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-2xl border-b border-secondary pt-12 pb-8">
        <Container className="flex items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate(-1)} 
              title="Return to Identity"
              className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">System Configuration</span>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Settings</h1>
            </div>
          </div>
          <div className="h-4 w-4 rounded-full bg-primary shadow-2xl animate-pulse" />
        </Container>
      </header>

      <main className="pt-16">
        <Container className="max-w-4xl px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-24"
          >
            
            {/* Identity Summary Card */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-primary/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Identity Protocol</span>
              </div>
              <div className="bg-secondary/20 rounded-[3rem] p-10 flex items-center gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform" />
                <div className="h-20 w-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-black shadow-2xl relative z-10">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 space-y-1 relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tight">{profile?.full_name || 'Anonymous User'}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{profile?.email}</p>
                </div>
                <button 
                  onClick={() => navigate(ROUTES.EDIT_PROFILE)}
                  title="Modify Identity"
                  className="px-8 h-12 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-primary hover:text-white transition-all relative z-10"
                >
                  Edit Profile
                </button>
              </div>
            </section>

            {/* Dynamic Configuration Zones */}
            {sections.map((section) => (
              <section key={section.id} className="space-y-10">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-primary/20" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">{section.title}</span>
                </div>
                <div className="bg-background border-2 border-secondary rounded-[3rem] overflow-hidden shadow-premium">
                  <div className="divide-y divide-secondary">
                    {section.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-10 hover:bg-secondary/10 transition-colors">
                        <div className="space-y-2">
                          <label className="text-lg font-black uppercase tracking-tight block">{item.label}</label>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={item.checked} className="data-[state=checked]:bg-primary" />
                      </div>
                    ))}
                    {section.links?.map((link) => (
                      <button 
                        key={link.label} 
                        title={`Access ${link.label}`}
                        className="w-full flex items-center justify-between p-10 hover:bg-secondary/30 transition-all text-left"
                      >
                        <div className="space-y-2">
                          <div className="text-lg font-black uppercase tracking-tight">{link.label}</div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">{link.desc}</p>
                        </div>
                        <ChevronRight size={24} className="text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            ))}

            {/* Application Environment */}
            <section className="space-y-10">
               <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-primary/20" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Environment Control</span>
               </div>
              <div className="bg-background border-2 border-secondary rounded-[3rem] p-10 space-y-12 shadow-premium">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                      <Languages size={24} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-lg font-black uppercase tracking-tight">Intelligence Dialect</label>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">System language preference.</p>
                    </div>
                  </div>
                  <Select 
                    defaultValue={profile?.preferred_language || 'en'}
                    onValueChange={(val) => handleUpdatePreference('preferred_language', val)}
                  >
                    <SelectTrigger className="w-40 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-secondary bg-transparent focus:ring-primary shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2 border-secondary shadow-2xl font-black text-[10px] uppercase tracking-widest">
                      {LANGUAGES.map((lang: any) => (
                        <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                      <Coins size={24} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-lg font-black uppercase tracking-tight">Economic Unit</label>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Asset valuation currency.</p>
                    </div>
                  </div>
                  <Select 
                     defaultValue={profile?.preferred_currency || 'ZMW'}
                     onValueChange={(val) => handleUpdatePreference('preferred_currency', val)}
                  >
                    <SelectTrigger className="w-40 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-secondary bg-transparent focus:ring-primary shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-2 border-secondary shadow-2xl font-black text-[10px] uppercase tracking-widest">
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>{curr.code} ({curr.symbol})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                      {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                    </div>
                    <div className="space-y-1">
                      <label className="text-lg font-black uppercase tracking-tight">Visual Spectrum</label>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Luminance mode toggle.</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-secondary/20 p-1.5 rounded-2xl border-2 border-secondary">
                     <button 
                      onClick={() => setTheme('light')}
                      className={cn(
                        "px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        theme === 'light' ? "bg-white text-black shadow-lg" : "text-muted-foreground/40 hover:text-primary"
                      )}
                     >
                       Bright
                     </button>
                     <button 
                      onClick={() => setTheme('dark')}
                      className={cn(
                        "px-6 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        theme === 'dark' ? "bg-black text-white shadow-lg" : "text-muted-foreground/40 hover:text-primary"
                      )}
                     >
                       Dark
                     </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Terminal Zone */}
            <section className="space-y-10 pb-20">
              <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-destructive/20" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-destructive">Termination Protocol</span>
              </div>
              <div className="bg-destructive/5 border-2 border-destructive/10 rounded-[3rem] p-10 space-y-10 shadow-lg">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black uppercase tracking-tight text-destructive">Deactivate Identity</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest italic text-destructive/60">Hibernation of records.</p>
                    </div>
                    <button 
                      title="Deactivate account"
                      className="px-8 h-12 border-2 border-destructive/20 text-destructive rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-destructive hover:text-white transition-all shadow-sm"
                    >
                      Hibernate
                    </button>
                 </div>
                 <div className="h-[1px] w-full bg-destructive/10" />
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black uppercase tracking-tight text-destructive">Erase Identity</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest italic text-destructive/60">Permanent record elimination.</p>
                    </div>
                    <button 
                      title="Delete account permanently"
                      className="px-8 h-12 bg-destructive text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl hover:shadow-destructive/40 transition-all"
                    >
                      <Trash2 size={16} />
                      Erase
                    </button>
                 </div>
              </div>
            </section>
          </motion.div>
        </Container>
      </main>
    </div>
  )
}
