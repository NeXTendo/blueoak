import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  Plus,
  Send,
  Smile
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { MOCK_PROPERTIES } from '@/lib/mock-data'

export default function MessagesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Mock Conversations
  const conversations = [
    { 
      id: '1', 
      user: { name: 'Samantha M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974', role: 'Buyer' },
      lastMessage: 'Is the price negotiable for the villa in Roma?',
      time: '12:45 PM',
      unread: 2,
      online: true,
      property: MOCK_PROPERTIES[0]
    },
    { 
      id: '2', 
      user: { name: 'Kelvin Phiri', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974', role: 'Agent' },
      lastMessage: 'The viewing is scheduled for tomorrow at 10 AM.',
      time: '10:20 AM',
      unread: 0,
      online: false,
      property: MOCK_PROPERTIES[1]
    },
    { 
      id: '3', 
      user: { name: 'John Tembo', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070', role: 'Seller' },
      lastMessage: 'I have sent the documents to your email.',
      time: 'Yesterday',
      unread: 0,
      online: true,
      property: MOCK_PROPERTIES[2]
    }
  ]

  const filteredConversations = conversations.filter(c => 
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.property.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectConversation = (id: string) => {
    if (window.innerWidth < 1024) {
      navigate(`${ROUTES.MESSAGES}/${id}`)
    } else {
      setSelectedId(id)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* List Pane */}
      <aside className={cn(
        "w-full lg:w-96 flex flex-col border-r border-border/50 bg-background/50 backdrop-blur-xl",
        selectedId && "hidden lg:flex"
      )}>
        <header className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
            <div className="flex gap-2">
               <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-secondary/30">
                 <Plus size={20} />
               </Button>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
            <Input 
              placeholder="Search..." 
              className="h-11 pl-11 bg-secondary/30 border-none rounded-xl font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             <Badge variant="default" className="rounded-lg px-4 py-1.5 font-semibold cursor-pointer">All Chats</Badge>
             <Badge variant="outline" className="rounded-lg px-4 py-1.5 font-semibold cursor-pointer border-none bg-secondary/50 hover:bg-secondary">Unread</Badge>
             <Badge variant="outline" className="rounded-lg px-4 py-1.5 font-semibold cursor-pointer border-none bg-secondary/50 hover:bg-secondary">Buying</Badge>
          </div>
        </header>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-20 md:pb-6">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={cn(
                  "w-full p-4 rounded-2xl flex gap-4 transition-all duration-300 text-left group relative",
                  selectedId === conv.id ? "bg-secondary" : "hover:bg-secondary/40"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12 border border-border shadow-sm">
                    <AvatarImage src={conv.user.avatar} />
                    <AvatarFallback className="font-semibold">{conv.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[15px] truncate pr-2">{conv.user.name}</h3>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {conv.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                     <p className="text-[11px] font-semibold text-primary truncate max-w-[140px]">
                       {conv.property.title}
                     </p>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground line-clamp-1 mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.unread > 0 && selectedId !== conv.id && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                )}
              </button>
            ))}

            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">📭</div>
                <div>
                  <h4 className="font-semibold">No chats found</h4>
                  <p className="text-xs text-muted-foreground font-medium">Try searching for another name.</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Detail Pane / Chat View (Desktop Only) */}
      <main className="hidden lg:flex flex-1 flex-col bg-secondary/10 relative">
        {selectedId ? (
          <div className="flex flex-col h-full">
             {/* Dynamic Chat Header */}
             <header className="p-4 bg-background/50 backdrop-blur-xl border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <Avatar className="h-10 w-10 border border-border shadow-sm">
                     <AvatarImage src={conversations.find(c => c.id === selectedId)?.user.avatar} />
                     <AvatarFallback className="font-semibold">U</AvatarFallback>
                   </Avatar>
                   <div>
                      <h2 className="text-base font-semibold tracking-tight">{conversations.find(c => c.id === selectedId)?.user.name}</h2>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                         <div className="h-2 w-2 bg-green-500 rounded-full" />
                         Active Now
                      </div>
                   </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" className="h-9 rounded-lg font-semibold border-none bg-secondary/50 hover:bg-secondary">Profile</Button>
                   <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                      <MoreVertical size={18} />
                   </Button>
                </div>
             </header>

             {/* Property Context Bar */}
             <div className="p-2 bg-primary/5 border-b border-primary/10 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg overflow-hidden border border-border shadow-sm">
                      <img 
                        src={conversations.find(c => c.id === selectedId)?.property.image} 
                        className="h-full w-full object-cover" 
                        alt="Property thumbnail"
                      />
                   </div>
                   <div className="text-sm">
                      <span className="font-semibold text-primary mr-2 uppercase tracking-tight text-[10px]">Discussing:</span>
                      <span className="font-semibold">{conversations.find(c => c.id === selectedId)?.property.title}</span>
                   </div>
                </div>
                <Button variant="link" className="font-semibold text-xs h-8 text-primary" asChild>
                   <Link to={`${ROUTES.PROPERTY_DETAIL}/slug`}>View Property</Link>
                </Button>
             </div>

             {/* Message Flow Placeholder */}
             <ScrollArea className="flex-1 p-6">
                <div className="space-y-6 flex flex-col">
                   <div className="text-center">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest bg-secondary/30 px-3 py-1 rounded-full">February 24, 2026</span>
                   </div>

                   <div className="flex flex-col gap-4">
                      {/* Received Message */}
                      <div className="flex gap-3 max-w-[80%]">
                         <Avatar className="h-7 w-7 mt-0.5">
                            <AvatarImage src={conversations.find(c => c.id === selectedId)?.user.avatar} />
                            <AvatarFallback>U</AvatarFallback>
                         </Avatar>
                         <div className="space-y-1">
                            <div className="bg-background rounded-2xl rounded-tl-none p-4 shadow-sm border border-border/50 font-medium text-[14px] leading-relaxed">
                               Hello! I'm interested in the property you listed. Is it still available for viewing this weekend?
                            </div>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">10:15 AM</span>
                         </div>
                      </div>

                      {/* Sent Message */}
                      <div className="flex flex-col items-end gap-1 ml-auto max-w-[80%]">
                         <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-4 shadow-lg shadow-primary/10 font-medium text-[14px] leading-relaxed">
                            Hi! Yes, it is still available. I have slots on Saturday morning at 10:00 and 11:30. Would either of those work for you?
                         </div>
                         <div className="flex items-center gap-1.5 mr-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">10:20 AM</span>
                            <CheckCircle2 size={10} className="text-primary" />
                         </div>
                      </div>
                   </div>
                </div>
             </ScrollArea>

             {/* Chat Input */}
             <footer className="p-4 bg-background/50 backdrop-blur-xl border-t border-border/50">
                <div className="max-w-3xl mx-auto relative">
                   <div className="flex items-end gap-2 bg-secondary/30 rounded-[1.5rem] p-1.5 border border-border/50 focus-within:bg-background focus-within:border-primary/30 transition-all">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0">
                         <Plus size={20} className="text-muted-foreground" />
                      </Button>
                      <textarea 
                        placeholder="Message..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] font-medium py-2 px-1 min-h-[40px] max-h-[100px] resize-none"
                        rows={1}
                      />
                      <div className="flex items-center gap-1 mr-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                           <Smile size={20} className="text-muted-foreground" />
                        </Button>
                        <Button variant="default" size="icon" className="h-9 w-9 rounded-full shadow-lg bg-primary">
                           <Send size={16} />
                        </Button>
                      </div>
                   </div>
                </div>
             </footer>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
             <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center text-4xl shadow-inner">
                💬
             </div>
             <div className="max-w-sm space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Your Conversations</h2>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">Select a direct message from the left to start chatting with buyers or sellers.</p>
             </div>
             <div className="flex gap-4">
                <Button className="rounded-xl font-semibold shadow-xl h-11 px-8 bg-primary">Start New Chat</Button>
             </div>
          </div>
        )}
      </main>

      {/* Mobile Empty State (If list pane is hidden) */}
      <div className={cn(
        "flex-1 flex flex-col bg-background lg:hidden",
        !selectedId && "hidden"
      )}>
         {/* This will be handled by ConversationPage.tsx or a routing redirect */}
      </div>
    </div>
  )
}
