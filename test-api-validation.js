// Test API validation

async function testValidation() {
  console.log('Testing SiteClone Wizard API Validation\n')

  // Test 1: Invalid URL
  console.log('1. Testing invalid URL:')
  try {
    const response1 = await fetch('http://localhost:3000/api/clone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl: 'not-a-valid-url',
        brandConfig: {
          name: 'Test',
          colors: { primary: '#FF0000', secondary: '#00FF00', accent: '#0000FF' },
          typography: { fontFamily: 'Inter' },
        },
      }),
    })
    const data1 = await response1.json()
    console.log(`   Status: ${response1.status}`)
    console.log(`   Error: ${data1.error}`)
  } catch (error) {
    console.log('   Request failed:', error.message)
  }

  // Test 2: Invalid hex color
  console.log('\n2. Testing invalid hex color:')
  try {
    const response2 = await fetch('http://localhost:3000/api/clone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl: 'https://example.com',
        brandConfig: {
          name: 'Test',
          colors: { primary: '#GGGGGG', secondary: '#00FF00', accent: '#0000FF' },
          typography: { fontFamily: 'Inter' },
        },
      }),
    })
    const data2 = await response2.json()
    console.log(`   Status: ${response2.status}`)
    console.log(`   Error: ${data2.error}`)
  } catch (error) {
    console.log('   Request failed:', error.message)
  }

  // Test 3: Brand name too long
  console.log('\n3. Testing brand name too long:')
  try {
    const response3 = await fetch('http://localhost:3000/api/clone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl: 'https://example.com',
        brandConfig: {
          name: 'A'.repeat(101), // 101 characters
          colors: { primary: '#FF0000', secondary: '#00FF00', accent: '#0000FF' },
          typography: { fontFamily: 'Inter' },
        },
      }),
    })
    const data3 = await response3.json()
    console.log(`   Status: ${response3.status}`)
    console.log(`   Error: ${data3.error}`)
  } catch (error) {
    console.log('   Request failed:', error.message)
  }

  // Test 4: Valid request
  console.log('\n4. Testing valid request:')
  try {
    const response4 = await fetch('http://localhost:3000/api/clone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl: 'https://example.com',
        brandConfig: {
          name: 'My Test Brand',
          colors: { primary: '#FF0000', secondary: '#00FF00', accent: '#0000FF' },
          typography: { fontFamily: 'Inter' },
        },
      }),
    })
    const data4 = await response4.json()
    console.log(`   Status: ${response4.status}`)
    if (data4.success) {
      console.log(`   Success! Output ID: ${data4.outputId}`)
      console.log(`   Components: ${data4.stats.componentsExtracted}`)
      console.log(`   Text nodes: ${data4.stats.textNodesFound}`)
      console.log(`   Assets: ${data4.stats.assetsDownloaded}`)
    } else {
      console.log(`   Error: ${data4.error}`)
    }
  } catch (error) {
    console.log('   Request failed:', error.message)
  }
}

testValidation()
