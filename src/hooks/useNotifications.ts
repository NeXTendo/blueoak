import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'

export function useNotifications() {
  const profile     = useAuthStore((s) => s.profile)
  const qc          = useQueryClient()
  const { addNotification, setUnreadCount } = useNotificationStore()

  const query = useQuery({
    queryKey: ['notifications', profile?.id],
    queryFn:  async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile!.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      const notifications = data as any[]
      const unread = (notifications ?? []).filter((n) => !n.is_read).length
      setUnreadCount(unread)
      return notifications
    },
    enabled: !!profile?.id,
    staleTime: 1000 * 30,
  })

  // Realtime subscription
  useEffect(() => {
    if (!profile?.id) return
    const channel = supabase
      .channel(`notifications:${profile.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `user_id=eq.${profile.id}`,
      }, (payload) => {
        addNotification(payload.new as never)
        qc.invalidateQueries({ queryKey: ['notifications', profile.id] })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [profile?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const markAllRead = useMutation({
    mutationFn: async () => {
      await supabase.rpc('mark_all_notifications_read')
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notifications', profile?.id] })
    },
  })

  return { ...query, markAllRead }
}

export function useUnreadCount() {
  const profile    = useAuthStore((s) => s.profile)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  useQuery({
    queryKey: ['notifications', 'unread-count', profile?.id],
    queryFn:  async () => {
      const { data, error } = await supabase.rpc('get_unread_notification_count')
      if (error) throw error
      useNotificationStore.getState().setUnreadCount(data as number)
      return data as number
    },
    enabled:   !!profile?.id,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60, // poll every minute as fallback
  })

  return unreadCount
}
