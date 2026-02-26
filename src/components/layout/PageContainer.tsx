import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export default function PageContainer({ children, className, narrow }: Props) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6', narrow ? 'max-w-2xl' : 'max-w-7xl', className)}>
      {children}
    </div>
  )
}
