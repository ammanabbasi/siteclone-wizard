'use client'

import { useState } from 'react'

export default function TestPage() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  const handleClick = () => {
    setCount(count + 1)
    setMessage(`Button clicked ${count + 1} times`)
    // eslint-disable-next-line no-console
    console.log('Button clicked!', count + 1)
  }

  const testApi = async () => {
    // eslint-disable-next-line no-console
    console.log('Testing API...')
    try {
      const response = await fetch('/api/test-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://example.com' }),
      })
      const data = await response.json()
      setMessage(`API Response: ${JSON.stringify(data.success)}`)
      // eslint-disable-next-line no-console
      console.log('API Response:', data)
    } catch (error) {
      setMessage(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      // eslint-disable-next-line no-console
      console.error('API Error:', error)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Page</h1>
      <p>If you can see this and the button works, React is working!</p>

      <button
        onClick={handleClick}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '10px',
        }}
      >
        Click Me ({count})
      </button>

      <button
        onClick={testApi}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Test API
      </button>

      <p style={{ marginTop: '20px', color: '#333' }}>{message}</p>
    </div>
  )
}
