import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  fullWidth?: boolean
}

export default function Container({ children, className, fullWidth }: ContainerProps) {
  return (
    <div 
      className={cn(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        !fullWidth && "max-w-screen-2xl",
        className
      )}
    >
      {children}
    </div>
  )
}
