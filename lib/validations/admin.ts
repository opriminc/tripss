import { z } from 'zod'

const slug = z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only')
const lat = z.coerce.number().min(-90).max(90)
const lng = z.coerce.number().min(-180).max(180)
const boolField = (defaultVal: boolean) =>
  z.enum(['true', 'false']).default(defaultVal ? 'true' : 'false').transform(v => v === 'true')

export const regionSchema = z.object({
  name: z.string().min(1).max(100),
  slug,
  province_code: z.string().length(2).toUpperCase(),
  center_lat: lat,
  center_lng: lng,
  is_active: boolField(true),
  display_order: z.coerce.number().int().min(0).default(0),
})

export const originCitySchema = z.object({
  region_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug,
  lat,
  lng,
  is_default: boolField(false),
  is_active: boolField(true),
})

export const interestSchema = z.object({
  name: z.string().min(1).max(100),
  slug,
  icon: z.string().max(10).default(''),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: boolField(true),
})

export const travelTypeSchema = z.object({
  name: z.string().min(1).max(50),
  slug,
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: boolField(true),
})

export const placeSchema = z.object({
  region_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug,
  description: z.string().max(5000).default(''),
  short_description: z.string().max(500).default(''),
  nearby_text: z.string().max(255).default(''),
  lat,
  lng,
  address: z.string().max(500).default(''),
  city: z.string().max(100).default(''),
  travel_type_id: z.string().uuid().or(z.literal('')).default('').transform(v => v || null),
  is_featured: boolField(false),
  is_active: boolField(true),
})

export const placeImageSchema = z.object({
  place_id: z.string().uuid(),
  url: z.string().url().max(2000),
  alt_text: z.string().max(255).default(''),
  display_order: z.coerce.number().int().min(0).default(0),
  is_primary: boolField(false),
  is_active: boolField(true),
})

export const placeContactSchema = z.object({
  place_id: z.string().uuid(),
  type: z.enum(['website', 'phone', 'email', 'facebook', 'instagram', 'twitter', 'booking', 'other']),
  value: z.string().min(1).max(2000),
  label: z.string().max(100).default(''),
  is_primary: boolField(false),
  is_active: boolField(true),
})

export const newsletterSubscriberSchema = z.object({
  email: z.string().email().max(255),
  region_id: z.string().uuid().or(z.literal('')).default('').transform(v => v || null),
  is_verified: boolField(false),
  is_active: boolField(true),
})

/**
 * Public-facing newsletter signup — minimal fields, no auth required.
 */
export const newsletterSignupSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(255),
  region_id: z.string().uuid().or(z.literal('')).default('').transform(v => v || null),
})

/**
 * Parse FormData against a Zod schema.
 * Returns { data, error } — never throws.
 */
export function parseForm<T extends z.ZodType>(
  schema: T,
  formData: FormData
): { data: z.infer<T>; error: null } | { data: null; error: string } {
  const raw = Object.fromEntries(formData.entries())
  const result = schema.safeParse(raw)
  if (!result.success) {
    const messages = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
    return { data: null, error: messages.join(', ') }
  }
  return { data: result.data, error: null }
}
