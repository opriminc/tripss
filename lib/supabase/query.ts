import { createAdminClient } from './server'

/**
 * Execute a Supabase query and throw on error.
 * Use in server components — errors are caught by the nearest error.tsx boundary.
 *
 * @example
 * const regions = await query(db => db.from('regions').select('*').order('name'))
 */
export async function query<T>(
  fn: (supabase: ReturnType<typeof createAdminClient>) => PromiseLike<{ data: T | null; error: { message: string; code?: string } | null }>
): Promise<T> {
  const supabase = createAdminClient()
  const { data, error } = await fn(supabase)
  if (error) {
    throw new Error(`Database query failed: ${error.message}`)
  }
  return data as T
}

/**
 * Get the count of rows in a table. Throws on error.
 */
export async function queryCount(
  table: string,
  filter?: { column: string; value: null | string | boolean }
): Promise<number> {
  const supabase = createAdminClient()
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  if (filter) {
    q = filter.value === null ? q.is(filter.column, null) : q.eq(filter.column, filter.value)
  }
  const { count, error } = await q
  if (error) {
    throw new Error(`Count query failed on ${table}: ${error.message}`)
  }
  return count ?? 0
}