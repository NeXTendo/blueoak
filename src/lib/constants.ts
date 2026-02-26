/** App-wide constants */

export const APP_NAME = 'BlueOak'
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://blueoak.app'

// ── Routes ────────────────────────────────────────────────────────
export const ROUTES = {
  SPLASH:             '/',
  ONBOARDING:         '/onboarding',
  LOGIN:              '/login',
  REGISTER:           '/register',
  FORGOT_PASSWORD:    '/forgot-password',
  RESET_PASSWORD:     '/reset-password',
  VERIFY_EMAIL:       '/verify-email',
  HOME:               '/home',
  SEARCH:             '/search',
  MAP:                '/map',
  SAVED:              '/saved',
  SAVED_SEARCHES:     '/saved/searches',
  MESSAGES:           '/messages',
  CONVERSATION:       '/messages/:conversationId',
  PROFILE:            '/profile',
  PUBLIC_PROFILE:     '/profile/:username',
  EDIT_PROFILE:       '/profile/edit',
  SETTINGS:           '/settings',
  PROPERTY_DETAIL:    '/property/:slug',
  ADD_PROPERTY:       '/property/new',
  EDIT_PROPERTY:      '/property/:id/edit',
  PROPERTY_PREVIEW:   '/property/:id/preview',
  RESERVATIONS:       '/reservations',
  RESERVATION_DETAIL: '/reservations/:id',
  AUCTION:            '/auction/:propertyId',
  AUCTION_REGISTER:   '/auction/:propertyId/register',
  SELLER_DASHBOARD:   '/seller',
  SELLER_LISTINGS:    '/seller/listings',
  SELLER_RESERVATIONS:'/seller/reservations',
  SELLER_MESSAGES:    '/seller/messages',
  SELLER_ANALYTICS:   '/seller/analytics',
  SELLER_LEADS:       '/seller/leads',
  SELLER_COMMISSION:  '/seller/commission',
  SELLER_SUBSCRIPTION:'/seller/subscription',
  SELLER_AVAILABILITY:'/seller/availability',
  ADMIN:              '/admin',
  ADMIN_USERS:        '/admin/users',
  ADMIN_USER_DETAIL:  '/admin/users/:id',
  ADMIN_PROPERTIES:   '/admin/properties',
  ADMIN_REPORTS:      '/admin/reports',
  ADMIN_RESERVATIONS: '/admin/reservations',
  ADMIN_ACTIVITY:     '/admin/activity',
  ADMIN_FEATURED:     '/admin/featured',
  ADMIN_AUCTIONS:     '/admin/auctions',
  SUPER_ADMIN:        '/super-admin',
  SUPER_ADMIN_MANAGE: '/super-admin/manage',
  PLATFORM_SETTINGS:  '/super-admin/settings',
  NOT_FOUND:          '/404',
  UNAUTHORIZED:       '/403',
} as const

// ── User Roles ────────────────────────────────────────────────────
export const USER_ROLES = {
  BUYER:       'buyer',
  SELLER:      'seller',
  AGENT:       'agent',
  ADMIN:       'admin',
  SUPER_ADMIN: 'super_admin',
} as const

// ── Property Types ────────────────────────────────────────────────
export const PROPERTY_TYPES = [
  // Residential
  { value: 'house',             label: 'House / Bungalow' },
  { value: 'apartment',         label: 'Apartment / Flat' },
  { value: 'townhouse',         label: 'Townhouse' },
  { value: 'villa',             label: 'Villa' },
  { value: 'studio',            label: 'Studio' },
  { value: 'duplex',            label: 'Duplex / Triplex' },
  { value: 'penthouse',         label: 'Penthouse' },
  { value: 'cottage',           label: 'Cottage / Chalet' },
  // Land
  { value: 'residential_plot',  label: 'Residential Plot' },
  { value: 'commercial_plot',   label: 'Commercial Plot' },
  { value: 'agricultural_plot', label: 'Agricultural / Farm' },
  { value: 'industrial_plot',   label: 'Industrial Plot' },
  { value: 'mixed_use_plot',    label: 'Mixed-Use Plot' },
  // Commercial
  { value: 'office',            label: 'Office Space' },
  { value: 'retail',            label: 'Retail / Shop' },
  { value: 'warehouse',         label: 'Warehouse' },
  { value: 'factory',           label: 'Factory / Industrial' },
  { value: 'hotel',             label: 'Hotel / Guest House' },
  { value: 'restaurant',         label: 'Restaurant / F&B' },
  // Special
  { value: 'student_accom',     label: 'Student Accommodation' },
  { value: 'senior_living',     label: 'Senior Living' },
  { value: 'parking',           label: 'Parking / Garage' },
] as const

// ── Listing Types ─────────────────────────────────────────────────
export const LISTING_TYPES = [
  { value: 'sale',       label: 'For Sale',   color: 'brand-600' },
  { value: 'rent',       label: 'To Rent',    color: 'cyan-600' },
  { value: 'short_term', label: 'Short-term', color: 'purple-600' },
  { value: 'lease',      label: 'Lease',      color: 'green-600' },
  { value: 'auction',    label: 'Auction',    color: 'red-600' },
] as const

// ── Currencies ────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'ZMW', symbol: 'K',    name: 'Zambian Kwacha',     country: 'ZM' },
  { code: 'ZAR', symbol: 'R',    name: 'South African Rand', country: 'ZA' },
  { code: 'NGN', symbol: '₦',    name: 'Nigerian Naira',     country: 'NG' },
  { code: 'KES', symbol: 'KSh',  name: 'Kenyan Shilling',    country: 'KE' },
  { code: 'GHS', symbol: 'GH₵',  name: 'Ghanaian Cedi',      country: 'GH' },
  { code: 'USD', symbol: '$',    name: 'US Dollar',          country: 'US' },
  { code: 'EUR', symbol: '€',    name: 'Euro',               country: 'EU' },
  { code: 'GBP', symbol: '£',    name: 'British Pound',      country: 'GB' },
] as const

// ── Countries ─────────────────────────────────────────────────────
export const COUNTRIES = [
  { code: 'ZM', name: 'Zambia',       currency: 'ZMW', locale: 'en-ZM' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', locale: 'en-ZA' },
  { code: 'NG', name: 'Nigeria',      currency: 'NGN', locale: 'en-NG' },
  { code: 'KE', name: 'Kenya',        currency: 'KES', locale: 'en-KE' },
  { code: 'GH', name: 'Ghana',        currency: 'GHS', locale: 'en-GH' },
  { code: 'US', name: 'United States',currency: 'USD', locale: 'en-US' },
  { code: 'GB', name: 'United Kingdom',currency:'GBP', locale: 'en-GB' },
] as const

// ── Amenities ─────────────────────────────────────────────────────
export const AMENITIES = {
  indoor: [
    { value: 'open_plan', label: 'Open-plan Living' },
    { value: 'fireplace', label: 'Fireplace' },
    { value: 'walk_in_closet', label: 'Walk-in Closet' },
    { value: 'pantry', label: 'Pantry' },
    { value: 'scullery', label: 'Scullery' },
    { value: 'laundry_room', label: 'Laundry Room' },
    { value: 'storage_room', label: 'Storage Room' },
    { value: 'gym', label: 'Gym/Fitness Room' },
    { value: 'wine_cellar', label: 'Wine Cellar' },
    { value: 'cinema', label: 'Cinema/Media Room' },
    { value: 'skylight', label: 'Skylight' },
    { value: 'high_ceilings', label: 'High Ceilings' },
    { value: 'underfloor_heating', label: 'Underfloor Heating' },
    { value: 'central_vacuum', label: 'Central Vacuum' },
  ],
  outdoor: [
    { value: 'garden', label: 'Garden' },
    { value: 'patio', label: 'Patio/Deck' },
    { value: 'balcony', label: 'Balcony' },
    { value: 'roof_terrace', label: 'Roof Terrace' },
    { value: 'jacuzzi', label: 'Jacuzzi/Spa' },
    { value: 'outdoor_kitchen', label: 'Outdoor Kitchen' },
    { value: 'fire_pit', label: 'Boma/Fire Pit' },
    { value: 'fruit_trees', label: 'Fruit Trees' },
    { value: 'veg_garden', label: 'Vegetable Garden' },
    { value: 'tennis_court', label: 'Tennis Court' },
    { value: 'basketball_court', label: 'Basketball Court' },
    { value: 'kids_play_area', label: 'Kids Play Area' },
  ],
  security: [
    { value: 'perimeter_wall', label: 'Perimeter Wall' },
    { value: 'electric_fence', label: 'Electric Fence' },
    { value: 'alarm_system', label: 'Alarm System' },
    { value: 'cctv', label: 'CCTV' },
    { value: 'security_guard', label: '24-hr Security Guard' },
    { value: 'boom_gate', label: 'Boom Gate' },
    { value: 'biometric_access', label: 'Biometric Access' },
    { value: 'intercom', label: 'Intercom' },
    { value: 'panic_room', label: 'Panic Room' },
  ],
  utilities: [
    { value: 'borehole', label: 'Borehole' },
    { value: 'water_tank', label: 'Water Tank' },
    { value: 'solar_power', label: 'Solar Power' },
    { value: 'generator', label: 'Generator' },
    { value: 'gas_supply', label: 'Gas Supply' },
    { value: 'prepaid_meter', label: 'Prepaid Electricity Meter' },
    { value: 'three_phase', label: '3-phase Power' },
    { value: 'backup_internet', label: 'Backup Internet' },
    { value: 'fibre', label: 'Fibre Ready' },
  ],
  building: [
    { value: 'lift', label: 'Lift/Elevator' },
    { value: 'concierge', label: 'Concierge Service' },
    { value: 'communal_gym', label: 'Communal Gym' },
    { value: 'communal_pool', label: 'Communal Pool' },
    { value: 'covered_parking', label: 'Covered Parking' },
    { value: 'storage_unit', label: 'Storage Unit' },
    { value: 'visitor_parking', label: 'Visitor Parking' },
  ],
} as const

// ── Pagination ────────────────────────────────────────────────────
// ── Languages ─────────────────────────────────────────────────────
export const LANGUAGES = [
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'pt', name: 'Português' },
  { id: 'sw', name: 'Kiswahili' },
  { id: 'ny', name: 'Nyanja' },
  { id: 'bem', name: 'Bemba' },
] as const

export const PAGE_SIZE = 20
export const MAX_IMAGES = 50
export const MAX_COMPARE = 4
