import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ChevronLeft, 
  MoreVertical, 
  Phone, 
  Send, 
  Plus, 
  Smile,
  CheckCircle2,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import { MOCK_PROPERTIES } from '@/lib/mock-data'

export default function ConversationPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Mock Conversation Data (Matching MessagesPage)
  const conversation = { 
    id: conversationId, 
    user: { name: 'Samantha M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974', role: 'Buyer' },
    property: MOCK_PROPERTIES[0],
    online: true
  }

  const messages = [
    { id: '1', text: "Hello! I'm interested in the property you listed. Is it still available for viewing this weekend?", sent: false, time: '10:15 AM' },
    { id: '2', text: "Hi! Yes, it is still available. I have slots on Saturday morning at 10:00 and 11:30. Would either of those work for you?", sent: true, time: '10:20 AM' },
    { id: '3', text: "Perfect! Saturday at 11:30 works for me. Can you send me the exact location?", sent: false, time: '10:22 AM' }
  ]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.MESSAGES)} className="rounded-full h-10 w-10">
            <ChevronLeft size={24} />
          </Button>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Avatar className="h-10 w-10 border shadow-sm">
                  <AvatarImage src={conversation.user.avatar} />
                  <AvatarFallback className="font-bold">{conversation.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                )}
             </div>
             <div>
                <h2 className="text-sm font-black tracking-tight">{conversation.user.name}</h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Online Now</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
           <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <Phone size={20} />
           </Button>
           <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <MoreVertical size={20} />
           </Button>
        </div>
      </header>

      {/* Property Context */}
      <div className="bg-primary/5 border-b border-primary/10 p-3 px-4 flex items-center justify-between">
         <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-border shadow-xs">
               <img src={conversation.property.image} className="h-full w-full object-cover" alt="Property" />
            </div>
            <div className="overflow-hidden">
               <span className="block text-[9px] font-black uppercase text-primary tracking-tighter">Property Inquiry</span>
               <span className="block text-xs font-bold truncate">{conversation.property.title}</span>
            </div>
         </div>
         <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-primary" asChild>
            <Link to={ROUTES.PROPERTY_DETAIL.replace(':slug', 'villa-roma')}>
               <Info size={18} />
            </Link>
         </Button>
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
         <div className="text-center py-4">
            <Badge variant="secondary" className="rounded-md font-bold text-[9px] px-3 uppercase text-muted-foreground/60 tracking-widest">Today</Badge>
         </div>

         {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sent ? 'items-end' : 'items-start'} gap-1`}>
               <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${
                  msg.sent 
                  ? 'bg-primary text-primary-foreground rounded-tr-none shadow-primary/10' 
                  : 'bg-secondary/30 text-foreground rounded-tl-none'
               }`}>
                  {msg.text}
               </div>
               <div className="flex items-center gap-1.5 px-1">
                  <span className="text-[9px] font-black text-muted-foreground uppercase">{msg.time}</span>
                  {msg.sent && <CheckCircle2 size={12} className="text-primary" />}
               </div>
            </div>
         ))}
      </main>

      {/* Input */}
      <footer className="p-4 bg-background border-t border-border/50 pb-8">
         <div className="flex items-end gap-2 bg-secondary/30 rounded-[1.5rem] p-2 border border-border/50 focus-within:bg-background transition-all">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full shrink-0">
               <Plus size={22} className="text-muted-foreground" />
            </Button>
            <textarea 
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Write a message..." 
               className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-2 px-1 min-h-[40px] max-h-[120px] resize-none"
               rows={1}
            />
            <div className="flex items-center gap-1">
               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                  <Smile size={22} className="text-muted-foreground" />
               </Button>
               <Button 
                  variant="default" 
                  size="icon" 
                  className={`h-10 w-10 rounded-full shadow-lg transition-all ${message.trim() ? 'bg-primary scale-110' : 'bg-muted opacity-50'}`}
                  disabled={!message.trim()}
               >
                  <Send size={18} />
               </Button>
            </div>
         </div>
      </footer>
    </div>
  )
}
