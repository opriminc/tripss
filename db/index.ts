/**
 * Database client re-exports.
 * Use lib/supabase/server.ts for server-side operations.
 * Use lib/supabase/client.ts for client-side operations.
 *
 * This file exists for backwards compatibility with the seed script
 * and Drizzle config. For app code, import from lib/supabase/ instead.
 */
export { createAdminClient, createAuthClient, requireAdmin } from '@/lib/supabase/server'
export { createBrowserClient } from '@/lib/supabase/client'
