// vite.config.ts
import path from "path";
import { defineConfig } from "file:///D:/Code/blueoak/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Code/blueoak/node_modules/@vitejs/plugin-react/dist/index.js";
import { VitePWA } from "file:///D:/Code/blueoak/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "D:\\Code\\blueoak";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png", "icons/*.ico", "fonts/*.woff2"],
      manifest: {
        name: "BlueOak",
        short_name: "BlueOak",
        description: "Find, buy, rent and sell properties across Africa and beyond.",
        theme_color: "#1E3A5F",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icons/icon-72.png", sizes: "72x72", type: "image/png" },
          { src: "/icons/icon-96.png", sizes: "96x96", type: "image/png" },
          { src: "/icons/icon-128.png", sizes: "128x128", type: "image/png" },
          { src: "/icons/icon-144.png", sizes: "144x144", type: "image/png" },
          { src: "/icons/icon-152.png", sizes: "152x152", type: "image/png" },
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-384.png", sizes: "384x384", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ],
        screenshots: [
          { src: "/screenshots/desktop.png", sizes: "1280x800", type: "image/png", form_factor: "wide" },
          { src: "/screenshots/mobile.png", sizes: "390x844", type: "image/png", form_factor: "narrow" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*supabase\.co\/rest\/.*/i,
            handler: "NetworkFirst",
            options: { cacheName: "supabase-api", expiration: { maxEntries: 100, maxAgeSeconds: 300 } }
          },
          {
            urlPattern: /^https:\/\/.*supabase\.co\/storage\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "supabase-storage", expiration: { maxEntries: 200, maxAgeSeconds: 86400 } }
          },
          {
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-maps", expiration: { maxEntries: 50, maxAgeSeconds: 86400 } }
          }
        ]
      },
      devOptions: { enabled: true }
    })
  ],
  resolve: {
    alias: { "@": path.resolve(__vite_injected_original_dirname, "./src") }
  },
  build: {
    target: "esnext",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "lucide-react"],
          query: ["@tanstack/react-query"],
          supabase: ["@supabase/supabase-js"],
          maps: ["@vis.gl/react-google-maps", "@googlemaps/js-api-loader"],
          charts: ["recharts"],
          forms: ["react-hook-form", "zod"]
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDb2RlXFxcXGJsdWVvYWtcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXENvZGVcXFxcYmx1ZW9ha1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovQ29kZS9ibHVlb2FrL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgaW5jbHVkZUFzc2V0czogWydpY29ucy8qLnBuZycsICdpY29ucy8qLmljbycsICdmb250cy8qLndvZmYyJ10sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiAnQmx1ZU9haycsXG4gICAgICAgIHNob3J0X25hbWU6ICdCbHVlT2FrJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdGaW5kLCBidXksIHJlbnQgYW5kIHNlbGwgcHJvcGVydGllcyBhY3Jvc3MgQWZyaWNhIGFuZCBiZXlvbmQuJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjMUUzQTVGJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNGRkZGRkYnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIG9yaWVudGF0aW9uOiAncG9ydHJhaXQnLFxuICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICBzdGFydF91cmw6ICcvJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7IHNyYzogJy9pY29ucy9pY29uLTcyLnBuZycsICAgICAgICAgICBzaXplczogJzcyeDcyJywgICB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tOTYucG5nJywgICAgICAgICAgICBzaXplczogJzk2eDk2JywgICB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tMTI4LnBuZycsICAgICAgICAgICBzaXplczogJzEyOHgxMjgnLCB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tMTQ0LnBuZycsICAgICAgICAgICBzaXplczogJzE0NHgxNDQnLCB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tMTUyLnBuZycsICAgICAgICAgICBzaXplczogJzE1MngxNTInLCB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tMTkyLnBuZycsICAgICAgICAgICBzaXplczogJzE5MngxOTInLCB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tMzg0LnBuZycsICAgICAgICAgICBzaXplczogJzM4NHgzODQnLCB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tNTEyLnBuZycsICAgICAgICAgICBzaXplczogJzUxMng1MTInLCB0eXBlOiAnaW1hZ2UvcG5nJyB9LFxuICAgICAgICAgIHsgc3JjOiAnL2ljb25zL2ljb24tNTEyLW1hc2thYmxlLnBuZycsICBzaXplczogJzUxMng1MTInLCB0eXBlOiAnaW1hZ2UvcG5nJywgcHVycG9zZTogJ21hc2thYmxlJyB9LFxuICAgICAgICBdLFxuICAgICAgICBzY3JlZW5zaG90czogW1xuICAgICAgICAgIHsgc3JjOiAnL3NjcmVlbnNob3RzL2Rlc2t0b3AucG5nJywgc2l6ZXM6ICcxMjgweDgwMCcsIHR5cGU6ICdpbWFnZS9wbmcnLCBmb3JtX2ZhY3RvcjogJ3dpZGUnIH0sXG4gICAgICAgICAgeyBzcmM6ICcvc2NyZWVuc2hvdHMvbW9iaWxlLnBuZycsICBzaXplczogJzM5MHg4NDQnLCAgdHlwZTogJ2ltYWdlL3BuZycsIGZvcm1fZmFjdG9yOiAnbmFycm93JyB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnLHdvZmYyfSddLFxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvLipzdXBhYmFzZVxcLmNvXFwvcmVzdFxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiAnTmV0d29ya0ZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHsgY2FjaGVOYW1lOiAnc3VwYWJhc2UtYXBpJywgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiAxMDAsIG1heEFnZVNlY29uZHM6IDMwMCB9IH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcLy4qc3VwYWJhc2VcXC5jb1xcL3N0b3JhZ2VcXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczogeyBjYWNoZU5hbWU6ICdzdXBhYmFzZS1zdG9yYWdlJywgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiAyMDAsIG1heEFnZVNlY29uZHM6IDg2NDAwIH0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvbWFwc1xcLmdvb2dsZWFwaXNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczogeyBjYWNoZU5hbWU6ICdnb29nbGUtbWFwcycsIGV4cGlyYXRpb246IHsgbWF4RW50cmllczogNTAsIG1heEFnZVNlY29uZHM6IDg2NDAwIH0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGRldk9wdGlvbnM6IHsgZW5hYmxlZDogdHJ1ZSB9LFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHsgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6ICAgIFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICB1aTogICAgICAgIFsnQHJhZGl4LXVpL3JlYWN0LWRpYWxvZycsICdAcmFkaXgtdWkvcmVhY3QtZHJvcGRvd24tbWVudScsICdsdWNpZGUtcmVhY3QnXSxcbiAgICAgICAgICBxdWVyeTogICAgIFsnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5J10sXG4gICAgICAgICAgc3VwYWJhc2U6ICBbJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyddLFxuICAgICAgICAgIG1hcHM6ICAgICAgWydAdmlzLmdsL3JlYWN0LWdvb2dsZS1tYXBzJywgJ0Bnb29nbGVtYXBzL2pzLWFwaS1sb2FkZXInXSxcbiAgICAgICAgICBjaGFydHM6ICAgIFsncmVjaGFydHMnXSxcbiAgICAgICAgICBmb3JtczogICAgIFsncmVhY3QtaG9vay1mb3JtJywgJ3pvZCddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIGhvc3Q6IHRydWUsXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxTyxPQUFPLFVBQVU7QUFDdFAsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUh4QixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixjQUFjO0FBQUEsTUFDZCxlQUFlLENBQUMsZUFBZSxlQUFlLGVBQWU7QUFBQSxNQUM3RCxVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxhQUFhO0FBQUEsUUFDYixPQUFPO0FBQUEsUUFDUCxXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsVUFDTCxFQUFFLEtBQUssc0JBQWdDLE9BQU8sU0FBVyxNQUFNLFlBQVk7QUFBQSxVQUMzRSxFQUFFLEtBQUssc0JBQWlDLE9BQU8sU0FBVyxNQUFNLFlBQVk7QUFBQSxVQUM1RSxFQUFFLEtBQUssdUJBQWlDLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUM1RSxFQUFFLEtBQUssdUJBQWlDLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUM1RSxFQUFFLEtBQUssdUJBQWlDLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUM1RSxFQUFFLEtBQUssdUJBQWlDLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUM1RSxFQUFFLEtBQUssdUJBQWlDLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUM1RSxFQUFFLEtBQUssdUJBQWlDLE9BQU8sV0FBVyxNQUFNLFlBQVk7QUFBQSxVQUM1RSxFQUFFLEtBQUssZ0NBQWlDLE9BQU8sV0FBVyxNQUFNLGFBQWEsU0FBUyxXQUFXO0FBQUEsUUFDbkc7QUFBQSxRQUNBLGFBQWE7QUFBQSxVQUNYLEVBQUUsS0FBSyw0QkFBNEIsT0FBTyxZQUFZLE1BQU0sYUFBYSxhQUFhLE9BQU87QUFBQSxVQUM3RixFQUFFLEtBQUssMkJBQTRCLE9BQU8sV0FBWSxNQUFNLGFBQWEsYUFBYSxTQUFTO0FBQUEsUUFDakc7QUFBQSxNQUNGO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxjQUFjLENBQUMsc0NBQXNDO0FBQUEsUUFDckQsZ0JBQWdCO0FBQUEsVUFDZDtBQUFBLFlBQ0UsWUFBWTtBQUFBLFlBQ1osU0FBUztBQUFBLFlBQ1QsU0FBUyxFQUFFLFdBQVcsZ0JBQWdCLFlBQVksRUFBRSxZQUFZLEtBQUssZUFBZSxJQUFJLEVBQUU7QUFBQSxVQUM1RjtBQUFBLFVBQ0E7QUFBQSxZQUNFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVMsRUFBRSxXQUFXLG9CQUFvQixZQUFZLEVBQUUsWUFBWSxLQUFLLGVBQWUsTUFBTSxFQUFFO0FBQUEsVUFDbEc7QUFBQSxVQUNBO0FBQUEsWUFDRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTLEVBQUUsV0FBVyxlQUFlLFlBQVksRUFBRSxZQUFZLElBQUksZUFBZSxNQUFNLEVBQUU7QUFBQSxVQUM1RjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxZQUFZLEVBQUUsU0FBUyxLQUFLO0FBQUEsSUFDOUIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU8sRUFBRSxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPLEVBQUU7QUFBQSxFQUNqRDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBVyxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxVQUNwRCxJQUFXLENBQUMsMEJBQTBCLGlDQUFpQyxjQUFjO0FBQUEsVUFDckYsT0FBVyxDQUFDLHVCQUF1QjtBQUFBLFVBQ25DLFVBQVcsQ0FBQyx1QkFBdUI7QUFBQSxVQUNuQyxNQUFXLENBQUMsNkJBQTZCLDJCQUEyQjtBQUFBLFVBQ3BFLFFBQVcsQ0FBQyxVQUFVO0FBQUEsVUFDdEIsT0FBVyxDQUFDLG1CQUFtQixLQUFLO0FBQUEsUUFDdEM7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
