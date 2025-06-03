import { redirect } from 'next/navigation'
import * as path from 'path'
import * as fs from 'fs/promises'

export default async function QuickPreviewPage({ params }: { params: { id: string } }) {
  const outputId = params.id
  const outputDir = path.join(process.cwd(), 'output', outputId)
  const indexPath = path.join(outputDir, 'index.html')

  try {
    // Check if we have a static HTML preview
    await fs.access(indexPath)

    // If we have an index.html, serve it
    const htmlContent = await fs.readFile(indexPath, 'utf-8')

    return (
      <div className="h-screen w-full">
        <div className="flex items-center justify-between bg-gray-900 p-4 text-white">
          <h1 className="text-lg font-semibold">Quick Preview</h1>
          <div className="flex gap-2">
            <a
              href={`/api/download/${outputId}`}
              className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              Download
            </a>
            <a
              href={`/preview/${outputId}`}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Browse Files
            </a>
          </div>
        </div>
        <iframe
          srcDoc={htmlContent}
          className="w-full"
          style={{ height: 'calc(100vh - 64px)' }}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    )
  } catch {
    // If no static preview, redirect to file browser
    redirect(`/preview/${outputId}`)
  }
}
