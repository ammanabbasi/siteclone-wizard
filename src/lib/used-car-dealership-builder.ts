import { BrandConfig } from './types'
import { AIContentEnhancer } from './ai-enhancer'
import { WebsiteSection, ProfessionalWebsite } from './ai-website-builder'
import { logger } from './logger'

export interface DealershipConfig extends BrandConfig {
  dealership: {
    dealerLicense: string
    salesHours: {
      weekday: string
      saturday: string
      sunday: string
    }
    serviceHours: {
      weekday: string
      saturday: string
      sunday: string
    }
    inventory: {
      source: 'manual' | 'api' | 'csv' | 'xml'
      apiUrl?: string
      apiKey?: string
      placeholderCount?: number
    }
    financing: {
      partners: string[]
      disclaimer: string
      creditRange: string
    }
    services: string[]
    certifications: string[]
  }
}

export class UsedCarDealershipBuilder {
  private aiEnhancer: AIContentEnhancer

  constructor() {
    this.aiEnhancer = new AIContentEnhancer()
  }

  async buildDealershipWebsite(
    brandConfig: DealershipConfig
  ): Promise<ProfessionalWebsite> {
    logger.info('Building used car dealership website', { brandName: brandConfig.name })

    // Force automotive industry
    brandConfig.industry = 'automotive'

    // Determine sections based on dealership type
    const sections = await this.determineDealershipSections(brandConfig)

    // Populate sections with dealership-specific content
    const populatedSections = await this.populateSections(sections, brandConfig)

    // Generate SEO metadata
    const metadata = await this.generateDealershipSEO(brandConfig)

    // Generate global styles
    const globalStyles = await this.generateDealershipStyles(brandConfig)

    return {
      sections: populatedSections,
      globalStyles,
      metadata,
    }
  }

  private async determineDealershipSections(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    brandConfig: DealershipConfig
  ): Promise<WebsiteSection[]> {
    // Sections specifically tailored for used car dealerships
    return [
      { id: 'hero', type: 'hero', content: '' },
      { id: 'inventory-search', type: 'features', title: 'Search Our Inventory', content: '' },
      { id: 'featured-vehicles', type: 'gallery', title: 'Featured Vehicles', content: '' },
      { id: 'financing', type: 'features', title: 'Financing Options', content: '' },
      { id: 'trade-in', type: 'cta', title: 'Trade-In Your Vehicle', content: '' },
      { id: 'about', type: 'about', title: 'Why Choose Us', content: '' },
      { id: 'services', type: 'services', title: 'Our Services', content: '' },
      { id: 'testimonials', type: 'testimonials', title: 'Customer Reviews', content: '' },
      { id: 'dealership-info', type: 'features', title: 'Dealership Information', content: '' },
      { id: 'contact', type: 'contact', title: 'Visit Our Dealership', content: '' },
      { id: 'footer', type: 'footer', content: '' },
    ]
  }

  private async populateSections(
    sections: WebsiteSection[],
    brandConfig: DealershipConfig
  ): Promise<WebsiteSection[]> {
    return await Promise.all(
      sections.map(async (section) => {
        switch (section.id) {
          case 'hero':
            return await this.generateDealershipHero(brandConfig)

          case 'inventory-search':
            return await this.generateInventorySearch(brandConfig, section)

          case 'featured-vehicles':
            return await this.generateFeaturedVehicles(brandConfig, section)

          case 'financing':
            return await this.generateFinancingSection(brandConfig, section)

          case 'trade-in':
            return await this.generateTradeInSection(brandConfig, section)

          case 'about':
            return await this.generateDealershipAbout(brandConfig, section)

          case 'services':
            return await this.generateDealershipServices(brandConfig, section)

          case 'testimonials':
            return await this.generateDealershipTestimonials(brandConfig, section)

          case 'dealership-info':
            return await this.generateDealershipInfo(brandConfig, section)

          case 'contact':
            return await this.generateDealershipContact(brandConfig, section)

          case 'footer':
            return await this.generateDealershipFooter(brandConfig, section)

          default:
            return section
        }
      })
    )
  }

  private async generateDealershipHero(brandConfig: DealershipConfig): Promise<WebsiteSection> {
    return {
      id: 'hero',
      type: 'hero',
      content: `
        <section class="hero-section" style="background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/placeholder-car-lot.jpg') center/cover; padding: 150px 0; text-align: center; color: white;">
          <div class="container">
            <h1 style="font-size: 4rem; margin-bottom: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
              ${brandConfig.name}
            </h1>
            <p style="font-size: 1.8rem; max-width: 700px; margin: 0 auto 40px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
              ${brandConfig.tagline || 'Quality Pre-Owned Vehicles at Unbeatable Prices'}
            </p>
            <div class="hero-buttons">
              <button style="background: ${brandConfig.colors.primary}; color: white; padding: 18px 50px; border: none; border-radius: 8px; font-size: 1.2rem; margin: 10px; cursor: pointer; font-weight: bold;">
                View Inventory
              </button>
              <button style="background: transparent; color: white; padding: 18px 50px; border: 2px solid white; border-radius: 8px; font-size: 1.2rem; margin: 10px; cursor: pointer; font-weight: bold;">
                Get Pre-Approved
              </button>
            </div>
            <div style="margin-top: 60px; display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
              <div style="text-align: center;">
                <h3 style="font-size: 3rem; margin: 0;">${brandConfig.dealership.inventory?.placeholderCount || 50}+</h3>
                <p style="font-size: 1.1rem;">Vehicles in Stock</p>
              </div>
              <div style="text-align: center;">
                <h3 style="font-size: 3rem; margin: 0;">100%</h3>
                <p style="font-size: 1.1rem;">Financing Approval</p>
              </div>
              <div style="text-align: center;">
                <h3 style="font-size: 3rem; margin: 0;">5★</h3>
                <p style="font-size: 1.1rem;">Customer Rating</p>
              </div>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateInventorySearch(
    brandConfig: DealershipConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    return {
      ...section,
      content: `
        <section class="inventory-search-section" style="padding: 60px 0; background: #f8f9fa;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 40px;">
              ${section.title}
            </h2>
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                <select style="padding: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  <option>All Makes</option>
                  <option>Toyota</option>
                  <option>Honda</option>
                  <option>Ford</option>
                  <option>Chevrolet</option>
                  <option>Nissan</option>
                </select>
                <select style="padding: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  <option>All Models</option>
                </select>
                <select style="padding: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  <option>All Years</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                </select>
                <select style="padding: 15px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  <option>Price Range</option>
                  <option>Under $10,000</option>
                  <option>$10,000 - $20,000</option>
                  <option>$20,000 - $30,000</option>
                  <option>Over $30,000</option>
                </select>
              </div>
              <button style="background: ${brandConfig.colors.primary}; color: white; padding: 15px 50px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; width: 100%;">
                Search ${brandConfig.dealership.inventory?.placeholderCount || 50}+ Vehicles
              </button>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666;">
                Can't find what you're looking for? 
                <a href="#contact" style="color: ${brandConfig.colors.primary}; text-decoration: none; font-weight: bold;">
                  Contact us
                </a> and we'll help you find your perfect vehicle!
              </p>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateFeaturedVehicles(
    brandConfig: DealershipConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    // Generate realistic placeholder vehicles
    const vehicles = [
      {
        year: 2022,
        make: 'Toyota',
        model: 'Camry',
        price: '$24,995',
        mileage: '28,500',
        type: 'Sedan',
      },
      {
        year: 2021,
        make: 'Honda',
        model: 'CR-V',
        price: '$28,995',
        mileage: '35,200',
        type: 'SUV',
      },
      {
        year: 2023,
        make: 'Ford',
        model: 'F-150',
        price: '$42,995',
        mileage: '15,800',
        type: 'Truck',
      },
      {
        year: 2022,
        make: 'Chevrolet',
        model: 'Malibu',
        price: '$22,995',
        mileage: '31,000',
        type: 'Sedan',
      },
      {
        year: 2021,
        make: 'Nissan',
        model: 'Rogue',
        price: '$26,995',
        mileage: '29,400',
        type: 'SUV',
      },
      {
        year: 2020,
        make: 'Toyota',
        model: 'Tacoma',
        price: '$34,995',
        mileage: '42,100',
        type: 'Truck',
      },
    ]

    const vehicleCards = vehicles.map(
      (vehicle) => `
      <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1); transition: transform 0.3s;">
        <div style="position: relative;">
          <div style="height: 250px; background: ${brandConfig.colors.primary}20; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 5rem;">🚗</span>
          </div>
          <div style="position: absolute; top: 10px; right: 10px; background: ${brandConfig.colors.accent}; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold;">
            ${vehicle.type}
          </div>
        </div>
        <div style="padding: 25px;">
          <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 10px; font-size: 1.4rem;">
            ${vehicle.year} ${vehicle.make} ${vehicle.model}
          </h3>
          <div style="color: #666; margin-bottom: 20px;">
            <p style="margin: 5px 0;">📏 ${vehicle.mileage} miles</p>
            <p style="margin: 5px 0;">⛽ Fuel Efficient</p>
            <p style="margin: 5px 0;">✓ Clean CARFAX</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
            <span style="font-size: 1.8rem; color: ${brandConfig.colors.accent}; font-weight: bold;">
              ${vehicle.price}
            </span>
            <button style="background: ${brandConfig.colors.primary}; color: white; padding: 10px 25px; border: none; border-radius: 5px; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>
      </div>
    `
    )

    return {
      ...section,
      content: `
        <section class="featured-vehicles-section" style="padding: 80px 0;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 20px;">
              ${section.title}
            </h2>
            <p style="text-align: center; color: #666; max-width: 600px; margin: 0 auto 50px; font-size: 1.1rem;">
              Hand-picked quality vehicles at competitive prices
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
              ${vehicleCards.join('')}
            </div>
            <div style="text-align: center; margin-top: 50px;">
              <button style="background: ${brandConfig.colors.primary}; color: white; padding: 18px 50px; border: none; border-radius: 8px; font-size: 1.2rem; cursor: pointer;">
                View All ${brandConfig.dealership.inventory?.placeholderCount || 50}+ Vehicles
              </button>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateFinancingSection(
    brandConfig: DealershipConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const partners = brandConfig.dealership.financing?.partners || [
      'Capital One',
      'Chase Auto',
      'Wells Fargo',
    ]

    return {
      ...section,
      content: `
        <section class="financing-section" style="padding: 80px 0; background: ${brandConfig.colors.primary}10;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
              ${section.title}
            </h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;">
              <div>
                <h3 style="color: ${brandConfig.colors.primary}; font-size: 1.8rem; margin-bottom: 20px;">
                  Get Pre-Approved in Minutes
                </h3>
                <p style="color: #666; line-height: 1.8; margin-bottom: 30px;">
                  ${brandConfig.dealership.financing?.disclaimer || 'We work with all credit types to get you the best financing options available.'}
                </p>
                <div style="margin-bottom: 30px;">
                  <h4 style="color: #333; margin-bottom: 15px;">✓ ${brandConfig.dealership.financing?.creditRange || 'All Credit Types Welcome'}</h4>
                  <h4 style="color: #333; margin-bottom: 15px;">✓ Competitive Interest Rates</h4>
                  <h4 style="color: #333; margin-bottom: 15px;">✓ Flexible Payment Terms</h4>
                  <h4 style="color: #333; margin-bottom: 15px;">✓ Quick Approval Process</h4>
                </div>
                <div style="margin-bottom: 30px;">
                  <p style="color: #666; font-weight: bold; margin-bottom: 10px;">Our Financing Partners:</p>
                  <p style="color: #666;">${partners.join(' • ')}</p>
                </div>
                <button style="background: ${brandConfig.colors.primary}; color: white; padding: 15px 40px; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer;">
                  Apply for Financing
                </button>
              </div>
              <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 30px;">
                  Calculate Your Payment
                </h3>
                <div style="margin-bottom: 20px;">
                  <label style="display: block; color: #666; margin-bottom: 8px;">Vehicle Price</label>
                  <input type="text" value="$25,000" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                </div>
                <div style="margin-bottom: 20px;">
                  <label style="display: block; color: #666; margin-bottom: 8px;">Down Payment</label>
                  <input type="text" value="$5,000" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                </div>
                <div style="margin-bottom: 20px;">
                  <label style="display: block; color: #666; margin-bottom: 8px;">Loan Term</label>
                  <select style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                    <option>36 months</option>
                    <option>48 months</option>
                    <option selected>60 months</option>
                    <option>72 months</option>
                  </select>
                </div>
                <div style="background: ${brandConfig.colors.primary}10; padding: 20px; border-radius: 5px; text-align: center;">
                  <p style="color: #666; margin-bottom: 5px;">Estimated Monthly Payment</p>
                  <p style="font-size: 2.5rem; color: ${brandConfig.colors.primary}; font-weight: bold; margin: 0;">$375/mo</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateTradeInSection(
    brandConfig: DealershipConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    return {
      ...section,
      content: `
        <section class="trade-in-section" style="padding: 80px 0; background: linear-gradient(135deg, ${brandConfig.colors.primary} 0%, ${brandConfig.colors.secondary || brandConfig.colors.primary} 100%); color: white;">
          <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 20px; text-align: center;">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">
              ${section.title}
            </h2>
            <p style="font-size: 1.3rem; margin-bottom: 40px; opacity: 0.9;">
              Get top dollar for your current vehicle! We accept all makes and models.
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; margin-bottom: 40px;">
              <div>
                <h3 style="font-size: 3rem; margin-bottom: 10px;">💰</h3>
                <h4>Instant Cash Offer</h4>
              </div>
              <div>
                <h3 style="font-size: 3rem; margin-bottom: 10px;">🚗</h3>
                <h4>All Vehicles Accepted</h4>
              </div>
              <div>
                <h3 style="font-size: 3rem; margin-bottom: 10px;">📋</h3>
                <h4>Simple Process</h4>
              </div>
            </div>
            <button style="background: white; color: ${brandConfig.colors.primary}; padding: 18px 50px; border: none; border-radius: 8px; font-size: 1.2rem; font-weight: bold; cursor: pointer;">
              Get Your Trade-In Value
            </button>
          </div>
        </section>
      `,
    }
  }

  private async generateDealershipAbout(
    brandConfig: DealershipConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const aboutContent = await this.aiEnhancer.enhanceContent({
      brandConfig,
      originalContent: '',
      contentType: 'about',
      industry: 'automotive',
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
                <h3 style="color: ${brandConfig.colors.primary}; font-size: 1.8rem; margin-bottom: 20px;">
                  Your Trusted Local Dealership
                </h3>
                <p style="font-size: 1.1rem; line-height: 1.8; color: #555; margin-bottom: 30px;">
                  ${aboutContent}
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                  ${
                    brandConfig.dealership.certifications
                      ?.map(
                        (cert) => `
                    <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                      <h4 style="color: ${brandConfig.colors.primary}; margin-bottom: 5px;">✓ ${cert}</h4>
                    </div>
                  `
                      )
                      .join('') || ''
                  }
                </div>
              </div>
              <div style="background: ${brandConfig.colors.primary}20; padding: 40px; border-radius: 10px;">
                <div style="text-align: center;">
                  <h3 style="color: ${brandConfig.colors.primary}; font-size: 3rem; margin-bottom: 10px;">10+</h3>
                  <p style="color: #666; font-size: 1.1rem;">Years in Business</p>
                </div>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <div style="text-align: center;">
                  <h3 style="color: ${brandConfig.colors.primary}; font-size: 3rem; margin-bottom: 10px;">5,000+</h3>
                  <p style="color: #666; font-size: 1.1rem;">Happy Customers</p>
                </div>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                <div style="text-align: center;">
                  <h3 style="color: ${brandConfig.colors.primary}; font-size: 3rem; margin-bottom: 10px;">A+</h3>
                  <p style="color: #666; font-size: 1.1rem;">BBB Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateDealershipServices(
    brandConfig: DealershipConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const services = brandConfig.dealership.services || [
      'Vehicle Inspection',
      'Extended Warranties',
      'Trade-In Services',
      'Financing Assistance',
      'Vehicle History Reports',
      'Title & Registration',
    ]

    const serviceCards = services.map(
      (service, index) => `
      <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); text-align: center;">
        <div style="width: 80px; height: 80px; background: ${brandConfig.colors.primary}20; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 2.5rem; color: ${brandConfig.colors.primary};">
            ${['🔍', '📋', '🔄', '💳', '📊', '📄'][index % 6]}
          </span>
        </div>
        <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 15px; font-size: 1.3rem;">${service}</h3>
        <p style="color: #666; line-height: 1.6;">Professional ${service.toLowerCase()} to ensure your complete satisfaction.</p>
      </div>
    `
    )

    return {
      ...section,
      content: `
        <section class="services-section" style="padding: 80px 0;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 20px;">
              ${section.title}
            </h2>
            <p style="text-align: center; color: #666; max-width: 600px; margin: 0 auto 50px; font-size: 1.1rem;">
              Complete automotive solutions to make your car buying experience seamless
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
              ${serviceCards.join('')}
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateDealershipTestimonials(
    brandConfig: DealershipConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const testimonials = [
      {
        text: "Best car buying experience I've ever had! The team was professional, honest, and helped me find the perfect vehicle within my budget.",
        author: 'Sarah M.',
        vehicle: '2022 Honda CR-V',
      },
      {
        text: "They worked with my credit situation and got me approved when other dealerships couldn't. Highly recommend!",
        author: 'James T.',
        vehicle: '2021 Toyota Camry',
      },
      {
        text: "Transparent pricing, no hidden fees, and excellent customer service. I'll definitely be back for my next vehicle!",
        author: 'Maria G.',
        vehicle: '2023 Ford F-150',
      },
    ]

    const testimonialCards = testimonials.map(
      (testimonial) => `
      <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
        <div style="color: ${brandConfig.colors.accent}; font-size: 3rem; margin-bottom: 20px;">★★★★★</div>
        <p style="color: #555; line-height: 1.8; font-style: italic; margin-bottom: 30px;">
          "${testimonial.text}"
        </p>
        <div style="border-top: 1px solid #eee; padding-top: 20px;">
          <h4 style="color: ${brandConfig.colors.primary}; margin: 0;">${testimonial.author}</h4>
          <p style="color: #666; margin: 5px 0; font-size: 0.9rem;">Purchased: ${testimonial.vehicle}</p>
        </div>
      </div>
    `
    )

    return {
      ...section,
      content: `
        <section class="testimonials-section" style="padding: 80px 0; background: #f8f9fa;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
              ${section.title}
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
              ${testimonialCards.join('')}
            </div>
            <div style="text-align: center; margin-top: 50px;">
              <p style="color: #666; font-size: 1.1rem;">
                Read more reviews on 
                <a href="#" style="color: ${brandConfig.colors.primary}; text-decoration: none; font-weight: bold;">Google</a>,
                <a href="#" style="color: ${brandConfig.colors.primary}; text-decoration: none; font-weight: bold;">Facebook</a>, and
                <a href="#" style="color: ${brandConfig.colors.primary}; text-decoration: none; font-weight: bold;">Cars.com</a>
              </p>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateDealershipInfo(
    brandConfig: DealershipConfig,
    section: WebsiteSection
  ): Promise<WebsiteSection> {
    const { dealership } = brandConfig

    return {
      ...section,
      content: `
        <section class="dealership-info-section" style="padding: 80px 0;">
          <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
            <h2 style="text-align: center; font-size: 2.5rem; color: ${brandConfig.colors.primary}; margin-bottom: 50px;">
              ${section.title}
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
              <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 25px;">
                  <span style="font-size: 2rem; margin-right: 10px;">🕐</span>
                  Sales Hours
                </h3>
                <p style="color: #666; line-height: 2;">
                  <strong>Monday - Friday:</strong><br>${dealership.salesHours.weekday}<br>
                  <strong>Saturday:</strong><br>${dealership.salesHours.saturday}<br>
                  <strong>Sunday:</strong><br>${dealership.salesHours.sunday}
                </p>
              </div>
              <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 25px;">
                  <span style="font-size: 2rem; margin-right: 10px;">🔧</span>
                  Service Hours
                </h3>
                <p style="color: #666; line-height: 2;">
                  <strong>Monday - Friday:</strong><br>${dealership.serviceHours.weekday}<br>
                  <strong>Saturday:</strong><br>${dealership.serviceHours.saturday}<br>
                  <strong>Sunday:</strong><br>${dealership.serviceHours.sunday}
                </p>
              </div>
              <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 25px;">
                  <span style="font-size: 2rem; margin-right: 10px;">📜</span>
                  License & Certifications
                </h3>
                <p style="color: #666; line-height: 2;">
                  <strong>Dealer License:</strong><br>${dealership.dealerLicense}<br>
                  <strong>Inventory Source:</strong><br>${dealership.inventory.source.toUpperCase()}<br>
                  <strong>Certifications:</strong><br>${dealership.certifications?.join(', ') || 'BBB Accredited'}
                </p>
              </div>
            </div>
          </div>
        </section>
      `,
    }
  }

  private async generateDealershipContact(
    brandConfig: DealershipConfig,
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
                <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); margin-bottom: 30px;">
                  <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 30px;">Dealership Location</h3>
                  <div style="margin-bottom: 25px;">
                    <h4 style="color: #333; margin-bottom: 10px;">📍 Address</h4>
                    <p style="color: #666; line-height: 1.6;">
                      ${contact?.address?.street || '123 Auto Drive'}<br>
                      ${contact?.address?.city || 'Your City'}, ${contact?.address?.state || 'ST'} ${contact?.address?.zip || '12345'}
                    </p>
                  </div>
                  <div style="margin-bottom: 25px;">
                    <h4 style="color: #333; margin-bottom: 10px;">📞 Sales</h4>
                    <p style="color: #666; font-size: 1.2rem; font-weight: bold;">
                      ${contact?.phone || '(555) 123-4567'}
                    </p>
                  </div>
                  <div style="margin-bottom: 25px;">
                    <h4 style="color: #333; margin-bottom: 10px;">✉️ Email</h4>
                    <p style="color: #666;">
                      ${contact?.email || 'sales@dealership.com'}
                    </p>
                  </div>
                </div>
                <div style="background: ${brandConfig.colors.primary}; color: white; padding: 30px; border-radius: 10px; text-align: center;">
                  <h3 style="margin-bottom: 20px;">Quick Links</h3>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <button style="background: white; color: ${brandConfig.colors.primary}; padding: 12px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">
                      Schedule Test Drive
                    </button>
                    <button style="background: white; color: ${brandConfig.colors.primary}; padding: 12px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">
                      Get Directions
                    </button>
                    <button style="background: white; color: ${brandConfig.colors.primary}; padding: 12px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">
                      Value Trade-In
                    </button>
                    <button style="background: white; color: ${brandConfig.colors.primary}; padding: 12px; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">
                      Apply for Credit
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <form style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
                  <h3 style="color: ${brandConfig.colors.primary}; margin-bottom: 30px;">Contact Us Today</h3>
                  <div style="margin-bottom: 20px;">
                    <input type="text" placeholder="Your Name" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  </div>
                  <div style="margin-bottom: 20px;">
                    <input type="tel" placeholder="Phone Number" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  </div>
                  <div style="margin-bottom: 20px;">
                    <input type="email" placeholder="Email Address" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                  </div>
                  <div style="margin-bottom: 20px;">
                    <select style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                      <option>I'm interested in...</option>
                      <option>Buying a Vehicle</option>
                      <option>Trading In My Vehicle</option>
                      <option>Financing Options</option>
                      <option>Scheduling a Test Drive</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div style="margin-bottom: 20px;">
                    <textarea placeholder="Tell us more about what you're looking for..." rows="4" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; resize: vertical;"></textarea>
                  </div>
                  <button type="submit" style="background: ${brandConfig.colors.primary}; color: white; padding: 15px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; width: 100%; font-weight: bold;">
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

  private async generateDealershipFooter(
    brandConfig: DealershipConfig,
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
                <p style="color: #ccc; line-height: 1.6; margin-bottom: 20px;">
                  ${brandConfig.tagline || 'Your trusted partner for quality pre-owned vehicles'}
                </p>
                <p style="color: #ccc;">
                  <strong>Dealer License:</strong> ${brandConfig.dealership.dealerLicense}
                </p>
              </div>
              <div>
                <h4 style="color: white; margin-bottom: 20px;">Quick Links</h4>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><a href="#inventory" style="color: #ccc; text-decoration: none;">View Inventory</a></li>
                  <li style="margin-bottom: 10px;"><a href="#financing" style="color: #ccc; text-decoration: none;">Financing</a></li>
                  <li style="margin-bottom: 10px;"><a href="#trade-in" style="color: #ccc; text-decoration: none;">Trade-In</a></li>
                  <li style="margin-bottom: 10px;"><a href="#about" style="color: #ccc; text-decoration: none;">About Us</a></li>
                  <li style="margin-bottom: 10px;"><a href="#contact" style="color: #ccc; text-decoration: none;">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 style="color: white; margin-bottom: 20px;">Services</h4>
                <ul style="list-style: none; padding: 0;">
                  ${
                    brandConfig.dealership.services
                      ?.slice(0, 5)
                      .map(
                        (service) =>
                          `<li style="margin-bottom: 10px;"><a href="#services" style="color: #ccc; text-decoration: none;">${service}</a></li>`
                      )
                      .join('') || ''
                  }
                </ul>
              </div>
              <div>
                <h4 style="color: white; margin-bottom: 20px;">Connect With Us</h4>
                <p style="color: #ccc; margin-bottom: 15px;">
                  <strong>Sales:</strong> ${brandConfig.contact?.phone || '(555) 123-4567'}
                </p>
                <p style="color: #ccc; margin-bottom: 20px;">
                  <strong>Email:</strong> ${brandConfig.contact?.email || 'info@dealership.com'}
                </p>
                <div style="display: flex; gap: 15px;">
                  ${brandConfig.social?.facebook ? `<a href="${brandConfig.social.facebook}" style="color: #ccc; font-size: 1.5rem;">📘</a>` : ''}
                  ${brandConfig.social?.instagram ? `<a href="${brandConfig.social.instagram}" style="color: #ccc; font-size: 1.5rem;">📷</a>` : ''}
                  ${brandConfig.social?.youtube ? `<a href="${brandConfig.social.youtube}" style="color: #ccc; font-size: 1.5rem;">📺</a>` : ''}
                </div>
              </div>
            </div>
            <div style="border-top: 1px solid #444; padding-top: 30px; text-align: center;">
              <p style="color: #ccc; margin-bottom: 10px;">
                © ${currentYear} ${brandConfig.name}. All rights reserved. | 
                <a href="#" style="color: #ccc; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                <a href="#" style="color: #ccc; text-decoration: none; margin: 0 10px;">Terms of Service</a>
              </p>
              <p style="color: #666; font-size: 0.9rem;">
                Website powered by SiteClone Wizard AI - Specialized for Independent Used Car Dealerships
              </p>
            </div>
          </div>
        </footer>
      `,
    }
  }

  private async generateDealershipSEO(brandConfig: DealershipConfig) {
    const cityState = brandConfig.contact?.address
      ? `${brandConfig.contact.address.city}, ${brandConfig.contact.address.state}`
      : 'Your Area'

    return {
      title: `${brandConfig.name} - Used Cars in ${cityState} | Quality Pre-Owned Vehicles`,
      description: `Find quality used cars at ${brandConfig.name} in ${cityState}. ${brandConfig.dealership.financing?.creditRange || 'All credit types welcome'}. Browse our inventory of ${brandConfig.dealership.inventory?.placeholderCount || 50}+ vehicles online!`,
      keywords: [
        'used cars',
        'pre-owned vehicles',
        'car dealership',
        `used cars ${cityState}`,
        'auto financing',
        'trade in',
        brandConfig.name,
        'independent dealer',
        'quality used cars',
      ],
    }
  }

  private async generateDealershipStyles(brandConfig: DealershipConfig): Promise<string> {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${brandConfig.typography.fontFamily || 'Inter'}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      button {
        transition: all 0.3s ease;
      }
      
      button:hover {
        opacity: 0.9;
        transform: translateY(-2px);
      }
      
      input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: ${brandConfig.colors.primary};
      }
      
      @media (max-width: 768px) {
        h1 { font-size: 2.5rem !important; }
        h2 { font-size: 2rem !important; }
        h3 { font-size: 1.5rem !important; }
        
        .container > div {
          grid-template-columns: 1fr !important;
        }
      }
    `
  }
}
