import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { useRole } from '@/hooks/useRole'
import { Button } from '@/components/ui/button'
import { X, Check } from 'lucide-react'

export function AdminNotifier() {
  const { session } = useAuthStore()
  const { isAdmin } = useRole()

  useEffect(() => {
    // Only subscribe if an admin is logged in
    if (!session || !isAdmin) return

    // Request notification permission if we want OS-level notifications
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }

    const channel = supabase
      .channel('admin_property_inserts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'properties',
          filter: 'status=eq.pending'
        },
        (payload) => {
          const newProperty = payload.new

          // Fire OS notification (if granted)
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('New Property Pending Approval', {
              body: `${newProperty.title} requires review.`,
              icon: '/icon.png' // Modify if you have an icon
            })
          }

          // Trigger rich Sonner Toast for immediate action
          toast(
             `New Listing: ${newProperty.title}`,
             {
               description: "A new property was listed and requires admin approval.",
               duration: 30000, // 30 seconds to react
               action: (
                 <div className="flex items-center gap-2 w-full mt-2">
                   <Button 
                     size="sm" 
                     className="flex-1 bg-green-600 hover:bg-green-700 text-white h-8 text-[10px] font-bold uppercase tracking-widest gap-2"
                     onClick={async () => {
                       await (supabase.from('properties') as any).update({ status: 'active' }).eq('id', newProperty.id)
                       toast.success(`Approved: ${newProperty.title}`)
                     }}
                   >
                     <Check size={14} /> Approve
                   </Button>
                   <Button 
                     size="sm" 
                     variant="destructive"
                     className="flex-1 h-8 text-[10px] font-bold uppercase tracking-widest gap-2"
                     onClick={async () => {
                       await (supabase.from('properties') as any).update({ status: 'rejected' }).eq('id', newProperty.id)
                       toast.info(`Rejected: ${newProperty.title}`)
                     }}
                   >
                     <X size={14} /> Reject
                   </Button>
                 </div>
               ),
               cancel: {
                 label: 'Dismiss',
                 onClick: () => {}
               }
             }
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session, isAdmin])

  return null // Renderless provider component
}
