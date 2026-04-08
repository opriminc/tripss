'use server'

import { createAuthClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Sign out the current user and redirect to login.
 * Works for all roles (admin, authenticated, etc.)
 */
export async function signOut() {
  const supabase = await createAuthClient()
  await supabase.auth.signOut()
  redirect('/login')
}
