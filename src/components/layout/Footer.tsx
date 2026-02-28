import { Link } from 'react-router-dom'
import { ROUTES, APP_NAME } from '@/lib/constants'
import Container from './Container'

export default function Footer() {
  const sections = [
    {
      title: 'Discover',
      links: [
        { label: 'Properties for Sale', href: `${ROUTES.SEARCH}?lt=sale` },
        { label: 'Properties to Let', href: `${ROUTES.SEARCH}?lt=rent` },
        { label: 'New Developments', href: `${ROUTES.SEARCH}?sort=newest` },
        { label: 'Featured Listings', href: `${ROUTES.SEARCH}?featured=true` },
        { label: 'Commercial', href: `${ROUTES.SEARCH}?type=commercial` },
      ]
    },
    {
      title: 'Sell & Let',
      links: [
        { label: 'List a Property', href: ROUTES.ADD_PROPERTY },
        { label: 'Agent Services', href: '#' },
        { label: 'Valuation', href: '#' },
        { label: 'Marketing', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About BlueOak', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Sitemap', href: '#' },
      ]
    }
  ]

  return (
    <footer className="bg-charcoal text-white/70 border-t border-white/5 pt-16 pb-28 md:pb-16 mt-0">
      {/* Gold hairline */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold)/0.4)] to-transparent mb-16" />

      <Container>
        {/* Brand + Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <span className="font-serif text-2xl text-white font-medium tracking-tight">
              {APP_NAME}
            </span>
            <p className="text-white/40 text-xs leading-relaxed">
              The world's most exclusive property marketplace for discerning buyers and sellers.
            </p>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h5 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                {section.title}
              </h5>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-[13px] text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/30 font-medium">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[12px] text-white/30">
            <span>English (EN)</span>
            <span>·</span>
            <span>ZMW (K)</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
