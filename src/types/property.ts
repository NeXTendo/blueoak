import type { Database } from './supabase'

export type Property = Database['public']['Tables']['properties']['Row'] & {
  available_from?: string | null
  available_from_date?: string | null
  expiry_date?: string | null
  language?: string
  price_negotiable?: boolean
  price_display_option?: 'show' | 'contact' | 'on_application'
  weekly_rate?: number | null
  weekend_rate?: number | null
  monthly_rate_short?: number | null
  cleaning_fee?: number | null
  min_stay_nights?: number | null
  max_stay_nights?: number | null
  annual_escalation_pct?: number | null
  levy_fee?: number | null
  rates_taxes?: number | null
  utilities_included?: boolean
  reserve_price?: number | null
  starting_bid?: number | null
  bid_increment?: number | null
  auction_end_date?: string | null
  auction_type?: 'online' | 'in_person' | 'hybrid'
  auction_venue?: string | null
  province?: string | null
  suburb?: string | null
  street_address?: string | null
  display_address_option?: 'full' | 'suburb' | 'city'
  postal_code?: string | null
  estate_name?: string | null
  distance_to_cbd?: number | null
  zoning?: string | null
  ensuites?: number | null
  toilets_separate?: number | null
  carports?: number | null
  total_floors?: number | null
  floor_number?: number | null
  unit_number?: number | null
  garden_area?: number | null
  renovation_year?: number | null
  property_condition?: string | null
  furnishing_status?: string | null
  kitchens_count?: number | null
  living_rooms_count?: number | null
  staff_quarters?: boolean
  borehole?: boolean
  water_tank_capacity?: number | null
  solar_panel_capacity?: number | null
  generator_capacity?: number | null
}
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']

export type ListingType = 'sale' | 'rent' | 'short_term' | 'lease' | 'auction'
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented' | 'archived' | 'rejected' | 'draft'

export interface PropertyWithSeller extends Property {
  seller: {
    id: string
    full_name: string
    username: string | null
    avatar_url: string | null
    is_verified: boolean
    rating: number | null
    response_time_hours: number | null
    phone: string | null
    whatsapp: string | null
  }
  media: Array<{ url: string; type: 'image' | 'video'; order: number }>
  is_saved?: boolean
}

export interface PropertyFilters {
  listing_type?: ListingType
  property_type?: string
  country?: string
  city?: string
  suburb?: string
  min_price?: number
  max_price?: number
  min_beds?: number
  max_beds?: number
  min_baths?: number
  min_area?: number
  max_area?: number
  amenities?: string[]
  furnishing?: string
  condition?: string
  is_featured?: boolean
  has_pool?: boolean
  has_solar?: boolean
  has_generator?: boolean
  pet_friendly?: boolean
  query?: string
  lat?: number
  lng?: number
  radius_km?: number
  available_from?: string
  min_solar_capacity?: number
  min_generator_capacity?: number
  min_water_tank_capacity?: number
  has_borehole?: boolean
  has_staff_quarters?: boolean
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'price_per_sqm'
  | 'most_popular'
  | 'most_saved'
  | 'nearest'
  | 'auction_ending'
  | 'most_reduced'

export type ViewMode = 'grid' | 'list' | 'map'
