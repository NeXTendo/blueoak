import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Missing Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).',
    'The app will render but API calls will fail.',
    'Set these in your Vercel dashboard under Settings → Environment Variables.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'blueoak-supabase-session',
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
})
