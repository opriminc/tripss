'use server'

import { createClient } from '@supabase/supabase-js'
import { newsletterSignupSchema, parseForm } from '@/lib/validations/admin'

type ActionResult = { success: true } | { success: false; error: string } | null

/**
 * Public newsletter signup — no auth required.
 * Uses anon key so RLS INSERT policy is enforced.
 */
export async function subscribeNewsletter(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = parseForm(newsletterSignupSchema, formData)
  if (parsed.error) return { success: false, error: parsed.error }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.from('newsletter_subscribers').insert({
    email: parsed.data!.email,
    region_id: parsed.data!.region_id,
  })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'This email is already subscribed.' }
    }
    return { success: false, error: 'Something went wrong. Please try again.' }
  }

  return { success: true }
}
