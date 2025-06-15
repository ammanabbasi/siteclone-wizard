import { NextRequest, NextResponse } from 'next/server'
import { WebScraper } from '@/lib/scraper'
import { HTMLParser } from '@/lib/parser'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    logger.info('Test scrape starting', { url })

    // Create a temporary output directory
    const outputDir = `/tmp/test-scrape-${Date.now()}`

    // Initialize scraper
    const scraper = new WebScraper({
      targetUrl: url,
      scrapeDepth: 0, // Only scrape the main page
      outputDir,
      timeout: 30000,
    })

    logger.info('Initializing scraper')
    await scraper.initialize()

    logger.info('Scraping website')
    const scrapeResult = await scraper.scrape()

    logger.info('Scrape complete', { htmlLength: scrapeResult.html.length })

    // Parse the HTML
    logger.info('Parsing HTML')
    const parser = new HTMLParser(scrapeResult)
    const parseResult = parser.parse()

    logger.info('Parse complete', { componentsFound: parseResult.components.length })

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
    logger.error('Test scrape error', error instanceof Error ? error : new Error(String(error)))
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
