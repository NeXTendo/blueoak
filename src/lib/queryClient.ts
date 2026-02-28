import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Property listings change infrequently — cache aggressively
      staleTime: 1000 * 60 * 15,      // 15 minutes stale
      gcTime:    1000 * 60 * 30,       // 30 minutes garbage collect
      retry: (failureCount, error) => {
        // Don't retry on 4xx client errors
        if (error instanceof Error && /\b4\d{2}\b/.test(error.message)) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,        // Re-sync after coming back online
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error)
      },
    },
  },
})

