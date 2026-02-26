import { useState } from 'react'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video,
  User,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import Container from '@/components/layout/Container'

const MOCK_RESERVATIONS = [
  {
    id: 'res-1',
    property_id: '1',
    property_title: 'Modern Villa in Leopards Hill',
    property_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    date: '2024-05-15',
    time: '10:00 AM',
    type: 'In-person',
    status: 'upcoming',
    participant: 'Derrick Chimedza (Agent)',
    address: 'Plot 123, Leopards Hill Road, Lusaka'
  },
  {
    id: 'res-2',
    property_id: '2',
    property_title: 'Office Complex - Rhodes Park',
    property_image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    date: '2024-05-18',
    time: '2:30 PM',
    type: 'Virtual Tour',
    status: 'upcoming',
    participant: 'Sarah Phiri (Seller)',
    address: 'Rhodes Park Business District'
  },
  {
    id: 'res-3',
    property_id: '3',
    property_title: 'Luxury Apartment in Roma',
    property_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    date: '2024-05-10',
    time: '11:00 AM',
    type: 'In-person',
    status: 'completed',
    participant: 'John Banda (Agent)',
    address: 'Roma Park, Lusaka'
  }
]

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState('upcoming')

  const filteredReservations = MOCK_RESERVATIONS.filter(res => res.status === activeTab)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b border-secondary/50 py-12 bg-secondary/10">
        <Container>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-2">
                 <h1 className="text-4xl font-black uppercase tracking-tighter">Engagement Log</h1>
                 <p className="text-muted-foreground font-medium italic">Repository of property viewings and virtual sessions.</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative w-full md:w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Find Session..." 
                      className="pl-11 h-12 rounded-xl border-2 bg-background shadow-premium"
                    />
                 </div>
              </div>
           </div>
        </Container>
      </header>

      <main className="py-12">
        <Container>
           <Tabs defaultValue="upcoming" onValueChange={setActiveTab} className="space-y-12">
              <TabsList className="bg-secondary/20 p-1.5 h-14 rounded-2xl border-2 border-secondary/30">
                 <TabsTrigger value="upcoming" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Upcoming</TabsTrigger>
                 <TabsTrigger value="completed" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Completed</TabsTrigger>
                 <TabsTrigger value="cancelled" className="rounded-xl px-8 font-black uppercase tracking-widest text-[10px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="focus-visible:outline-none">
                 {filteredReservations.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {filteredReservations.map((res) => (
                          <div key={res.id} className="group relative bg-background border border-secondary/50 rounded-[2.5rem] overflow-hidden shadow-premium hover:border-primary/30 transition-all duration-500">
                             <div className="flex flex-col sm:flex-row h-full">
                                {/* Image Section */}
                                <div className="w-full sm:w-[200px] h-[200px] sm:h-auto relative overflow-hidden">
                                   <img 
                                      src={res.property_image} 
                                      alt={res.property_title} 
                                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                   />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                                   <Badge className="absolute top-4 left-4 bg-primary/20 backdrop-blur-md text-primary border-primary/20 font-black uppercase tracking-widest text-[8px] px-3 h-6">
                                      {res.type}
                                   </Badge>
                                </div>

                                {/* Content Section */}
                                <div className="flex-1 p-8 space-y-6">
                                   <div className="flex justify-between items-start">
                                      <div className="space-y-1">
                                         <h3 className="font-black uppercase tracking-tight text-lg leading-tight group-hover:text-primary transition-colors">{res.property_title}</h3>
                                         <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <MapPin size={12} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px]">{res.address}</span>
                                         </div>
                                      </div>
                                   <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="sm" className="h-8 px-3 font-bold text-[8px] uppercase">View</Button>
                                      <Button variant="ghost" size="sm" className="h-8 px-3 font-bold text-[8px] uppercase text-destructive">Cancel</Button>
                                   </div>
                                </div>

                                   <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/10 border border-secondary/50">
                                         <div className="flex items-center gap-2 text-primary">
                                            <Calendar size={12} />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Protocol Date</span>
                                         </div>
                                         <p className="text-xs font-black">{new Date(res.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                      </div>
                                      <div className="space-y-1.5 p-3 rounded-2xl bg-secondary/10 border border-secondary/50">
                                         <div className="flex items-center gap-2 text-primary">
                                            <Clock size={12} />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Time Slot</span>
                                         </div>
                                         <p className="text-xs font-black">{res.time}</p>
                                      </div>
                                   </div>

                                   <div className="flex items-center justify-between pt-2">
                                      <div className="flex items-center gap-2.5">
                                         <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User size={14} />
                                         </div>
                                         <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Connection</span>
                                            <span className="text-[10px] font-black uppercase tracking-tight">{res.participant}</span>
                                         </div>
                                      </div>
                                      {res.type === 'Virtual Tour' && (
                                         <Button size="sm" className="h-10 rounded-xl px-5 gap-2 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20">
                                            <Video size={14} />
                                            Join Room
                                         </Button>
                                      )}
                                   </div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                       <div className="h-32 w-32 rounded-[3rem] bg-secondary/20 flex items-center justify-center text-5xl">📭</div>
                       <div className="space-y-2">
                          <h3 className="text-2xl font-black uppercase tracking-tight">Archives Empty</h3>
                          <p className="text-muted-foreground font-medium italic">No sessions found in the <span className="text-primary font-bold">{activeTab}</span> log.</p>
                       </div>
                       <Button variant="outline" className="h-12 rounded-2xl px-8 border-2 font-black uppercase tracking-widest text-[10px]" onClick={() => window.location.href = '/search'}>
                          Initiate Discovery
                       </Button>
                    </div>
                 )}
              </TabsContent>
           </Tabs>
        </Container>
      </main>
    </div>
  )
}
