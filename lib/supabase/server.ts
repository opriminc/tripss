import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Admin client — bypasses RLS, server-only.
 * Use only inside server actions/route handlers for write operations.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Auth-aware server client — respects RLS, reads session from cookies.
 * Use for checking auth state in server components and middleware.
 */
export async function createAuthClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

/**
 * Verify the current user is authenticated and has admin role.
 * Returns user or throws if unauthorized.
 */
export async function requireAdmin() {
  const supabase = await createAuthClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized: Not authenticated')
  }

  const role = user.app_metadata?.role
  if (role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  return user
}
