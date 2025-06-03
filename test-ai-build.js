// Test AI Build functionality
async function testAIBuild() {
  console.log('🧪 Testing AI Website Builder...\n')

  const baseUrl = 'http://localhost:3001'

  const testConfig = {
    brandConfig: {
      name: 'Elite Auto Motors',
      tagline: 'Drive Your Dreams',
      industry: 'automotive',
      colors: {
        primary: '#1a365d',
        secondary: '#2b6cb0',
        accent: '#ed8936',
      },
      typography: {
        fontFamily: 'Inter',
      },
      contact: {
        phone: '(555) 987-6543',
        email: 'sales@eliteautomotors.com',
        address: {
          street: '789 Motor Way',
          city: 'Las Vegas',
          state: 'NV',
          zip: '89101',
        },
      },
      dealership: {
        dealerLicense: 'NV-2024-AUTO',
        salesHours: {
          weekday: '9 AM - 8 PM',
          saturday: '9 AM - 6 PM',
          sunday: '11 AM - 5 PM',
        },
      },
    },
  }

  try {
    console.log('📤 Sending AI build request...')
    const response = await fetch(`${baseUrl}/api/ai-build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testConfig),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Build failed')
    }

    console.log('✅ AI Website Build Successful!')
    console.log('\n📊 Build Details:')
    console.log('- Output ID:', data.outputId)
    console.log('- Preview URL:', data.previewUrl)
    console.log('- Download URL:', data.downloadUrl)
    console.log('- Industry:', data.brandConfig.industry)
    console.log('- Colors:', data.brandConfig.colors)

    console.log('\n🌐 To view your AI-generated website:')
    console.log(`   Open: ${baseUrl}${data.previewUrl}`)
  } catch (error) {
    console.error('❌ AI Build Test Failed:', error.message)
  }
}

// Run the test
testAIBuild()
