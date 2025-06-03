import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'
import { BrandConfig } from '@/lib/types'
import { MultiPageEnhancedGenerator } from '@/lib/multi-page-enhanced-generator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { brandConfig, inspirationUrl }: { brandConfig: BrandConfig; inspirationUrl?: string } =
      body

    // Validate required fields
    if (!brandConfig?.name) {
      return NextResponse.json(
        {
          error: 'Brand name is required',
          success: false,
        },
        { status: 400 }
      )
    }

    // Generate unique output ID
    const outputId = uuidv4()
    const outputDir = path.join(process.cwd(), 'output', outputId)

    console.log('🚗 Starting AI-inspired dealership website generation')
    console.log('Dealership:', brandConfig.name)
    console.log('Inspiration URL:', inspirationUrl || 'None (pure AI generation)')
    console.log('Output directory:', outputDir)

    // Use AI to suggest colors if not provided
    if (!brandConfig.colors?.primary) {
      const { AIContentEnhancer } = await import('@/lib/ai-enhancer')
      const aiEnhancer = new AIContentEnhancer()
      const suggestedColors = await aiEnhancer.suggestColorScheme(brandConfig.name, 'automotive')

      brandConfig.colors = {
        ...brandConfig.colors,
        ...suggestedColors,
      }
    }

    // Set default values
    brandConfig.typography = brandConfig.typography || { fontFamily: 'Inter' }
    brandConfig.industry = 'automotive' // Always automotive for dealerships

    // Create inspiration data based on URL (conceptual, not actual scraping)
    let inspirationData = null
    if (inspirationUrl) {
      try {
        console.log('🌐 Using URL as design inspiration...')

        // Use AI to imagine what a dealership site at this URL might look like
        // This is conceptual inspiration, not actual scraping
        inspirationData = {
          conceptUrl: inspirationUrl,
          suggestedStyle:
            inspirationUrl.includes('luxury') || inspirationUrl.includes('premium')
              ? 'luxury'
              : inspirationUrl.includes('budget') || inspirationUrl.includes('value')
                ? 'value-focused'
                : 'professional',
          // AI will use this as a hint for the type of dealership website to generate
          designHints: [
            'modern-layout',
            'inventory-focused',
            'customer-testimonials',
            'financing-calculator',
          ],
        }

        console.log('✅ Inspiration concept prepared')
      } catch (error) {
        console.warn(
          'Warning: Could not process inspiration URL, proceeding with pure AI generation',
          error
        )
      }
    }

    // Use multi-page generator
    console.log('🤖 Building AI-powered multi-page dealership website...')
    const generator = new MultiPageEnhancedGenerator({
      outputDir,
      brandConfig,
    })

    await generator.generate(inspirationData)

    console.log('✅ AI-inspired dealership website generation complete')

    return NextResponse.json({
      success: true,
      outputId,
      message: 'AI-powered multi-page dealership website generated successfully',
      previewUrl: `/preview/${outputId}`,
      downloadUrl: `/api/download/${outputId}`,
      brandConfig,
      inspirationUsed: !!inspirationUrl,
    })
  } catch (error) {
    console.error('AI Inspire error:', error)
    return NextResponse.json(
      {
        error: 'AI-inspired website generation failed',
        success: false,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
