import { BrandConfig } from './types'
import { AIContentEnhancer } from './ai-enhancer'

export interface PageConfig {
  path: string
  name: string
  content: string
}

export interface MultiPageWebsite {
  pages: PageConfig[]
  layout: string
  metadata: any
  globalStyles: string
}

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

export class MultiPageDealershipBuilder {
  private aiEnhancer: AIContentEnhancer

  constructor() {
    this.aiEnhancer = new AIContentEnhancer()
  }

  async buildMultiPageDealership(
    brandConfig: DealershipConfig
  ): Promise<MultiPageWebsite> {
    console.log('🚗 Building multi-page dealership website...')

    // Force automotive industry
    brandConfig.industry = 'automotive'

    // Generate all pages
    const pages: PageConfig[] = [
      await this.generateHomePage(brandConfig),
      await this.generateInventoryPage(brandConfig),
      await this.generateFinancingPage(brandConfig),
      await this.generateAboutPage(brandConfig),
      await this.generateServicesPage(brandConfig),
      await this.generateTradeInPage(brandConfig),
      await this.generateContactPage(brandConfig),
    ]

    // Generate layout with navigation
    const layout = await this.generateLayout(brandConfig)

    // Generate SEO metadata
    const metadata = await this.generateDealershipSEO(brandConfig)

    // Generate global styles
    const globalStyles = await this.generateDealershipStyles(brandConfig)

    return {
      pages,
      layout,
      metadata,
      globalStyles,
    }
  }

  private async generateHomePage(brandConfig: DealershipConfig): Promise<PageConfig> {
    return {
      path: 'src/app/page.tsx',
      name: 'Home',
      content: `'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import brandConfig from '@/lib/brand-config.json'

export default function Home() {
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      
      if (link && link.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const targetId = link.getAttribute('href')?.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    
    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section" style={{ background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/placeholder-car-lot.jpg") center/cover', padding: '150px 0', textAlign: 'center', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '20px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            ${brandConfig.name}
          </h1>
          <p style={{ fontSize: '1.8rem', maxWidth: '700px', margin: '0 auto 40px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            ${brandConfig.tagline || 'Quality Pre-Owned Vehicles at Unbeatable Prices'}
          </p>
          <div className="hero-buttons">
            <Link href="/inventory">
              <button style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '18px 50px', border: 'none', borderRadius: '8px', fontSize: '1.2rem', margin: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                View Inventory
              </button>
            </Link>
            <Link href="/financing">
              <button style={{ background: 'transparent', color: 'white', padding: '18px 50px', border: '2px solid white', borderRadius: '8px', fontSize: '1.2rem', margin: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                Get Pre-Approved
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '3rem', color: '${brandConfig.colors.primary}', margin: '0' }}>${brandConfig.dealership.inventory?.placeholderCount || 50}+</h3>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>Vehicles in Stock</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '3rem', color: '${brandConfig.colors.primary}', margin: '0' }}>100%</h3>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>Financing Approval</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '3rem', color: '${brandConfig.colors.primary}', margin: '0' }}>5★</h3>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>Customer Rating</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '3rem', color: '${brandConfig.colors.primary}', margin: '0' }}>10+</h3>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>Years in Business</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Preview */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: '${brandConfig.colors.primary}', marginBottom: '50px' }}>
            Featured Vehicles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '50px' }}>
            {[
              { year: 2022, make: 'Toyota', model: 'Camry', price: '$24,995', mileage: '28,500' },
              { year: 2021, make: 'Honda', model: 'CR-V', price: '$28,995', mileage: '35,200' },
              { year: 2023, make: 'Ford', model: 'F-150', price: '$42,995', mileage: '15,800' },
            ].map((vehicle, index) => (
              <div key={index} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                <div style={{ height: '250px', background: '${brandConfig.colors.primary}20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '5rem' }}>🚗</span>
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '10px' }}>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  <p style={{ color: '#666' }}>{vehicle.mileage} miles</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <span style={{ fontSize: '1.8rem', color: '${brandConfig.colors.accent}', fontWeight: 'bold' }}>{vehicle.price}</span>
                    <Link href="/inventory">
                      <button style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/inventory">
              <button style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '18px 50px', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}>
                View All Inventory
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '80px 0', background: '${brandConfig.colors.primary}10' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', color: '${brandConfig.colors.primary}', marginBottom: '50px' }}>
            Why Choose ${brandConfig.name}?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💰</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Best Prices</h3>
              <p style={{ color: '#666' }}>Competitive pricing on all our quality pre-owned vehicles</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤝</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Easy Financing</h3>
              <p style={{ color: '#666' }}>Work with all credit types to get you approved</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>✓</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Quality Assured</h3>
              <p style={{ color: '#666' }}>Every vehicle is thoroughly inspected and comes with history report</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, ${brandConfig.colors.primary} 0%, ${brandConfig.colors.accent} 100%)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Find Your Perfect Vehicle?</h2>
          <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.9 }}>
            Browse our inventory or get pre-approved for financing today!
          </p>
          <div>
            <Link href="/inventory">
              <button style={{ background: 'white', color: '${brandConfig.colors.primary}', padding: '18px 50px', border: 'none', borderRadius: '8px', fontSize: '1.2rem', margin: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                Browse Inventory
              </button>
            </Link>
            <Link href="/contact">
              <button style={{ background: 'transparent', color: 'white', padding: '18px 50px', border: '2px solid white', borderRadius: '8px', fontSize: '1.2rem', margin: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}`,
    }
  }

  private async generateInventoryPage(brandConfig: DealershipConfig): Promise<PageConfig> {
    return {
      path: 'src/app/inventory/page.tsx',
      name: 'Inventory',
      content: `'use client'

import { useState } from 'react'
import Link from 'next/link'
import brandConfig from '@/lib/brand-config.json'

export default function Inventory() {
  const [filters, setFilters] = useState({
    make: 'all',
    model: 'all',
    year: 'all',
    price: 'all'
  })

  // Generate more placeholder vehicles
  const vehicles = [
    { id: 1, year: 2022, make: 'Toyota', model: 'Camry', price: 24995, mileage: 28500, type: 'Sedan', color: 'Silver' },
    { id: 2, year: 2021, make: 'Honda', model: 'CR-V', price: 28995, mileage: 35200, type: 'SUV', color: 'Black' },
    { id: 3, year: 2023, make: 'Ford', model: 'F-150', price: 42995, mileage: 15800, type: 'Truck', color: 'White' },
    { id: 4, year: 2022, make: 'Chevrolet', model: 'Malibu', price: 22995, mileage: 31000, type: 'Sedan', color: 'Blue' },
    { id: 5, year: 2021, make: 'Nissan', model: 'Rogue', price: 26995, mileage: 29400, type: 'SUV', color: 'Red' },
    { id: 6, year: 2020, make: 'Toyota', model: 'Tacoma', price: 34995, mileage: 42100, type: 'Truck', color: 'Gray' },
    { id: 7, year: 2023, make: 'Honda', model: 'Accord', price: 27995, mileage: 12000, type: 'Sedan', color: 'Black' },
    { id: 8, year: 2022, make: 'Ford', model: 'Explorer', price: 38995, mileage: 25000, type: 'SUV', color: 'Blue' },
    { id: 9, year: 2021, make: 'Chevrolet', model: 'Silverado', price: 39995, mileage: 33000, type: 'Truck', color: 'White' },
  ]

  return (
    <>
      {/* Page Header */}
      <section style={{ background: '${brandConfig.colors.primary}', padding: '80px 0 40px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Our Inventory</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Browse our selection of ${brandConfig.dealership.inventory?.placeholderCount || 50}+ quality pre-owned vehicles
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '40px 0', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '${brandConfig.colors.primary}' }}>Filter Vehicles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <select 
                value={filters.make}
                onChange={(e) => setFilters({...filters, make: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                <option value="all">All Makes</option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="ford">Ford</option>
                <option value="chevrolet">Chevrolet</option>
                <option value="nissan">Nissan</option>
              </select>
              <select 
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                <option value="all">All Years</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
              <select 
                value={filters.price}
                onChange={(e) => setFilters({...filters, price: e.target.value})}
                style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
              >
                <option value="all">All Prices</option>
                <option value="under20">Under $20,000</option>
                <option value="20to30">$20,000 - $30,000</option>
                <option value="30to40">$30,000 - $40,000</option>
                <option value="over40">Over $40,000</option>
              </select>
              <button 
                style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section style={{ padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: '#666' }}>Showing {vehicles.length} vehicles</p>
            <select style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
              <option>Sort by: Year (Newest)</option>
              <option>Sort by: Mileage (Lowest)</option>
            </select>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', transition: 'transform 0.3s' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ height: '250px', background: '${brandConfig.colors.primary}20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '5rem' }}>🚗</span>
                  </div>
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: '${brandConfig.colors.accent}', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                    {vehicle.type}
                  </div>
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '10px', fontSize: '1.4rem' }}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div style={{ color: '#666', marginBottom: '20px' }}>
                    <p style={{ margin: '5px 0' }}>📏 {vehicle.mileage.toLocaleString()} miles</p>
                    <p style={{ margin: '5px 0' }}>🎨 {vehicle.color}</p>
                    <p style={{ margin: '5px 0' }}>✓ Clean CARFAX</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <span style={{ fontSize: '1.8rem', color: '${brandConfig.colors.accent}', fontWeight: 'bold' }}>
                      \${vehicle.price.toLocaleString()}
                    </span>
                    <button style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '10px 25px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More */}
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <button style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '15px 40px', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}>
              Load More Vehicles
            </button>
          </div>
        </div>
      </section>
    </>
  )
}`,
    }
  }

  private async generateFinancingPage(brandConfig: DealershipConfig): Promise<PageConfig> {
    const partners = brandConfig.dealership.financing?.partners || [
      'Capital One',
      'Chase Auto',
      'Wells Fargo',
    ]

    return {
      path: 'src/app/financing/page.tsx',
      name: 'Financing',
      content: `'use client'

import { useState } from 'react'
import brandConfig from '@/lib/brand-config.json'

export default function Financing() {
  const [loanAmount, setLoanAmount] = useState(20000)
  const [downPayment, setDownPayment] = useState(5000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate] = useState(5.9)
  
  const monthlyPayment = () => {
    const principal = loanAmount - downPayment
    const monthlyRate = interestRate / 100 / 12
    const months = loanTerm
    
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return payment.toFixed(2)
  }

  return (
    <>
      {/* Page Header */}
      <section style={{ background: '${brandConfig.colors.primary}', padding: '80px 0 40px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Financing Options</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Get pre-approved in minutes with our easy financing process
          </p>
        </div>
      </section>

      {/* Financing Info */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
            <div>
              <h2 style={{ color: '${brandConfig.colors.primary}', fontSize: '2rem', marginBottom: '30px' }}>
                Flexible Financing for Everyone
              </h2>
              <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '30px', fontSize: '1.1rem' }}>
                ${brandConfig.dealership.financing?.disclaimer || 'We work with all credit types to get you the best financing options available.'}
              </p>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '20px' }}>Why Finance With Us?</h3>
                <div style={{ space: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ color: '${brandConfig.colors.accent}', fontSize: '1.5rem', marginRight: '15px' }}>✓</span>
                    <span style={{ color: '#555' }}>${brandConfig.dealership.financing?.creditRange || 'All Credit Types Welcome'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ color: '${brandConfig.colors.accent}', fontSize: '1.5rem', marginRight: '15px' }}>✓</span>
                    <span style={{ color: '#555' }}>Competitive Interest Rates</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ color: '${brandConfig.colors.accent}', fontSize: '1.5rem', marginRight: '15px' }}>✓</span>
                    <span style={{ color: '#555' }}>Flexible Payment Terms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <span style={{ color: '${brandConfig.colors.accent}', fontSize: '1.5rem', marginRight: '15px' }}>✓</span>
                    <span style={{ color: '#555' }}>Quick Approval Process</span>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '20px' }}>Our Financing Partners</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>
                  We work with trusted lenders to ensure you get the best rates:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                  ${partners
                    .map(
                      (partner) => `
                    <div style={{ background: '#f8f9fa', padding: '10px 20px', borderRadius: '5px', color: '#555' }}>
                      ${partner}
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
              
              <button style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '15px 40px', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}>
                Apply for Pre-Approval
              </button>
            </div>
            
            {/* Calculator */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '30px', fontSize: '1.5rem' }}>
                Payment Calculator
              </h3>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Vehicle Price</label>
                <input 
                  type="number" 
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                />
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Down Payment</label>
                <input 
                  type="number" 
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                />
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Loan Term (months)</label>
                <select 
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                >
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                  <option value="72">72 months</option>
                </select>
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Interest Rate</label>
                <input 
                  type="text" 
                  value={interestRate + '%'}
                  readOnly
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px', background: '#f8f9fa' }}
                />
              </div>
              
              <div style={{ background: '${brandConfig.colors.primary}10', padding: '25px', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ color: '#666', marginBottom: '10px' }}>Estimated Monthly Payment</p>
                <p style={{ fontSize: '3rem', color: '${brandConfig.colors.primary}', fontWeight: 'bold', margin: '0' }}>
                  \${monthlyPayment()}
                </p>
                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
                  *This is an estimate. Actual payment may vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section style={{ padding: '80px 0', background: '${brandConfig.colors.primary}10', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ color: '${brandConfig.colors.primary}', fontSize: '2.5rem', marginBottom: '20px' }}>
            Ready to Get Started?
          </h2>
          <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '40px' }}>
            Apply online in minutes and get pre-approved today!
          </p>
          <button style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '18px 50px', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer' }}>
            Start Your Application
          </button>
        </div>
      </section>
    </>
  )
}`,
    }
  }

  private async generateAboutPage(brandConfig: DealershipConfig): Promise<PageConfig> {
    const aboutContent = await this.aiEnhancer.enhanceContent({
      brandConfig,
      originalContent: '',
      contentType: 'about',
      industry: 'automotive',
    })

    return {
      path: 'src/app/about/page.tsx',
      name: 'About Us',
      content: `export default function About() {
  return (
    <>
      {/* Page Header */}
      <section style={{ background: '${brandConfig.colors.primary}', padding: '80px 0 40px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>About ${brandConfig.name}</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Your trusted partner in finding quality pre-owned vehicles
          </p>
        </div>
      </section>

      {/* About Content */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <h2 style={{ color: '${brandConfig.colors.primary}', fontSize: '2.5rem', marginBottom: '30px' }}>
                Your Trusted Local Dealership
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#555', marginBottom: '30px' }}>
                ${aboutContent}
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#555', marginBottom: '30px' }}>
                We pride ourselves on transparency, fair pricing, and exceptional customer service. 
                Our team is dedicated to helping you find the perfect vehicle that fits your needs and budget.
              </p>
              
              {/* Certifications */}
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '20px' }}>Our Credentials</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  ${
                    brandConfig.dealership.certifications
                      ?.map(
                        (cert) => `
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                      <span style={{ color: '${brandConfig.colors.accent}', marginRight: '10px', fontSize: '1.2rem' }}>✓</span>
                      <span style={{ color: '#555' }}>${cert}</span>
                    </div>
                  `
                      )
                      .join('') || ''
                  }
                </div>
              </div>
            </div>
            
            <div>
              <div style={{ background: '${brandConfig.colors.primary}10', padding: '50px', borderRadius: '10px', textAlign: 'center' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', fontSize: '3rem', marginBottom: '20px' }}>10+</h3>
                <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '40px' }}>Years in Business</p>
                
                <h3 style={{ color: '${brandConfig.colors.primary}', fontSize: '3rem', marginBottom: '20px' }}>5,000+</h3>
                <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '40px' }}>Happy Customers</p>
                
                <h3 style={{ color: '${brandConfig.colors.primary}', fontSize: '3rem', marginBottom: '20px' }}>A+</h3>
                <p style={{ color: '#666', fontSize: '1.2rem' }}>BBB Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', color: '${brandConfig.colors.primary}', fontSize: '2.5rem', marginBottom: '50px' }}>
            Our Core Values
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤝</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Integrity</h3>
              <p style={{ color: '#666' }}>Honest, transparent dealings with every customer</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⭐</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Quality</h3>
              <p style={{ color: '#666' }}>Only the best pre-owned vehicles make it to our lot</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💯</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Service</h3>
              <p style={{ color: '#666' }}>Exceptional customer service before, during, and after the sale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', color: '${brandConfig.colors.primary}', fontSize: '2.5rem', marginBottom: '50px' }}>
            Meet Our Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {[
              { name: 'John Smith', role: 'General Manager', emoji: '👨‍💼' },
              { name: 'Sarah Johnson', role: 'Sales Manager', emoji: '👩‍💼' },
              { name: 'Mike Davis', role: 'Finance Manager', emoji: '👨‍💼' },
              { name: 'Lisa Chen', role: 'Customer Service', emoji: '👩‍💼' },
            ].map((member, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ width: '150px', height: '150px', background: '${brandConfig.colors.primary}20', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                  {member.emoji}
                </div>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '5px' }}>{member.name}</h3>
                <p style={{ color: '#666' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}`,
    }
  }

  private async generateServicesPage(brandConfig: DealershipConfig): Promise<PageConfig> {
    const services = brandConfig.dealership.services || [
      'Vehicle Inspection',
      'Extended Warranties',
      'Trade-In Services',
      'Financing Assistance',
      'Vehicle History Reports',
      'Title & Registration',
    ]

    return {
      path: 'src/app/services/page.tsx',
      name: 'Services',
      content: `export default function Services() {
  return (
    <>
      {/* Page Header */}
      <section style={{ background: '${brandConfig.colors.primary}', padding: '80px 0 40px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Our Services</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Complete automotive solutions for all your needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            ${services
              .map(
                (service, index) => `
              <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                <div style={{ width: '80px', height: '80px', background: '${brandConfig.colors.primary}20', borderRadius: '50%', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '2.5rem', color: '${brandConfig.colors.primary}' }}>
                    ${['🔍', '📋', '🔄', '💳', '📊', '📄'][index % 6]}
                  </span>
                </div>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px', fontSize: '1.5rem' }}>${service}</h3>
                <p style={{ color: '#666', lineHeight: 1.8, marginBottom: '20px' }}>
                  Professional ${service.toLowerCase()} to ensure your complete satisfaction and peace of mind.
                </p>
                <a href="/contact" style={{ color: '${brandConfig.colors.primary}', textDecoration: 'none', fontWeight: 'bold' }}>
                  Learn More →
                </a>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </section>

      {/* Service Hours */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', color: '${brandConfig.colors.primary}', fontSize: '2.5rem', marginBottom: '50px' }}>
            Service Department Hours
          </h2>
          <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              <h4 style={{ color: '${brandConfig.colors.primary}', marginBottom: '10px' }}>Monday - Friday</h4>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>${brandConfig.dealership.serviceHours?.weekday || '7:00 AM - 6:00 PM'}</p>
            </div>
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              <h4 style={{ color: '${brandConfig.colors.primary}', marginBottom: '10px' }}>Saturday</h4>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>${brandConfig.dealership.serviceHours?.saturday || '8:00 AM - 4:00 PM'}</p>
            </div>
            <div>
              <h4 style={{ color: '${brandConfig.colors.primary}', marginBottom: '10px' }}>Sunday</h4>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>${brandConfig.dealership.serviceHours?.sunday || 'Closed'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service CTA */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, ${brandConfig.colors.primary} 0%, ${brandConfig.colors.accent} 100%)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Need Service or Maintenance?</h2>
          <p style={{ fontSize: '1.3rem', marginBottom: '40px', opacity: 0.9 }}>
            Schedule your appointment today and experience our professional service
          </p>
          <button style={{ background: 'white', color: '${brandConfig.colors.primary}', padding: '18px 50px', border: 'none', borderRadius: '8px', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Schedule Service
          </button>
        </div>
      </section>
    </>
  )
}`,
    }
  }

  private async generateTradeInPage(brandConfig: DealershipConfig): Promise<PageConfig> {
    return {
      path: 'src/app/trade-in/page.tsx',
      name: 'Trade-In',
      content: `'use client'

import { useState } from 'react'
import brandConfig from '@/lib/brand-config.json'

export default function TradeIn() {
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    condition: 'excellent',
    name: '',
    email: '',
    phone: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Trade-in request submitted! We will contact you soon with an offer.')
  }

  return (
    <>
      {/* Page Header */}
      <section style={{ background: '${brandConfig.colors.primary}', padding: '80px 0 40px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Trade In Your Vehicle</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Get top dollar for your current vehicle
          </p>
        </div>
      </section>

      {/* Trade-In Benefits */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ color: '${brandConfig.colors.primary}', fontSize: '2.5rem', marginBottom: '20px' }}>
              Why Trade With Us?
            </h2>
            <p style={{ color: '#666', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
              We make trading in your vehicle easy and rewarding
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💰</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Top Dollar Offers</h3>
              <p style={{ color: '#666' }}>We offer competitive prices for your trade-in</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚡</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Instant Evaluation</h3>
              <p style={{ color: '#666' }}>Get your trade-in value in minutes</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚗</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>All Vehicles Accepted</h3>
              <p style={{ color: '#666' }}>We accept all makes, models, and conditions</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Simple Process</h3>
              <p style={{ color: '#666' }}>Easy paperwork and hassle-free transaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trade-In Form */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ background: 'white', padding: '50px', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '${brandConfig.colors.primary}', fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>
              Get Your Trade-In Value
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '20px' }}>Vehicle Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Year</label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      placeholder="2020"
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Make</label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => setFormData({...formData, make: e.target.value})}
                      placeholder="Toyota"
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      placeholder="Camry"
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Mileage</label>
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      placeholder="50000"
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Condition</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({...formData, condition: e.target.value})}
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '20px' }}>Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                style={{ width: '100%', background: '${brandConfig.colors.primary}', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Get My Trade-In Value
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}`,
    }
  }

  private async generateContactPage(brandConfig: DealershipConfig): Promise<PageConfig> {
    return {
      path: 'src/app/contact/page.tsx',
      name: 'Contact',
      content: `'use client'

import { useState } from 'react'
import brandConfig from '@/lib/brand-config.json'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    reason: 'general'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for contacting us! We will get back to you soon.')
  }

  return (
    <>
      {/* Page Header */}
      <section style={{ background: '${brandConfig.colors.primary}', padding: '80px 0 40px', color: 'white' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Contact Us</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            We're here to help you find your perfect vehicle
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            {/* Contact Form */}
            <div>
              <h2 style={{ color: '${brandConfig.colors.primary}', fontSize: '2rem', marginBottom: '30px' }}>
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Reason for Contact</label>
                  <select
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="vehicle">Vehicle Inquiry</option>
                    <option value="financing">Financing Question</option>
                    <option value="service">Service Department</option>
                    <option value="parts">Parts Department</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', color: '#666', marginBottom: '8px' }}>Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    required
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', resize: 'vertical' }}
                  />
                </div>
                
                <button
                  type="submit"
                  style={{ background: '${brandConfig.colors.primary}', color: 'white', padding: '15px 40px', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                  Send Message
                </button>
              </form>
            </div>
            
            {/* Contact Details */}
            <div>
              <h2 style={{ color: '${brandConfig.colors.primary}', fontSize: '2rem', marginBottom: '30px' }}>
                Get In Touch
              </h2>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>📍 Visit Our Dealership</h3>
                <p style={{ color: '#666', lineHeight: 1.8 }}>
                  ${brandConfig.contact?.address?.street || '123 Main Street'}<br />
                  ${brandConfig.contact?.address?.city || 'Springfield'}, ${brandConfig.contact?.address?.state || 'IL'} ${brandConfig.contact?.address?.zip || '62701'}
                </p>
              </div>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>📞 Call Us</h3>
                <p style={{ color: '#666', fontSize: '1.2rem' }}>
                  <a href="tel:${brandConfig.contact?.phone?.replace(/\D/g, '')}" style={{ color: '${brandConfig.colors.primary}', textDecoration: 'none' }}>
                    ${brandConfig.contact?.phone || '(555) 123-4567'}
                  </a>
                </p>
              </div>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>📧 Email Us</h3>
                <p style={{ color: '#666' }}>
                  <a href="mailto:${brandConfig.contact?.email}" style={{ color: '${brandConfig.colors.primary}', textDecoration: 'none' }}>
                    ${brandConfig.contact?.email || 'info@dealership.com'}
                  </a>
                </p>
              </div>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '20px' }}>🕐 Hours of Operation</h3>
                
                <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px' }}>
                  <h4 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Sales Department</h4>
                  <p style={{ color: '#666', marginBottom: '8px' }}>${brandConfig.dealership.salesHours?.weekday || 'Monday - Friday: 9:00 AM - 8:00 PM'}</p>
                  <p style={{ color: '#666', marginBottom: '8px' }}>${brandConfig.dealership.salesHours?.saturday || 'Saturday: 9:00 AM - 6:00 PM'}</p>
                  <p style={{ color: '#666' }}>${brandConfig.dealership.salesHours?.sunday || 'Sunday: 11:00 AM - 5:00 PM'}</p>
                </div>
                
                <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '8px', marginTop: '15px' }}>
                  <h4 style={{ color: '${brandConfig.colors.primary}', marginBottom: '15px' }}>Service Department</h4>
                  <p style={{ color: '#666', marginBottom: '8px' }}>${brandConfig.dealership.serviceHours?.weekday || 'Monday - Friday: 7:00 AM - 6:00 PM'}</p>
                  <p style={{ color: '#666', marginBottom: '8px' }}>${brandConfig.dealership.serviceHours?.saturday || 'Saturday: 8:00 AM - 4:00 PM'}</p>
                  <p style={{ color: '#666' }}>${brandConfig.dealership.serviceHours?.sunday || 'Closed'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 style={{ textAlign: 'center', color: '${brandConfig.colors.primary}', fontSize: '2.5rem', marginBottom: '50px' }}>
            Find Us
          </h2>
          <div style={{ background: '${brandConfig.colors.primary}20', height: '400px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📍</div>
              <h3 style={{ color: '${brandConfig.colors.primary}', marginBottom: '10px' }}>Interactive Map</h3>
              <p style={{ color: '#666' }}>Map integration would go here</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}`,
    }
  }

  private async generateLayout(brandConfig: DealershipConfig): Promise<string> {
    return `import type { Metadata } from 'next'
import Link from 'next/link'
import brandConfig from '@/lib/brand-config.json'

export const metadata: Metadata = {
  title: '${brandConfig.name} - ${brandConfig.tagline || 'Quality Pre-Owned Vehicles'}',
  description: '${brandConfig.tagline || 'Find your perfect pre-owned vehicle at ' + brandConfig.name}',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'${brandConfig.typography.fontFamily}', sans-serif" }}>
        {/* Navigation */}
        <nav style={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 1000 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h2 style={{ color: '${brandConfig.colors.primary}', fontSize: '1.8rem', margin: 0 }}>
                ${brandConfig.name}
              </h2>
            </Link>
            
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <Link href="/" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
              <Link href="/inventory" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Inventory</Link>
              <Link href="/financing" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Financing</Link>
              <Link href="/trade-in" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Trade-In</Link>
              <Link href="/about" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>About</Link>
              <Link href="/services" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Services</Link>
              <Link href="/contact" style={{ color: '#333', textDecoration: 'none', fontWeight: '500' }}>Contact</Link>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <a href="tel:${brandConfig.contact?.phone?.replace(/\D/g, '')}" style={{ color: '${brandConfig.colors.primary}', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                📞 ${brandConfig.contact?.phone || '(555) 123-4567'}
              </a>
            </div>
          </div>
        </nav>
        
        <main>{children}</main>
        
        {/* Footer */}
        <footer style={{ background: '#1a1a1a', color: 'white', padding: '60px 0 30px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>${brandConfig.name}</h3>
                <p style={{ color: '#999', lineHeight: 1.8 }}>
                  ${brandConfig.tagline || 'Your trusted dealership for quality pre-owned vehicles'}
                </p>
                <p style={{ color: '#999', marginTop: '15px' }}>
                  Dealer License: ${brandConfig.dealership.dealerLicense || 'DL-12345'}
                </p>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href="/inventory" style={{ color: '#999', textDecoration: 'none' }}>Browse Inventory</Link>
                  <Link href="/financing" style={{ color: '#999', textDecoration: 'none' }}>Financing Options</Link>
                  <Link href="/trade-in" style={{ color: '#999', textDecoration: 'none' }}>Trade-In Value</Link>
                  <Link href="/services" style={{ color: '#999', textDecoration: 'none' }}>Our Services</Link>
                </div>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '20px' }}>Contact Info</h4>
                <p style={{ color: '#999', marginBottom: '10px' }}>
                  ${brandConfig.contact?.address?.street || '123 Main Street'}<br />
                  ${brandConfig.contact?.address?.city || 'Springfield'}, ${brandConfig.contact?.address?.state || 'IL'} ${brandConfig.contact?.address?.zip || '62701'}
                </p>
                <p style={{ color: '#999', marginBottom: '10px' }}>
                  <a href="tel:${brandConfig.contact?.phone?.replace(/\D/g, '')}" style={{ color: '#999', textDecoration: 'none' }}>
                    ${brandConfig.contact?.phone || '(555) 123-4567'}
                  </a>
                </p>
                <p style={{ color: '#999' }}>
                  <a href="mailto:${brandConfig.contact?.email}" style={{ color: '#999', textDecoration: 'none' }}>
                    ${brandConfig.contact?.email || 'info@dealership.com'}
                  </a>
                </p>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '20px' }}>Hours</h4>
                <p style={{ color: '#999', marginBottom: '8px' }}>
                  <strong>Sales:</strong><br />
                  ${brandConfig.dealership.salesHours?.weekday || 'Mon-Fri: 9AM-8PM'}<br />
                  ${brandConfig.dealership.salesHours?.saturday || 'Sat: 9AM-6PM'}<br />
                  ${brandConfig.dealership.salesHours?.sunday || 'Sun: 11AM-5PM'}
                </p>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid #333', paddingTop: '30px', textAlign: 'center', color: '#666' }}>
              <p>© ${new Date().getFullYear()} ${brandConfig.name}. All rights reserved. | Powered by Auto Dealer Website Builder</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}`
  }

  private async generateDealershipSEO(brandConfig: DealershipConfig) {
    return {
      title: `${brandConfig.name} - ${brandConfig.tagline || 'Quality Pre-Owned Vehicles'}`,
      description: `Visit ${brandConfig.name} for the best selection of quality pre-owned vehicles. ${brandConfig.dealership.financing?.creditRange || 'All credit types welcome'}. Located in ${brandConfig.contact?.address?.city || 'your area'}.`,
      keywords: [
        'used cars',
        'pre-owned vehicles',
        'auto dealership',
        brandConfig.name,
        brandConfig.contact?.address?.city || 'local',
        'car financing',
        'trade-in',
        ...(brandConfig.dealership.certifications || []),
      ],
    }
  }

  private async generateDealershipStyles(brandConfig: DealershipConfig): Promise<string> {
    return `
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: '${brandConfig.typography.fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      a {
        color: ${brandConfig.colors.primary};
        transition: color 0.3s ease;
      }
      
      a:hover {
        color: ${brandConfig.colors.accent};
      }
      
      button {
        transition: all 0.3s ease;
        font-weight: 600;
      }
      
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
      }
      
      /* Mobile Responsive */
      @media (max-width: 768px) {
        nav > div {
          flex-direction: column;
          height: auto !important;
          padding: 20px !important;
        }
        
        nav > div > div {
          flex-direction: column;
          width: 100%;
          text-align: center;
          gap: 15px !important;
        }
        
        h1 {
          font-size: 2.5rem !important;
        }
        
        .grid {
          grid-template-columns: 1fr !important;
        }
      }
    `
  }
}
