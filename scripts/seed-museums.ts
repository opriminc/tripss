/**
 * Museum Seed Script
 * Cleans scraped data and seeds into Supabase.
 *
 * Usage: npx tsx scripts/seed-museums.ts
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'
import scrapedData from '../db/seed/data/scraped-museums.json'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================
// Province name → code mapping
// ============================================
const PROVINCE_MAP: Record<string, string> = {
  'Ontario': 'ON',
  'Quebec': 'QC',
  'British Columbia': 'BC',
  'Alberta': 'AB',
  'Saskatchewan': 'SK',
  'Manitoba': 'MB',
  'Nova Scotia': 'NS',
  'Newfoundland & Labrador': 'NL',
  'Newfoundland and Labrador': 'NL',
  'New Brunswick': 'NB',
  'Prince Edward Island': 'PE',
  'Yukon': 'YT',
  'YK': 'YT',
  'Northwest Territories': 'NT',
  'Nunavut': 'NU',
}

// ============================================
// Manual fixes for museums with bad/missing province parsing
// Researched from their addresses and known locations
// ============================================
const MANUAL_FIXES: Record<string, { city: string; province: string }> = {
  '2 Intelligence & Camp X Museum': { city: 'Toronto', province: 'ON' },
  '39 Combat Engineers Regiment Museum': { city: 'Pembroke', province: 'ON' },
  'A.V. Roe Canada Aviation Museum Association': { city: 'Mississauga', province: 'ON' },
  'Argyll Museum and Archives': { city: 'Hamilton', province: 'ON' },
  'Barrie Sports Hall of Fame': { city: 'Barrie', province: 'ON' },
  'Birthplace of Hockey Museum': { city: 'Windsor', province: 'NS' },
  'Canadian Raceboat Hall of Fame': { city: 'Gravenhurst', province: 'ON' },
  'Canadian Tank Museum': { city: 'Oshawa', province: 'ON' },
  'City of Waterloo Museum': { city: 'Waterloo', province: 'ON' },
  'East Beaches Heritage Wing': { city: 'Grand Marais', province: 'MB' },
  'FOFA Gallery': { city: 'Montreal', province: 'QC' },
  'Galerie d\'art R3': { city: 'Trois-Rivières', province: 'QC' },
  'Herschel Island - Qikiqtaruk Territorial Park': { city: 'Herschel Island', province: 'YT' },
  'Lethbridge Military Museum': { city: 'Lethbridge', province: 'AB' },
  'MSVU Art Gallery': { city: 'Halifax', province: 'NS' },
  'MUMAQ - Musée des métiers d\'art du Québec': { city: 'Montreal', province: 'QC' },
  'Omàmiwininì Pimàdjwowin: The Algonquin Way Cultural Centre': { city: 'Golden Lake', province: 'ON' },
  'Quest Art School + Gallery': { city: 'Midland', province: 'ON' },
  'Revelstoke Railway Museum': { city: 'Revelstoke', province: 'BC' },
  'Saturna Heritage Centre': { city: 'Saturna Island', province: 'BC' },
  'Société historique du Saguenay': { city: 'Saguenay', province: 'QC' },
  'South East Military Museum': { city: 'Estevan', province: 'SK' },
  'StFX Art Gallery': { city: 'Antigonish', province: 'NS' },
  'SUM gallery': { city: 'Vancouver', province: 'BC' },
  'Tofino Clayoquot Heritage Museum': { city: 'Tofino', province: 'BC' },
}

// Skip list
const SKIP = new Set([
  'Juno Beach Centre', // Located in France, not Canada
])

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

function titleCase(str: string): string {
  if (str === str.toUpperCase() && str.length > 3) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  return str
}

interface CleanMuseum {
  name: string
  slug: string
  address: string
  city: string
  provinceCode: string
  postalCode: string
  website: string | null
  category: string | null
}

async function main() {
  console.log('Museum Seed Script')
  console.log(`Processing ${scrapedData.length} scraped museums...\n`)

  // ============================================
  // 1. Clean and normalize data
  // ============================================
  const cleaned: CleanMuseum[] = []
  const skipped: string[] = []
  const slugsSeen = new Set<string>()

  for (const raw of scrapedData) {
    if (SKIP.has(raw.name)) {
      skipped.push(`${raw.name} — in skip list`)
      continue
    }

    let city = raw.city
    let provinceCode = PROVINCE_MAP[raw.province] ?? ''

    // Apply manual fixes
    const fix = MANUAL_FIXES[raw.name]
    if (fix) {
      city = fix.city
      provinceCode = fix.province
    }

    if (!provinceCode) {
      skipped.push(`${raw.name} — no province could be determined`)
      continue
    }

    // Clean city name (some are ALL CAPS)
    city = titleCase(city.trim())

    // Generate unique slug
    let slug = slugify(raw.name)
    if (slugsSeen.has(slug)) {
      slug = slugify(`${raw.name}-${city}`)
    }
    if (slugsSeen.has(slug)) {
      slug = slugify(`${raw.name}-${city}-${provinceCode}`)
    }
    slugsSeen.add(slug)

    cleaned.push({
      name: raw.name.trim(),
      slug,
      address: raw.address.trim(),
      city,
      provinceCode,
      postalCode: raw.postalCode?.trim() ?? '',
      website: raw.website?.trim() || null,
      category: raw.category?.trim() || null,
    })
  }

  console.log(`Cleaned: ${cleaned.length} museums`)
  console.log(`Skipped: ${skipped.length}`)
  if (skipped.length > 0) {
    skipped.forEach(s => console.log(`  - ${s}`))
  }

  // ============================================
  // 2. Ensure regions exist for each province
  // ============================================
  console.log('\nChecking regions...')
  const { data: existingRegions } = await supabase.from('regions').select('id, slug, province_code').is('deleted_at', null)
  const regionByProvince: Record<string, string> = {}
  existingRegions?.forEach(r => { regionByProvince[r.province_code] = r.id })

  const provincesNeeded = [...new Set(cleaned.map(m => m.provinceCode))].filter(pc => !regionByProvince[pc])

  if (provincesNeeded.length > 0) {
    console.log(`Creating ${provincesNeeded.length} new regions...`)
    const { data: provinces } = await supabase.from('provinces').select('code, name')
    const provNameMap: Record<string, string> = {}
    provinces?.forEach(p => { provNameMap[p.code] = p.name })

    // Province center coordinates (approximate)
    const PROVINCE_CENTERS: Record<string, { lat: number; lng: number }> = {
      ON: { lat: 43.6532, lng: -79.3832 },
      QC: { lat: 46.8139, lng: -71.2080 },
      BC: { lat: 49.2827, lng: -123.1207 },
      AB: { lat: 51.0447, lng: -114.0719 },
      SK: { lat: 50.4452, lng: -104.6189 },
      MB: { lat: 49.8951, lng: -97.1384 },
      NS: { lat: 44.6488, lng: -63.5752 },
      NL: { lat: 47.5615, lng: -52.7126 },
      NB: { lat: 45.9636, lng: -66.6431 },
      PE: { lat: 46.2382, lng: -63.1311 },
      YT: { lat: 60.7212, lng: -135.0568 },
      NT: { lat: 62.4540, lng: -114.3718 },
      NU: { lat: 63.7467, lng: -68.5170 },
    }

    for (const pc of provincesNeeded) {
      const provName = provNameMap[pc] ?? pc
      const center = PROVINCE_CENTERS[pc] ?? { lat: 56.0, lng: -96.0 }
      const { data: newRegion, error } = await supabase.from('regions').insert({
        name: provName,
        slug: slugify(provName),
        province_code: pc,
        center_lat: center.lat,
        center_lng: center.lng,
      }).select().single()

      if (error) {
        console.error(`  Failed to create region for ${pc}: ${error.message}`)
      } else {
        regionByProvince[pc] = newRegion.id
        console.log(`  Created region: ${provName} (${pc})`)
      }
    }
  } else {
    console.log('  All regions exist')
  }

  // ============================================
  // 3. Get the "Museums" interest ID
  // ============================================
  const { data: museumsInterest } = await supabase
    .from('interests')
    .select('id')
    .eq('slug', 'museums')
    .is('deleted_at', null)
    .single()

  if (!museumsInterest) {
    console.error('ERROR: "Museums" interest not found in database. Run the interests seed first.')
    process.exit(1)
  }

  const museumsInterestId = museumsInterest.id
  console.log(`\nMuseums interest ID: ${museumsInterestId}`)

  // ============================================
  // 4. Seed museums as places
  // ============================================
  console.log(`\nSeeding ${cleaned.length} museums...`)
  let inserted = 0
  let failed = 0
  let interestLinks = 0

  // Process in batches of 50
  const BATCH_SIZE = 50
  for (let i = 0; i < cleaned.length; i += BATCH_SIZE) {
    const batch = cleaned.slice(i, i + BATCH_SIZE)
    const placesToInsert = batch.map(m => ({
      region_id: regionByProvince[m.provinceCode],
      name: m.name,
      slug: m.slug,
      short_description: m.category ? `${m.category}` : 'Museum',
      nearby_text: `In ${m.city}`,
      lat: 0, // Will need geocoding later
      lng: 0,
      address: m.address,
      city: m.city,
      postal_code: m.postalCode || null,
      meta_title: m.name,
      meta_description: m.category ? `Visit ${m.name} — ${m.category} in ${m.city}` : `Visit ${m.name} in ${m.city}`,
    })).filter(p => p.region_id) // Skip if no region found

    const { data: insertedPlaces, error } = await supabase
      .from('places')
      .insert(placesToInsert)
      .select('id')

    if (error) {
      console.error(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
      failed += batch.length
      continue
    }

    inserted += insertedPlaces!.length

    // Link all to "Museums" interest
    const interestLinksToInsert = insertedPlaces!.map(p => ({
      place_id: p.id,
      interest_id: museumsInterestId,
    }))

    const { error: linkError } = await supabase.from('place_interests').insert(interestLinksToInsert)
    if (linkError) {
      console.error(`  Interest links batch ${Math.floor(i / BATCH_SIZE) + 1}: ${linkError.message}`)
    } else {
      interestLinks += interestLinksToInsert.length
    }

    if ((i + BATCH_SIZE) % 500 === 0 || i === 0) {
      console.log(`  Progress: ${Math.min(i + BATCH_SIZE, cleaned.length)}/${cleaned.length} (${inserted} inserted)`)
    }
  }

  console.log(`\n========== RESULTS ==========`)
  console.log(`Museums inserted: ${inserted}`)
  console.log(`Interest links created: ${interestLinks}`)
  console.log(`Failed: ${failed}`)
  console.log(`Skipped: ${skipped.length}`)

  // Province breakdown
  const byProv: Record<string, number> = {}
  cleaned.forEach(m => { byProv[m.provinceCode] = (byProv[m.provinceCode] || 0) + 1 })
  console.log('\nBy Province:')
  Object.entries(byProv).sort((a, b) => b[1] - a[1]).forEach(([pc, count]) => {
    console.log(`  ${pc}: ${count}`)
  })

  process.exit(0)
}

main().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})