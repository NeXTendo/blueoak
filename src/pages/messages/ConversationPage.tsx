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
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useChat, useConversations } from '@/hooks/useMessages'
import { useProperty } from '@/hooks/useProperties'

export default function ConversationPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const [messageText, setMessageText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: conversations } = useConversations()
  const { messages, isLoading, sendMessage } = useChat(conversationId)

  const conversation = conversations?.find((c: any) => c.id === conversationId)
  const { data: property } = useProperty(conversation?.property_id || '')

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    try {
      await sendMessage.mutateAsync(messageText)
      setMessageText('')
    } catch (error) {
      // Error handled by hook toast
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* Header */}
      <header className="shrink-0 sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-border/50 pt-[env(safe-area-inset-top,0px)] px-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.MESSAGES)} className="h-9 w-9">
            <ChevronLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Avatar className="h-9 w-9 border border-border shadow-sm">
                  <AvatarImage src={conversation?.other_user_avatar} />
                  <AvatarFallback className="font-semibold">{conversation?.other_user_name?.charAt(0)}</AvatarFallback>
                </Avatar>
             </div>
             <div>
                <h2 className="text-sm font-semibold tracking-tight leading-none">{conversation?.other_user_name}</h2>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-1">Chat active</p>
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
               <img src={conversation?.property_image || property?.cover_image_url} className="h-full w-full object-cover" alt="Property" />
            </div>
            <div className="overflow-hidden">
               <span className="block text-[10px] font-semibold truncate leading-none">
                 {conversation?.property_title || property?.title}
               </span>
            </div>
         </div>
         {property && (
           <Button variant="ghost" className="h-8 px-2 text-primary font-semibold text-[11px]" asChild>
              <Link to={`${ROUTES.PROPERTY_DETAIL}/${property.slug}`}>
                 View Details
              </Link>
           </Button>
         )}
      </div>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4" ref={scrollRef}>
         {messages.map((msg: any) => {
            const isMe = msg.sender_id !== conversation?.other_user_id
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] font-medium leading-relaxed ${
                   isMe 
                   ? 'bg-primary text-primary-foreground rounded-tr-none' 
                   : 'bg-secondary/30 text-foreground rounded-tl-none'
                }`}>
                   {msg.content}
                </div>
                <div className="flex items-center gap-1.5 px-1">
                   <span className="text-[9px] font-bold text-muted-foreground uppercase">
                     {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                   {isMe && <CheckCircle2 size={10} className="text-primary" />}
                </div>
              </div>
            )
         })}
         {messages.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground opacity-50">
             <p className="text-sm font-medium">No messages yet. Send a message to start the conversation!</p>
           </div>
         )}
      </main>

      {/* Input Area */}
      <footer className="shrink-0 sticky bottom-0 z-30 p-3 pt-2 bg-background border-t border-border/50 pb-[max(env(safe-area-inset-top,0.75rem),0.75rem)]">
         <div className="flex items-end gap-2 max-w-2xl mx-auto">
            <div className="flex-1 flex items-end gap-1 bg-secondary/30 rounded-[1.5rem] p-1.5 border border-border focus-within:bg-background transition-all">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shrink-0">
                  <Plus size={20} className="text-muted-foreground" />
               </Button>
               <textarea 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Message..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] font-medium py-1.5 px-0.5 min-h-[36px] max-h-[100px] resize-none"
                  rows={1}
               />
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Smile size={20} className="text-muted-foreground" />
               </Button>
            </div>
            
            <Button 
               onClick={handleSendMessage}
               variant="default" 
               size="icon" 
               className={cn(
                  "h-10 w-10 rounded-full shrink-0 shadow-lg transition-all",
                  messageText.trim() ? "bg-primary scale-100" : "bg-muted opacity-50 scale-90"
               )}
               disabled={!messageText.trim() || sendMessage.isPending}
            >
               {sendMessage.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
         </div>
      </footer>
    </div>
  )
}
