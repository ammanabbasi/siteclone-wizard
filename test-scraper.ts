import { WebScraper } from './src/lib/scraper'
import { HTMLParser } from './src/lib/parser'

async function testScraping() {
  console.log('Testing scraper with example.com...\n')

  const scraper = new WebScraper({
    targetUrl: 'https://example.com',
    scrapeDepth: 0,
    outputDir: './test-output',
    timeout: 30000,
  })

  try {
    console.log('1. Initializing scraper...')
    await scraper.initialize()

    console.log('2. Scraping website...')
    const scrapeResult = await scraper.scrape()

    console.log('\n3. Scrape results:')
    console.log('   - HTML length:', scrapeResult.html.length)
    console.log('   - CSS rules found:', scrapeResult.css.length)
    console.log('   - Assets found:', scrapeResult.assets.length)
    console.log('   - Links found:', scrapeResult.links.length)
    console.log('   - Title:', scrapeResult.metadata.title)

    // Save a sample of the HTML
    console.log('\n4. HTML Preview (first 500 chars):')
    console.log(scrapeResult.html.substring(0, 500) + '...\n')

    console.log('5. Parsing HTML...')
    const parser = new HTMLParser(scrapeResult)
    const parseResult = parser.parse()

    console.log('\n6. Parse results:')
    console.log('   - Components found:', parseResult.components.length)
    console.log('   - Text nodes extracted:', Object.keys(parseResult.textMap).length)
    console.log('   - Has header:', parseResult.layout.hasHeader)
    console.log('   - Has footer:', parseResult.layout.hasFooter)

    if (parseResult.components.length > 0) {
      console.log('\n7. Components found:')
      parseResult.components.forEach((comp, idx) => {
        console.log(
          `   ${idx + 1}. Type: ${comp.type}, Selector: ${comp.selector}, Text nodes: ${comp.textNodes.length}`
        )
      })
    }

    if (Object.keys(parseResult.textMap).length > 0) {
      console.log('\n8. Sample text content:')
      Object.entries(parseResult.textMap)
        .slice(0, 5)
        .forEach(([key, value]) => {
          console.log(`   ${key}: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`)
        })
    }

    await scraper.cleanup()
    console.log('\n✅ Test completed successfully!')
  } catch (error) {
    console.error('\n❌ Test failed:', error instanceof Error ? error.message : 'Unknown error')
    if (error instanceof Error) {
      console.error(error.stack)
    }
    await scraper.cleanup()
  }
}

// Run the test
testScraping()
