// Test AI features
async function testAIFeatures() {
  console.log('🧪 Testing AI Features...\n')

  const baseUrl = 'http://localhost:3000'

  // Test 1: Color Suggestions
  console.log('1️⃣ Testing AI Color Suggestions...')
  try {
    const colorResponse = await fetch(`${baseUrl}/api/ai-enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'suggest-colors',
        brandConfig: { name: 'SmartAuto Dealership' },
        industry: 'automotive',
      }),
    })

    const colorData = await colorResponse.json()
    console.log('Color suggestions:', colorData)
  } catch (error) {
    console.error('Color test failed:', error.message)
  }

  // Test 2: Content Generation
  console.log('\n2️⃣ Testing AI Content Generation...')
  try {
    const contentResponse = await fetch(`${baseUrl}/api/ai-enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'enhance-content',
        brandConfig: {
          name: 'SmartAuto Dealership',
          tagline: 'Your trusted automotive partner',
        },
        contentType: 'hero',
        industry: 'automotive',
      }),
    })

    const contentData = await contentResponse.json()
    console.log('Generated hero content:', contentData)
  } catch (error) {
    console.error('Content test failed:', error.message)
  }

  // Test 3: Car Description
  console.log('\n3️⃣ Testing AI Car Description...')
  try {
    const carResponse = await fetch(`${baseUrl}/api/ai-enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate-inventory-description',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
      }),
    })

    const carData = await carResponse.json()
    console.log('Generated car description:', carData)
  } catch (error) {
    console.error('Car description test failed:', error.message)
  }

  // Test 4: SEO Generation
  console.log('\n4️⃣ Testing AI SEO Generation...')
  try {
    const seoResponse = await fetch(`${baseUrl}/api/ai-enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate-seo',
        brandConfig: {
          name: 'SmartAuto Dealership',
          tagline: 'Your trusted automotive partner',
        },
        contentType: 'home',
      }),
    })

    const seoData = await seoResponse.json()
    console.log('Generated SEO data:', seoData)
  } catch (error) {
    console.error('SEO test failed:', error.message)
  }

  console.log('\n✅ AI Feature tests complete!')
}

// Run tests
testAIFeatures()
