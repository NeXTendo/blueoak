import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function useSavedProperties() {
  const { session } = useAuth()
  const user = session?.user ?? null
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  // Fetch all saved property IDs for the current user
  useEffect(() => {
    if (!user) {
      setSavedIds(new Set())
      return
    }

    const fetchSaved = async () => {
      setLoading(true)
      try {
        const { data, error } = await (supabase
          .from('saved_properties') as any)
          .select('property_id')
          .eq('user_id', user.id)

        if (error) throw error
        setSavedIds(new Set(data.map((row: any) => row.property_id as string)))
      } catch (err) {
        console.error('Failed to fetch saved properties:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSaved()
  }, [user?.id])

  const isSaved = useCallback(
    (propertyId: string) => savedIds.has(propertyId),
    [savedIds]
  )

  const toggleSave = useCallback(
    async (propertyId: string) => {
      if (!user) {
        toast.error('Sign in to save properties')
        return
      }

      const alreadySaved = savedIds.has(propertyId)

      // Optimistic update
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (alreadySaved) {
          next.delete(propertyId)
        } else {
          next.add(propertyId)
        }
        return next
      })

      try {
        if (alreadySaved) {
          const { error } = await (supabase
            .from('saved_properties') as any)
            .delete()
            .eq('user_id', user.id)
            .eq('property_id', propertyId)

          if (error) throw error
          toast.success('Removed from saved')
        } else {
          const { error } = await (supabase
            .from('saved_properties') as any)
            .insert({ user_id: user.id, property_id: propertyId })

          if (error) throw error
          toast.success('Saved!')
        }
      } catch (err) {
        console.error('Toggle save failed:', err)
        toast.error('Failed to update saved. Please try again.')
        // Revert optimistic update on error
        setSavedIds((prev) => {
          const next = new Set(prev)
          if (alreadySaved) {
            next.add(propertyId)
          } else {
            next.delete(propertyId)
          }
          return next
        })
      }
    },
    [user, savedIds]
  )

  return { isSaved, toggleSave, savedIds, loading }
}
