import { NextRequest, NextResponse } from 'next/server'
import { WebScraper } from '@/lib/scraper'
import { HTMLParser } from '@/lib/parser'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    console.log('Test scrape starting for:', url)

    // Create a temporary output directory
    const outputDir = `/tmp/test-scrape-${Date.now()}`

    // Initialize scraper
    const scraper = new WebScraper({
      targetUrl: url,
      scrapeDepth: 0, // Only scrape the main page
      outputDir,
      timeout: 30000,
    })

    console.log('Initializing scraper...')
    await scraper.initialize()

    console.log('Scraping website...')
    const scrapeResult = await scraper.scrape()

    console.log('Scrape complete. HTML length:', scrapeResult.html.length)

    // Parse the HTML
    console.log('Parsing HTML...')
    const parser = new HTMLParser(scrapeResult)
    const parseResult = parser.parse()

    console.log('Parse complete. Components found:', parseResult.components.length)

    // Return debug information
    return NextResponse.json({
      success: true,
      debug: {
        htmlLength: scrapeResult.html.length,
        title: scrapeResult.metadata.title,
        componentsFound: parseResult.components.length,
        componentTypes: parseResult.components.map((c) => ({
          type: c.type,
          textLength: c.html.length,
          textNodes: c.textNodes.length,
        })),
        hasHeader: parseResult.layout.hasHeader,
        hasFooter: parseResult.layout.hasFooter,
        textMapEntries: Object.keys(parseResult.textMap).length,
      },
    })
  } catch (error) {
    console.error('Test scrape error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
