import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  Camera, 
  Phone, 
  Globe, 
  MessageSquare,
  Save,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Shield
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROUTES } from '@/lib/constants'
import Container from '@/components/layout/Container'

export default function EditProfilePage() {
  const { profile, updateProfile, isLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone: '',
    whatsapp: '',
    website: '',
    is_public: true
  })
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        whatsapp: profile.whatsapp || '',
        website: profile.website || '',
        is_public: true
      })
    }
  }, [profile])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setIsSaving(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${profile.id}/avatar-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      await updateProfile({ avatar_url: publicUrl })
    } catch (error) {
      console.error('Avatar upload failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateProfile(formData)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        navigate(ROUTES.PROFILE)
      }, 1500)
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

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
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">Identity Management</span>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Authentication</h1>
            </div>
          </div>
          <button 
            onClick={handleSubmit} 
            title="Commit changes to database"
            disabled={isSaving || isLoading}
            className="h-14 px-8 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-premium transition-all gap-3 overflow-hidden relative"
          >
            <AnimatePresence mode="wait">
              {isSaving ? (
                <motion.div key="saving" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                  <Loader2 className="animate-spin" size={16} />
                </motion.div>
              ) : success ? (
                <motion.div key="success" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                  <CheckCircle2 size={16} />
                </motion.div>
              ) : (
                <motion.div key="save" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }} className="flex items-center gap-3">
                  <Save size={16} />
                  <span>Commit Records</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </Container>
      </header>

      <main className="pt-20">
        <Container className="max-w-4xl px-4">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit} 
            className="space-y-24"
          >
            {/* Identity Visualization Section */}
            <section className="flex flex-col md:flex-row items-center gap-12 p-12 bg-secondary/20 rounded-[4rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[10rem] translate-x-12 -translate-y-12 transition-transform group-hover:scale-110" />
              
              <div className="relative group/avatar">
                <Avatar className="h-48 w-48 ring-[12px] ring-background shadow-premium scale-100 group-hover/avatar:scale-105 transition-transform duration-500">
                  <AvatarImage src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080"} />
                  <AvatarFallback className="text-6xl font-black bg-secondary text-primary">
                    {formData.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  title="Upload new visual signature"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-full cursor-pointer backdrop-blur-sm"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Camera size={32} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Change Identity Visual</span>
                  </div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
                <div className="space-y-1">
                   <h3 className="text-3xl font-black uppercase tracking-tight">Identity Visual</h3>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">JPG / PNG / Max-Capacity 5MB</p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="px-6 py-2.5 bg-background border-2 border-secondary rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <Shield size={14} className="text-primary" />
                    Encrypted Protocol
                  </div>
                </div>
              </div>
            </section>

            {/* Core Attribution */}
            <section className="space-y-12">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-primary/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Core Attribution</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label htmlFor="full_name" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 ml-1">Full Legal Name</label>
                  <input 
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter full designation"
                    className="w-full h-16 px-8 bg-background border-2 border-secondary rounded-[2rem] text-lg font-black tracking-tight placeholder:text-muted-foreground/20 focus:border-primary focus:ring-0 transition-all outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label htmlFor="username" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 ml-1">Digital Alias</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-primary font-black text-lg">@</span>
                    <input 
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="alias"
                      className="w-full h-16 pl-14 pr-8 bg-background border-2 border-secondary rounded-[2rem] text-lg font-black tracking-tight placeholder:text-muted-foreground/20 focus:border-primary focus:ring-0 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="bio" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 ml-1">Identity Narrative (Bio)</label>
                <textarea 
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Define your market narrative..."
                  className="w-full min-h-[200px] p-8 bg-background border-2 border-secondary rounded-[3rem] text-lg font-black tracking-tight leading-relaxed placeholder:text-muted-foreground/20 focus:border-primary focus:ring-0 transition-all outline-none resize-none"
                />
                <div className="flex items-center justify-between px-4">
                   <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Capacity: 500 characters</p>
                </div>
              </div>
            </section>

            {/* Communication Grid */}
            <section className="space-y-12">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-12 bg-primary/20" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">Communication Grid</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 ml-1">Primary Voice Line</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+260 00 000 000"
                      className="w-full h-16 pl-16 pr-8 bg-background border-2 border-secondary rounded-[2rem] text-lg font-black tracking-tight placeholder:text-muted-foreground/20 focus:border-primary focus:ring-0 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 ml-1">WhatsApp Matrix</label>
                  <div className="relative">
                    <MessageSquare size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input 
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+260 00 000 000"
                      className="w-full h-16 pl-16 pr-8 bg-background border-2 border-secondary rounded-[2rem] text-lg font-black tracking-tight placeholder:text-muted-foreground/20 focus:border-primary focus:ring-0 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="website" className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60 ml-1">Digital Domain (Website)</label>
                <div className="relative">
                  <Globe size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-primary/40" />
                  <input 
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://intelligence-portfolio.io"
                    className="w-full h-16 pl-16 pr-8 bg-background border-2 border-secondary rounded-[2rem] text-lg font-black tracking-tight placeholder:text-muted-foreground/20 focus:border-primary focus:ring-0 transition-all outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Termination Sequence */}
            <section className="pt-12">
               <button 
                type="submit" 
                title="Execute identity synchronization"
                disabled={isSaving || isLoading}
                className="group w-full h-24 bg-primary text-primary-foreground rounded-[2.5rem] flex items-center justify-between px-12 transition-all hover:shadow-premium shadow-2xl active:scale-[0.98] outline-none"
              >
                <div className="flex items-center gap-6">
                   <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                      <Save size={24} />
                   </div>
                   <div className="text-left">
                      <span className="text-xs font-black uppercase tracking-widest block opacity-40 italic">Final Protocol</span>
                      <span className="text-2xl font-black uppercase tracking-tight block leading-none pt-1">Synchronize Records</span>
                   </div>
                </div>
                <ArrowRight size={32} className="group-hover:translate-x-4 transition-transform duration-500 ease-out" />
              </button>
            </section>
          </motion.form>
        </Container>
      </main>
    </div>
  )
}
