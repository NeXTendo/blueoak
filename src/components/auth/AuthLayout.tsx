import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  footerLink?: {
    text: string
    label: string
    href: string
  }
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle = "Access the Portfolio", 
  footerLink 
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-5 py-8 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-10 opacity-10 pointer-events-none bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[length:40px_40px]" />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <div className="w-full max-w-xs space-y-8 relative z-10">
        {/* Branding */}
        <div className="space-y-3 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Link to="/" className="flex justify-center group">
            <div className="h-4 w-4 rounded-full bg-primary group-hover:scale-125 transition-transform duration-500 shadow-2xl shadow-primary/20" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-primary leading-tight">
              {title}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 italic">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 [animation-delay:200ms]">
          {children}
        </div>

        {footerLink && (
          <div className="text-center animate-in fade-in duration-1000 [animation-delay:400ms]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              {footerLink.text}{' '}
              <Link to={footerLink.href} className="text-primary hover:underline transition-all">
                {footerLink.label}
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
