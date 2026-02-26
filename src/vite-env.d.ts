/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_PAYSTACK_PUBLIC_KEY: string
  readonly VITE_FLUTTERWAVE_PUBLIC_KEY: string
  readonly VITE_STRIPE_PUBLIC_KEY: string
  readonly VITE_VAPID_PUBLIC_KEY: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_DEFAULT_COUNTRY: string
  readonly VITE_DEFAULT_CURRENCY: string
  readonly VITE_ENABLE_AUCTIONS: string
  readonly VITE_ENABLE_SHORT_TERM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
