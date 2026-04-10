/**
 * Database layer entry point.
 *
 * For app code, import directly from:
 *   - '@/lib/supabase/server' for server-side operations
 *   - '@/lib/supabase/client' for client-side operations
 *   - '@/db/schema' for Drizzle ORM table definitions and types
 *   - '@/db/types' for Supabase client types (Database, views, functions)
 *
 * This file is intentionally minimal — it serves as documentation,
 * not as a barrel export. Each module should import what it needs directly.
 */

export type { Database } from './types'
export type {
  Province, NewProvince,
  Region, NewRegion,
  Place, NewPlace,
  Interest, NewInterest,
  TravelType, NewTravelType,
  OriginCity, NewOriginCity,
  PlaceImage, NewPlaceImage,
  Rating, NewRating,
  NewsletterSubscriber, NewNewsletterSubscriber,
} from './schema'
