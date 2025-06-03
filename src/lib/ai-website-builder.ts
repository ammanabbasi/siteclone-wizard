import { BrandConfig } from './types'
import { AIContentEnhancer } from './ai-enhancer'

export interface WebsiteSection {
  id: string
  type:
    | 'hero'
    | 'about'
    | 'services'
    | 'features'
    | 'testimonials'
    | 'team'
    | 'gallery'
    | 'cta'
    | 'contact'
    | 'footer'
  title?: string
  content: string
  style?: Record<string, string>
  components?: any[]
}

export interface ProfessionalWebsite {
  sections: WebsiteSection[]
  globalStyles: string
  metadata: {
    title: string
    description: string
    keywords: string[]
  }
}

export class AIWebsiteBuilder {
  private aiEnhancer: AIContentEnhancer

  constructor() {
    this.aiEnhancer = new AIContentEnhancer()
  }

  async buildProfessionalWebsite(brandConfig: BrandConfig): Promise<ProfessionalWebsite> {
    console.log('🤖 AI is building a professional website layout...')

    // Determine sections based on industry
    const sections = await this.determineSections(brandConfig)

    // Generate content for each section
    const populatedSections = await this.populateSections(sections, brandConfig)

    // Generate SEO metadata
    const metadata = await this.aiEnhancer.generateSEOContent(brandConfig, 'home')

    // Generate global styles
    const globalStyles = await this.generateGlobalStyles(brandConfig)

    return {
      sections: populatedSections,
      globalStyles,
      metadata,
    }
  }

  private async determineSections(brandConfig: BrandConfig): Promise<WebsiteSection[]> {
    const { industry } = brandConfig

    // Base sections every website needs
    const baseSections: WebsiteSection[] = [
      { id: 'hero', type: 'hero', content: '' },
      { id: 'about', type: 'about', title: 'About Us', content: '' },
      { id: 'services', type: 'services', title: 'Our Services', content: '' },
      { id: 'testimonials', type: 'testimonials', title: 'What Our Customers Say', content: '' },
      { id: 'contact', type: 'contact', title: 'Get In Touch', content: '' },
      { id: 'footer', type: 'footer', content: '' },
    ]

    // Industry-specific sections
    const industrySections: Record<string, WebsiteSection[]> = {
      automotive: [
        { id: 'inventory', type: 'gallery', title: 'Featured Vehicles', content: '' },
        { id: 'financing', type: 'features', title: 'Financing Options', content: '' },
        { id: 'service', type: 'services', title: 'Service Department', content: '' },
      ],
      healthcare: [
        { id: 'specialties', type: 'services', title: 'Medical Specialties', content: '' },
        { id: 'team', type: 'team', title: 'Our Medical Team', content: '' },
        { id: 'appointments', type: 'cta', title: 'Book an Appointment', content: '' },
      ],
      technology: [
        { id: 'features', type: 'features', title: 'Product Features', content: '' },
        { id: 'demo', type: 'cta', title: 'Request a Demo', content: '' },
        { id: 'integrations', type: 'gallery', title: 'Integrations', content: '' },
      ],
      finance: [
        { id: 'solutions', type: 'services', title: 'Financial Solutions', content: '' },
        { id: 'calculator', type: 'features', title: 'Financial Calculator', content: '' },
        { id: 'consultation', type: 'cta', title: 'Free Consultation', content: '' },
      ],
      retail: [
        { id: 'products', type: 'gallery', title: 'Featured Products', content: '' },
        { id: 'deals', type: 'features', title: 'Special Offers', content: '' },
        { id: 'shipping', type: 'services', title: 'Shipping & Returns', content: '' },
      ],
    }

    // Combine base sections with industry-specific ones
    const additionalSections = industrySections[industry?.toLowerCase() || ''] || []

    // Insert industry sections after services but before testimonials
    const finalSections = [
      ...baseSections.slice(0, 3),
      ...additionalSections,
      ...baseSections.slice(3),
    ]

    return finalSections
  }

  private async populateSections(
    sections: WebsiteSection[],
    brandConfig: BrandConfig
  ): Promise<WebsiteSection[]> {
    const populatedSections = await Promise.all(
      sections.map(async (section) => {
        switch (section.type) {
          case 'hero':
            return await this.generateHeroSection(brandConfig)

          case 'about':
            return await this.generateAboutSection(brandConfig, section)

          case 'services':
            return await this.generateServicesSection(brandConfig, section)

          case 'features':
            return await this.generateFeaturesSection(brandConfig, section)

          case 'testimonials':
            return await this.generateTestimonialsSection(brandConfig, section)

          case 'gallery':
            return await this.generateGallerySection(brandConfig, section)

          case 'cta':
            return await this.generateCTASection(brandConfig, section)

          case 'contact':
            return await this.generateContactSection(brandConfig, section)

          case 'footer':
            return await this.generateFooterSection(brandConfig, section)

          default:
            return section
        }
      })
    )

    return populatedSections
  }

  private async generateHeroSection(brandConfig: BrandConfig): Promise<WebsiteSection> {
    const heroContent = await this.aiEnhancer.enhanceContent({
      brandConfig,
      originalContent: '',
      contentType: 'hero',
      industry: brandConfig.industry,
    })

    const [headline, ...subheadlineParts] = heroContent.split('\n')
    const subheadline = subheadlineParts.join(' ')

    return {
      id: 'hero',
      type: 'hero',
      content: `
        <section class="hero-section" style="background: linear-gradient(135deg, ${brandConfig.colors.primary}15 0%, ${brandConfig.colors.secondary}15 100%); padding: 100px 0; text-align: center;">
          <div class="container">
            <h1 style="font-size: 3.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 20px; font-weight: bold;">
              ${headline}
            </h1>
            <p style="font-size: 1.5rem; color: #666; max-width: 600px; margin: 0 auto 40px;">
              ${subheadline}
            </p>
            <div class="hero-buttons">
              <button style="background: ${brandConfig.colors.primary}; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 1.1rem; margin: 10px; cursor: pointer;">
                Get Started
              </button>
              <button style="background: transparent; color: ${brandConfig.colors.primary}; padding: 15px 40px; border: 2px solid ${brandConfig.colors.primary}; border-radius: 8px; font-size: 1.1rem; margin: 10px; cursor: pointer;">
                Learn More
              </button>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateAboutSection(
    brandConfig: BrandConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const aboutContent = await this.aiEnhancer.enhanceContent({
      brandConfig,
      originalContent: '',
      contentType: 'about',
      industry: brandConfig.industry,
    })

    return {
      ...section,
      content: `
        <section class="about-section" style="padding: 80px 0; background: #f8f9fa;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
              ${section.title}
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;">
              <div>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #555;">
                  ${aboutContent}
                </p>
                <div style="margin-top: 30px;">
                  <div style="display: flex; gap: 40px;">
                    <div>
                      <h3 style="color: ${brandConfig.colors.primary}; font-size: 2rem;">10+</h3>
                      <p style="color: #666;">Years Experience</p>
                    </div>
                    <div>
                      <h3 style="color: ${brandConfig.colors.primary}; font-size: 2rem;">1000+</h3>
                      <p style="color: #666;">Happy Customers</p>
                    </div>
                    <div>
                      <h3 style="color: ${brandConfig.colors.primary}; font-size: 2rem;">24/7</h3>
                      <p style="color: #666;">Customer Support</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style="background: ${brandConfig.colors.primary}20; padding: 40px; border-radius: 10px; text-align: center;">
                <img src="/placeholder-about.jpg" alt="About ${brandConfig.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px;">
              </div>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateServicesSection(
    brandConfig: BrandConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const servicesContent = await this.aiEnhancer.enhanceContent({
      brandConfig,
      originalContent: '',
      contentType: 'services',
      industry: brandConfig.industry,
    })

    const services = servicesContent
      .split('\n')
      .filter((s) => s.startsWith('•'))
      .map((s) => s.replace('• ', ''))

    // Generate service cards
    const serviceCards = services
      .map(
        (service, index) => `
      <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s;">
        <div style="width: 80px; height: 80px; background: ${brandConfig.colors.primary}20; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 2rem; color: ${brandConfig.colors.primary};">${['🎯', '⚡', '🛡️', '🌟'][index % 4]}</span>
        </div>
        <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 15px; font-size: 1.5rem;">${service}</h3>
        <p style="color: #666; line-height: 1.6;">Professional ${service.toLowerCase()} solutions tailored to meet your specific needs and exceed expectations.</p>
      </div>
    `
      )
      .join('')

    return {
      ...section,
      content: `
        <section class="services-section" style="padding: 80px 0;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 20px;">
              ${section.title}
            </h2>
            <p style="text-align: center; color: #666; max-width: 600px; margin: 0 auto 50px; font-size: 1.1rem;">
              Discover our comprehensive range of professional services designed to help you succeed
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
              ${serviceCards}
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateFeaturesSection(
    brandConfig: BrandConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    // Generate feature-specific content based on section title
    const features = this.getIndustryFeatures(brandConfig.industry || '')

    const featureCards = features
      .map(
        (feature) => `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 3rem; color: ${brandConfig.colors.accent}; margin-bottom: 20px;">${feature.icon}</div>
        <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 15px;">${feature.title}</h3>
        <p style="color: #666;">${feature.description}</p>
      </div>
    `
      )
      .join('')

    return {
      ...section,
      content: `
        <section class="features-section" style="padding: 80px 0; background: ${brandConfig.colors.primary}10;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
              ${section.title}
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px;">
              ${featureCards}
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateTestimonialsSection(
    brandConfig: BrandConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    // Generate 3 testimonials
    const testimonials = await Promise.all([
      this.aiEnhancer.enhanceContent({
        brandConfig,
        originalContent: '',
        contentType: 'testimonial',
        industry: brandConfig.industry,
      }),
      this.aiEnhancer.enhanceContent({
        brandConfig,
        originalContent: '',
        contentType: 'testimonial',
        industry: brandConfig.industry,
      }),
      this.aiEnhancer.enhanceContent({
        brandConfig,
        originalContent: '',
        contentType: 'testimonial',
        industry: brandConfig.industry,
      }),
    ])

    const names = ['Sarah Johnson', 'Michael Chen', 'Emily Rodriguez']
    const titles = ['Business Owner', 'Marketing Director', 'CEO']

    const testimonialCards = testimonials
      .map(
        (testimonial, index) => `
      <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
        <div style="color: ${brandConfig.colors.accent}; font-size: 3rem; margin-bottom: 20px;">"</div>
        <p style="color: #555; line-height: 1.8; font-style: italic; margin-bottom: 30px;">
          ${testimonial}
        </p>
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="width: 60px; height: 60px; background: ${brandConfig.colors.primary}20; border-radius: 50%;"></div>
          <div>
            <h4 style="color: ${brandConfig.colors.primary}; margin: 0;">${names[index]}</h4>
            <p style="color: #666; margin: 0; font-size: 0.9rem;">${titles[index]}</p>
          </div>
        </div>
      </div>
    `
      )
      .join('')

    return {
      ...section,
      content: `
        <section class="testimonials-section" style="padding: 80px 0; background: #f8f9fa;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
              ${section.title}
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
              ${testimonialCards}
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateGallerySection(
    brandConfig: BrandConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const isAutomotive = brandConfig.industry?.toLowerCase() === 'automotive'

    if (isAutomotive && section.id === 'inventory') {
      // Generate car inventory gallery
      const cars = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hybrid', 'Electric']
      const carCards = await Promise.all(
        cars.map(async (type, index) => {
          const year = 2020 + (index % 4)
          const description = await this.aiEnhancer.generateCarInventoryDescriptions(
            ['Toyota', 'Honda', 'Ford'][index % 3],
            type,
            year
          )

          return `
          <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
            <div style="height: 200px; background: ${brandConfig.colors.primary}20; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 4rem;">🚗</span>
            </div>
            <div style="padding: 20px;">
              <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 10px;">${year} ${type}</h3>
              <p style="color: #666; font-size: 0.9rem; line-height: 1.6; margin-bottom: 20px;">${description}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.5rem; color: ${brandConfig.colors.accent}; font-weight: bold;">Call for Price</span>
                <button style="background: ${brandConfig.colors.primary}; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                  View Details
                </button>
              </div>
            </div>
          </div>
        `
        })
      )

      return {
        ...section,
        content: `
          <section class="gallery-section" style="padding: 80px 0;">
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
              <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
                ${section.title}
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
                ${carCards.join('')}
              </div>
              <div style="text-align: center; margin-top: 50px;">
                <button style="background: ${brandConfig.colors.primary}; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer;">
                  View All Inventory
                </button>
              </div>
            </div>
          </section>
        `,
      }
    }

    // Default gallery for other industries
    const items = Array(6)
      .fill('')
      .map(
        (_, i) => `
      <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); text-align: center;">
        <div style="height: 150px; background: ${brandConfig.colors.primary}20; border-radius: 8px; margin-bottom: 15px;"></div>
        <h4 style="color: ${brandConfig.colors.primary};">Item ${i + 1}</h4>
      </div>
    `
      )

    return {
      ...section,
      content: `
        <section class="gallery-section" style="padding: 80px 0;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
              ${section.title}
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
              ${items.join('')}
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateCTASection(
    brandConfig: BrandConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    return {
      ...section,
      content: `
        <section class="cta-section" style="padding: 80px 0; background: linear-gradient(135deg, ${brandConfig.colors.primary} 0%, ${brandConfig.colors.secondary} 100%); color: white;">
          <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 20px; text-align: center;">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">
              ${section.title}
            </h2>
            <p style="font-size: 1.2rem; margin-bottom: 40px; opacity: 0.9;">
              Take the next step towards success with ${brandConfig.name}
            </p>
            <button style="background: white; color: ${brandConfig.colors.primary}; padding: 18px 50px; border: none; border-radius: 8px; font-size: 1.2rem; font-weight: bold; cursor: pointer;">
              Get Started Today
            </button>
          </div>
        </section>
      `,
    }
  }

  private async generateContactSection(
    brandConfig: BrandConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const contact = brandConfig.contact

    return {
      ...section,
      content: `
        <section class="contact-section" style="padding: 80px 0; background: #f8f9fa;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
              ${section.title}
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
              <div>
                <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 30px;">Contact Information</h3>
                <div style="margin-bottom: 25px;">
                  <h4 style="color: #333; margin-bottom: 10px;">📍 Address</h4>
                  <p style="color: #666;">
                    ${contact?.address?.street || '123 Main Street'}<br>
                    ${contact?.address?.city || 'Your City'}, ${contact?.address?.state || 'ST'} ${contact?.address?.zip || '12345'}
                  </p>
                </div>
                <div style="margin-bottom: 25px;">
                  <h4 style="color: #333; margin-bottom: 10px;">📞 Phone</h4>
                  <p style="color: #666;">${contact?.phone || '(555) 123-4567'}</p>
                </div>
                <div style="margin-bottom: 25px;">
                  <h4 style="color: #333; margin-bottom: 10px;">✉️ Email</h4>
                  <p style="color: #666;">${contact?.email || 'info@example.com'}</p>
                </div>
                ${
                  brandConfig.dealership
                    ? `
                  <div>
                    <h4 style="color: #333; margin-bottom: 10px;">🕐 Business Hours</h4>
                    <p style="color: #666;">
                      Monday - Friday: 9:00 AM - 7:00 PM<br>
                      Saturday: 9:00 AM - 5:00 PM<br>
                      Sunday: 12:00 PM - 5:00 PM
                    </p>
                  </div>
                `
                    : ''
                }
              </div>
              <div>
                <form style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                  <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 30px;">Send Us a Message</h3>
                  <div style="margin-bottom: 20px;">
                    <input type="text" placeholder="Your Name" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  </div>
                  <div style="margin-bottom: 20px;">
                    <input type="email" placeholder="Your Email" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  </div>
                  <div style="margin-bottom: 20px;">
                    <textarea placeholder="Your Message" rows="5" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; resize: vertical;"></textarea>
                  </div>
                  <button type="submit" style="background: ${brandConfig.colors.primary}; color: white; padding: 12px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; width: 100%;">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateFooterSection(
    brandConfig: BrandConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const currentYear = new Date().getFullYear()

    return {
      ...section,
      content: `
        <footer style="background: #222; color: white; padding: 50px 0 30px;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px;">
              <div>
                <h3 style="color: ${brandConfig.colors.accent}; margin-bottom: 20px;">${brandConfig.name}</h3>
                <p style="color: #ccc; line-height: 1.6;">
                  ${brandConfig.tagline || 'Your trusted partner for excellence'}
                </p>
                <div style="margin-top: 20px;">
                  ${brandConfig.social?.facebook ? `<a href="${brandConfig.social.facebook}" style="color: #ccc; margin-right: 15px; text-decoration: none;">Facebook</a>` : ''}
                  ${brandConfig.social?.twitter ? `<a href="${brandConfig.social.twitter}" style="color: #ccc; margin-right: 15px; text-decoration: none;">Twitter</a>` : ''}
                  ${brandConfig.social?.instagram ? `<a href="${brandConfig.social.instagram}" style="color: #ccc; margin-right: 15px; text-decoration: none;">Instagram</a>` : ''}
                  ${brandConfig.social?.linkedin ? `<a href="${brandConfig.social.linkedin}" style="color: #ccc; text-decoration: none;">LinkedIn</a>` : ''}
                </div>
              </div>
              <div>
                <h4 style="color: ${brandConfig.colors.accent}; margin-bottom: 20px;">Quick Links</h4>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><a href="#about" style="color: #ccc; text-decoration: none;">About Us</a></li>
                  <li style="margin-bottom: 10px;"><a href="#services" style="color: #ccc; text-decoration: none;">Services</a></li>
                  <li style="margin-bottom: 10px;"><a href="#contact" style="color: #ccc; text-decoration: none;">Contact</a></li>
                  <li><a href="#" style="color: #ccc; text-decoration: none;">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 style="color: ${brandConfig.colors.accent}; margin-bottom: 20px;">Contact Info</h4>
                <p style="color: #ccc; margin-bottom: 10px;">📞 ${brandConfig.contact?.phone || '(555) 123-4567'}</p>
                <p style="color: #ccc; margin-bottom: 10px;">✉️ ${brandConfig.contact?.email || 'info@example.com'}</p>
                <p style="color: #ccc;">📍 ${brandConfig.contact?.address?.city || 'Your City'}, ${brandConfig.contact?.address?.state || 'ST'}</p>
              </div>
              <div>
                <h4 style="color: ${brandConfig.colors.accent}; margin-bottom: 20px;">Newsletter</h4>
                <p style="color: #ccc; margin-bottom: 20px;">Stay updated with our latest news and offers</p>
                <form style="display: flex; gap: 10px;">
                  <input type="email" placeholder="Your email" style="flex: 1; padding: 10px; border: none; border-radius: 5px;">
                  <button type="submit" style="background: ${brandConfig.colors.accent}; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
            <div style="border-top: 1px solid #444; padding-top: 30px; text-align: center; color: #999;">
              <p>&copy; ${currentYear} ${brandConfig.name}. All rights reserved. | Powered by SiteClone Wizard with AI</p>
            </div>
          </div>
        </footer>
      `,
    }
  }

  private async generateGlobalStyles(brandConfig: BrandConfig): Promise<string> {
    return `
      /* AI-Generated Professional Styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${brandConfig.typography.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
        line-height: 1.6;
        color: #333;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      /* Responsive Grid */
      @media (max-width: 768px) {
        [style*="grid-template-columns"] {
          grid-template-columns: 1fr !important;
        }
      }
      
      /* Smooth Scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Button Hover Effects */
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
      }
      
      /* Card Hover Effects */
      [style*="box-shadow"]:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        transition: all 0.3s ease;
      }
      
      /* Link Styles */
      a {
        color: ${brandConfig.colors.primary};
        text-decoration: none;
        transition: color 0.3s ease;
      }
      
      a:hover {
        color: ${brandConfig.colors.secondary};
      }
      
      /* Form Styles */
      input:focus, textarea:focus {
        outline: none;
        border-color: ${brandConfig.colors.primary} !important;
      }
      
      /* Animation */
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      section {
        animation: fadeIn 0.8s ease-out;
      }
    `
  }

  private getIndustryFeatures(
    industry: string
  ): Array<{ icon: string; title: string; description: string }> {
    const features: Record<string, Array<{ icon: string; title: string; description: string }>> = {
      automotive: [
        {
          icon: '🚗',
          title: 'Wide Selection',
          description: 'Browse our extensive inventory of quality vehicles',
        },
        {
          icon: '💰',
          title: 'Best Prices',
          description: 'Competitive pricing on all makes and models',
        },
        {
          icon: '🔧',
          title: 'Full Service',
          description: 'Complete maintenance and repair services',
        },
        {
          icon: '📋',
          title: 'Easy Financing',
          description: 'Flexible financing options for every budget',
        },
      ],
      healthcare: [
        { icon: '🏥', title: 'Expert Care', description: 'Board-certified medical professionals' },
        {
          icon: '⏰',
          title: '24/7 Availability',
          description: 'Round-the-clock emergency services',
        },
        {
          icon: '💊',
          title: 'Modern Facilities',
          description: 'State-of-the-art medical equipment',
        },
        {
          icon: '❤️',
          title: 'Patient First',
          description: 'Compassionate, patient-centered approach',
        },
      ],
      technology: [
        { icon: '🚀', title: 'Innovation', description: 'Cutting-edge technology solutions' },
        { icon: '🔒', title: 'Security', description: 'Enterprise-grade security features' },
        { icon: '📈', title: 'Scalability', description: 'Grows with your business needs' },
        {
          icon: '🌐',
          title: 'Integration',
          description: 'Seamless integration with existing systems',
        },
      ],
      finance: [
        {
          icon: '💎',
          title: 'Trusted Advisor',
          description: 'Expert financial guidance you can trust',
        },
        { icon: '📊', title: 'Data-Driven', description: 'Analytics-based investment strategies' },
        {
          icon: '🛡️',
          title: 'Risk Management',
          description: 'Comprehensive risk assessment and mitigation',
        },
        {
          icon: '🎯',
          title: 'Goal-Oriented',
          description: 'Tailored plans to meet your financial goals',
        },
      ],
    }

    return (
      features[industry.toLowerCase()] || [
        { icon: '⭐', title: 'Quality Service', description: 'Exceptional service every time' },
        { icon: '👥', title: 'Expert Team', description: 'Skilled professionals at your service' },
        { icon: '💡', title: 'Innovation', description: 'Creative solutions for your needs' },
        { icon: '🤝', title: 'Partnership', description: 'Your success is our priority' },
      ]
    )
  }
}
