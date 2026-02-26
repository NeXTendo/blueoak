import { cn } from '@/lib/utils'
const Bone = ({ className }: { className?: string }) => <div className={cn('animate-skeleton rounded-lg bg-muted', className)} />
export function PropertyCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border bg-background shadow-card">
      <Bone className="h-48 w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Bone className="h-5 w-2/3" />
        <Bone className="h-4 w-full" />
        <div className="flex gap-2 pt-1">
          <Bone className="h-6 w-16" />
          <Bone className="h-6 w-16" />
          <Bone className="h-6 w-16" />
        </div>
      </div>
    </div>
  )
}
export function PropertyGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => <PropertyCardSkeleton key={i} />)}
    </div>
  )
}
