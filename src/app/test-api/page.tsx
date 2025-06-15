'use client'

export default function TestAPI() {
  const testAPI = async () => {
    // eslint-disable-next-line no-console
    console.log('Testing API...')
    try {
      const response = await fetch('/api/clone', {
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

      // eslint-disable-next-line no-console
      console.log('Response status:', response.status)
      const data = await response.json()
      // eslint-disable-next-line no-console
      console.log('Response data:', data)
      // eslint-disable-next-line no-console
      console.log('API Response:', data)
      alert('API Success! Check console for response')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('API Error:', error)
      alert('API Error: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">API Test Page</h1>
      <button
        onClick={testAPI}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Test API
      </button>
      <p className="mt-4 text-sm text-gray-600">Open the browser console (F12) to see the logs</p>
    </div>
  )
}
