import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_conversations')
      if (error) throw error
      return data
    },
    staleTime: 1000 * 60, // 1 minute
  })
}

export function useChat(conversationId: string | undefined) {
  const queryClient = useQueryClient()
  const [messages, setMessages] = useState<any[]>([])

  // Initial fetch
  const { data: initialMessages, isLoading } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return []
      const { data, error } = await supabase.rpc('get_conversation_messages', {
        p_conversation_id: conversationId,
      } as any)
      if (error) throw error
      return data
    },
    enabled: !!conversationId,
  })

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages)
    }
  }, [initialMessages])

  // Real-time subscription
  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
          // Mark as read or update unread counts here if needed
          queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, queryClient])

  // Mark as read mutation
  const markAsRead = useMutation({
    mutationFn: async () => {
      if (!conversationId) return
      // Add logic here if you have a mark_conversation_read RPC
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error('No conversation selected')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content,
        } as any)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      // Real-time subscription will handle updating the message list
    },
    onError: (error: any) => {
      toast.error(`Failed to send message: ${error.message}`)
    },
  })

  return {
    messages,
    isLoading,
    sendMessage,
    markAsRead,
  }
}
