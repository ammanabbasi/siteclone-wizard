import * as cheerio from 'cheerio'
import { BrandConfig } from './types'

export class ContentSanitizer {
  protected $: cheerio.CheerioAPI
  private phoneRegex = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
  private emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  private addressPatterns = [
    /\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|place|pl|way),?\s*[\w\s]*,?\s*[A-Z]{2}\s*\d{5}/gi,
    /\d+\s+[\w\s]+,\s*[\w\s]+\s+[A-Z]{2}\s+\d{5}/gi,
  ]

  constructor(
    private html: string,
    protected brandConfig: BrandConfig
  ) {
    this.$ = cheerio.load(html)
  }

  sanitize(): string {
    // Replace phone numbers
    this.replacePhoneNumbers()

    // Replace email addresses
    this.replaceEmails()

    // Replace physical addresses
    this.replaceAddresses()

    // Replace videos
    this.replaceVideos()

    // Replace social media links
    this.replaceSocialLinks()

    // Replace maps/iframes
    this.replaceMaps()

    // Replace specific business content
    this.replaceBusinessContent()

    // Replace images with placeholders
    this.replacePlaceholderImages()

    // Replace car inventory
    this.replaceCarInventory()

    // Fix Windows paths in URLs
    this.fixWindowsPaths()

    // Fix all links to be non-functional
    this.disableAllLinks()

    return this.$.html()
  }

  private replacePhoneNumbers() {
    const phoneNumber = this.brandConfig.contact?.phone || '(555) 123-4567'

    // Replace in text nodes
    this.$('*')
      .contents()
      .each((_, elem) => {
        if (elem.type === 'text' && elem.data) {
          elem.data = elem.data.replace(this.phoneRegex, phoneNumber)
        }
      })

    // Replace in href attributes
    this.$('a[href^="tel:"]').each((_, elem) => {
      this.$(elem).attr('href', `tel:${phoneNumber.replace(/\D/g, '')}`)
      const text = this.$(elem).text()
      if (this.phoneRegex.test(text)) {
        this.$(elem).text(phoneNumber)
      }
    })
  }

  private replaceEmails() {
    const email = this.brandConfig.contact?.email || 'info@example.com'

    // Replace in text nodes
    this.$('*')
      .contents()
      .each((_, elem) => {
        if (elem.type === 'text' && elem.data) {
          elem.data = elem.data.replace(this.emailRegex, email)
        }
      })

    // Replace in href attributes
    this.$('a[href^="mailto:"]').each((_, elem) => {
      this.$(elem).attr('href', `mailto:${email}`)
      const text = this.$(elem).text()
      if (this.emailRegex.test(text)) {
        this.$(elem).text(email)
      }
    })
  }

  private replaceAddresses() {
    const address = this.brandConfig.contact?.address
    const fullAddress = address
      ? `${address.street || '123 Main St'}, ${address.city || 'Anytown'} ${address.state || 'ST'} ${address.zip || '12345'}`
      : '123 Main St, Anytown ST 12345'

    // Find and replace addresses in text
    this.$('*')
      .contents()
      .each((_, elem) => {
        if (elem.type === 'text' && elem.data) {
          this.addressPatterns.forEach((pattern) => {
            elem.data = elem.data!.replace(pattern, fullAddress)
          })
        }
      })

    // Replace in Google Maps links
    this.$('a[href*="maps.google.com"], a[href*="google.com/maps"]').each((_, elem) => {
      const encodedAddress = encodeURIComponent(fullAddress)
      this.$(elem).attr('href', `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`)

      // Update text content if it contains an address
      const text = this.$(elem).text()
      this.addressPatterns.forEach((pattern) => {
        if (pattern.test(text)) {
          this.$(elem).text(fullAddress)
        }
      })
    })
  }

  private replaceVideos() {
    // Replace video sources with placeholder or brand video
    const placeholderVideo = this.brandConfig.content?.heroVideo || ''

    this.$('video source').each((_, elem) => {
      if (placeholderVideo) {
        this.$(elem).attr('src', placeholderVideo)
      } else {
        // Remove video element if no replacement provided
        this.$(elem)
          .closest('video')
          .replaceWith(
            '<div class="video-placeholder" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; height: 400px; color: #666;">' +
              '<p>Your promotional video here</p>' +
              '</div>'
          )
      }
    })

    // Replace YouTube/Vimeo embeds
    this.$('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').each((_, elem) => {
      if (
        placeholderVideo &&
        (placeholderVideo.includes('youtube.com') || placeholderVideo.includes('vimeo.com'))
      ) {
        this.$(elem).attr('src', placeholderVideo)
      } else {
        this.$(elem).replaceWith(
          '<div class="video-placeholder" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; height: 400px; color: #666;">' +
            '<p>Your promotional video here</p>' +
            '</div>'
        )
      }
    })
  }

  private replaceSocialLinks() {
    const socialConfig = this.brandConfig.social || {}

    // Facebook
    this.$('a[href*="facebook.com"]').each((_, elem) => {
      if (socialConfig.facebook) {
        this.$(elem).attr('href', socialConfig.facebook)
      } else {
        this.$(elem).attr('href', '#')
      }
    })

    // Twitter
    this.$('a[href*="twitter.com"], a[href*="x.com"]').each((_, elem) => {
      if (socialConfig.twitter) {
        this.$(elem).attr('href', socialConfig.twitter)
      } else {
        this.$(elem).attr('href', '#')
      }
    })

    // Instagram
    this.$('a[href*="instagram.com"]').each((_, elem) => {
      if (socialConfig.instagram) {
        this.$(elem).attr('href', socialConfig.instagram)
      } else {
        this.$(elem).attr('href', '#')
      }
    })

    // LinkedIn
    this.$('a[href*="linkedin.com"]').each((_, elem) => {
      if (socialConfig.linkedin) {
        this.$(elem).attr('href', socialConfig.linkedin)
      } else {
        this.$(elem).attr('href', '#')
      }
    })

    // YouTube
    this.$('a[href*="youtube.com"]').each((_, elem) => {
      if (socialConfig.youtube) {
        this.$(elem).attr('href', socialConfig.youtube)
      } else {
        this.$(elem).attr('href', '#')
      }
    })
  }

  private replaceMaps() {
    // Replace Google Maps embeds
    this.$('iframe[src*="google.com/maps"]').each((_, elem) => {
      const address = this.brandConfig.contact?.address
      if (address) {
        const fullAddress = `${address.street || '123 Main St'}, ${address.city || 'Anytown'} ${address.state || 'ST'} ${address.zip || '12345'}`
        const encodedAddress = encodeURIComponent(fullAddress)
        this.$(elem).attr(
          'src',
          `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`
        )
      } else {
        this.$(elem).replaceWith(
          '<div class="map-placeholder" style="background: #f0f0f0; display: flex; align-items: center; justify-content: center; height: 400px; color: #666;">' +
            '<p>Your location map here</p>' +
            '</div>'
        )
      }
    })
  }

  private replaceBusinessContent() {
    // Replace business hours
    const hoursPattern =
      /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)[\s-]*(?:to|through|-)?[\s]*(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)?[\s:]*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?/gi

    this.$('*')
      .contents()
      .filter(function () {
        return this.type === 'text' && !!this.data
      })
      .each((_, elem) => {
        if (elem.type === 'text' && elem.data) {
          elem.data = elem.data.replace(hoursPattern, 'Monday - Friday: 9:00 AM - 5:00 PM')
        }
      })

    // Replace copyright text
    const copyrightPattern = /(?:©|Copyright)\s*\d{4}\s*[\w\s\-,\.]+(?:All rights reserved)?/gi
    const currentYear = new Date().getFullYear()

    this.$('*')
      .contents()
      .filter(function () {
        return this.type === 'text' && !!this.data
      })
      .each((_, elem) => {
        if (elem.type === 'text' && elem.data) {
          elem.data = elem.data.replace(
            copyrightPattern,
            `© ${currentYear} ${this.brandConfig.name}. All rights reserved`
          )
        }
      })
  }

  private replacePlaceholderImages() {
    // Replace specific types of images with placeholders
    const imageReplacements = {
      logo: '/placeholder-logo.png',
      banner: '/placeholder-banner.jpg',
      team: '/placeholder-team.jpg',
      testimonial: '/placeholder-testimonial.jpg',
      product: '/placeholder-product.jpg',
      service: '/placeholder-service.jpg',
    }

    // Detect and replace team/staff photos
    this.$('img').each((_, elem) => {
      const src = this.$(elem).attr('src') || ''
      const alt = this.$(elem).attr('alt') || ''
      const classes = this.$(elem).attr('class') || ''

      // Check for team/staff images
      if (
        src.match(/team|staff|employee|ceo|manager|founder/i) ||
        alt.match(/team|staff|employee|ceo|manager|founder/i) ||
        classes.match(/team|staff|employee/i)
      ) {
        this.$(elem).attr('src', imageReplacements.team)
        this.$(elem).attr('alt', 'Team member')
      }

      // Check for testimonial images
      if (
        src.match(/testimonial|review|customer|client/i) ||
        alt.match(/testimonial|review|customer|client/i) ||
        classes.match(/testimonial|review/i)
      ) {
        this.$(elem).attr('src', imageReplacements.testimonial)
        this.$(elem).attr('alt', 'Customer testimonial')
      }

      // Check for product/service images
      if (
        src.match(/product|service|car|vehicle|inventory/i) ||
        alt.match(/product|service|car|vehicle|inventory/i)
      ) {
        this.$(elem).attr('src', imageReplacements.product)
        this.$(elem).attr('alt', 'Product image')
      }
    })
  }

  private replaceCarInventory() {
    // Find and replace car inventory sections - more aggressive approach
    const inventorySelectors = [
      '.inventory',
      '.vehicle',
      '.car',
      '.cars-list',
      '[class*="inventory"]',
      '[class*="vehicle"]',
      '[class*="car-grid"]',
      '[class*="car-list"]',
      '[id*="inventory"]',
      '[id*="vehicle"]',
      'section:has(.vehicle)',
      'div:has(.car-item)',
      '.row:has([class*="vehicle"])',
      '.container:has([class*="car"])',
    ]

    // Also check for common inventory container patterns
    inventorySelectors.forEach((selector) => {
      this.$(selector).each((_, elem) => {
        const $elem = this.$(elem)
        const text = $elem.text().toLowerCase()

        // More comprehensive check for car listings
        if (
          (text.includes('miles') || text.includes('mileage') || text.includes('odometer')) &&
          (text.includes('price') || text.includes('$') || text.includes('sale')) &&
          (text.includes('year') ||
            text.includes('make') ||
            text.includes('model') ||
            text.includes('stock') ||
            text.includes('vin'))
        ) {
          // Replace entire section with placeholder inventory
          const placeholderCount = this.brandConfig.dealership?.inventory?.placeholderCount || 12
          const placeholderInventory = this.generatePlaceholderInventory(placeholderCount)

          $elem.html(placeholderInventory)
        }
      })
    })

    // Find individual car cards/items
    const carItemSelectors = [
      '.car-item',
      '.vehicle-item',
      '.inventory-item',
      '[class*="car-card"]',
      '[class*="vehicle-card"]',
      'article[class*="vehicle"]',
      'div[class*="listing-item"]',
    ]

    carItemSelectors.forEach((selector) => {
      this.$(selector).each((_, elem) => {
        const $elem = this.$(elem)
        const text = $elem.text().toLowerCase()

        // Check if this is a car listing
        if (
          (text.includes('miles') || text.includes('$')) &&
          (text.includes('year') || /\b20\d{2}\b/.test(text) || /\b19\d{2}\b/.test(text))
        ) {
          // Replace with a single placeholder car
          const placeholderCar = this.generateSinglePlaceholderCar()
          $elem.html(placeholderCar)
        }
      })
    })

    // Replace VINs, stock numbers, and prices in any remaining text
    const bodyHtml = this.$('body').html() || ''
    const updatedHtml = bodyHtml
      .replace(/VIN\s*:?\s*[A-HJ-NPR-Z0-9]{17}/gi, 'VIN: SAMPLE12345678901')
      .replace(/Stock\s*#?\s*:?\s*[\w-]+/gi, 'Stock #: DEMO-001')
      .replace(/\$\d{1,3},?\d{0,3}\s*(OBO|obo|firm|FIRM)?/g, '$XX,XXX')
      .replace(/\d{1,3},?\d{0,3}\s*(miles|Miles|MILES|mi|Mi)/g, 'XX,XXX miles')
      .replace(
        /\b(19|20)\d{2}\s+([\w\s]+\s+)?(sedan|suv|truck|coupe|van|convertible)/gi,
        'YEAR Make Model'
      )
    this.$('body').html(updatedHtml)
  }

  private generateSinglePlaceholderCar(): string {
    const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Mazda']
    const models = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback']
    const colors = ['Silver', 'Black', 'White', 'Blue', 'Red', 'Gray']

    const make = makes[Math.floor(Math.random() * makes.length)]
    const model = models[Math.floor(Math.random() * models.length)]
    const color = colors[Math.floor(Math.random() * colors.length)]

    return `
      <div class="placeholder-car-item">
        <img src="/placeholder-car.jpg" alt="Vehicle Photo" style="width: 100%; height: 200px; object-fit: cover; background: #f0f0f0;">
        <h3>YEAR ${make} ${model}</h3>
        <p class="price">$XX,XXX</p>
        <p class="details">${color} • XX,XXX miles</p>
        <p class="stock">Stock #: DEMO-XXX</p>
        <a href="#" onclick="alert('This is a preview. Links are disabled.'); return false;" class="btn">View Details</a>
      </div>
    `
  }

  private generatePlaceholderInventory(count: number): string {
    const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Mazda']
    const models = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback', 'Minivan']
    const years = [2018, 2019, 2020, 2021, 2022, 2023]

    let html = '<div class="placeholder-inventory">'

    for (let i = 0; i < count; i++) {
      const make = makes[i % makes.length]
      const model = models[i % models.length]
      const year = years[i % years.length]

      html += `
        <div class="vehicle-item" style="border: 1px solid #ddd; padding: 20px; margin: 10px; background: #f9f9f9;">
          <img src="/placeholder-car.jpg" alt="Vehicle placeholder" style="width: 100%; max-width: 300px; height: 200px; object-fit: cover; background: #e0e0e0;">
          <h3>${year} ${make} ${model}</h3>
          <p>Price: Call for pricing</p>
          <p>Mileage: Available upon request</p>
          <p>Stock #: DEMO-${String(i + 1).padStart(3, '0')}</p>
          <button style="background: ${this.brandConfig.colors.primary}; color: white; padding: 10px 20px; border: none; cursor: pointer;">
            View Details
          </button>
        </div>
      `
    }

    html += '</div>'
    return html
  }

  private disableAllLinks() {
    // Replace all links with # to prevent navigation
    this.$('a').each((_, elem) => {
      const $elem = this.$(elem)
      const href = $elem.attr('href')

      // Keep mailto and tel links functional
      if (href && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        $elem.attr('href', '#')
        $elem.attr('data-original-href', href)
        $elem.attr('onclick', 'return false;')
      }
    })

    // Disable form submissions
    this.$('form').each((_, elem) => {
      this.$(elem).attr('onsubmit', 'return false;')
    })

    // Replace onclick handlers
    this.$('[onclick]').each((_, elem) => {
      this.$(elem).removeAttr('onclick')
    })
  }

  private fixWindowsPaths() {
    // Fix backslashes in image sources
    this.$('img').each((_, elem) => {
      const src = this.$(elem).attr('src')
      if (src && src.includes('\\')) {
        this.$(elem).attr('src', src.replace(/\\/g, '/'))
      }
    })

    // Fix backslashes in link hrefs
    this.$('link').each((_, elem) => {
      const href = this.$(elem).attr('href')
      if (href && href.includes('\\')) {
        this.$(elem).attr('href', href.replace(/\\/g, '/'))
      }
    })

    // Fix backslashes in CSS background images
    this.$('[style]').each((_, elem) => {
      const style = this.$(elem).attr('style')
      if (style && style.includes('\\')) {
        this.$(elem).attr('style', style.replace(/\\/g, '/'))
      }
    })
  }
}
