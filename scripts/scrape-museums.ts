/**
 * Museum Directory Scraper
 * Scrapes all museums from the Canadian Museums Association directory.
 * Source: https://museums.ca/site/aboutthecma/services/canadianmuseumdirectory
 *
 * Usage: npx tsx scripts/scrape-museums.ts
 * Output: db/seed/data/scraped-museums.json
 */

import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

interface Museum {
  name: string
  address: string
  city: string
  province: string
  postalCode: string
  country: string
  website: string | null
  phone: string | null
  category: string | null
  sourceUrl: string
}

const BASE_URL = 'https://museums.ca/site/aboutthecma/services/canadianmuseumdirectory'
const OUTPUT_PATH = resolve(__dirname, '../db/seed/data/scraped-museums.json')
const DELAY_MS = 1500 // Respectful delay between page requests
const TOTAL_PAGES = 287

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Parse address text like "10 Huron Rd\nKitchener, Ontario N2P 2R7\n Canada"
 * into structured fields.
 */
function parseAddress(raw: string): { address: string; city: string; province: string; postalCode: string; country: string } {
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)

  let address = ''
  let city = ''
  let province = ''
  let postalCode = ''
  let country = 'Canada'

  // Last line is often "Canada"
  if (lines.length > 0 && lines[lines.length - 1].toLowerCase().includes('canada')) {
    country = lines.pop()!.trim()
  }

  // First line is street address
  if (lines.length > 0) {
    address = lines[0]
  }

  // Second line is "City, Province PostalCode"
  if (lines.length > 1) {
    const cityLine = lines[1]
    // Match pattern: "City, Province PostalCode"
    const match = cityLine.match(/^(.+?),\s*(.+?)\s+([A-Z]\d[A-Z]\s?\d[A-Z]\d)$/)
    if (match) {
      city = match[1].trim()
      province = match[2].trim()
      postalCode = match[3].trim()
    } else {
      // Try without postal code: "City, Province"
      const match2 = cityLine.match(/^(.+?),\s*(.+)$/)
      if (match2) {
        city = match2[1].trim()
        province = match2[2].trim()
      } else {
        city = cityLine.trim()
      }
    }
  }

  return { address, city, province, postalCode, country }
}

async function scrapePage(page: Awaited<ReturnType<typeof chromium.launch>>['_initializer'] extends never ? never : any, pageNum: number): Promise<Museum[]> {
  const url = `${BASE_URL}?page=${pageNum}`
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  try {
    await page.waitForSelector('.postBlock', { timeout: 10000 })
  } catch {
    console.warn(`  Page ${pageNum}: No museum blocks found, skipping`)
    return []
  }

  const blocks = page.locator('.postBlock')
  const count = await blocks.count()
  const museums: Museum[] = []

  for (let i = 0; i < count; i++) {
    try {
      const block = blocks.nth(i)

      // Name + source URL
      const titleEl = block.locator('.postTitle')
      const name = (await titleEl.textContent())?.trim() ?? ''
      const sourceUrl = (await titleEl.getAttribute('href')) ?? ''

      // Address block (first .postDate)
      const dateDivs = block.locator('.postDate')
      const addressRaw = (await dateDivs.nth(0).innerText())?.trim() ?? ''
      const parsed = parseAddress(addressRaw)

      // Website (second .postDate contains the link)
      let website: string | null = null
      if (await dateDivs.count() > 1) {
        const linkEl = dateDivs.nth(1).locator('a')
        if (await linkEl.count() > 0) {
          website = (await linkEl.first().getAttribute('href'))?.trim() ?? null
        }
      }

      // Category (third .postDate contains Notes/Details)
      let category: string | null = null
      if (await dateDivs.count() > 2) {
        const notesText = (await dateDivs.nth(2).innerText())?.trim() ?? ''
        const catMatch = notesText.match(/Category\s*:\s*(.+)/i)
        if (catMatch) {
          category = catMatch[1].trim()
        }
      }

      if (name) {
        museums.push({
          name,
          address: parsed.address,
          city: parsed.city,
          province: parsed.province,
          postalCode: parsed.postalCode,
          country: parsed.country,
          website,
          phone: null, // Not consistently available on listing pages
          category,
          sourceUrl: sourceUrl.startsWith('http') ? sourceUrl : `https://museums.ca${sourceUrl}`,
        })
      }
    } catch (err) {
      console.warn(`  Page ${pageNum}, block ${i}: Error extracting data — ${err instanceof Error ? err.message : err}`)
    }
  }

  return museums
}

async function main() {
  console.log('Museum Directory Scraper')
  console.log(`Scraping ${TOTAL_PAGES} pages from ${BASE_URL}\n`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'TripSS-Scraper/1.0 (travel directory; contact: sikunj@oprim.com)',
  })
  const page = await context.newPage()

  const allMuseums: Museum[] = []
  let failedPages: number[] = []

  for (let pageNum = 1; pageNum <= TOTAL_PAGES; pageNum++) {
    try {
      const museums = await scrapePage(page, pageNum)
      allMuseums.push(...museums)

      if (pageNum % 10 === 0 || pageNum === 1) {
        console.log(`  Page ${pageNum}/${TOTAL_PAGES} — ${museums.length} museums (total: ${allMuseums.length})`)
      }
    } catch (err) {
      console.error(`  Page ${pageNum}: FAILED — ${err instanceof Error ? err.message : err}`)
      failedPages.push(pageNum)
    }

    // Respectful delay between requests
    await sleep(DELAY_MS)
  }

  // Retry failed pages once
  if (failedPages.length > 0) {
    console.log(`\nRetrying ${failedPages.length} failed pages...`)
    const retryPages = [...failedPages]
    failedPages = []

    for (const pageNum of retryPages) {
      try {
        await sleep(DELAY_MS * 2)
        const museums = await scrapePage(page, pageNum)
        allMuseums.push(...museums)
        console.log(`  Page ${pageNum}: Retry OK — ${museums.length} museums`)
      } catch (err) {
        console.error(`  Page ${pageNum}: Retry FAILED — ${err instanceof Error ? err.message : err}`)
        failedPages.push(pageNum)
      }
    }
  }

  await browser.close()

  // Save results
  writeFileSync(OUTPUT_PATH, JSON.stringify(allMuseums, null, 2))

  console.log(`\n========== RESULTS ==========`)
  console.log(`Total museums scraped: ${allMuseums.length}`)
  console.log(`Failed pages: ${failedPages.length > 0 ? failedPages.join(', ') : 'None'}`)
  console.log(`Output: ${OUTPUT_PATH}`)

  // Province breakdown
  const byProvince: Record<string, number> = {}
  allMuseums.forEach(m => {
    byProvince[m.province || 'Unknown'] = (byProvince[m.province || 'Unknown'] || 0) + 1
  })
  console.log(`\nBy Province:`)
  Object.entries(byProvince).sort((a, b) => b[1] - a[1]).forEach(([prov, count]) => {
    console.log(`  ${prov}: ${count}`)
  })
}

main().catch(err => {
  console.error('Scraper failed:', err)
  process.exit(1)
})