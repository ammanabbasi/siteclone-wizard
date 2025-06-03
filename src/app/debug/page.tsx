'use client'

import { useState } from 'react'

export default function DebugPage() {
  const [status, setStatus] = useState<string>('Ready to test')
  const [response, setResponse] = useState<any>(null)

  const testClone = async () => {
    setStatus('Starting test...')
    setResponse(null)

    try {
      setStatus('Sending request to /api/clone...')

      const res = await fetch('/api/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: 'https://example.com',
          brandConfig: {
            name: 'Test Brand',
            tagline: 'Test Tagline',
            colors: {
              primary: '#3B82F6',
              secondary: '#10B981',
              accent: '#F59E0B',
            },
            typography: {
              fontFamily: 'Inter',
            },
          },
        }),
      })

      setStatus(`Response received: ${res.status} ${res.statusText}`)

      const data = await res.json()
      setResponse(data)

      if (data.success) {
        setStatus('✅ Success! Check the response below.')
      } else {
        setStatus('❌ Failed. Check the response for details.')
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Debug Page</h1>

      <div className="mb-4 rounded bg-gray-100 p-4">
        <p className="font-semibold">Status: {status}</p>
      </div>

      <button
        onClick={testClone}
        className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Test Clone API
      </button>

      {response && (
        <div className="rounded bg-gray-100 p-4">
          <h2 className="mb-2 font-bold">Response:</h2>
          <pre className="overflow-auto whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-2 font-bold">What this tests:</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>Sends a POST request to /api/clone</li>
          <li>Uses https://example.com as the target</li>
          <li>Shows the full response from the API</li>
          <li>Displays any errors that occur</li>
        </ul>
      </div>
    </div>
  )
}
