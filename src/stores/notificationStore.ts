import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  is_read: boolean
  action_url: string | null
  created_at: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount:   number
}

interface NotificationActions {
  setNotifications: (notifications: Notification[]) => void
  addNotification:  (notification: Notification) => void
  markRead:         (id: string) => void
  markAllRead:      () => void
  setUnreadCount:   (count: number) => void
}

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  immer((set) => ({
    notifications: [],
    unreadCount:   0,

    setNotifications: (notifications) => set((s) => { s.notifications = notifications }),
    addNotification:  (notification)  => set((s) => {
      s.notifications.unshift(notification)
      s.unreadCount += 1
    }),
    markRead: (id) => set((s) => {
      const n = s.notifications.find((x) => x.id === id)
      if (n && !n.is_read) { n.is_read = true; s.unreadCount = Math.max(0, s.unreadCount - 1) }
    }),
    markAllRead: () => set((s) => {
      s.notifications.forEach((n) => { n.is_read = true })
      s.unreadCount = 0
    }),
    setUnreadCount: (count) => set((s) => { s.unreadCount = count }),
  }))
)
