import { 
  Loader2 
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { useSavedProperties } from '@/hooks/useProperties'

export default function SavedPage() {
  const { t } = useTranslation()

  const { data: savedProperties = [], isLoading } = useSavedProperties()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50 pt-[calc(env(safe-area-inset-top,0px)+1rem)] py-5">
        <Container className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">{t('saved.title', 'My Collection')}</h1>
          <p className="text-sm text-muted-foreground font-medium">
            {savedProperties.length > 0
              ? `${savedProperties.length} saved propert${savedProperties.length === 1 ? 'y' : 'ies'}`
              : t('saved.subtitle', 'Save properties you love to find them here.')}
          </p>
        </Container>
      </header>

      <main className="flex-1 py-6">
        <Container>
          {savedProperties.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon="❤️" 
              title="No properties saved yet" 
              description="Click the heart icon on any property to save it to your collection."
              ctaText="Explore Properties"
              ctaLink="/search"
            />
          )}
        </Container>
      </main>
    </div>
  )
}

function EmptyState({ icon, title, description, ctaText, ctaLink }: { 
  icon: string, 
  title: string, 
  description: string, 
  ctaText: string, 
  ctaLink: string 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 max-w-sm mx-auto">
      <div className="h-24 w-24 rounded-[2rem] bg-secondary/50 flex items-center justify-center text-5xl shadow-inner uppercase tracking-widest animate-float">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
        <p className="text-muted-foreground font-medium leading-relaxed">
          {description}
        </p>
      </div>
      <Button asChild size="lg" className="rounded-2xl px-10 h-14 font-black text-lg shadow-xl shadow-primary/20">
        <Link to={ctaLink}>{ctaText}</Link>
      </Button>
    </div>
  )
}
