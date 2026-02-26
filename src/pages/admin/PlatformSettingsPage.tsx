import { 
  Shield, 
  Globe, 
  Bell, 
  CreditCard, 
  Save,
  RotateCcw,
  Cpu,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Container from '@/components/layout/Container'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function PlatformSettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="border-b border-border/50 py-12 bg-primary/5">
        <Container>
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Core Configuration</h1>
              <p className="text-muted-foreground font-medium italic">Global platform parameters and security protocols.</p>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" size="lg" className="rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] gap-2">
                  <RotateCcw size={16} />
                  Revert Changes
               </Button>
               <Button size="lg" className="rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                  <Save className="mr-2 h-5 w-5" />
                  Apply Protocol
               </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-12">
        <Container>
           <Tabs defaultValue="general" className="space-y-12">
              <TabsList className="bg-secondary/30 p-1 rounded-2xl h-14 w-full md:w-auto overflow-x-auto no-scrollbar">
                 {[
                   { id: 'general', icon: Globe, label: 'Global' },
                   { id: 'security', icon: Shield, label: 'Security' },
                   { id: 'payments', icon: CreditCard, label: 'Financial' },
                   { id: 'notifications', icon: Bell, label: 'Alerts' },
                   { id: 'advanced', icon: Cpu, label: 'Deep System' }
                 ].map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-background transition-all">
                       <tab.icon size={14} />
                       {tab.label}
                    </TabsTrigger>
                 ))}
              </TabsList>

              <TabsContent value="general" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="rounded-[2.5rem] border-2 border-secondary/50 p-10 space-y-8 shadow-premium">
                       <div className="space-y-2">
                          <h3 className="text-xl font-black tracking-tight">System Identity</h3>
                          <p className="text-xs font-bold text-muted-foreground italic">Publicly visible platform metadata.</p>
                       </div>
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Platform Name</Label>
                             <Input defaultValue="BlueOak Real Estate" className="h-12 rounded-xl bg-secondary/20 border-border/50 font-bold" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Support Alias</Label>
                             <Input defaultValue="support@blueoak.com" className="h-12 rounded-xl bg-secondary/20 border-border/50 font-bold" />
                          </div>
                       </div>
                    </Card>

                    <Card className="rounded-[2.5rem] border-2 border-secondary/50 p-10 space-y-8 shadow-premium">
                       <div className="space-y-2">
                          <h3 className="text-xl font-black tracking-tight">Feature Flags</h3>
                          <p className="text-xs font-bold text-muted-foreground italic">Hot-swappable platform feature toggles.</p>
                       </div>
                       <div className="space-y-6">
                          {[
                            { id: 'reg', label: 'Open Registration', desc: 'Allow new users to create accounts.', active: true },
                            { id: 'list', label: 'Verified Listing Only', desc: 'Require manual approval for all new assets.', active: true },
                            { id: 'mes', label: 'Inter-User Messaging', desc: 'Enable direct communication protocols.', active: true }
                          ].map((flag) => (
                            <div key={flag.id} className="flex items-center justify-between gap-4">
                               <div className="space-y-0.5">
                                  <p className="text-sm font-black uppercase tracking-tight">{flag.label}</p>
                                  <p className="text-xs text-muted-foreground font-medium">{flag.desc}</p>
                               </div>
                               <Switch defaultChecked={flag.active} className="data-[state=checked]:bg-primary" />
                            </div>
                          ))}
                       </div>
                    </Card>
                 </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <Card className="rounded-[3rem] border-2 border-red-500/10 bg-red-500/[0.02] p-12 space-y-10 shadow-premium">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                          <Lock size={24} />
                       </div>
                       <div>
                          <h3 className="text-2xl font-black tracking-tight">High-Level Security Protocol</h3>
                          <p className="text-xs font-bold text-muted-foreground italic">These parameters directly affect platform integrity.</p>
                       </div>
                    </div>
                    <Separator className="bg-red-500/10" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                       <div className="space-y-6">
                          <div className="flex items-center justify-between gap-4">
                             <div className="space-y-1">
                                <Label className="text-sm font-black uppercase tracking-tight">Multi-Factor Authentication</Label>
                                <p className="text-xs text-muted-foreground font-medium italic">Enforce MFA for all administrative and agent identities.</p>
                             </div>
                             <Switch defaultChecked className="data-[state=checked]:bg-red-500" />
                          </div>
                          <div className="flex items-center justify-between gap-4">
                             <div className="space-y-1">
                                <Label className="text-sm font-black uppercase tracking-tight">Automatic IP Shield</Label>
                                <p className="text-xs text-muted-foreground font-medium italic">Blacklist identities after 5 failed authentication attempts.</p>
                             </div>
                             <Switch defaultChecked className="data-[state=checked]:bg-red-500" />
                          </div>
                       </div>
                       <div className="space-y-6">
                           <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Session Timeout (Seconds)</Label>
                             <Input defaultValue="3600" className="h-12 rounded-xl bg-background border-red-500/20 font-bold" />
                          </div>
                          <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest text-[10px]">
                             Initiate Global Logout
                          </Button>
                       </div>
                    </div>
                 </Card>
              </TabsContent>

              <TabsContent value="advanced" className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                 <div className="h-20 w-20 rounded-[2rem] bg-secondary flex items-center justify-center">
                    <Cpu className="text-primary" size={32} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight uppercase italic">Deep System Access Required</h3>
                    <p className="text-muted-foreground font-medium max-w-md">Configuration within this layer requires direct database authority and developer-level security tokens.</p>
                 </div>
                 <Button className="rounded-2xl px-12 h-14 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                    Request Temporal Access
                 </Button>
              </TabsContent>
           </Tabs>
        </Container>
      </main>
    </div>
  )
}
