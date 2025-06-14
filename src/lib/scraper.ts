import { chromium, Page, Browser } from 'playwright'
import * as fs from 'fs/promises'
import * as path from 'path'
import { URL } from 'url'
import { logger } from './logger'

export interface ScraperOptions {
  targetUrl: string
  scrapeDepth?: number
  outputDir?: string
  timeout?: number
  maxPages?: number
  maxAssetSize?: number
}

export interface ScrapeResult {
  html: string
  css: string[]
  assets: Array<{
    url: string
    localPath: string
    type: 'image' | 'font' | 'script' | 'stylesheet'
  }>
  links: string[]
  metadata: {
    title: string
    description?: string
    favicon?: string
  }
}

export class WebScraper {
  private browser: Browser | null = null
  private visitedUrls: Set<string> = new Set()
  private baseUrl: URL
  private outputDir: string
  private pagesScraped: number = 0

  constructor(private options: ScraperOptions) {
    this.baseUrl = new URL(options.targetUrl)
    this.outputDir = options.outputDir || './output'
  }

  async initialize() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
  }

  async scrape(): Promise<ScrapeResult> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initialize() first.')
    }

    let page: Page | null = null
    try {
      page = await this.browser.newPage()
      page.setDefaultTimeout(this.options.timeout || 30000)

      return await this.scrapePage(page, this.options.targetUrl, 0)
    } finally {
      // Ensure page is closed even if error occurs
      if (page) {
        try {
          await page.close()
        } catch (error) {
          logger.warn('Failed to close page:', error)
        }
      }
    }
  }

  private async scrapePage(page: Page, url: string, depth: number): Promise<ScrapeResult> {
    // Check if we've hit the page limit
    if (this.options.maxPages && this.pagesScraped >= this.options.maxPages) {
      logger.info(`Reached max pages limit (${this.options.maxPages})`)
      return {
        html: '',
        css: [],
        assets: [],
        links: [],
        metadata: { title: '' },
      }
    }

    if (this.visitedUrls.has(url) || depth > (this.options.scrapeDepth || 1)) {
      return {
        html: '',
        css: [],
        assets: [],
        links: [],
        metadata: { title: '' },
      }
    }

    this.visitedUrls.add(url)
    this.pagesScraped++
    logger.info(`Scraping: ${url} (depth: ${depth}, pages scraped: ${this.pagesScraped})`)

    try {
      await page.goto(url, { waitUntil: 'networkidle' })
    } catch (error) {
      logger.error(`Failed to navigate to ${url}:`, error)
      throw new Error(
        `Navigation failed: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    // Extract HTML
    const html = await page.content()

    // Extract inline and external CSS with better handling
    const css = await this.extractAllStyles(page)

    // Extract assets
    const assets = await this.extractAssets(page)

    // Extract internal links
    const links = await page.evaluate((baseUrl) => {
      const anchors = Array.from(document.querySelectorAll('a[href]'))
      return anchors
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((href) => {
          try {
            const url = new URL(href)
            const base = new URL(baseUrl)
            return url.hostname === base.hostname
          } catch {
            return false
          }
        })
    }, this.baseUrl.toString())

    // Extract metadata
    const metadata = await page.evaluate(() => {
      const title = document.title || ''
      const description =
        document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      const favicon =
        document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
        document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
        ''

      return { title, description, favicon }
    })

    // Download assets
    const downloadedAssets = await this.downloadAssets(assets)

    // Recursively scrape linked pages if depth allows
    if (depth < (this.options.scrapeDepth || 1)) {
      for (const link of links.slice(0, 5)) {
        // Limit to 5 links per page
        if (this.options.maxPages && this.pagesScraped >= this.options.maxPages) {
          break
        }
        try {
          await this.scrapePage(page, link, depth + 1)
        } catch (error) {
          logger.warn(`Failed to scrape linked page ${link}:`, error)
          // Continue with other links even if one fails
        }
      }
    }

    return { html, css, assets: downloadedAssets, links, metadata }
  }

  private async extractAllStyles(page: Page): Promise<string[]> {
    const styles: string[] = []

    // Get external stylesheet URLs
    const stylesheetUrls = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      return links.map((link) => (link as HTMLLinkElement).href).filter((href) => href)
    })

    // Download and include external stylesheets
    for (const url of stylesheetUrls) {
      try {
        const cssContent = await this.downloadStylesheet(url)
        if (cssContent) {
          styles.push(`/* Stylesheet from: ${url} */\n${cssContent}`)
        }
      } catch (error) {
        logger.warn(`Failed to download stylesheet: ${url}`, error)
      }
    }

    // Get inline styles from page
    const inlineStyles = await page.evaluate(() => {
      const styles: string[] = []

      // Get all style tags
      const styleTags = Array.from(document.querySelectorAll('style'))
      styleTags.forEach((style) => {
        if (style.textContent) {
          styles.push(style.textContent)
        }
      })

      // Get critical styles from computed styles of key elements
      const criticalElements = [
        'body',
        'header',
        'nav',
        'main',
        'footer',
        'h1',
        'h2',
        'h3',
        'p',
        'a',
        'button',
      ]
      const computedStyles: string[] = []

      criticalElements.forEach((selector) => {
        const elements = document.querySelectorAll(selector)
        if (elements.length > 0) {
          const computed = window.getComputedStyle(elements[0])
          const important = [
            'font-family',
            'font-size',
            'color',
            'background-color',
            'margin',
            'padding',
            'display',
            'position',
          ]
          const rules = important
            .map((prop) => {
              const value = computed.getPropertyValue(prop)
              return value ? `${prop}: ${value}` : ''
            })
            .filter(Boolean)
            .join('; ')

          if (rules) {
            computedStyles.push(`${selector} { ${rules} }`)
          }
        }
      })

      if (computedStyles.length > 0) {
        styles.push(`/* Computed critical styles */\n${computedStyles.join('\n')}`)
      }

      return styles
    })

    styles.push(...inlineStyles)
    return styles
  }

  private async downloadStylesheet(url: string): Promise<string | null> {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      return await response.text()
    } catch (error) {
      logger.warn(`Failed to download stylesheet from ${url}:`, error)
      return null
    }
  }

  private async extractAssets(page: Page) {
    return page.evaluate(() => {
      const assets: Array<{
        url: string
        type: 'image' | 'font' | 'script' | 'stylesheet'
      }> = []

      // Images
      document.querySelectorAll('img[src]').forEach((img) => {
        const src = (img as HTMLImageElement).src
        if (src && !src.startsWith('data:')) {
          assets.push({ url: src, type: 'image' })
        }
      })

      // Background images from CSS
      const elementsWithBg = document.querySelectorAll('[style*="background-image"]')
      elementsWithBg.forEach((el) => {
        const style = (el as HTMLElement).style.backgroundImage
        const match = style.match(/url\(['"]?([^'"]+)['"]?\)/)
        if (match && match[1] && !match[1].startsWith('data:')) {
          assets.push({ url: match[1], type: 'image' })
        }
      })

      // External stylesheets
      document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        const href = (link as HTMLLinkElement).href
        if (href) {
          assets.push({ url: href, type: 'stylesheet' })
        }
      })

      // Scripts (optional, for reference)
      document.querySelectorAll('script[src]').forEach((script) => {
        const src = (script as HTMLScriptElement).src
        if (src && !src.includes('analytics') && !src.includes('gtag')) {
          assets.push({ url: src, type: 'script' })
        }
      })

      return assets
    })
  }

  private async downloadAssetWithRetry(
    url: string,
    maxRetries: number = 3
  ): Promise<Buffer | null> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        // Check content length if available
        const contentLength = response.headers.get('content-length')
        if (contentLength && this.options.maxAssetSize) {
          const size = parseInt(contentLength)
          if (size > this.options.maxAssetSize) {
            logger.warn(`Asset too large (${size} bytes): ${url}`)
            return null
          }
        }

        return Buffer.from(await response.arrayBuffer())
      } catch (error) {
        logger.warn(`Attempt ${i + 1} failed for ${url}:`, error)
        if (i === maxRetries - 1) {
          logger.error(`Failed to download asset after ${maxRetries} attempts: ${url}`)
          return null
        }
        // Exponential backoff
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)))
      }
    }
    return null
  }

  private async downloadAssets(
    assets: Array<{ url: string; type: 'image' | 'font' | 'script' | 'stylesheet' }>
  ): Promise<
    Array<{ url: string; localPath: string; type: 'image' | 'font' | 'script' | 'stylesheet' }>
  > {
    const downloadedAssets = []

    await fs.mkdir(path.join(this.outputDir, 'assets'), { recursive: true })

    for (const asset of assets) {
      try {
        const assetUrl = new URL(asset.url)
        const fileName = path.basename(assetUrl.pathname) || 'index'
        const localPath = path.join('assets', `${Date.now()}-${fileName}`)
        const fullPath = path.join(this.outputDir, localPath)

        // Download the asset with retry
        const buffer = await this.downloadAssetWithRetry(asset.url)
        if (buffer) {
          await fs.writeFile(fullPath, buffer)
          downloadedAssets.push({
            url: asset.url,
            localPath,
            type: asset.type,
          })
        }
      } catch (error) {
        logger.warn(`Failed to process asset: ${asset.url}`, error)
      }
    }

    return downloadedAssets
  }

  async cleanup() {
    if (this.browser) {
      try {
        await this.browser.close()
      } catch (error) {
        logger.error('Failed to close browser:', error)
      } finally {
        this.browser = null
        this.visitedUrls.clear()
        this.pagesScraped = 0
      }
    }
  }
}
