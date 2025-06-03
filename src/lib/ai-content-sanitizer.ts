import * as cheerio from 'cheerio'
import { BrandConfig } from './types'
import { ContentSanitizer } from './content-sanitizer'
import { AIContentEnhancer } from './ai-enhancer'

export class AIContentSanitizer extends ContentSanitizer {
  private aiEnhancer: AIContentEnhancer
  private industry?: string

  constructor(html: string, brandConfig: BrandConfig, industry?: string) {
    super(html, brandConfig)
    this.aiEnhancer = new AIContentEnhancer()
    this.industry = industry
  }

  async sanitizeWithAI(): Promise<string> {
    // First do regular sanitization
    const sanitizedHtml = this.sanitize()

    // Now enhance with AI
    this.$ = cheerio.load(sanitizedHtml)

    // Enhance hero content
    await this.enhanceHeroContent()

    // Enhance about sections
    await this.enhanceAboutContent()

    // Enhance testimonials
    await this.enhanceTestimonials()

    // Enhance car inventory with AI descriptions
    await this.enhanceCarInventory()

    return this.$.html()
  }

  private async enhanceHeroContent() {
    // Find hero sections
    const heroSelectors = [
      '.hero',
      '#hero',
      '[class*="hero"]',
      '.banner',
      '#banner',
      '[class*="banner"]',
      'section:first-of-type h1',
    ]

    for (const selector of heroSelectors) {
      const $hero = this.$(selector)
      if ($hero.length > 0) {
        const $heading = $hero.find('h1, h2').first()
        const $subheading = $hero.find('p').first()

        if ($heading.length > 0 || $subheading.length > 0) {
          const aiContent = await this.aiEnhancer.enhanceContent({
            brandConfig: this.brandConfig,
            originalContent: '',
            contentType: 'hero',
            industry: this.industry,
          })

          const [headline, ...subheadlineParts] = aiContent.split('\n')
          const subheadline = subheadlineParts.join(' ')

          if ($heading.length > 0 && headline) {
            $heading.text(headline)
          }
          if ($subheading.length > 0 && subheadline) {
            $subheading.text(subheadline)
          }
        }
        break // Only enhance the first hero section
      }
    }
  }

  private async enhanceAboutContent() {
    // Find about sections
    const aboutSelectors = [
      '.about',
      '#about',
      '[class*="about"]',
      'section:has(h2:contains("About"))',
      'section:has(h3:contains("About"))',
    ]

    for (const selector of aboutSelectors) {
      const $about = this.$(selector)
      if ($about.length > 0) {
        const $paragraph = $about.find('p').first()

        if ($paragraph.length > 0) {
          const aiContent = await this.aiEnhancer.enhanceContent({
            brandConfig: this.brandConfig,
            originalContent: $paragraph.text(),
            contentType: 'about',
            industry: this.industry,
          })

          $paragraph.text(aiContent)
        }
        break // Only enhance the first about section
      }
    }
  }

  private async enhanceTestimonials() {
    // Find testimonial sections
    const testimonialSelectors = [
      '.testimonial',
      '#testimonials',
      '[class*="testimonial"]',
      '.review',
      '[class*="review"]',
      'blockquote',
    ]

    let testimonialCount = 0
    const promises: Promise<void>[] = []

    for (const selector of testimonialSelectors) {
      this.$(selector).each((index, elem) => {
        if (testimonialCount >= 3) return // Limit to 3 testimonials

        const $elem = this.$(elem)
        const $text = $elem.find('p, .text, .content').first()

        if ($text.length > 0) {
          promises.push(this.enhanceSingleTestimonial($elem, $text, testimonialCount))
          testimonialCount++
        }
      })
    }

    await Promise.all(promises)
  }

  private async enhanceSingleTestimonial(
    $elem: cheerio.Cheerio<any>,
    $text: cheerio.Cheerio<any>,
    index: number
  ) {
    const aiContent = await this.aiEnhancer.enhanceContent({
      brandConfig: this.brandConfig,
      originalContent: '',
      contentType: 'testimonial',
      industry: this.industry,
    })

    $text.text(aiContent)

    // Update customer name if present
    const $name = $elem.find('.name, .author, cite').first()
    if ($name.length > 0) {
      const names = ['Sarah M.', 'John D.', 'Lisa K.', 'Mike R.', 'Emily S.']
      $name.text(names[index % names.length])
    }
  }

  private async enhanceCarInventory() {
    // Find car inventory items
    const inventorySelectors = [
      '.vehicle-item',
      '.car-item',
      '.inventory-item',
      '[class*="vehicle-card"]',
      '[class*="car-card"]',
    ]

    const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz']
    const models = ['Camry', 'Accord', 'F-150', 'Silverado', '3 Series', 'C-Class']
    const years = [2020, 2021, 2022, 2023]

    let carIndex = 0
    const promises: Promise<void>[] = []

    for (const selector of inventorySelectors) {
      this.$(selector).each((index, elem) => {
        if (carIndex >= 6) return // Limit AI descriptions to first 6 cars

        const $elem = this.$(elem)
        const make = makes[carIndex % makes.length]
        const model = models[carIndex % models.length]
        const year = years[carIndex % years.length]

        // Find description area
        const $desc = $elem.find('.description, .details, p').first()
        if ($desc.length > 0) {
          promises.push(this.enhanceSingleCarInventory($desc, make, model, year))
        }

        carIndex++
      })
    }

    await Promise.all(promises)
  }

  private async enhanceSingleCarInventory(
    $desc: cheerio.Cheerio<any>,
    make: string,
    model: string,
    year: number
  ) {
    const aiDescription = await this.aiEnhancer.generateCarInventoryDescriptions(make, model, year)
    $desc.text(aiDescription)
  }
}
