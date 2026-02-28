import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Plus,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import { useConversations } from '@/hooks/useMessages'

export default function MessagesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: conversations, isLoading } = useConversations()

  const filteredConversations = ((conversations as unknown as any[]) || []).filter((c: any) => 
    c.other_user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.property_title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectConversation = (id: string) => {
    if (window.innerWidth < 1024) {
      navigate(`${ROUTES.MESSAGES}/${id}`)
    } else {
      setSelectedId(id)
    }
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* List Pane */}
      <aside className={cn(
        "w-full lg:w-96 flex flex-col border-r border-border/50 bg-background/50 backdrop-blur-xl",
        selectedId && "hidden lg:flex"
      )}>
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)] px-4 md:px-6 pb-4 space-y-4">
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
          </div>
        </header>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-20 md:pb-6">
            {filteredConversations.map((conv: any) => (
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
                    <AvatarImage src={conv.other_user_avatar} />
                    <AvatarFallback className="font-semibold">{conv.other_user_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[15px] truncate pr-2">{conv.other_user_name}</h3>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {formatTime(conv.last_message_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                     <p className="text-[11px] font-semibold text-primary truncate max-w-[140px]">
                       {conv.property_title}
                     </p>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground line-clamp-1 mt-0.5">
                    {conv.last_message || 'No messages yet'}
                  </p>
                </div>

                {conv.unread_count > 0 && selectedId !== conv.id && (
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
    </div>
  )
}
