import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png', 'icons/*.ico', 'fonts/*.woff2'],
      manifest: {
        name: 'BlueOak',
        short_name: 'BlueOak',
        description: 'Find, buy, rent and sell properties across Africa and beyond.',
        theme_color: '#1E3A5F',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icons/logo.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
        screenshots: [
          { src: '/screenshots/desktop.png', sizes: '1280x800', type: 'image/png', form_factor: 'wide' },
          { src: '/screenshots/mobile.png',  sizes: '390x844',  type: 'image/png', form_factor: 'narrow' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-api', expiration: { maxEntries: 100, maxAgeSeconds: 300 } },
          },
          {
            urlPattern: /^https:\/\/.*supabase\.co\/storage\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'supabase-storage', expiration: { maxEntries: 200, maxAgeSeconds: 86400 } },
          },
          {
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-maps', expiration: { maxEntries: 50, maxAgeSeconds: 86400 } },
          },
        ],
      },
      devOptions: { enabled: true },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:    ['react', 'react-dom', 'react-router-dom'],
          ui:        ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'lucide-react'],
          query:     ['@tanstack/react-query'],
          supabase:  ['@supabase/supabase-js'],
          maps:      ['@vis.gl/react-google-maps', '@googlemaps/js-api-loader'],
          charts:    ['recharts'],
          forms:     ['react-hook-form', 'zod'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
