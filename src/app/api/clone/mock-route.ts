import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetUrl, brandConfig } = body

    if (!targetUrl || !brandConfig) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mock successful response
    const mockResult = {
      success: true,
      outputId: 'mock-' + Date.now(),
      downloadUrl: `/api/download/mock-${Date.now()}`,
      stats: {
        componentsExtracted: 12,
        textNodesFound: 45,
        assetsDownloaded: 8,
      },
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate random failure (20% chance)
    if (Math.random() < 0.2) {
      throw new Error('Failed to scrape website')
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error('Mock clone error:', error)
    return NextResponse.json(
      { error: 'Failed to clone website', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
