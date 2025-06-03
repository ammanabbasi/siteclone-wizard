'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface FileTree {
  name: string
  type: 'file' | 'directory'
  children?: FileTree[]
  content?: string
}

export default function PreviewPage() {
  const params = useParams()
  const id = params.id as string
  const [fileTree, setFileTree] = useState<FileTree | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFileTree()
  }, [id])

  const fetchFileTree = async () => {
    try {
      const response = await fetch(`/api/preview/${id}`)
      if (!response.ok) {
        throw new Error('Project not found')
      }
      const data = await response.json()
      setFileTree(data)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project')
      setLoading(false)
    }
  }

  const fetchFileContent = async (filePath: string) => {
    try {
      const response = await fetch(`/api/preview/${id}/file?path=${encodeURIComponent(filePath)}`)
      if (!response.ok) {
        throw new Error('Failed to load file')
      }
      const content = await response.text()
      setFileContent(content)
      setSelectedFile(filePath)
    } catch (err) {
      console.error('Error loading file:', err)
    }
  }

  const renderFileTree = (node: FileTree, path: string = ''): JSX.Element => {
    const fullPath = path ? `${path}/${node.name}` : node.name

    if (node.type === 'directory') {
      return (
        <details key={fullPath} open={path === ''}>
          <summary className="cursor-pointer rounded px-2 py-1 hover:bg-gray-100">
            📁 {node.name}
          </summary>
          <div className="ml-4">
            {node.children?.map((child) => renderFileTree(child, fullPath))}
          </div>
        </details>
      )
    }

    const fileIcon =
      node.name.endsWith('.tsx') || node.name.endsWith('.ts')
        ? '📄'
        : node.name.endsWith('.css')
          ? '🎨'
          : node.name.endsWith('.json')
            ? '📋'
            : node.name.endsWith('.md')
              ? '📝'
              : '📄'

    return (
      <div
        key={fullPath}
        className={`flex cursor-pointer items-center rounded px-2 py-1 hover:bg-gray-100 ${
          selectedFile === fullPath ? 'bg-blue-100' : ''
        }`}
        onClick={() => fetchFileContent(fullPath)}
      >
        <span className="mr-2">{fileIcon}</span>
        <span>{node.name}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading project...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-4">
        <div className="mb-4 rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-2 text-2xl font-bold">Project Preview</h1>
          <p className="text-gray-600">Project ID: {id}</p>
          <div className="mt-4 flex gap-4">
            <a
              href={`/api/download/${id}`}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Download Project
            </a>
            <a href="/" className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
              Back to Home
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-md md:col-span-1">
            <h2 className="mb-2 text-lg font-semibold">File Explorer</h2>
            <div className="max-h-[600px] overflow-auto">
              {fileTree && renderFileTree(fileTree)}
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-md md:col-span-2">
            <h2 className="mb-2 text-lg font-semibold">
              {selectedFile ? `File: ${selectedFile}` : 'Select a file to view'}
            </h2>
            {selectedFile && (
              <pre className="max-h-[600px] overflow-auto rounded bg-gray-100 p-4">
                <code className="text-sm">{fileContent}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
