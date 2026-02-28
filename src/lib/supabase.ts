import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error(
    '⚠️ Missing Supabase environment variables.',
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel dashboard.',
    'Go to: Settings → Environment Variables. Then redeploy your app.'
  )
}

console.log('[Supabase] Initializing client with URL:', supabaseUrl)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'blueoak-supabase-session',
  },
})
