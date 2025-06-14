import OpenAI from 'openai'
import { BrandConfig } from './types'
import { logger } from './logger'

export interface AIEnhancementOptions {
  brandConfig: BrandConfig
  originalContent: string
  contentType: 'hero' | 'about' | 'services' | 'testimonial' | 'general'
  industry?: string
}

export class AIContentEnhancer {
  private openai: OpenAI | null = null

  constructor() {
    // Initialize OpenAI only if API key is available
    const apiKey = process.env.OPENAI_API_KEY
    if (apiKey && apiKey !== 'your-openai-api-key-here') {
      this.openai = new OpenAI({
        apiKey: apiKey,
      })
    }
  }

  async enhanceContent(options: AIEnhancementOptions): Promise<string> {
    if (!this.openai) {
      logger.warn('OpenAI not configured, returning default content')
      return this.getDefaultContent(options)
    }

    try {
      const prompt = this.buildPrompt(options)

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional content writer specializing in brand-appropriate web content. Generate concise, engaging content that matches the brand voice.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      })

      return completion.choices[0]?.message?.content || this.getDefaultContent(options)
    } catch (error) {
      logger.error('AI content generation failed:', error)
      return this.getDefaultContent(options)
    }
  }

  async suggestColorScheme(
    brandName: string,
    industry?: string
  ): Promise<{
    primary: string
    secondary: string
    accent: string
  }> {
    if (!this.openai) {
      return this.getDefaultColors(industry)
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional UI/UX designer. Suggest a modern, accessible color scheme for brands. Return ONLY a JSON object with hex color codes.',
          },
          {
            role: 'user',
            content: `Suggest a professional color scheme for "${brandName}"${industry ? ` in the ${industry} industry` : ''}. Return JSON with primary, secondary, and accent hex colors.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 100,
      })

      const response = completion.choices[0]?.message?.content || '{}'
      const colors = JSON.parse(response)

      return {
        primary: colors.primary || '#2563EB',
        secondary: colors.secondary || '#DC2626',
        accent: colors.accent || '#10B981',
      }
    } catch (error) {
      logger.error('AI color suggestion failed:', error)
      return this.getDefaultColors(industry)
    }
  }

  async generateSEOContent(brandConfig: BrandConfig, pageType: string = 'home') {
    if (!this.openai) {
      // Return default SEO content
      return {
        title: `${brandConfig.name} - ${brandConfig.tagline || 'Welcome'}`,
        description: `Welcome to ${brandConfig.name}. ${brandConfig.tagline || 'Your trusted partner for excellence.'}`,
        keywords: [
          brandConfig.name,
          brandConfig.industry || 'business',
          'professional',
          'quality',
          'service',
        ],
      }
    }

    try {
      const prompt = `Generate SEO metadata for a ${pageType} page for ${brandConfig.name}, a ${brandConfig.industry || 'business'} company.
      ${brandConfig.tagline ? `Tagline: ${brandConfig.tagline}` : ''}
      
      Return a JSON object with:
      - title: SEO-optimized page title (60 characters max)
      - description: Meta description (155 characters max)
      - keywords: Array of 5-8 relevant keywords`

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an SEO expert. Generate optimized metadata.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content
      if (content) {
        try {
          const seoData = JSON.parse(content)
          // Ensure keywords is an array
          if (!Array.isArray(seoData.keywords)) {
            seoData.keywords =
              typeof seoData.keywords === 'string'
                ? seoData.keywords.split(',').map((k: string) => k.trim())
                : [brandConfig.name, brandConfig.industry || 'business']
          }
          return seoData
        } catch (e) {
          // Return default if parsing fails
          return {
            title: `${brandConfig.name} - ${brandConfig.tagline || 'Welcome'}`,
            description: `Welcome to ${brandConfig.name}. ${brandConfig.tagline || 'Your trusted partner for excellence.'}`,
            keywords: [
              brandConfig.name,
              brandConfig.industry || 'business',
              'professional',
              'quality',
              'service',
            ],
          }
        }
      }
    } catch (error) {
      logger.error('SEO generation error:', error)
    }

    // Return default SEO content
    return {
      title: `${brandConfig.name} - ${brandConfig.tagline || 'Welcome'}`,
      description: `Welcome to ${brandConfig.name}. ${brandConfig.tagline || 'Your trusted partner for excellence.'}`,
      keywords: [
        brandConfig.name,
        brandConfig.industry || 'business',
        'professional',
        'quality',
        'service',
      ],
    }
  }

  async generateCarInventoryDescriptions(
    make: string,
    model: string,
    year: number
  ): Promise<string> {
    if (!this.openai) {
      return `${year} ${make} ${model} - Quality pre-owned vehicle in excellent condition.`
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an automotive sales expert. Write compelling, brief vehicle descriptions.',
          },
          {
            role: 'user',
            content: `Write a 2-sentence sales description for a ${year} ${make} ${model}.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 60,
      })

      return (
        completion.choices[0]?.message?.content ||
        `${year} ${make} ${model} - Quality pre-owned vehicle.`
      )
    } catch (error) {
      logger.error('AI inventory description failed:', error)
      return `${year} ${make} ${model} - Quality pre-owned vehicle in excellent condition.`
    }
  }

  private buildPrompt(options: AIEnhancementOptions): string {
    const { brandConfig, contentType, industry } = options

    switch (contentType) {
      case 'hero':
        return `Write a compelling hero section headline and subheadline for ${brandConfig.name}${industry ? `, a ${industry} company` : ''}. ${brandConfig.tagline ? `Their tagline is: ${brandConfig.tagline}` : ''}`

      case 'about':
        return `Write a brief "About Us" paragraph (3-4 sentences) for ${brandConfig.name}${industry ? `, a ${industry} company` : ''}. Focus on trust, experience, and customer value.`

      case 'services':
        return `List 3-4 key services offered by ${brandConfig.name}${industry ? `, a ${industry} company` : ''}. Format as short bullet points.`

      case 'testimonial':
        return `Write a realistic customer testimonial for ${brandConfig.name}${industry ? `, a ${industry} company` : ''}. Keep it authentic and specific.`

      default:
        return `Write appropriate web content for ${brandConfig.name}. Keep it professional and engaging.`
    }
  }

  private getDefaultContent(options: AIEnhancementOptions): string {
    const { brandConfig, contentType } = options

    switch (contentType) {
      case 'hero':
        return `Welcome to ${brandConfig.name}\n${brandConfig.tagline || 'Your trusted partner for excellence'}`
      case 'about':
        return `${brandConfig.name} is dedicated to providing exceptional service and quality to our customers. With years of experience and a commitment to excellence, we're here to meet your needs.`
      case 'services':
        return '• Professional Service\n• Quality Products\n• Expert Support\n• Customer Satisfaction'
      case 'testimonial':
        return `"${brandConfig.name} provided excellent service. Highly recommended!"`
      default:
        return `Quality service from ${brandConfig.name}`
    }
  }

  private getDefaultColors(industry?: string): {
    primary: string
    secondary: string
    accent: string
  } {
    // Industry-specific default colors
    const industryColors: Record<string, { primary: string; secondary: string; accent: string }> = {
      automotive: { primary: '#1E40AF', secondary: '#DC2626', accent: '#059669' },
      technology: { primary: '#2563EB', secondary: '#7C3AED', accent: '#06B6D4' },
      healthcare: { primary: '#0891B2', secondary: '#0D9488', accent: '#10B981' },
      finance: { primary: '#1E3A8A', secondary: '#166534', accent: '#EA580C' },
      retail: { primary: '#DC2626', secondary: '#9333EA', accent: '#F59E0B' },
    }

    return (
      industryColors[industry?.toLowerCase() || ''] || {
        primary: '#2563EB',
        secondary: '#DC2626',
        accent: '#10B981',
      }
    )
  }
}
