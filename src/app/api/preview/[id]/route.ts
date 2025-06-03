import { NextRequest, NextResponse } from 'next/server'
import * as fs from 'fs/promises'
import * as path from 'path'

interface FileTree {
  name: string
  type: 'file' | 'directory'
  children?: FileTree[]
}

async function buildFileTree(dirPath: string): Promise<FileTree[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const tree: FileTree[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') {
      continue
    }

    const fullPath = path.join(dirPath, entry.name)

    if (entry.isDirectory()) {
      const children = await buildFileTree(fullPath)
      tree.push({
        name: entry.name,
        type: 'directory',
        children,
      })
    } else {
      tree.push({
        name: entry.name,
        type: 'file',
      })
    }
  }

  return tree.sort((a, b) => {
    // Directories first, then files
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1
    }
    return a.name.localeCompare(b.name)
  })
}

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

    // Build file tree
    const children = await buildFileTree(outputDir)
    const fileTree: FileTree = {
      name: outputId,
      type: 'directory',
      children,
    }

    return NextResponse.json(fileTree)
  } catch (error) {
    console.error('Preview error:', error)
    return NextResponse.json({ error: 'Failed to load project' }, { status: 500 })
  }
}
