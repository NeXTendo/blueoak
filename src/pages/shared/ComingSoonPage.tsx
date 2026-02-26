import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Container from '@/components/layout/Container'
import { ROUTES } from '@/lib/constants'

export default function ComingSoonPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary selection:text-primary-foreground">
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[10rem] animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[10rem] animate-pulse [animation-delay:1s]" />
        </div>

        <Container className="relative z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-12"
          >
            <div className="flex justify-center">
              <div className="h-6 w-6 rounded-full bg-primary shadow-2xl animate-pulse" />
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground italic">
                Development in Progress
              </span>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-primary leading-[0.85]">
                Coming <br /> Soon.
              </h1>
            </div>

            <p className="max-w-md mx-auto text-muted-foreground/60 text-sm font-medium leading-relaxed italic">
              Our engineers are currently crafting this experience. This asset intelligence module is scheduled for immediate deployment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Return to Previous
              </button>
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="flex items-center gap-3 h-14 px-8 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:shadow-premium transition-all active:scale-95"
              >
                <Home size={14} />
                Global HQ
              </button>
            </div>
          </motion.div>
        </Container>
      </div>
    </div>
  )
}
