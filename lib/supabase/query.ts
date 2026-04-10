import { createAdminClient } from './server'

/**
 * Execute a Supabase query and throw on error.
 * Errors are caught by the nearest error.tsx boundary.
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

/**
 * Paginated query with search support.
 * Returns { data, totalCount } for use with Pagination component.
 */
export const PAGE_SIZE = 100

export async function queryPaginated<T>(options: {
  table: string
  select: string
  page: number
  search?: string
  searchColumns?: string[]
  orderBy?: string
  ascending?: boolean
}): Promise<{ data: T[]; totalCount: number }> {
  const { table, select, page, search, searchColumns = ['name'], orderBy = 'name', ascending = true } = options
  const supabase = createAdminClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Build count query
  let countQuery = supabase.from(table).select('*', { count: 'exact', head: true }).is('deleted_at', null)
  if (search && searchColumns.length > 0) {
    const orFilter = searchColumns.map(col => `${col}.ilike.%${search}%`).join(',')
    countQuery = countQuery.or(orFilter)
  }
  const { count, error: countErr } = await countQuery
  if (countErr) throw new Error(`Count query failed: ${countErr.message}`)

  // Build data query
  let dataQuery = supabase.from(table).select(select).is('deleted_at', null)
  if (search && searchColumns.length > 0) {
    const orFilter = searchColumns.map(col => `${col}.ilike.%${search}%`).join(',')
    dataQuery = dataQuery.or(orFilter)
  }
  const { data, error } = await dataQuery.order(orderBy, { ascending }).range(from, to)
  if (error) throw new Error(`Data query failed: ${error.message}`)

  return { data: (data ?? []) as T[], totalCount: count ?? 0 }
}