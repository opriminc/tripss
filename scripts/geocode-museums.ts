/**
 * Geocode Museums Script
 * Uses OpenStreetMap Nominatim (free, no API key) to geocode all museums.
 * Optimized: geocodes unique city+province combos, then batch-updates all museums in each city.
 *
 * Usage: npx tsx scripts/geocode-museums.ts
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const DELAY_MS = 1100 // Nominatim requires max 1 req/sec
const USER_AGENT = 'TripSS-Geocoder/1.0 (travel directory; contact: sikunj@oprim.com)'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface GeoResult {
  lat: number
  lng: number
}

async function geocode(city: string, provinceCode: string): Promise<GeoResult | null> {
  const params = new URLSearchParams({
    q: `${city}, ${provinceCode}, Canada`,
    format: 'json',
    limit: '1',
    countrycodes: 'ca',
  })

  try {
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'User-Agent': USER_AGENT },
    })

    if (!res.ok) {
      console.warn(`  HTTP ${res.status} for "${city}, ${provinceCode}"`)
      return null
    }

    const data = await res.json()
    if (data.length === 0) return null

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    }
  } catch (err) {
    console.warn(`  Error geocoding "${city}, ${provinceCode}": ${err instanceof Error ? err.message : err}`)
    return null
  }
}

async function main() {
  console.log('Museum Geocoder')
  console.log('Using OpenStreetMap Nominatim (free, 1 req/sec)\n')

  // Get all un-geocoded museums grouped by city + province
  // Supabase default limit is 1000, so paginate
  const allLocations: any[] = []
  let from = 0
  const PAGE = 1000
  while (true) {
    const { data, error: fetchErr } = await supabase
      .from('places')
      .select('id, city, regions(province_code)')
      .eq('lat', 0)
      .eq('lng', 0)
      .is('deleted_at', null)
      .range(from, from + PAGE - 1)
    if (fetchErr) { console.error('Fetch error:', fetchErr.message); break }
    if (!data || data.length === 0) break
    allLocations.push(...data)
    if (data.length < PAGE) break
    from += PAGE
  }
  const locations = allLocations
  const error = null

  if (error || !locations) {
    console.error('Failed to fetch museums:', error?.message)
    process.exit(1)
  }

  console.log(`Found ${locations.length} un-geocoded museums`)

  // Group by unique city + province
  const groups: Record<string, { ids: string[]; city: string; provinceCode: string }> = {}
  for (const loc of locations) {
    const pc = (loc.regions as any)?.province_code ?? ''
    const key = `${loc.city}|${pc}`
    if (!groups[key]) {
      groups[key] = { ids: [], city: loc.city ?? '', provinceCode: pc }
    }
    groups[key].ids.push(loc.id)
  }

  const uniqueLocations = Object.values(groups)
  console.log(`Unique city+province combos: ${uniqueLocations.length}`)
  console.log(`Estimated time: ~${Math.ceil(uniqueLocations.length * DELAY_MS / 60000)} minutes\n`)

  let geocoded = 0
  let failed = 0
  let updated = 0

  for (let i = 0; i < uniqueLocations.length; i++) {
    const { ids, city, provinceCode } = uniqueLocations[i]

    if (!city || !provinceCode) {
      failed += ids.length
      continue
    }

    const result = await geocode(city, provinceCode)

    if (result) {
      // Batch update all museums in this city
      const { error: updateErr } = await supabase
        .from('places')
        .update({ lat: result.lat, lng: result.lng })
        .in('id', ids)

      if (updateErr) {
        console.warn(`  Update failed for ${city}, ${provinceCode}: ${updateErr.message}`)
        failed += ids.length
      } else {
        geocoded++
        updated += ids.length
      }
    } else {
      failed += ids.length
    }

    // Progress every 100 locations
    if ((i + 1) % 100 === 0 || i === 0) {
      console.log(`  ${i + 1}/${uniqueLocations.length} locations — ${updated} museums updated`)
    }

    await sleep(DELAY_MS)
  }

  console.log(`\n========== RESULTS ==========`)
  console.log(`Locations geocoded: ${geocoded}/${uniqueLocations.length}`)
  console.log(`Museums updated: ${updated}`)
  console.log(`Failed: ${failed}`)

  // Check remaining
  const { count } = await supabase
    .from('places')
    .select('*', { count: 'exact', head: true })
    .eq('lat', 0)
    .eq('lng', 0)
    .is('deleted_at', null)

  console.log(`Still un-geocoded: ${count ?? 'unknown'}`)

  process.exit(0)
}

main().catch(err => {
  console.error('Geocoder failed:', err)
  process.exit(1)
})