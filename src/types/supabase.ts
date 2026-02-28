// AUTO-GENERATED — regenerate with: npm run supabase:types
// Placeholder until Supabase project is connected

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          username: string | null
          email: string
          phone: string | null
          whatsapp: string | null
          avatar_url: string | null
          cover_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          website: string | null
          user_type: 'buyer' | 'seller' | 'agent' | 'admin' | 'super_admin'
          is_verified: boolean
          is_banned: boolean
          preferred_currency: string
          preferred_language: string
          listing_count: number
          rating: number | null
          response_time_hours: number | null
          push_token: string | null
          last_seen_at: string | null
          email_notifications: boolean
          push_notifications: boolean
          message_notifications: boolean
          dark_mode: boolean
          status: 'active' | 'hibernated'
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      properties: {
        Row: {
          id: string
          seller_id: string
          title: string
          slug: string
          reference: string
          description: string | null
          listing_type: 'sale' | 'rent' | 'short_term' | 'lease' | 'auction'
          property_type: string
          status: 'active' | 'pending' | 'sold' | 'rented' | 'archived' | 'rejected' | 'draft'
          country: string
          province: string | null
          city: string
          suburb: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          bedrooms: number | null
          bathrooms: number | null
          floor_area: number | null
          lot_area: number | null
          garages: number | null
          parking: number | null
          floors: number | null
          year_built: number | null
          furnishing: string | null
          asking_price: number | null
          currency: string
          negotiable: boolean
          monthly_rent: number | null
          deposit: number | null
          nightly_rate: number | null
          is_featured: boolean
          featured_until: string | null
          view_count: number
          save_count: number
          cover_image_url: string | null
          amenities: string[]
          created_at: string
          updated_at: string
          available_from: string | null
          condition: string | null
          erf_number: string | null
        }
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at' | 'view_count' | 'save_count' | 'slug' | 'reference'>
        Update: Partial<Database['public']['Tables']['properties']['Row']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          content: string
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at' | 'is_read'>
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }
    }
    Views: Record<string, never>
    Functions: {
      search_properties: {
        Args: {
          p_listing_type?: string
          p_property_type?: string
          p_country?: string
          p_city?: string
          p_min_price?: number
          p_max_price?: number
          p_min_beds?: number
          p_max_beds?: number
          p_min_area?: number
          p_max_area?: number
          p_lat?: number
          p_lng?: number
          p_radius_km?: number
          p_query?: string
          p_sort_by?: string
          p_page?: number
          p_page_size?: number
        }
        Returns: Database['public']['Tables']['properties']['Row'][]
      }
      toggle_saved_property: {
        Args: { p_property_id: string }
        Returns: { saved: boolean }
      }
      get_unread_notification_count: {
        Args: Record<string, never>
        Returns: number
      }
      mark_all_notifications_read: {
        Args: Record<string, never>
        Returns: void
      }
      get_property_detail: {
        Args: { p_slug: string }
        Returns: Database['public']['Tables']['properties']['Row'] & {
          seller: Database['public']['Tables']['profiles']['Row']
          media: Array<{ url: string; type: 'image' | 'video'; order: number }>
        }
      }
    }
    Enums: {
      user_type: 'buyer' | 'seller' | 'agent' | 'admin' | 'super_admin'
      listing_type: 'sale' | 'rent' | 'short_term' | 'lease' | 'auction'
      property_status: 'active' | 'pending' | 'sold' | 'rented' | 'archived' | 'rejected' | 'draft'
      reservation_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
      notification_type: 'new_message' | 'reservation_created' | 'reservation_confirmed' | 'reservation_cancelled' | 'property_approved' | 'property_rejected' | 'price_drop_alert' | 'new_listing_match' | 'auction_outbid' | 'auction_won' | 'account_verified' | 'system_announcement'
    }
  }
}
