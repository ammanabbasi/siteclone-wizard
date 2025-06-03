import * as cheerio from 'cheerio'
import { ScrapeResult } from './scraper'

export interface ParsedComponent {
  type: 'header' | 'nav' | 'hero' | 'section' | 'card' | 'footer' | 'other'
  html: string
  selector: string
  textNodes: Array<{
    text: string
    path: string
    placeholder: string
  }>
  classes: string[]
  id?: string
}

export interface ParseResult {
  components: ParsedComponent[]
  textMap: Record<string, string>
  layout: {
    hasHeader: boolean
    hasFooter: boolean
    hasSidebar: boolean
    mainContentSelector: string
  }
  styles: {
    inlineCritical: string
    external: string[]
  }
}

export class HTMLParser {
  private $: cheerio.CheerioAPI
  private textCounter = 0

  constructor(private scrapeResult: ScrapeResult) {
    this.$ = cheerio.load(scrapeResult.html)
  }

  parse(): ParseResult {
    const components = this.extractComponents()
    const textMap = this.extractTextMap(components)
    const layout = this.analyzeLayout()
    const styles = this.processStyles()

    return {
      components,
      textMap,
      layout,
      styles,
    }
  }

  private extractComponents(): ParsedComponent[] {
    const components: ParsedComponent[] = []
    console.log('Starting component extraction...')

    // Extract header
    const header = this.$('header, [role="banner"], nav:first-of-type').first()
    if (header.length) {
      console.log('Found header component')
      components.push(this.parseComponent(header, 'header'))
    }

    // Extract navigation
    const nav = this.$('nav, [role="navigation"]').not('header nav')
    nav.each((_, el) => {
      console.log('Found nav component')
      components.push(this.parseComponent(this.$(el), 'nav'))
    })

    // Extract hero section
    const hero = this.$(
      'section:first-of-type, .hero, [class*="hero"], [class*="banner"]:not(header)'
    ).first()
    if (hero.length) {
      console.log('Found hero component')
      components.push(this.parseComponent(hero, 'hero'))
    }

    // Extract main sections
    const sections = this.$('section, article, .section, [class*="section"]')
    sections.each((i, el) => {
      if (i < 10) {
        // Limit to first 10 sections
        console.log(`Found section ${i}`)
        components.push(this.parseComponent(this.$(el), 'section'))
      }
    })

    // Extract cards/features
    const cards = this.$('.card, .feature, [class*="card"], [class*="feature"]')
    cards.each((i, el) => {
      if (i < 5) {
        // Limit to first 5 cards
        console.log(`Found card ${i}`)
        components.push(this.parseComponent(this.$(el), 'card'))
      }
    })

    // Extract footer
    const footer = this.$('footer, [role="contentinfo"]').last()
    if (footer.length) {
      console.log('Found footer component')
      components.push(this.parseComponent(footer, 'footer'))
    }

    // Fallback: if no components found, extract main content areas
    if (components.length === 0) {
      console.log('No standard components found, using fallback extraction')

      // Try to find any major content blocks
      const mainBlocks = this.$('main, #main, .main, [role="main"], body > div').slice(0, 5)
      mainBlocks.each((i, el) => {
        const $el = this.$(el)
        if ($el.text().trim().length > 50) {
          // Only include blocks with substantial content
          console.log(`Found fallback block ${i}`)
          components.push(this.parseComponent($el, 'other'))
        }
      })

      // If still no components, extract body content
      if (components.length === 0) {
        console.log('Extracting entire body as fallback')
        const body = this.$('body')
        if (body.length) {
          components.push(this.parseComponent(body, 'other'))
        }
      }
    }

    console.log(`Total components extracted: ${components.length}`)
    return components
  }

  private parseComponent(
    $el: cheerio.Cheerio<any>,
    type: ParsedComponent['type']
  ): ParsedComponent {
    const textNodes = this.extractTextNodes($el)
    const classes = ($el.attr('class') || '').split(' ').filter(Boolean)
    const id = $el.attr('id')
    const html = $el.html() || ''

    // Generate unique selector
    let selector = $el[0].tagName.toLowerCase()
    if (id) {
      selector = `#${id}`
    } else if (classes.length > 0) {
      selector = `.${classes[0]}`
    }

    return {
      type,
      html,
      selector,
      textNodes,
      classes,
      id,
    }
  }

  private extractTextNodes($el: cheerio.Cheerio<any>) {
    const textNodes: ParsedComponent['textNodes'] = []

    const extractText = (el: any, path: string = '') => {
      if (el.type === 'text' && el.data?.trim()) {
        const text = el.data.trim()
        const placeholder = `{{${this.generatePlaceholder(text)}}}`
        textNodes.push({ text, path, placeholder })
      }

      if (el.children) {
        el.children.forEach((child: any, index: number) => {
          if (child.type === 'tag') {
            extractText(child, `${path}/${child.name}[${index}]`)
          } else if (child.type === 'text') {
            extractText(child, path)
          }
        })
      }
    }

    $el.each((_, el) => extractText(el))
    return textNodes
  }

  private generatePlaceholder(text: string): string {
    // Generate semantic placeholder names based on content
    const lowText = text.toLowerCase()

    if (lowText.includes('copyright') || lowText.includes('©')) {
      return 'footer_copyright'
    } else if (lowText.includes('privacy')) {
      return 'footer_privacy'
    } else if (lowText.includes('terms')) {
      return 'footer_terms'
    } else if (text.length > 100) {
      return `content_block_${++this.textCounter}`
    } else if (text.length > 50) {
      return `paragraph_${++this.textCounter}`
    } else if (text.length > 20) {
      return `heading_${++this.textCounter}`
    } else {
      return `text_${++this.textCounter}`
    }
  }

  private extractTextMap(components: ParsedComponent[]): Record<string, string> {
    const textMap: Record<string, string> = {}

    components.forEach((component) => {
      component.textNodes.forEach((node) => {
        textMap[node.placeholder] = node.text
      })
    })

    return textMap
  }

  private detectComponentType($el: cheerio.Cheerio<any>): ParsedComponent['type'] {
    const classes = $el.attr('class') || ''
    const id = $el.attr('id') || ''

    // Check for card patterns
    if (
      classes.includes('card') ||
      classes.includes('tile') ||
      $el.find('.card, .tile').length > 0
    ) {
      return 'card'
    }

    // Check for hero patterns
    if (
      classes.includes('hero') ||
      classes.includes('banner') ||
      id.includes('hero') ||
      $el.find('h1').length > 0
    ) {
      return 'hero'
    }

    // Default to section
    return 'section'
  }

  private analyzeLayout() {
    const hasHeader = this.$('header, [role="banner"]').length > 0
    const hasFooter = this.$('footer, [role="contentinfo"]').length > 0
    const hasSidebar = this.$('aside, [role="complementary"]').length > 0

    // Try to find main content area
    let mainContentSelector = 'main'
    if (!this.$('main').length) {
      mainContentSelector = '[role="main"]'
      if (!this.$('[role="main"]').length) {
        mainContentSelector = '#content, .content, #main, .main'
      }
    }

    return {
      hasHeader,
      hasFooter,
      hasSidebar,
      mainContentSelector,
    }
  }

  private processStyles(): ParseResult['styles'] {
    // Extract critical inline styles
    const criticalStyles: string[] = []

    // Get styles from the scraped CSS
    this.scrapeResult.css.forEach((css) => {
      // Extract only critical CSS (above-the-fold)
      if (css.includes('body') || css.includes('html') || css.includes(':root')) {
        criticalStyles.push(css)
      }
    })

    return {
      inlineCritical: criticalStyles.join('\n'),
      external: this.scrapeResult.assets
        .filter((asset) => asset.type === 'stylesheet')
        .map((asset) => asset.localPath),
    }
  }
}
