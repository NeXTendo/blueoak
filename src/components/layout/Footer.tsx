import { Link } from 'react-router-dom'
import { ROUTES, APP_NAME } from '@/lib/constants'
import Container from './Container'

export default function Footer() {
  const sections = [
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Safety Information', href: '#' },
        { label: 'Cancellation options', href: '#' },
        { label: 'Our COVID-19 Response', href: '#' },
        { label: 'Supporting people with disabilities', href: '#' },
        { label: 'Report a neighborhood concern', href: '#' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'BlueOak.org: disaster relief', href: '#' },
        { label: 'Support Afghan refugees', href: '#' },
        { label: 'Combating discrimination', href: '#' },
        { label: 'Referrals & Rewards', href: '#' },
        { label: 'Gift cards', href: '#' },
      ]
    },
    {
      title: 'Partnerships',
      links: [
        { label: 'List your property', href: ROUTES.ADD_PROPERTY },
        { label: 'BlueOak for Work', href: '#' },
        { label: 'Developer Tools', href: '#' },
        { label: 'Asset Management', href: '#' },
        { label: 'Investment Club', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press releases', href: '#' },
        { label: 'Investors', href: '#' },
        { label: 'Sustainability', href: '#' },
      ]
    }
  ]

  return (
    <footer className="bg-secondary/20 border-t border-secondary/50 pt-16 pb-32 md:pb-12 mt-24">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-4">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h4 className="text-[12px] font-black uppercase tracking-widest text-foreground">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-[14px] font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-secondary/50 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[13px] font-semibold text-muted-foreground">
            <span className="text-foreground">© 2026 {APP_NAME}, Inc.</span>
            <div className="flex items-center gap-6">
              <Link to="#" className="hover:underline underline-offset-4">Privacy</Link>
              <Link to="#" className="hover:underline underline-offset-4">Terms</Link>
              <Link to="#" className="hover:underline underline-offset-4">Sitemap</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <span className="text-[14px] font-bold flex items-center gap-2">
               🌐 English (US)
             </span>
             <span className="text-[14px] font-bold">
               ZMW (K)
             </span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
