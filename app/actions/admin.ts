'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient, requireAdmin } from '@/lib/supabase/server'
import {
  regionSchema,
  originCitySchema,
  interestSchema,
  travelTypeSchema,
  placeSchema,
  placeImageSchema,
  parseForm,
} from '@/lib/validations/admin'
import type { z } from 'zod'

// ============================================
// Standardized action response
// ============================================
type ActionResult = { success: true } | { success: false; error: string }

/**
 * Generic CRUD helper — handles auth, validation, DB operation, revalidation.
 * Eliminates all duplication across actions.
 */
async function adminAction<T extends z.ZodType>(options: {
  formData: FormData
  schema: T
  path: string
  operation: (supabase: ReturnType<typeof createAdminClient>, data: z.infer<T>) => PromiseLike<{ error: { message: string } | null }>
}): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { success: false, error: 'Unauthorized' }
  }

  const parsed = parseForm(options.schema, options.formData)
  if (parsed.error) return { success: false, error: parsed.error }

  const supabase = createAdminClient()
  const { error } = await options.operation(supabase, parsed.data!)
  if (error) return { success: false, error: error.message }

  revalidatePath(options.path)
  return { success: true }
}

/**
 * Generic delete helper — handles auth, extracts ID, deletes from table.
 */
async function adminDelete(table: string, formData: FormData, path: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch {
    return { success: false, error: 'Unauthorized' }
  }

  const id = formData.get('id') as string
  if (!id) return { success: false, error: 'Missing ID' }

  const supabase = createAdminClient()
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath(path)
  return { success: true }
}

// ============================================
// REGIONS
// ============================================
export async function createRegion(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData,
    schema: regionSchema,
    path: '/admin/regions',
    operation: (db, data) => db.from('regions').insert(data),
  })
}

export async function updateRegion(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData,
    schema: regionSchema,
    path: '/admin/regions',
    operation: (db, data) => db.from('regions').update(data).eq('id', id),
  })
}

export async function deleteRegion(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminDelete('regions', formData, '/admin/regions')
}

// ============================================
// ORIGIN CITIES
// ============================================
export async function createOriginCity(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData,
    schema: originCitySchema,
    path: '/admin/origin-cities',
    operation: (db, data) => db.from('origin_cities').insert(data),
  })
}

export async function updateOriginCity(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData,
    schema: originCitySchema,
    path: '/admin/origin-cities',
    operation: (db, data) => db.from('origin_cities').update(data).eq('id', id),
  })
}

export async function deleteOriginCity(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminDelete('origin_cities', formData, '/admin/origin-cities')
}

// ============================================
// INTERESTS
// ============================================
export async function createInterest(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData,
    schema: interestSchema,
    path: '/admin/interests',
    operation: (db, data) => db.from('interests').insert({ ...data, icon: data.icon || null }),
  })
}

export async function updateInterest(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData,
    schema: interestSchema,
    path: '/admin/interests',
    operation: (db, data) => db.from('interests').update({ ...data, icon: data.icon || null }).eq('id', id),
  })
}

export async function deleteInterest(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminDelete('interests', formData, '/admin/interests')
}

// ============================================
// TRAVEL TYPES
// ============================================
export async function createTravelType(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData,
    schema: travelTypeSchema,
    path: '/admin/travel-types',
    operation: (db, data) => db.from('travel_types').insert(data),
  })
}

export async function updateTravelType(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData,
    schema: travelTypeSchema,
    path: '/admin/travel-types',
    operation: (db, data) => db.from('travel_types').update(data).eq('id', id),
  })
}

export async function deleteTravelType(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminDelete('travel_types', formData, '/admin/travel-types')
}

// ============================================
// PLACES
// ============================================
export async function createPlace(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData,
    schema: placeSchema,
    path: '/admin/places',
    operation: (db, data) => db.from('places').insert({
      ...data,
      description: data.description || null,
      short_description: data.short_description || null,
      nearby_text: data.nearby_text || null,
      address: data.address || null,
      city: data.city || null,
      province: data.province || null,
    }),
  })
}

export async function updatePlace(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData,
    schema: placeSchema,
    path: '/admin/places',
    operation: (db, data) => db.from('places').update({
      ...data,
      description: data.description || null,
      short_description: data.short_description || null,
      nearby_text: data.nearby_text || null,
      address: data.address || null,
      city: data.city || null,
      province: data.province || null,
    }).eq('id', id),
  })
}

export async function deletePlace(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminDelete('places', formData, '/admin/places')
}

// ============================================
// PLACE IMAGES
// ============================================
export async function createPlaceImage(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData,
    schema: placeImageSchema,
    path: '/admin/place-images',
    operation: (db, data) => db.from('place_images').insert({ ...data, alt_text: data.alt_text || null }),
  })
}

export async function updatePlaceImage(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData,
    schema: placeImageSchema,
    path: '/admin/place-images',
    operation: (db, data) => db.from('place_images').update({ ...data, alt_text: data.alt_text || null }).eq('id', id),
  })
}

export async function deletePlaceImage(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminDelete('place_images', formData, '/admin/place-images')
}

// ============================================
// RATINGS (delete only)
// ============================================
export async function deleteRating(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminDelete('ratings', formData, '/admin/ratings')
}

// ============================================
// NEWSLETTER (delete only)
// ============================================
export async function deleteSubscriber(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  return adminDelete('newsletter_subscribers', formData, '/admin/newsletter')
}
