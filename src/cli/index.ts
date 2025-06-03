#!/usr/bin/env node

import { Command } from 'commander'
import * as fs from 'fs/promises'
import * as path from 'path'
import { WebScraper } from '../lib/scraper'
import { HTMLParser } from '../lib/parser'
import { CodeGenerator } from '../lib/generator'
import { BrandConfig } from '../lib/types'

const program = new Command()

program
  .name('siteclone-wizard')
  .description('Clone any website with customizable branding')
  .version('0.1.0')
  .option('-u, --url <url>', 'Target URL to clone')
  .option('-c, --config <path>', 'Path to brand config JSON file')
  .option('-d, --depth <number>', 'Scrape depth (default: 1)', '1')
  .option('-o, --output <path>', 'Output directory (default: ./output)', './output')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    try {
      await runWizard(options)
    } catch (error) {
      console.error('Error:', error)
      process.exit(1)
    }
  })

program.parse()

async function runWizard(options: any) {
  console.log('🧙‍♂️ SiteClone Wizard starting...\n')

  // Validate inputs
  if (!options.url && !options.config) {
    console.error('Error: Please provide either --url or --config option')
    process.exit(1)
  }

  // Load brand config
  let brandConfig: BrandConfig
  let targetUrl: string

  if (options.config) {
    const configPath = path.resolve(options.config)
    const configContent = await fs.readFile(configPath, 'utf-8')
    const config = JSON.parse(configContent)
    brandConfig = config.brandConfig
    targetUrl = config.targetUrl || options.url || ''
  } else {
    // Use default brand config
    brandConfig = {
      name: 'My Clone Site',
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
      },
      typography: {
        fontFamily: 'Inter',
      },
    }
    targetUrl = options.url || ''
  }

  if (!targetUrl) {
    console.error('Error: Target URL is required')
    process.exit(1)
  }

  const outputDir = path.resolve(options.output || './output')
  const scrapeDepth = parseInt(options.depth || '1')

  console.log(`📍 Target URL: ${targetUrl}`)
  console.log(`📁 Output directory: ${outputDir}`)
  console.log(`🔍 Scrape depth: ${scrapeDepth}`)
  console.log(`🎨 Brand: ${brandConfig.name}\n`)

  // Step 1: Scrape the website
  console.log('🕷️  Scraping website...')
  const scraper = new WebScraper({
    targetUrl,
    scrapeDepth,
    outputDir,
  })

  await scraper.initialize()
  const scrapeResult = await scraper.scrape()
  await scraper.cleanup()

  console.log(`✅ Scraped ${scrapeResult.links.length} links`)
  console.log(`✅ Found ${scrapeResult.assets.length} assets\n`)

  // Step 2: Parse HTML and extract components
  console.log('🔍 Parsing HTML...')
  const parser = new HTMLParser(scrapeResult)
  const parseResult = parser.parse()

  console.log(`✅ Extracted ${parseResult.components.length} components`)
  console.log(`✅ Found ${Object.keys(parseResult.textMap).length} text nodes\n`)

  // Step 3: Generate Next.js project
  console.log('⚡ Generating Next.js project...')
  const generator = new CodeGenerator({
    outputDir,
    brandConfig,
    parseResult,
  })

  await generator.generate()

  console.log('\n✨ SiteClone Wizard completed successfully!')
  console.log(`\n📦 Your cloned site is ready at: ${outputDir}`)
  console.log('\nTo run your site:')
  console.log(`  cd ${outputDir}`)
  console.log('  npm install')
  console.log('  npm run dev')
  console.log('\n🎉 Happy coding!')
}

// Handle unhandled rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error)
  process.exit(1)
})
