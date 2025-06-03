import { WebScraper } from './src/lib/scraper'
import { HTMLParser } from './src/lib/parser'

async function testComplexScraping() {
  // Test with a more complex website
  const testUrls = ['https://github.com', 'https://nodejs.org', 'https://www.wikipedia.org']

  for (const url of testUrls.slice(0, 1)) {
    // Test only first URL for now
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing scraper with: ${url}`)
    console.log('='.repeat(60) + '\n')

    const scraper = new WebScraper({
      targetUrl: url,
      scrapeDepth: 0,
      outputDir: `./test-output/${url.replace(/[^a-zA-Z0-9]/g, '_')}`,
      timeout: 45000,
    })

    try {
      console.log('1. Initializing scraper...')
      await scraper.initialize()

      console.log('2. Scraping website...')
      const startTime = Date.now()
      const scrapeResult = await scraper.scrape()
      const scrapeDuration = Date.now() - startTime

      console.log(`\n3. Scrape completed in ${scrapeDuration}ms`)
      console.log('   - HTML length:', scrapeResult.html.length)
      console.log('   - CSS rules found:', scrapeResult.css.length)
      console.log('   - Assets found:', scrapeResult.assets.length)
      console.log('   - Links found:', scrapeResult.links.length)
      console.log('   - Title:', scrapeResult.metadata.title)
      console.log('   - Description:', scrapeResult.metadata.description?.substring(0, 100) + '...')

      // Asset breakdown
      if (scrapeResult.assets.length > 0) {
        const assetTypes = scrapeResult.assets.reduce(
          (acc, asset) => {
            acc[asset.type] = (acc[asset.type] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

        console.log('\n4. Asset breakdown:')
        Object.entries(assetTypes).forEach(([type, count]) => {
          console.log(`   - ${type}: ${count}`)
        })
      }

      console.log('\n5. Parsing HTML...')
      const parseStartTime = Date.now()
      const parser = new HTMLParser(scrapeResult)
      const parseResult = parser.parse()
      const parseDuration = Date.now() - parseStartTime

      console.log(`\n6. Parse completed in ${parseDuration}ms`)
      console.log('   - Components found:', parseResult.components.length)
      console.log('   - Text nodes extracted:', Object.keys(parseResult.textMap).length)
      console.log('   - Has header:', parseResult.layout.hasHeader)
      console.log('   - Has footer:', parseResult.layout.hasFooter)
      console.log('   - Has sidebar:', parseResult.layout.hasSidebar)
      console.log('   - Main content selector:', parseResult.layout.mainContentSelector)

      if (parseResult.components.length > 0) {
        console.log('\n7. Component breakdown:')
        const componentTypes = parseResult.components.reduce(
          (acc, comp) => {
            acc[comp.type] = (acc[comp.type] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

        Object.entries(componentTypes).forEach(([type, count]) => {
          console.log(`   - ${type}: ${count}`)
        })

        console.log('\n8. Sample components:')
        parseResult.components.slice(0, 5).forEach((comp, idx) => {
          console.log(`   ${idx + 1}. Type: ${comp.type}`)
          console.log(`      - Selector: ${comp.selector}`)
          console.log(
            `      - Classes: ${comp.classes.slice(0, 3).join(', ')}${comp.classes.length > 3 ? '...' : ''}`
          )
          console.log(`      - Text nodes: ${comp.textNodes.length}`)
          console.log(`      - HTML length: ${comp.html.length} chars`)
        })
      }

      if (Object.keys(parseResult.textMap).length > 0) {
        console.log('\n9. Sample text content:')
        Object.entries(parseResult.textMap)
          .slice(0, 10)
          .forEach(([key, value]) => {
            console.log(`   ${key}: "${value.substring(0, 60)}${value.length > 60 ? '...' : ''}"`)
          })
      }

      await scraper.cleanup()
      console.log('\n✅ Test completed successfully!')
    } catch (error) {
      console.error('\n❌ Test failed:', error instanceof Error ? error.message : 'Unknown error')
      if (error instanceof Error) {
        console.error('\nError details:')
        console.error(error.stack)

        // Log more debugging info
        if (error.message.includes('timeout')) {
          console.error('\nTimeout error - the website might be slow or blocking automated access')
        } else if (error.message.includes('navigation')) {
          console.error('\nNavigation error - the website might be blocking or redirecting')
        }
      }
      await scraper.cleanup()
    }
  }
}

// Run the test
testComplexScraping().catch(console.error)
