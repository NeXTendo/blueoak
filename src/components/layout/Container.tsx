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
        "mx-auto w-full px-4 md:px-8",
        !fullWidth && "max-w-[1650px]",
        className
      )}
    >
      {children}
    </div>
  )
}
