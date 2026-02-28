import { 
  Shield, 
  Globe, 
  Bell, 
  Save,
  RotateCcw,
  Cpu,
  Lock,
  Loader2,
  Zap,
  ShieldCheck,
  Activity,
  ArrowRight,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Container from '@/components/layout/Container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePlatformSettings } from '@/hooks/useAdmin'
import AdminHeader from '@/components/admin/AdminHeader'

export default function PlatformSettingsPage() {
  const { settings, isLoading, updateSetting } = usePlatformSettings()

  const getSetting = (key: string) => (settings as any[])?.find(s => s.key === key)?.value || ''

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AdminHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--gold))]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[hsl(var(--gold)/0.1)]">
      <AdminHeader />
      
      <main className="flex-1 py-10">
        <Container className="space-y-8">
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif font-medium tracking-tight">System Configuration</h1>
              <p className="text-sm text-muted-foreground font-medium">Global platform parameters and security protocols.</p>
            </div>
            
            <div className="flex items-center gap-3">
               <Button variant="outline" className="rounded-full font-bold uppercase tracking-widest text-[10px] h-10 px-6 gap-2 border-border/60">
                  <RotateCcw size={14} />
                  Reset
               </Button>
               <Button className="rounded-full bg-[hsl(var(--gold))] text-white hover:bg-[hsl(var(--gold))]/90 font-bold uppercase tracking-widest text-[10px] h-10 px-6 gap-2">
                  <Save size={14} />
                  Apply Changes
               </Button>
            </div>
          </section>

          <Tabs defaultValue="general" className="space-y-8">
            <TabsList className="bg-secondary/20 p-1 rounded-full border border-border/40 h-11 w-full lg:w-auto overflow-x-auto no-scrollbar">
              {[
                { id: 'general', icon: Globe, label: 'Global' },
                { id: 'security', icon: Shield, label: 'Security' },
                { id: 'notifications', icon: Bell, label: 'Alerts' },
                { id: 'advanced', icon: Cpu, label: 'System' }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="rounded-full px-6 h-9 font-bold text-[10px] uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
                >
                  <tab.icon size={13} />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="general" className="space-y-8 focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="border-b border-border/40 pb-6">
                    <CardTitle className="text-xl font-serif">Platform Identity</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Visible platform metadata</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Entity Name</Label>
                      <Input 
                        defaultValue={getSetting('platform_name')} 
                        onBlur={(e) => updateSetting.mutate({ key: 'platform_name', value: e.target.value })}
                        className="h-11 rounded-lg border-border/60 bg-secondary/5 font-semibold text-sm focus-visible:ring-[hsl(var(--gold))]/30" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Support Alias</Label>
                      <Input 
                        defaultValue={getSetting('platform_email')} 
                        onBlur={(e) => updateSetting.mutate({ key: 'platform_email', value: e.target.value })}
                        className="h-11 rounded-lg border-border/60 bg-secondary/5 font-semibold text-sm focus-visible:ring-[hsl(var(--gold))]/30" 
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white">
                  <CardHeader className="border-b border-border/40 pb-6">
                    <CardTitle className="text-xl font-serif">Feature Toggles</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Runtime platform behaviors</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {[
                      { id: 'maintenance_mode', label: 'Maintenance Mode', desc: 'Restrict access to administrators only', icon: Lock },
                      { id: 'require_email_verification', label: 'Identity Filter', desc: 'Enforce verification for participation', icon: ShieldCheck },
                      { id: 'allow_new_registrations', label: 'Open Registration', desc: 'Allow new identities to join the network', icon: Zap }
                    ].map((flag) => (
                      <div key={flag.id} className="flex items-center justify-between gap-6 py-2">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-secondary/30 flex items-center justify-center border border-border/40">
                            <flag.icon size={18} className="text-muted-foreground" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold tracking-tight">{flag.label}</p>
                            <p className="text-[11px] text-muted-foreground font-medium">{flag.desc}</p>
                          </div>
                        </div>
                        <Switch 
                          checked={getSetting(flag.id) === 'true'} 
                          onCheckedChange={(checked) => updateSetting.mutate({ key: flag.id, value: checked.toString() })}
                          className="data-[state=checked]:bg-[hsl(var(--gold))]" 
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-8 focus-visible:outline-none">
              <Card className="border-border/60 shadow-sm rounded-2xl overflow-hidden bg-white max-w-4xl">
                <CardHeader className="border-b border-border/40 pb-6 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-xl font-serif">Security Protocol</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Integrity and access controls</CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100/50">
                    <Shield size={20} className="text-red-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between gap-6 p-6 rounded-2xl bg-secondary/10 border border-border/40">
                    <div className="space-y-1">
                      <p className="text-sm font-bold tracking-tight">Two-Factor Enforcement</p>
                      <p className="text-[11px] text-muted-foreground font-medium">Require MFA for all administrative level identities</p>
                    </div>
                    <Switch 
                      checked={getSetting('force_mfa') === 'true'} 
                      onCheckedChange={(checked) => updateSetting.mutate({ key: 'force_mfa', value: checked.toString() })}
                      className="data-[state=checked]:bg-red-500" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Session Duration (Seconds)</Label>
                      <div className="relative">
                         <Input 
                          defaultValue={getSetting('session_timeout')} 
                          onBlur={(e) => updateSetting.mutate({ key: 'session_timeout', value: e.target.value })}
                          className="h-11 rounded-lg border-border/60 bg-white font-semibold text-sm focus-visible:ring-red-500/30" 
                        />
                        <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                      </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-red-50/50 border border-red-100/50 space-y-4">
                      <div className="flex items-center gap-2 text-red-600">
                        <Activity size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Global Session Clear</span>
                      </div>
                      <p className="text-xs font-medium text-red-600/60 leading-relaxed italic">Immediately invalidate all active platform sessions</p>
                      <Button variant="outline" className="w-full h-10 rounded-lg border-red-200 text-red-600 hover:bg-red-600 hover:text-white font-bold uppercase tracking-widest text-[9px] transition-all">
                        Execute Network Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="py-20 text-center space-y-8">
              <div className="h-16 w-16 rounded-2xl bg-secondary/50 flex items-center justify-center border border-border/60 mx-auto">
                <Cpu size={28} className="text-muted-foreground/40" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl font-serif font-medium tracking-tight">Restricted Access</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">
                  Systems in this category require low-level platform clearance. Modifying these parameters can lead to permanent structural instability.
                </p>
              </div>
              <Button variant="outline" className="rounded-full h-11 px-8 border-border font-bold uppercase tracking-widest text-[10px] gap-2">
                Elevate Privileges
                <ArrowRight size={14} />
              </Button>
            </TabsContent>
          </Tabs>
        </Container>
      </main>
    </div>
  )
}
