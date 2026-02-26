import { cn } from '@/lib/utils'

function Bone({ className }: { className?: string }) {
  return <div className={cn('animate-skeleton rounded-lg bg-muted', className)} />
}

export default function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col p-4 gap-4">
      <Bone className="h-12 w-32" />
      <Bone className="h-48 w-full" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Bone className="h-32 w-full" />
            <Bone className="h-4 w-3/4" />
            <Bone className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
