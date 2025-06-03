import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs/promises'
import * as path from 'path'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const outputId = params.id
    const filePath = request.nextUrl.searchParams.get('path')

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    const outputDir = path.join(process.cwd(), 'output', outputId)
    const fullPath = path.join(outputDir, filePath)

    // Security check: ensure the path is within the output directory
    const resolvedPath = path.resolve(fullPath)
    const resolvedOutputDir = path.resolve(outputDir)
    if (!resolvedPath.startsWith(resolvedOutputDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 })
    }

    // Check if file exists
    try {
      await fs.access(fullPath)
    } catch {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Read file content
    const content = await fs.readFile(fullPath, 'utf-8')

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('File read error:', error)
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}
