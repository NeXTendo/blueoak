import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { PropertyWithSeller } from '@/types/property'

export interface AdminStats {
  total_users: number
  active_properties: number
  pending_properties: number
  open_reports: number
  total_reservations: number
  total_revenue: number
}

export interface AdminUser {
  id: string
  full_name: string
  email: string
  user_type: string
  is_verified: boolean
  is_banned: boolean
  created_at: string
  avatar_url: string | null
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_stats')
      if (error) throw error
      return data as AdminStats
    }
  })
}

export function useAdminProperties(status?: string) {
  return useQuery({
    queryKey: ['admin', 'properties', status],
    queryFn: async () => {
      let query = (supabase as any)
        .from('properties')
        .select(`
          *,
          seller:profiles!properties_seller_id_fkey(id, full_name, avatar_url, is_verified)
        `)
        .order('created_at', { ascending: false })

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return data as PropertyWithSeller[]
    }
  })
}

export function useAdminUsers(filter?: string) {
  return useQuery({
    queryKey: ['admin', 'users', filter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter && filter !== 'all') {
        query = query.eq('user_type', filter)
      }

      const { data, error } = await query
      if (error) throw error
      return data as AdminUser[]
    }
  })
}

export function useAdminReports(status?: string) {
  return useQuery({
    queryKey: ['admin', 'reports', status],
    queryFn: async () => {
      let query = (supabase as any)
        .from('reports')
        .select(`
          *,
          reporter:profiles!reports_reporter_id_fkey(full_name),
          property:properties(id, title),
          reported:profiles!reports_reported_user_fkey(full_name)
        `)
        .order('created_at', { ascending: false })

      if (status && status !== 'all') {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    }
  })
}

export function usePlatformSettings() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('platform_settings').select('*')
      if (error) throw error
      return data as any[]
    }
  })

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const { error } = await (supabase as any)
        .from('platform_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
      toast.success('Settings updated')
    }
  })

  return { settings, isLoading, updateSetting }
}

export function useAdminActions() {
  const queryClient = useQueryClient()

  const approveProperty = useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await (supabase as any).rpc('admin_approve_property', { p_property_id: propertyId })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast.success('Property approved successfully')
    },
    onError: (err: any) => toast.error(`Failed to approve: ${err.message}`)
  })

  const rejectProperty = useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason: string }) => {
      const { error } = await (supabase as any).rpc('admin_reject_property', { 
        p_property_id: id, 
        p_reason: reason 
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast.success('Property rejected')
    },
    onError: (err: any) => toast.error(`Failed to reject: ${err.message}`)
  })

  const toggleVerification = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: boolean }) => {
      const { error } = await (supabase as any).rpc('admin_verify_user', { 
        p_user_id: userId, 
        p_status: status 
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast.success('User verification status updated')
    },
    onError: (err: any) => toast.error(`Error: ${err.message}`)
  })

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      const { error } = await (supabase as any).rpc('admin_update_role', { 
        p_user_id: userId, 
        p_new_role: role as any
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast.success('User role updated')
    },
    onError: (err: any) => toast.error(`Error: ${err.message}`)
  })

  const toggleBan = useMutation({
    mutationFn: async ({ userId, status }: { userId: string, status: boolean }) => {
      const { error } = await (supabase as any).rpc('admin_ban_user', { 
        p_user_id: userId, 
        p_status: status 
      })
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast.success(variables.status ? 'User banned' : 'User unbanned')
    },
    onError: (err: any) => toast.error(`Error: ${err.message}`)
  })

  return {
    approveProperty,
    rejectProperty,
    toggleVerification,
    updateRole,
    toggleBan
  }
}
