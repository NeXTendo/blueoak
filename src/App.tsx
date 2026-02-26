import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import { router }      from '@/routes'
import { queryClient } from '@/lib/queryClient'
import { useAuthInit } from '@/hooks/useAuth'
import { useUIStore }  from '@/stores/uiStore'

function AppProviders({ children }: { children: React.ReactNode }) {
  // Sync theme class on mount
  const theme = useUIStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Initialise Supabase auth listener
  useAuthInit()

  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <RouterProvider router={router} />
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: { borderRadius: '0.75rem' },
          }}
        />
      </AppProviders>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
