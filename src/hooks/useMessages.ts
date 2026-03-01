import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'
import { useAuth } from '@/hooks/useAuth'

type ConversationListRow = Database['public']['Tables']['conversations']['Row']
type MessageRow = Database['public']['Tables']['messages']['Row']

export interface ConversationWithDetails extends ConversationListRow {
  other_user: {
    id: string
    full_name: string
    avatar_url: string | null
  }
  property: {
    title: string
    slug: string
    cover_image_url: string | null
  } | null
  latest_message: string | null
}

export function useMessages(activeConversationId?: string) {
  const { session } = useAuth()
  const user = session?.user ?? null
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([])
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all conversations for the user
  const fetchConversations = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          buyer:buyer_id(id, full_name, avatar_url),
          seller:seller_id(id, full_name, avatar_url),
          property:property_id(title, slug, cover_image_url)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false })

      if (error) throw error

      // Transform data to easily access "other_user" details
      const formattedConversations: ConversationWithDetails[] = data.map((conv: any) => {
        const isBuyer = conv.buyer_id === user.id
        const otherUser = isBuyer ? conv.seller : conv.buyer

        return {
          ...conv,
          other_user: otherUser,
          property: conv.property,
          latest_message: null 
        }
      })

      setConversations(formattedConversations)
    } catch (err) {
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages for a specific conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  // Send a new message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !content.trim()) return

    try {
      const { error } = await (supabase
        .from('messages') as any)
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        })

      if (error) throw error
      // Opt: Optimistic UI update could happen here, or let Realtime handle it
      fetchConversations() // update the 'last_message_at' order
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }

  // Archive a conversation
  const archiveConversation = async (conversationId: string) => {
    try {
      const { error } = await (supabase
        .from('conversations') as any)
        .update({ status: 'archived' })
        .eq('id', conversationId)

      if (error) throw error
      fetchConversations()
    } catch (err) {
      console.error('Error archiving conversation:', err)
      throw err
    }
  }

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await (supabase
        .from('conversations') as any)
        .delete()
        .eq('id', conversationId)

      if (error) throw error
      fetchConversations()
    } catch (err) {
      console.error('Error deleting conversation:', err)
      throw err
    }
  }

  // Submit a review for a user/property
  const submitReview = async (reviewData: {
    reviewed_id: string
    rating: number
    comment?: string
    property_id?: string
  }) => {
    if (!user) return
    try {
      const { error } = await (supabase
        .from('reviews') as any)
        .insert({
          reviewer_id: user.id,
          reviewed_id: reviewData.reviewed_id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          property_id: reviewData.property_id
        })

      if (error) throw error
    } catch (err) {
      console.error('Error submitting review:', err)
      throw err
    }
  }

  // Mark all unread messages in a conversation as read
  const markAsRead = async (conversationId: string) => {
    if (!user) return
    try {
      const { error } = await (supabase
        .from('messages') as any)
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null)

      if (error) throw error
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  // Effect: Fetch initial conversations
  useEffect(() => {
    fetchConversations()
  }, [user])

  // Effect: Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId)
      markAsRead(activeConversationId)
    } else {
      setMessages([])
    }
  }, [activeConversationId])

  // Effect: Subscribe to Realtime for Messages
  useEffect(() => {
    if (!user || !activeConversationId) return

    const channel = supabase
      .channel(`room:${activeConversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT and UPDATE (read receipts)
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConversationId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new as MessageRow])
            if (payload.new.sender_id !== user.id) {
               markAsRead(activeConversationId)
            }
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) => 
               prev.map(msg => msg.id === payload.new.id ? (payload.new as MessageRow) : msg)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, activeConversationId])

  // Effect: Subscribe to Realtime for Conversations (List reordering)
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('public:conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          // A naive refresh - in production you'd merge the payload into state
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
       supabase.removeChannel(channel)
    }
  }, [user])


  return {
    conversations,
    messages,
    loading,
    sendMessage,
    archiveConversation,
    deleteConversation,
    submitReview,
    refreshConversations: fetchConversations
  }
}
