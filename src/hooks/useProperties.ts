import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { usePropertyStore } from '@/stores/propertyStore'
import type { PropertyWithSeller } from '@/types/property'
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
      } as any)
      if (error) throw error
      return data as PropertyWithSeller[]
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
      return data
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
