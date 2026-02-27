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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROUTES } from '@/lib/constants'
import { MOCK_PROPERTIES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

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
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header */}
      <header className="shrink-0 bg-background/80 backdrop-blur-xl border-b border-border/50 px-3 py-2 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.MESSAGES)} className="h-9 w-9">
            <ChevronLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Avatar className="h-9 w-9 border border-border shadow-sm">
                  <AvatarImage src={conversation.user.avatar} />
                  <AvatarFallback className="font-semibold">{conversation.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-background rounded-full" />
                )}
             </div>
             <div>
                <h2 className="text-sm font-semibold tracking-tight leading-none">{conversation.user.name}</h2>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Online Now</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
           <Button variant="ghost" size="icon" className="h-9 w-9">
              <Phone size={18} />
           </Button>
           <Button variant="ghost" size="icon" className="h-9 w-9">
              <MoreVertical size={18} />
           </Button>
        </div>
      </header>

      {/* Property Context Bar */}
      <div className="shrink-0 bg-primary/5 border-b border-primary/10 p-2 px-4 flex items-center justify-between z-20">
         <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0 border border-border">
               <img src={conversation.property.image} className="h-full w-full object-cover" alt="Property" />
            </div>
            <div className="overflow-hidden">
               <span className="block text-[10px] font-semibold truncate leading-none">
                 {conversation.property.title}
               </span>
            </div>
         </div>
         <Button variant="ghost" className="h-8 px-2 text-primary font-semibold text-[11px]" asChild>
            <Link to={ROUTES.PROPERTY_DETAIL.replace(':slug', 'villa-roma')}>
               View Details
            </Link>
         </Button>
      </div>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4" ref={scrollRef}>
         <div className="flex justify-center mb-4">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/30 px-3 py-1 rounded-full">Today</span>
         </div>

         {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sent ? 'items-end' : 'items-start'} gap-1`}>
               <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] font-medium leading-relaxed ${
                  msg.sent 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-secondary/30 text-foreground rounded-tl-none'
               }`}>
                  {msg.text}
               </div>
               <div className="flex items-center gap-1.5 px-1">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{msg.time}</span>
                  {msg.sent && <CheckCircle2 size={10} className="text-primary" />}
               </div>
            </div>
         ))}
      </main>

      {/* Input Area - Fixed at Bottom */}
      <footer className="shrink-0 p-3 pt-2 bg-background border-t border-border/50 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
         <div className="flex items-end gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex items-end gap-1 bg-secondary/30 rounded-[1.5rem] p-1.5 border border-border focus-within:bg-background transition-all">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
                  <Plus size={20} className="text-muted-foreground" />
               </Button>
               <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] font-medium py-1.5 px-0.5 min-h-[36px] max-h-[100px] resize-none"
                  rows={1}
               />
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Smile size={20} className="text-muted-foreground" />
               </Button>
            </div>
            
            <Button 
               variant="default" 
               size="icon" 
               className={cn(
                  "h-10 w-10 rounded-full shrink-0 shadow-lg transition-all",
                  message.trim() ? "bg-primary scale-100" : "bg-muted opacity-50 scale-90"
               )}
               disabled={!message.trim()}
            >
               <Send size={18} />
            </Button>
         </div>
      </footer>
    </div>
  )
}
