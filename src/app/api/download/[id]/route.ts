import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs/promises'
import * as path from 'path'
import archiver from 'archiver'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const outputId = params.id
    const outputDir = path.join(process.cwd(), 'output', outputId)

    // Check if output directory exists
    try {
      await fs.access(outputDir)
    } catch {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    })

    // Handle errors
    archive.on('error', (err) => {
      throw err
    })

    // Create a buffer to store the zip
    const chunks: Buffer[] = []

    archive.on('data', (chunk) => {
      chunks.push(chunk)
    })

    // Wait for the archive to finish
    const archivePromise = new Promise<Buffer>((resolve, reject) => {
      archive.on('end', () => {
        resolve(Buffer.concat(chunks))
      })
      archive.on('error', reject)
    })

    // Add the entire output directory to the zip
    archive.directory(outputDir, false)

    // Finalize the archive
    archive.finalize()

    // Wait for the archive to complete
    const zipBuffer = await archivePromise

    // Return the zip file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="siteclone-${outputId}.zip"`,
        'Content-Length': zipBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Failed to download project' }, { status: 500 })
  }
}
