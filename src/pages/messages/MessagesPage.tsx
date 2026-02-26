import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Search, 
  MoreVertical, 
  CheckCircle2, 
  Plus, 
  Settings,
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
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* List Pane */}
      <aside className={cn(
        "w-full lg:w-96 flex flex-col border-r border-border/50 bg-background/50 backdrop-blur-xl",
        selectedId && "hidden lg:flex"
      )}>
        <header className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight">Messages</h1>
            <div className="flex gap-2">
               <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2">
                 <Settings size={18} />
               </Button>
               <Button variant="default" size="icon" className="h-10 w-10 rounded-xl shadow-lg">
                 <Plus size={18} />
               </Button>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <Input 
              placeholder="Search conversations..." 
              className="h-12 pl-12 bg-secondary/30 border-none rounded-2xl font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             <Badge variant="default" className="rounded-xl px-4 py-2 font-bold cursor-pointer">All Chats</Badge>
             <Badge variant="outline" className="rounded-xl px-4 py-2 font-bold cursor-pointer border-2 hover:bg-secondary">Unread</Badge>
             <Badge variant="outline" className="rounded-xl px-4 py-2 font-bold cursor-pointer border-2 hover:bg-secondary">Buying</Badge>
             <Badge variant="outline" className="rounded-xl px-4 py-2 font-bold cursor-pointer border-2 hover:bg-secondary">Selling</Badge>
          </div>
        </header>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-6">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={cn(
                  "w-full p-4 rounded-[1.5rem] flex gap-4 transition-all duration-300 text-left group relative overflow-hidden",
                  selectedId === conv.id ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]" : "hover:bg-secondary/50"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                    <AvatarImage src={conv.user.avatar} />
                    <AvatarFallback className="font-bold">{conv.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base truncate pr-2">{conv.user.name}</h3>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      selectedId === conv.id ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {conv.time}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                     <Badge variant="outline" className={cn(
                        "text-[9px] font-black uppercase tracking-tighter py-0 px-1.5 h-4 border-none",
                        selectedId === conv.id ? "bg-white/20 text-white" : "bg-primary/5 text-primary"
                     )}>
                        {conv.user.role}
                     </Badge>
                     <p className={cn(
                       "text-[11px] font-bold truncate",
                       selectedId === conv.id ? "text-white/80" : "text-muted-foreground/80"
                     )}>
                       {conv.property.title}
                     </p>
                  </div>

                  <p className={cn(
                    "text-sm font-medium line-clamp-1 mt-0.5",
                    selectedId === conv.id ? "text-white/90" : "text-muted-foreground"
                  )}>
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.unread > 0 && selectedId !== conv.id && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary rounded-full" />
                )}
                {conv.unread > 0 && selectedId !== conv.id && (
                  <Badge className="absolute right-4 bottom-4 h-6 w-6 rounded-full flex items-center justify-center p-0 font-black text-[10px] shadow-lg">
                    {conv.unread}
                  </Badge>
                )}
              </button>
            ))}

            {filteredConversations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl">📭</div>
                <div>
                  <h4 className="font-bold">No chats found</h4>
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
             <header className="p-6 bg-background/50 backdrop-blur-xl border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                     <AvatarImage src={conversations.find(c => c.id === selectedId)?.user.avatar} />
                     <AvatarFallback>U</AvatarFallback>
                   </Avatar>
                   <div>
                      <h2 className="text-lg font-black tracking-tight">{conversations.find(c => c.id === selectedId)?.user.name}</h2>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                         <div className="h-2 w-2 bg-green-500 rounded-full" />
                         Active Now
                      </div>
                   </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" className="rounded-xl font-bold border-2">Profile</Button>
                   <Button variant="outline" size="icon" className="rounded-xl border-2">
                      <MoreVertical size={20} />
                   </Button>
                </div>
             </header>

             {/* Property Context Bar */}
             <div className="p-3 bg-primary/5 border-b border-primary/10 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-lg overflow-hidden border border-border shadow-sm">
                      <img 
                        src={conversations.find(c => c.id === selectedId)?.property.image} 
                        className="h-full w-full object-cover" 
                        alt="Property thumbnail"
                      />
                   </div>
                   <div className="text-sm">
                      <span className="font-bold text-primary mr-2 uppercase tracking-tighter text-[10px]">Discussing:</span>
                      <span className="font-bold">{conversations.find(c => c.id === selectedId)?.property.title}</span>
                   </div>
                </div>
                <Button variant="link" className="font-bold text-xs" asChild>
                   <Link to={`${ROUTES.PROPERTY_DETAIL}/slug`}>View Property</Link>
                </Button>
             </div>

             {/* Message Flow Placeholder */}
             <ScrollArea className="flex-1 p-8">
                <div className="space-y-8 flex flex-col">
                   <div className="text-center">
                      <Badge variant="secondary" className="rounded-md font-bold text-[10px] px-3 uppercase text-muted-foreground/60">February 24, 2026</Badge>
                   </div>

                   <div className="flex flex-col gap-6">
                      {/* Received Message */}
                      <div className="flex gap-4 max-w-[80%]">
                         <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={conversations.find(c => c.id === selectedId)?.user.avatar} />
                            <AvatarFallback>U</AvatarFallback>
                         </Avatar>
                         <div className="space-y-1">
                            <div className="bg-background rounded-2xl rounded-tl-none p-4 shadow-sm border border-border/50 font-medium text-sm leading-relaxed">
                               Hello! I'm interested in the property you listed. Is it still available for viewing this weekend?
                            </div>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">10:15 AM</span>
                         </div>
                      </div>

                      {/* Sent Message */}
                      <div className="flex flex-col items-end gap-1 ml-auto max-w-[80%]">
                         <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none p-4 shadow-lg shadow-primary/10 font-medium text-sm leading-relaxed">
                            Hi! Yes, it is still available. I have slots on Saturday morning at 10:00 and 11:30. Would either of those work for you?
                         </div>
                         <div className="flex items-center gap-1.5 mr-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">10:20 AM</span>
                            <CheckCircle2 size={12} className="text-primary" />
                         </div>
                      </div>

                      <div className="flex gap-4 max-w-[80%]">
                         <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src={conversations.find(c => c.id === selectedId)?.user.avatar} />
                            <AvatarFallback>U</AvatarFallback>
                         </Avatar>
                         <div className="space-y-1">
                            <div className="bg-background rounded-2xl rounded-tl-none p-4 shadow-sm border border-border/50 font-medium text-sm leading-relaxed">
                               Perfect! Saturday at 11:30 works for me. Can you send me the exact location?
                            </div>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase ml-1">10:22 AM</span>
                         </div>
                      </div>
                   </div>
                </div>
             </ScrollArea>

             {/* Chat Input */}
             <footer className="p-6 bg-background/50 backdrop-blur-xl border-t border-border/50">
                <div className="max-w-4xl mx-auto relative">
                   <div className="flex items-end gap-3 bg-secondary/30 rounded-[2rem] p-3 border border-border/50 focus-within:bg-background focus-within:border-primary/30 transition-all">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full shrink-0">
                         <Plus size={20} className="text-muted-foreground" />
                      </Button>
                      <textarea 
                        placeholder="Type your message..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-2 px-1 min-h-[40px] max-h-[120px] resize-none"
                        rows={1}
                      />
                      <div className="flex items-center gap-1 mr-1">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                           <Smile size={20} className="text-muted-foreground" />
                        </Button>
                        <Button variant="default" size="icon" className="h-10 w-10 rounded-full shadow-lg shadow-primary/20 bg-primary hover:scale-110 transition-transform">
                           <Send size={18} />
                        </Button>
                      </div>
                   </div>
                </div>
             </footer>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
             <div className="h-32 w-32 rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center text-6xl shadow-inner animate-pulse">
                💬
             </div>
             <div className="max-w-sm space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Your Conversations</h2>
                <p className="text-muted-foreground font-medium">Select a direct message from the left to start chatting with buyers or sellers.</p>
             </div>
             <div className="flex gap-4">
                <Button variant="outline" className="rounded-xl font-bold border-2 h-12 px-6">Archived Chats</Button>
                <Button className="rounded-xl font-bold shadow-xl h-12 px-8">Start New Chat</Button>
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
