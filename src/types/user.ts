import type { Database } from './supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserType = Profile['user_type']

export interface PublicProfile {
  id: string
  full_name: string
  username: string
  avatar_url: string | null
  cover_url: string | null
  bio: string | null
  city: string | null
  country: string | null
  is_verified: boolean
  user_type: UserType
  listing_count: number
  rating: number | null
  response_time_hours: number | null
  member_since: string
}
