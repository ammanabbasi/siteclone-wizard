export interface BrandConfig {
  name: string
  tagline?: string
  logo?: string
  favicon?: string
  industry?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background?: string
    foreground?: string
  }
  typography: {
    fontFamily?: string
    headingFont?: string
    bodyFont?: string
  }
  contact?: {
    phone?: string
    email?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zip?: string
    }
  }
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  content?: {
    heroTitle?: string
    heroSubtitle?: string
    heroVideo?: string
    features?: Array<{
      title: string
      description: string
      icon?: string
    }>
  }
  dealership?: {
    dealerLicense?: string
    salesHours?: {
      weekday?: string
      saturday?: string
      sunday?: string
    }
    serviceHours?: {
      weekday?: string
      saturday?: string
      sunday?: string
    }
    inventory?: {
      source?: 'manual' | 'api' | 'csv' | 'xml'
      apiUrl?: string
      apiKey?: string
      placeholderCount?: number
    }
    financing?: {
      partners?: string[]
      disclaimer?: string
      creditRange?: string
    }
    services?: string[]
    certifications?: string[]
  }
  customContent?: Record<string, string>
  ai?: {
    enableContent?: boolean
    enableSeo?: boolean
    enableInventory?: boolean
  }
}

export interface CloneConfig {
  targetUrl: string
  brandConfig: BrandConfig
  scrapeDepth?: number
  outputDir?: string
}

export interface CliOptions {
  targetUrl?: string
  config?: string
  scrapeDepth?: number
  output?: string
  verbose?: boolean
}
