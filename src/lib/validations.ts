import { z } from 'zod'

// ── Auth ──────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email:    z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email:     z.string().email('Please enter a valid email address'),
  password:  z.string().min(8, 'Password must be at least 8 characters')
               .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
               .regex(/[0-9]/, 'Must contain at least one number'),
  user_type: z.enum(['buyer', 'seller']),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export const resetPasswordSchema = z.object({
  password:         z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

// ── Profile ───────────────────────────────────────────────────────
export const profileSchema = z.object({
  full_name:  z.string().min(2).max(100),
  username:   z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, underscores'),
  bio:        z.string().max(500).optional(),
  phone:      z.string().optional(),
  whatsapp:   z.string().optional(),
  city:       z.string().optional(),
  country:    z.string().optional(),
  website:    z.string().url().optional().or(z.literal('')),
})

// ── Property ──────────────────────────────────────────────────────
export const propertyBasicSchema = z.object({
  title:        z.string().min(10, 'Title must be at least 10 characters').max(150),
  listing_type: z.enum(['sale', 'rent', 'short_term', 'lease', 'auction']),
  property_type: z.string().min(1, 'Select a property type'),
  condition:    z.enum(['new', 'excellent', 'good', 'fair', 'needs_work']).optional(),
  description:  z.string().min(50, 'Description must be at least 50 characters').max(5000),
})

export const propertyLocationSchema = z.object({
  country:     z.string().min(1, 'Select a country'),
  province:    z.string().optional(),
  city:        z.string().min(1, 'Enter a city'),
  suburb:      z.string().optional(),
  address:     z.string().optional(),
  latitude:    z.number().optional(),
  longitude:   z.number().optional(),
  erf_number:  z.string().optional(),
  zoning:      z.string().optional(),
})

export const propertySpecsSchema = z.object({
  bedrooms:    z.number().int().min(0).max(100).optional(),
  bathrooms:   z.number().min(0).max(100).optional(),
  floor_area:  z.number().positive().optional(),
  lot_area:    z.number().positive().optional(),
  garages:     z.number().int().min(0).optional(),
  parking:     z.number().int().min(0).optional(),
  floors:      z.number().int().min(1).optional(),
  year_built:  z.number().int().min(1800).max(new Date().getFullYear() + 5).optional(),
  furnishing:  z.enum(['unfurnished', 'semi_furnished', 'fully_furnished']).optional(),
})

export const propertyPricingSchema = z.object({
  asking_price:      z.number().positive('Enter a valid price').optional(),
  currency:          z.string().min(3).max(3),
  negotiable:        z.boolean().default(false),
  monthly_rent:      z.number().positive().optional(),
  deposit:           z.number().positive().optional(),
  nightly_rate:      z.number().positive().optional(),
  cleaning_fee:      z.number().positive().optional(),
  auction_reserve:   z.number().positive().optional(),
  auction_starting:  z.number().positive().optional(),
})

// ── Reservation ───────────────────────────────────────────────────
export const reservationSchema = z.object({
  property_id:   z.string().uuid(),
  date:          z.date(),
  time_slot:     z.string(),
  meeting_type:  z.enum(['in_person', 'virtual']),
  notes:         z.string().max(500).optional(),
})

// ── Contact / Message ─────────────────────────────────────────────
export const messageSchema = z.object({
  content: z.string().min(1).max(2000),
})

export const contactSellerSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
})

// ── Report ────────────────────────────────────────────────────────
export const reportSchema = z.object({
  report_type:  z.enum(['spam', 'misleading', 'offensive', 'wrong_price', 'sold', 'other']),
  reason:       z.string().min(10, 'Please provide more detail').max(500),
})

// ── Saved Search ──────────────────────────────────────────────────
export const savedSearchSchema = z.object({
  name:      z.string().min(1).max(100),
  frequency: z.enum(['instant', 'daily', 'weekly']),
})

export type LoginFormData          = z.infer<typeof loginSchema>
export type RegisterFormData       = z.infer<typeof registerSchema>
export type ProfileFormData        = z.infer<typeof profileSchema>
export type PropertyBasicData      = z.infer<typeof propertyBasicSchema>
export type PropertyLocationData   = z.infer<typeof propertyLocationSchema>
export type PropertySpecsData      = z.infer<typeof propertySpecsSchema>
export type PropertyPricingData    = z.infer<typeof propertyPricingSchema>
export type ReservationFormData    = z.infer<typeof reservationSchema>
export type MessageFormData        = z.infer<typeof messageSchema>
export type ContactSellerFormData  = z.infer<typeof contactSellerSchema>
export type ReportFormData         = z.infer<typeof reportSchema>
export type SavedSearchFormData    = z.infer<typeof savedSearchSchema>
