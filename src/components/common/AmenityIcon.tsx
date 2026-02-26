import { 
  Bed, 
  Bath, 
  Maximize, 
  Droplet, 
  Zap, 
  Waves, 
  Shield, 
  PawPrint, 
  Wifi, 
  Car, 
  Thermometer, 
  Warehouse,
  Flame,
  Wind,
  LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

const AMENITY_MAP: Record<string, { icon: LucideIcon, label: string }> = {
  beds: { icon: Bed, label: 'Beds' },
  baths: { icon: Bath, label: 'Baths' },
  sqm: { icon: Maximize, label: 'Sqm' },
  borehole: { icon: Droplet, label: 'Borehole' },
  solar: { icon: Zap, label: 'Solar Power' },
  pool: { icon: Waves, label: 'Swimming Pool' },
  security: { icon: Shield, label: 'Security' },
  pets: { icon: PawPrint, label: 'Pet Friendly' },
  wifi: { icon: Wifi, label: 'Fibre Internet' },
  parking: { icon: Car, label: 'Secure Parking' },
  ac: { icon: Wind, label: 'Air Conditioning' },
  heating: { icon: Thermometer, label: 'Heating' },
  garage: { icon: Warehouse, label: 'Garage' },
  fireplace: { icon: Flame, label: 'Fireplace' },
}

interface AmenityIconProps {
  type: string
  value?: string | number
  showLabel?: boolean
  className?: string
  iconClassName?: string
}

export default function AmenityIcon({ 
  type, 
  value, 
  showLabel = true, 
  className,
  iconClassName
}: AmenityIconProps) {
  const normalizedType = type.toLowerCase()
  const amenity = AMENITY_MAP[normalizedType] || { icon: Bed, label: type }
  const Icon = amenity.icon

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Icon size={16} className={cn("text-primary/40", iconClassName)} />
      <div className="flex flex-col -space-y-1">
        {value && <span className="text-xs font-black tracking-tight">{value}</span>}
        {showLabel && (
          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40 shrink-0">
            {amenity.label}
          </span>
        )}
      </div>
    </div>
  )
}
