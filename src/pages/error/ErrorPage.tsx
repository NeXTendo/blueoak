import { useRouteError, Link } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
export default function ErrorPage() {
  const error = useRouteError()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      {import.meta.env.DEV && <pre className="text-xs text-muted-foreground bg-muted p-4 rounded-lg mb-4 text-left max-w-lg overflow-auto">{String(error)}</pre>}
      <Link to={ROUTES.HOME} className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
        Go to Home
      </Link>
    </div>
  )
}
