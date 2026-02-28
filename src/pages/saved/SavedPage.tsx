import { useState } from 'react'
import { 
  Trash2, 
  ArrowRight, 
  Bell, 
  Clock,
  Loader2 
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PropertyCard from '@/components/property/PropertyCard'
import Container from '@/components/layout/Container'
import { useSavedProperties } from '@/hooks/useProperties'

export default function SavedPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('properties')

  const { data: savedProperties = [], isLoading } = useSavedProperties()
  const savedSearches = [
    { id: '1', query: '3 Bed House in Lusaka', filters: 'Min $200k, Pool', date: '2 days ago' },
    { id: '2', query: 'Apartments in Lagos CBD', filters: 'Min $50k', date: '5 days ago' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50 pt-[env(safe-area-inset-top,0px)] py-5">
        <Container className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">{t('saved.title', 'My Collection')}</h1>
          <p className="text-sm text-muted-foreground font-medium">{t('saved.subtitle', 'Keep track of the properties and searches you love.')}</p>
        </Container>
      </header>

      <main className="flex-1 py-4">
        <Container>
          <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-[calc(env(safe-area-inset-top,0px)+72px)] z-10 bg-background pb-4 pt-2">
          <TabsList className="h-11 bg-secondary/30 p-1 rounded-xl w-full">
            <TabsTrigger value="properties" className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Properties ({savedProperties.length})
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex-1 rounded-lg font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Saved Searches ({savedSearches.length})
            </TabsTrigger>
          </TabsList>
          </div>

          <div className="space-y-6">

          <TabsContent value="properties" className="m-0 space-y-4">
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
          </TabsContent>

          <TabsContent value="searches" className="m-0 space-y-6">
            {savedSearches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedSearches.map((search) => (
                  <div key={search.id} className="group p-6 rounded-3xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-all space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{search.query}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <Clock size={14} />
                          Saved {search.date}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {search.filters.split(',').map(f => (
                         <div key={f} className="px-3 py-1 bg-background rounded-full text-xs font-bold text-muted-foreground border border-border/50">
                           {f.trim()}
                         </div>
                       ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Button variant="link" className="p-0 h-auto font-bold text-primary gap-2">
                        Execute Search
                        <ArrowRight size={16} />
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl border-primary/20 bg-primary/5 text-primary font-bold gap-2">
                        <Bell size={14} />
                        Alerts On
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon="🔍" 
                title="No searches saved" 
                description="Save your search filters to get notified when new matching properties are listed."
                ctaText="Start Searching"
                ctaLink="/search"
              />
            )}
          </TabsContent>
          </div>
          </Tabs>
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
