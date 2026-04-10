import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

import regionsData from './data/regions.json'
import interestsData from './data/interests.json'
import travelTypesData from './data/travel-types.json'
import originCitiesData from './data/gta-origin-cities.json'
import placesData from './data/gta-places.json'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log('Seeding database...\n')

  // 1. Regions
  console.log('Inserting regions...')
  const { data: insertedRegions, error: regErr } = await supabase
    .from('regions')
    .insert(regionsData.map(r => ({
      name: r.name,
      slug: r.slug,
      province_code: r.provinceCode,
      center_lat: r.centerLat,
      center_lng: r.centerLng,
    })))
    .select()
  if (regErr) throw new Error(`Regions: ${regErr.message}`)
  const regionMap = Object.fromEntries(insertedRegions!.map(r => [r.slug, r.id]))
  console.log(`  ✓ ${insertedRegions!.length} regions\n`)

  // 2. Interests
  console.log('Inserting interests...')
  const { data: insertedInterests, error: intErr } = await supabase
    .from('interests')
    .insert(interestsData.map(i => ({
      name: i.name,
      slug: i.slug,
      icon: i.icon,
      display_order: i.displayOrder,
    })))
    .select()
  if (intErr) throw new Error(`Interests: ${intErr.message}`)
  const interestMap = Object.fromEntries(insertedInterests!.map(i => [i.slug, i.id]))
  console.log(`  ✓ ${insertedInterests!.length} interests\n`)

  // 3. Travel Types
  console.log('Inserting travel types...')
  const { data: insertedTypes, error: ttErr } = await supabase
    .from('travel_types')
    .insert(travelTypesData.map(t => ({
      name: t.name,
      slug: t.slug,
      display_order: t.displayOrder,
    })))
    .select()
  if (ttErr) throw new Error(`Travel types: ${ttErr.message}`)
  const typeMap = Object.fromEntries(insertedTypes!.map(t => [t.slug, t.id]))
  console.log(`  ✓ ${insertedTypes!.length} travel types\n`)

  // 4. Origin Cities
  const gtaRegionId = regionMap['gta']
  console.log('Inserting origin cities...')
  const { data: insertedCities, error: ocErr } = await supabase
    .from('origin_cities')
    .insert(originCitiesData.map(c => ({
      region_id: gtaRegionId,
      name: c.name,
      slug: c.slug,
      lat: c.lat,
      lng: c.lng,
      is_default: c.isDefault ?? false,
    })))
    .select()
  if (ocErr) throw new Error(`Origin cities: ${ocErr.message}`)
  console.log(`  ✓ ${insertedCities!.length} origin cities\n`)

  // 5. Places + junction tables
  console.log('Inserting places...')
  let placeCount = 0
  let interestLinkCount = 0
  let monthLinkCount = 0

  for (const place of placesData) {
    const { data: inserted, error: plErr } = await supabase
      .from('places')
      .insert({
        region_id: gtaRegionId,
        name: place.name,
        slug: place.slug,
        description: place.description,
        short_description: place.shortDescription,
        nearby_text: place.nearbyText,
        lat: place.lat,
        lng: place.lng,
        city: place.city,
        travel_type_id: typeMap[place.travelType] ?? null,
      })
      .select()
      .single()
    if (plErr) { console.error(`  ✗ ${place.name}: ${plErr.message}`); continue }

    // Place-Interest junction
    if (place.interests?.length) {
      const links = place.interests
        .filter(slug => interestMap[slug])
        .map(slug => ({ place_id: inserted.id, interest_id: interestMap[slug] }))
      if (links.length) {
        const { error: piErr } = await supabase.from('place_interests').insert(links)
        if (piErr) console.error(`  ✗ ${place.name} interests: ${piErr.message}`)
        else interestLinkCount += links.length
      }
    }

    // Place-BestMonths junction
    if (place.bestMonths?.length) {
      const months = place.bestMonths.map(month => ({ place_id: inserted.id, month }))
      const { error: bmErr } = await supabase.from('place_best_months').insert(months)
      if (bmErr) console.error(`  ✗ ${place.name} months: ${bmErr.message}`)
      else monthLinkCount += months.length
    }

    placeCount++
  }

  console.log(`  ✓ ${placeCount} places`)
  console.log(`  ✓ ${interestLinkCount} place-interest links`)
  console.log(`  ✓ ${monthLinkCount} place-month links`)

  console.log('\nSeed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
