import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import * as path from 'path'
import { MultiPageEnhancedGenerator } from '@/lib/multi-page-enhanced-generator'
import { BrandConfig } from '@/lib/types'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { brandConfig }: { brandConfig: BrandConfig } = body

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

    logger.info('🤖 Starting AI website generation', { 
      brandName: brandConfig.name,
      industry: brandConfig.industry || 'General',
      outputDir 
    })

    // Use AI to suggest colors if not provided
    if (!brandConfig.colors?.primary) {
      const { AIContentEnhancer } = await import('@/lib/ai-enhancer')
      const aiEnhancer = new AIContentEnhancer()
      const suggestedColors = await aiEnhancer.suggestColorScheme(
        brandConfig.name,
        brandConfig.industry
      )

      brandConfig.colors = {
        ...brandConfig.colors,
        ...suggestedColors,
      }
    }

    // Set default values
    brandConfig.typography = brandConfig.typography || { fontFamily: 'Inter' }
    brandConfig.industry = brandConfig.industry || 'automotive' // Default to automotive for used car dealerships

    // Use multi-page generator for automotive dealerships
    const generator = new MultiPageEnhancedGenerator({
      outputDir,
      brandConfig,
    })

    await generator.generate()

    logger.info('✅ AI website generation complete', { outputId })

    return NextResponse.json({
      success: true,
      outputId,
      message: 'AI-powered multi-page website generated successfully',
      previewUrl: `/preview/${outputId}`,
      downloadUrl: `/api/download/${outputId}`,
      brandConfig,
    })
  } catch (error) {
    logger.error('AI Build error', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      {
        error: 'AI website generation failed',
        success: false,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
