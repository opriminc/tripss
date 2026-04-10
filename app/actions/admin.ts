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
  newsletterSubscriberSchema,
  parseForm,
} from '@/lib/validations/admin'
import type { z } from 'zod'

type ActionResult = { success: true } | { success: false; error: string } | null

async function adminAction<T extends z.ZodType>(options: {
  formData: FormData
  schema: T
  path: string
  operation: (supabase: ReturnType<typeof createAdminClient>, data: z.infer<T>) => PromiseLike<{ error: { message: string } | null }>
}): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized'
    return { success: false, error: msg }
  }

  const parsed = parseForm(options.schema, options.formData)
  if (parsed.error) return { success: false, error: parsed.error }

  try {
    const supabase = createAdminClient()
    const { error } = await options.operation(supabase, parsed.data!)
    if (error) return { success: false, error: error.message }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred'
    return { success: false, error: msg }
  }

  revalidatePath(options.path)
  return { success: true }
}

async function adminSoftDelete(table: string, formData: FormData, path: string): Promise<ActionResult> {
  try {
    await requireAdmin()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized'
    return { success: false, error: msg }
  }

  const id = formData.get('id') as string
  if (!id) return { success: false, error: 'Missing ID' }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq('id', id)
    if (error) return { success: false, error: error.message }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete'
    return { success: false, error: msg }
  }

  revalidatePath(path)
  return { success: true }
}

// ============================================
// REGIONS
// ============================================
export async function createRegion(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData, schema: regionSchema, path: '/admin/regions',
    operation: (db, data) => db.from('regions').insert(data),
  })
}
export async function updateRegion(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData, schema: regionSchema, path: '/admin/regions',
    operation: (db, data) => db.from('regions').update(data).eq('id', id),
  })
}
export async function deleteRegion(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminSoftDelete('regions', formData, '/admin/regions')
}

// ============================================
// ORIGIN CITIES
// ============================================
export async function createOriginCity(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData, schema: originCitySchema, path: '/admin/origin-cities',
    operation: (db, data) => db.from('origin_cities').insert(data),
  })
}
export async function updateOriginCity(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData, schema: originCitySchema, path: '/admin/origin-cities',
    operation: (db, data) => db.from('origin_cities').update(data).eq('id', id),
  })
}
export async function deleteOriginCity(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminSoftDelete('origin_cities', formData, '/admin/origin-cities')
}

// ============================================
// INTERESTS
// ============================================
export async function createInterest(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData, schema: interestSchema, path: '/admin/interests',
    operation: (db, data) => db.from('interests').insert({ ...data, icon: data.icon || null }),
  })
}
export async function updateInterest(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData, schema: interestSchema, path: '/admin/interests',
    operation: (db, data) => db.from('interests').update({ ...data, icon: data.icon || null }).eq('id', id),
  })
}
export async function deleteInterest(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminSoftDelete('interests', formData, '/admin/interests')
}

// ============================================
// TRAVEL TYPES
// ============================================
export async function createTravelType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData, schema: travelTypeSchema, path: '/admin/travel-types',
    operation: (db, data) => db.from('travel_types').insert(data),
  })
}
export async function updateTravelType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData, schema: travelTypeSchema, path: '/admin/travel-types',
    operation: (db, data) => db.from('travel_types').update(data).eq('id', id),
  })
}
export async function deleteTravelType(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminSoftDelete('travel_types', formData, '/admin/travel-types')
}

// ============================================
// PLACES
// ============================================
function placeNullables(data: Record<string, unknown>) {
  return {
    ...data,
    description: data.description || null,
    short_description: data.short_description || null,
    nearby_text: data.nearby_text || null,
    address: data.address || null,
    city: data.city || null,
  }
}
export async function createPlace(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData, schema: placeSchema, path: '/admin/places',
    operation: (db, data) => db.from('places').insert(placeNullables(data)),
  })
}
export async function updatePlace(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData, schema: placeSchema, path: '/admin/places',
    operation: (db, data) => db.from('places').update(placeNullables(data)).eq('id', id),
  })
}
export async function deletePlace(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminSoftDelete('places', formData, '/admin/places')
}

// ============================================
// PLACE IMAGES
// ============================================
export async function createPlaceImage(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData, schema: placeImageSchema, path: '/admin/place-images',
    operation: (db, data) => db.from('place_images').insert({ ...data, alt_text: data.alt_text || null }),
  })
}
export async function updatePlaceImage(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData, schema: placeImageSchema, path: '/admin/place-images',
    operation: (db, data) => db.from('place_images').update({ ...data, alt_text: data.alt_text || null }).eq('id', id),
  })
}
export async function deletePlaceImage(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminSoftDelete('place_images', formData, '/admin/place-images')
}

// ============================================
// RATINGS (soft delete only)
// ============================================
export async function deleteRating(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminSoftDelete('ratings', formData, '/admin/ratings')
}

// ============================================
// NEWSLETTER
// ============================================
export async function createSubscriber(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminAction({
    formData, schema: newsletterSubscriberSchema, path: '/admin/newsletter',
    operation: (db, data) => db.from('newsletter_subscribers').insert({
      email: data.email,
      region_id: data.region_id,
      is_verified: data.is_verified,
    }),
  })
}
export async function updateSubscriber(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = formData.get('id') as string
  return adminAction({
    formData, schema: newsletterSubscriberSchema, path: '/admin/newsletter',
    operation: (db, data) => db.from('newsletter_subscribers').update({
      email: data.email,
      region_id: data.region_id,
      is_verified: data.is_verified,
    }).eq('id', id),
  })
}
export async function deleteSubscriber(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  return adminSoftDelete('newsletter_subscribers', formData, '/admin/newsletter')
}
