import * as cheerio from 'cheerio'
import { ScrapeResult } from './scraper'
import { BrandConfig } from './types'

export interface EnhancedParseResult {
  fullHtml: string
  brandReplacements: Array<{
    selector: string
    type: 'text' | 'attribute' | 'style'
    original: string
    brandKey: string
  }>
  stylesheets: string[]
  scripts: string[]
  assets: Array<{
    url: string
    localPath: string
    type: string
  }>
}

export class EnhancedHTMLParser {
  private $: cheerio.CheerioAPI

  constructor(
    private scrapeResult: ScrapeResult,
    private brandConfig: BrandConfig
  ) {
    this.$ = cheerio.load(scrapeResult.html)
  }

  parse(): EnhancedParseResult {
    // Prepare the HTML with brand replacements
    const brandReplacements = this.identifyBrandReplacements()

    // Apply initial brand replacements
    this.applyBrandReplacements(brandReplacements)

    // Update asset URLs
    this.updateAssetPaths()

    // Inject brand override styles
    this.injectBrandStyles()

    return {
      fullHtml: this.$.html(),
      brandReplacements,
      stylesheets: this.extractStylesheets(),
      scripts: this.extractScripts(),
      assets: this.scrapeResult.assets || [],
    }
  }

  private identifyBrandReplacements() {
    const replacements: EnhancedParseResult['brandReplacements'] = []

    // Find brand name occurrences
    this.$('*').each((_, el) => {
      const $el = this.$(el)
      const text = $el.text()

      // Check for company name patterns
      if (
        text.match(/auto\s*trademark/i) ||
        text.match(/company\s*name/i) ||
        $el.is('title') ||
        ($el.is('h1') && $el.parents('header').length > 0)
      ) {
        // Only add if it's a direct text node
        const textNodes = $el.contents().filter((_, node) => node.type === 'text')
        textNodes.each((_, node) => {
          if (node.type === 'text' && node.data?.match(/auto\s*trademark/i)) {
            replacements.push({
              selector: this.getSelector($el),
              type: 'text',
              original: node.data,
              brandKey: 'name',
            })
          }
        })
      }

      // Check for tagline patterns
      if (
        text.match(/amazing products for everyone/i) ||
        text.match(/tagline/i) ||
        ($el.is('h2') && $el.parents('header').length > 0)
      ) {
        const textNodes = $el.contents().filter((_, node) => node.type === 'text')
        textNodes.each((_, node) => {
          if (node.type === 'text' && node.data?.length > 10 && node.data?.length < 100) {
            replacements.push({
              selector: this.getSelector($el),
              type: 'text',
              original: node.data,
              brandKey: 'tagline',
            })
          }
        })
      }
    })

    // Find logo/image replacements
    this.$('img').each((_, el) => {
      const $el = this.$(el)
      const src = $el.attr('src') || ''
      const alt = $el.attr('alt') || ''

      if (alt.match(/logo/i) || src.match(/logo/i)) {
        replacements.push({
          selector: this.getSelector($el),
          type: 'attribute',
          original: alt,
          brandKey: 'name',
        })
      }
    })

    return replacements
  }

  private applyBrandReplacements(replacements: EnhancedParseResult['brandReplacements']) {
    // Apply text replacements
    replacements.forEach((replacement) => {
      if (replacement.type === 'text' && replacement.brandKey === 'name') {
        // Replace Auto Trademark with brand name
        this.$('*').each((_, el) => {
          const $el = this.$(el)
          $el.contents().each((_, node) => {
            if (node.type === 'text' && node.data) {
              node.data = node.data.replace(/Auto\s*Trademark/gi, this.brandConfig.name)
            }
          })
        })
      }
    })

    // Update title tag
    this.$('title').text(this.brandConfig.name + ' - ' + (this.brandConfig.tagline || ''))

    // Update meta description
    this.$('meta[name="description"]').attr('content', this.brandConfig.tagline || '')
  }

  private updateAssetPaths() {
    if (!this.scrapeResult.assets) return

    // Create asset URL mapping
    const assetMap = new Map(
      this.scrapeResult.assets.map((asset) => [
        asset.url,
        `/assets/${asset.localPath.split('/').pop()}`,
      ])
    )

    // Update image sources
    this.$('img').each((_, el) => {
      const $el = this.$(el)
      const src = $el.attr('src')
      if (src && assetMap.has(src)) {
        $el.attr('src', assetMap.get(src)!)
      }
    })

    // Update CSS background images
    this.$('[style]').each((_, el) => {
      const $el = this.$(el)
      let style = $el.attr('style') || ''

      assetMap.forEach((localPath, originalUrl) => {
        style = style.replace(originalUrl, localPath)
      })

      $el.attr('style', style)
    })
  }

  private injectBrandStyles() {
    const brandStyles = `
    <style id="brand-overrides">
      /* Brand Color Overrides */
      :root {
        --brand-primary: ${this.brandConfig.colors.primary};
        --brand-secondary: ${this.brandConfig.colors.secondary};
        --brand-accent: ${this.brandConfig.colors.accent};
      }
      
      /* Apply brand font */
      body, body * {
        font-family: '${this.brandConfig.typography.fontFamily}', sans-serif !important;
      }
      
      /* Primary color overrides */
      a, .text-primary, h1, h2, h3 {
        color: var(--brand-primary) !important;
      }
      
      /* Button overrides */
      button, .btn, input[type="submit"], input[type="button"], 
      [class*="button"], [class*="btn-"] {
        background-color: var(--brand-primary) !important;
        border-color: var(--brand-primary) !important;
      }
      
      button:hover, .btn:hover, input[type="submit"]:hover, 
      input[type="button"]:hover, [class*="button"]:hover {
        background-color: var(--brand-secondary) !important;
        border-color: var(--brand-secondary) !important;
      }
      
      /* Header/Nav overrides */
      header, nav, .header, .navbar {
        background-color: var(--brand-primary) !important;
      }
      
      header a, nav a, .header a, .navbar a {
        color: white !important;
      }
      
      /* Footer overrides */
      footer, .footer {
        background-color: var(--brand-secondary) !important;
        color: white !important;
      }
      
      footer a, .footer a {
        color: var(--brand-accent) !important;
      }
    </style>
    `

    // Add brand styles to head
    this.$('head').append(brandStyles)

    // Add Google Font link
    const fontLink = `<link href="https://fonts.googleapis.com/css2?family=${this.brandConfig.typography.fontFamily.replace(' ', '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">`
    this.$('head').append(fontLink)
  }

  private extractStylesheets(): string[] {
    const stylesheets: string[] = []

    // Get all CSS content
    this.scrapeResult.css.forEach((css) => {
      stylesheets.push(css)
    })

    return stylesheets
  }

  private extractScripts(): string[] {
    const scripts: string[] = []

    this.$('script').each((_, el) => {
      const $el = this.$(el)
      const src = $el.attr('src')
      const content = $el.html()

      if (src) {
        scripts.push(`<script src="${src}"></script>`)
      } else if (content) {
        scripts.push(`<script>${content}</script>`)
      }
    })

    return scripts
  }

  private getSelector(el: cheerio.Cheerio<any>): string {
    const id = el.attr('id')
    if (id) return `#${id}`

    const classes = el.attr('class')
    if (classes) {
      const firstClass = classes.split(' ')[0]
      return `.${firstClass}`
    }

    return el.prop('tagName')?.toLowerCase() || 'div'
  }
}
