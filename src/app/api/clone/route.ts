import { NextRequest, NextResponse } from 'next/server'
import { WebScraper } from '@/lib/scraper'
import { EnhancedHTMLParser } from '@/lib/enhanced-parser'
import { EnhancedCodeGenerator } from '@/lib/enhanced-generator'
import { BrandConfig } from '@/lib/types'
import * as fs from 'fs/promises'
import * as path from 'path'
import { randomUUID } from 'crypto'
import archiver from 'archiver'
import { logger } from '@/lib/logger'

interface CloneRequest {
  targetUrl: string
  brandConfig: BrandConfig
}

async function zipDirectory(sourceDir: string, outPath: string): Promise<void> {
  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = await fs.open(outPath, 'w')
  const fileStream = stream.createWriteStream()

  return new Promise((resolve, reject) => {
    archive.directory(sourceDir, false).on('error', reject).pipe(fileStream)

    fileStream.on('close', resolve)
    archive.finalize()
  })
}

// Helper function to validate hex color
function isValidHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color)
}

// Helper function to validate URL
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.length > 0
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const outputId = randomUUID()
  const outputDir = path.join(process.cwd(), 'output', outputId)
  let scraper: WebScraper | null = null

  try {
    const body: CloneRequest = await req.json()
    logger.info('API: Received clone request', { targetUrl: body.targetUrl })

    // Validate request
    if (!body.targetUrl || !isValidUrl(body.targetUrl)) {
      return NextResponse.json(
        {
          error: 'Invalid URL. Please provide a valid HTTP or HTTPS URL.',
          success: false,
        },
        { status: 400 }
      )
    }

    // Validate URL length
    if (body.targetUrl.length > 2000) {
      return NextResponse.json(
        {
          error: 'URL is too long. Maximum length is 2000 characters.',
          success: false,
        },
        { status: 400 }
      )
    }

    // Validate brand config
    if (!body.brandConfig?.name || body.brandConfig.name.length > 100) {
      return NextResponse.json(
        {
          error: 'Brand name is required and must be less than 100 characters.',
          success: false,
        },
        { status: 400 }
      )
    }

    // Validate colors
    const { colors } = body.brandConfig
    if (
      !colors ||
      !isValidHexColor(colors.primary) ||
      !isValidHexColor(colors.secondary) ||
      !isValidHexColor(colors.accent)
    ) {
      return NextResponse.json(
        {
          error: 'Invalid color format. Please use hex color codes (e.g., #123ABC).',
          success: false,
        },
        { status: 400 }
      )
    }

    logger.info('API: Setup output directory', { outputDir })

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true })

    // Initialize scraper
    logger.info('API: Initializing scraper')
    scraper = new WebScraper({
      targetUrl: body.targetUrl,
      outputDir,
      maxPages: 1, // Only scrape the main page for now
      maxAssetSize: 10 * 1024 * 1024, // 10MB max per asset
    })

    await scraper.initialize()

    // Scrape the website
    logger.info('API: Starting scrape')
    const scrapeResult = await scraper.scrape()
    logger.info('API: Scrape result', {
      htmlLength: scrapeResult.html.length,
      cssCount: scrapeResult.css.length,
      assetsCount: scrapeResult.assets.length,
    })

    // Use enhanced parser and generator for better results
    logger.info('API: Using enhanced parser')
    const enhancedParser = new EnhancedHTMLParser(scrapeResult, body.brandConfig)
    const enhancedParseResult = enhancedParser.parse()
    logger.info('API: Enhanced parse result ready')

    // Generate the project with enhanced generator
    logger.info('API: Generating enhanced project')
    const enhancedGenerator = new EnhancedCodeGenerator({
      outputDir,
      brandConfig: body.brandConfig,
      parseResult: enhancedParseResult,
    })
    await enhancedGenerator.generate()
    logger.info('API: Enhanced project generated successfully')

    // Create ZIP file
    const zipPath = path.join(process.cwd(), 'output', `${outputId}.zip`)
    await zipDirectory(outputDir, zipPath)

    // Return success response with enhanced stats
    return NextResponse.json({
      success: true,
      outputId,
      downloadUrl: `/api/download/${outputId}`,
      stats: {
        htmlSize: scrapeResult.html.length,
        cssRulesExtracted: scrapeResult.css.length,
        assetsDownloaded: scrapeResult.assets.length,
        brandReplacementsMade: enhancedParseResult.brandReplacements.length,
      },
    })
  } catch (error) {
    logger.error('API Error', error instanceof Error ? error : new Error(String(error)))

    // Clean up on error
    try {
      if (scraper) {
        await scraper.cleanup()
      }
      await fs.rm(outputDir, { recursive: true, force: true })
    } catch (cleanupError) {
      logger.error('Cleanup error', cleanupError instanceof Error ? cleanupError : new Error(String(cleanupError)))
    }

    // Provide user-friendly error messages
    let errorMessage = 'Failed to clone website'

    if (error instanceof Error) {
      if (error.message.includes('blocked') || error.message.includes('403')) {
        errorMessage =
          'This website appears to be blocking automated access. Please try a different website.'
      } else if (error.message.includes('timeout')) {
        errorMessage =
          'The website took too long to respond. Please try again or choose a different website.'
      } else if (error.message.includes('Navigation failed')) {
        errorMessage = 'Unable to access the website. Please check the URL and try again.'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    )
  } finally {
    // Always cleanup browser
    if (scraper) {
      try {
        await scraper.cleanup()
      } catch (error) {
        logger.error('Failed to cleanup scraper', error instanceof Error ? error : new Error(String(error)))
      }
    }
  }
}
