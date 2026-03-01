import { cn } from '@/lib/utils'
const Bone = ({ className }: { className?: string }) => <div className={cn('animate-skeleton rounded-lg bg-muted', className)} />
export function PropertyCardSkeleton() {
  return (
    <div className="rounded-none overflow-hidden border border-border bg-card">
      <Bone className="aspect-[4/3] sm:aspect-[16/9] w-full rounded-none" />
      <div className="p-4 sm:p-5 space-y-3">
        <Bone className="h-5 w-3/4" />
        <Bone className="h-4 w-1/2" />
        <div className="flex gap-4 pt-2">
          <Bone className="h-8 w-12" />
          <Bone className="h-8 w-12" />
          <Bone className="h-8 w-12" />
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
