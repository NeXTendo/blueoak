import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { usePropertyStore } from '@/stores/propertyStore'
import { useAuthStore } from '@/stores/authStore'
import type { PropertyWithSeller } from '@/types/property'
import type { Profile } from '@/types/user'
import { PAGE_SIZE } from '@/lib/constants'

export function useProperties() {
  const { filters, searchQuery, sortBy } = usePropertyStore()

  return useInfiniteQuery({
    queryKey: ['properties', filters, searchQuery, sortBy],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase.rpc('search_properties', {
        p_query:        searchQuery || undefined,
        p_listing_type: filters.listing_type || undefined,
        p_property_type:filters.property_type || undefined,
        p_country:      filters.country || undefined,
        p_city:         filters.city || undefined,
        p_min_price:    filters.min_price ?? undefined,
        p_max_price:    filters.max_price ?? undefined,
        p_min_beds:     filters.min_beds ?? undefined,
        p_max_beds:     filters.max_beds ?? undefined,
        p_min_area:     filters.min_area ?? undefined,
        p_max_area:     filters.max_area ?? undefined,
        p_lat:          filters.lat ?? undefined,
        p_lng:          filters.lng ?? undefined,
        p_radius_km:    filters.radius_km ?? undefined,
        p_sort_by:      sortBy,
        p_page:         pageParam,
        p_page_size:    PAGE_SIZE,
        p_min_solar_capacity: filters.min_solar_capacity || undefined,
        p_min_generator_capacity: filters.min_generator_capacity || undefined,
        p_min_water_tank_capacity: filters.min_water_tank_capacity || undefined,
        p_has_borehole: filters.has_borehole ?? undefined,
        p_has_staff_quarters: filters.has_staff_quarters ?? undefined,
        p_is_featured:  filters.is_featured ?? undefined,
      } as any)
      if (error) throw error
      return (data || []) as PropertyWithSeller[]
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    staleTime: 1000 * 60 * 5,
  })
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_property_detail', { p_slug: slug } as any)
      if (error) throw error
      return data as PropertyWithSeller
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  })
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`*, profiles:seller_id(id, full_name, avatar_url, is_verified)`)
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('updated_at', { ascending: false })
        .limit(10)
      if (error) throw error
      return data as PropertyWithSeller[]
    },
    staleTime: 1000 * 60 * 10,
  })
}

export function useSavedProperties() {
  return useQuery({
    queryKey: ['properties', 'saved'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_saved_properties')
      if (error) throw error
      return data as PropertyWithSeller[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useUserProperties() {
  const session = useAuthStore(s => s.session)
  const userId = session?.user?.id

  return useQuery({
    queryKey: ['properties', 'user', userId],
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('properties')
        .select(`*, profiles:seller_id(id, full_name, avatar_url, is_verified)`)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as PropertyWithSeller[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: ['profile', 'public', username],
    queryFn: async () => {
      if (!username) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.eq."${username}",id.eq."${username}"`)
        .single()
      
      if (error) throw error
      return data as Profile
    },
    enabled: !!username,
    staleTime: 1000 * 60 * 10,
  })
}

export function usePublicProperties(userId: string) {
  return useQuery({
    queryKey: ['properties', 'public', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('properties')
        .select(`*, profiles:seller_id(id, full_name, avatar_url, is_verified)`)
        .eq('seller_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as PropertyWithSeller[]
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}

export function usePublicReviews(userId: string) {
  return useQuery({
    queryKey: ['reviews', 'public', userId],
    queryFn: async () => {
      if (!userId) return []
      const { data, error } = await supabase
        .from('reviews')
        .select(`*, profiles:reviewer_id(id, full_name, avatar_url)`)
        .eq('reviewed_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  })
}
