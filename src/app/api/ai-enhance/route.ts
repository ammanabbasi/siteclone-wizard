import { NextRequest, NextResponse } from 'next/server'
import { AIContentEnhancer } from '@/lib/ai-enhancer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, brandConfig, contentType, industry, text } = body

    const aiEnhancer = new AIContentEnhancer()

    switch (action) {
      case 'enhance-content': {
        const enhancedContent = await aiEnhancer.enhanceContent({
          brandConfig,
          originalContent: text || '',
          contentType: contentType || 'general',
          industry,
        })

        return NextResponse.json({
          success: true,
          content: enhancedContent,
        })
      }

      case 'suggest-colors': {
        const colors = await aiEnhancer.suggestColorScheme(brandConfig.name, industry)

        return NextResponse.json({
          success: true,
          colors,
        })
      }

      case 'generate-seo': {
        const seo = await aiEnhancer.generateSEOContent(brandConfig, contentType || 'home')

        return NextResponse.json({
          success: true,
          seo,
        })
      }

      case 'generate-inventory-description': {
        const { make, model, year } = body
        const description = await aiEnhancer.generateCarInventoryDescriptions(make, model, year)

        return NextResponse.json({
          success: true,
          description,
        })
      }

      default:
        return NextResponse.json(
          {
            error: 'Invalid action',
            success: false,
          },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI Enhancement error:', error)
    return NextResponse.json(
      {
        error: 'AI enhancement failed',
        success: false,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
